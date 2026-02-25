"use client";
import { useState, useEffect } from "react";
import LoadingScreen from "./components/loading/LoadingScreen";
import HeroSection from "./components/hero/HeroSection";
import FeaturesSection from "./components/features/FeaturesSection";
import FeaturedPackages from "./components/packages/FeaturedPackages";
import ExperienceCategories from "./components/experiences/ExperienceCategories";
import DestinationsSection from "./destinations/page";
import CTASection from "./components/cta/CTASection";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Listen for menu open/close events
  useEffect(() => {
    const handleMenuToggle = (event) => {
      setIsMenuOpen(event.detail.isOpen);
    };

    window.addEventListener('menuToggle', handleMenuToggle);
    
    return () => {
      window.removeEventListener('menuToggle', handleMenuToggle);
    };
  }, []);

  const handleLoadingComplete = () => {
    // Loading screen will hide itself
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="pt-16 md:pt-16 pb-20 md:pb-0 min-h-screen bg-white overflow-hidden">
      {/* Main Content */}
      <div className="relative">
        <HeroSection isMenuOpen={isMenuOpen} />
        <FeaturedPackages />
        <ExperienceCategories />
        <DestinationsSection limit={3} />
        <FeaturesSection />
        <CTASection />
      </div>
    </div>
  );
};

export default Page;