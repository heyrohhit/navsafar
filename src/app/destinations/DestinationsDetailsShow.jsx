"use client";
import { useState, useEffect } from "react";
import Link from "next/link"; // Next.js me navigation ke liye
import { packages } from "../models/objAll/packages";
import PackageGridLayout from "../components/packages/PackageGridLayout";

const packagesection = ({ limit }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredpackages, setHoveredpackages] = useState(null);
  const [selectedpackages, setSelectedpackages] = useState(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 400);
  }, []);

  // ✅ Limit logic
  const displayedpackages = limit
    ? packages.slice(0, limit)
    : packages;

  const handlepackagesHover = (id) => setHoveredpackages(id);
  const handlepackagesLeave = () => setHoveredpackages(null);

  const handleExplorepackages = (packages) => setSelectedpackages(packages);
  const handleClosePopup = () => setSelectedpackages(null);

  const handleQueryClick = (packages) => {
    const message = `
*packages:* ${packages.name}
*Tagline:* ${packages.tagline} 
*Price:* ${packages.price}
*Duration:* ${packages.duration}
*Rating:* ${packages.rating}
*Discount:* ${packages.discount}
*Description:* ${packages.description}
*Best Time to Visit:* ${packages.bestTime}
*Highlights:* ${packages.highlights.join(", ")}
*Activities:* ${packages.activities.join(", ")}
    `;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section className="py-30 px-4 sm:px-6 lg:px-8 bg-[#fff]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0f6177] mb-4">
            Most Loved
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Travel packages
            </span>
          </h2>
          <p className="text-gray-400">
            Handpicked packages loved by thousands of travelers worldwide
          </p>
        </div>

        {/* Grid Layout */}
        <PackageGridLayout
          packages={displayedpackages}
          onExplore={handleExplorepackages}
          btns={[{ "label": "View Details", "type": "viewDetails" }, { "label": "Get Query", "type": "getQuery" }]}
        />

        {/* View All Button → Redirect */}
        {limit && packages.length > limit && (
          <div className="text-center mt-6">
            <Link
              href="/packages" // redirect to your full packages page
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              View All
            </Link>
          </div>
        )}

        {/* Inline Popup */}
        {selectedpackages && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">

              {/* Image */}
              <div className="md:w-1/2 h-80 md:h-auto flex-shrink-0">
                <img
                  src={selectedpackages.image}
                  alt={selectedpackages.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="md:w-1/2 p-6 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <h2 className="text-2xl font-bold mb-2 sm:mb-0">{selectedpackages.name}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleClosePopup}
                      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handleQueryClick(selectedpackages)}
                      className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition"
                    >
                      Query
                    </button>
                  </div>
                </div>

                {/* Scrollable Text */}
                <div className="mt-4 flex-1 overflow-y-auto scrollbar-none">
                  <p className="text-gray-700 mb-2"><strong>Tagline:</strong> {selectedpackages.tagline}</p>
                  <p className="text-gray-700 mb-2"><strong>Price:</strong> {selectedpackages.price}</p>
                  <p className="text-gray-700 mb-2"><strong>Duration:</strong> {selectedpackages.duration}</p>
                  <p className="text-gray-700 mb-2"><strong>Rating:</strong> {selectedpackages.rating}</p>
                  <p className="text-gray-700 mb-2"><strong>Discount:</strong> {selectedpackages.discount}</p>
                  <p className="text-gray-700 mb-2"><strong>Description:</strong> {selectedpackages.description}</p>
                  <p className="text-gray-700 mb-2"><strong>Best Time to Visit:</strong> {selectedpackages.bestTime}</p>
                  <p className="text-gray-700 mb-2"><strong>Highlights:</strong> {selectedpackages.highlights.join(", ")}</p>
                  <p className="text-gray-700 mb-2"><strong>Activities:</strong> {selectedpackages.activities.join(", ")}</p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default packagesection;