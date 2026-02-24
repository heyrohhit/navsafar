"use client";
import { useState } from "react";
import Link from "next/link";
import navModel from "../../models/navigation";

const Navigation = ({ mobile = false, onClose }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleItemClick = (item) => {
    setActiveItem(item.name);
    if (mobile && onClose) {
      onClose();
    }
  };

  const handleItemHover = (item) => {
    setHoveredItem(item.name);
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
  };

 return (
    <nav className={`${mobile ? 'flex flex-col space-y-4' : 'hidden md:flex items-center space-x-8'}`}>
      {navModel.map((item) => (
        <div key={item.name} className="relative group">
          <Link
            href={item.path}
            onClick={() => handleItemClick(item)}
            onMouseEnter={() => handleItemHover(item)}
            onMouseLeave={handleItemLeave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              mobile 
                ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600'
            } ${
              activeItem === item.name ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <span className="text-xl">{item.icon || '🌐'}</span>
            <span className={`${mobile ? 'text-lg' : 'text-base'} font-semibold`}>
              {item.name}
            </span>
          </Link>
          
          {/* Hover Effect */}
          {!mobile && hoveredItem === item.name && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Navigation;
