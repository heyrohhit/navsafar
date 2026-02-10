"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, MessageCircle } from "lucide-react";
import { AnimatedLogo } from "./animated-logo";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  {
    label: "Services",
    submenu: [
      { label: "Domestic Tours", path: "/services/Domestic-Tours" },
      { label: "International Tours", path: "/services/International-Tours " },
      { label: "Corporate Travel", path: "/services/Corporate-Travel" },
      { label: "Religious Tours", path: "/services/Religious-Tours" },
      { label: "Customized Tours", path: "/services/Customized-Tours" },
    ],
  },
  { label: "Corporate & MICE", path: "/Corporate" },
  { label: "Contact", path: "/contact" },
];

export function PremiumHeader() {
  const pathname = usePathname(); // ✅ Next.js correct
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ✅ SSR-safe scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-[#0B1C2D] shadow-lg"
          : "bg-gradient-to-b from-black/60 to-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <AnimatedLogo />

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-1 lg:flex">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.submenu ? (
                  <div
                    className="group"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-md px-4 py-2 font-['Inter'] font-medium cursor-pointer text-white transition-colors hover:text-[#C9A24D]"
                    >
                      {item.label}
                      <ChevronDown size={16} />
                    </button>

                    {servicesOpen && (
                      <div className="absolute left-0 top-full mt-2 w-56 rounded-lg bg-white shadow-xl">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.path}
                            onClick={() => setServicesOpen(false)}
                            className="block px-4 py-3 font-['Inter'] text-sm text-gray-700 transition-colors cursor-pointer hover:bg-[#C9A24D] hover:text-white"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className={`rounded-md px-4 py-2 font-['Inter'] font-medium transition-colors ${
                      pathname === item.path
                        ? "text-[#C9A24D]"
                        : "text-white hover:text-[#C9A24D]"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA */}
          <a
            href="https://wa.me/919560185041"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-lg bg-[#C9A24D] px-6 py-3 font-['Inter'] font-semibold text-white transition-all hover:bg-[#B8934D] lg:flex"
          >
            <MessageCircle size={20} />
            Talk to Expert
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-white lg:hidden"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#0B1C2D] lg:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navItems.map((item) =>
              item.submenu ? (
                item.submenu.map((subItem) => (
                  <Link
                    key={subItem.label}
                    href={subItem.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-md px-3 py-2 font-['Inter'] font-medium text-white hover:bg-white/10"
                  >
                    {subItem.label}
                  </Link>
                ))
              ) : (
                <Link
                  key={item.label}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2 font-['Inter'] font-medium text-white hover:bg-white/10"
                >
                  {item.label}
                </Link>
              )
            )}

            <a
              href="https://wa.me/919560185041"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#C9A24D] px-6 py-3 font-['Inter'] font-semibold text-white"
            >
              <MessageCircle size={20} />
              Talk to Expert
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
