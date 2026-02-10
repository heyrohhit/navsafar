"use client";

import { motion } from "motion/react";
import { useState } from "react";
import Image from "next/image"
import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ChevronRight,
  Plane,
  Globe,
  Award
} from "lucide-react";

const footerSections = [
  {
    title: "Quick Links",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Corporate Travel", href: "/corporate" },
      { label: "Contact", href: "/contact" },
    ]
  },
  {
    title: "Popular Destinations",
    links: [
      { label: "Europe Tours", href: "/services/europe" },
      { label: "Dubai Luxury", href: "/services/dubai" },
      { label: "Southeast Asia", href: "/services/asia" },
      { label: "Domestic Tours", href: "/services/domestic" },
    ]
  },
  {
    title: "Services",
    links: [
      { label: "International Tours", href: "/services/International" },
      { label: "Corporate MICE", href: "/corporate" },
      { label: "Honeymoon Packages", href: "/services/Honeymoon" },
      { label: "Customized Tours", href: "/services/Custom" },
    ]
  }
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function PremiumFooter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-b from-[#0B1C2D] to-black text-white">
      {/* Top decorative border */}
      <div className="h-1 bg-gradient-to-r from-[#C9A24D] via-transparent to-[#C9A24D]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full">
                  <Image src="/logo.png" alt="Logo" width={100} height={100} />
                </div>
                <div>
                  <div className="font-['Playfair_Display'] text-xl font-bold text-white">NAVSAFAR</div>
                  <div className="font-['Inter'] text-xs text-[#C9A24D]">Travel Solutions</div>
                </div>
              </div>

              <p className="font-['Inter'] text-gray-300 mb-6 leading-relaxed">
                We don't just sell packages; we design extraordinary journeys. 
                Experience luxury travel with personalized service and unmatched expertise.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin size={18} className="text-[#C9A24D]" />
                  <span className="font-['Inter'] text-sm">Multiple Locations Across India</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone size={18} className="text-[#C9A24D]" />
                  <span className="font-['Inter'] text-sm">+91 8700750589</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail size={18} className="text-[#C9A24D]" />
                  <span className="font-['Inter'] text-sm">info@navsafar.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 mt-6">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-[#C9A24D] transition-colors duration-300"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Icon size={18} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
            >
              <h3 className="font-['Playfair_Display'] text-lg font-semibold text-white mb-6">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-gray-300 hover:text-[#C9A24D] transition-colors duration-300 font-['Inter'] text-sm group"
                    >
                      <ChevronRight 
                        size={14} 
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-['Playfair_Display'] text-2xl font-bold text-white mb-4">
              Stay Updated with Travel Inspiration
            </h3>
            <p className="font-['Inter'] text-gray-300 mb-6">
              Subscribe to our newsletter for exclusive deals and travel tips
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#C9A24D] focus:bg-white/15 transition-all duration-300 font-['Inter']"
                required
              />
              <motion.button
                type="submit"
                className="px-6 py-3 bg-[#C9A24D] text-white rounded-lg font-['Inter'] font-semibold hover:bg-[#B8934D] transition-colors duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-gray-400 text-sm font-['Inter']">
              <span>© 2024 Navsafar Travel Solutions. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-['Inter']">
                <Award size={16} className="text-[#C9A24D]" />
                <span>IATA Certified</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm font-['Inter']">
                <Globe size={16} className="text-[#C9A24D]" />
                <span>Global Network</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm font-['Inter']">
                <Plane size={16} className="text-[#C9A24D]" />
                <span>1000+ Routes</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/919560185041"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors duration-300"
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <MessageCircle size={24} />
      </motion.a>
    </footer>
  );
}
