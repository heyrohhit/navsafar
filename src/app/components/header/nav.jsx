"use client";
import { useState } from "react";
import { navModel, getTravelIcon } from "../../models";
import Link from "next/link";

const Nav = ({ mobile = false, onClose }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isToursOpen, setIsToursOpen] = useState(false);

  const handleItemClick = (index, path) => {
    setActiveItem(index);
    if (mobile && onClose) {
      onClose();
    }
  };

  // Group navigation items for better organization
  const mainItems = navModel.slice(0, 4); // Home, Destinations, Tour Packages, International Tours
  const servicesGroup = navModel.slice(4, 7); // Domestic Tours, Hotels & Resorts, Flights
  const moreGroup = navModel.slice(7); // Visa Services, Travel Insurance, About Us, Contact, Blog

  if (mobile) {
    return (
      <div className="flex flex-col space-y-1 p-4 bg-white">
        {navModel.map((item, idx) => (
          <Link
            key={idx}
            href={item.path}
            onClick={() => handleItemClick(idx, item.path)}
            className={`block px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 group ${
              activeItem === idx ? "bg-blue-50 text-blue-600 font-semibold" : ""
            }`}
            title={item.description}
            aria-label={`${item.name} - ${item.description}`}
          >
            <div className="flex items-center gap-3">
              <div className={`transition-all duration-200 ${
                activeItem === idx ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"
              }`}>
                {getTravelIcon(item.name)}
              </div>
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <nav className="relative" role="navigation" aria-label="Main navigation">
      {/* Desktop Navigation - Grouped Menu */}
      <div className="hidden xl:flex items-center space-x-2 text-white">
        {/* Main Items */}
        {mainItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.path}
            onClick={() => handleItemClick(idx, item.path)}
            onMouseEnter={() => setHoveredItem(idx)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`relative px-3 py-2 text-white hover:text-blue-600 transition-all duration-200 font-medium rounded-lg hover:bg-blue-50 text-sm whitespace-nowrap ${
              activeItem === idx ? "text-blue-600 bg-white" : ""
            }`}
            title={item.description}
            aria-label={`${item.name} - ${item.description}`}
          >
            <span className="text-xs leading-tight">{item.name}</span>
            
            {/* Animated underline */}
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                activeItem === idx ? "w-full" : "w-0"
              }`}
            />
          </Link>
        ))}

        {/* Services Dropdown */}
        <div className="relative text-white">
          <button
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
            className={`relative px-3 py-2 text-white hover:text-blue-600 transition-all duration-200 font-medium rounded-lg hover:bg-blue-50 text-sm whitespace-nowrap ${
              isServicesOpen ? "text-blue-600 bg-blue-50" : ""
            }`}
          >
            <span className="text-xs leading-tight">Services</span>
            <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isServicesOpen && (
            <div 
              className="absolute text-white top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200/50 overflow-hidden z-50"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <div className="py-2">
                {servicesGroup.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.path}
                    onClick={() => handleItemClick(navModel.indexOf(item), item.path)}
                    className="block px-4 py-2 text-sm text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 text-gray-500">
                        {getTravelIcon(item.name)}
                      </div>
                      <span>{item.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* More Dropdown */}
        <div className="relative">
          <button
            onMouseEnter={() => setIsToursOpen(true)}
            onMouseLeave={() => setIsToursOpen(false)}
            className={`relative px-3 py-2 text-white hover:text-blue-600 transition-all duration-200 font-medium rounded-lg hover:bg-blue-50 text-sm whitespace-nowrap ${
              isToursOpen ? "text-blue-600 bg-blue-50" : ""
            }`}
          >
            <span className="text-xs leading-tight">More</span>
            <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isToursOpen && (
            <div 
              className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200/50 overflow-hidden z-50"
              onMouseEnter={() => setIsToursOpen(true)}
              onMouseLeave={() => setIsToursOpen(false)}
            >
              <div className="py-2">
                {moreGroup.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.path}
                    onClick={() => handleItemClick(navModel.indexOf(item), item.path)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 text-gray-500">
                        {getTravelIcon(item.name)}
                      </div>
                      <span>{item.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Navigation - Unified Layout */}
      <div className="xl:hidden">
        <div className="flex flex-wrap gap-1.5 justify-center max-w-4xl mx-auto px-2">
          {navModel.slice(0, 6).map((item, idx) => (
            <Link
              key={idx}
              href={item.path}
              onClick={() => handleItemClick(idx, item.path)}
              className={`px-3 py-2 text-xs font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeItem === idx 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600"
              }`}
            >
              <div className="w-4 h-4 flex-shrink-0">
                {getTravelIcon(item.name)}
              </div>
              <span className="text-xs leading-tight">{item.name.length > 12 ? item.name.substring(0, 10) + "..." : item.name}</span>
            </Link>
          ))}
          <Link
            href="/contact"
            className={`px-3 py-2 text-xs font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white whitespace-nowrap flex-shrink-0`}
          >
            <div className="w-4 h-4 flex-shrink-0">
              {getTravelIcon("Contact")}
            </div>
            <span className="text-xs leading-tight">Contact</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;