// src/app/destinations/[slug]/page.jsx
// Server Component — reads from JSON data file directly via getPackages()
import { notFound } from "next/navigation";
import { getPackages } from "../../lib/getPackages";  // ← reads packagesData.json

// … keep all your existing helper functions (toSlug, REGION_MAP etc.) …
// Only change: replace  `import { packages } from "../../models/objAll/packages"`
//          with         `const packages = getPackages();`  inside the component.

function toSlug(city) {
  return city
    .toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// generateStaticParams also uses getPackages so new packages get their own page
export async function generateStaticParams() {
  const packages = getPackages();
  const cities = [...new Set(packages.map((p) => p.city))];
  return cities.map((city) => ({ slug: toSlug(city) }));
}

export default function DestinationPage({ params }) {
  const packages = getPackages(); // ← permanent JSON data

  // … rest of your existing page logic unchanged …
  // Just use `packages` variable instead of the static import
}