"use client";
import { useState, useEffect } from "react";
import Link from "next/link"; // Next.js me navigation ke liye
import { destinations } from "../models/objAll/destinations";
import PackageGridLayout from "../components/packages/PackageGridLayout";

const DestinationsSection = ({ limit }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredDestination, setHoveredDestination] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 400);
  }, []);

  // ✅ Limit logic
  const displayedDestinations = limit
    ? destinations.slice(0, limit)
    : destinations;

  const handleDestinationHover = (id) => setHoveredDestination(id);
  const handleDestinationLeave = () => setHoveredDestination(null);

  const handleExploreDestination = (destination) => setSelectedDestination(destination);
  const handleClosePopup = () => setSelectedDestination(null);

  const handleQueryClick = (destination) => {
    const message = `
*Destination:* ${destination.name}
*Tagline:* ${destination.tagline}
*Price:* ${destination.price}
*Duration:* ${destination.duration}
*Rating:* ${destination.rating}
*Discount:* ${destination.discount}
*Description:* ${destination.description}
*Best Time to Visit:* ${destination.bestTime}
*Highlights:* ${destination.highlights.join(", ")}
*Activities:* ${destination.activities.join(", ")}
    `;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Most Loved
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Travel Destinations
            </span>
          </h2>
          <p className="text-gray-400">
            Handpicked destinations loved by thousands of travelers worldwide
          </p>
        </div>

        {/* Grid Layout */}
        <PackageGridLayout
          packages={displayedDestinations}
          onExplore={handleExploreDestination}
          btns={[{"label": "View Details", "type": "viewDetails"}, {"label": "Get Query", "type": "getQuery"}]}
        />

        {/* View All Button → Redirect */}
        {limit && destinations.length > limit && (
          <div className="text-center mt-6">
            <Link
              href="/destinations" // redirect to your full destinations page
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              View All
            </Link>
          </div>
        )}

        {/* Inline Popup */}
        {selectedDestination && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">

              {/* Image */}
              <div className="md:w-1/2 h-80 md:h-auto flex-shrink-0">
                <img
                  src={selectedDestination.image}
                  alt={selectedDestination.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="md:w-1/2 p-6 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <h2 className="text-2xl font-bold mb-2 sm:mb-0">{selectedDestination.name}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleClosePopup}
                      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handleQueryClick(selectedDestination)}
                      className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition"
                    >
                      Query
                    </button>
                  </div>
                </div>

                {/* Scrollable Text */}
                <div className="mt-4 flex-1 overflow-y-auto scrollbar-none">
                  <p className="text-gray-700 mb-2"><strong>Tagline:</strong> {selectedDestination.tagline}</p>
                  <p className="text-gray-700 mb-2"><strong>Price:</strong> {selectedDestination.price}</p>
                  <p className="text-gray-700 mb-2"><strong>Duration:</strong> {selectedDestination.duration}</p>
                  <p className="text-gray-700 mb-2"><strong>Rating:</strong> {selectedDestination.rating}</p>
                  <p className="text-gray-700 mb-2"><strong>Discount:</strong> {selectedDestination.discount}</p>
                  <p className="text-gray-700 mb-2"><strong>Description:</strong> {selectedDestination.description}</p>
                  <p className="text-gray-700 mb-2"><strong>Best Time to Visit:</strong> {selectedDestination.bestTime}</p>
                  <p className="text-gray-700 mb-2"><strong>Highlights:</strong> {selectedDestination.highlights.join(", ")}</p>
                  <p className="text-gray-700 mb-2"><strong>Activities:</strong> {selectedDestination.activities.join(", ")}</p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default DestinationsSection;