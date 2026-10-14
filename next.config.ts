import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPagesBuild ? "/1" : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false,
  turbopack: { root: process.env.NEXT_TURBOPACK_ROOT ?? process.cwd() },
};

export default nextConfig;
