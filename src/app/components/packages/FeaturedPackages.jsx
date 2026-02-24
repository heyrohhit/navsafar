"use client";
import { useState } from "react";
import { packages } from "../../api/packages";
import Link from "next/link";
import PackageGridLayout from "./PackageGridLayout";

const FeaturedPackages = () => {
  const [showAllPackages, setShowAllPackages] = useState(false);

  const displayPackages = showAllPackages
    ? packages
    : packages.filter(pkg => pkg.popular).slice(0, 5);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">

      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold">
          {showAllPackages ? "All Travel Packages" : "Featured Packages"}
        </h2>
      </div>

      {/* 👇 Global Layout Use */}
      <PackageGridLayout packages={displayPackages} />

      <div className="text-center mt-12">
        <Link
          href="/packages"
          className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl"
        >
          {showAllPackages ? "Show Popular Packages" : "View All Packages"}
        </Link>
      </div>

    </section>
  );
};

export default FeaturedPackages;