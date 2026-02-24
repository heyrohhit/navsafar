"use client";
import { useState, useEffect } from "react";
import { handleGetQuery } from "./PackageUtils";
import PopUpFeature from "./PopUpFeature";
import BlogShow from "../../blog/blogShow";

const PackageGridLayout = ({ packages, btn }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); // ✅ fixed

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div
          className="
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
        "
        >
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`w-full break-inside-avoid mb-6 group relative bg-white rounded-2xl shadow-lg 
              hover:shadow-2xl transition-all duration-500 transform overflow-hidden
              ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
              ${hoveredCard === pkg.id ? "-translate-y-2" : ""}`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredCard(pkg.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image */}
              <div
                className="relative overflow-hidden 
                              aspect-[4/3] 
                              md:aspect-[4/3] 
                              lg:aspect-auto"
              >
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover lg:h-auto"
                />

                {/* Duration only for packages */}
                {!btn && pkg.duration && (
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 text-gray-800 text-xs font-semibold rounded-full">
                      {pkg.duration}
                    </span>
                  </div>
                )}

                {/* Discount only for packages */}
                {!btn && pkg.discount && (
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      {pkg.discount}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors duration-300">
                  {pkg.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                  {pkg.description || pkg.excerpt}
                </p>

                {btn ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedItem(pkg)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg hover:scale-105 transition"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => handleGetQuery(pkg)}
                      className="w-full px-4 py-2 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition"
                    >
                      Get Query
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedItem(pkg)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg hover:scale-105 transition"
                    >
                      Read More
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedItem && selectedItem.inclusions && (
  <PopUpFeature
    selectedPackage={selectedItem}
    onClose={() => setSelectedItem(null)}
  />
)}

{selectedItem && selectedItem.tags && (
  <BlogShow
    selectedBlog={selectedItem}
    onClose={() => setSelectedItem(null)}
  />
)}
    </>
  );
};

export default PackageGridLayout;