import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias = config.resolve.alias ?? {};
    config.resolve.alias["react-toastify"] = path.resolve(__dirname, "lib/toast");
    return config;
  },
};

export default nextConfig;
