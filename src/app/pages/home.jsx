"use client"

import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useEffect, useState } from "react";

import {
  CheckCircle2,
  MessageCircle,
  Phone,
  Shield,
  Clock,
  Award,
  Users,
  Globe,
  Plane,
  Building2,
  Heart,
  Map,
} from 'lucide-react';

const tourCategories = [
  {
    title: 'International Luxury Tours',
    image: 'https://images.unsplash.com/photo-1763571589025-efacfe091161?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGUlMjB2YWNhdGlvbiUyMHNjZW5pY3xlbnwxfHx8fDE3NjkwNjE4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Honeymoon Packages',
    image: 'https://images.unsplash.com/photo-1614505241347-7f4765c1035e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMGx1eHVyeSUyMHJlc29ydHxlbnwxfHx8fDE3Njg5NzU1Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Religious Tours',
    image: 'https://images.unsplash.com/photo-1649147313351-c86537fda0eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZWRhcm5hdGglMjB0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzY5MDYxODU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Corporate Group Travel',
    image: 'https://images.unsplash.com/photo-1758518731706-be5d5230e5a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBidXNpbmVzcyUyMG1lZXRpbmd8ZW58MXx8fHwxNzY4OTk2MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Family Vacations',
    image: 'https://images.unsplash.com/photo-1552249352-02a0817a2d95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjB2YWNhdGlvbiUyMGJlYWNofGVufDF8fHx8MTc2OTA2MTg1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Customized Journeys',
    image: 'https://images.unsplash.com/photo-1759773936612-164cc2e19671?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3b3JsZCUyMHRyYXZlbCUyMGRlc3RpbmF0aW9uc3xlbnwxfHx8fDE3NjkwNjE4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

const services = [
  { icon: Shield, text: 'Clear Pricing – No Hidden Charges' },
  { icon: Users, text: 'Dedicated Trip Management' },
  { icon: Map, text: 'Customized Travel Plans' },
  { icon: MessageCircle, text: 'WhatsApp Support (Before, During & After Trip)' },
  { icon: Plane, text: 'Domestic & International Flights' },
  { icon: Building2, text: 'Corporate & Premium Hotel Bookings' },
  { icon: Globe, text: 'Airport Transfers & Cab Services' },
  { icon: Award, text: 'Visa Assistance (Business & Tourist)' },
  { icon: CheckCircle2, text: 'Travel Insurance' },
];

const bookingSteps = [
  'Share your travel idea',
  'Receive a custom itinerary',
  'Review & modify',
  'Flexible payment',
  'Enjoy stress-free travel',
];

const uspPoints = [
  'Personal Trip Advisor',
  'Fully Customized Itineraries',
  '24/7 Human Support',
  'Flexible Payment Options',
  'Easy Cancellation',
  'Post-trip Support',
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentText, setCurrentText] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % tourCategories.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const textShow = setTimeout(() => {
      setCurrentText(true);
    }, 1000);

    return () => clearTimeout(textShow);
  }, []);

  return (
    <div className="bg-[#F5F7FA]">
      {/* Hero Section */}
    <section className="relative h-screen overflow-hidden bg-red-500">
      <div className="absolute inset-0">
        {tourCategories.map((item, idx) => (
          <motion.div
            key={idx}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: currentSlide === idx ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <ImageWithFallback
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/60 to-black/80" />
      </div>

      <div className="relative flex h-full items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
           <div calssName="fixed overflow-hidden">
             {currentText?tourCategories.map((item,idx)=>(
             <motion.h1
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentSlide === idx ? 1 : 0, }}
            transition={{ duration: 0.7}}
           className="absolute top-50 mb-4 font-['Playfair_Display'] text-5xl font-bold leading-tight text-white md:text-7xl">
              {item.title}
            </motion.h1>
           )):<motion.h1
           initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.5}}
            className="mb-4 font-['Playfair_Display'] text-5xl font-bold leading-tight text-white">Navsafar Travel Solutions</motion.h1>}
           </div>
            <p className="mb-8 font-['Inter'] text-xl text-gray-200 md:text-2xl">
              Luxury • Corporate • Customized Travel Experiences
            </p>
            <div className="flex gap-4 sm:flex-row flex-wrap cursor-pointer relative z-10">
              <a
                href="#enquiry-form"
                className="md:w-[45%] inline-block rounded-lg bg-[#C9A24D] px-8 py-4 text-center font-['Inter'] text-lg font-semibold text-white transition-all hover:bg-[#B8934D]"
              >
                Plan My Trip
              </a>
              <a
                href="https://wa.me/919560185041"
                target="_blank"
                rel="noopener noreferrer"
                className="md:w-[50%] inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-transparent px-8 py-4 font-['Inter'] text-lg font-semibold text-white transition-all hover:bg-white hover:text-[#0B1C2D]"
              >
                <MessageCircle size={24} />
                WhatsApp Expert
              </a>
            </div>
          </motion.div>
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
