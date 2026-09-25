import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack (default in Next 16) doesn't infer it
  // from a stray lockfile in a parent directory.
  turbopack: {
    root: __dirname,
  },
  // Alfred's route reads corpus/*.md from disk at runtime; tracing can't see a directory read.
  outputFileTracingIncludes: {
    "/api/alfred-cs": ["./corpus/**/*.md"],
  },
  // Removed technical notes: send old links to the notes section.
  async redirects() {
    return ["cd34-dab-thresholding", "wsi-tile-boundary", "mri-preprocessing-pipeline"].map((slug) => ({
      source: `/notes/${slug}`,
      destination: "/#documentation",
      permanent: true,
    }));
  },
};

export default nextConfig;
