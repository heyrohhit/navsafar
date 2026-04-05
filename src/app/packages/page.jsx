// src/app/packages/page.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Packages Page — Server Component wrapper + Client inner component
// ─────────────────────────────────────────────────────────────────────────────

// ✅ FIX 1: This file should only be the Server Component with metadata.
// PackagesPageClient should be a separate file: src/app/packages/PackagesPageClient.jsx
// The duplicate `export default function PackagesPage()` at the bottom has been removed.

import PackagesPageClient from "./PackagesPageClient";

export const metadata = {
  // ✅ FIX 2: Removed TypeScript `: Metadata` type annotation — this is a .jsx file
  title: "Tour Packages - Domestic & International | NavSafar",
  description:
    "Explore 100+ domestic and international tour packages. Best price guarantee. Includes flights, hotels, visa. Book now!",
  keywords: [
    "tour packages india",
    "domestic tour packages",
    "international tours",
    "holiday packages",
    "honeymoon packages",
    "family tours",
    "adventure packages",
  ],
  openGraph: {
    title: "Tour Packages - Domestic & International | NavSafar",
    description:
      "Explore 100+ domestic and international tour packages with best prices",
    images: [
      {
        url: "/assets/bg.jpg",
        width: 1200,
        height: 630,
        alt: "Tour Packages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tour Packages - Domestic & International | NavSafar",
    description:
      "Explore 100+ domestic and international tour packages with best prices",
  },
};

export default function PackagesPage() {
  return <PackagesPageClient />;
}
