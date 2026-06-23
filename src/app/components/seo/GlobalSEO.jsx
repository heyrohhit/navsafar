// src/app/components/seo/GlobalSEO.jsx
// ─────────────────────────────────────────────────────────────────
// 🇮🇳 GLOBAL SEO + AEO + GEO + AIO + OXS COMPONENT
//
// Drop this ONE component once into the root layout and EVERY page
// automatically gets:
//
//   • SEO   → Organization / LocalBusiness / TravelAgency JSON-LD
//             + WebSite (sitelinks search box) + auto BreadcrumbList
//             + per-page WebPage schema with dynamic title/description
//   • AEO   → FAQPage structured data (Answer Engine Optimization —
//             Google featured snippets, AI Overviews, voice assistants)
//   • GEO   → India geo meta tags (geo.region, geo.placename, ICBM)
//             + "areaServed: India" for Generative Engines
//   • AIO   → "speakable" + WebPage schema for AI/voice assistants
//             + LLM-friendly content signals
//   • OXS   → On-page Experience Signals: breadcrumb JSON-LD,
//             publisher signals, navigation schema
//
// 👉 To change business info / FAQs, edit:
//      - src/lib/localBusinessConfig.js
//      - src/lib/aeoFaqData.js
// ─────────────────────────────────────────────────────────────────

import { headers } from "next/headers";
import {
  BUSINESS,
  SITE_URL,
  LOGO_URL,
  DEFAULT_OG_IMAGE,
} from "../../../lib/localBusinessConfig.js";
import { KNOWN_HOSTS } from "../../../lib/domainConfig.js";
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

// Route segments that are folder-only groupings, not real pages
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

  // Don't show 1-item breadcrumb for homepage
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
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
      width: 200,
      height: 60,
    },
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
    hasMap: `https://maps.google.com/?q=${BUSINESS.geo.latitude},${BUSINESS.geo.longitude}`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: BUSINESS.phone,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  };

  if (BUSINESS.sameAs && BUSINESS.sameAs.length > 0) {
    data.sameAs = BUSINESS.sameAs;
  }

  if (BUSINESS.services && BUSINESS.services.length > 0) {
    data.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: "Travel Services",
      itemListElement: BUSINESS.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service,
          areaServed: { "@type": "Country", name: "India" },
        },
      })),
    };
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
    alternateName: BUSINESS.legalName,
    url: SITE_URL,
    inLanguage: BUSINESS.languages,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/* ── FAQPage JSON-LD (AEO) for the current route ── */
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

/* ── WebPage + speakable JSON-LD (AIO/GEO: helps AI/voice assistants) ── */
function buildWebPageJsonLd(pathname) {
  const url =
    pathname === "/" ? SITE_URL : `${SITE_URL}${pathname}`;

  // Determine page type from pathname
  const isBlog =
    pathname.startsWith("/blog");
  const isProduct =
    pathname.startsWith("/packages") ||
    pathname.startsWith("/tour-packages") ||
    pathname.startsWith("/destinations") ||
    pathname.startsWith("/experiences") ||
    pathname.startsWith("/travel");
  const isContact = pathname.startsWith("/pages/contact");
  const isAbout = pathname.startsWith("/pages/about-us");

  let pageType = "WebPage";
  if (isBlog) pageType = "Blog";
  if (isAbout) pageType = "AboutPage";
  if (isContact) pageType = "ContactPage";

  return {
    "@context": "https://schema.org",
    "@type": pageType,
    "@id": `${url}#webpage`,
    url,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: {
      "@type": "Place",
      name: "India",
      addressCountry: "IN",
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h1 + p", "[data-speakable]", "main p:first-of-type"],
    },
    // OXS: breadcrumb signal in WebPage
    breadcrumb: {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
    },
  };
}

/* ── SiteNavigation JSON-LD (OXS: helps search engines understand site structure) ── */
function buildSiteNavigationJsonLd() {
  const navItems = [
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Destinations", url: `${SITE_URL}/destinations` },
    { name: "Tour Packages", url: `${SITE_URL}/tour-packages` },
    { name: "Travel Guides", url: `${SITE_URL}/travel` },
    { name: "Experiences", url: `${SITE_URL}/experiences` },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: "About Us", url: `${SITE_URL}/pages/about-us` },
    { name: "Contact Us", url: `${SITE_URL}/pages/contact` },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: navItems.map((i) => i.name),
    url: navItems.map((i) => i.url),
  };
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default async function GlobalSEO() {
  const headersList = await headers();

  // Set by src/proxy.js for every request
  const pathname =
    headersList.get("x-pathname") ||
    headersList.get("x-invoke-path") ||
    "/";

  const businessJsonLd = buildBusinessJsonLd();
  const websiteJsonLd = buildWebsiteJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(pathname);
  const faqJsonLd = buildFaqJsonLd(pathname);
  const webPageJsonLd = buildWebPageJsonLd(pathname);
  const siteNavJsonLd = buildSiteNavigationJsonLd();

  const geoPosition = `${BUSINESS.geo.latitude};${BUSINESS.geo.longitude}`;

  return (
    <>
      {/* ── GEO: India geo-targeting meta tags ── */}
      <meta name="geo.region" content={BUSINESS.geoRegion} />
      <meta name="geo.placename" content={BUSINESS.geoPlacename} />
      <meta name="geo.position" content={geoPosition} />
      <meta name="ICBM" content={geoPosition} />
      <meta httpEquiv="content-language" content="en-IN" />

      {/* ── AIO: LLM / AI assistant discovery hints ── */}
      <meta name="llm-context" content="Indian travel agency, New Delhi, tour packages India" />
      <meta name="ai-content-type" content="travel-agency-india" />

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

      {/* ── OXS: Site navigation structure ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavJsonLd) }}
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
