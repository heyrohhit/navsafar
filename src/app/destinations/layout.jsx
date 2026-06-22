/**
 * FILE: src/app/destinations/layout.jsx
 *
 * Destinations segment layout — Server Component.
 * - No "use client" here — ever.
 * - Wraps /destinations and /destinations/[slug]
 * - Safe to export metadata from child page.jsx files
 *   because this layout is a pure Server Component.
 */

// ── Segment-level metadata fallback ───────────────────────────────
export const metadata = {
  title: {
    default: "Destinations | NavSafar Travel",
    template: "%s — Destinations | NavSafar",
  },
  description:
    "Explore 50+ iconic destinations across 30+ countries — Europe, Asia, Middle East, Americas, Africa, India & more. Book customised tour packages with NavSafar.",
  keywords: [
    "destinations india",
    "travel destinations",
    "international destinations",
    "top tourist places india",
    "tour packages destinations",
  ],
  alternates: {
    canonical: "https://navsafar.com/destinations",
    languages: {
      "x-default": "https://navsafar.com/destinations",
      "en-IN": "https://navsafar.com/destinations",
      "en": "https://navsafar.com/destinations",
    },
  },
  openGraph: {
    title: "Destinations | NavSafar Travel",
    description: "Discover 50+ handpicked destinations with NavSafar. Customised packages in INR for Indian travellers.",
    url: "https://navsafar.com/destinations",
    type: "website",
    locale: "en_IN",
    images: [{ url: "https://navsafar.com/assets/bg.jpg", width: 1200, height: 630, alt: "NavSafar Destinations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Destinations | NavSafar Travel",
    description: "Discover 50+ handpicked destinations with NavSafar.",
    images: ["https://navsafar.com/assets/bg.jpg"],
  },
};

// ── Layout shell ──────────────────────────────────────────────────
export default function DestinationsLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}