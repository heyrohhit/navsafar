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
import { getDailyKeywords, getDailyHomeTitle, getDailyHomeDescription } from "../lib/seoEngine.js";

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

/* ── DYNAMIC KEYWORD ENGINE ── imported from lib/seoEngine.js
 * 200+ travel keywords in daily rotation. Each day a fresh subset is selected
 * deterministically so Google sees fresh semantic signals without duplicate content.
 */

/* ─────────────────────────────────────────────────────────────
   METADATA
───────────────────────────────────────────────────────────── */
export function generateMetadata() {
  const siteName = "NavSafar";
  const today = new Date().toISOString().split("T")[0];

  // Daily rotating title & description for maximum keyword freshness
  const homeTitle = getDailyHomeTitle();
  const homeDesc = getDailyHomeDescription();
  const dailyKeywords = getDailyKeywords(20);

  // NOTE: no site-wide `alternates.canonical` here. Each page sets its own
  // self-referential canonical; a single default would wrongly point every
  // page at the homepage URL. Single-domain consolidation (see proxy.js) also
  // makes the old cross-domain hreflang cluster unnecessary — removed.
  return {
    metadataBase: new URL(PRIMARY_DOMAIN),

    title: {
      default: homeTitle,
      template: `%s | ${siteName}`,
    },

    description: homeDesc,

    keywords: [
      "navsafar",
      "travel agency india",
      "tour packages",
      "holiday packages",
      ...dailyKeywords,
    ],

    authors: [{ name: "NavSafar Team" }],

    creator: "NavSafar",

    openGraph: {
      title: homeTitle,
      description: homeDesc,
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
      title: homeTitle,
      description: homeDesc,
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

    // hreflang for multi-language support (AEO/GEO/XOS)
    alternates: {
      languages: {
        "en-IN": PRIMARY_DOMAIN,
        "en": PRIMARY_DOMAIN,
        "x-default": PRIMARY_DOMAIN,
      },
    },

    // dateModified for freshness signals (GEO: AI engines prefer recent content)
    other: {
      "dateModified": today,
      "datePublished": today,
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

