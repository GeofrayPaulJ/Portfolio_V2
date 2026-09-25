export interface Skill {
  label: string;
  text: string;
}

// Rendered on the home page and the resume, in this order.
export const skills: Skill[] = [
  {
    label: "Medical image segmentation",
    text: "nnU-Net v2, nnSAM, HookNet. AIMS-TBI and TopAneu26; fetal MRI and whole-slide pathology at work.",
  },
  {
    label: "Image classification",
    text: "ConvNeXt ensembles (RARE26); gradient-boosted classifiers on vessel geometry (TopAneu26).",
  },
  {
    label: "Foundation models",
    text: "SAM, MedSAM, UNI, CONCH; LoRA fine-tuning. Work.",
  },
  {
    label: "Computational pathology",
    text: "Whole-slide image pipelines, IHC analysis, CD34 microvessel segmentation. Work.",
  },
  {
    label: "Neuroimaging",
    text: "MRI preprocessing, orientation checks, annotation quality control. Work.",
  },
  {
    label: "Evaluation",
    text: "Held-out-centre and external-cohort testing with near-duplicate-grouped splits (RARE26); bootstrap confidence intervals and a detection threshold fixed before test (AIMS-TBI).",
  },
  {
    label: "Deployment",
    text: "Docker inference containers within strict size and time limits; checksum-based provenance for reproducibility; DGX A100 at work.",
  },
  {
    label: "LLM engineering",
    text: "vLLM serving on a RunPod serverless endpoint (Mnemosyne); a Gemini agent over a full-context knowledge base with automated answer and number checks (this site); agentic development with Claude Code.",
  },
  {
    label: "Software",
    text: "Python, TypeScript; React, Next.js on Vercel, Expo; Django REST, Celery, Redis.",
  },
  {
    label: "Currently learning",
    text: "Slurm and Apptainer; computational radiology.",
  },
  {
    label: "Languages",
    text: "English, Tamil; Spanish (A2, working toward B1).",
  },
  {
    label: "Outside work",
    text: "Keyboard, upper intermediate; violin, beginner.",
  },
];
