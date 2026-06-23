// src/app/components/common/Footer.jsx
// ✅ OFF-PAGE + LOCAL SEO: Real social links (from localBusinessConfig)
//    NAP schema-friendly markup, corrected internal links
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Facebook, Twitter, Instagram, Youtube, Linkedin,
  Mail, Phone, MapPin, Send, Heart, ArrowUp, Shield,
} from "lucide-react";
import { BUSINESS } from "../../../lib/localBusinessConfig";

const Footer = () => {
  const [email, setEmail]         = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => { setIsSubscribed(false); setEmail(""); }, 3000);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ── Internal links (corrected paths) ──────────────────────
  const footerLinks = {
    company: [
      { name: "About Us",    href: "/pages/about-us" },
      { name: "Our Services",href: "/pages/services"  },
      { name: "Contact Us",  href: "/pages/contact"   },
    ],
    explore: [
      { name: "Destinations",    href: "/destinations"  },
      { name: "Tour Packages",   href: "/tour-packages" },
      { name: "Experiences",     href: "/experiences"   },
      { name: "Travel Guides",   href: "/travel"        },
      { name: "Travel Blog",     href: "/blog"          },
    ],
    support: [
      { name: "Search Packages", href: "/search"   },
      { name: "Book a Trip",     href: "/booking"  },
      { name: "Contact Us",      href: "/pages/contact" },
    ],
    legal: [
      { name: "Terms of Service", href: "/policies/terms"   },
      { name: "Privacy Policy",   href: "/policies/privacy" },
      { name: "Refund Policy",    href: "/policies/refund"  },
    ],
  };

  // ── Social links pulled from single source of truth ───────
  const socialLinks = [
    { icon: Facebook,  href: BUSINESS.socials.facebook,  label: "Facebook",  color: "hover:bg-blue-600"  },
    { icon: Twitter,   href: BUSINESS.socials.twitter,   label: "Twitter/X", color: "hover:bg-sky-500"   },
    { icon: Instagram, href: BUSINESS.socials.instagram, label: "Instagram", color: "hover:bg-pink-600"  },
    { icon: Youtube,   href: BUSINESS.socials.youtube,   label: "YouTube",   color: "hover:bg-red-600"   },
    { icon: Linkedin,  href: BUSINESS.socials.linkedin,  label: "LinkedIn",  color: "hover:bg-blue-700"  },
  ];

  const paymentMethods = ["Visa", "Mastercard", "UPI", "Net Banking", "NEFT"];

  const trustBadges = [
    { icon: Shield, text: "100% Secure Booking", sub: "SSL Encrypted" },
  ];

  return (
    <footer
      className="overflow-x-hidden font-sans relative z-[2]"
      // ── LOCAL SEO: schema.org-friendly footer ──────────────
      itemScope
      itemType="https://schema.org/TravelAgency"
    >
      {/* Hidden machine-readable NAP for Local SEO */}
      <meta itemProp="name"      content={BUSINESS.legalName} />
      <meta itemProp="telephone" content={BUSINESS.phone}     />
      <meta itemProp="email"     content={BUSINESS.email}     />
      <link itemProp="url"       href="https://navsafar.com"  />

      {/* ── MAIN FOOTER ─────────────────────────────────────── */}
      <div className="bg-[#0f6477]">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">

          {/* top grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-white/10">

            {/* ── Brand + NAP + Social ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Link href="/" aria-label="NavSafar Home">
                <Image
                  src="/assets/logo.png"
                  alt="NavSafar Travel Solutions"
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </Link>

              <p className="text-white/60 mb-7 leading-relaxed text-sm">
                Your trusted travel partner for unforgettable domestic &amp; international holidays. We curate the best tour packages for Indian travellers.
              </p>

              {/* NAP — marked up for Local SEO */}
              <address
                className="not-italic"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >
                <ul className="space-y-3 mb-8">
                  {/* Phone */}
                  <li className="flex items-start gap-3 text-white/60 text-sm">
                    <span className="mt-0.5 w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-amber-400" />
                    </span>
                    <a
                      href={`tel:${BUSINESS.phone}`}
                      itemProp="telephone"
                      className="hover:text-amber-400 transition-colors"
                    >
                      {BUSINESS.phoneDisplay}
                    </a>
                  </li>

                  {/* Email */}
                  <li className="flex items-start gap-3 text-white/60 text-sm">
                    <span className="mt-0.5 w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-amber-400" />
                    </span>
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      itemProp="email"
                      className="hover:text-amber-400 transition-colors"
                    >
                      {BUSINESS.email}
                    </a>
                  </li>

                  {/* Address */}
                  <li className="flex items-start gap-3 text-white/60 text-sm">
                    <span className="mt-0.5 w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-amber-400" />
                    </span>
                    <a
                      href={BUSINESS.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-400 transition-colors"
                    >
                      <span itemProp="streetAddress">{BUSINESS.address.streetAddress}</span>,{" "}
                      <span itemProp="addressLocality">{BUSINESS.address.addressLocality}</span>{" "}
                      <span itemProp="postalCode">{BUSINESS.address.postalCode}</span>
                    </a>
                  </li>
                </ul>
              </address>

              {/* Social links — real URLs for Off-Page SEO */}
              <div className="flex gap-2 flex-wrap">
                {socialLinks.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    aria-label={`NavSafar on ${s.label}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white/70 hover:text-white ${s.color} hover:border-transparent transition-all duration-300`}
                  >
                    <s.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* ── Link columns ── */}
            {["company", "explore", "support"].map((cat, idx) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
                  <span className="w-4 h-0.5 rounded-full bg-amber-400 inline-block" />
                  {cat === "company" ? "Company" : cat === "explore" ? "Explore" : "Support"}
                </h4>
                <ul className="space-y-3">
                  {footerLinks[cat].map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-white/55 hover:text-amber-400 transition-colors duration-300 text-sm inline-flex items-center gap-1.5 group"
                      >
                        <span className="w-1 h-1 rounded-full bg-amber-400/0 group-hover:bg-amber-400 transition-all duration-300 inline-block flex-shrink-0" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 py-10 border-b border-white/10"
          >
            {trustBadges.map((badge, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/30 rounded-2xl p-4 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-400/15 flex items-center justify-center flex-shrink-0">
                  <badge.icon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{badge.text}</div>
                  <div className="text-white/45 text-xs mt-0.5">{badge.sub}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-8 border-b border-white/10"
          >
            <h4 className="text-white/50 text-xs uppercase tracking-widest font-bold mb-4">We Accept</h4>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((m) => (
                <span
                  key={m}
                  className="px-4 py-1.5 bg-white/8 border border-white/15 rounded-lg text-white/65 text-xs font-medium hover:bg-white/15 hover:text-white hover:border-amber-400/40 transition-all duration-200 cursor-default"
                >
                  {m}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Legal Links */}
          <div className="pt-6 pb-2 border-b border-white/10">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white/40 hover:text-amber-400 text-xs transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="bg-[#0d5567]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/45 text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="text-white/70 font-semibold">NavSafar Travel Solutions</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-white/45 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            <span>in India</span>
          </div>
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 text-gray-900" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
