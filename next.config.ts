import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true // TODO: remove before PR
  },
  eslint: {
    ignoreDuringBuilds: true // TODO: remove before PR
  }
};

export default nextConfig;
