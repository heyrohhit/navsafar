"use client";
import { useState, useEffect, useRef } from "react";

const AboutUs = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 200);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { number: "50K+", label: "Happy Travelers", icon: "✈️", color: "from-blue-500 to-cyan-400" },
    { number: "200+", label: "Travel Packages", icon: "🗺️", color: "from-teal-500 to-green-400" },
    { number: "50+", label: "Destinations", icon: "🌍", color: "from-purple-500 to-pink-400" },
    { number: "15+", label: "Years Experience", icon: "⭐", color: "from-orange-500 to-yellow-400" }
  ];

  const values = [
    {
      icon: "🏆",
      title: "Quality Service",
      desc: "Exceptional travel experiences with attention to every detail — from booking to return.",
      gradient: "from-blue-500 to-blue-700",
      bg: "bg-blue-50",
    },
    {
      icon: "💎",
      title: "Best Prices",
      desc: "Competitive pricing without compromising on quality. Value that you can feel.",
      gradient: "from-purple-500 to-purple-700",
      bg: "bg-purple-50",
    },
    {
      icon: "❤️",
      title: "Customer Satisfaction",
      desc: "Every traveler returns with a smile and memories to cherish for a lifetime.",
      gradient: "from-teal-500 to-green-700",
      bg: "bg-teal-50",
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f6477] font-sans overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* animated background blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0056d6] via-[#0098c7] to-[#04b586]" />
        <div className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full bg-[#04b586]/30 blur-3xl" style={{ animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute top-1/2 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-300/20 blur-2xl" style={{ animation: "float 8s ease-in-out infinite reverse" }} />

        {/* decorative grid lines */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        {/* floating travel icons */}
        {["✈️","🌴","🏔️","🗺️","🌊","🏛️"].map((emoji, i) => (
          <div key={i} className="absolute text-3xl opacity-20 select-none"
            style={{
              top: `${15 + (i * 13) % 70}%`,
              left: `${5 + (i * 17) % 85}%`,
              animation: `float ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}>
            {emoji}
          </div>
        ))}

        <div className={`relative z-10 text-center px-4 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          {/* badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 text-white text-sm font-semibold px-5 py-2 rounded-full mb-8 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            Trusted Since 2008
          </div>

          <h1 className="text-5xl md:text-8xl font-extrabold text-white mb-4 leading-none tracking-tight drop-shadow-xl">
            About
          </h1>
          <h2 className="text-6xl md:text-9xl font-black tracking-widest mb-8"
            style={{
              background: "linear-gradient(90deg, #ffffff, #a8edcc, #ffffff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "none",
              letterSpacing: "0.08em"
            }}>
            NAVSAFAR
          </h2>
          <p className="text-lg md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-light">
            Your trusted travel companion for{" "}
            <span className="text-white font-semibold underline decoration-[#04b586] underline-offset-4">
              unforgettable journeys
            </span>{" "}
            around the world.
          </p>

          {/* scroll cue */}
          <div className="mt-16 flex justify-center">
            <div className="w-8 h-14 rounded-full border-2 border-white/40 flex items-start justify-center pt-2">
              <div className="w-1.5 h-4 rounded-full bg-white/70" style={{ animation: "scroll-dot 1.8s ease-in-out infinite" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative py-20 bg-white">
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#04b586]/10 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-gray-100 cursor-default transition-all duration-500 hover:-translate-y-2 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${200 + i * 120}ms` }}
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className={`text-4xl md:text-5xl font-black mb-1 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                  {stat.number}
                </div>
                <div className="text-gray-500 font-medium text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="py-24 bg-[#f0f6ff] relative overflow-hidden">
        <div className="absolute right-[-120px] top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-100 to-teal-100 blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* left text */}
            <div className={`transition-all duration-1000 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`} style={{ transitionDelay: "400ms" }}>
              <span className="text-[#04b586] font-bold uppercase tracking-widest text-sm">Our Journey</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-6 leading-tight">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[#04b586]">Story</span> Behind<br />Navsafar
              </h2>
              <div className="space-y-5 text-gray-600 leading-relaxed text-lg">
                <p>
                  Founded in <strong className="text-gray-800">2008</strong>, Navsafar started with a simple mission — to make travel accessible and joyful for everyone. What began as a small travel agency has grown into one of India's most trusted travel companies.
                </p>
                <p>
                  We believe travel is not just about reaching a destination, but about <em className="text-blue-600 not-italic font-semibold">the journey itself</em>. Our team works tirelessly to ensure that every trip becomes a cherished memory.
                </p>
                <p>
                  From domestic getaways to international adventures — we're here to turn your travel dreams into reality.
                </p>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-blue-500 to-[#04b586]" />
                <span className="text-gray-400 font-medium italic">"Travel. Explore. Live."</span>
              </div>
            </div>

            {/* right visual */}
            <div className={`relative transition-all duration-1000 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`} style={{ transitionDelay: "600ms" }}>
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/3] bg-gradient-to-br from-[#0056d6] to-[#04b586]">
                {/* decorative pattern */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "28px 28px"
                }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10 text-center">
                  <div className="text-7xl mb-6">🌏</div>
                  <div className="text-5xl font-black mb-2">15+ Years</div>
                  <div className="text-xl text-blue-100 font-light">of making travel dreams come true</div>
                  <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-xs">
                    {["🏖️ Beaches","🏔️ Mountains","🏛️ Heritage"].map((t, i) => (
                      <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl py-2 px-1 text-xs font-medium text-center">{t}</div>
                    ))}
                  </div>
                </div>
              </div>
              {/* floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4 border border-gray-100">
                <div className="text-3xl">🎯</div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">50,000+</div>
                  <div className="text-gray-400 text-xs uppercase tracking-wide">Happy Travelers</div>
                </div>
              </div>
              <div className="absolute -top-5 -right-5 bg-gradient-to-br from-[#0056d6] to-[#04b586] rounded-2xl shadow-2xl px-5 py-3 text-white text-center">
                <div className="font-black text-2xl">200+</div>
                <div className="text-xs text-blue-100 uppercase tracking-wide">Packages</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-2 bg-gradient-to-r from-blue-600 via-[#04b586] to-blue-600" />
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#04b586] font-bold uppercase tracking-widest text-sm">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 leading-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[#04b586]">Mission</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className={`group relative rounded-3xl p-8 ${v.bg} border border-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-default overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${v.gradient} opacity-10 blur-2xl -translate-y-8 translate-x-8 group-hover:opacity-20 transition-opacity`} />
                <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${v.gradient} items-center justify-center text-2xl shadow-lg mb-6`}>
                  {v.icon}
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
                <div className={`mt-6 w-10 h-1 rounded-full bg-gradient-to-r ${v.gradient} group-hover:w-20 transition-all duration-500`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#003db5] via-[#0078c8] to-[#04b586]" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#04b586]/20 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <div className="text-5xl mb-6">🗺️</div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Ready to Start Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-300">
              Journey?
            </span>
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-xl mx-auto font-light leading-relaxed">
            Join <strong className="text-white">50,000+ happy travelers</strong> who have explored the world with Navsafar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/tour-packages"
              className="group relative px-10 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-2xl text-lg overflow-hidden"
            >
              <span className="relative z-10">✈️ Explore Packages</span>
            </a>
            <a
              href="/contact"
              className="px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 text-lg"
            >
              💬 Contact Us
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes scroll-dot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          60% { transform: translateY(24px); opacity: 0; }
          61% { transform: translateY(0); opacity: 0; }
          80% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;