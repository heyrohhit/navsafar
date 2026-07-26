// src/lib/seo.js
// ─────────────────────────────────────────────────────────────
// 📄 STATIC METADATA — for pages that don't need daily rotation
// Kept separate from seoEngine.js (which handles dynamic SEO).
// ─────────────────────────────────────────────────────────────

/**
 * Static metadata for informational pages (about, contact, etc.)
 * @param {"about"|"contact"|"services"|"privacy"|"terms"|"refund"} page
 * @returns {import("next").Metadata}
 */
export function getStaticMetadata(page) {
  const site = "NavSafar";
  const url = "https://www.navsafar.com";

  const metadataMap = {
    about: {
      title: `About Us | ${site} Travel Solutions`,
      description:
        "NavSafar Travel Solutions is New Delhi's trusted travel agency offering customised domestic & international tour packages, hotel bookings, flights and visa assistance for Indian travellers.",
      keywords: [
        "about navsafar",
        "navsafar travel agency",
        "navsafar new delhi",
        "best travel agency in delhi",
      ],
      alternates: { canonical: `${url}/pages/about-us` },
      openGraph: {
        title: `About NavSafar Travel Solutions`,
        description:
          "Learn about NavSafar — India's trusted travel partner for customised domestic and international holidays.",
        url: `${url}/pages/about-us`,
      },
    },

    contact: {
      title: `Contact Us | ${site} Travel Solutions`,
      description:
        "Get in touch with NavSafar Travel Solutions. Call +91-8882128640, email or visit our New Delhi office. We're here to plan your perfect trip.",
      keywords: [
        "contact navsafar",
        "navsafar phone number",
        "navsafar email",
        "navsafar new delhi address",
        "travel agency contact",
      ],
      alternates: { canonical: `${url}/pages/contact` },
      openGraph: {
        title: `Contact NavSafar Travel Solutions`,
        description:
          "Reach out to NavSafar for customised tour packages, flight bookings and travel assistance.",
        url: `${url}/pages/contact`,
      },
    },

    services: {
      title: `Our Services | ${site} Travel Solutions`,
      description:
        "Explore NavSafar's travel services — customised tour packages, flight & hotel booking, visa assistance, group tours and 24/7 travel support.",
      alternates: { canonical: `${url}/pages/services` },
    },

    privacy: {
      title: `Privacy Policy | ${site}`,
      description: `Read the privacy policy of ${site} — how we collect, use and protect your personal information when you book travel packages.`,
      alternates: { canonical: `${url}/policies/privacy` },
    },

    terms: {
      title: `Terms & Conditions | ${site}`,
      description: `Review the terms and conditions for booking travel packages with ${site} Travel Solutions.`,
      alternates: { canonical: `${url}/policies/terms` },
    },

    refund: {
      title: `Cancellation & Refund Policy | ${site}`,
      description: `Learn about ${site}'s cancellation and refund policy for domestic and international tour packages.`,
      alternates: { canonical: `${url}/policies/refund` },
    },
  };

  const meta = metadataMap[page] || metadataMap.about;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords || [],
    alternates: meta.alternates || {},
    openGraph: meta.openGraph || {
      title: meta.title,
      description: meta.description,
    },
    robots: { index: true, follow: true },
  };
}
