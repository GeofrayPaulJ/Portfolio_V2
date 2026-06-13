import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack (default in Next 16) doesn't infer it
  // from a stray lockfile in a parent directory.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
