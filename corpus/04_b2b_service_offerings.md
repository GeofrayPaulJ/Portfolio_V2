---
title: "B2B Medical MLOps & Infrastructure Consulting"
category: "service_offerings"
date: "2026-04-22"
technologies: ["nnU-Net V2", "U-Mamba", "SAM", "MedSAM", "UNI", "CONCH", "PyTorch", "Docker", "Next.js", "React.js", "Django REST", "Celery", "Redis", "NVIDIA Nsight Systems", "CUDA", "MONAI", "ANTsPy", "SimpleITK", "Foundation Models"]
---

### Consulting Overview

Geofray operates as an independent Medical MLOps consultant and infrastructure architect, providing production-grade pipeline engineering for research institutions, HealthTech companies, pharma CROs, and hospital technology teams. Engagements are scoped on a project-to-project basis, with a focus on computational pathology, computational radiology, foundation model adaptation, and high-throughput inference infrastructure.

---

### Foundation Model Adaptation

Fine-tuning and adapting medical imaging foundation models for specialised clinical tasks — bridging generalised vision encoders to domain-specific histopathology and radiology workflows.

- **SAM and MedSAM**: Prompt-based segmentation for WSI analysis. Bounding box and point prompt engineering derived from domain-specific preprocessing outputs for zero-shot and few-shot vascular and cellular delineation.
- **Pathology foundation encoders**: Fine-tuning and linear probing on UNI and CONCH — encoders pre-trained on large-scale histopathology corpora — for IHC marker classification and feature extraction tasks.
- **Parameter-efficient fine-tuning**: LoRA-based adaptation for large vision encoders on constrained GPU memory environments (single A100, 80GB).
- **Evaluation framework**: Systematic comparison of foundation model performance against task-specific baselines (nnU-Net V2) on held-out test sets, with Dice, VAF, and connectivity metrics.

---

### Computational Pathology Pipelines

End-to-end segmentation and quantification pipelines for gigapixel whole slide image analysis.

- **WSI inference infrastructure:** Tile-based inference pipelines with overlapping stride and Gaussian-weighted reconstruction, handling TIFF inputs beyond 100GB without full-file memory loading.
- **Segmentation architectures:** nnU-Net V2 deployment for semantic segmentation tasks — vascular density quantification (CD34), cell marker quantification (CD68, Astrocytes, Beta-Amyloid). U-Mamba evaluation for long-range dependency modelling in branching network structures. MedSAM as a zero-shot evaluation track.
- **Annotation pipeline engineering:** DAB colour-deconvolved thresholding, MONAI Label active learning integration, QuPath scripting for ground truth generation at scale.
- **Output:** Density metrics, WSI overlay generation (boundary contours and spatial point annotations), export to nnU-Net V2 training format.

---

### Computational Radiology Pipelines

Preprocessing and standardisation pipelines for clinical MRI sequences.

- **DICOM ingestion:** Series-level DICOM-to-NIfTI conversion with metadata audit logging via pydicom and SimpleITK.
- **Geometric standardisation:** Isotropic resampling (ANTsPy), image space normalisation (origin, direction cosines), symmetric zero-padding with explicit origin recalculation to maintain DICOM spatial fidelity.
- **Signal processing:** N4 Bias Field Correction and Adaptive Non-Local Means denoising (ANTsPy) for RF inhomogeneity removal and acquisition noise suppression.
- **Landmark alignment:** Anatomical landmark-based rigid transformation for spatial orientation standardisation, integrated with MONAI Label active learning for downstream segmentation annotation.

---

### Full-Stack Inference Platform Engineering

Production web platforms connecting deep learning inference backends to researcher-facing interfaces.

- **Asynchronous inference platforms:** React.js frontend, Django REST backend, Celery task queue, Redis broker — architecture handles long-running inference jobs without HTTP timeout constraints.
- **Serverless and edge deployments:** Next.js with Edge Functions for lightweight client-facing applications and RAG integrations.
- **API integrations:** OpenAI assistant thread management, webhook-based asynchronous response delivery, third-party API middleware engineering.

---

### Hardware Orchestration and GPU Optimisation

- **DGX and HPC deployment:** Production pipeline deployment on NVIDIA DGX A100 systems. Experience with institutional resource allocation workflows and multi-user HPC governance.
- **Local GPU environments:** Persistent Docker container environments (`nvcr.io/nvidia/pytorch:25.12-py3`) with tmux session management for crash-resilient training on RTX-series hardware.
- **Performance profiling:** NVIDIA Nsight Systems profiling via `nsys profile --delay --duration` for steady-state training trace capture. AMP and DDP configuration for multi-GPU memory efficiency.
- **Dependency isolation:** venv-within-container architecture for resolving conflicting dependency requirements across co-deployed frameworks (e.g., MONAI Label and nnU-Net V2 NumPy conflicts).

---

### Premium Tier: Cloud Infrastructure Deployment

For engagements requiring public cloud deployment (AWS, GCP, Azure), Geofray partners with a dedicated Infrastructure Lead holding GCP and AWS certifications to deliver Kubernetes orchestration, Cloud Run integrations, and batch inference queue management. This tier covers the full deployment lifecycle from containerised model packaging through to scalable cloud inference endpoints.

---

### Operational Boundaries

**Bring Your Own Compute (BYOC):**
All engagements operate on a BYOC basis. The client provisions and grants access to the required compute infrastructure — AWS, GCP, Azure, or on-premise clusters. Geofray does not host client data or finance cloud compute. This ensures data sovereignty and eliminates cross-jurisdictional data transfer risk for clinically sensitive research datasets.

**Research Use Only (RUO):**
All infrastructure and deployment services are scoped for research use only. Geofray does not sign Business Associate Agreements (BAAs) and does not assume liability for processing regulated clinical patient data under active HIPAA or SOC 2 compliance requirements. Engagements involving regulated clinical data must be structured within the client's own compliance framework.