// src/app/layout.jsx
// ─────────────────────────────────────────────────────────────
// Navsafar — FINAL PRODUCTION ROOT LAYOUT
// ─────────────────────────────────────────────────────────────

import { Suspense }  from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Script        from "next/script";
import { headers }   from "next/headers";
import "./globals.css";
import ClientLoaderWrapper from "./components/loading/ClientLoaderWrapper";
import SiteShell           from "./components/SiteShell";
import {
  PRIMARY_DOMAIN,
  getDomainEntry,
  buildHreflangAlternates,
} from "../lib/domainConfig.js";

/* ── FONTS ───────────────────────────────────────── */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

/* ── KEYWORDS ────────────────────────────────────── */
const ALL_KEYWORDS = [
  "goa beach holiday package",
  "manali snow trip 2026",
  "kedarnath yatra package",
  "bali honeymoon package 2026",
  "dubai family tour package",
  "maldives luxury resort package",
  "weekend getaway from delhi",
  "cheap flight booking india",
  "travel agency delhi ncr",
  "best honeymoon destination india 2026",
];

function getDateSeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed >>> 0;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getDailyKeywords() {
  return seededShuffle(ALL_KEYWORDS, getDateSeed()).slice(0, 10);
}

/* ── JSON-LD ─────────────────────────────────────── */
function getJsonLd(siteName) {
  return {
    "@context": "https://schema.org",
    "@type":    "TravelAgency",
    name:       siteName,
    url:        PRIMARY_DOMAIN,
    // Local Business Schema for India
    address: {
      "@type": "PostalAddress",
      "streetAddress": "WZ-447, First Floor, Left Side Nangal Raya",
      "addressLocality": "Delhi",
      "addressRegion": "Delhi",
      "postalCode": "110046",
      "addressCountry": "IN"
    },
    "telephone": "+91-8882128640",
    "priceRange": "$$",
    "servesArea": {
      "@type": "Place",
      "name": "India"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "19:00"
      }
    ]
  };
}

