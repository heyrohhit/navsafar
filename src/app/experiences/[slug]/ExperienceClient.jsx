"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePackages } from "../../hooks/usePackages";
import PackageGridLayout from "../../components/packages/PackageGridLayout";
import packagesData from "../../../data/packagesData.json";

// ── FILTER FUNCTION ─────────────────────────────
function getPackagesForCategory(slug, packages) {
  if (!slug) return [];

  const normalizedSlug = slug.toLowerCase().replace(/-/g, " "); // "hill-stations" → "hill stations"

  return packages.filter((p) => {
    const inCategory = p.category?.some(
      (c) => c.toLowerCase() === normalizedSlug
    );
    const inTourismType = p.tourism_type?.some(
      (t) => t.toLowerCase() === normalizedSlug
    );
    return inCategory || inTourismType;
  });
}

export default function ExperienceClient({ slug }) {
  const { packages, loading } = usePackages();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  const allPackages = packages?.length ? packages : packagesData;

  const filteredPackages = useMemo(() => {
    if (!slug) return [];
    return getPackagesForCategory(slug, allPackages);
  }, [slug, allPackages]);

  const accent = "#0f6477";

  return (
    <div style={{ background: "#060f11", minHeight: "100vh", color: "#fff" }}>

      {/* HERO */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <Link href="/experiences" style={{ color: accent }}>
          ← Back to Experiences
        </Link>

        <h1 style={{ fontSize: 40, marginTop: 20 }}>
          {slug?.replace(/-/g, " ") || "Experience"} {/* ✅ saare hyphens replace */}
        </h1>

        <p style={{ color: "#94a3b8" }}>
          {filteredPackages.length} packages found
        </p>
      </section>

      {/* CONTENT */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
        {loading ? (
          <p>Loading...</p>
        ) : filteredPackages.length === 0 ? (
          <p>No packages found</p>
        ) : (
          <PackageGridLayout
            packages={filteredPackages}
            btns={[
              { label: "View Details", type: "viewDetails" },
              { label: "Get Query", type: "getQuery" },
            ]}
          />
        )}
      </section>
    </div>
  );
}