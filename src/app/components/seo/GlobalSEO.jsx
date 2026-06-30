// src/app/components/seo/GlobalSEO.jsx
// ─────────────────────────────────────────────────────────────────
// 🇮🇳 GLOBAL SEO + AEO + GEO + AIO COMPONENT
//
// Drop this ONE component once into the root layout
// (src/app/layout.jsx) and EVERY page automatically gets:
//
//   • SEO   → Organization / LocalBusiness / TravelAgency JSON-LD
//             + WebSite (sitelinks search box) + auto BreadcrumbList
//   • AEO   → FAQPage structured data (Answer Engine Optimization —
//             Google featured snippets, AI Overviews, voice assistants)
//   • GEO   → India-specific geo meta tags (geo.region, geo.placename,
//             ICBM, geo coordinates) + "areaServed: India" signals so
//             Generative Engines (ChatGPT/Perplexity/Gemini/Copilot)
//             correctly geo-target answers to India
//   • AIO   → "speakable" + WebPage schema that helps AI/voice
//             assistants and LLM answer engines extract clean,
//             citable content from every page
//
// 👉 You do NOT need to add anything to individual pages.
//    To change business info / FAQs, edit:
//      - src/lib/localBusinessConfig.js
//      - src/lib/aeoFaqData.js
// ─────────────────────────────────────────────────────────────────

import { headers } from "next/headers";
import { BUSINESS, SITE_URL, LOGO_URL, DEFAULT_OG_IMAGE } from "../../../lib/localBusinessConfig.js";
import { getFaqsForPath } from "../../../lib/aeoFaqData.js";

/* ── Friendly labels for known route segments (used in breadcrumbs) ── */
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

// Path segments that are routing/grouping folders only and should be
// skipped when building human-readable breadcrumbs (they don't map to
// a real visitable page on their own).
const SKIP_SEGMENTS = new Set(["pages"]);

function humanize(segment) {
  if (LABEL_MAP[segment]) return LABEL_MAP[segment];
  return decodeURIComponent(segment)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ── Build BreadcrumbList JSON-LD from the current pathname ── */
function buildBreadcrumbJsonLd(pathname) {
  const segments = (pathname || "/").split("/").filter(Boolean);

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL + "/",
    },
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

/* ── Organization / LocalBusiness / TravelAgency JSON-LD ── */
function buildBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: BUSINESS.legalName,
    alternateName: BUSINESS.brandName,
    url: SITE_URL,
    logo: LOGO_URL,
    image: DEFAULT_OG_IMAGE,
    description: BUSINESS.description,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: BUSINESS.currenciesAccepted,
    paymentAccepted: BUSINESS.paymentAccepted,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.addressLocality,
      addressRegion: BUSINESS.address.addressRegion,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    areaServed: BUSINESS.areaServed,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: BUSINESS.openingHours.dayOfWeek,
      opens: BUSINESS.openingHours.opens,
      closes: BUSINESS.openingHours.closes,
    },
  };

  if (BUSINESS.sameAs && BUSINESS.sameAs.length > 0) {
    data.sameAs = BUSINESS.sameAs;
  }

  return data;
}

/* ── WebSite JSON-LD with sitelinks search box ── */
function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BUSINESS.brandName,
    url: SITE_URL,
    inLanguage: BUSINESS.languages,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/* ── FAQPage JSON-LD (AEO) for the current route, if available ── */
function buildFaqJsonLd(pathname) {
  const faqs = getFaqsForPath(pathname);
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

/* ── WebPage + speakable JSON-LD (helps AI/voice assistants) ── */
function buildWebPageJsonLd(pathname) {
  const url = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: {
      "@type": "Place",
      name: "India",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h1 + p", "[data-speakable]"],
    },
  };
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default async function GlobalSEO() {
  const headersList = await headers();

  // Set by src/proxy.js for every request
  const pathname =
    headersList.get("x-pathname") || headersList.get("x-invoke-path") || "/";

  const businessJsonLd = buildBusinessJsonLd();
  const websiteJsonLd = buildWebsiteJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(pathname);
  const faqJsonLd = buildFaqJsonLd(pathname);
  const webPageJsonLd = buildWebPageJsonLd(pathname);

  const geoPosition = `${BUSINESS.geo.latitude};${BUSINESS.geo.longitude}`;

  return (
    <>
      {/* ── GEO: India geo-targeting meta tags ── */}
      <meta name="geo.region" content={BUSINESS.geoRegion} />
      <meta name="geo.placename" content={BUSINESS.geoPlacename} />
      <meta name="geo.position" content={geoPosition} />
      <meta name="ICBM" content={geoPosition} />
      <meta httpEquiv="content-language" content="en-IN" />

      {/* ── SEO: Organization / LocalBusiness / TravelAgency ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />

      {/* ── SEO: WebSite + sitelinks search box ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* ── SEO: Auto breadcrumb for the current page ── */}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}

      {/* ── AEO: FAQ schema for the current page (if configured) ── */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* ── AIO / GEO: WebPage + speakable for AI & voice answers ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
    </>
  );
}
