// src/lib/seo.js
// ─────────────────────────────────────────────────────────────
// ✅ STATIC METADATA — Single source of truth for static pages
// Used by pages that don't need dynamic data
// ─────────────────────────────────────────────────────────────

export const siteConfig = {
  name: "NavSafar Travel Solutions",
  brandName: "NavSafar",
  url: "https://navsafar.com",
  defaultImage: "https://navsafar.com/assets/bg.jpg",
};

export const seoData = {
  home: {
    title: "Best Travel Agency in India | NavSafar",
    description:
      "NavSafar Travel Solutions — trusted travel agency in New Delhi. Customised domestic & international tour packages, flights, hotels, visa services for Indian travellers.",
    path: "/",
    keywords: [
      "best travel agency india",
      "tour packages india",
      "domestic tours india",
      "international tour packages",
      "travel agency delhi",
      "holiday packages india",
    ],
  },
  destinations: {
    title: "Top Destinations in India & Abroad | NavSafar Travel",
    description:
      "Explore the most popular domestic and international destinations with NavSafar Travel Solutions. Customised tours, hotels, and complete travel planning available.",
    path: "/destinations",
    keywords: [
      "destinations india",
      "top travel destinations",
      "goa manali kerala rajasthan",
      "international destinations",
      "travel destinations 2026",
    ],
  },
  tourPackages: {
    title: "Tour Packages — Domestic & International | NavSafar",
    description:
      "Discover our exclusive tour packages for domestic and international travel. Get fully customised itineraries and bookings with NavSafar Travel Solutions.",
    path: "/tour-packages",
    keywords: [
      "tour packages india",
      "domestic tour packages",
      "international tour packages",
      "holiday packages 2026",
      "customised tour packages",
    ],
  },
  services: {
    title: "Our Travel Services | NavSafar Travel Solutions",
    description:
      "Explore our travel services including holiday packages, corporate travel management, MICE services, hotel bookings, visa assistance and flights.",
    path: "/pages/services",
    keywords: [
      "travel services india",
      "corporate travel management",
      "mice services delhi",
      "visa assistance india",
      "hotel booking india",
    ],
  },
  about: {
    title: "About Us | NavSafar Travel Solutions",
    description:
      "Learn more about NavSafar Travel Solutions — India-based travel agency in New Delhi offering domestic & international tour packages for Indian travellers.",
    path: "/pages/about-us",
    keywords: [
      "about navsafar",
      "navsafar travel agency",
      "travel agency new delhi",
      "trusted travel agency india",
    ],
  },
  contact: {
    title: "Contact Us | NavSafar Travel Solutions",
    description:
      "Get in touch with NavSafar Travel Solutions. Call +91-8882128640, email info@navsafartravels.com or visit our office in New Delhi for tour packages & travel enquiries.",
    path: "/pages/contact",
    keywords: [
      "contact navsafar",
      "navsafar phone number",
      "travel agency contact delhi",
      "book tour package india",
    ],
  },
  blog: {
    title: "Travel Blog | NavSafar Travel",
    description:
      "Read our travel blog for tips, destination guides, and travel inspiration from NavSafar Travel Solutions.",
    path: "/blog",
    keywords: [
      "travel blog india",
      "travel tips india",
      "destination guide",
      "travel inspiration",
    ],
  },
  booking: {
    title: "Book Your Trip | NavSafar Travel",
    description:
      "Book your dream trip with NavSafar. Contact us for customised tour packages, flights, hotels, and complete travel solutions for Indian travellers.",
    path: "/booking",
    keywords: [
      "book tour package",
      "book travel india",
      "online booking travel",
    ],
  },
  search: {
    title: "Search Tour Packages | NavSafar",
    description:
      "Search domestic and international tour packages on NavSafar. Find packages by destination, budget or travel style.",
    path: "/search",
    keywords: [
      "search tour packages",
      "find holiday package",
      "travel package search india",
    ],
  },
};

/**
 * Returns complete Next.js metadata object for a given page key.
 * Includes canonical, OG, Twitter, keywords — ready to export.
 *
 * @param {keyof typeof seoData} pageKey
 * @returns {import("next").Metadata}
 */
export function getStaticMetadata(pageKey) {
  const page = seoData[pageKey];
  if (!page) return {};

  const canonicalUrl = `${siteConfig.url}${page.path}`;
  const fullTitle = `${page.title}`;

  return {
    title: fullTitle,
    description: page.description,
    keywords: page.keywords ?? [],

    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": canonicalUrl,
        "en-IN": canonicalUrl,
        "en": canonicalUrl,
      },
    },

    openGraph: {
      title: fullTitle,
      description: page.description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: siteConfig.defaultImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.brandName} — Travel Agency India`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: page.description,
      images: [siteConfig.defaultImage],
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
