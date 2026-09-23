# Your GPU Is Lying To You

### And so is your test harness, your docstring, your validation set, and your cross-validation.

*Notes from building and submitting containers to a MICCAI 2026 challenge.*

*Submission to the MICCAI Educational Challenge 2026 (finalist). AI assistance disclosure at the end.*

---

## The tutorial I meant to write

In June and July 2026 I built and submitted containers to the AIMS-TBI challenge: traumatic brain injury lesion detection and segmentation on T1-weighted MRI. The detection container reached **0.846 balanced accuracy** on the official test set (sensitivity 0.863, specificity 0.829) and placed 8th on the public final detection leaderboard (preliminary). The segmentation container reached **0.5048 Dice** on lesion-containing scans.

That's the last time I'll mention the result. It's here only so you know the rest of this is worth trusting.

I meant to write a tutorial about Docker: the rejected builds, the platform validation failures, the string of attempts before the image finally ran. When I went back through the repository to piece that history together, I found something I didn't expect. **The Dockerfile was written once**, on 29 June at 10:22, thirty-four minutes after I checked out the starter kit, and never edited again. Container work continued for another seventeen days after that. All four Dockerfiles in the project are byte-identical, and not one submission was ever rejected by the platform.

The image definition was not the hard part.

What actually consumed those seventeen days was less obvious, and worse. Six separate instruments reported success while being wrong. Each one is a specific, reproducible trap, and together they add up to the real lesson here: this is a story about measurement, not about containers.

| # | The instrument | What it reported | What was true |
|---|---|---|---|
| 1 | The GPU | `torch.cuda.is_available()` → `True` | Every kernel launch failed; silent CPU fallback |
| 2 | Local timings | 175–433 s per case | ~35 s on the target GPU, and 433 s exceeds the 420 s limit |
| 3 | The test harness | Four `FileNotFoundError` tracebacks | The container was correct on all four cases |
| 4 | A docstring | "on ANY exception → all-background mask" | The read that could raise sat above the `try` |
| 5 | The validation set | A file named for 100 cases | 103 images, 102 labels, one degenerate, one impossible label |
| 6 | Cross-validation | +0.014 Dice, 95% CI [+0.009, +0.019] | +0.0010 on test, and the target metric moved the wrong way |

They escalate. The first is a hardware quirk you can fix in ten lines. The last cost me a submission.

---

## 1. Your GPU is lying to you

I develop on a 16 GB consumer GPU with compute capability sm_120. The challenge platform runs an NVIDIA T4. I pinned the base image to `pytorch/pytorch:2.5.1-cuda12.4-cudnn9-runtime` because that build supports the T4 and loads my checkpoints. The container then produced this on my development machine:

```
UserWarning: NVIDIA GeForce [GPU model redacted] with CUDA capability sm_120 is not
compatible with the current PyTorch installation. The current PyTorch install
supports CUDA capabilities sm_50 sm_60 sm_70 sm_75 sm_80 sm_86 sm_90.

CUDA present but unusable (CUDA error: no kernel image is available for
execution on the device); falling back to CPU.
Using CPU device.
perform_everything_on_device=True is only supported for cuda devices!
Setting this to False
```

That card is compute capability sm_120. The CUDA 12.4 build tops out at sm_90. This isn't a bug, and there's no version bump that fixes it, because **the pin was correct**. Pinning for the deployment target necessarily broke local execution. If you develop on a current-generation card and you're targeting datacentre hardware from a previous generation, you will meet this, and you should expect to meet it permanently.

