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
    default:  "Destinations | WanderLux",
    template: "%s — Destinations | WanderLux",
  },
  description:
    "Explore 50+ iconic destinations across 30+ countries — Europe, Asia, Middle East, Americas, Africa & more.",
  openGraph: {
    title:       "Destinations | WanderLux",
    description: "Discover handpicked destinations with WanderLux.",
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