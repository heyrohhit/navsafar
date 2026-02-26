"use client";
import { useState, useEffect } from "react";
import Nav from "./nav";
import { mobileNav, getTravelIcon } from "../../models";
import Link from "next/link";
import { usePathname } from "next/navigation";



const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // current URL path
  const [activeItem, setActiveItem] = useState(null);

  // Emit menu toggle event when menu state changes
  useEffect(() => {
    const event = new CustomEvent('menuToggle', { 
      detail: { isOpen: isMenuOpen } 
    });
    window.dispatchEvent(event);
  }, [isMenuOpen]);

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-[#0F6177] border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="shrink-0">
              <Link href="/">
              <div className="flex items-center gap-2 relative`">
                  <div className="w-50 h-8 rounded-lg flex items-center justify-center">
                  <img src="/assets/logo.png" alt="/assets/logo.png" className="object-fill"/>
                </div>
                  {/* <h1 className="absolute `text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex flex-col line-2 cursor-pointer">
                  Navsafar
                  <br/>
                    <span className="text-[12px] text-gray-600 ml-2">Travel Agency</span>
                    </h1> */}
                  
              </div>
            </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex">
              <Nav />
            </div>
            
            {/* Contact Info */}
            <div className="hidden lg:flex items-center gap-4 text-white">
              <a href="tel:+919876543210" className="flex items-center gap-2 text-sm text-white hover:text-blue-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 88821 29640
              </a>
              <Link href="/booking">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Book Now
              </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile/Tablet Header */}
      <header className="xl:hidden fixed top-0 left-0 right-0 z-50 bg-[#0F6177] backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="flex justify-between items-center h-16 px-4">
          {/* Mobile/Tablet Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
            <div className="w-50 h-8 rounded-lg flex items-center justify-center">
                  <img src="/assets/logo.png" alt="/assets/logo.png" className="object-fill"/>
                </div>
            {/* <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Navsafar
            </h1> */}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 transition-all duration-300"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-white transition-all duration-300 ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <Nav mobile={true} onClose={() => setIsMenuOpen(false)} />
          
          {/* Mobile Contact Info */}
          <div className="px-4 py-4 border-t border-gray-200/50">
            <div className="flex flex-col gap-3">
              <a href="tel:+919876543210" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 88821 29640
              </a>
              <Link href="wa.me/+918882129640">
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300">
                Book Now
              </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Apple-style Bottom Navigation for Mobile/Tablet */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-lg">
        <div className="flex justify-around items-center h-16 px-2">
          {mobileNav.slice(0, 5).map((item, idx) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={idx}
                href={item.path}
                onClick={() => handleItemClick(idx, item.path)}
                className={`flex flex-col items-center gap-1 transition-all duration-200 group ${
                  isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <div
                  className={`relative transition-all duration-300 ${
                    isActive ? "shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] -shadow-[0_4px_10px_rgba(0,0,0,0.5)]  transform scale-110 p-4 translate-y-[-20px] bg-white rounded-full "  : "group-hover:scale-110"
                  }`}
                >
                  {getTravelIcon(item.name)}
                  {isActive && (
                    <div className="transition-all duration-200 absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive && "transition-all duration-200 -translate-y-3"}`}>
                  {item.name.length > 12 ? item.name.substring(0, 10) + "..." : item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Header;