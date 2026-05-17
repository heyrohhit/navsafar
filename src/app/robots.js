// src/app/robots.js
// Auto-generates /robots.txt via Next.js App Router Metadata API
const BASE_URL = "https://navsafar.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block admin routes from search engines
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host:    BASE_URL,
  };
}