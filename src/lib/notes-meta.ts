export interface NoteMetadata {
  number: string;
  title: string;
  tags: string[];
  readTime: string;
  description: string;
  slug: string;
  filename: string;
}

export const notes: NoteMetadata[] = [
  {
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
  {
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
  {
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
  {
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
  {
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
  {
    number: "07",
    title: "Your GPU Is Lying To You",
    tags: ["MLOps", "Containers", "Verification"],
    readTime: "16 min",
    description:
      "Six instruments that reported success while being wrong during a MICCAI 2026 challenge submission, and a ten-point preflight checklist that catches each one without restricted data.",
    slug: "gpu-is-lying",
    filename: "technical-note-gpu-is-lying.md",
  },
];

export function getNoteMetadata(slug: string): NoteMetadata | null {
  return notes.find((note) => note.slug === slug) ?? null;
}
