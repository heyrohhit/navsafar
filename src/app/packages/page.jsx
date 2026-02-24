"use client";
import { useState, useEffect } from "react";
import {packages} from "../../models/packages"


const FeaturedPackages = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showAllPackages, setShowAllPackages] = useState(false);

 

  const displayPackages = showAllPackages ? packages : packages.filter(pkg => pkg.popular).slice(0, 5);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  const handleCardHover = (id) => {
    setHoveredCard(id);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  const handleGetQuery = (pkg) => {
    const whatsappNumber = "+918700750589";
    const message = `Package Query:\n\nPackage: ${pkg.title}\nLocation: ${pkg.location}\nDuration: ${pkg.duration}\nPrice: ${pkg.price}\n\nPlease provide more details about this package!`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleViewDetails = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleCloseDetails = () => {
    setSelectedPackage(null);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto flex justify-center flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 bg-sky-100 rounded-full border border-sky-200 mb-6 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></span>
            <span className="text-sky-700 text-sm font-medium">
              All Packages
            </span>
          </div>
          
          <h2 
            className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            All Travel
            <span className="block bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
              Packages
            </span>
          </h2>
          
          <p 
            className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            Browse our complete collection of travel packages
          </p>
        </div>
        
  {/* Pinterest Masonry Layout */}
<div className="max-w-7xl mx-auto px-4 py-10">

  <div className="
      mx-auto
      w-full
      sm:max-w-[600px]
      md:max-w-[900px]
      lg:max-w-[1200px]
      columns-1
      sm:columns-1
      md:columns-2
      lg:columns-3
      gap-6
  ">
    
    {displayPackages.map((pkg, index) => (
      <div
        key={pkg.id}
        className={`w-full break-inside-avoid mb-6 group relative bg-white rounded-2xl shadow-lg 
                    hover:shadow-2xl transition-all duration-500 transform overflow-hidden
                    ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                    ${hoveredCard === pkg.id ? '-translate-y-2' : ''}`}
        style={{
          transitionDelay: `${index * 100}ms`
        }}
        onMouseEnter={() => handleCardHover(pkg.id)}
        onMouseLeave={handleCardLeave}
      >
        
       {/* Image Container */}
<div className="relative overflow-hidden">

 {/* Image Container */}
<div className="relative overflow-hidden 
                aspect-[4/3] 
                md:aspect-[4/3] 
                lg:aspect-auto">

  <img
    src={pkg.image}
    alt={pkg.title}
    className="w-full h-full object-cover lg:h-auto"
  />

</div>

  {/* Duration Badge */}
  <div className="absolute top-3 left-3">
    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-full">
      {pkg.duration}
    </span>
  </div>

  {/* Discount Badge */}
  {pkg.discount && (
    <div className="absolute top-3 right-3">
      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
        {pkg.discount}% OFF
      </span>
    </div>
  )}

</div>

        {/* Card Content */}
        <div className="p-5">

          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors duration-300">
            {pkg.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(pkg.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {pkg.rating}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {pkg.description}
          </p>

          <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Package Inclusions:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {pkg.inclusions.map((inclusion, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {inclusion}
                      </div>
                    ))}
                  </div>
                </div>

          {/* Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => handleViewDetails(pkg)}
              className="w-full px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-medium rounded-lg hover:scale-105 transition"
            >
              View Details
            </button>

            <button
              onClick={() => handleGetQuery(pkg)}
              className="w-full px-4 py-2 border-2 border-orange-500 text-orange-500 font-medium rounded-lg hover:bg-orange-500 hover:text-white transition hover:scale-105"
            >
              Get Query
            </button>
          </div>

        </div>
      </div>
    ))}
  </div>
</div>


        {/* Package Details Modal */}
        {selectedPackage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div className={`h-48 ${getPackageGradient(selectedPackage.category)} flex items-center justify-center relative`}>
                 {/* Image Container */}
<div className="relative overflow-hidden">

  {/* Image Container */}
<div className="relative overflow-hidden aspect-[4/3] rounded-t-2xl">
  <img
    src={selectedPackage.image}
    alt={selectedPackage.title}
    className="w-full h-full object-cover"
  />
</div>

  {/* Duration Badge */}
  <div className="absolute top-3 left-3">
    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-full">
      {selectedPackage.duration}
    </span>
  </div>

  {/* Discount Badge */}
  {selectedPackage.discount && (
    <div className="absolute top-3 right-3">
      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
        {selectedPackage.discount}% OFF
      </span>
    </div>
  )}

</div>
                <button 
                  onClick={handleCloseDetails}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-192px)]">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedPackage.title}</h3>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < Math.floor(selectedPackage.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600">{selectedPackage.rating}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{selectedPackage.duration}</span>
                </div>
                
                <p className="text-gray-700 mb-6">{selectedPackage.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Package Inclusions:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedPackage.inclusions.map((inclusion, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {inclusion}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">{selectedPackage.price}</span>
                    {selectedPackage.originalPrice && (
                      <span className="text-lg text-gray-400 line-through ml-2">{selectedPackage.originalPrice}</span>
                    )}
                  </div>
                  {selectedPackage.discount && (
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                      {selectedPackage.discount}% OFF
                    </span>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleGetQuery(selectedPackage)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Get Query
                  </button>
                  <button 
                    onClick={handleCloseDetails}
                    className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};


export default FeaturedPackages;
