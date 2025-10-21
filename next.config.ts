import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  // Fix for negative timeout warning in Next.js 15
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  webpack: (config) => {
    config.resolve.alias = config.resolve.alias ?? {};
    config.resolve.alias["react-toastify"] = path.resolve(
      __dirname,
      "lib/toast"
    );
    return config;
  },
};

export default nextConfig;
