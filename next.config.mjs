// next.config.mjs
import { buildRemotePatterns } from "./src/lib/domainConfig.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  httpAgentOptions: { keepAlive: true },

  images: {
    // ✅ WebP + AVIF — modern browsers ke liye faster images
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
    remotePatterns: [
      ...buildRemotePatterns(),
      // ── Image CDNs ───────────────────────────────────────────────────────
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "**", // or specific domain (recommended below)
      },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "fastly.picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },
      // ── Supabase Storage — project subdomains ────────────────────────────
      // Covers https://<project-ref>.supabase.co/storage/v1/object/public/...
      { protocol: "https", hostname: "*.supabase.co", pathname: "/**" },
      { protocol: "https", hostname: "*.supabase.in", pathname: "/**" },
      // ── Google links (Drive / Docs preview thumbnails) ───────────────────
      { protocol: "https", hostname: "drive.google.com", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      // ── Other ────────────────────────────────────────────────────────────
      { protocol: "https", hostname: "africageographic.com", pathname: "/**" },
    ],
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  async headers() {
    return [
      // ✅ Security headers
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
      // ✅ Static assets ke liye aggressive caching — FCP/LCP improve hoga
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // ✅ Fonts ke liye bhi caching
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/:path+/", destination: "/:path+", permanent: true },
      { source: "/home", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;