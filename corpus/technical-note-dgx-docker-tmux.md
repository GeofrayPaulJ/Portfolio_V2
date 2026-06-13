# Containerising Persistent GPU Training on DGX A100 with Docker and tmux

**Date:** May 2026 · **6 min read** · `MLOps` `Infrastructure` `DGX A100` `Docker`

---

## The Problem

Running multi-day deep learning training jobs on shared HPC infrastructure has one silent killer: the SSH session.

Close your terminal. Lose your job.

This is not a theoretical problem. On a DGX A100 system running nnU-Net V2 on gigapixel whole slide image patches, a training run can span 12–48 hours. Any network interruption, accidental terminal closure, or laptop sleep event kills the process immediately. You lose hours of compute time on hardware that other researchers are waiting to use.

The solution sounds simple — and it is, once the pieces are assembled correctly. This is the exact setup I use for persistent GPU training on an NVIDIA DGX A100 cluster with 640GB aggregate VRAM.

---

## The Hardware Context

The DGX A100 is an 8-GPU system. Each GPU carries 80GB of HBM2e memory — purpose-built for the kind of high-resolution data loading that gigapixel pathology pipelines demand. Each researcher is allocated one GPU (80GB), managed by the system administrator.

Access is not direct. The sysadmin provisions a Docker container from the NVIDIA NGC registry — specifically `nvcr.io/nvidia/pytorch:25.12-py3` — and assigns it a host IP, port, and password. The container is always running. You SSH into it directly:

```bash
ssh user@<host-ip> -p <assigned-port>
```

This is an important distinction from spinning up your own containers: **you are SSHing into a persistent container, not a bare host.** The container is your entire environment. Everything you install, every model checkpoint, every dataset — it lives inside that container or on a mounted volume.

---

## Volume Mounting: Separating Data from the Container

The first thing to configure after getting access is a volume mount. Container filesystems are ephemeral by design — if the container is ever rebuilt or replaced by the sysadmin, anything not on a mounted volume is gone.

The workspace is mounted at `/workspace`, mapped to persistent storage on the host. All training data, model weights, and outputs write here:

```bash
# Typical training output path inside container
/workspace/nnUNet_results/
/workspace/nnUNet_raw/
/workspace/CD34_Pipeline/
```

**Rule:** Nothing important lives in the container's root filesystem. If it matters, it goes to `/workspace`.

---

## The Dependency Problem: Why a venv Inside a Container

The NGC PyTorch 25.12 base image ships with a specific NumPy version that nnU-Net V2 expects. This is non-negotiable — nnU-Net's data loading and augmentation pipeline has hard NumPy version dependencies baked in.

Project MONAI Label, used for active learning annotation workflows, requires a different NumPy version. Installing MONAI Label directly into the base environment breaks nnU-Net. Installing nnU-Net after MONAI Label breaks MONAI Label.

The fix is a Python virtual environment inside the container:

```bash
# Inside the container
python -m venv /workspace/venvs/monai-env
source /workspace/venvs/monai-env/bin/activate
pip install monailabel
```

nnU-Net V2 runs in the base container environment. MONAI Label runs in the venv. They never conflict. The venv lives on `/workspace` so it survives container rebuilds.

**Key insight:** A venv inside a Docker container is not redundant — it is the correct pattern when the base image has pinned dependencies that conflict with your secondary tooling.

---

## tmux: The Actual Solution to Session Persistence

Without tmux, closing the SSH terminal sends a `SIGHUP` signal to every process attached to that session. Your training loop receives it and dies. No checkpoint is written. The GPU is freed. Hours of work are gone.

tmux decouples the running process from the SSH session entirely. The process lives inside a tmux session on the server. The SSH connection is just a window into it — close the window, the process keeps running.

**Session structure used for training runs:**

```
tmux session: nnunet-train
  ├── window 0: training      → python train.py / nnUNetv2_train ...
  ├── window 1: gpu-monitor   → watch -n 1 nvidia-smi
  └── window 2: sys-monitor   → htop
```

Creating the session before launching training:

