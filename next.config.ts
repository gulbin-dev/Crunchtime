import type { NextConfig } from "next";
import withPlaiceholder from "@plaiceholder/next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    deviceSizes: [300, 780, 1080, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "api.themoviedb.org",
        pathname: "/3/genre/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "gravatar.com",
        pathname: "/avatar/**",
      },
    ],
  },
  cacheComponents: true,
  deploymentId:
    process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 32) ||
    process.env.GITHUB_SHA?.slice(0, 32) ||
    "local-build",
  turbopack: {},

  async rewrites() {
    // If the feature is disabled, rewrite the route to a 404 page
    if (process.env.NEXT_PUBLIC_FEATURE_CATALOG_FLAG !== "true") {
      return {
        beforeFiles: [
          {
            source: "/catalog/:path*",
            destination: "/404",
          },
        ],
      };
    }
    return [];
  },
};

export default withPlaiceholder(nextConfig);
