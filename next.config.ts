import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  // Allow all hosts for live preview
  experimental: {
    // Some versions of next might need this, but usually just binding to 0.0.0.0 is enough
  }
};

export default nextConfig;
