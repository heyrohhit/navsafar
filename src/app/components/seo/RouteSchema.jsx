"use client";
// src/app/components/seo/RouteSchema.jsx
// ─────────────────────────────────────────────────────────────────
// Path-dependent JSON-LD (BreadcrumbList + WebPage/speakable + FAQPage).
//
// This is a CLIENT component that reads the current route via usePathname()
// instead of next/headers. That's deliberate: reading headers() in a server
// component opts the whole route out of static/ISR rendering. usePathname()
// does not — so the layout stays cacheable while every page still gets its
// correct per-route structured data (rendered in the SSR HTML too).
//
// The static, path-independent schema (Organization / WebSite / geo meta)
// stays server-rendered in GlobalSEO.jsx.
// ─────────────────────────────────────────────────────────────────

import { usePathname } from "next/navigation";
import { SITE_URL } from "../../../lib/localBusinessConfig.js";
import { getFaqsForPath } from "../../../lib/aeoFaqData.js";

/* ── Friendly labels for known route segments (breadcrumbs) ── */
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

// Routing/grouping folders that don't map to a real visitable page.
const SKIP_SEGMENTS = new Set(["pages"]);

function humanize(segment) {
  if (LABEL_MAP[segment]) return LABEL_MAP[segment];
  return decodeURIComponent(segment)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

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

  // No point showing a 1-item breadcrumb for the homepage
  if (items.length < 2) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

function buildFaqJsonLd(pathname) {
  const faqs = getFaqsForPath(pathname);
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

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

export default function RouteSchema() {
  const pathname = usePathname() || "/";

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(pathname);
  const faqJsonLd = buildFaqJsonLd(pathname);
  const webPageJsonLd = buildWebPageJsonLd(pathname);

  return (
    <>
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
    </>
  );
}
