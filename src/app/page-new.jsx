import HeroSection from "./components/hero/HeroSection";
import FeaturesSection from "./components/features/FeaturesSection";
import DestinationsSection from "./destinations/page";
import CTASection from "./components/cta/CTASection";

const Page = () => {
  return (
    <div className="pt-16 md:pt-16 pb-20 md:pb-0 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <DestinationsSection />
      <CTASection />
    </div>
  );
};

export default Page;
