# A Four-Phase Preprocessing Pipeline for Post-Mortem Fetal MRI: From Raw DICOM to nnU-Net-Ready Volumes

**Date:** May 2026 · **8 min read** · `Computational Radiology` `MRI` `ANTsPy` `SimpleITK` `MONAI`

The late Dr. Jaikishan Jayakumar was the original author of this pipeline.

---

## Context

Raw MRI data from clinical scanners is not directly usable as training input for deep learning models. It carries scanner-specific geometric encoding, acquisition noise, intensity inhomogeneity, and inconsistent spatial formatting that will corrupt any model trained on it without remediation. For research teams without dedicated MLOps engineering support, this preprocessing burden falls on the researchers themselves — an untenable position when the relevant tooling spans pydicom, ANTsPy, SimpleITK, MONAI Label, and 3D Slicer across different operating environments.

This pipeline was designed and built to remove that burden entirely. It standardises post-mortem fetal MRI volumes — SAG T1 MPRAGE and ASL sequences — into a consistent, model-ready format for downstream nnU-Net V2 and U-Mamba training, requiring no engineering knowledge from the researcher operating it. A neuropathologist or wet-lab technician can ingest a raw DICOM directory, execute four sequential phases, and produce a correctly formatted, spatially aligned, annotated NIfTI volume ready for model training — without writing a single line of code or configuring a single preprocessing parameter.

Each phase writes a named checkpoint file (`_p1.nii.gz`, `_p2.nii.gz`, `_p3.nii.gz`, `_p4_final.nii.gz`). No phase reads from a previous phase's intermediate files — only from checkpoints. This design means a hardware failure or process crash at any point in the pipeline loses at most one phase of computation, not the entire run.

---

## Phase 1: Ingestion and Geometrical Standardisation

**Tools:** pydicom · SimpleITK · ANTsPy

Raw scanner output arrives either as a DICOM series directory or as a pre-converted NIfTI file. Phase 1 normalises both input types to an identical geometric baseline.

**Step 1 — DICOM ingestion:**
pydicom reads the first file in the DICOM directory and dumps all metadata tags to a structured text report, excluding pixel data. This report is a permanent audit record — it captures the original acquisition parameters (TR, TE, flip angle, slice thickness, orientation) before any transformation is applied. SimpleITK then reads the full DICOM series by its series UID and converts to a single NIfTI volume, preserving the original voxel spacing and direction cosines embedded in the DICOM headers.

If the input is already a NIfTI file, this step is bypassed entirely. The pipeline logs that DICOM metadata is unavailable and proceeds.

**Step 2 — Isotropic resampling to 0.5mm³:**
Post-mortem fetal MRI sequences are acquired at non-isotropic voxel spacings — slice thickness commonly differs from in-plane resolution. ANTsPy resamples the volume to 0.5mm isotropic spacing using nearest-neighbour interpolation, preserving label boundaries without introducing interpolation artefacts at tissue interfaces.

```python
resampled = ants.resample_image(
    image,
    resample_params=[0.5, 0.5, 0.5],
    use_voxels=False,
    interp_type=1  # nearest-neighbour
)
```

**Step 3 — Image space standardisation:**
Scanner coordinate frames vary by acquisition protocol and scanner manufacturer. SimpleITK forces the volume origin to `(0.0, 0.0, 0.0)` and the direction cosine matrix to a fixed standard:

```
Direction: (0, 0, -1 | 1, 0, 0 | 0, -1, 0)
```

This eliminates scanner-specific spatial encoding from the image header, ensuring that all volumes fed to the model share a common coordinate frame regardless of acquisition origin.

---

## Phase 2: Signal Purification

**Tools:** ANTsPy

Post-mortem MRI has two systematic signal degradation sources that must be corrected before any deep learning model can learn meaningful tissue boundaries: intensity inhomogeneity from RF field non-uniformity, and acquisition noise from the scanner electronics.

**Step 1 — N4 Bias Field Correction:**
RF field non-uniformity produces a slow-varying intensity gradient across the volume — the same tissue type appears brighter at one end of the volume than the other. N4 Bias Field Correction, implemented in ANTsPy, models and removes this gradient iteratively.

```python
corrected = ants.n4_bias_field_correction(
    image,
    shrink_factor=4,
    convergence={"iters": [50, 50, 50, 50], "tol": 1e-7},
    spline_param=None,
)
```

