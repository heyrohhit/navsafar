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
  const canonicalUrl = `https://navsafar.com/experiences/${slug}`;

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
        : [{ url: "https://navsafar.com/assets/bg.jpg", width: 1200, height: 630, alt: "NavSafar" }],
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
  const { slug } = await params; // ✅ destructure karo

  console.log("console slug is", slug);

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

  return <ExperienceClient slug={slug} />;
}