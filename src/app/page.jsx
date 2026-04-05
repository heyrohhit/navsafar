"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Award,
  MapPin,
  Star,
  Shield,
  Clock,
  CheckCircle,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";

import FeaturedPackages from "./components/packages/FeaturedPackages";
import FeatuersSection from "./components/features/FeaturesSection";
import ExperienceCategories from "./experiences/ExperienceCategories";
import CTASection from "./components/cta/CTASection";
import Herosections from "./components/hero/HeroSections";
import AboutUs from "./pages/about-us/About";
import HowItWorks from "./components/ui/HowItWorks";
import Testimonials from "./components/sections/Testimonials";

// Stats will be fetched from API
const defaultStats = {
  packages: "500",
  destinations: "50",
  rating: "4.8",
};

// Trust Badges
const trustBadges = [
  {
    icon: Shield,
    title: "IATO Certified",
    description: "Indian Association of Tour Operators",
  },
  {
    icon: Award,
    title: "Govt. Approved",
    description: "Ministry of Tourism, India",
  },
  {
    icon: Users,
    title: "Expert Guides",
    description: "Certified local experts",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Always here for you",
  },
];

// Popular Destinations
const popularDestinations = [
  {
    name: "Manali",
    image: "/assets/kd.jpg",
    packages: 25,
    region: "Himachal Pradesh",
    href: "/destinations/manali",
  },
  {
    name: "Goa",
    image: "/assets/mt.jpg",
    packages: 30,
    region: "Western India",
    href: "/destinations/goa",
  },
  {
    name: "Kerala",
    image: "/assets/gl.jpg",
    packages: 20,
    region: "South India",
    href: "/destinations/kerala",
  },
  {
    name: "Rajasthan",
    image: "/assets/bg.jpg",
    packages: 35,
    region: "Western India",
    href: "/destinations/rajasthan",
  },
  {
    name: "Kashmir",
    image: "/assets/Mt2.jpg",
    packages: 18,
    region: "North India",
    href: "/destinations/kashmir",
  },
  {
    name: "Andaman",
    image: "/assets/mt1.jpg",
    packages: 15,
    region: "Bay of Bengal",
    href: "/destinations/andaman",
  },
];

// Why Choose Us
const whyChooseUs = [
  {
    icon: "💰",
    title: "Best Price Guarantee",
    description: "We match any competitor's price. Get the best deal.",
  },
  {
    icon: "🎯",
    title: "Customizable Itineraries",
    description: "Personalize your trip according to your preferences.",
  },
  {
    icon: "🤝",
    title: "No Hidden Costs",
    description: "Transparent pricing. What you see is what you pay.",
  },
  {
    icon: "📞",
    title: "Dedicated Support",
    description: "Your personal travel expert available 24/7.",
  },
  {
    icon: "🛡️",
    title: "Safe & Secure",
    description: "Fully licensed operator with insurance options.",
  },
  {
    icon: "⭐",
    title: "Premium Experiences",
    description: "Handpicked hotels, verified guides, exclusive tours.",
  },
];

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch dynamic stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Herosections />
      {/* Stats Bar */}
      <section className="py-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                label: "Tour Packages",
                description: "Curated experiences",
                value: stats?.packages?.total || defaultStats.packages,
                suffix: "+",
              },
              {
                icon: MapPin,
                label: "Destinations",
                description: "Domestic & International",
                value: stats?.destinations?.total || defaultStats.destinations,
                suffix: "+",
              },
              {
                icon: Star,
                label: "Average Rating",
                description: "From verified reviews",
                value: stats?.testimonials?.avgRating || defaultStats.rating,
                
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-100 text-primary-600 mb-3">
                  <stat.icon size={28} />
                </div>
                <div className="text-3xl font-bold text-neutral-900 mb-1">
                  {loadingStats ? "..." : stat.value}{stat.suffix}
                </div>
                <div className="font-semibold text-neutral-700 text-sm mb-1">{stat.label}</div>
                <div className="text-xs text-neutral-500">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">
              Trusted By Thousands
            </p>
            <h2 className="text-2xl font-bold text-neutral-900">Certifications & Recognition</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 text-center hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-100 text-accent-600 mb-3">
                  <badge.icon size={24} />
                </div>
                <h3 className="font-bold text-neutral-900 mb-1">{badge.title}</h3>
                <p className="text-sm text-neutral-600">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Categories */}
      <ExperienceCategories />

      {/* Features Section */}
      <FeatuersSection />

      {/* Featured Packages */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FeaturedPackages limit={6} />
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
              Explore Popular Destinations
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              From Himalayan adventures to Beaches, from Pilgrimages to Luxurious Getaways
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((dest, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Link href={dest.href}>
                  <div className="relative h-64">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-1 text-white reey-font">{dest.name}</h3>
                      <p className="text-white/80 text-sm mb-2 text-right">{dest.region}</p>
                      <div className="inline-flex items-center gap-2 text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <span>{dest.packages} packages</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-primary-500 text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-all"
            >
              <span>View All Destinations</span>
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Why Choose NavSafar?
              </h2>
              <p className="text-neutral-600 text-lg mb-10">
                With over a decade of experience, we've crafted unforgettable journeys
                for travelers across the globe. Here's why thousands choose us:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {whyChooseUs.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center text-xl">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-neutral-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="/assets/bg.jpg"
                alt="Happy travelers"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-neutral-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-neutral-900">4.8/5</div>
                    <div className="text-sm text-neutral-600">Google Rating</div>
                    <div className="text-xs text-neutral-400">5,000+ reviews</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
      <Testimonials
        title="What Our Travelers Say"
        subtitle="Real experiences from travelers who explored with NavSafar"
        limit={6}
        showControls={true}
      />

      {/* About Us */}
      <AboutUs />

      {/* CTA Section */}
      <CTASection />

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Never Miss a Deal
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Subscribe to get exclusive travel deals, destination guides, and insider tips
            delivered to your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/20 transition-all"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-neutral-50 transition-colors shadow-lg"
            >
              {subscribed ? (
                <span className="flex items-center gap-2">
                  <CheckCircle size={20} />
                  Subscribed!
                </span>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
          {subscribed && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-green-300 text-sm"
            >
              ✓ Thank you! Check your inbox for confirmation.
            </motion.p>
          )}
        </div>
      </section>
    </div>
  );
}