`shrink_factor=4` downsamples the volume by a factor of 4 before estimating the bias field — this dramatically reduces computation time with negligible accuracy loss, since the bias field is smooth and low-frequency. Four resolution levels (`iters: [50, 50, 50, 50]`) with convergence tolerance `1e-7` ensures the correction reaches a stable solution without over-correcting.

**Step 2 — Adaptive Non-Local Means Denoising:**
Non-local means denoising exploits the statistical redundancy of MRI noise: similar image patches across the volume share similar true intensities, so a noisy patch can be denoised by weighted averaging against its non-local neighbours. ANTsPy's implementation uses a Gaussian noise model appropriate for standard MRI acquisition:

```python
denoised = ants.denoise_image(
    corrected,
    noise_model="Gaussian",
    shrink_factor=1,
)
```

`shrink_factor=1` applies denoising at full resolution, preserving fine structural detail — critical for post-mortem fetal brain tissue where cortical plate boundaries are narrow and must be retained for accurate segmentation.

---

## Phase 3: Formatting and ROI Documentation

**Tools:** ANTsPy · SimpleITK · NumPy

nnU-Net V2 requires a fixed input volume shape across all training samples. Phase 3 brings every volume to a uniform spatial envelope and produces a documented bounding box of the brain ROI.

**Step 1 — Zero-padding to (340, 340, 230):**
The target shape `(340, 340, 230)` represents the spatial envelope that encompasses all subjects in the cohort without cropping any brain tissue. ANTsPy pads symmetrically — deficit voxels are split evenly between the lower and upper edges of each axis, with any odd-numbered deficit assigned to the upper edge:

```python
for axis, (cur, tgt) in enumerate(zip(current_shape, TARGET_SHAPE)):
    deficit = tgt - cur
    lower, extra = divmod(deficit, 2)
    upper = lower + extra
    pad_width.append([lower, upper])
```

Any input whose shape exceeds the target on any axis raises a hard error — it cannot be zero-padded to fit, and the subject requires investigation before proceeding.

Crucially, padding the voxel array shifts the coordinate grid. To maintain absolute spatial fidelity, the physical origin of the SimpleITK image is explicitly recalculated: the padding translation vector (lower bounds) is multiplied by the voxel spacing and subtracted from the original image origin via `sitk_image.SetOrigin()`. This ensures the DICOM geometry remains uncorrupted for downstream physical coordinate mapping.

**Step 2 — Datatype conversion to int16:**
ANTsPy writes float32 by default. nnU-Net V2 expects int16 for MRI volumes. SimpleITK casts the padded volume:

```python
int16_image = sitk.Cast(sitk_image, sitk.sitkInt16)
```

**Step 3 — ROI documentation:**
NumPy identifies all non-zero voxels in the padded volume and computes the bounding box of the brain ROI — both in voxel index coordinates and in physical millimetre coordinates via SimpleITK's `TransformIndexToPhysicalPoint`. This documentation is written to a text file per subject, providing a permanent spatial reference for the brain position within the padded volume.

---

## Phase 4: Landmark Alignment and MONAI Label Active Learning

**Tools:** MONAI Label · 3D Slicer · Docker

Phase 4 is the most architecturally complex: it spans a Windows host, a Linux Docker container, and the 3D Slicer application environment simultaneously. It produces the final annotated volume and exports it directly to nnU-Net V2 directory structure.

### The Docker OS Boundary Problem

MONAI Label runs inside a persistent Linux Docker container on the Windows host. The container exposes port 8000. The pipeline must:

1. Start the container if not running
2. Kill any residual process occupying port 8000 inside the container
3. Translate Windows filesystem paths to Linux container paths before passing them to the server

Path translation is non-trivial. A Windows path `D:\MRI Outputs\monailabel_studies` must become `/workspace/MRI Outputs/monailabel_studies` inside the container:

```python
if ":" in studies_str:
    path_after_drive = studies_str.replace("\\", "/").split(":", 1)[1]
    container_studies = "/workspace" + path_after_drive
```

Port cleanup inside the container runs before every server start to prevent `address already in use` errors from a previous session that terminated without releasing the port:

```python
cleanup_cmd = "pkill -9 -f monailabel; fuser -k 8000/tcp; true"
subprocess.run(["docker", "exec", "-i", container_id, "sh", "-c", cleanup_cmd], ...)
```

