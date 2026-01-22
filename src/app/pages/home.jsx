"use client";

import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  MessageCircle,
  Phone,
  Shield,
  Award,
  Users,
  Globe,
  Plane,
  Building2,
  Map,
  Star,
} from "lucide-react";



/* ================= DATA ================= */

const tourCategories = [
  { title: "International Luxury Tours", image: "https://images.unsplash.com/photo-1763571589025-efacfe091161?q=80&w=1080" },
  { title: "Honeymoon Packages", image: "https://images.unsplash.com/photo-1614505241347-7f4765c1035e?q=80&w=1080" },
  { title: "Religious Tours", image: "https://images.unsplash.com/photo-1649147313351-c86537fda0eb?q=80&w=1080" },
  { title: "Corporate Group Travel", image: "https://images.unsplash.com/photo-1758518731706-be5d5230e5a5?q=80&w=1080" },
  { title: "Family Vacations", image: "https://images.unsplash.com/photo-1552249352-02a0817a2d95?q=80&w=1080" },
  { title: "Customized Journeys", image: "https://images.unsplash.com/photo-1759773936612-164cc2e19671?q=80&w=1080" },
];

const services = [
  { icon: Shield, text: "Clear Pricing – No Hidden Charges" },
  { icon: Users, text: "Dedicated Trip Management" },
  { icon: Map, text: "Customized Travel Plans" },
  { icon: MessageCircle, text: "WhatsApp Support (Before, During & After Trip)" },
  { icon: Plane, text: "Domestic & International Flights" },
  { icon: Building2, text: "Corporate & Premium Hotel Bookings" },
  { icon: Globe, text: "Airport Transfers & Cab Services" },
  { icon: Award, text: "Visa Assistance (Business & Tourist)" },
  { icon: CheckCircle2, text: "Travel Insurance" },
];

const bookingSteps = [ 'Share your travel idea', 'Receive a custom itinerary', 'Review & modify', 'Flexible payment', 'Enjoy stress-free travel', ];
 const uspPoints = [ 'Personal Trip Advisor', 'Fully Customized Itineraries', '24/7 Human Support', 'Flexible Payment Options', 'Easy Cancellation', 'Post-trip Support', ];

const testimonials = [
  {
    name: "Rohit Sharma",
    text: "Navsafar planned our Europe honeymoon perfectly. Zero stress, pure luxury!",
  },
  {
    name: "Anjali Mehta",
    text: "Best corporate travel partner we have worked with. Highly professional.",
  },
  {
    name: "Faizan Khan",
    text: "Excellent service, instant support on WhatsApp even during the trip.",
  },
];

