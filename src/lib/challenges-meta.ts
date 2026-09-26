export interface ChallengeMetadata {
  slug: string;
  name: string;
  context: string;
  result: string;
  // Résumé wording when it differs from the card result
  resumeLine?: string;
  finding: string;
  tags: string[];
  readTime: string;
  filename: string;
}

export const challenges: ChallengeMetadata[] = [
  {
    slug: "aims-tbi-2026",
    name: "AIMS-TBI 2026",
    context: "MICCAI 2026 · Lesion detection and segmentation in moderate–severe TBI",
    result:
      "8th of 22 entries on the final detection leaderboard; 11th of 17 on segmentation (official ranking announced 1 October 2026)",
    finding:
      "What looked like poor lesion boundaries was a small-lesion recall tail: 7.2% of cases failed outright, none above the median lesion volume, and removing them lowered mean surface distance from 8.55 to 6.19 mm.",
    tags: ["Segmentation", "Detection", "nnU-Net"],
    readTime: "3 min",
    filename: "aims-tbi-2026.md",
  },
  {
    slug: "mec-2026",
    name: "MICCAI Educational Challenge 2026",
    context: "MICCAI 2026 · Tutorial: Your GPU Is Lying To You",
    result: "Finalist",
    finding:
      "Six instruments reported success while being wrong, and almost none of them needed real data to catch.",
    tags: ["Education", "Verification", "MLOps"],
    readTime: "3 min",
    filename: "mec-2026.md",
  },
  {
    slug: "topaneu26",
    name: "TopAneu 2026, Task 2",
    context: "MICCAI 2026 · Vessel-specific intracranial aneurysm segmentation",
    result: "10th of 30 entries, Task 2 final test phase",
    finding:
      "Detection was not the bottleneck: most errors were lesions found correctly and then assigned to the wrong vessel, concentrated in sites with fewer than ten training examples.",
    tags: ["Segmentation", "Vessel Labelling", "nnU-Net"],
    readTime: "3 min",
    filename: "topaneu26.md",
  },
  {
    slug: "rare26",
    name: "RARE26",
    context: "MICCAI 2026, EndoVis · Barrett's neoplasia classification at 1:100 prevalence",
    result: "Open Development phase · AUROC 0.6466, PPV@90Recall 0.0113",
    resumeLine: "five-model ConvNeXt ensemble for Barrett's neoplasia detection; method report submitted; co-author of the organisers' challenge overview paper (in preparation).",
    finding:
      "A domain-generalised ConvNeXt ensemble; both internal estimates overshot the platform result, the held-out-centre estimate least.",
    tags: ["Classification", "Domain Generalisation", "Endoscopy"],
    readTime: "3 min",
    filename: "rare26.md",
  },
];

export function getChallengeMetadata(slug: string): ChallengeMetadata | null {
  return challenges.find((challenge) => challenge.slug === slug) ?? null;
}
