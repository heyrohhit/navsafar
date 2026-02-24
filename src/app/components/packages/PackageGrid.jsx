"use client";
import { useState } from "react";
import PackageCard from "./PackageCard";
import { getPackageGradient } from "./PackageUtils";
import PopUpFeature from "./PopUpFeature";
import PackageGridLayout from "./PackageGridLayout";

const PackageGrid = ({ 
  packages, 
  onViewDetails, 
  onGetQuery, 
  isLoaded, 
  columns = 4,
  selectedCategory = "all"
}) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const getGridColumns = () => {
    switch(columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
  };

  const getCategoryTitle = () => {
    switch(selectedCategory) {
      case "all":
        return "All";
      case "domestic":
        return "Domestic";
      case "international":
        return "International";
      case "religious":
        return "Religious";
      case "family":
        return "Family";
      case "adventure":
        return "Adventure";
      default:
        return "All";
    }
  };

  const handleViewDetails = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleCloseDetails = () => {
    setSelectedPackage(null);
  };

  return (
    <div className="mb-8">
      {/* Results Count */}
      <div className="text-center mb-8">
        <p className="text-gray-600 text-lg">
          <span className="font-bold text-gray-900 text-2xl">{getCategoryTitle()}</span> <span className="font-bold text-gray-900 text-2xl">{packages.length}</span> packages
        </p>
      </div>

      {/* Package Grid */}
      <div className={`w-full`}>
       <PackageGridLayout packages={packages} />
      </div>

      {/* No Results State */}
      {packages.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No packages found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Browse All Packages
          </button>
        </div>
      )}

      {/* Package Details Modal */}
      {selectedPackage && (
        <PopUpFeature selectedPackage={selectedPackage} onClose={handleCloseDetails} />
      )}
    </div>
  );
};

export default PackageGrid;
