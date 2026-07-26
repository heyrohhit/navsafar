// src/app/components/seo/UniversalSEOEngine.jsx
// ─────────────────────────────────────────────────────────────────
// 🚀 UNIVERSAL SEO ENGINE — ONE component to rule ALL optimization
//
// ✅ SERVER COMPONENT — static schemas render in SSR HTML
// ✅ DYNAMIC CONFIG — fetches business data from Supabase site_settings
//    with static fallback; admin edits go live without redeploying
// ✅ Client sub-component only for path-dependent schemas (usePathname)
//
// Handles:
//   SEO  → Organization, LocalBusiness, TravelAgency, WebSite,
//          BreadcrumbList, WebPage, Product, Review, ItemList,
//          TouristDestination schemas (ALL in SSR HTML)
//   AEO  → FAQPage (daily rotating, injected client-side)
//          speakable specification for AI/voice
//   GEO  → geo.region, ICBM, geo.placename meta tags
//          sameAs social links, hreflang signals
//   XOS  → Facebook/Pinterest/Google verification meta
//          PWA meta tags, revisit-after for crawlers
//   PERF → Preconnect, DNS-prefetch, preload hints
//
// 🔧 Usage:
//   import UniversalSEOEngine from "@/app/components/seo/UniversalSEOEngine";
//   <UniversalSEOEngine />  → all schemas auto-included
//   <UniversalSEOEngine showItemList items={pkgs} /> → + ItemList
//   <UniversalSEOEngine destination={d} packages={p} /> → + TouristDestination
// ─────────────────────────────────────────────────────────────────

import { Suspense } from "react";
import { loadBusinessConfig, SITE_URL, LOGO_URL, DEFAULT_OG_IMAGE } from "../../../lib/localBusinessConfig.js";
import { getTodayDate } from "../../../lib/seoEngine.js";

// ═════════════════════════════════════════════════════════════════
//  STATIC SCHEMA BUILDERS (pure functions, no hooks)
//  Accept config as parameter so they work with dynamic data
// ═════════════════════════════════════════════════════════════════

function buildBusinessJsonLd(business) {
  const data = {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: business.legalName,
    alternateName: business.brandName,
    url: SITE_URL,
    logo: LOGO_URL,
    image: DEFAULT_OG_IMAGE,
    description: business.description,
    telephone: business.phone,
    email: business.email,
    priceRange: business.priceRange,
    currenciesAccepted: business.currenciesAccepted,
    paymentAccepted: business.paymentAccepted,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address?.streetAddress,
      addressLocality: business.address?.addressLocality,
      addressRegion: business.address?.addressRegion,
      postalCode: business.address?.postalCode,
      addressCountry: business.address?.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo?.latitude,
      longitude: business.geo?.longitude,
    },
    areaServed: business.areaServed,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: business.openingHours?.dayOfWeek,
      opens: business.openingHours?.opens,
      closes: business.openingHours?.closes,
    },
  };
  if (business.sameAs?.length > 0) data.sameAs = business.sameAs;
  return data;
}

function buildWebsiteJsonLd(business) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: business.brandName,
    url: SITE_URL,
    inLanguage: business.languages || ["en-IN"],
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

function buildProductJsonLd(business) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${business.brandName} Travel Services`,
    description: business.description,
    url: SITE_URL,
    brand: { "@type": "Brand", name: business.brandName },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: "9999",
      highPrice: "199999",
      offerCount: "50",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "5000",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

function toSlug(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function buildItemListSchema(items, pageUrl, listName = "Tour Packages") {
  if (!items?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    url: pageUrl,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 50).map((item, idx) => {
      const city = item.city || item.name || "Unknown";
      const slug = item.slug || toSlug(city);
      const url = item.url || `${SITE_URL}/destinations/${slug}`;
      return {
        "@type": "ListItem",
        position: idx + 1,
        name: item.title || city,
        url,
        item: {
          "@type": "TouristDestination",
          "@id": url,
          name: city,
          description: item.description || item.tagline || `Explore ${city} with NavSafar`,
          url,
          touristType: ["Indian Travellers", "Family", "Couple", "Solo"],
          ...(item.image ? { image: item.image } : {}),
          ...(item.country ? { containedInPlace: { "@type": "Country", name: item.country } } : {}),
        },
      };
    }),
  };
}

function buildTouristDestinationSchema(destination, pkgs = []) {
  if (!destination) return null;
  const city = destination.city || destination.name;
  const slug = destination.slug || toSlug(city);
  const url = `${SITE_URL}/destinations/${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "@id": `${url}#destination`,
    name: city,
    url,
    description: destination.description || destination.tagline || `Explore ${city} tour packages with NavSafar`,
    ...(destination.image ? { image: destination.image } : {}),
    touristType: ["Indian Travellers", "Family", "Couple", "Solo", "Adventure"],
    ...(destination.country ? { containedInPlace: { "@type": "Country", name: destination.country } } : {}),
    ...(destination.geo?.latitude
      ? { geo: { "@type": "GeoCoordinates", latitude: destination.geo.latitude, longitude: destination.geo.longitude } }
      : {}),
    ...(destination.famous_attractions?.length
      ? { includesAttraction: destination.famous_attractions.map((a) => ({ "@type": "TouristAttraction", name: a })) }
      : {}),
    ...(pkgs.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${city} Tour Packages`,
            numberOfItems: pkgs.length,
            itemListElement: pkgs.slice(0, 10).map((pkg) => ({
              "@type": "Offer",
              name: pkg.title || `${city} Tour Package`,
              url,
              seller: { "@id": `${SITE_URL}/#organization` },
              itemOffered: {
                "@type": "TouristTrip",
                name: pkg.title || `${city} Tour Package`,
                description:
                  [pkg.duration, pkg.tagline || pkg.description].filter(Boolean).join(" — ") ||
                  `${city} tour package from NavSafar`,
                ...(pkg.image ? { image: pkg.image } : {}),
              },
            })),
          },
        }
      : {}),
    provider: {
      "@type": "TravelAgency",
      "@id": `${SITE_URL}/#organization`,
      name: "NavSafar Travel Solutions",
    },
  };
}

