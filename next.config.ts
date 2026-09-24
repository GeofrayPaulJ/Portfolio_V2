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
};

export default nextConfig;
