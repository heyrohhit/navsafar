// src/app/components/seo/UniversalSchemaInjector.jsx
// ─────────────────────────────────────────────────────────────────
// 🔖 UNIVERSAL SCHEMA INJECTOR
//
// Adds rich structured data that GlobalSEO.jsx does NOT produce
// because these schemas require PAGE-LEVEL data (packages list, etc.)
//
// Usage — drop into any SERVER component page that lists packages:
//
//   import UniversalSchemaInjector from "@/app/components/seo/UniversalSchemaInjector";
//
//   // In a listing page:
//   <UniversalSchemaInjector type="itemList" items={packages} pageUrl="https://www.navsafar.com/packages" />
//
//   // In a single destination page:
//   <UniversalSchemaInjector type="touristDestination" destination={dest} packages={cityPackages} />
//
// Schemas produced:
//   • ItemList          → /packages, /tour-packages, /destinations listing pages
//   • TouristDestination (enhanced) → /destinations/[slug]
//   • TravelPackage (Offer)         → per-package card on listing pages
// ─────────────────────────────────────────────────────────────────

const SITE_URL = "https://www.navsafar.com";

function toSlug(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/* ── ItemList schema for package/destination listing pages ── */
function buildItemListSchema(items = [], pageUrl, listName = "Tour Packages") {
  if (!items.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    url: pageUrl,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 50).map((item, index) => {
      const city = item.city || item.name || "Unknown";
      const citySlug = item.slug || toSlug(city);
      const itemUrl = item.url || `${SITE_URL}/destinations/${citySlug}`;

      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.title || city,
        url: itemUrl,
        item: {
          "@type": "TouristDestination",
          "@id": itemUrl,
          name: city,
          description: item.description || item.tagline || `Explore ${city} with NavSafar`,
          url: itemUrl,
          touristType: ["Indian Travellers", "Family", "Couple", "Solo"],
          ...(item.image ? { image: item.image } : {}),
          ...(item.country ? {
            containedInPlace: {
              "@type": "Country",
              name: item.country,
            }
          } : {}),
          ...(item.rating ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: item.rating,
              bestRating: 5,
              ratingCount: Math.floor(item.rating * 100),
            }
          } : {}),
        },
      };
    }),
  };
}

/* ── TouristDestination schema (enhanced) for /destinations/[slug] ── */
function buildTouristDestinationSchema(destination, packages = []) {
  if (!destination) return null;

  const city = destination.city || destination.name;
  const citySlug = destination.slug || toSlug(city);
  const pageUrl = `${SITE_URL}/destinations/${citySlug}`;

  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "@id": `${pageUrl}#destination`,
    name: city,
    description: destination.description || destination.tagline || `Explore ${city} tour packages with NavSafar`,
    url: pageUrl,
    ...(destination.image ? { image: destination.image } : {}),
    touristType: ["Indian Travellers", "Family", "Couple", "Solo", "Adventure"],
    ...(destination.country ? {
      containedInPlace: {
        "@type": "Country",
        name: destination.country,
      }
    } : {}),
    ...(destination.geo?.latitude ? {
      geo: {
        "@type": "GeoCoordinates",
        latitude: destination.geo.latitude,
        longitude: destination.geo.longitude,
      }
    } : {}),
    ...(destination.famous_attractions?.length ? {
      includesAttraction: destination.famous_attractions.map((attr) => ({
        "@type": "TouristAttraction",
        name: attr,
      })),
    } : {}),
    ...(destination.rating ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: destination.rating,
        bestRating: 5,
        ratingCount: Math.floor(destination.rating * 120),
      }
    } : {}),
    ...(packages.length ? {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${city} Tour Packages`,
        numberOfItems: packages.length,
        itemListElement: packages.slice(0, 10).map((pkg) => ({
          "@type": "Offer",
          name: pkg.title || `${city} Tour Package`,
          description: pkg.description || pkg.tagline || `${city} tour package from NavSafar`,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          validFrom: new Date().toISOString().split("T")[0],
          seller: {
            "@type": "TravelAgency",
            name: "NavSafar Travel Solutions",
            url: SITE_URL,
          },
          ...(pkg.duration ? { description: `${pkg.duration} — ${pkg.description || pkg.tagline || ""}` } : {}),
        })),
      }
    } : {}),
    provider: {
      "@type": "TravelAgency",
      "@id": `${SITE_URL}/#organization`,
      name: "NavSafar Travel Solutions",
    },
  };
}

/* ── Main component ── */
export default function UniversalSchemaInjector({
  // Listing mode: pass type="itemList" + items[]
  type,
  items,
  pageUrl,
  listName,

  // Destination detail mode: pass destination={} + packages=[]
  destination,
  packages,
}) {
  const schemas = [];

  if (type === "itemList" && items?.length) {
    const schema = buildItemListSchema(items, pageUrl, listName);
    if (schema) schemas.push(schema);
  }

  if (type === "touristDestination" && destination) {
    const schema = buildTouristDestinationSchema(destination, packages || []);
    if (schema) schemas.push(schema);
  }

  if (!schemas.length) return null;

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
