import ExperienceClient from "./ExperienceClient";

// ── Metadata ──
export async function generateMetadata({ params }) {
  const slug = params?.slug;

  const packagesData = (await import("../../../data/packagesData.json")).default;

  const catPackages = packagesData.filter((p) =>
    p.category?.includes(slug)
  );

  const title = slug
    ? `${slug.replace("-", " ")} Travel Packages | NavSafar`
    : "Travel Packages | NavSafar";

  return {
    title,
    description:
      catPackages[0]?.description ||
      "Explore amazing travel experiences with NavSafar",
  };
}

// ── PAGE ──
export default function ExperiencePage({ params }) {
  const slug = params?.slug; // ✅ SAFE ACCESS

  if (!slug) {
    return (
      <div className="flex justify-center items-center" style={{ color: "gray", padding: 40 ,width: "100vw", height:"100vh"}}>
        Invalid URL
      </div>
    );
  }

  return <ExperienceClient slug={slug} />;
}