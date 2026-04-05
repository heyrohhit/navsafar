// src/app/components/sections/HowItWorks.jsx
"use client";
import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    step: "01",
    icon: "💬",
    title: "Enquire",
    desc: "Contact us via WhatsApp, call, or the enquiry form. Tell us your destination, dates, and budget.",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    textColor: "text-blue-600",
  },
  {
    step: "02",
    icon: "📋",
    title: "Plan",
    desc: "Our travel experts design a personalised itinerary just for you — hotels, transport, activities, everything.",
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-50",
    border: "border-purple-200",
    textColor: "text-purple-600",
  },
  {
    step: "03",
    icon: "✅",
    title: "Book",
    desc: "Confirm your trip with a simple booking. Flexible payment options — partial advance, rest on confirmation.",
    color: "from-[#0f6477] to-teal-500",
    bg: "bg-teal-50",
    border: "border-teal-200",
    textColor: "text-teal-600",
  },
  {
    step: "04",
    icon: "✈️",
    title: "Travel",
    desc: "Enjoy your dream vacation! We're available 24/7 during your trip for any support you need.",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    textColor: "text-amber-600",
  },
];

export default function HowItWorks() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-block bg-[#0f6477]/10 text-[#0f6477] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f6477] to-teal-500">
              Works
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Booking your dream trip is easier than you think — just 4 simple steps.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.step}
              className={`relative group rounded-3xl p-7 ${s.bg} border ${s.border} transition-all duration-700 hover:-translate-y-2 hover:shadow-xl ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${i * 120}ms` }}>

              {/* Connector arrow (hidden on last item and mobile) */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-gray-300 text-2xl">
                  →
                </div>
              )}

              {/* Step number */}
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${s.color} text-white text-sm font-black mb-5 shadow-lg`}>
                {s.step}
              </div>

              {/* Icon */}
              <div className="text-4xl mb-4">{s.icon}</div>

              {/* Title */}
              <h3 className={`text-xl font-extrabold mb-3 ${s.textColor}`}>{s.title}</h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>

              {/* Bottom bar */}
              <div className={`mt-5 h-1 w-10 rounded-full bg-gradient-to-r ${s.color} group-hover:w-full transition-all duration-500`} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "500ms" }}>
          <a href="/booking"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0f6477] text-white font-bold rounded-2xl hover:bg-[#0d5567] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#0f6477]/30">
            Start Your Journey →
          </a>
        </div>
      </div>
    </section>
  );
}