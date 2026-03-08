"use client";

import FeaturedPackages from "./components/packages/FeaturedPackages";
import FeatuersSection from "./components/features/FeaturesSection";
import ExperienceCategories from "./experiences/ExperienceCategories";
import CTASection from "./components/cta/CTASection";
import Herosections from "./components/hero/HeroSections";
import AboutUs from "./pages/about-us/About";

export default function Page() {
  return (
    <div className="pt-16 md:pt-16 pb-20 md:pb-0 min-h-screen bg-white">
      <div className="relative overflow-hidden">
        <Herosections />
        <FeaturedPackages limit={5} />
        <ExperienceCategories />
        <FeatuersSection />
        <AboutUs />
        <CTASection />
      </div>
    </div>
  );
}