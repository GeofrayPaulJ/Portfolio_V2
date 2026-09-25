---
title: "Technical Notes"
category: "technical_notes"
---

Published technical notes on this site.

### 01. Containerising Persistent GPU Training on DGX A100 with Docker and tmux
How multi-day nnU-Net V2 training survives SSH disconnections on a shared DGX A100 (one 80GB GPU per researcher, persistent NGC PyTorch container). tmux decouples training from the session, a `/workspace` volume keeps data outside the ephemeral container filesystem, and a venv in the container stops MONAI Label's NumPy version breaking nnU-Net. Nsight Systems profiles a narrow mid-training window every 50 epochs. URL: /notes/dgx-docker-tmux

### 02. Architecting a Multi-Marker IHC Analysis Platform for Gigapixel Pathology Workflows
A React, Django REST, Celery and Redis platform: pick a slide and a marker, get a density report and whole-slide overlay. Three model architectures (astrocyte, CD34, CD68) sit behind one interface, with beta-amyloid planned; each marker routes to its own inference runner; tile streaming keeps memory bounded on TIFFs up to 150GB; per-runner GPU memory ceilings, Celery process isolation and progressive checkpointing ended container crashes. Job state lives in Redis with 24-hour eviction. URL: /notes/ihc-platform

### 03. Your GPU Is Lying To You
The full MICCAI Educational Challenge 2026 tutorial (finalist), built from the AIMS-TBI container work of June and July 2026. Six instruments reported success while being wrong: a GPU check that passed while every kernel failed (so local timings came from a silent CPU fallback), a harness pointing at a stale path, a docstring the code did not honour, a mislabelled validation set, a calibrated threshold whose premise failed on test, and a cross-validation gain that did not transfer. It ends with a ten-point preflight checklist that needs no restricted data. URL: /notes/gpu-is-lying
