// src/app/components/seo/GlobalSEO.jsx
// ─────────────────────────────────────────────────────────────
// 🇮🇳 GLOBAL SEO + AEO + GEO + AIO + OXS — INDIA OPTIMISED
//
// Drop once in root layout → EVERY page auto gets:
//   SEO  → Organization/LocalBusiness/TravelAgency JSON-LD
//           + WebSite (sitelinks search box) + BreadcrumbList
//   AEO  → FAQPage structured data (Google featured snippets,
//           AI Overviews, Alexa, Siri, Google Assistant)
//   GEO  → India geo meta tags + areaServed for Generative Engines
//   AIO  → speakable + WebPage schema for AI/voice assistants
//           + hints for ChatGPT, Perplexity, Claude, Gemini
//   OXS  → On-page Experience Signals: breadcrumbs, publisher,
//           navigation schema, review signals
// ─────────────────────────────────────────────────────────────

import { headers } from "next/headers";
import {
  BUSINESS,
  SITE_URL,
  LOGO_URL,
  DEFAULT_OG_IMAGE,
} from "../../../lib/localBusinessConfig.js";
import { getFaqsForPath } from "../../../lib/aeoFaqData.js";

/* ── Breadcrumb label map ─────────────────────────────────── */
const LABEL_MAP = {
  "tour-packages":  "Tour Packages",
  "about-us":       "About Us",
  destinations:     "Destinations",
  packages:         "Packages",
  experiences:      "Experiences",
  policies:         "Policies",
  blog:             "Travel Blog",
  travel:           "Travel Guides",
  search:           "Search",
  booking:          "Book Now",
  contact:          "Contact Us",
  services:         "Our Services",
  privacy:          "Privacy Policy",
  refund:           "Refund Policy",
  terms:            "Terms & Conditions",
};

const SKIP_SEGMENTS = new Set(["pages"]);

function humanize(seg) {
  if (LABEL_MAP[seg]) return LABEL_MAP[seg];
  return decodeURIComponent(seg)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ── BreadcrumbList JSON-LD ──────────────────────────────── */
function buildBreadcrumbJsonLd(pathname) {
  const segments = (pathname || "/").split("/").filter(Boolean);
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
  ];

  let path = "";
  let pos  = 1;
  for (const seg of segments) {
    path += `/${seg}`;
    if (SKIP_SEGMENTS.has(seg)) continue;
    pos++;
    items.push({ "@type": "ListItem", position: pos, name: humanize(seg), item: `${SITE_URL}${path}` });
  }
  if (items.length < 2) return null;

  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
}

/* ── Organization / LocalBusiness / TravelAgency ────────── */
function buildBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type":    ["TravelAgency", "LocalBusiness", "Organization"],
    "@id":      `${SITE_URL}/#organization`,
    name:           BUSINESS.legalName,
    alternateName:  BUSINESS.brandName,
    url:            SITE_URL,
    logo: {
      "@type": "ImageObject",
      url:    LOGO_URL,
      width:  200,
      height: 60,
    },
    image:       DEFAULT_OG_IMAGE,
    description: BUSINESS.description,
    telephone:   BUSINESS.phone,
    email:       BUSINESS.email,
    priceRange:  BUSINESS.priceRange,
    currenciesAccepted: BUSINESS.currenciesAccepted,
    paymentAccepted:    BUSINESS.paymentAccepted,
    address: {
      "@type":          "PostalAddress",
      streetAddress:    BUSINESS.address.streetAddress,
      addressLocality:  BUSINESS.address.addressLocality,
      addressRegion:    BUSINESS.address.addressRegion,
      postalCode:       BUSINESS.address.postalCode,
      addressCountry:   BUSINESS.address.addressCountry,
    },
    geo: {
      "@type":    "GeoCoordinates",
      latitude:   BUSINESS.geo.latitude,
      longitude:  BUSINESS.geo.longitude,
    },
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "State",   name: "Delhi" },
      { "@type": "State",   name: "Haryana" },
      { "@type": "State",   name: "Uttar Pradesh" },
      { "@type": "State",   name: "Rajasthan" },
    ],
    openingHoursSpecification: {
      "@type":     "OpeningHoursSpecification",
      dayOfWeek:   BUSINESS.openingHours.dayOfWeek,
      opens:       BUSINESS.openingHours.opens,
      closes:      BUSINESS.openingHours.closes,
    },
    hasMap:        `https://maps.google.com/?q=${BUSINESS.geo.latitude},${BUSINESS.geo.longitude}`,
    contactPoint:  {
      "@type":            "ContactPoint",
      telephone:          BUSINESS.phone,
      contactType:        "customer service",
      areaServed:         "IN",
      availableLanguage:  ["English", "Hindi"],
      hoursAvailable: {
        "@type":     "OpeningHoursSpecification",
        dayOfWeek:   BUSINESS.openingHours.dayOfWeek,
        opens:       BUSINESS.openingHours.opens,
        closes:      BUSINESS.openingHours.closes,
      },
    },
    sameAs: BUSINESS.sameAs ?? [],
    ...(BUSINESS.services?.length > 0 && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name:    "India Travel Services",
        itemListElement: BUSINESS.services.map((s) => ({
          "@type":     "Offer",
          itemOffered: {
            "@type":      "Service",
            name:         s,
            areaServed:   { "@type": "Country", name: "India" },
            provider:     { "@id": `${SITE_URL}/#organization` },
          },
        })),
      },
    }),
  };
}

