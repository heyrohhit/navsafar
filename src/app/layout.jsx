// src/app/layout.jsx
// ─────────────────────────────────────────────────────────────
// NavSafar — FINAL PRODUCTION ROOT LAYOUT
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
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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
  };
}

/* ─────────────────────────────────────────────────────────────
   METADATA — reads x-domain set by middleware (edge-safe)
───────────────────────────────────────────────────────────── */
export async function generateMetadata() {
  const headersList = await headers();
  const domain      = headersList.get("x-domain") ?? "navsafar.com";
  const domainEntry = getDomainEntry(domain);
  const siteName    = domainEntry?.label ?? "NavSafar";
  const keywords    = getDailyKeywords();

  return {
    metadataBase: new URL(PRIMARY_DOMAIN),
    title: {
      default:  `${siteName} | Travel, Tours & Holiday Packages`,
      template: `%s | ${siteName}`,
    },
    description:
      "Book domestic & international travel packages, flights, hotels & visa services with NavSafar.",
    keywords,
    alternates: {
      canonical: PRIMARY_DOMAIN,
      languages: buildHreflangAlternates(),
    },
    openGraph: {
      title:    `${siteName} | Explore The World`,
      url:      PRIMARY_DOMAIN,
      siteName,
      type:     "website",
    },
    twitter: {
      card:  "summary_large_image",
      title: `${siteName} | Travel Packages`,
    },
    robots: {
      index:  true,
      follow: true,
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
  const jsonLd      = getJsonLd(siteName);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
        {/* Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga" strategy="afterInteractive">
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