# TopAneu 2026, Task 2: Detection Was Not the Bottleneck

**MICCAI 2026** · **Vessel-specific intracranial aneurysm segmentation** · `Segmentation` `Vessel Labelling` `nnU-Net`

---

## Result

10th of 30 entries, Task 2 final test phase: mean position 10.1 across seven metrics. Team Prometheus, solo entrant.

| Metric | Value |
|---|---|
| Dice | 0.1521 (winning entry: 0.2632) |
| Precision | 0.4367 |
| F1 | 0.3110 |
| Recall | 0.3499 |
| MCC | 0.4435 |
| VolSim | 0.1699 |
| HD95 | 226.7214 |

Task 1: pending. The organisers populate Task 1 from the Task 2 submission, and that fusion is in progress. This entry is not a publication.

## The finding

Detection was not the bottleneck: most errors were lesions found correctly and then assigned to the wrong vessel, concentrated in sites with fewer than ten training examples.

Out-of-fold Task 1 MCC was 0.2040 (324 cases, official evaluation code). Stage 2 alone reached 0.2481 under grouped five-fold cross-validation, an upper bound because it was scored against ground-truth vessel masks. Nine of the 52 classes have no support anywhere in the released training data, and the official metric divides by all 52.

More examples of rare sites would help. More detection capacity would not.

## Approach

### Stage 1: detection

I trained two nnU-Net v2 models, one each for CTA and MRA (ResEnc-M preset, 3d_fullres, 500 epochs, five folds each). At inference, the image's minimum intensity selects the model, and all five folds are ensembled.

Test-time mirroring is off: it changed no downstream decision on any case tested, yet consumed 66 to 75% of the stage's runtime. Fold outputs are accumulated into one aneurysm channel before resampling to the input geometry, which keeps peak host memory inside the platform's 32 GB ceiling.

Candidates are connected components of at least 1.0 mm³: in the training data, the largest speckle was 0.55 mm³ and the smallest genuine lesion 1.41 mm³.

### Vessel context

Vessel labels come from the organisers' publicly released TopBrain vessel model (Zenodo record 21959166, CC-BY-4.0): ResEnc-M member only, inference only. It replaced an in-house vessel head, which reproduced ground-truth laterality on 52% of instances against 99.28% for the organisers' model. Every vessel mask used to fit Stage 2 was regenerated through the same model and code path.

### Stage 2: assignment

All features are laterality-invariant:

- each lateralised vessel type, expressed as ipsilateral, contralateral or unlateralised relative to the lesion
- nearest vessel label and distance
- normalised anterior-posterior and superior-inferior position
- distance from the midline, volume and modality
- a geodesic position along the parent vessel, from its skeleton graph

A gradient-boosted classifier predicts a 28-way delateralised site, and the 52-class label is reassembled with the geometrically derived side.

A second gradient-boosted model rejects false positives. I raised its threshold after the preliminary leaderboard showed HD95 dominated by single distant false positives, which the internal metric had compressed. The change removed them without losing a true positive.

### Runtime

218 s per CTA case on the target evaluation GPU, against a 720 s limit, with peak host memory 10.2 GiB and peak GPU memory 6.5 GiB.

## Limitations

Stage 1 was not retrained after the September 2026 dataset revision, which touched 19 of 389 instances, nearly all relabels. Stage 2 was refitted on the corrected labels.

## Links

- [TopAneu 2026 challenge page](https://topaneu-26.grand-challenge.org/)