The trailing `; true` ensures the command exits with code 0 even if no process was running — preventing the pipeline from treating a clean state as an error.

### 3D Slicer Landmark Alignment

The phase 3 output volume requires anatomical orientation alignment before active learning annotation. Post-mortem fetal brain volumes have no standardised spatial orientation in the image header — each subject's head position in the scanner is arbitrary.

A custom Python script is injected into 3D Slicer at launch via `--python-script`. The script instructs the annotator to place exactly three anatomical landmark points:

- **AF** — Anterior Fontanelle
- **PF** — Posterior Fontanelle  
- **AP** — Anterior Edge of the Pons

These three landmarks define a subject-specific anatomical coordinate frame. The alignment computes a rigid transformation matrix from them:

**Origin:** The foot of the perpendicular dropped from PF onto the AF–AP vertical axis — the intersection of the vertical midline with the horizontal plane through PF. This is geometrically stable and clinically meaningful as the brain's central reference point:

```python
af_to_ap = sub(ap, af)
t = dot(sub(pf, af), af_to_ap) / dot(af_to_ap, af_to_ap)
c = [af[i] + t * af_to_ap[i] for i in range(3)]  # foot of perpendicular
```

**Axes:**
- Z (Superior): unit vector from AP toward AF along the vertical axis
- X (Right): cross product of the anterior vector (PF→AF) and Z — enforces right-hand rule
- Y (Anterior): cross product of Z and X — orthogonalised

The three unit vectors are assembled into a 4×4 homogeneous transformation matrix, then **inverted** — because the goal is to pull the image space back to the Slicer world origin, not to push the origin into image space:

```python
mat = vtk.vtkMatrix4x4()
for i in range(3):
    mat.SetElement(i, 0, x_axis[i])
    mat.SetElement(i, 1, y_axis[i])
    mat.SetElement(i, 2, z_axis[i])
    mat.SetElement(i, 3, c[i])
mat.Invert()
```

The transform is hardened directly onto the volume, saving the aligned result to the MONAI Label studies directory.

### Active Learning and nnU-Net Export

With the aligned volume in the studies directory and the MONAI Label server running DeepEdit on port 8000, the annotator corrects the model's predictions inside 3D Slicer's MONAI Label module. The pipeline monitors `labels/final/` for the submitted mask file on a 2-second polling interval with a 2-hour timeout.

On detection, the pipeline exports immediately to nnU-Net V2 directory structure:

```
nnUNet_raw/Dataset001_PostMortem/
├── imagesTr/{subject}_0000.nii.gz   ← aligned volume
└── labelsTr/{subject}.nii.gz        ← submitted mask
```

`dataset.json` is updated atomically per subject, incrementing `numTraining` on each successful export. The dataset accumulates subjects across pipeline runs without requiring manual metadata management.

---

## Python-Based CLI Orchestrator

The four phases are orchestrated through a strictly typed Python CLI that manages sequential phase execution, progress reporting, and configuration persistence. Each phase exposes a `run(input_path, output_dir, progress_callback)` interface — a uniform contract that allows the orchestrator to invoke phases identically regardless of their internal complexity.

First-run configuration captures the 3D Slicer executable path and default output directory, persisting them to `config.json`. Subsequent runs load this configuration automatically. Path validation asserts that the Slicer executable exists on disk before Phase 4 is allowed to proceed — a hard precondition check that fails fast rather than allowing Phase 4 to launch and crash mid-execution against a missing binary.

---

## Pipeline Summary

| Phase | Operation | Tools | Output |
|---|---|---|---|
| 1 | DICOM ingestion, 0.5mm resampling, space standardisation | pydicom, SimpleITK, ANTsPy | `_p1.nii.gz` |
| 2 | N4 bias correction, non-local means denoising | ANTsPy | `_p2.nii.gz` |
| 3 | Padding to (340,340,230), int16 cast, ROI documentation | ANTsPy, SimpleITK, NumPy | `_p3.nii.gz` |
| 4 | Landmark alignment, active learning, nnU-Net export | MONAI Label, 3D Slicer, Docker | `_p4_final.nii.gz` + nnU-Net dataset |

Each checkpoint is independently resumable. The pipeline is hardware-agnostic across Windows and Linux hosts, with the Docker boundary in Phase 4 handled by explicit path translation and port lifecycle management.

---
