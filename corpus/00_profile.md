---
title: "Profile: Geofray Paul J"
category: "profile"
---

### Who he is
Geofray Paul J is an AI engineer in medical imaging: segmentation and classification models, computational pathology and neuroimaging pipelines, and the infrastructure that trains and serves them. He entered four MICCAI 2026 challenges as an independent researcher.

### Work experience
Junior AI Engineer, Sudha Gopalakrishnan Brain Centre (SGBC), IIT Madras. No dates or result figures are given for this role.
* Grey/white-matter segmentation on multiple sclerosis whole-slide images (HookNet), with multi-slide pooled training. He traced a stagnant boundary metric to a coarse ground-truth polygon rather than a model or metric defect, confirmed it with a per-class tau-sweep control test, and redirected the team toward re-annotation instead of further training.
* Skull-stripping models for postmortem fetal brain MRI (nnU-Net and nnSAM). Found and fixed a silent orientation error that transposed predictions, and established the correct brain-boundary convention against a public fetal brain atlas.
* CD34 microvessel segmentation pipeline and IHC analysis tooling (detail in the medical MLOps file).
* Astrocyte detection web application (React and Django) deployed on a DGX A100.
* Work on the four-phase post-mortem fetal MRI preprocessing pipeline, whose original author is the late Dr. Jaikishan Jayakumar (detail in the medical MLOps file).
* MLOps and systems: training-loop profiling on a DGX A100 cluster (Nsight Systems, AMP, DDP); asynchronous Django, Celery and Redis inference platforms; the Neurological Asset Tracking System, for which he interviewed lab personnel about the specimen lifecycle (sectioning, staining, QR-coded digital storage), designed the relational data model and ORM layer, built the tracking interface and delivered BPMN/UML workflow diagrams to the Chief Scientific Officer.
* Built the institute's public website solo in React (sgbc.humanbrain.in) and the BRICS 2026 Neuroscience Symposium pages.

### Education
B.Tech, Computer Science and Engineering (AI specialisation), Karunya Institute of Technology and Sciences, 2020 to 2024.

### Skills
* Medical image segmentation: nnU-Net v2, nnSAM, HookNet. AIMS-TBI and TopAneu26; fetal MRI and whole-slide pathology at work.
* Image classification: ConvNeXt ensembles (RARE26); gradient-boosted classifiers on vessel geometry (TopAneu26).
* Foundation models: SAM, MedSAM, UNI, CONCH; LoRA fine-tuning. Work.
* Computational pathology: whole-slide image pipelines, IHC analysis, CD34 microvessel segmentation, astrocyte detection. Work.
* Neuroimaging: MRI preprocessing, orientation checks, annotation quality control. Work.
* Evaluation: testing on hospitals a model never saw, patient-level leakage checks, statistical comparison of models. Across the three challenges.
* Deployment: Docker inference containers within strict size and time limits; checksum-based provenance for reproducibility; DGX A100 at work.
* LLM engineering: vLLM serving on a RunPod serverless endpoint (Mnemosyne); a Gemini agent over a full-context knowledge base with automated answer and number checks (this site); agentic development with Claude Code.
* Software: Python, TypeScript; React, Next.js on Vercel, Expo; Django REST, Celery, Redis.
* Currently learning: Slurm and Apptainer; computational radiology.
* Languages: English, Tamil; Spanish (A2, working toward B1).
* Outside work: violin, beginner (A and D major scales).

### Publications
* Geofray Paul J. Diagnosing the Recall Tail: A Class-Imbalance Study of nnU-Net for Detection and Segmentation of Heterogeneous Moderate-Severe TBI Lesions. AIMS-TBI Workshop, MICCAI 2026. Springer LNCS, to appear.
* Geofray Paul J. Your GPU Is Lying To You. MICCAI Educational Challenge 2026, finalist. Code: https://github.com/GeofrayPaulJ/MEC
* Geofray Paul J. Below the Noise Floor. Method report, RARE26 challenge (EndoVis, MICCAI 2026), submitted. Code: https://github.com/GeofrayPaulJ/rare26-submission

### This site
* Home page sections: Skills (/#skills), Challenges (/#challenges), Publications (/#publications), Technical Notes (/#documentation), Personal projects (/#projects), Alfred (/#ai-agent), Contact (/#contact).
* Resume: /resume (printable).
* Challenge write-ups, technical notes and personal projects: listed in their own files.

### Contact
Through the Contact section of the home page (/#contact): send a message with the form, or book a 30-minute call. It is meant for research collaboration, roles, or questions about his work. No email address or phone number is given here.
