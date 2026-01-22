"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plane,
  Hotel,
  Car,
  FileText,
  Shield,
  MapPin,
  Globe,
  Building,
  Church,
  Palette,
} from "lucide-react";

const travelTypes = [
  { name: "Domestic Tours", icon: MapPin, color: "bg-blue-500" },
  { name: "International Tours", icon: Globe, color: "bg-green-500" },
  { name: "Corporate Travel", icon: Building, color: "bg-purple-500" },
  { name: "Religious Tours", icon: Church, color: "bg-orange-500" },
  { name: "Customized Tours", icon: Palette, color: "bg-pink-500" },
];

const bookingServices = [
  { name: "Flight Bookings", icon: Plane, color: "bg-sky-500" },
  { name: "Premium & Corporate Hotels", icon: Hotel, color: "bg-indigo-500" },
  { name: "Airport Transfers & Cabs", icon: Car, color: "bg-teal-500" },
  {
    name: "Visa Assistance (Tourist / Business)",
    icon: FileText,
    color: "bg-amber-500",
  },
  { name: "Travel Insurance", icon: Shield, color: "bg-red-500" },
];

export default function page() {
  return (
    <div className="mt-6 bg-gradient-to-b from-gray-50 to-[#0B1C2D] ">
      <div className="mx-auto max-w-7xl px-8 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Our Services
          </h1>
          <p className="mb-12 text-xl text-gray-600">
            Comprehensive travel solutions tailored to your needs
          </p>

          {/* Travel Types */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Travel Types
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {travelTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <motion.div
                    key={type.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group cursor-pointer rounded-xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mb-4 flex items-center gap-4">
                      <div
                        className={`${type.color} flex h-12 w-12 items-center justify-center rounded-lg text-white`}
                      >
                        <Icon size={24} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {type.name}
                      </h3>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Booking Services */}
          <section>
            <h2 className="mb-8 text-3xl font-bold text-[#f6cf7a]">
              Booking Services
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookingServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group cursor-pointer rounded-xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mb-4">
                      <div
                        className={`${service.color} mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg text-white`}
                      >
                        <Icon size={28} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {service.name}
                      </h3>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white"
          >
            <h2 className="mb-4 text-3xl font-bold">
              Ready to Start Your Journey?
            </h2>
            <p className="mb-6 text-lg text-blue-100">
              Let us help you plan the perfect trip with our comprehensive services
            </p>

            <Link
              href="/booking"
              className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-transform hover:scale-105"
            >
              Book Now
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
