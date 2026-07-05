import { Suspense } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

import ClientLoaderWrapper from "./components/loading/ClientLoaderWrapper";
import SiteShell from "./components/SiteShell";
import GlobalSEO from "./components/seo/GlobalSEO";

import { PRIMARY_DOMAIN } from "../lib/domainConfig.js";

/* ── RENDERING ───────────────────────────────────────
 * ISR: pages are cached and re-generated at most once an hour (fast + good for
 * crawl budget/ranking). Admin content edits trigger revalidatePath() in the
 * admin API routes, so changes still go live instantly — no full redeploy.
 * (No headers()/force-dynamic here, otherwise every route would opt out of ISR.)
 */
export const revalidate = 3600;

/* ── FONTS ───────────────────────────────────────────
 * Self-hosted via next/font (no render-blocking, font-display:swap, preloaded,
 * zero layout shift → good for LCP/SEO). These feed --font-sans / --font-heading
 * in globals.css. Body = Inter (highly readable), Headings = Plus Jakarta Sans
 * (distinct, premium). Display = 'Reey' (loaded via @font-face in globals.css).
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
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

/* ─────────────────────────────────────────────────────────────
   METADATA
───────────────────────────────────────────────────────────── */
export function generateMetadata() {
  const siteName = "NavSafar";
  const keywords = getDailyKeywords();

  // NOTE: no site-wide `alternates.canonical` here. Each page sets its own
  // self-referential canonical; a single default would wrongly point every
  // page at the homepage URL. Single-domain consolidation (see proxy.js) also
  // makes the old cross-domain hreflang cluster unnecessary — removed.
  return {
    metadataBase: new URL(PRIMARY_DOMAIN),

    title: {
      default: `${siteName} | Book Domestic & International Tour Packages`,
      template: `%s | ${siteName}`,
    },

    description:
      "NavSafar - Your trusted travel partner. Book domestic & international tour packages, flights, hotels, visa services.",

    keywords: [
      "travel agency india",
      "tour packages india",
      "domestic tours",
      "international tours",
      "flight booking",
      "hotel booking",
      "visa services",
      ...keywords,
    ],

    authors: [{ name: "NavSafar Team" }],

    creator: "NavSafar",

    openGraph: {
      title: `${siteName} - Explore World's Best Destinations`,
      description:
        "Book domestic & international tour packages with NavSafar.",
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
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${siteName} - Book Tour Packages`,
      description:
        "Explore world's best destinations with NavSafar.",
      images: [`${PRIMARY_DOMAIN}/assets/bg.jpg`],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   DYNAMIC SHELL
───────────────────────────────────────────────────────────── */
async function DynamicShell({ children }) {
  return (
    <>
      {/* SEO + AEO + GEO + AIO — runs once for every page */}
      <GlobalSEO />

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
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {/* Performance */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          rel="preconnect"
          href="https://ilvzxhlndbpppbkzujpz.supabase.co"
        />

        <link
          rel="dns-prefetch"
          href="https://www.googletagmanager.com"
        />

        {/* ✅ Hero LCP image preload — fetchpriority high se browser seedha download karta hai */}
        <link
          rel="preload"
          as="image"
          href="/assets/bg.jpg"
          // @ts-ignore
          fetchpriority="high"
          imageSizes="100vw"
        />

        {/* ✅ Next slide preload */}
        <link rel="prefetch" as="image" href="/assets/kd.jpg" />
        <link rel="prefetch" as="image" href="/assets/mt.jpg" />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />

        <meta name="theme-color" content="#0F6177" />

        <meta
          name="apple-mobile-web-app-capable"
          content="yes"
        />

        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        <meta
          name="apple-mobile-web-app-title"
          content="NavSafar"
        />
      </head>

      <body
        className={`${inter.variable} ${jakarta.variable} antialiased`}
      >

        {/* Dynamic shell. The Suspense boundary is required so client pages that
            read useSearchParams (login/signup/search) can prerender. Note: it also
            streams an early shell, so page-level notFound()/redirect() render as
            soft-404s (HTTP 200 + auto noindex). Real 301 redirects that matter for
            SEO (domain consolidation, /tour-packages, legacy /travel keyword URLs)
            are handled in middleware/next.config, before rendering. */}
        <Suspense fallback={null}>
          <SpeedInsights/>
          <Analytics/>
          <DynamicShell>{children}</DynamicShell>
        </Suspense>

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              window.dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}

