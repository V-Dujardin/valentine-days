import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output:"export",
  basePath: "/valentine-days",
  assetPrefix: "/valentine-days/",
  images : {
    unoptimized: true,
  }
};

export default nextConfig;