/* ─────────────────────────────────────────────────────────────
   METADATA — Advanced SEO with Structured Data
───────────────────────────────────────────────────────────── */
export async function generateMetadata() {
  const headersList = await headers();
  const domain      = headersList.get("x-domain") ?? "navsafar.com";
  const domainEntry = getDomainEntry(domain);
  const siteName    = domainEntry?.label ?? "NavSafar";
  const keywords    = getDailyKeywords();

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteName,
    url: PRIMARY_DOMAIN,
    logo: `${PRIMARY_DOMAIN}/assets/logo.png`,
    description: "Leading travel agency in India offering domestic & international tour packages, flight bookings, hotels, and visa services.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "WZ-447, First Floor, Left Side Nangal Raya",
      addressLocality: "Delhi",
      addressRegion: "Delhi",
      postalCode: "110046",
      addressCountry: "IN"
    },
    telephone: "+91-8882128640",
    priceRange: "₹5,000 - ₹5,00,000",
    currenciesAccepted: "INR,USD,EURO",
    servesArea: [
      { "@type": "City", name: "Delhi NCR" },
      { "@type": "City", name: "Mumbai" },
      { "@type": "City", name: "Bangalore" },
      { "@type": "City", name: "Chennai" },
      { "@type": "City", name: "Kolkata" },
      { "@type": "Country", name: "India" }
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00"
    },
    sameAs: [
      "https://www.facebook.com/navsafar",
      "https://www.instagram.com/navsafar",
      "https://www.linkedin.com/company/navsafar"
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Travel Packages",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Domestic Tours" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "International Tours" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Flight Booking" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Visa Services" } }
      ]
    }
  };

  // WebSite Schema with potentialAction
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: PRIMARY_DOMAIN,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${PRIMARY_DOMAIN}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Merge structured data
  const jsonLdScript = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, webSiteSchema]
  };

  return {
    metadataBase: new URL(PRIMARY_DOMAIN),
    title: {
      default:  `${siteName} | Book Domestic & International Tour Packages`,
      template: `%s | ${siteName}`,
    },
    description:
      "NavSafar - Your trusted travel partner. Book domestic & international tour packages, flights, hotels, visa services. 10,000+ happy travelers. Get best deals!",
    keywords: [
      "travel agency india",
      "tour packages india",
      "domestic tours",
      "international tours",
      "flight booking",
      "hotel booking",
      "visa services",
      "holiday packages",
      "manali tour",
      "goa packages",
      "kerela backwaters",
      "travel agency delhi",
      ...keywords
    ],
    alternates: {
      canonical: PRIMARY_DOMAIN,
      languages: buildHreflangAlternates(),
    },
    authors: [{ name: "NavSafar Team" }],
    creator: "NavSafar",
    openGraph: {
      title: `${siteName} - Explore World's Best Destinations`,
      description: "Book domestic & international tour packages with NavSafar. 10,000+ happy travelers. Best price guarantee!",
      url: PRIMARY_DOMAIN,
      siteName,
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: `${PRIMARY_DOMAIN}/assets/bg.jpg`,
          width: 1200,
          height: 630,
          alt: "NavSafar - Travel Agency",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} - Book Tour Packages`,
      description: "Explore world's best destinations with NavSafar. Domestic & international tours, flight + hotel bookings.",
      images: [`${PRIMARY_DOMAIN}/assets/bg.jpg`],
      creator: "@navsafar",
      site: "@navsafar",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
    // Additional metadata for India
    other: {
      "geo.region": "IN-DL",
      "geo.placename": "Delhi, India",
      "ICBM": "28.7041,77.1025",
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   DYNAMIC SHELL — server component that reads headers()
   Wrapped in <Suspense> so it doesn't block static page renders
   (fixes "Uncached data outside Suspense" on /destinations/[slug])
───────────────────────────────────────────────────────────── */
async function DynamicShell({ children }) {
  const headersList = await headers();
  const domain      = headersList.get("x-domain") ?? "navsafar.com";
  const domainEntry = getDomainEntry(domain);
  const siteName    = domainEntry?.label ?? "NavSafar";

  // Organization Schema (India-specific)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": siteName,
    "url": PRIMARY_DOMAIN,
    "logo": `${PRIMARY_DOMAIN}/assets/logo.png`,
    "description": "Leading travel agency in India offering domestic & international tour packages with 10,000+ happy travelers.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "WZ-447, First Floor, Left Side Nangal Raya",
      "addressLocality": "Delhi",
      "addressRegion": "Delhi",
      "postalCode": "110046",
      "addressCountry": "IN"
    },
    "telephone": "+91-8882128640",
    "priceRange": "₹5,000 - ₹5,00,000",
    "currenciesAccepted": "INR",
    "servesArea": ["Delhi NCR", "Mumbai", "Bangalore", "India"],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "19:00"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "500+"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Tour Packages",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Honeymoon Packages" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Family Tours" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Adventure Trips" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pilgrimage Tours" } }
      ]
    }
  };

  // WebSite
  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": PRIMARY_DOMAIN,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${PRIMARY_DOMAIN}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <ClientLoaderWrapper>
        <SiteShell>{children}</SiteShell>
      </ClientLoaderWrapper>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   ROOT LAYOUT
───────────────────────────────────────────────────────────── */
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Performance - optimized preconnects */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://ilvzxhlndbpppbkzujpz.supabase.co" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Preload hero image */}
        <link
          rel="preload"
          as="image"
          href="/assets/bg.jpg"
          imagesrcset="/assets/bg.jpg 320w,/assets/bg.jpg 768w,/assets/bg.jpg 1200w"
          imagesizes="100vw"
        />
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0F6177" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NavSafar" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/*
          ✅ Suspense boundary — DynamicShell uses headers() which is
          dynamic data. Wrapping in Suspense prevents it from blocking
          static page prerendering (fixes /destinations/[slug] error).
        */}
        <Suspense fallback={null}>
          <DynamicShell>{children}</DynamicShell>
        </Suspense>

        {/* Google Analytics - lazy loaded */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="lazyOnload"
        />
        <Script id="ga" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}