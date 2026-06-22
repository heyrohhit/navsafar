// src/app/search/page.jsx
// ✅ SERVER COMPONENT — metadata yahan kaam karta hai
import SearchPackages from "./SearchPackages"

export const metadata = {
  title: "Search Tour Packages | NavSafar Travel",
  description: "Search domestic and international tour packages on NavSafar. Find packages by destination, budget or travel style — best prices in INR.",
  keywords: [
    "search tour packages india",
    "find holiday package",
    "travel package search",
    "destination search india",
    "navsafar search",
  ],
  alternates: {
    canonical: "https://navsafar.com/search",
    languages: {
      "x-default": "https://navsafar.com/search",
      "en-IN": "https://navsafar.com/search",
      "en": "https://navsafar.com/search",
    },
  },
  openGraph: {
    title: "Search Tour Packages | NavSafar Travel",
    description: "Find your perfect tour package — domestic & international destinations.",
    url: "https://navsafar.com/search",
    type: "website",
    siteName: "NavSafar Travel Solutions",
    locale: "en_IN",
    images: [{ url: "https://navsafar.com/assets/bg.jpg", width: 1200, height: 630, alt: "NavSafar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Tour Packages | NavSafar",
    description: "Find your perfect tour package — domestic & international destinations.",
    images: ["https://navsafar.com/assets/bg.jpg"],
  },
  robots: { index: true, follow: true },
};

// Metadata server component se export hoti hai, client component se NAHI.
export default function SearchPack() {
  return <SearchPackages />;
}
