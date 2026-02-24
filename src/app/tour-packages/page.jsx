"use client";
import { useState, useEffect } from "react";
import ModernFilterSection from "../components/packages/ModernFilterSection";
import PackageGrid from "../components/packages/PackageGrid";
import { getAllPackages, getPackagesByCategory } from "../components/packages/PackageData";

const TourPackages = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [duration, setDuration] = useState("all");
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 400);
    setPackages(getAllPackages());
  }, []);

  const filterPackages = () => {
    let filtered = getAllPackages();

    if (selectedCategory !== "all") {
      filtered = getPackagesByCategory(selectedCategory);
    }

    if (priceRange !== "all") {
      filtered = filtered.filter(pkg => {
        const price = parseInt(pkg.price.replace(/[₹,]/g, ''));
        switch (priceRange) {
          case "budget":
            return price < 20000;
          case "moderate":
            return price >= 20000 && price < 50000;
          case "premium":
            return price >= 50000 && price < 100000;
          case "luxury":
            return price >= 100000;
          default:
            return true;
        }
      });
    }

    if (duration !== "all") {
      filtered = filtered.filter(pkg => {
        const days = parseInt(pkg.duration.split(' ')[0]);
        switch (duration) {
          case "short":
            return days <= 3;
          case "medium":
            return days >= 4 && days <= 6;
          case "long":
            return days >= 7;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const filteredPackages = filterPackages();

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setPriceRange("all");
    setDuration("all");
  };

  const handleViewDetails = (pkg) => {
    console.log("View details for:", pkg);
  };

  const handleGetQuery = (pkg) => {
    const whatsappNumber = "+918700750589";
    const message = `Package Query:\n\nPackage: ${pkg.title}\nLocation: ${pkg.location}\nDuration: ${pkg.duration}\nPrice: ${pkg.price}\nOriginal Price: ${pkg.originalPrice}\nRating: ${pkg.rating}\n\nPlease provide more details about this package!`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 mb-8 transition-all duration-1000 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-blue-700 text-sm font-medium">✈️ Premium Travel Packages</span>
            </div>
            
            {/* Main Heading */}
            <h1 
              className={`text-5xl md:text-7xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              Discover Your
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dream Destination
              </span>
            </h1>
            
            {/* Subheading */}
            <p 
              className={`text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              Explore handpicked travel experiences with exclusive deals and unforgettable memories
            </p>

            {/* Stats */}
            <div 
              className={`flex flex-wrap justify-center gap-8 mt-12 transition-all duration-1000 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">20+</div>
                <div className="text-gray-600">Premium Packages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">5</div>
                <div className="text-gray-600">Travel Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">50+</div>
                <div className="text-gray-600">Destinations</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Modern Filter Section */}
        <div 
          className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-12 transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <ModernFilterSection
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPriceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedDuration={duration}
            setDuration={setDuration}
            filteredCount={filteredPackages.length}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Results Header */}
       

        {/* Package Grid */}
        <PackageGrid
          packages={filteredPackages}
          onViewDetails={handleViewDetails}
          onGetQuery={handleGetQuery}
          isLoaded={isLoaded}
          selectedCategory={selectedCategory}
        />

        {/* CTA Section */}
        {filteredPackages.length > 0 && (
          <div 
            className={`mt-16 text-center transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h3>
              <p className="text-xl mb-8 text-blue-100">
                Let us create a custom package tailored just for you
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  📞 Contact Us
                </button>
                <button className="px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors duration-300">
                  ✨ Customize Trip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-900 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h3>
          <p className="text-xl text-gray-300 mb-8">
            Book now and get exclusive discounts on all packages
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
            🚀 Explore All Packages
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourPackages;