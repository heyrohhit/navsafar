import ExperienceClient from "./ExperienceClient";

// ── Metadata ──
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const packagesData = (await import("../../../data/packagesData.json")).default;
  const catPackages = packagesData.filter((p) => p.category?.includes(slug));

  const label = slug ? slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Travel";
  const title = `${label} Travel Packages | NavSafar`;
  const description =
    catPackages[0]?.description ||
    `Explore ${label} travel experiences with NavSafar. Customised packages for Indian travellers with best prices in INR.`;
  const canonicalUrl = `https://www.navsafar.com/experiences/${slug}`;

  return {
    title,
    description,
    keywords: [`${label.toLowerCase()} tour package`, `${label.toLowerCase()} holiday india`, `${label.toLowerCase()} travel package india`],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      locale: "en_IN",
      images: catPackages[0]?.image
        ? [{ url: catPackages[0].image, width: 1200, height: 630, alt: title }]
        : [{ url: "https://www.navsafar.com/assets/bg.jpg", width: 1200, height: 630, alt: "NavSafar" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ── PAGE ──
export default async function ExperiencePage({ params }) {
  const { slug } = await params;

  if (!slug) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ color: "gray", padding: 40, width: "100vw", height: "100vh" }}
      >
        Invalid URL
      </div>
    );
  }

  const label = slug ? slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Travel";

  return (
    <>
      {/* FAQPage JSON-LD for AEO/GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `What kind of ${label.toLowerCase()} travel experiences does NavSafar offer?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `NavSafar curates ${label.toLowerCase()} experiences such as adventure trips, beach holidays, hill station getaways, heritage and pilgrimage tours, wildlife safaris and honeymoon packages, customised for Indian travellers.`,
                },
              },
              {
                "@type": "Question",
                name: `Are ${label.toLowerCase()} experiences safe with NavSafar?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. We work with licensed, verified local operators for activities like trekking, rafting, scuba diving and paragliding, and safety equipment and trained guides are always included.",
                },
              },
              {
                "@type": "Question",
                name: `Can ${label.toLowerCase()} experiences be combined with a regular tour package?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Absolutely. You can add curated experiences — a desert safari, backwater cruise, cooking class or wildlife safari — to any tour package for a richer, more memorable trip.",
                },
              },
              {
                "@type": "Question",
                name: "Are there family-friendly and senior-friendly experiences?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, we offer relaxed sightseeing, cultural tours, scenic toy-train rides and easy nature walks that are comfortable for children and senior travellers.",
                },
              },
            ],
          }),
        }}
      />
      <ExperienceClient slug={slug} />
    </>
  );
}