# Architecting a Multi-Marker IHC Analysis Platform for Gigapixel Pathology Workflows

**Date:** May 2026 · **7 min read** · `Computational Pathology` `MLOps` `Django` `Celery` `WSI`

---

## Context

Immunohistochemistry quantification in active research environments presents a specific operational problem: pathologists and wet-lab researchers need density metrics from stained tissue sections, but the tooling required to run deep learning inference on gigapixel whole slide images sits entirely outside their technical domain. Each new IHC marker — CD34, CD68, Astrocytes, Beta-Amyloid — may use a different model architecture, trained by a different engineer, producing a different output format. Without a unified platform, every new model requires the researcher to engage a different engineer for every analysis run.

This platform was designed and built to abstract that complexity entirely. A researcher selects a tissue image, selects a marker, clicks Run Detection, and receives a quantified density report with a whole slide overlay — without any knowledge of the underlying model architecture, inference pipeline, or compute infrastructure. The platform runs on the institutional NVIDIA DGX A100 system (640GB aggregate VRAM) and is capable of processing TIFF input files up to 150GB.

---

## Architecture Overview

```
React.js Frontend
      │
      ▼
Django REST API  ──→  Celery Task Queue  ──→  Inference Runner
                             │                  (per-marker model)
                           Redis
                        (broker + result store)
```

The stack was chosen to solve one specific problem before anything else: synchronous inference on gigapixel TIFF files will always exceed any reasonable HTTP request timeout. A 150GB TIFF processed through a tile-based inference pipeline takes minutes to hours. The frontend cannot block for this duration. Every architectural decision follows from that constraint.

**No persistent database.** All job state — task ID, status, result paths — lives in Redis. Results are automatically evicted after 24 hours. This eliminates database schema management, migration complexity, and long-term storage liability for large intermediate files. Redis is the correct data store for ephemeral, high-throughput job state: it handles the Celery broker and result backend simultaneously, and its TTL mechanism enforces the 24-hour cleanup policy without a scheduled job.

---

## The Inference Routing Architecture

The platform currently supports four IHC markers:

| Marker | Architecture | Author |
|---|---|---|
| Astrocytes | YOLOv5 | Team Lead |
| CD34 | nnU-Net V2 | G. Paul J |
| CD68 | Custom CNN | Colleague |
| Beta-Amyloid | TBD | — |

Each marker is a distinct model with its own architecture, training data, and inference logic. A single unified model across all four markers would be architecturally incorrect — IHC markers stain for fundamentally different biological structures with different morphological properties. YOLOv5's instance detection is the correct choice for Astrocyte punctate morphology. nnU-Net V2's semantic segmentation is the correct choice for CD34 vascular networks. These are not interchangeable.

The routing logic is explicit: when a marker is selected in the frontend, the Django REST API maps that marker to a specific inference runner class. The Celery task receives the runner class reference alongside the image path and executes the appropriate pipeline end-to-end, isolating each model's environment from the others.

```python
INFERENCE_RUNNERS = {
    "astrocytes": AstrocyteRunner,
    "cd34":       CD34Runner,
    "cd68":       CD68Runner,
}

runner_class = INFERENCE_RUNNERS[selected_marker]
task = run_inference.delay(runner_class, image_path, job_id)
```

Adding a new marker requires implementing one `Runner` class and registering it in the map. The frontend, API layer, and task queue require no modification.

---

## Handling 150GB TIFF Input

Standard image loading libraries load the full file into memory before processing. On a 150GB TIFF, this is not possible even on the DGX A100 system — the file would exhaust memory before a single inference pass begins.

The platform reads WSI data tile-by-tile using a streaming reader that accesses only the spatial region required for each tile. Each tile is passed to the inference runner independently. Results are streamed directly to persistent disk storage as the tile stream progresses, ensuring peak memory consumption remains strictly bounded to the active tile rather than accumulating the full WSI footprint. This is why the 150GB ceiling exists as a tested operational limit rather than a theoretical constraint — it reflects the maximum file size validated against available memory and inference throughput on the allocated hardware.

---

## The Container Crash Problem

The first deployed version crashed repeatedly under real research workloads. The failure mode was consistent: a large TIFF would be submitted, the inference process would allocate GPU memory progressively across the tile stream, and at some point the container's memory ceiling would be breached — killing the process, the active job, and the user's session simultaneously.

Three changes resolved this:

**1. Explicit GPU memory ceilings per runner.** Each inference runner initialises its model with a hard VRAM allocation limit. Tiles are batched at a size calculated to stay within that limit, with a conservative margin. The model never competes with other system processes for unallocated VRAM.

**2. Celery task isolation.** Each inference job runs in a dedicated Celery worker process. A crash in one worker does not propagate to the broker, the API layer, or any other running job. The failed task is marked with an error status in Redis, and the frontend surfaces this to the researcher without requiring a page reload or a system restart.

**3. Intermediate result checkpointing.** Long-running inference jobs write tile results to a temporary directory progressively rather than accumulating them in memory until completion. If a worker crashes mid-inference, the partial results are available for diagnostic inspection rather than being lost entirely.

---

## WSI Overlay Generation

Raw density metrics alone are insufficient for pathological interpretation. A researcher needs to see *where* in the tissue the detected structures are located — not just how many. The platform generates a whole slide overlay by stitching tile-level predictions back into the original WSI coordinate space.

The stitching process inverts the tiling operation: each tile's prediction is placed at the exact spatial offset from which that tile was extracted. For **density markers** (Astrocytes, CD68), the overlay renders detected objects as coloured point annotations at their spatial coordinates. For **CD34 vascular segmentation**, the overlay renders the continuous vessel boundary contour stitched from the tile-level nnU-Net V2 predictions using the 50% stride overlap averaging described in the previous field note.

The full-resolution overlay is not served directly to the browser — a 150GB source file produces a proportionally large overlay that cannot be transmitted or rendered client-side. The platform generates a downsampled preview at a resolution appropriate for browser rendering, while making the full-resolution overlay available for download. The researcher sees the spatial distribution of their marker immediately in the browser and downloads the full-resolution file when needed for publication or further analysis.

---

## The Researcher-Facing Interface

The complete operational workflow for a researcher:

1. Upload a TIFF file (up to 150GB via chunked upload)
2. Select a marker from the available list
3. Click **Run Detection**
4. Monitor job status via a polling progress indicator
5. View the downsampled WSI overlay in the browser
6. Download the full-resolution overlay and density report

No model configuration. No infrastructure interaction. No knowledge of tile size, stride, overlap averaging, or inference batching. The entire pipeline — from TIFF ingestion through tile-based inference to overlay stitching and downsampled preview generation — executes transparently behind a single button.

---

## Platform Summary

| Capability | Detail |
|---|---|
| Maximum input size | 150GB TIFF |
| Supported markers | Astrocytes (YOLOv5), CD34 (nnU-Net V2), CD68 (CNN) |
| Output | Density metric + WSI overlay (browser preview + full-res download) |
| Job persistence | Redis, 24-hour auto-eviction |
| Concurrency | Celery multi-worker, per-job process isolation |
| Infrastructure | NVIDIA DGX A100, 640GB aggregate VRAM |
| Extensibility | New marker = one Runner class + one registry entry |

---

