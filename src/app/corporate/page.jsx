"use client";

import { motion } from "framer-motion";
import { Building2, Users, Calendar, RefreshCw, Headphones } from "lucide-react";

const services = [
  {
    title: "Corporate Travel Management",
    icon: Building2,
    description:
      "End-to-end corporate travel solutions with dedicated account management and cost optimization.",
    color: "bg-blue-500",
  },
  {
    title: "MICE (Meetings, Incentives, Conferences, Exhibitions)",
    icon: Users,
    description:
      "Professional event management services for corporate meetings, conferences, and exhibitions worldwide.",
    color: "bg-purple-500",
  },
  {
    title: "Group Travel",
    icon: Calendar,
    description:
      "Coordinated group travel arrangements with special rates and personalized itineraries for teams.",
    color: "bg-green-500",
  },
  {
    title: "Flexible Rescheduling & Cancellation",
    icon: RefreshCw,
    description:
      "Business-friendly policies with flexible rescheduling and cancellation options to accommodate changing plans.",
    color: "bg-orange-500",
  },
  {
    title: "Dedicated Corporate Support",
    icon: Headphones,
    description:
      "24/7 priority support for corporate clients with dedicated account managers and emergency assistance.",
    color: "bg-teal-500",
  },
];

export default function CorporatePage() {
  return (
    <div className="mt-6 min-h-screen bg-gradient-to-b from-gray-50 to-[#0B1C2D]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Corporate & MICE Services
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Professional travel management solutions for businesses, corporate
              events, and group travel
            </p>
          </div>

          {/* Services Grid */}
          <div className="mb-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div
                    className={`${service.color} mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg text-white`}
                  >
                    <Icon size={32} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-white"
          >
            <h2 className="mb-6 text-3xl font-bold">Why Choose Navsafar for Corporate Travel?</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    ✓
                  </div>
                </div>
                <p className="text-blue-50">
                  Transparent pricing with detailed cost breakdowns
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    ✓
                  </div>
                </div>
                <p className="text-blue-50">
                  Dedicated account managers for seamless coordination
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    ✓
                  </div>
                </div>
                <p className="text-blue-50">
                  Priority booking and preferential rates
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    ✓
                  </div>
                </div>
                <p className="text-blue-50">
                  Real-time updates and 24/7 support
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-8 text-center"
          >
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              Ready to Elevate Your Corporate Travel?
            </h3>
            <p className="mb-6 text-gray-600">
              Contact us today to discuss your corporate travel needs and get a
              customized quote
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/booking"
                className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-transform hover:scale-105 hover:bg-blue-700"
              >
                Request a Quote
              </a>
              <a
                href="tel:+919560185041"
                className="inline-block rounded-lg border-2 border-blue-600 bg-white px-8 py-3 font-semibold text-blue-600 transition-transform hover:scale-105"
              >
                Call Us Now
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
