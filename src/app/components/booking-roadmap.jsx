"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { CheckCircle, ArrowRight, Calendar, MapPin, CreditCard, Plane } from "lucide-react";
import { bookingSteps } from "../../allAPIs";

const iconMap = {
  MapPin,
  Calendar,
  CheckCircle,
  CreditCard,
  Plane
};

export function BookingRoadmap({ stepsToShow = 5 }) {
  const [isClient, setIsClient] = useState(false);
  const displaySteps = bookingSteps.slice(0, stepsToShow);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const backgroundStyle = isClient ? {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A24D' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  } : {};

  return (
    <section className="py-20 bg-gradient-to-br from-[#0B1C2D] via-[#1a3a52] to-[#0B1C2D] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={backgroundStyle}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        {isClient && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-6">
              How <span className="text-[#C9A24D]">Booking Works</span>
            </h2>
            <p className="font-['Cormorant_Garamond'] text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your journey from dream to destination in five simple steps
            </p>
          </motion.div>
        )}

        {/* Roadmap */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent transform -translate-y-1/2 z-0"></div>
          
          <div className="grid gap-8 md:grid-cols-5 relative z-10">
            {displaySteps.map((step, index) => {
              const Icon = iconMap[step.icon];
              return (
                <div key={step.id} className="relative group">
                  {isClient ? (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.15 }}
                      className="relative group"
                    >
                  {/* Step Card */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    {/* Step Number Circle */}
                    <div className="relative mb-6">
                      <div className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="text-white" size={32} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#C9A24D] rounded-full flex items-center justify-center text-white font-bold text-sm font-['Inter']">
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-['Playfair_Display'] text-xl font-bold text-white mb-3 text-center">
                      {step.title}
                    </h3>
                    <p className="font-['Inter'] text-gray-300 text-sm text-center leading-relaxed">
                      {step.description}
                    </p>

                    {/* Arrow Indicator */}
                    {index < displaySteps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                        {isClient ? (
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <ArrowRight className="text-[#C9A24D]" size={24} />
                          </motion.div>
                        ) : (
                          <ArrowRight className="text-[#C9A24D]" size={24} />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`}></div>
                    </motion.div>
                  ) : (
                    <div className="relative group">
                      {/* Static fallback for server-side rendering */}
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <div className="relative mb-6">
                          <div className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg`}>
                            <Icon className="text-white" size={32} />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#C9A24D] rounded-full flex items-center justify-center text-white font-bold text-sm font-['Inter']">
                            {index + 1}
                          </div>
                        </div>
                        <h3 className="font-['Playfair_Display'] text-xl font-bold text-white mb-3 text-center">
                          {step.title}
                        </h3>
                        <p className="font-['Inter'] text-gray-300 text-sm text-center leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        {isClient ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-[#C9A24D] to-[#d4b05e] rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="font-['Playfair_Display'] text-2xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="font-['Inter'] text-white/90 mb-6">
                Let our travel experts craft your perfect getaway
              </p>
              <motion.button
                className="bg-white text-[#0B1C2D] px-8 py-3 rounded-lg font-['Inter'] font-bold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/booking'}
              >
                Start Planning
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-[#C9A24D] to-[#d4b05e] rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="font-['Playfair_Display'] text-2xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="font-['Inter'] text-white/90 mb-6">
                Let our travel experts craft your perfect getaway
              </p>
              <button
                className="bg-white text-[#0B1C2D] px-8 py-3 rounded-lg font-['Inter'] font-bold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                onClick={() => window.location.href = '/booking'}
              >
                Start Planning
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
