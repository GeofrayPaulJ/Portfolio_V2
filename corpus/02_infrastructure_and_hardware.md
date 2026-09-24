---
title: "Enterprise MLOps Infrastructure (Work Experience)"
category: "infrastructure"
technologies: ["NVIDIA DGX A100", "Docker", "NGC PyTorch", "tmux", "Nsight Systems", "AMP", "DDP"]
---

### Enterprise HPC Deployment (NVIDIA DGX A100)
Work experience deploying and maintaining medical imaging pipelines on an institutional High-Performance Computing (HPC) system.
* **DGX Administration:** Held `sudo` access to an NVIDIA DGX A100 (640GB) system, navigating institutional governance and a compliance chain (Team Lead -> Principal Investigator -> Chief Scientific Officer) for resource allocation.
* **Production Migration:** Trained the nnU-Net v2 CD34 model and orchestrated the deployment of the complete IHC analysis platform onto the DGX A100 cluster for high-throughput inference.
* **Container environment:** Each researcher is allocated one 80GB GPU inside a persistent `nvcr.io/nvidia/pytorch:25.12-py3` container. Work lives on a `/workspace` volume mount; multi-day training runs inside `tmux` sessions so SSH disconnections cannot kill them; a Python venv inside the container isolates MONAI Label from nnU-Net V2's pinned NumPy version.
* **Profiling:** Profiled and tuned training loops with NVIDIA Nsight Systems, AMP and DDP, capturing a narrow mid-training window (`nsys profile --delay --duration`) every 50 epochs rather than profiling whole runs.
