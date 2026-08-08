import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a self-contained server bundle — needed for a lean Docker image
  output: "standalone",
  // Don't let the bundler touch these — they resolve internal files (e.g.
  // axe-core's source, Playwright's browser binaries) via require.resolve
  // at runtime, which breaks if Turbopack/webpack tries to bundle them.
  serverExternalPackages: ["playwright-core", "@axe-core/playwright"],
  // Skip TypeScript errors on Vercel build (we verify locally)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip ESLint on build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
