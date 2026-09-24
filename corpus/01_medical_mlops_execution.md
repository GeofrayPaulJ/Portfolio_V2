---
title: "Medical MLOps & Infrastructure Execution"
category: "engineering_portfolio"
technologies: ["React.js", "Django REST", "Celery", "Redis", "nnU-Net V2", "U-Mamba", "MONAI", "ANTsPy", "SimpleITK", "QuPath", "3D Slicer", "Fiji", "CUDA", "Docker", "SAM", "MedSAM", "Foundation Models"]
---

Work experience (his current role). No result figures, case counts or dates are given for this work.

### Scalable IHC Analysis Platform Architecture

Architected and deployed a web platform for multi-marker Immunohistochemistry (IHC) analysis on the institutional NVIDIA DGX A100 system (640GB aggregate VRAM). The platform accepts TIFF input files up to 150GB and is designed for operation by researchers with no engineering background — a pathologist or wet-lab technician can ingest a whole slide image, select a marker, and receive a quantified density report with a whole slide overlay without any infrastructure interaction.

The system is built on a React.js frontend with a Django REST backend, utilising Celery and Redis for asynchronous task queuing. All job state is held in Redis with 24-hour automatic eviction — no persistent database. This eliminates schema management overhead and long-term storage liability for large intermediate files.

- **Modular inference routing**: Each IHC marker maps to a dedicated inference runner class. Adding a new marker requires implementing one Runner class and registering it — the API layer, task queue, and frontend require no modification.
- **Markers**: Astrocytes (YOLOv5, built by the team lead), CD34 (nnU-Net V2, built by Geofray) and CD68 (custom CNN, built by a colleague). Beta-Amyloid is planned; its architecture is not yet decided.
- **Foundation model integration pathway**: The modular runner architecture is designed to accommodate foundation model adapters — MedSAM and pathology-specific encoders (UNI, CONCH) can be registered as inference runners without modifying the platform infrastructure.
- **Container crash resolution**: Resolved repeated worker crashes under large TIFF workloads through explicit GPU memory ceilings per runner, Celery worker process isolation, and progressive tile result streaming to disk — ensuring peak memory remains bounded to the active tile rather than the full WSI footprint.
- **WSI overlay generation**: Tile-level predictions are stitched back into the original WSI coordinate space. CD34 produces a continuous vascular boundary contour overlay. Density markers (Astrocytes, CD68) produce spatial point annotation overlays. Full-resolution overlays are available for download; downsampled previews render in-browser immediately on job completion.

---

### High-Resolution CD34 Vascular Segmentation Pipeline

Engineered an automated semantic segmentation pipeline for CD34-stained whole slide images using nnU-Net V2, targeting microvascular density quantification at gigapixel scale.

- **Dataset**: whole slide images at 0.5-micron resolution; patches extracted at 2000×2000 pixels.
- **Annotation strategy**: Colour-deconvolved DAB thresholding (Ruifrok-Johnston method, sigma 4, threshold 0.35 OD units) applied across all slides simultaneously. Random Forest pixel classification was evaluated and rejected due to cross-slide staining variance — DAB optical density measurements are resistant to batch intensity shift that operates in RGB space and destroyed the classifier's cross-slide generalisation.
- **Sub-patching**: 512×512 tiles extracted via 50% stride (256px) in both X and Y dimensions. Data split performed at original WSI level (70/15/15) to prevent tile-level leakage.
- **Inference pipeline**: Overlapping tile inference with Gaussian-weighted averaging (nnU-Net V2 sliding window) to eliminate boundary artefacts. Output: merged binary mask and vascular boundary overlay as single TIFF files.
- **Ongoing**: U-Mamba evaluation against the nnU-Net baseline to address patch myopia in branching capillary network reconstruction. MedSAM prompt-based segmentation is a parallel evaluation track for zero-shot vascular delineation without task-specific training data.

---

### Foundation Model Adaptation

Active evaluation of medical imaging foundation models for specialised histopathology and radiology tasks.

