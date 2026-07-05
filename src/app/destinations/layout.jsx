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
  alternates: {
    canonical: "https://www.navsafar.com/destinations",
  },
  openGraph: {
    title: "Destinations | NavSafar Travel",
    description: "Discover 50+ handpicked destinations with NavSafar. Customised packages in INR for Indian travellers.",
    url: "https://www.navsafar.com/destinations",
    type: "website",
    locale: "en_IN",
    images: [{ url: "https://www.navsafar.com/assets/bg.jpg", width: 1200, height: 630, alt: "NavSafar Destinations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Destinations | NavSafar Travel",
    description: "Discover 50+ handpicked destinations with NavSafar.",
    images: ["https://www.navsafar.com/assets/bg.jpg"],
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