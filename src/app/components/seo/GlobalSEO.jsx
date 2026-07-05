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

import { Suspense } from "react";
import { BUSINESS, SITE_URL, LOGO_URL, DEFAULT_OG_IMAGE } from "../../../lib/localBusinessConfig.js";
import RouteSchema from "./RouteSchema";

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

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT (static — no headers(), so the layout stays ISR-cacheable)
   Path-independent site-wide schema is server-rendered here; the
   per-route schema (breadcrumb / WebPage / FAQ) is handled by the
   <RouteSchema/> client component via usePathname().
───────────────────────────────────────────────────────────────── */
export default function GlobalSEO() {
  const businessJsonLd = buildBusinessJsonLd();
  const websiteJsonLd = buildWebsiteJsonLd();

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

      {/* ── Per-route schema: breadcrumb + WebPage + FAQ (client, usePathname).
          Wrapped in its OWN Suspense so its prerender CSR-bail stays contained
          here and does NOT cascade to the page (which must keep server-rendering
          so notFound()/redirect() return real 404/301 status codes). ── */}
      <Suspense fallback={null}>
        <RouteSchema />
      </Suspense>
    </>
  );
}