The dangerous part is the guard everyone writes:

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
```

**`torch.cuda.is_available()` returns `True` here.** The driver is present, the runtime initialises, the device enumerates. Nothing fails until a kernel actually launches. That one line is probably the single most widely copied device check in medical imaging code, and it's worthless in exactly the case where you need it.

The fix is to stop asking and start testing:

```python
def _select_device():
    """Use CUDA only if a real GPU op actually succeeds.

    The challenge runner is an NVIDIA T4 (supported). On a dev box whose GPU is
    too new for this torch build, torch.cuda.is_available() may be True yet
    kernels fail -- so we probe with a tiny matmul and fall back to CPU.
    """
    if torch.cuda.is_available():
        try:
            _ = (torch.randn(8, 8, device="cuda")
                 @ torch.randn(8, 8, device="cuda")).sum().item()
            return torch.device("cuda")
        except Exception as e:
            print(f"CUDA present but unusable ({e}); falling back to CPU.")
    return torch.device("cpu")
```

Eight by eight. Microseconds. It runs once at startup, and it's the difference between a container that degrades gracefully and one that dies on an unfamiliar runner.

### The consequence that nearly ended the submission

Silent fallback isn't merely slow. It corrupts every measurement taken downstream of it.

The challenge allowed **420 seconds per case**. My local runs measured **175–185 s** in the detection harness and, in a later parity check, **325–433 s** for detection and **244–380 s** for segmentation.

433 seconds exceeds 420 seconds. On paper I'd already blown the limit and didn't know it, because those numbers came from a CPU I was never going to deploy on. The real figure on the T4 was about **35 s per case**, and roughly **90 s** with test-time augmentation enabled, comfortably inside the limit either way.

Had the platform provisioned anything other than the GPU I'd pinned for, that submission would have timed out. I'd have spent the remaining attempt debugging a performance problem that didn't exist.

> **Never accept a timing measurement without first proving which device produced it.** Print the device at the top of every run. If the number came from a fallback path, it's not a measurement. It's noise with units attached.

---

## 2. Your test harness is lying to you

My detection container was tested against four cases: a scan with a lesion, a scan without, a boundary case, and a deliberately corrupted file. The harness reported a `FileNotFoundError` traceback on all four.

```
--- OUTPUT FILE: brain-lesion-presence.json
--- RAW JSON BYTES: 00000000: 7472 7565                                true
--- JSON PARSE CHECK: Traceback (most recent call last):
  File "<string>", line 1, in <module>
FileNotFoundError: [Errno 2] No such file or directory:
  '/d/aimstbi/detection_container/test/output/brain-lesion-presence.json'
```

Read the line directly above the traceback. `7472 7565` is ASCII `true`. The output file existed, contained a valid bare JSON boolean, and was exactly four bytes as the specification required. **The container was correct on all four cases.** The harness was checking a hardcoded absolute path from before I reorganised the project directory, so it was looking in a folder that no longer existed.

Two things are worth pulling out of this.

First, the hexdump saved me. Had the harness only reported pass or fail, I'd have spent hours debugging output writing in a container that was writing output perfectly. **Dump the artefact before you validate it.** Four bytes of hex are cheaper than an afternoon.

Second, and this is the uncomfortable part: this failure is still sitting in my repository, unfixed, in both copies of the harness. I never fixed it because I'd already read past it. That's precisely how a broken test survives, not by hiding, but by being loud in a way you eventually learn to ignore.

> A test that fails against correct code is worse than no test. It trains you to disregard your own alarms.

---

## 3. Your docstring is lying to you

The corrupted-file fixture is 220 bytes: a `.mha` truncated on purpose. My detection container handled it exactly as intended.

```
########## CASE FALLBACK_corrupt  (corrupt.mha) ##########
MetaImage: M_Read: Error parsing file
DETECTION PIPELINE FAILED -- writing FALSE (definite negative):
Traceback (most recent call last):
    present = predict_presence(input_file)
RuntimeError: Exception thrown in SimpleITK ImageFileReader_Execute: /tmp/SimpleITK-build/ITK/Modules/IO/Meta/src/itkMetaImageIO.cxx:101:
Wrote /output/brain-lesion-presence.json = False
--- ELAPSED[FALLBACK_corrupt] = 2 s
```

Two seconds, against 175–185 s for real cases. It failed at the read, never reached the model, wrote a valid negative, and exited zero. That's what crash-safety looks like.

Five days later I ran the same fixture through the **segmentation** container, which shared the same Dockerfile, the same base image and the same weights. It **crashed: exit 1, no mask written.**

The root cause was one line of vertical distance:

```python
# line 115
img = SimpleITK.ReadImage(input_file)
# line 117
try:
    ...
