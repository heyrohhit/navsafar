import React from 'react'
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';

const footerPage = () => {
  return (
     <footer className="bg-[#0B1C2D] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-12 md:grid-cols-4">
              {/* Brand */}
              <div className="md:col-span-1">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A24D]">
                    <span className="font-['Playfair_Display'] text-xl font-bold text-white">
                      N
                    </span>
                  </div>
                  <div>
                    <div className="font-['Playfair_Display'] text-xl font-bold">
                      NAVSAFAR
                    </div>
                    <div className="font-['Inter'] text-xs text-[#C9A24D]">
                      Travel Solutions
                    </div>
                  </div>
                </div>
                <p className="font-['Inter'] text-sm text-gray-400">
                  Your Gateway To The World
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="mb-4 font-['Playfair_Display'] text-lg font-bold">
                  Quick Links
                </h4>
                <div className="space-y-2 font-['Inter'] text-sm">
                  <a
                    href="/"
                    className="block text-gray-400 transition-colors hover:text-[#C9A24D]"
                  >
                    Home
                  </a>
                  <a
                    href="/about"
                    className="block text-gray-400 transition-colors hover:text-[#C9A24D]"
                  >
                    About
                  </a>
                  <a
                    href="/services"
                    className="block text-gray-400 transition-colors hover:text-[#C9A24D]"
                  >
                    Services
                  </a>
                  <a
                    href="/corporate"
                    className="block text-gray-400 transition-colors hover:text-[#C9A24D]"
                  >
                    Corporate
                  </a>
                  <a
                    href="/contact"
                    className="block text-gray-400 transition-colors hover:text-[#C9A24D]"
                  >
                    Contact
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="mb-4 font-['Playfair_Display'] text-lg font-bold">
                  Contact
                </h4>
                <div className="space-y-3 font-['Inter'] text-sm text-gray-400">
                  <a
                    href="tel:+919560185041"
                    className="flex items-center gap-2 transition-colors hover:text-[#C9A24D]"
                  >
                    <Phone size={16} />
                    +91-95601-85041
                  </a>
                  <a
                    href="mailto:info@navsafartravels.com"
                    className="flex items-center gap-2 transition-colors hover:text-[#C9A24D]"
                  >
                    <Mail size={16} />
                    info@navsafartravels.com
                  </a>
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <span>New Delhi, India</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="mb-4 font-['Playfair_Display'] text-lg font-bold">
                  Follow Us
                </h4>
                <div className="flex gap-4">
                  <a
                    href="https://wa.me/919560185041"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#C9A24D]"
                  >
                    <MessageCircle size={20} />
                  </a>
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#C9A24D]"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#C9A24D]"
                  >
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-white/10 pt-8 text-center">
              <p className="font-['Inter'] text-sm text-gray-400">
                © 2026 Navsafar Travel Solutions. All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
  )
}

export default footerPage