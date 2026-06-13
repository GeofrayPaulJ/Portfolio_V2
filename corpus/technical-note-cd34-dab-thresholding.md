# Architectural Decision: Colour-Deconvolved DAB Thresholding vs. Random Forest for CD34 IHC Segmentation

**Date:** May 2026 · **5 min read** · `Computational Pathology` `IHC` `QuPath`

---

## Context

Ground truth mask generation for CD34-stained whole slide images required a decision between two annotation strategies: a Random Forest pixel classifier and a colour-deconvolved DAB thresholding approach. The pipeline needed binary masks for 329 patches (2000×2000px) extracted from 7 WSIs stained across separate batches, with sufficient quality to serve as training labels for a downstream nnU-Net V2 model. Systematic bias introduced at this stage propagates directly into clinical inference.

---

## Random Forest: Failure Analysis

QuPath's Random Forest pixel classifier operates on handcrafted feature vectors — Gaussian-smoothed intensity channels, gradient magnitude, Laplacian of Gaussian, and structure tensor eigenvalues at multiple sigma scales — computed directly in RGB colour space.

Three failure modes were observed:

**1. Cross-slide staining variance**
The 7 WSIs were stained across separate batches. Staining intensity varied materially between slides. A Random Forest trained on one staining profile consistently misclassified vessels on slides with different intensities. The classifier had learned a colour distribution, not a biological structure. Per-slide retraining was not scalable.

**2. Tissue boundary ambiguity**
Meningeal vessels and fat tissue artifacts produced false positives at a rate that required prohibitive manual correction. Without per-region annotation for every tissue class, the classifier had no principled separation criterion.

**3. Feature computation overhead**
Multi-scale feature map generation across 329 patches at required sigma values created a throughput bottleneck in QuPath's scripting environment.

---

## DAB Thresholding: Why It Survives the Same Variance

The apparent paradox — that a static threshold of 0.35 optical density units succeeded where a multi-feature classifier failed — resolves at the level of the colour space.

The Random Forest operated in RGB. In RGB, a lightly stained slide and a heavily stained slide produce materially different pixel values for the same biological structure. The classifier learned the RGB signature of DAB at a specific staining intensity — and that signature shifts across batches.

Colour deconvolution, implemented via the Ruifrok-Johnston method in QuPath, operates differently. It mathematically separates the DAB and haematoxylin chromogen channels by solving the Beer-Lambert law for the known absorbance spectra of each stain. The output is not a colour-shifted pixel value — it is an **optical density measurement**: a physical quantity proportional to the concentration of DAB chromogen per unit tissue area, independent of the absolute RGB values in the source image.

This is the key property: batch-to-batch staining variance manifests primarily as variance in RGB intensity. After Ruifrok-Johnston deconvolution, that same variance maps to a proportionally consistent optical density range for CD34-positive vasculature across all slides. The deconvolved DAB channel is not immune to staining variance — but it is highly resistant to the specific type of variance (illumination and batch intensity shift) that operates in RGB space and that destroyed the Random Forest classifier's cross-slide generalisation.

A threshold of 0.35 optical density units was calibrated simultaneously across all 7 slides. It held because the measurement domain — optical density — is anchored to chromogen concentration rather than raw colour values.

**Final configuration:**

```
Classifier:  CD34_DAB_Threshold
Feature:     Colour deconvolution — DAB channel (Ruifrok-Johnston)
Sigma:       4 (Gaussian pre-smoothing)
Threshold:   0.35 OD units
```

**Sigma selection:** Values from 1 to 8 were evaluated. Sigma 1–2 retained edge noise. Sigma 6–8 merged adjacent capillaries into single blobs, destroying the fine vessel morphology required for microvascular density quantification. Sigma 4 preserved capillary structure while suppressing background noise.

**Threshold calibration:** 0.35 OD was the highest value that maintained sensitivity for lightly stained capillaries across all 7 slides without generating false positives in haematoxylin-dense parenchyma.

---

## Edge Cases Requiring Manual Rules

Two tissue classes required explicit designation as `Background` — not by automated rule but by manual review per patch:

- **Meningeal vessels**: Large CD34-positive vessels in the meninges consistently exceeded the threshold but were not the target structure for microvascular density quantification.
- **Fat tissue artifacts**: Fat vacuoles near the threshold value due to processing artifacts were a consistent source of false positives.

One annotation constraint was enforced throughout: **partial vessel detections at patch borders were completed or deleted — never retained as fragments.** Partial boundary annotations teach the model that truncated vessel morphology is a valid class, introducing systematic inference errors at tile boundaries during prediction.

---

## Architectural Trade-offs: Thresholding vs. Active Learning

MONAI Label active learning — available as an extension within QuPath — was evaluated as an alternative annotation strategy. The active learning loop connects QuPath to a MONAI Label server, trains iteratively on annotated seed patches, and prioritises uncertain regions for human correction. In annotation-efficient scenarios, it can match exhaustive manual quality with significantly fewer labelled samples.

It was rejected for this pipeline on two grounds:

**No viable seed model.** Active learning requires a pre-trained model to initialise the uncertainty sampling loop. No CD34 vascular segmentation model trained on comparable tissue was available. Training from scratch on a small seed set in a high-variance staining environment would have produced unreliable uncertainty estimates in early loop iterations, concentrating annotation effort on model-confused regions rather than structurally important ones.

**Bootstrapping speed.** DAB thresholding reached calibrated, consistent mask quality across all 329 patches faster than the iterative correction cycles required to bootstrap an active learning loop from zero.

MONAI Label active learning is the appropriate architectural choice when a compatible seed model exists, staining consistency across slides is high, and the annotation team can sustain iterative correction cycles. For this bootstrapping phase — no seed model, 7 heterogeneously stained slides, 329 patches — thresholding was the correct decision.

A viable hybrid exists: use DAB thresholding to generate the seed annotation corpus, then transfer to MONAI Label active learning to refine structurally ambiguous regions — meningeal boundaries, partial vessels, and artifact-adjacent tissue — where thresholding error rates are highest.

---

## Decision Summary

| Criterion | Random Forest | DAB Thresholding |
|---|---|---|
| Cross-slide staining variance | Fails — RGB-dependent | Resistant — OD-space measurement |
| Tissue boundary ambiguity | Requires extensive annotation | Requires manual background rules |
| Computational overhead | High (multi-scale features) | Low |
| Interpretability | Low | High — single physical parameter |
| Bootstrapping speed | Slow | Fast |

For chromogenic IHC markers with known absorbance spectra — CD34, CD68, Beta-Amyloid — colour-deconvolved thresholding is the correct choice when staining batch consistency cannot be guaranteed and no seed model is available. The physics of optical density measurement is more stable across batches than any feature space a classifier learns from a single staining profile.

---
