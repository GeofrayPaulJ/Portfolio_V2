import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Résumé",
  description:
    "Résumé of Geofray Paul J, AI engineer in medical imaging: experience, MICCAI 2026 challenge entries, papers and reports, skills and education, with industry and academic PDF versions.",
  alternates: { canonical: "/resume" },
  openGraph: { ...OG_DEFAULTS, url: "/resume", title: "Résumé | Geofray Paul J" },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