```

`segment_image()` carried a docstring promising *"on ANY exception → all-background mask."* The read most likely to raise sat outside the `try` that was supposed to catch it. The guarantee had been written before the code actually satisfied it, and nothing between the two ever checked.

On a scoring board, a crash isn't a low score. It's the worst possible rank for that case, and on some platforms it fails the entire submission.

The fix took one line. I rebuilt and verified against the pre-fix container to confirm nothing else had moved:

```
scan A (large lesion): native 83211 vox vs container 83222 vox, Dice 0.9998
scan B (absent)      : native 15 vs container 15, Dice 1.0000 (exact)
corrupt .mha         : exit 0, valid all-background int8 256^3 mask
                       (previously exit 1 / no mask)
```

That last case needed a default geometry, because when the read fails there's no header left to copy: a 256³ 1 mm isotropic volume, all background. An empty mask with plausible geometry scores zero. A crash scores worse than zero.

> **Test the adversarial input, not the happy path.** The happy path is what you built; you already know it works. Detection and segmentation shared a Dockerfile, a base image and a model, and differed only in one Python file, and that one file was the difference between graceful degradation and a dead container. Robustness lives in application code, not in the image.

---

## 4. Your validation data is lying to you

I was given a file called `Validation2025_100.zip`. It contained **103 images and 102 labels.**

One image was all zeros, maximum intensity around 9e-41 (a rounding artefact rather than anatomy), and carried no label at all. I kept it as a quality-control case and excluded it from scoring. It doubles as a free corrupt-input fixture.

The more instructive anomaly was a ground-truth file containing **label value 6**, occupying 6,700 voxels alongside 1,748 voxels of label 1. All 552 training labels are strictly `{0, 1}`. Value 6 doesn't exist anywhere in the task definition.

My model segmented that region correctly. What it scored depended entirely on a convention buried in the evaluation code:

| Foreground convention | Dice on the same prediction |
|---|---|
| `label == 1` | **0.219** |
| `label > 0` | **0.790** |

A swing of 0.571 Dice on an identical prediction, decided by one comparison operator. Had I averaged across cases without inspecting this one, that single file would have dragged my reported performance down and I'd have gone looking for the fault in my model instead of my evaluation code.

> Before you compute a single metric: count the files, check that images and labels correspond, take the maximum and minimum intensity of every volume, and enumerate the unique values in every ground-truth label. It takes minutes. The filename isn't a specification. It's a hint.

---

## 5. Your calibration is lying to you

Detection worked by segmenting, then thresholding on the predicted lesion volume: any case with more than τ foreground voxels is positive. I calibrated τ on held-out data, where the sweep was unambiguous. **τ* = 50 was worth +0.027 balanced accuracy** over the τ = 100 I'd deployed.

The reasoning behind that optimum was that specificity had saturated at **0.958**, so the only remaining gains were in sensitivity, and lowering the threshold buys sensitivity.

On the official test set, specificity was **0.829**.

The premise had collapsed. Specificity wasn't saturated, it was binding. It was now the weaker of the two numbers, and lowering τ trades away exactly the quantity I could least afford, for a quantity the test distribution didn't reward.

The challenge allowed two submissions per task, so rather than argue about it I just uploaded the τ = 50 container. **It scored 0.0010 lower than τ = 100.** A calibration that promised +0.027 delivered −0.0010. Not a smaller gain. The wrong sign.

> A calibrated operating point is a claim about a distribution, not a property of your model. It only transfers as far as the distribution does. If your calibration rests on one metric having saturated, write that assumption down explicitly, because it's the thing most likely to be false on the test set. It'll fail silently too, since a threshold never raises an exception.

---

## 6. Your cross-validation is lying to you

This is the one that cost me a submission, and it's the one I'd most like other people to avoid.

The question was whether to enable test-time augmentation (mirroring) in the five-fold ensemble. I evaluated it properly: every other setting fixed, 302 cases carrying a ground-truth component above 50 voxels, explicit assertions against fold leakage.

The result was as clean as this kind of evidence ever gets:

- **+0.014 mean lesion Dice**
- bootstrap 95% CI **[+0.009, +0.019]** (excludes zero)
- **207 of 302 cases improved**, 67 worsened

I'd have accepted that from a reviewer, and I'd have accepted it from myself. Here's what it produced on the official test set:

| Metric | TTA off | TTA on | Change |
|---|---|---|---|
| Dice | 0.5038 | 0.5048 | **+0.0010** |
| HD95 | 31.32 mm | 30.76 mm | −0.55 mm |
| ASSD | 10.81 mm | **11.15 mm** | **+0.34 mm, worse** |

+0.014 Dice became +0.0010. Fourteen times smaller. And ASSD, the metric I'd spent an entire earlier investigation trying to repair, the one my first submission had been penalised most heavily on, moved in the wrong direction.

The mechanism was visible in the cross-validation data all along, in a sentence I'd written seventeen days earlier and then failed to actually apply:

> These are **raw** CV predictions [...] It does **not** fix the misses.

Mirroring sharpens predictions on lesions the model has already located. It doesn't help on lesions the model missed entirely. Dice averages over cases and rewards that; surface-distance metrics are dominated by the cases where the prediction is in the wrong place, and mirroring does nothing there. Worse, the case-level detail showed the failure mode directly: one complete miss recovered to a Dice of 0.085, two further cases collapsed to **zero**, and the total count of Dice-zero cases **rose** rather than fell. A mean improvement was hiding a distributional worsening at the tail, which is exactly the tail that surface metrics measure.

It also cost roughly **5.8× the runtime** (1.7–1.9 s per case became 10.4–11.8 s in the gate tests) for +0.0010.

> **A confidence interval tells you your estimate is stable. It doesn't tell you the estimate transfers.** Before you spend a submission on a cross-validation gain, ask which cases produced it and whether those are the cases your target metric actually weights. If the gain is concentrated in cases you already handle well, and your metric is dominated by cases you handle badly, the interval is measuring something real and irrelevant.

---

## 7. Why this tutorial ships fake data

Everything I've described here was learned on data I can't give you.

That's the ordinary condition of this field, not a special circumstance of mine. Whether it's challenge data under a participation agreement, brain histopathology, or clinical MRI under an institutional data use agreement, the material that teaches you the most is usually exactly the material you're contractually forbidden to redistribute. My own workspace was torn down under such an agreement in July: eighty-four gigabytes deleted, every container tarball with it. The lessons survived. The evidence did not.

This creates a structural problem for reproducibility that I don't think the field talks about honestly enough. Tutorials that depend on restricted data are unrunnable by their readers, so they get read rather than executed, and the reader learns nothing they couldn't have gotten from a summary. The usual workaround is to gesture at a public dataset that resembles the private one, which just imports a second set of assumptions to paper over the first.

There's a better answer, and it falls straight out of the six failures above: **almost none of them required real data to detect.**

The device probe needs no data at all. The corrupt-input contract test needs a truncated file: a valid header and 220 bytes of nothing. The geometry check needs any volume with a non-identity direction cosine matrix. The label-value audit needs a label array. Every one of these is satisfiable by a synthetic fixture generated in a dozen lines of SimpleITK, and honestly a synthetic fixture is *better* for a tutorial than a real one, because the reader can run it in sixty seconds without an account, an application, or a download.

Real data is required to measure whether your model is good. It's not required to verify that your container is honest. Those are separate problems, and conflating them is a lot of why so much of this work goes unverified.

The accompanying repository does exactly that: pinned dependencies, synthetic fixtures, a device probe and a container contract test, all runnable with no weights, no GPU, and no agreement to sign.

---

## 8. Preflight checklist

Ten checks, one per failure, in roughly the order they'll bite you.

1. **Probe the GPU with a real kernel launch**, not `torch.cuda.is_available()`. Print the selected device at startup.
2. **Discard any timing measured on a fallback path.** Record the device alongside every timing number, or the number means nothing.
3. **Hexdump the output artefact before parsing it.** Validate the bytes, then validate the structure.
4. **Never hardcode absolute paths in a test harness.** They survive directory reorganisations by pointing at nothing.
5. **Put the input read inside the `try` block.** The read is the most likely thing to raise, and the most commonly left outside it.
6. **Define a default output geometry** for the case where the read failed and there's no header to copy.
7. **Test a deliberately corrupted input** and require exit 0 with a valid, empty result. Compare every container in your submission against the same fixture; they will not behave alike.
8. **Audit the dataset before the first metric**: file counts, image-to-label correspondence, intensity ranges, and the set of unique label values.
9. **Write down the assumption behind every calibrated threshold.** If it's "metric X has saturated", treat that as the first thing the test set will falsify.
10. **Interrogate which cases produced a cross-validation gain** before spending a submission on it. Check whether the count of catastrophic failures went up while the mean went up.

Two more things that cost me time but didn't fit the narrative above.

**Pin the base image tag.** The starter kit shipped `FROM pytorch/pytorch` untagged, which isn't a build, it's a lottery. After pinning, the resolved digest was identical across builds twelve days apart. That digest match is the evidence the pin held, and it belongs in your build log.

**Pin your dependencies more thoroughly than you think you have.** My `requirements.txt` pinned four packages and left `scipy` floating. It resolved to 1.17.1 that week and wouldn't necessarily resolve there today. Below the direct dependencies, `nibabel`, `scikit-image`, `batchgenerators` and four others were never pinned at all, and Python 3.11 was only pinned implicitly, through the base image tag. My training environment ran torch 2.11+cu128 while the container ran 2.5.1+cu124, a two-version gap I never intended and only bounded after the fact, with a parity test that put it at Dice 0.9998 against native output. That number is small. It was luck, not design.

---

## 9. What I couldn't recover

I reconstructed the timeline above from a repository that turned out to be a shallow clone of the organiser's starter kit, with exactly one commit, authored by the organiser. None of my seventeen days of work was ever committed. `git log` on the Dockerfile returns a single upstream revision.

What saved this account was that I'd, for unrelated reasons, kept numbered experiment folders with build logs, run logs and dated write-ups. Everything in this tutorial comes from those. Everything not in those is simply gone: the intermediate Dockerfile revisions, the exact stderr of four of the failures, the fixed calibration script that lived in a scratch directory, and the date of every submission, because I never saved a receipt.

I've marked the gaps rather than filling them, which is the only defensible way to write this kind of document.

The correction is trivial, and I'll offer it as the last item on the checklist. **Initialise a repository in your build context and commit it, today.** Two minutes, and it's the difference between a reconstruction that takes four hours and one that takes four seconds. It's also the difference between a post-mortem you can actually write and one you can't.

---

## Repository

Repository: to be published.

## AI assistance disclosure

I used a large language model (Claude) in two ways. First, to reconstruct a chronological failure log from my own repository: reading build logs, run logs and write-ups, extracting verbatim error text, and computing dates and counts from file metadata. Second, for structural editing of this article and for drafting assistance in the accompanying repository.

The work itself, the containers, the experiments, the failures, the fixes, the calibration decisions, the submissions, is entirely my own and predates any of that assistance. Every error message and every figure quoted here is copied verbatim from logs generated in June and July 2026. In this copy, one GPU model name has been redacted from a quoted log; nothing else in any quoted log has been altered. Where a record didn't survive, the text says so rather than reconstructing it. No error text in this article was generated by a language model.

*Case identifiers have been anonymised. Per-case figures are reported without scan identifiers.*