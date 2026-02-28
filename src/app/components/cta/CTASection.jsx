"use client";
import { useState, useEffect, useRef } from "react";

const CTASection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsLoaded(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  const contactMethods = [
    {
      id: "phone",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: "Call Us",
      value: "+91 88821 29640",
      href: "tel:+918882129640",
      accent: "#0F6177",
      emoji: "📞",
    },
    {
      id: "email",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: "Email Us",
      value: "info@navsafartravels.com",
      href: "mailto:info@navsafartravels.com",
      accent: "#1a7a9b",
      emoji: "✉️",
    },
    {
      id: "hours",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "Business Hours",
      value: "Mon – Sat: 9AM – 8PM",
      href: null,
      accent: "#0d4f62",
      emoji: "🕘",
    },
  ];

  const stats = [
    { value: "24/7", label: "Support Available", icon: "🛡️" },
    { value: "100%", label: "Satisfaction Guarantee", icon: "⭐" },
    { value: "50K+", label: "Happy Travelers", icon: "✈️" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f0f9fc 0%, #e6f4f8 40%, #f7fbfd 100%)" }}
    >
      {/* === DECORATIVE BACKGROUND === */}
      {/* Large teal circle top-left */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #0F6177 0%, transparent 70%)" }} />
      {/* Dotted map pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle, #0F6177 1px, transparent 1px)",
        backgroundSize: "28px 28px"
      }} />
      {/* Diagonal decorative stripe */}
      <div className="absolute top-0 right-0 w-64 h-full opacity-5 pointer-events-none"
        style={{ background: "repeating-linear-gradient(-55deg, #0F6177, #0F6177 2px, transparent 2px, transparent 28px)" }} />
      {/* Bottom wave SVG */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: "80px" }}>
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="rgba(15,97,119,0.06)" />
        <path d="M0,55 C480,20 960,70 1440,45 L1440,80 L0,80 Z" fill="rgba(15,97,119,0.04)" />
      </svg>

      {/* Floating destination pills */}
      {[
        { label: "🏝 Bali", top: "8%", left: "6%", delay: "0s" },
        { label: "🗼 Paris", top: "12%", right: "8%", delay: "0.4s" },
        { label: "🏔 Kashmir", bottom: "22%", left: "4%", delay: "0.8s" },
        { label: "🌴 Maldives", bottom: "18%", right: "5%", delay: "1.2s" },
      ].map((pill, i) => (
        <div key={i} className="absolute hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium shadow-md"
          style={{
            top: pill.top, left: pill.left, right: pill.right, bottom: pill.bottom,
            background: "white",
            color: "#0F6177",
            border: "1px solid rgba(15,97,119,0.15)",
            boxShadow: "0 4px 20px rgba(15,97,119,0.12)",
            animation: `floatPill 4s ease-in-out infinite`,
            animationDelay: pill.delay,
            opacity: isLoaded ? 1 : 0,
            transition: `opacity 0.8s ease ${pill.delay}`,
          }}>
          {pill.label}
        </div>
      ))}

      <div className="max-w-6xl mx-auto relative z-10">

        {/* === SECTION HEADER === */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 text-sm font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(15,97,119,0.08)",
              color: "#0F6177",
              border: "1px solid rgba(15,97,119,0.2)",
              letterSpacing: "0.15em"
            }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F6177] animate-pulse" />
            Start Your Adventure
          </div>

          <h2 className="font-bold mb-5" style={{
            fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
            fontSize: "clamp(36px, 6vw, 68px)",
            lineHeight: 1.1,
            color: "#0a3d4d"
          }}>
            Ready for Your{" "}
            <span className="relative inline-block">
              <span style={{
                background: "linear-gradient(135deg, #0F6177 0%, #1a9bbf 50%, #0d7a9e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>Next Adventure?</span>
              {/* Underline decoration */}
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" preserveAspectRatio="none" style={{ height: "10px" }}>
                <path d="M0,8 Q75,2 150,8 Q225,14 300,8" stroke="#0F6177" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5" />
              </svg>
            </span>
          </h2>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
            Join thousands of satisfied travelers — get exclusive deals, expert guidance, and memories that last a lifetime.
          </p>
        </div>

        {/* === TWO COLUMN CONTENT === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

          {/* LEFT — Contact Info */}
          <div className={`space-y-5 transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Palatino Linotype', serif", color: "#0a3d4d" }}>
                Get in Touch
              </h3>
              <p className="text-gray-500 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                Our travel experts are here 6 days a week to craft your perfect journey — from honeymoons to group tours.
              </p>
            </div>

            {contactMethods.map((method, i) => (
              <div key={method.id}
                onMouseEnter={() => setHoveredCard(method.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transition: "all 0.3s ease",
                  animationDelay: `${i * 0.1}s`
                }}>
                {method.href ? (
                  <a href={method.href} className="flex items-center gap-4 p-4 rounded-2xl group block"
                    style={{
                      background: hoveredCard === method.id ? "white" : "rgba(255,255,255,0.7)",
                      border: `1px solid ${hoveredCard === method.id ? "rgba(15,97,119,0.3)" : "rgba(15,97,119,0.1)"}`,
                      boxShadow: hoveredCard === method.id ? "0 8px 32px rgba(15,97,119,0.12)" : "0 2px 8px rgba(15,97,119,0.05)",
                      transform: hoveredCard === method.id ? "translateX(4px)" : "none",
                      backdropFilter: "blur(8px)"
                    }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: "rgba(15,97,119,0.08)", fontSize: "22px" }}>
                      {method.emoji}
                    </div>
                    <div>
                      <div className="font-semibold text-sm uppercase tracking-wider mb-0.5" style={{ color: "#0F6177", letterSpacing: "0.08em" }}>
                        {method.label}
                      </div>
                      <div className="text-gray-600 font-medium">{method.value}</div>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#0F6177" }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-4 p-4 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      border: "1px solid rgba(15,97,119,0.1)",
                      backdropFilter: "blur(8px)"
                    }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(15,97,119,0.08)", fontSize: "22px" }}>
                      {method.emoji}
                    </div>
                    <div>
                      <div className="font-semibold text-sm uppercase tracking-wider mb-0.5" style={{ color: "#0F6177", letterSpacing: "0.08em" }}>
                        {method.label}
                      </div>
                      <div className="text-gray-600 font-medium">{method.value}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT — Newsletter */}
          <div className={`transition-all duration-1000 delay-500 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <div className="relative rounded-3xl overflow-hidden h-full"
              style={{
                background: "linear-gradient(145deg, #0F6177 0%, #0d4f62 50%, #0a3d4d 100%)",
                boxShadow: "0 24px 64px rgba(15,97,119,0.35)"
              }}>
              {/* Card inner pattern */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }} />
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
                style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(30%, -30%)" }} />

              <div className="relative z-10 p-8 flex flex-col h-full">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Palatino Linotype', serif" }}>
                  Get Exclusive Deals
                </h3>
                <p className="text-white/70 mb-6 leading-relaxed" style={{ fontFamily: "Georgia, serif", fontSize: "15px" }}>
                  Be the first to discover hidden gems, flash sales, and curated travel packages — delivered straight to your inbox.
                </p>

                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-5 py-3.5 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none"
                      style={{
                        background: "rgba(255,255,255,0.95)",
                        border: "2px solid transparent",
                        fontFamily: "Georgia, serif",
                        fontSize: "15px",
                        transition: "all 0.2s"
                      }}
                      onFocus={(e) => e.target.style.border = "2px solid rgba(255,255,255,0.6)"}
                      onBlur={(e) => e.target.style.border = "2px solid transparent"}
                      required
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full py-3.5 rounded-xl font-bold text-[#0F6177] tracking-wide transition-all duration-300"
                    style={{
                      background: subscribed
                        ? "linear-gradient(135deg, #4ade80, #22c55e)"
                        : "linear-gradient(135deg, #f5c842, #e8a020)",
                      color: subscribed ? "white" : "#0a3d4d",
                      boxShadow: subscribed ? "0 4px 20px rgba(74,222,128,0.4)" : "0 4px 20px rgba(245,200,66,0.4)",
                      transform: "scale(1)",
                      fontFamily: "'Palatino Linotype', serif",
                      fontSize: "16px",
                      letterSpacing: "0.04em"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    {subscribed ? "✓ You're Subscribed!" : "Subscribe & Explore →"}
                  </button>
                </div>

                <p className="text-white/40 text-xs mt-4" style={{ fontFamily: "Georgia, serif" }}>
                  No spam, ever. Unsubscribe with one click anytime.
                </p>

                {/* Trust badges */}
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10">
                  {["🔒 Secure", "📧 No Spam", "💌 Weekly Deals"].map((badge, i) => (
                    <span key={i} className="text-white/60 text-xs">{badge}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === STATS BAR === */}
        <div className={`transition-all duration-1000 delay-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center py-6 px-4 rounded-2xl relative overflow-hidden group"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(15,97,119,0.12)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 16px rgba(15,97,119,0.06)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(15,97,119,0.15)";
                  e.currentTarget.style.borderColor = "rgba(15,97,119,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,97,119,0.06)";
                  e.currentTarget.style.borderColor = "rgba(15,97,119,0.12)";
                }}>
                {/* Hover fill */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(135deg, rgba(15,97,119,0.03), rgba(15,97,119,0.06))" }} />
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold mb-1" style={{
                  fontFamily: "'Palatino Linotype', serif",
                  color: "#0F6177"
                }}>
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-widest text-gray-400" style={{ letterSpacing: "0.15em" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes floatPill {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
};

export default CTASection;