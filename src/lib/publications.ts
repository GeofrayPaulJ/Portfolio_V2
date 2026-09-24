export interface PublicationLink {
  label: string;
  href: string;
}

export interface Publication {
  authors: string;
  title: string;
  venue: string;
  links: PublicationLink[];
}

// Rendered on the home page and the resume, in this order.
export const publications: Publication[] = [
  {
    authors: "Geofray Paul J",
    title:
      "Diagnosing the Recall Tail: A Class-Imbalance Study of nnU-Net for Detection and Segmentation of Heterogeneous Moderate–Severe TBI Lesions",
    venue: "AIMS-TBI Workshop, MICCAI 2026. Springer LNCS, to appear.",
    links: [{ label: "Write-up", href: "/challenges/aims-tbi-2026" }],
  },
  {
    authors: "Geofray Paul J",
    title: "Your GPU Is Lying To You",
    venue: "MICCAI Educational Challenge 2026, finalist.",
    links: [
      { label: "Tutorial", href: "/notes/gpu-is-lying" },
      { label: "Code", href: "https://github.com/GeofrayPaulJ/MEC" },
    ],
  },
  {
    authors: "Geofray Paul J",
    title: "Below the Noise Floor",
    venue: "Method report, RARE26 challenge (EndoVis, MICCAI 2026), submitted.",
    links: [
      { label: "Write-up", href: "/challenges/rare26" },
      { label: "Code", href: "https://github.com/GeofrayPaulJ/rare26-submission" },
    ],
  },
];
