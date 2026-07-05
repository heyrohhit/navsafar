// src/app/packages/page.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Packages Page — Server Component wrapper + Client inner component
// ─────────────────────────────────────────────────────────────────────────────

// ✅ FIX 1: This file should only be the Server Component with metadata.
// PackagesPageClient should be a separate file: src/app/packages/PackagesPageClient.jsx
// The duplicate `export default function PackagesPage()` at the bottom has been removed.

import PackagesPageClient from "./PackagesPageClient";
import UniversalSchemaInjector from "../components/seo/UniversalSchemaInjector";
import { getPackages } from "../../lib/getPackages";

export const metadata = {
  title: "Tour Packages - Domestic & International | NavSafar",
  description:
    "Explore 50+ domestic and international tour packages. Best price guarantee, customised itineraries, flights & hotels included. Book now with NavSafar!",
  keywords: [
    "tour packages india",
    "domestic tour packages",
    "international tours",
    "holiday packages india",
    "honeymoon packages india",
    "family tour packages",
    "adventure packages india",
  ],
  alternates: {
    canonical: "https://www.navsafar.com/packages",
  },
  openGraph: {
    title: "Tour Packages - Domestic & International | NavSafar",
    description:
      "Explore 50+ domestic and international tour packages with best prices.",
    url: "https://www.navsafar.com/packages",
    type: "website",
    locale: "en_IN",
    images: [{ url: "https://www.navsafar.com/assets/bg.jpg", width: 1200, height: 630, alt: "Tour Packages - NavSafar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tour Packages - Domestic & International | NavSafar",
    description: "Explore 50+ domestic and international tour packages with best prices.",
    images: ["https://www.navsafar.com/assets/bg.jpg"],
  },
};

export default async function PackagesPage() {
  const packages = await getPackages();
  return (
    <>
      <UniversalSchemaInjector
        type="itemList"
        items={packages}
        pageUrl="https://www.navsafar.com/packages"
        listName="Tour Packages — NavSafar"
      />
      <PackagesPageClient />
    </>
  );
}
