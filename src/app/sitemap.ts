import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { challenges } from "@/lib/challenges-meta";
import { notes } from "@/lib/notes-meta";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/resume`, changeFrequency: "monthly", priority: 0.9 },
    ...challenges.map((c) => ({
      url: `${SITE_URL}/challenges/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...notes.map((n) => ({
      url: `${SITE_URL}/notes/${n.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
