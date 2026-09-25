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
      "Containerising Persistent GPU Training on DGX A100 with Docker and tmux",
    tags: ["MLOps", "Infrastructure", "DGX A100"],
    readTime: "6 min",
    description:
      "How tmux, Docker volume mounts, and isolated Python environments keep training jobs alive across SSH disconnections and dependency conflicts.",
    slug: "dgx-docker-tmux",
    filename: "technical-note-dgx-docker-tmux.md",
  },
  {
    number: "02",
    title:
      "Architecting a Multi-Marker IHC Analysis Platform for Gigapixel Pathology Workflows",
    tags: ["MLOps", "Django", "Celery", "WSI"],
    readTime: "7 min",
    description:
      "How a single React + Django + Celery platform puts three model architectures behind one interface, with beta-amyloid planned, and how we resolved container crashes under 150GB TIFF workloads.",
    slug: "ihc-platform",
    filename: "technical-note-ihc-platform.md",
  },
  {
    number: "03",
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
