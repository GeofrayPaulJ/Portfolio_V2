# AIMS-TBI 2026: Diagnosing the Recall Tail

**MICCAI 2026** · **Lesion detection and segmentation in moderate-to-severe TBI** · `Segmentation` `Detection` `nnU-Net`

---

## Result

8th of 22 entries on the final detection leaderboard; 11th of 17 on segmentation (official ranking announced 1 October 2026).

| Task | Final-phase scores |
|---|---|
| Detection | balanced accuracy 0.8457; sensitivity 0.8625; specificity 0.8289 |
| Segmentation | lesion-containing Dice 0.5048; HD95 30.7638 mm; ASSD 11.1496 mm |

Paper: "Diagnosing the Recall Tail: A Class-Imbalance Study of nnU-Net for Detection and Segmentation of Heterogeneous Moderate–Severe TBI Lesions" (sole author, independent researcher). Accepted; camera-ready submitted.

## The finding

What looked like poor lesion boundaries was a small-lesion recall tail.

Cross-validation covered 305 scored cases (ground-truth lesion over 50 voxels). Of these, 22 (7.2%) failed outright: 9 predicted nothing and 13 predicted in the wrong place. The other 283 had a median ASSD of 2.3 mm. Removing the 22 failures lowers mean ASSD from 8.55 mm to 6.19 mm while the median stays near 2.4 mm: the failures carry about a third of the mean. The ten worst cases carry 27.6% of total ASSD; the twenty worst, 42.9%.

The tail follows lesion volume. The failure rate falls from 27.9% in the smallest volume quintile to zero in the largest two. No failure occurs above the cohort median lesion volume of 2,034 voxels, and 17 of the 22 sit in the smallest quintile.

Three inexpensive interventions left the tail intact:

- Lowering the softmax threshold recovered no misses; an empty prediction has nothing below threshold to recover.
- Batch-pooled Dice recovered none either. Its gain came from lesion-free scans.
- Test-time mirroring gained +0.014 mean lesion Dice in cross-validation (95% CI +0.009 to +0.019). On the test set, Dice rose by only 0.0010 and HD95 improved by 0.55 mm, while ASSD worsened by 0.34 mm. Mirroring refines lesions already found.

## Approach

### Model and training

I trained a self-configuring nnU-Net (ResEnc-M preset, 3D, five-fold ensemble): patch 128 × 160 × 112, batch size 2, default Dice plus cross-entropy loss. A single 16 GB consumer GPU fixed ResEnc-M as the largest usable preset. Each fold ran 250 epochs, with the learning-rate schedule compressed to anneal fully at epoch 250: about 39 hours in total, against about 150 hours for the default 1,000-epoch schedule.

Data: 552 training subjects, 41.7% of them lesion-free, plus an independent held-out set of 102 labelled subjects.

### One model, two tasks

- **Segmentation:** 26-connected components, dropping those under 13 voxels. Never keep only the largest component: 83% of lesion-bearing subjects are multifocal.
- **Detection:** sum the surviving lesion volume above the 10-voxel scoring floor; a lesion is present if the total is at least τ = 100 voxels.

τ was fixed on out-of-fold predictions (balanced accuracy 0.859) and never tuned on a later set. On the held-out set it gave balanced accuracy 0.924; the optimum there (τ = 50, 0.950) was deliberately not taken, since it rested on a handful of small lesions in one sample.

Median inference is about 35 s per case on the organisers' evaluation GPU, against a 7-minute limit.

## Limitations

- The reduced 250-epoch schedule makes this a characterised baseline, not a ceiling.
- The batch-Dice result comes from a single fold.
- Diffusion data went unused, because the test set is T1-weighted only.

## Data acknowledgement

The data were provided through the AIMS-TBI 2026 Challenge and shared via the ENIGMA Brain Injury working group. The author thanks the challenge organisers at the University of Utah, the ENIGMA Brain Injury consortium and the contributing sites, and confirms the data were used solely for the challenge in accordance with the signed data use agreement.

## Links

- [AIMS-TBI 2026 challenge page](https://aims-tbi26.grand-challenge.org/)
- Paper: accepted; link to follow.