```bash
tmux new -s nnunet-train
# window 0 — launch training
nnUNetv2_train DATASET_ID 2d 0 --npz

# Ctrl+B, C → new window
# window 1 — GPU monitoring
watch -n 1 nvidia-smi

# Ctrl+B, C → new window  
# window 2 — CPU/RAM monitoring
htop
```

Detach cleanly before closing SSH:

```bash
Ctrl+B, D
```

Reattach from any SSH session, any machine, any time:

```bash
tmux attach -t nnunet-train
```

If you forget to detach and the SSH connection drops, the session survives. Reattach the next morning and the training is still running exactly where you left it.

---

## Monitoring: What to Watch and When

**Every run — `watch -n 1 nvidia-smi`**

Refreshes GPU stats every second. The critical numbers during training:

- `GPU-Util` — should be consistently above 85% during forward/backward passes. If it dips to 0% repeatedly, data loading is the bottleneck, not compute.
- `MEM-Usage` — for 512×512 patches with nnU-Net's default batch sizes on 80GB, memory usage should sit around 40–60GB. Headroom matters if you increase batch size.
- `Power Draw` — a proxy for actual compute activity. Sustained high wattage means the GPU is working. Fluctuating power means CPU-GPU synchronisation issues.

**Every run — `htop`**

Confirms the dataloader workers are actually running (multiple Python processes visible). If all CPU cores are idle during training, the DataLoader `num_workers` configuration needs attention.

**Every 50 epochs — NVIDIA Nsight Systems**

Full profiling pass using Nsight Systems to capture the training loop timeline. Rather than profiling the entire run — which generates unmanageable trace files and distorts overall training time — the key is using `nsys profile` with highly specific `--delay` and `--duration` flags to capture only a narrow, representative window mid-training:

```bash
nsys profile \
  --delay=300 \
  --duration=60 \
  --output=/workspace/profiles/epoch50_trace \
  --trace=cuda,nvtx,osrt \
  python train.py
```

`--delay=300` skips the first 5 minutes of startup overhead — data loading initialisation, CUDA context creation, and the first few slow batches that are unrepresentative of steady-state training. `--duration=60` captures exactly 60 seconds of the training loop at full speed. The result is a clean, focused trace of roughly 3–5 training iterations without gigabytes of irrelevant startup data.

The specific bottlenecks this reveals:

- **Data loading gaps**: Gaps between kernel executions indicate the GPU is waiting on CPU-side data preprocessing. Solution: increase `num_workers`, add pinned memory (`pin_memory=True`).
- **AMP overhead**: With Automatic Mixed Precision enabled, the loss scaling step occasionally introduces synchronisation delays. Nsight makes these visible.
- **DDP communication**: If using Distributed Data Parallel across multiple GPUs, Nsight shows all-reduce communication overhead between gradient synchronisation steps.

Nsight is not run on every epoch because the profiling overhead itself affects training speed. Every 50 epochs is sufficient to catch regressions introduced by code changes without distorting the training timeline.

---

## The Complete Mental Model

```
DGX A100 Host
└── Docker Container (nvcr.io/nvidia/pytorch:25.12-py3) [always running]
    ├── /workspace (volume mount — persistent)
    │   ├── training data, checkpoints, results
    │   └── venvs/monai-env (MONAI Label — isolated deps)
    └── tmux: nnunet-train
        ├── window 0: nnUNetv2_train (base env — no venv)
        ├── window 1: watch -n 1 nvidia-smi
        └── window 2: htop
```

SSH into the container. Attach to the tmux session. Detach when done. Close the terminal. The model trains overnight.

---

## Key Takeaways

- **tmux is not optional on shared HPC infrastructure** — it is the minimum viable solution to process persistence over SSH
- **venvs inside containers solve real dependency conflicts** — they are not redundant abstraction
- **Volume mounts are your only persistent storage** — treat the container filesystem as ephemeral even if the container itself is not
- **Nsight Systems every 50 epochs** is enough to catch performance regressions without profiling overhead distorting your training metrics
- **`watch -n 1 nvidia-smi` + `htop` together** give you the full picture: GPU utilisation tells you if compute is saturated, CPU tells you if your dataloader is keeping up

---
