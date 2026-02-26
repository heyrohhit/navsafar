"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { adventures } from "../../models/objAll/AdventureExperience";
import PackageGridLayout from "../../components/packages/PackageGridLayout";

const ExperienceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  if (!params?.slug) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Experience Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            The experience category you're looking for doesn't exist.
          </p>
          <Link
            href="/experiences"
            className="px-6 py-3 bg-black text-white rounded-full hover:scale-105 transition-all duration-300"
          >
            Back to Experiences
          </Link>
        </div>
      </div>
    );
  }

  const getSampleExperiences = (categoryName) => {
    switch (categoryName.toLowerCase()) {
      case "adventure":
        return adventures;
      default:
        return [];
    }
  };

  const experiences = getSampleExperiences(params.slug);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/pattern.svg')] bg-cover"></div>
        
        <div
          className={`relative z-10 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold capitalize mb-4 tracking-wide">
            {params.slug} Experiences
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Discover unforgettable journeys and premium adventure packages
            curated just for thrill seekers.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {experiences.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-2xl shadow-md">
            <p className="text-gray-500 text-lg">
              No experiences available in this category.
            </p>
          </div>
        ) : (
          <div className="transition-all duration-500">
            <PackageGridLayout packages={experiences} />
          </div>
        )}
      </section>
    </div>
  );
};

export default ExperienceDetailPage;