/* ================= COMPONENT ================= */

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentText, setCurrentText] = useState(false);
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(
      () => setCurrentSlide((p) => (p + 1) % tourCategories.length),
      3000
    );
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    const reviewInterval = setInterval(
      () => setCurrentReview((p) => (p + 1) % testimonials.length),
      4000
    );
    return () => clearInterval(reviewInterval);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setCurrentText(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-[#F5F7FA]">
      {/* ================= HERO ================= */}
      <section className="relative h-[92vh] md:h-screen overflow-hidden font-['Playfair_Display']">
        <div className="absolute inset-0">
          {tourCategories.map((item, idx) => (
            <motion.div
              key={idx}
              className="absolute inset-0"
              animate={{ opacity: currentSlide === idx ? 1 : 0 }}
            >
              <ImageWithFallback src={item.image} alt={item.title} className="h-full w-full object-cover" />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/80" />
        </div>

        <div className="relative flex h-full items-center">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">
              <div className="relative md:min-h-[160px] min-h-[110px] flex">
                {currentText &&
                  tourCategories.map((item, idx) => (
                    <motion.h1
                      key={idx}
                      animate={{ opacity: currentSlide === idx ? 1 : 0 }}
                      className={`absolute inset-0 flex text-center text-white font-bold font-['Playfair_Display'] text-5xl sm:text-5xl md:text-6xl lg:text-7xl`}
                    >
                      {item.title}
                    </motion.h1>
                  
                  ))}
              </div>

              <p className="mb-8 text-gray-200 text-lg sm:text-xl font-['Playfair_Display'] flex items-center">
                Luxury • Corporate • Customized Travel Experiences
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="#enquiry-form" className="bg-[#C9A24D] px-8 py-4 rounded-lg text-[#0B1C2D]  text-shadow-2xl font-[Cormorant_Garamond] font-bold">
                  Plan My Trip
                </a>
                <a href="https://wa.me/919560185041" className="border-2 border-white px-8 py-4 rounded-lg text-white flex items-center gap-2">
                  <MessageCircle size={20} /> WhatsApp Expert
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {tourCategories.map((_, idx) => (
            <span key={idx} className={`h-2 rounded-full bg-white transition-all ${currentSlide === idx ? "w-6" : "w-2 opacity-50"}`} />
          ))}
        </div>
      </section>

      {/* ================= LIVE STATS ================= */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["5000+", "Happy Customers"],
            ["12000+", "Trips Planned"],
            ["35+", "Countries Covered"],
            ["300+", "Corporate Clients"],
          ].map(([num, label]) => (
            <div key={label}>
              <h3 className="text-4xl font-bold text-[#C9A24D]">{num}</h3>
              <p className="text-gray-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-[#0B1C2D] py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-10 font-['Playfair_Display']">
            Happy Travelers
          </h2>

          <motion.div
            key={currentReview}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 p-8 rounded-xl"
          >
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-[#C9A24D]" />
              ))}
            </div>
            <p className="text-lg italic mb-4">
              “{testimonials[currentReview].text}”
            </p>
            <p className="font-semibold">
              — {testimonials[currentReview].name}
            </p>
          </motion.div>
        </div>
      </section>

     

      {/* About Preview */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="mb-4 font-['Playfair_Display'] text-4xl font-bold text-[#0B1C2D]">
              About Navsafar
            </h2>
            <p className="mx-auto mb-6 max-w-3xl font-['Inter'] text-lg text-gray-600">
              Navsafar is a professional travel management company delivering
              fast, transparent and reliable travel solutions with complete
              end-to-end support.
            </p>
            <p className="font-['Playfair_Display'] text-2xl italic text-[#C9A24D]">
              "We don't sell packages. We design journeys."
            </p>
          </motion.div>
        </div>
      </section>
 
      {/* Tour Categories */}
      <section className="bg-[#F5F7FA] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 font-['Playfair_Display'] text-4xl font-bold text-[#0B1C2D]">
              Explore Our Journeys
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tourCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl shadow-lg"
              >
                <div className="aspect-[4/3]">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-['Playfair_Display'] text-2xl font-bold text-white">
                    {category.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 font-['Playfair_Display'] text-4xl font-bold text-[#0B1C2D]">
              Our Best Services
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="flex items-start gap-4 rounded-xl bg-[#F5F7FA] p-6"
                >
                  <div className="flex-shrink-0">
                    <Icon className="text-[#C9A24D]" size={28} />
                  </div>
                  <p className="font-['Inter'] text-gray-700">{service.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking Process */}
      <section className="bg-[#0B1C2D] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 font-['Playfair_Display'] text-4xl font-bold text-white">
              How Booking Works
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-5">
            {bookingSteps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A24D] font-['Playfair_Display'] text-2xl font-bold text-white">
                  {index + 1}
                </div>
                <p className="font-['Inter'] text-gray-300">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="bg-[#F5F7FA] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 font-['Playfair_Display'] text-4xl font-bold text-[#0B1C2D]">
              Why Choose Navsafar
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {uspPoints.map((point, index) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-md"
              >
                <CheckCircle2 className="flex-shrink-0 text-[#C9A24D]" size={28} />
                <p className="font-['Inter'] font-semibold text-gray-800">
                  {point}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Preview */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B1C2D] to-[#1a3a52]">
            <div className="grid items-center gap-8 p-12 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-6 font-['Playfair_Display'] text-4xl font-bold text-white">
                  Corporate & MICE Travel
                </h2>
                <ul className="space-y-3">
                  {[
                    'Corporate Travel Management',
                    'MICE – Meetings, Incentives, Conferences & Exhibitions',
                    'Group & Incentive Tours',
                    'Flexible Rescheduling',
                    'Dedicated Corporate Account Manager',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 font-['Inter'] text-gray-300"
                    >
                      <CheckCircle2
                        className="mt-1 flex-shrink-0 text-[#C9A24D]"
                        size={20}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="/corporate"
                  className="mt-8 inline-block rounded-lg bg-[#C9A24D] px-8 py-3 font-['Inter'] font-semibold text-white transition-all hover:bg-[#B8934D]"
                >
                  Learn More
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="hidden md:block"
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758518731706-be5d5230e5a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBidXNpbmVzcyUyMG1lZXRpbmd8ZW58MXx8fHwxNzY4OTk2MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Corporate Travel"
                  className="h-auto w-full rounded-xl"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="enquiry-form" className="bg-[#F5F7FA] py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white p-8 shadow-xl"
          >
            <h2 className="mb-6 text-center font-['Playfair_Display'] text-3xl font-bold text-[#0B1C2D]">
              Plan Your Dream Journey
            </h2>
            <a
              href="/booking"
              className="block rounded-lg bg-[#C9A24D] px-8 py-4 text-center font-['Inter'] text-lg font-semibold text-white transition-all hover:bg-[#B8934D]"
            >
              Fill Detailed Booking Form
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#C9A24D] py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 font-['Playfair_Display'] text-4xl font-bold text-white">
            Let's Plan Your Next Safar
          </h2>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="tel:+919560185041"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-['Inter'] font-semibold text-[#0B1C2D] transition-all hover:bg-gray-100"
            >
              <Phone size={20} />
              Call Now
            </a>
            <a
              href="https://wa.me/919560185041"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-transparent px-8 py-4 font-['Inter'] font-semibold text-white transition-all hover:bg-white hover:text-[#0B1C2D]"
            >
              <MessageCircle size={20} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
