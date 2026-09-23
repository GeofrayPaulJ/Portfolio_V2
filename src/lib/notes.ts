import fs from "fs";
import path from "path";

export interface NoteMetadata {
  number: string;
  title: string;
  tags: string[];
  readTime: string;
  description: string;
  slug: string;
  filename: string;
}

const notesMap: Record<string, NoteMetadata> = {
  "cd34-dab-thresholding": {
    number: "01",
    title:
      "Architectural Decision: Colour-Deconvolved DAB Thresholding vs. Random Forest for CD34 IHC Segmentation",
    tags: ["Computational Pathology", "IHC", "QuPath"],
    readTime: "5 min",
    description:
      "Why a static optical density threshold outperforms a multi-feature classifier when batch staining variance cannot be controlled.",
    slug: "cd34-dab-thresholding",
    filename: "technical-note-cd34-dab-thresholding.md",
  },
  "dgx-docker-tmux": {
    number: "02",
    title:
      "Containerising Persistent GPU Training on DGX A100 with Docker and tmux",
    tags: ["MLOps", "Infrastructure", "DGX A100"],
    readTime: "6 min",
    description:
      "How tmux, Docker volume mounts, and isolated Python environments keep training jobs alive across SSH disconnections and dependency conflicts.",
    slug: "dgx-docker-tmux",
    filename: "technical-note-dgx-docker-tmux.md",
  },
  "wsi-tile-boundary": {
    number: "03",
    title:
      "Eliminating Tile Boundary Artefacts in Gigapixel WSI Inference: Stride, Padding, and Gaussian Overlap Averaging",
    tags: ["Computational Pathology", "nnU-Net", "WSI"],
    readTime: "6 min",
    description:
      "The mathematics of overlapping tile inference and Gaussian-weighted reconstruction that eliminates vessel detection failures at patch boundaries.",
    slug: "wsi-tile-boundary",
    filename: "technical-note-wsi-tile-boundary.md",
  },
  "mri-preprocessing-pipeline": {
    number: "05",
    title:
      "A Four-Phase Preprocessing Pipeline for Post-Mortem Fetal MRI: From Raw DICOM to nnU-Net-Ready Volumes",
    tags: ["Computational Radiology", "MRI", "ANTsPy"],
    readTime: "8 min",
    description:
      "How pydicom, ANTsPy, SimpleITK, MONAI Label, and 3D Slicer are orchestrated into a researcher-facing pipeline that requires zero engineering knowledge to operate.",
    slug: "mri-preprocessing-pipeline",
    filename: "technical-note-mri-preprocessing-pipeline.md",
  },
  "ihc-platform": {
    number: "06",
    title:
      "Architecting a Multi-Marker IHC Analysis Platform for Gigapixel Pathology Workflows",
    tags: ["MLOps", "Django", "Celery", "WSI"],
    readTime: "7 min",
    description:
      "How a single React + Django + Celery platform routes four different model architectures behind one interface, and how we resolved container crashes under 150GB TIFF workloads.",
    slug: "ihc-platform",
    filename: "technical-note-ihc-platform.md",
  },
};

export function getNoteMetadata(slug: string): NoteMetadata | null {
  return notesMap[slug] ?? null;
}

export function getAllNoteSlugs(): string[] {
  return Object.keys(notesMap);
}

export function getNoteContent(slug: string): string | null {
  const meta = notesMap[slug];
  if (!meta || !meta.filename) return null;

  const corpusPath = path.join(process.cwd(), "tech notes", meta.filename);
  if (!fs.existsSync(corpusPath)) return null;

  return fs.readFileSync(corpusPath, "utf-8");
}
