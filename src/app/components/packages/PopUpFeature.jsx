"use client";
import { useState, useEffect } from "react";
import { handleGetQuery } from "./PackageUtils";

const PopUpFeature = ({ selectedPackage, onClose, buttons = [] }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // ensures client-side rendering
  }, []);

  if (!isMounted) return null;

  if (!selectedPackage || Object.keys(selectedPackage).length === 0)
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl text-center animate-fade-in">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">No details available</h3>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    );

  const excludedKeys = [
    "id", "image", "tags", "rating", "duration", "category",
    "discount", "popular", "inclusions", "title", "name", "description",
    "location", "highlight", "activitie", "tagline"
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[85vh] shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* IMAGE LEFT SIDE */}
        {selectedPackage.image && (
          <div className="w-full md:w-1/2 relative group overflow-hidden flex-shrink-0">
            <img
              src={selectedPackage.image}
              alt={selectedPackage.title || selectedPackage.name || "Item"}
              className="w-full h-64 sm:h-80 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Discount badge */}
            {selectedPackage.discount && (
              <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white font-bold text-sm rounded-full z-10">
                {selectedPackage.discount}
              </div>
            )}

            {/* Popular badge */}
            {selectedPackage.popular && (
              <div className="absolute bottom-3 right-3 px-3 py-1 bg-yellow-400 text-gray-900 font-bold text-sm rounded-full z-10">
                Popular
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 left-3 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-2xl z-10"
            >
              ×
            </button>
          </div>
        )}

        {/* CONTENT RIGHT SIDE */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col overflow-y-auto overfloe-x-hidden relative">
          
          {/* TITLE */}
          <div className="flex flex-col gap-2 mb-2">
            <h3 className="text-3xl font-bold text-gray-900 truncate">
              {selectedPackage.title || selectedPackage.name || "Untitled"}
            </h3>

            {/* TAGLINE (dynamic) */}
            {selectedPackage.tagline && (
              <span className="text-gray-500 italic text-sm font-medium">
                {selectedPackage.tagline}
              </span>
            )}

            {/* Locations under title */}
            {selectedPackage.location && (
              <span className="text-gray-600 text-sm font-medium">
                {selectedPackage.location}
              </span>
            )}

            <div className="flex gap-4 mt-1">
              {selectedPackage.category && (
                <span className="px-3 py-1 text-gray-600 rounded-full text-sm font-semibold whitespace-nowrap">
                  {selectedPackage.category}
                </span>
              )}
              {selectedPackage.duration && (
                <span className="px-3 py-1 text-gray-500 rounded-full text-sm font-semibold whitespace-nowrap">
                  {selectedPackage.duration}
                </span>
              )}
            </div>
          </div>

          {/* RATING STARS */}
          {selectedPackage.rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(selectedPackage.rating) ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">{selectedPackage.rating}</span>
            </div>
          )}

          {/* INCLUSIONS 2 COLUMN */}
          {selectedPackage.inclusions && selectedPackage.inclusions.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {selectedPackage.inclusions.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <svg
                    className="w-4 h-4 text-green-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          )}

          {/* HIGHLIGHTS 2x2 GRID */}
          {selectedPackage.highlights && selectedPackage.highlights.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {selectedPackage.highlights.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <svg
                    className="w-4 h-4 text-blue-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          )}

          {/* ACTIVITIES 2x2 GRID */}
          {selectedPackage.activities && selectedPackage.activities.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {selectedPackage.activities.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <svg
                    className="w-4 h-4 text-purple-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          )}

          {/* DESCRIPTION */}
          {selectedPackage.description && (
            <p className="text-gray-700 mb-4">{selectedPackage.description}</p>
          )}

          {/* OTHER DYNAMIC FIELDS */}
          {Object.entries(selectedPackage)
            .filter(([key, value]) => !excludedKeys.includes(key) && value != null)
            .map(([key, value], idx) => (
              <div key={idx} className="mb-2">
                <h4 className="font-semibold text-gray-900 capitalize">{key.replace(/_/g, " ")}</h4>
                {Array.isArray(value) ? (
                  <ul className="list-disc ml-5 text-gray-700">
                    {value.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700">{value}</p>
                )}
              </div>
            ))}

          {/* BUTTONS FIXED BOTTOM RIGHT */}
          <div className="sticky bottom-1 right-0 justify-end items-end flex flex-col sm:flex-row gap-3 z-20">
            {buttons.length > 0 ? (
              buttons.map((btn, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (btn.onClick) btn.onClick(selectedPackage);
                    else if (btn.type === "getQuery") handleGetQuery(selectedPackage);
                    else if (btn.type === "callMe") window.location.href = `tel:${btn.number || "1234567890"}`;
                  }}
                  className={`px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    btn.gradient || "bg-gradient-to-r from-orange-500 to-red-500"
                  }`}
                >
                  {btn.label || "Action"}
                </button>
              ))
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-300"
              >
                Close
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PopUpFeature;