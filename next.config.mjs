// next.config.mjs

import { buildRemotePatterns } from "./src/lib/domainConfig.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 5184000,

    remotePatterns: [
      ...buildRemotePatterns(),
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "drive.google.com", pathname: "/**" },
    ],
  },

  cacheComponents: true,
  experimental: {
    optimizeCss: true,
  },

  async redirects() {
    return [
      { source: "/:path+/", destination: "/:path+", permanent: true },
      { source: "/home", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;