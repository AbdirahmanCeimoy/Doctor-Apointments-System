import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  // Use absolute path for Turbopack root to avoid navigation errors
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
