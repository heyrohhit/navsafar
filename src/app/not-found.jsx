// src/app/not-found.jsx
// ✅ TECHNICAL SEO: Custom "updating soon" screen for missing/unbuilt pages.
// - Keeps `robots: noindex` so crawlers drop the URL (no soft-404 / SEO harm).
// - Next.js returns the 404 boundary; crawlers see this static content.
// - Real human visitors get a friendly "coming soon" message and are taken
//   back to the previous page by <NotFoundRedirect/> (client-side only).
import Link from "next/link";
import { Sparkles } from "lucide-react";
import NotFoundRedirect from "./components/common/NotFoundRedirect";

export const metadata = {
  title: "Page Updating Soon | NavSafar Travel",
  description:
    "This page is being updated. Explore our tour packages, destinations and travel guides in the meantime.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    { label: "Tour Packages", href: "/tour-packages" },
    { label: "Travel Blog", href: "/blog" },
    { label: "Contact Us", href: "/pages/contact" },
  ];

  return (
    <main className="min-h-[75vh] flex flex-col items-center justify-center px-6 py-20 text-center bg-gradient-to-b from-white to-slate-50">
      {/* Badge */}
      <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-600">
        <Sparkles size={14} /> Coming Soon
      </span>

      <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900">
        This page is getting a fresh update
      </h1>

      <p className="mt-4 max-w-xl text-neutral-500 sm:text-lg">
        Hum is page par kuch naya la rahe hain — jald hi live hoga. Tab tak,
        aapko wapas le ja rahe hain jahan se aap aaye the.
      </p>

      {/* Client-side: countdown + take the visitor back (SEO-safe) */}
      <NotFoundRedirect seconds={6} />

      {/* Fallback internal links (also good for crawlability) */}
      <nav
        aria-label="Helpful links"
        className="mt-12 flex flex-wrap gap-3 justify-center"
      >
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-primary-300 hover:text-primary-600"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
