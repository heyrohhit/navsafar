"use client";
import { useState } from "react";
import { getPackageGradient, getPackageIcon, handleGetQuery } from "./PackageUtils";

const PackageCard = ({ pkg, onViewDetails, onGetQuery, isLoaded, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Package Header */}
      <div className={`h-56 bg-gradient-to-br ${getPackageGradient(pkg.category)} flex items-center justify-center relative overflow-hidden group cursor-pointer`} onClick={() => onViewDetails(pkg)}>
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/5 rounded-full animate-bounce"></div>
        </div>
        
        {/* Image */}
        {!imageError && (
          <img 
            src={pkg.image} 
            alt={pkg.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        {/* Loading Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse">
            <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
          </div>
        )}
        
        {/* Fallback Icon */}
        <div className={`text-white text-center z-10 relative transition-opacity duration-300 ${imageError ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-5xl mb-2 transform transition-transform duration-300 group-hover:scale-110">
            {getPackageIcon(pkg.category)}
          </div>
          <h3 className="text-xl font-bold mb-1">{pkg.location}</h3>
          <p className="text-white/80 text-sm">{pkg.duration}</p>
        </div>
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
        
        {/* Discount Badge */}
        {pkg.discount && (
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
              {pkg.discount}
            </span>
          </div>
        )}

        {/* Popular Badge */}
        {pkg.popular && (
          <div className="absolute bottom-4 right-4 z-20">
            <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full shadow-lg">
              ⭐ Popular
            </span>
          </div>
        )}
      </div>
      
      {/* Package Content */}
      <div className="p-5 bg-white">
        <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{pkg.title}</h4>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < Math.floor(pkg.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-600 text-sm">{pkg.rating}</span>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => onViewDetails(pkg)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            View Details
          </button>
          <button 
            onClick={() => onGetQuery(pkg)}
            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-300"
          >
            Get Query
          </button>
        </div>
      </div>
      
      {/* Hover Glow */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />
    </div>
  );
};

export default PackageCard;
