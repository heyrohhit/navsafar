"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Globe } from "lucide-react";

const contactMethods = [
  {
    icon: Phone,
    title: "Phone",
    value: "+91 95601 85041",
    link: "tel:+919560185041",
    color: "bg-blue-500",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "+91 95601 85041",
    link: "https://wa.me/919560185041",
    color: "bg-green-500",
  },
  {
    icon: Mail,
    title: "Email",
    value: "support@navsafartravels.com",
    link: "mailto:support@navsafartravels.com",
    color: "bg-red-500",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "New Delhi, India",
    link: null,
    color: "bg-purple-500",
  },
  {
    icon: Globe,
    title: "Website",
    value: "www.navsafartravels.com",
    link: "https://www.navsafartravels.com",
    color: "bg-teal-500",
  },
];

export default function ContactPage() {
  return (
    <div className="mt-6 min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Contact Us
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              We're here to help you plan your perfect journey. Get in touch
              with us through any of the following channels.
            </p>
          </div>

          {/* Contact Methods Grid */}
          <div className="mb-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl"
                >
                  <div
                    className={`${method.color} mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg text-white`}
                  >
                    <Icon size={28} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {method.title}
                  </h3>
                  {method.link ? (
                    <a
                      href={method.link}
                      className="text-gray-600 hover:text-blue-600 break-words"
                      target={method.link.startsWith("http") ? "_blank" : undefined}
                      rel={method.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {method.value}
                    </a>
                  ) : (
                    <p className="text-gray-600">{method.value}</p>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Quick Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-white"
          >
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold">
                Need Immediate Assistance?
              </h2>
              <p className="mb-8 text-lg text-blue-100">
                Our team is available 24/7 to help you with your travel needs.
                Reach out to us on WhatsApp for instant support!
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="https://wa.me/919560185041"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-8 py-3 font-semibold text-white transition-transform hover:scale-105 hover:bg-green-600"
                >
                  <MessageCircle size={20} />
                  Chat on WhatsApp
                </a>
                <a
                  href="tel:+919560185041"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-transform hover:scale-105"
                >
                  <Phone size={20} />
                  Call Us Now
                </a>
              </div>
            </div>
          </motion.div>

          {/* Business Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 rounded-xl bg-white p-8 shadow-lg"
          >
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
              Business Hours
            </h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span className="font-semibold">Monday - Friday:</span>
                <span>9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Saturday:</span>
                <span>10:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Sunday:</span>
                <span>By Appointment</span>
              </div>
              <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm">
                <strong className="text-blue-900">Note:</strong>{" "}
                <span className="text-blue-800">
                  WhatsApp support is available 24/7 for emergencies and urgent
                  queries.
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
