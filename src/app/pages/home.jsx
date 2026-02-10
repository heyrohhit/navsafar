"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Star, MapPin, Calendar, Users, ArrowRight, Shield, Map, MessageCircle, Plane, Building2, Globe, Award, CheckCircle2, Headphones, Phone } from "lucide-react";
import { PremiumPortfolio } from "../components/premium-portfolio";
import { BookingRoadmap } from "../components/booking-roadmap";
import { 
  tourCategories, 
  services, 
  uspPoints, 
  testimonials,
  serviceCategories
} from "../../allAPIs/home";

/* ================= ICON MAPPING ================= */
const iconMap = {
  Shield,
  Users,
  Map,
  Headphones,
  CheckCircle2,
  MessageCircle,
  Plane,
  Building2,
  Globe,
  Award
};


/* ================= COMPONENT ================= */

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentText, setCurrentText] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(
      () => setCurrentSlide((p) => (p + 1) % tourCategories.length),
      3000
    );
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setCurrentText(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-[#F5F7FA]">
      {/* ================= HERO ================= */}
      <section className="relative h-[75vh] md:h-[75vh] overflow-hidden font-['Playfair_Display']">
        <div className="absolute inset-0">
          {tourCategories.map((item, idx) => (
            isClient ? (
              <motion.div
                key={idx}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ 
                  opacity: currentSlide === idx ? 1 : 0,
                  scale: currentSlide === idx ? 1 : 1.1
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <ImageWithFallback src={item.image} alt={item.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/80" />
              </motion.div>
            ) : (
              <div key={idx} className="absolute inset-0">
                <ImageWithFallback src={item.image} alt={item.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/80" />
              </div>
            )
          ))}
        </div>

        <div className="relative flex h-full items-center">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-5xl text-center">
              <div className="relative md:min-h-[180px] min-h-[120px] flex">
                {currentText &&
                  tourCategories.map((item, idx) => (
                    isClient ? (
                      <motion.h1
                        key={idx}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ 
                          opacity: currentSlide === idx ? 1 : 0,
                          y: currentSlide === idx ? 0 : 50
                        }}
                        transition={{ duration: 1, delay: currentSlide === idx ? 0.3 : 0 }}
                        className={`absolute inset-0 flex items-center justify-center text-center text-white font-bold font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight px-4`}
                      >
                        <span className="bg-gradient-to-r from-white via-[#C9A24D] to-white bg-clip-text text-transparent drop-shadow-lg">
                          {item.title}
                        </span>
                      </motion.h1>
                    ) : (
                      <h1 key={idx} className={`absolute inset-0 flex items-center justify-center text-center text-white font-bold font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight px-4 ${currentSlide === idx ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="bg-gradient-to-r from-white via-[#C9A24D] to-white bg-clip-text text-transparent drop-shadow-lg">
                          {item.title}
                        </span>
                      </h1>
                    )
                  ))}
              </div>

              {isClient ? (
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="mb-8 text-white text-lg sm:text-xl md:text-2xl font-['Cormorant_Garamond'] flex items-center justify-center gap-4 drop-shadow-md"
                >
                  <span className="inline-block w-8 h-0.5 bg-[#C9A24D] shadow-lg"></span>
                  <span className="font-semibold">Luxury • Corporate • Customized Travel Experiences</span>
                  <span className="inline-block w-8 h-0.5 bg-[#C9A24D] shadow-lg"></span>
                </motion.p>
              ) : (
                <p className="mb-8 text-white text-lg sm:text-xl md:text-2xl font-['Cormorant_Garamond'] flex items-center justify-center gap-4 drop-shadow-md opacity-100">
                  <span className="inline-block w-8 h-0.5 bg-[#C9A24D] shadow-lg"></span>
                  <span className="font-semibold">Luxury • Corporate • Customized Travel Experiences</span>
                  <span className="inline-block w-8 h-0.5 bg-[#C9A24D] shadow-lg"></span>
                </p>
              )}

              {isClient ? (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="flex flex-wrap gap-4 justify-center"
                >
                  <motion.a 
                    href="#enquiry-form" 
                    className="bg-gradient-to-br from-[#C9A24D] via-[#B8934D] to-[#A0803D] px-10 py-5 rounded-xl text-[#0B1C2D] font-['Cormorant_Garamond'] font-bold text-lg shadow-2xl hover:shadow-[#C9A24D]/50 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Plan My Trip
                  </motion.a>
                  <motion.a 
                    href="https://wa.me/919560185041" 
                    className="border-2 border-white/80 backdrop-blur-sm px-10 py-5 rounded-xl text-white flex items-center gap-3 hover:bg-white hover:text-[#0B1C2D] transition-all duration-300 font-['Inter'] font-semibold"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle size={22} /> WhatsApp Expert
                  </motion.a>
                </motion.div>
              ) : (
                <div className="flex flex-wrap gap-4 justify-center opacity-100">
                  <a 
                    href="#enquiry-form" 
                    className="bg-gradient-to-br from-[#C9A24D] via-[#B8934D] to-[#A0803D] px-10 py-5 rounded-xl text-[#0B1C2D] font-['Cormorant_Garamond'] font-bold text-lg shadow-2xl hover:shadow-[#C9A24D]/50 transition-all duration-300"
                  >
                    Plan My Trip
                  </a>
                  <a 
                    href="https://wa.me/919560185041" 
                    className="border-2 border-white/80 backdrop-blur-sm px-10 py-5 rounded-xl text-white flex items-center gap-3 hover:bg-white hover:text-[#0B1C2D] transition-all duration-300 font-['Inter'] font-semibold"
                  >
                    <MessageCircle size={22} /> WhatsApp Expert
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
          {tourCategories.map((_, idx) => (
            isClient ? (
              <motion.button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-3 rounded-full bg-white transition-all ${
                  currentSlide === idx ? "w-12" : "w-3 opacity-50"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ) : (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-3 rounded-full bg-white transition-all ${
                  currentSlide === idx ? "w-12" : "w-3 opacity-50"
                }`}
              />
            )
          ))}
        </div>

        {/* Floating decorative elements */}
        {isClient ? (
          <>
            <motion.div
              className="absolute top-20 left-10 w-20 h-20 border-2 border-[#C9A24D]/30 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-16 h-16 border-2 border-[#C9A24D]/30 rounded-full"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
          </>
        ) : (
          <>
            <div className="absolute top-20 left-10 w-20 h-20 border-2 border-[#C9A24D]/30 rounded-full opacity-30" />
            <div className="absolute bottom-20 right-10 w-16 h-16 border-2 border-[#C9A24D]/30 rounded-full opacity-30" />
          </>
        )}
      </section>

 {/* Premium Portfolio Section */}
      <PremiumPortfolio maxItems={6}/>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-gradient-to-r from-[#0B1C2D] via-[#1a3a52] to-[#0B1C2D] py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url(&quot;data:image/svg+xml,%3Csvg width=\&quot;60\&quot; height=\&quot;60\&quot; viewBox=\&quot;0 0 60 60\&quot; xmlns=\&quot;http://www.w3.org/2000/svg\&quot;%3E%3Cg fill=\&quot;none\&quot; fill-rule=\&quot;evenodd\&quot;%3E%3Cg fill=\&quot;%23C9A24D\&quot; fill-opacity=\&quot;0.4\&quot;%3E%3Ccircle cx=\&quot;7\&quot; cy=\&quot;7\&quot; r=\&quot;1\&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)] bg-repeat"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-6">
              What Our <span className="text-[#C9A24D]">Travelers</span> Say
            </h2>
            <div className="w-24 h-1 bg-[#C9A24D] mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-[#C9A24D] fill-current" size={20} />
                  ))}
                </div>
                <p className="text-lg font-['Cormorant_Garamond'] text-white/90 italic mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#C9A24D] rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <p className="font-['Inter'] font-semibold text-white">
                    {testimonial.name}
                  </p>
                  <p className="font-['Inter'] text-[#C9A24D] text-sm">
                    Verified Traveler
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
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
              isClient ? (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#C9A24D]/20"
                  onClick={() => window.location.href = `/tours/${encodeURIComponent(category.title.replace(/\s+/g, '-'))}`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-['Playfair_Display'] text-xl font-bold text-white">
                        {category.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div
                  key={category.title}
                  className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#C9A24D]/20 opacity-100"
                  onClick={() => window.location.href = `/tours/${encodeURIComponent(category.title.replace(/\s+/g, '-'))}`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-['Playfair_Display'] text-xl font-bold text-white">
                        {category.title}
                      </h3>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 font-['Playfair_Display'] text-4xl font-bold text-[#0B1C2D]">
              Our Travel Services
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((category, index) => (
              isClient ? (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#C9A24D]/20"
                  onClick={() => window.location.href = `/services/${encodeURIComponent(category.title.replace(/\s+/g, '-'))}`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-['Playfair_Display'] text-xl font-bold text-white">
                        {category.title}
                      </h3>
                      <p className="text-sm text-white/90 mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div
                  key={category.title}
                  className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#C9A24D]/20 opacity-100"
                  onClick={() => window.location.href = `/services/${encodeURIComponent(category.title.replace(/\s+/g, '-'))}`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-['Playfair_Display'] text-xl font-bold text-white">
                        {category.title}
                      </h3>
                      <p className="text-sm text-white/90 mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Services Features */}

      {/* Booking Process */}
      <BookingRoadmap/>

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
              isClient ? (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-md"
                >
                  <CheckCircle2 className="shrink-0 text-[#C9A24D]" size={28} />
                  <p className="font-['Inter'] font-semibold text-gray-800">
                    {point}
                  </p>
                </motion.div>
              ) : (
                <div
                  key={point}
                  className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-md opacity-100"
                >
                  <CheckCircle2 className="shrink-0 text-[#C9A24D]" size={28} />
                  <p className="font-['Inter'] font-semibold text-gray-800">
                    {point}
                  </p>
                </div>
              )
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
                        className="mt-1 shrink-0 text-[#C9A24D]"
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
