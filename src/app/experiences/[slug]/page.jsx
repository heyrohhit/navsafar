import ExperienceClient from "./ExperienceClient";

// ── Metadata ──
export async function generateMetadata({ params }) {
  const { slug } = await params; // ✅ destructure karo

  const packagesData = (await import("../../../data/packagesData.json")).default;

  const catPackages = packagesData.filter((p) =>
    p.category?.includes(slug)
  );

  const title = slug
    ? `${slug.replace(/-/g, " ")} Travel Packages | NavSafar`  // ✅ all hyphens replace honge
    : "Travel Packages | NavSafar";

  return {
    title,
    description:
      catPackages[0]?.description ||
      "Explore amazing travel experiences with NavSafar",
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