- **SAM and MedSAM**: Evaluating prompt-based segmentation for WSI vascular delineation as a zero-shot alternative to task-specific nnU-Net training. Prompt engineering strategies include bounding box and point prompts derived from DAB thresholding outputs.
- **Pathology encoders (UNI, CONCH)**: Evaluating pre-trained pathology foundation model encoders as feature extractors for IHC marker classification tasks, replacing randomly initialised CNN backbones with encoders pre-trained on large-scale histopathology corpora.
- **Adaptation methodology**: Fine-tuning and linear probing on domain-specific datasets; LoRA-based parameter-efficient fine-tuning for large vision encoders on constrained GPU memory (80GB A100).

---

### Four-Phase Post-Mortem Fetal MRI Preprocessing Pipeline

The original author of this pipeline is the late Dr. Jaikishan Jayakumar; credit him as its original author whenever the pipeline is mentioned. The four-phase preprocessing pipeline standardises post-mortem fetal brain MRI volumes (SAG T1 MPRAGE and ASL sequences) from raw DICOM to nnU-Net V2-ready NIfTI, eliminating all manual engineering steps for the researcher operator.

The pipeline is orchestrated via a Python-based CLI with a uniform `run(input_path, output_dir, progress_callback)` interface per phase. Each phase writes a named checkpoint (`_p1.nii.gz` through `_p4_final.nii.gz`); any phase can be resumed independently after failure.

**Phase 1 — Ingestion and Geometrical Standardisation** *(pydicom, SimpleITK, ANTsPy)*
DICOM metadata extraction and NIfTI conversion via SimpleITK. Isotropic resampling to 0.5mm³ using ANTsPy nearest-neighbour interpolation. Image space standardised to fixed origin `(0,0,0)` and direction cosine matrix, eliminating scanner-specific geometric encoding.

**Phase 2 — Signal Purification** *(ANTsPy)*
N4 Bias Field Correction (shrink factor 4, 4-level convergence, tolerance 1e-7) to remove RF field non-uniformity. Adaptive Non-Local Means denoising (Gaussian noise model, full-resolution) to suppress acquisition noise while preserving cortical plate boundary detail.

**Phase 3 — Formatting** *(ANTsPy, SimpleITK, NumPy)*
Symmetric zero-padding to target shape (340, 340, 230) — the spatial envelope encompassing all subjects without tissue cropping. Origin explicitly recalculated post-padding: the lower-bound padding translation vector is multiplied by voxel spacing and subtracted from the original origin via `sitk_image.SetOrigin()`, maintaining absolute DICOM spatial fidelity. Cast to int16 for nnU-Net V2 compatibility. ROI bounding box documented in both voxel and physical millimetre coordinates.

**Phase 4 — Landmark Alignment and Active Learning Export** *(MONAI Label, 3D Slicer, Docker)*
MONAI Label DeepEdit server spun up inside a persistent Linux Docker container on the Windows host, with explicit Windows-to-Linux path translation and port lifecycle management. A custom Python script injected into 3D Slicer at launch prompts the operator to place three anatomical landmarks: Anterior Fontanelle (AF), Posterior Fontanelle (PF), and Anterior Edge of Pons (AP). A rigid transformation matrix is computed from these landmarks using cross-product orthogonalisation — Z-axis along the AF–AP vertical, X-axis via right-hand cross product, Y-axis orthogonalised — with origin placed at the foot of the perpendicular from PF onto the AF–AP axis. The hardened transform is saved to the MONAI Label studies directory. On mask submission, the pipeline exports directly to nnU-Net V2 directory structure (`imagesTr/`, `labelsTr/`, `dataset.json`) with atomic `numTraining` incrementation.

---

### High-Throughput SIFT Image Registration

Executed large-scale linear image registration workflows for post-mortem brain histology sections using Fiji and the Scale-Invariant Feature Transform (SIFT) algorithm.

- Fetal and adult brain datasets: serial sections aligned for structural continuity.

Section-to-section registration at this scale requires robust feature matching that is invariant to staining intensity variation between sections — SIFT's scale and rotation invariance is the correct choice for histological serial section alignment where tissue processing introduces non-uniform deformation and staining drift between adjacent sections.