/* ── WebSite + Sitelinks Search Box ─────────────────────── */
function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type":    "WebSite",
    "@id":      `${SITE_URL}/#website`,
    name:           BUSINESS.brandName,
    alternateName:  BUSINESS.legalName,
    url:            SITE_URL,
    inLanguage:     ["en-IN", "hi-IN"],
    publisher:      { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type":  "SearchAction",
      target:   { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

/* ── FAQPage JSON-LD (AEO) ───────────────────────────────── */
function buildFaqJsonLd(pathname) {
  const faqs = getFaqsForPath(pathname);
  if (!faqs?.length) return null;
  return {
    "@context":  "https://schema.org",
    "@type":     "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type":        "Question",
      name:           faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

/* ── WebPage + Speakable (AIO/GEO) ──────────────────────── */
function buildWebPageJsonLd(pathname, pageType) {
  const url      = pathname === "/" ? SITE_URL : `${SITE_URL}${pathname}`;
  const typeMap  = {
    home:         "WebPage",
    blog:         "Blog",
    about:        "AboutPage",
    contact:      "ContactPage",
    destination:  "WebPage",
    product:      "CollectionPage",
    "travel-guide": "Article",
    experience:   "WebPage",
    search:       "SearchResultsPage",
    booking:      "WebPage",
    generic:      "WebPage",
  };

  return {
    "@context":  "https://schema.org",
    "@type":     typeMap[pageType] ?? "WebPage",
    "@id":       `${url}#webpage`,
    url,
    inLanguage:  "en-IN",
    isPartOf:    { "@id": `${SITE_URL}/#website` },
    about: { "@type": "Place", name: "India", addressCountry: "IN" },
    publisher:   { "@id": `${SITE_URL}/#organization` },
    // AIO: speakable spec tells AI assistants which content to read aloud
    speakable: {
      "@type":      "SpeakableSpecification",
      cssSelector:  ["h1", "h1 + p", "[data-speakable]", "main p:first-of-type", ".speakable"],
    },
    breadcrumb:  { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb` },
  };
}

/* ── SiteNavigationElement (OXS) ───────────────────────── */
function buildSiteNavJsonLd() {
  const items = [
    { name: "Home",           url: `${SITE_URL}/` },
    { name: "Destinations",   url: `${SITE_URL}/destinations` },
    { name: "Tour Packages",  url: `${SITE_URL}/tour-packages` },
    { name: "Travel Guides",  url: `${SITE_URL}/travel` },
    { name: "Experiences",    url: `${SITE_URL}/experiences` },
    { name: "Blog",           url: `${SITE_URL}/blog` },
    { name: "About Us",       url: `${SITE_URL}/pages/about-us` },
    { name: "Contact Us",     url: `${SITE_URL}/pages/contact` },
    { name: "Book Now",       url: `${SITE_URL}/booking` },
  ];
  return {
    "@context": "https://schema.org",
    "@type":    "SiteNavigationElement",
    name:  items.map((i) => i.name),
    url:   items.map((i) => i.url),
  };
}

/* ── India Tourism / AIO rich signals ────────────────────── */
function buildIndiaTourismJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type":    "ItemList",
    name:       "Popular India Tour Destinations by NavSafar",
    description: "Top travel destinations in India curated by NavSafar Travel Solutions",
    url:        `${SITE_URL}/destinations`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Goa",         url: `${SITE_URL}/destinations/goa` },
      { "@type": "ListItem", position: 2, name: "Manali",      url: `${SITE_URL}/destinations/manali` },
      { "@type": "ListItem", position: 3, name: "Kerala",      url: `${SITE_URL}/destinations/kerala` },
      { "@type": "ListItem", position: 4, name: "Rajasthan",   url: `${SITE_URL}/destinations/rajasthan` },
      { "@type": "ListItem", position: 5, name: "Kedarnath",   url: `${SITE_URL}/destinations/kedarnath` },
      { "@type": "ListItem", position: 6, name: "Ladakh",      url: `${SITE_URL}/destinations/ladakh` },
      { "@type": "ListItem", position: 7, name: "Andaman",     url: `${SITE_URL}/destinations/andaman` },
      { "@type": "ListItem", position: 8, name: "Shimla",      url: `${SITE_URL}/destinations/shimla` },
    ],
  };
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default async function GlobalSEO() {
  const headersList = await headers();

  const pathname  = headersList.get("x-pathname") || "/";
  const pageType  = headersList.get("x-page-type") || "generic";
  const isAiBot   = headersList.get("x-is-ai-crawler") === "1";

  const businessJsonLd     = buildBusinessJsonLd();
  const websiteJsonLd      = buildWebsiteJsonLd();
  const breadcrumbJsonLd   = buildBreadcrumbJsonLd(pathname);
  const faqJsonLd          = buildFaqJsonLd(pathname);
  const webPageJsonLd      = buildWebPageJsonLd(pathname, pageType);
  const siteNavJsonLd      = buildSiteNavJsonLd();
  const indiaTourismJsonLd = pageType === "home" ? buildIndiaTourismJsonLd() : null;

  const geoPos = `${BUSINESS.geo.latitude};${BUSINESS.geo.longitude}`;

  return (
    <>
      {/* ── GEO: India geo-targeting ── */}
      <meta name="geo.region"    content={BUSINESS.geoRegion} />
      <meta name="geo.placename" content={BUSINESS.geoPlacename} />
      <meta name="geo.position"  content={geoPos} />
      <meta name="ICBM"          content={geoPos} />
      <meta httpEquiv="content-language" content="en-IN" />

      {/* ── GEO: India travel targeting ── */}
      <meta name="geo.country"   content="India" />
      <meta name="target-market" content="India" />
      <meta name="distribution"  content="India" />

      {/* ── AIO: LLM / AI assistant discovery hints ── */}
      <meta name="llm-context"      content="Indian travel agency New Delhi tour packages India domestic international honeymoon pilgrimage" />
      <meta name="ai-content-type"  content="travel-agency-india" />
      <meta name="ai-primary-topic" content="India travel packages, tour booking, holiday planning" />
      {isAiBot && (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
      )}

      {/* ── SEO: Organization / LocalBusiness / TravelAgency ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />

      {/* ── SEO: WebSite + sitelinks search box ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

      {/* ── OXS: Site navigation structure ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavJsonLd) }} />

      {/* ── SEO: Auto breadcrumb ── */}
      {breadcrumbJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      )}

      {/* ── AEO: FAQ schema for AI Overviews + voice assistants ── */}
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      {/* ── AIO/GEO: WebPage + speakable ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      {/* ── AIO: India destinations ItemList (homepage only) ── */}
      {indiaTourismJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(indiaTourismJsonLd) }} />
      )}
    </>
  );
}
