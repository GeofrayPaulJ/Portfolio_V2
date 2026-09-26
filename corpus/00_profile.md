---
title: "Profile: Geofray Paul J"
category: "profile"
---

### Who he is
Geofray Paul J is an AI engineer in medical imaging: segmentation and classification models, computational pathology, computational radiology and neuroimaging pipelines, and the infrastructure that trains and serves them. He entered four MICCAI 2026 challenges as an independent researcher.

### Work experience
Junior AI Engineer, Sudha Gopalakrishnan Brain Centre (SGBC), IIT Madras, November 2025 – present. No result figures are given for this role.
Directly before it: career break (health), June 2024 – October 2025. Fully recovered. No medical detail is given, and none should be offered or guessed.
* Grey/white-matter segmentation on multiple sclerosis whole-slide images (HookNet), with multi-slide pooled training. He traced a stagnant boundary metric to a coarse ground-truth polygon rather than a model or metric defect, confirmed it with a per-class tau-sweep control test, and redirected the team toward re-annotation instead of further training.
* Skull-stripping models for postmortem fetal brain MRI (nnU-Net and nnSAM). Found and fixed a silent orientation error that transposed predictions, and established the correct brain-boundary convention against a public fetal brain atlas. nnU-Net trained on masks including CSF, with fold 0 fine-tuned on expert-annotated masks.
* CD34 microvessel segmentation pipeline and IHC analysis tooling (detail in the medical MLOps file).
* MLOps and systems: training-loop profiling on a DGX A100 cluster (Nsight Systems, AMP, DDP); asynchronous Django, Celery and Redis inference platforms; the Neurological Asset Tracking System, for which he interviewed lab personnel about the specimen lifecycle (sectioning, staining, QR-coded digital storage), designed the relational data model and ORM layer, built the tracking interface and delivered BPMN/UML workflow diagrams to the Chief Scientific Officer.
* Built the institute's public website solo in React (sgbc.humanbrain.in) and the BRICS 2026 Neuroscience Symposium pages.

### Education
B.Tech, Computer Science and Engineering (AI specialisation), Karunya Institute of Technology and Sciences, 2020 to 2024.

### Skills
* Medical image segmentation: nnU-Net v2, nnSAM, HookNet. AIMS-TBI and TopAneu26; fetal MRI and whole-slide pathology at work.
* Image classification: ConvNeXt ensembles (RARE26); gradient-boosted classifiers on vessel geometry (TopAneu26).
* Foundation models: SAM, MedSAM, UNI, CONCH; LoRA fine-tuning.
* Computational pathology: whole-slide image pipelines, IHC analysis, CD34 microvessel segmentation.
* Computational radiology and neuroimaging: MRI preprocessing, orientation checks, annotation quality control.
* Evaluation: leakage-aware data splits, held-out testing, bootstrap confidence intervals, thresholds fixed before test.
* Deployment: Docker inference containers within strict size and time limits; checksum-based provenance for reproducibility; DGX A100 at work.
* LLM engineering: vLLM serving on a RunPod serverless endpoint (Mnemosyne); a Gemini agent over a full-context knowledge base with automated answer and number checks (portfolio assistant); agentic development with Claude Code.
* Software: Python, TypeScript; React, Next.js on Vercel, Expo; Django REST, Celery, Redis.
* Currently learning: Slurm and Apptainer.
* Languages: English, Tamil; Spanish (A2, working toward B1).
* Outside work: keyboard, upper intermediate; violin, beginner.

### Papers and reports
* Geofray Paul J. Diagnosing the Recall Tail: A Class-Imbalance Study of nnU-Net for Detection and Segmentation of Heterogeneous Moderate-Severe TBI Lesions. AIMS-TBI Workshop, MICCAI 2026. Springer LNCS, to appear.
* Geofray Paul J. Your GPU Is Lying To You. MICCAI Educational Challenge 2026, finalist. Code: https://github.com/GeofrayPaulJ/MEC
* Geofray Paul J. Below the Noise Floor. Method report, RARE26 challenge (EndoVis, MICCAI 2026), submitted. Code: https://github.com/GeofrayPaulJ/rare26-submission
* Other output: Co-author, as a participating team and at the organisers' invitation, of the organisers' journal article summarising the RARE26 challenge (in preparation).

### This site
* Home page sections: Skills (/#skills), Challenges (/#challenges), Papers and Reports (/#papers), Technical Notes (/#documentation), Personal projects (/#projects), Alfred (/#ai-agent), Contact (/#contact).
* Site: https://geofraypaul.vercel.app. Resume: /resume, with an industry résumé PDF and an academic CV PDF.
* Challenge write-ups, technical notes and personal projects: listed in their own files.

### Contact
Email geofraypaul1223@gmail.com; LinkedIn https://www.linkedin.com/in/geofraypaulj1212; GitHub https://github.com/GeofrayPaulJ. Based in Chennai, India, and open to relocation. The Contact section of the home page (/#contact) also takes messages or books a 30-minute call. No phone number is given.