import PathSchemasClient from "./PathSchemasClient.jsx";

// ═════════════════════════════════════════════════════════════════
//  MAIN SERVER COMPONENT (async — loads dynamic config from Supabase)
// ═════════════════════════════════════════════════════════════════

export default async function UniversalSEOEngine({
  showItemList = false,
  items,
  listName,
  destination,
  packages,
}) {
  // 🚀 Load dynamic business config from Supabase (with static fallback)
  const { BUSINESS: config, extras } = await loadBusinessConfig({ forceFresh: false });

  const today = getTodayDate();
  const geoPos = `${config.geo?.latitude || 28.6090};${config.geo?.longitude || 77.1075}`;
  const geoRegion = config.geoRegion || "IN-DL";
  const geoPlacename = config.geoPlacename || "New Delhi, India";

  // ── STATIC JSON-LD SCHEMAS (rendered in SSR HTML) ──
  const schemas = [];
  schemas.push(buildBusinessJsonLd(config));
  schemas.push(buildWebsiteJsonLd(config));
  schemas.push(buildProductJsonLd(config));

  // Page-specific schemas
  if (showItemList && items?.length) {
    const itemList = buildItemListSchema(items, SITE_URL + "/packages", listName);
    if (itemList) schemas.push(itemList);
  }
  if (destination) {
    const destSchema = buildTouristDestinationSchema(destination, packages || []);
    if (destSchema) schemas.push(destSchema);
  }

  return (
    <>
      {/* ── SERVER-RENDERED STRUCTURED DATA ── */}
      {schemas.map((schema, i) => (
        <script
          key={`s-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ── CLIENT-SIDE PATH SCHEMAS (Breadcrumb + WebPage + FAQ) ── */}
      <Suspense fallback={null}>
        <PathSchemasClient />
      </Suspense>

      {/* ── RESOURCE HINTS ── */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://ilvzxhlndbpppbkzujpz.supabase.co" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      <link rel="preload" as="image" href="/assets/bg.jpg" fetchPriority="high" imageSizes="100vw" />
      <link rel="prefetch" as="image" href="/assets/kd.jpg" />
      <link rel="prefetch" as="image" href="/assets/mt.jpg" />
      <link rel="manifest" href="/manifest.json" />

      {/* ── PWA META ── */}
      <meta name="theme-color" content={extras.themeColor || "#0F6177"} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={extras.appleMobileWebAppTitle || config.brandName || "NavSafar"} />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* ── GEO META (dynamic from config) ── */}
      <meta name="geo.region" content={geoRegion} />
      <meta name="geo.placename" content={geoPlacename} />
      <meta name="geo.position" content={geoPos} />
      <meta name="ICBM" content={geoPos} />
      <meta httpEquiv="content-language" content="en-IN" />

      {/* ── SOCIAL VERIFICATION ── */}
      {process.env.NEXT_PUBLIC_FB_APP_ID && (
        <meta property="fb:app_id" content={process.env.NEXT_PUBLIC_FB_APP_ID} />
      )}
      <meta name="pinterest-rich-pin" content={extras.pinterestRichPin || "enabled"} />
      {process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION && (
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION} />
      )}
      <meta name="rating" content={extras.rating || "General"} />
      <meta name="revisit-after" content={extras.revisitAfter || "1 day"} />

      {/* ── DAILY FRESHNESS ── */}
      <meta name="dateModified" content={today} />
      <meta name="datePublished" content={today} />
    </>
  );
}
