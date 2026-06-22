// src/app/page.jsx
// ✅ SERVER COMPONENT — Homepage
// Root layout (layout.jsx) generateMetadata handles dynamic canonical/OG.
// Page-level metadata here adds page-specific signals on top.

import Herosections from "./components/hero/HeroSections";
import HomePageClientLoader from "./HomePageClientLoader";

// Homepage-specific metadata — overrides root layout defaults for this page
export const metadata = {
  title: "NavSafar | Book Domestic & International Tour Packages",
  description:
    "NavSafar Travel Solutions — trusted travel agency in New Delhi. Book customised domestic & international tour packages, flights, hotels, visa services. Best prices in INR for Indian travellers.",
  keywords: [
    "travel agency india",
    "tour packages india",
    "domestic tours india",
    "international tour packages india",
    "travel agency delhi",
    "best travel agency india 2026",
    "goa tour package",
    "manali tour package",
    "kerala tour package",
    "dubai tour package india",
    "bali honeymoon package",
    "holiday packages india",
  ],
  alternates: {
    canonical: "https://navsafar.com",
    languages: {
      "x-default": "https://navsafar.com",
      "en-IN": "https://navsafar.com",
      "en": "https://navsafar.com",
    },
  },
  openGraph: {
    title: "NavSafar — Book Domestic & International Tour Packages",
    description:
      "Trusted travel agency in New Delhi. Customised tour packages, flights, hotels, visa services — best prices in INR for Indian travellers.",
    url: "https://navsafar.com",
    siteName: "NavSafar Travel Solutions",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://navsafar.com/assets/bg.jpg",
        width: 1200,
        height: 630,
        alt: "NavSafar Travel Solutions — India's Trusted Travel Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NavSafar — Book Tour Packages",
    description: "Domestic & international tour packages for Indian travellers. Best prices in INR.",
    images: ["https://navsafar.com/assets/bg.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Herosections />
      <HomePageClientLoader />
    </div>
  );
}
