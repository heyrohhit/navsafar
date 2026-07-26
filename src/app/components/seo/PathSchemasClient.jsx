"use client";
// src/app/components/seo/PathSchemasClient.jsx
// ─────────────────────────────────────────────────────────────────
// 🔀 PATH-DEPENDENT SCHEMAS (client component via usePathname)
//
// Handles schemas that depend on the current URL:
//   • BreadcrumbList — hierarchical breadcrumb for every page
//   • WebPage + speakable — for AI/voice assistant extraction
//   • FAQPage — daily rotating FAQs from aeoFaqData
//
// This is imported by UniversalSEOEngine (server component) and
// rendered inside a <Suspense> boundary so the parent layout stays
// ISR-cacheable while still getting per-route structured data.
// ─────────────────────────────────────────────────────────────────

import { usePathname } from "next/navigation";
import { SITE_URL } from "../../../lib/localBusinessConfig.js";
import { getRotatedFaqsForPath } from "../../../lib/aeoFaqData.js";

/* ── Friendly labels for known route segments ── */
const LABEL_MAP = {
  "tour-packages": "Tour Packages",
  "about-us": "About Us",
  destinations: "Destinations",
  packages: "Packages",
  experiences: "Experiences",
  policies: "Policies",
  blog: "Blog",
  travel: "Travel Guides",
  search: "Search",
  booking: "Booking",
  contact: "Contact Us",
  services: "Our Services",
  privacy: "Privacy Policy",
  refund: "Refund Policy",
  terms: "Terms & Conditions",
};

const SKIP_SEGMENTS = new Set(["pages"]);

function humanize(segment) {
  if (LABEL_MAP[segment]) return LABEL_MAP[segment];
  return decodeURIComponent(segment)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ── BreadcrumbList JSON-LD ── */
function buildBreadcrumbJsonLd(pathname) {
  const segments = (pathname || "/").split("/").filter(Boolean);
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
  ];
  let cumulativePath = "";
  let position = 1;

  for (const segment of segments) {
    cumulativePath += `/${segment}`;
    if (SKIP_SEGMENTS.has(segment)) continue;
    position += 1;
    items.push({
      "@type": "ListItem",
      position,
      name: humanize(segment),
      item: `${SITE_URL}${cumulativePath}`,
    });
  }

  if (items.length < 2) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

/* ── WebPage + speakable JSON-LD ── */
function buildWebPageJsonLd(pathname) {
  const url = `${SITE_URL}${pathname === "/" ? "" : pathname}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@type": "Place", name: "India" },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h1 + p", "[data-speakable]"],
    },
  };
}

/* ── FAQPage JSON-LD (daily rotating) ── */
function buildFaqJsonLd(pathname) {
  const faqs = getRotatedFaqsForPath(pathname, 6);
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/* ── MAIN EXPORT ── */
export default function PathSchemasClient() {
  const pathname = usePathname() || "/";

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(pathname);
  const webPageJsonLd = buildWebPageJsonLd(pathname);
  const faqJsonLd = buildFaqJsonLd(pathname);

  return (
    <>
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </>
  );
}
