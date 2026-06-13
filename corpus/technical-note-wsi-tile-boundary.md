# Eliminating Tile Boundary Artefacts in Gigapixel WSI Inference: Stride, Padding, and Gaussian Overlap Averaging

**Date:** May 2026 · **6 min read** · `Computational Pathology` `nnU-Net` `WSI` `Inference Engineering`

---

## Context

Deploying a semantic segmentation model on gigapixel whole slide images requires decomposing the WSI into tiles, running inference on each tile independently, and reconstructing a single coherent prediction mask. This decomposition introduces a failure mode that does not exist during training: **tile boundary artefacts**.

At the CD34 vascular segmentation pipeline built, boundary artefacts manifested as missed vessel detections at tile edges — vessels that fell across a tile boundary were either partially detected or missed entirely. The effect was measurable: Vascular Area Fraction (VAF) was systematically underestimated in regions of the WSI where vessel density happened to align with tile boundaries, and the error was visible in the merged output mask as clean rectangular seam lines through tissue.

This note documents the specific engineering decisions that eliminated these artefacts.

---

## Why Boundary Artefacts Occur

A segmentation model trained on 512×512 patches learns context from the full receptive field of each patch. During inference on a tiled WSI, a vessel that falls at the edge of a tile is presented to the model with only half its spatial context — the other half is in the adjacent tile. The model has never seen this input distribution during training. Its confidence for structures near tile edges is structurally lower than its confidence for structures near tile centres.

If tiles are placed on a non-overlapping grid — stride equal to tile size — every pixel at a tile boundary is predicted exactly once, at the worst possible position in the model's receptive field. The result is systematic underdetection at every tile seam across the entire WSI.

---

## Solution Part 1: 50% Stride in Both Dimensions

The first fix is overlapping tiles. The tiling pipeline uses a stride of 256px — 50% of the 512×512 tile size — applied independently in both the X and Y dimensions.

The consequence: every pixel in the WSI interior is covered by **four overlapping tiles**. A vessel at the edge of one tile is near the centre of at least one adjacent tile, where the model's receptive field is fully populated and confidence is highest.

The tiling is implemented in pure Python, iterating over the WSI coordinate grid:

```python
stride = 256  # 50% of tile_size = 512

tiles = []
for y in range(0, wsi_height, stride):
    for x in range(0, wsi_width, stride):
        tiles.append((x, y, x + 512, y + 512))  # Downstream dataloader handles > WSI bounds via padding
```

**Edge handling — reflection padding:**
At WSI boundaries, tiles that extend beyond the image boundary are zero-padded to the full 512×512 size before inference. The padded region produces low-confidence background predictions which are masked out during reconstruction. Skipping or cropping edge tiles would leave a strip of unanalysed tissue at every WSI border — unacceptable for microvascular density quantification where peripheral vessels matter.

---

## Solution Part 2: Gaussian-Weighted Overlap Averaging

Overlapping tiles alone are not sufficient. Each pixel in the WSI interior now has four predictions — one from each overlapping tile. A naive average of these four predictions would treat all positions within a tile equally. But they are not equal: predictions near the tile centre are more reliable than predictions near the tile edge, because the model has more spatial context available at the centre.

nnU-Net's built-in sliding window inference handles this with a **Gaussian importance map** — a 2D Gaussian kernel of the same spatial dimensions as the tile (512×512), centred on the tile centre, with values that decay toward zero at the tile edges. Before averaging, each tile's softmax probability map is multiplied element-wise by this Gaussian weight map.

The reconstruction accumulates two arrays across all tiles:

```
weighted_sum[y:y+512, x:x+512]  += prediction_softmax * gaussian_map
weight_accumulator[y:y+512, x:x+512] += gaussian_map
```

The final probability map for the full WSI is:

```
final_probability = weighted_sum / weight_accumulator
```

The effect: for any given pixel, predictions from tiles where that pixel is near the centre contribute more than predictions from tiles where that pixel is near the edge. A vessel at a tile boundary is reconstructed primarily from the adjacent tile where it sits near the centre — where the model's confidence is highest.

The final binary mask is produced by thresholding the merged probability map. The boundary outline of detected vessels is computed from this binary mask and overlaid on the original WSI. Both outputs are written as single merged TIFF files — one binary mask, one annotated overlay — covering the complete WSI extent.

---

## Measured Impact

Before overlap averaging, missed vessel detections at tile boundaries were visible as clean rectangular seams in the output mask — a direct artefact of the non-overlapping inference grid. VAF measurements in vessel-dense regions near tile boundaries were systematically lower than in equivalent regions away from boundaries.

After implementing 50% stride with Gaussian-weighted overlap averaging, boundary seams were eliminated from the output mask. VAF measurements became spatially uniform across the WSI, independent of proximity to tile boundaries.

---

## Implementation Notes

**Memory management:** With 50% stride, the number of tiles scales as approximately 4× the number of tiles at full stride. For a large WSI, this increases peak memory usage during the accumulation step. The weighted sum and weight accumulator arrays are pre-allocated at the full WSI dimensions in float32 before tiling begins — allocating incrementally per tile would fragment memory unnecessarily.

**Padding mask:** A binary mask tracking which pixels were covered by real (non-padded) tile content is maintained alongside the weight accumulator. This ensures that padded edge pixels do not contaminate the final probability map with artificially low confidence values propagated from zero-padded tile regions.

**Tile count at 50% stride:** The 329 source patches (2000×2000px) produce 21,056 tiles at 512×512 with 50% stride. With a 256px stride across a 2000px dimension, `range(0, 2000, 256)` generates 8 start positions (0, 256, 512, 768, 1024, 1280, 1536, 1792), forming an 8×8 grid of 64 tiles per patch. A 6×6 grid — 36 tiles per patch — would stop at pixel 1792 and silently abandon a 208px strip of unanalysed tissue on both the right and bottom edges of every patch. At 10% of patch area per edge, this is not an acceptable data loss for a pipeline measuring microvascular density. Inference throughput on the allocated DGX A100 GPU (80GB VRAM) was not the bottleneck — data loading and tile reconstruction dominated wall-clock time at this scale.

---

## Decision Summary

| Configuration | Boundary Behaviour | VAF Accuracy |
|---|---|---|
| Non-overlapping grid (stride = 512) | Hard seam artefacts at every tile boundary | Systematically underestimated near seams |
| 50% stride, naive average | Seams reduced, residual edge bias | Improved, minor residual variance |
| 50% stride, Gaussian-weighted average | No visible seams, spatially uniform predictions | Consistent across full WSI extent |

The combination of 50% stride and Gaussian-weighted overlap averaging is not specific to CD34 or nnU-Net — it applies to any patch-based segmentation model deployed on images larger than the model's input size. For any WSI-scale inference pipeline where boundary accuracy affects downstream quantification metrics, this is the correct default configuration.

---
