# RARE26: Below the Noise Floor

**MICCAI 2026** · **Barrett's neoplasia classification at low prevalence** · `Classification` `Domain Generalisation` `Endoscopy`

---

## Result

**Open Development phase, on the platform:** AUROC 0.6466; PPV@90Recall 0.0113.

At the time, the field's ten highest visible entries ranged from PPV@90Recall 0.0243 to 0.0332.

Co-author, as a participating team and at the organisers' invitation, of the organisers' journal article summarising the RARE26 challenge (in preparation).

RARE26 (Recognition of Abnormalities in low-pREvalence cancer) is part of EndoVis at MICCAI 2026. The task is to classify Barrett's oesophagus endoscopy images as neoplastic or non-dysplastic. Scoring is positive predictive value at 90% recall (PPV@90Recall) under simulated 1:100 prevalence: a ranking metric whose threshold is set by the lowest-scoring positives. I entered as an independent researcher.

## The finding

Both internal estimates overshot the platform result (PPV@90Recall 0.0113): pooled out-of-fold by about sevenfold, leave-one-centre-out by two- to threefold. Pooled cross-validation was the more misleading estimate under the shift between centres.

In July, before any leaderboard existed, I projected PPV@90Recall onto the test set's 1:100 shape. The pooled out-of-fold projection gave 0.0782; the two leave-one-centre-out directions gave 0.0252 and 0.0333. With 158 training positives, the held-out-centre estimates had the wider uncertainty but overshot less.

## Approach

### Model

The method is "Below the Noise Floor: A Domain-Generalised ConvNeXt Ensemble for Barrett's Neoplasia Detection", named A4-corrected: a five-member ConvNeXt-Base ensemble (timm, ImageNet-1k initialised, seeds 0 to 4) with 87,567,489 parameters per member. Members are fused by averaging raw pre-sigmoid logits.

Input is 384 × 384 RGB. A circular field-of-view detector crops the largest inscribed square, with a centred-square fallback when the fit is low-confidence.

### Domain generalisation

Augmentation runs at 2 to 3 times typical magnitude, to reduce reliance on acquisition-centre shortcuts:

- colour, white-balance and hue-saturation jitter
- vignetting and specular highlights
- motion and defocus blur, and sensor noise
- downsample-upsample cycling and JPEG re-compression
- border randomisation

### Training

A centre-and-class-balanced sampler handles class imbalance; the loss is plain binary cross-entropy with no class weighting. I trained with AdamW (learning rate 1e-4, weight decay 0.05), 3% linear warm-up then cosine decay, batch size 38, for 30 epochs. Training used bf16 with an fp32 classification head (a bf16 head collapsed the logit range). Inference runs in fp16, with Spearman 0.9999 against bf16.

No additional training data was used. A 100-image external out-of-domain cohort served for evaluation only.

### Validation

Model selection used stratified group five-fold cross-validation. With no patient identifiers in the release, groups came from perceptual-hash near-duplicate linkage, to keep near-duplicate frames from straddling a split. Leave-one-centre-out (train on one centre, test on the other) served as a harder secondary check.

- Pooled out-of-fold: AUROC 0.9614 (95% CI 0.9410 to 0.9782); FPR@90Recall 0.1300.
- Leave-one-centre-out: AUROC 0.9363 and 0.9611.
- External cohort: AUROC 0.972.

## Limitations

- The twelve-centre platform AUROC (0.6466) is 0.31 below the pooled estimate (0.9614). The cause is unresolved after ten tested hypotheses.
- On correction, the acceptance statistic I used during six weeks of component screening was uncalibrated: a measure of spread, not a significance threshold. Most component-selection decisions, including the acceptance of the submitted configuration, therefore cannot be distinguished from noise at this sample size (158 training positives).

## Links

- [RARE26 challenge page](https://rare26.grand-challenge.org/)
- [Code repository](https://github.com/GeofrayPaulJ/rare26-submission)
