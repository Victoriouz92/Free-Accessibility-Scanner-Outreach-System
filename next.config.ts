import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
