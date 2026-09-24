---
title: "Technical Notes"
category: "technical_notes"
---

Published technical notes on this site. Note 04 is not published.

### 01. Architectural Decision: Colour-Deconvolved DAB Thresholding vs. Random Forest for CD34 IHC Segmentation
Ground-truth masks for CD34 segmentation came from 329 patches across 7 slides stained in separate batches. A QuPath Random Forest failed because it learned RGB colour distributions that shifted between batches; Ruifrok-Johnston deconvolution measures DAB optical density instead, so one threshold (0.35 OD, sigma 4) held across all 7 slides. Meningeal vessels and fat artefacts needed manual background rules, and MONAI Label active learning was rejected for lack of a seed model. URL: /notes/cd34-dab-thresholding

### 02. Containerising Persistent GPU Training on DGX A100 with Docker and tmux
How multi-day nnU-Net V2 training survives SSH disconnections on a shared DGX A100 (one 80GB GPU per researcher, persistent NGC PyTorch container). tmux decouples training from the session, a `/workspace` volume keeps data outside the ephemeral container filesystem, and a venv in the container stops MONAI Label's NumPy version breaking nnU-Net. Nsight Systems profiles a narrow mid-training window every 50 epochs. URL: /notes/dgx-docker-tmux

### 03. Eliminating Tile Boundary Artefacts in Gigapixel WSI Inference: Stride, Padding, and Gaussian Overlap Averaging
Non-overlapping tiles left seams of missed vessels and underestimated vascular area fraction near tile edges. A 256px stride on 512×512 tiles covers each interior pixel four times, and nnU-Net's Gaussian importance map weights predictions toward tile centres before averaging; edge tiles are zero-padded and masked. Seams disappeared and vascular area fraction became spatially uniform. URL: /notes/wsi-tile-boundary

### 05. A Four-Phase Preprocessing Pipeline for Post-Mortem Fetal MRI: From Raw DICOM to nnU-Net-Ready Volumes
Turns raw DICOM into aligned, annotated, nnU-Net-ready volumes with no engineering knowledge needed. Phases: resample to 0.5mm isotropic with a standard origin and direction; N4 bias correction and non-local means denoising; padding to (340, 340, 230) with origin recomputed and an int16 cast; landmark alignment in 3D Slicer with MONAI Label annotations exported straight into nnU-Net's dataset structure. Every phase writes a resumable checkpoint. URL: /notes/mri-preprocessing-pipeline

### 06. Architecting a Multi-Marker IHC Analysis Platform for Gigapixel Pathology Workflows
A React, Django REST, Celery and Redis platform: pick a slide and a marker, get a density report and whole-slide overlay. Each marker routes to its own inference runner; tile streaming keeps memory bounded on TIFFs up to 150GB; per-runner GPU memory ceilings, Celery process isolation and progressive checkpointing ended container crashes. Job state lives in Redis with 24-hour eviction. URL: /notes/ihc-platform

### 07. Your GPU Is Lying To You
The full MICCAI Educational Challenge 2026 tutorial (finalist), built from the AIMS-TBI container work of June and July 2026. Six instruments reported success while being wrong: a GPU check that passed while every kernel failed, timings from a silent CPU fallback, a harness pointing at a stale path, a docstring the code did not honour, a mislabelled validation set, and a cross-validation gain that did not transfer. It ends with a ten-point preflight checklist that needs no restricted data. URL: /notes/gpu-is-lying
