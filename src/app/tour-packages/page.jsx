"use client";
import { useState, useEffect, useRef } from "react";
import ModernFilterSection from "../components/packages/ModernFilterSection";
import { getAllPackages, getPackagesByCategory } from "../components/packages/PackageData";
import PackageGridLayout from "../components/packages/PackageGridLayout";

/* ─────────────────────────────────────────────
   Design Direction: Luxury Editorial Travel
   • Deep midnight-navy + champagne gold + warm cream
   • Playfair Display (display) + DM Sans (body)
   • Cinematic hero with parallax depth layers
   • Glass-morphism filter card
   • Staggered card reveals on scroll
   ───────────────────────────────────────────── */

const TourPackages = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [duration, setDuration] = useState("all");
  const [packages, setPackages] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 200);
    setPackages(getAllPackages());

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filterPackages = () => {
    let filtered = getAllPackages();
    if (selectedCategory !== "all") filtered = getPackagesByCategory(selectedCategory);
    if (priceRange !== "all") {
      filtered = filtered.filter((pkg) => {
        const price = parseInt(pkg.price.replace(/[₹,]/g, ""));
        switch (priceRange) {
          case "budget": return price < 20000;
          case "moderate": return price >= 20000 && price < 50000;
          case "premium": return price >= 50000 && price < 100000;
          case "luxury": return price >= 100000;
          default: return true;
        }
      });
    }
    if (duration !== "all") {
      filtered = filtered.filter((pkg) => {
        const days = parseInt(pkg.duration.split(" ")[0]);
        switch (duration) {
          case "short": return days <= 3;
          case "medium": return days >= 4 && days <= 6;
          case "long": return days >= 7;
          default: return true;
        }
      });
    }
    return filtered;
  };

  const filteredPackages = filterPackages();

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setPriceRange("all");
    setDuration("all");
  };

  const handleViewDetails = (pkg) => console.log("View details for:", pkg);

  const handleGetQuery = (pkg) => {
    const whatsappNumber = "+918700750589";
    const message = `Package Query:\n\nPackage: ${pkg.title}\nLocation: ${pkg.location}\nDuration: ${pkg.duration}\nPrice: ${pkg.price}\nOriginal Price: ${pkg.originalPrice}\nRating: ${pkg.rating}\n\nPlease provide more details about this package!`;
    const url = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        :root {
          --navy:     #0F6177;
          --navy-mid: #0F6177;
          --navy-light: #0F6177;
          --gold:     #c9a85c;
          --gold-light: #e8cc8a;
          --cream:    #fdf8f0;
          --cream-mid: #f5ede0;
          --rose:     #e07060;
          --teal:     #3a8fa8;
          --text-main: #1a1a2e;
          --text-muted: #6b7280;
          --header-h-desk: 5vh;
          --header-h-mob: 17vw;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--text-main);
          overflow-x: hidden;
        }

        /* ── Page top padding matching fixed header ── */
        .page-root {
          padding-top: var(--header-h-desk);
        }
        @media (max-width: 768px) {
          .page-root { padding-top: var(--header-h-mob); }
        }

        /* ── Hero ── */
        .hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: var(--navy);
        }

        .hero-bg-layer {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 30%, #1e3a5f55 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 85% 70%, #2a1a3e44 0%, transparent 70%),
            linear-gradient(160deg, #0b1120 0%, #0f2035 50%, #0b1120 100%);
        }

        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(201,168,92,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,92,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
        }

        .hero-orb-1 {
          position: absolute; top: -10%; left: -5%;
          width: 55vw; height: 55vw; max-width: 700px; max-height: 700px;
          background: radial-gradient(circle, rgba(58,143,168,0.18) 0%, transparent 70%);
          border-radius: 50%;
          animation: breathe 8s ease-in-out infinite;
        }
        .hero-orb-2 {
          position: absolute; bottom: -15%; right: -5%;
          width: 50vw; height: 50vw; max-width: 650px; max-height: 650px;
          background: radial-gradient(circle, rgba(201,168,92,0.12) 0%, transparent 70%);
          border-radius: 50%;
          animation: breathe 10s ease-in-out infinite reverse;
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.1); opacity: 0.7; }
        }

        .hero-content {
          position: relative; z-index: 2;
          text-align: center;
          padding: 4rem 1.5rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 8px 20px;
          border: 1px solid rgba(201,168,92,0.35);
          border-radius: 100px;
          background: rgba(201,168,92,0.08);
          backdrop-filter: blur(10px);
          color: var(--gold-light);
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 2rem;
          transition: all 0.8s cubic-bezier(0.22,1,0.36,1);
        }

        .hero-eyebrow .dot {
          width: 6px; height: 6px;
          background: var(--gold);
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 8vw, 6.5rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
          transition: all 1s cubic-bezier(0.22,1,0.36,1);
        }

        .hero-title em {
          font-style: italic;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 50%, var(--rose) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: rgba(255,255,255,0.6);
          max-width: 600px;
          margin: 0 auto 3rem;
          line-height: 1.8;
          font-weight: 300;
          transition: all 1s cubic-bezier(0.22,1,0.36,1) 0.1s;
        }

        .hero-cta-group {
          display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;
          margin-bottom: 4rem;
          transition: all 1s cubic-bezier(0.22,1,0.36,1) 0.2s;
        }

        .btn-primary {
          padding: 14px 32px;
          background: linear-gradient(135deg, var(--gold) 0%, #b8893a 100%);
          color: var(--navy);
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: transform 0.3s, box-shadow 0.3s;
          box-shadow: 0 4px 24px rgba(201,168,92,0.35);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(201,168,92,0.5);
        }

        .btn-ghost {
          padding: 13px 32px;
          background: transparent;
          color: rgba(255,255,255,0.8);
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 0.95rem;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.3s;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.4);
          color: #fff;
        }

        /* ── Hero Stats ── */
        .hero-stats {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 2px;
          transition: all 1s cubic-bezier(0.22,1,0.36,1) 0.3s;
        }

        .stat-pill {
          display: flex; flex-direction: column; align-items: center;
          padding: 20px 36px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          transition: background 0.3s;
        }
        .stat-pill:first-child { border-radius: 16px 0 0 16px; }
        .stat-pill:last-child  { border-radius: 0 16px 16px 0; }
        .stat-pill:hover { background: rgba(255,255,255,0.07); }

        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--gold-light);
          line-height: 1;
        }
        .stat-label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-top: 4px;
        }

        /* ── Scroll indicator ── */
        .scroll-hint {
          position: absolute; bottom: 2rem; left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.35);
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          z-index: 2;
          animation: float 3s ease-in-out infinite;
        }
        .scroll-line {
          width: 1px; height: 48px;
          background: linear-gradient(to bottom, transparent, rgba(201,168,92,0.6), transparent);
          animation: scroll-line 2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }
        @keyframes scroll-line {
          0%   { transform: scaleY(0) translateY(-50%); opacity: 0; }
          50%  { transform: scaleY(1) translateY(0); opacity: 1; }
          100% { transform: scaleY(0) translateY(50%); opacity: 0; }
        }

        /* ── Section Separator ── */
        .sep {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 2rem;
        }
        .sep-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(201,168,92,0.3)); }
        .sep-line.rev { background: linear-gradient(to left, transparent, rgba(201,168,92,0.3)); }
        .sep-diamond {
          width: 8px; height: 8px;
          background: var(--gold);
          transform: rotate(45deg);
        }

        /* ── Main body ── */
        .body-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 5rem 1.5rem;
        }

        /* ── Filter Card ── */
        .filter-card {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(201,168,92,0.15);
          border-radius: 24px;
          padding: 2.5rem;
          margin-bottom: 4rem;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.8) inset,
            0 20px 60px rgba(11,17,32,0.08),
            0 4px 16px rgba(201,168,92,0.06);
          transition: all 1s cubic-bezier(0.22,1,0.36,1);
        }

        .filter-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.75rem;
          flex-wrap: wrap; gap: 12px;
        }

        .filter-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--navy);
        }

        .results-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px;
          background: linear-gradient(135deg, rgba(201,168,92,0.12), rgba(201,168,92,0.06));
          border: 1px solid rgba(201,168,92,0.3);
          border-radius: 100px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #8a6820;
        }

        /* ── CTA Banner ── */
        .cta-banner {
          margin-top: 5rem;
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          background: var(--navy);
          padding: 5rem 2rem;
          text-align: center;
        }

        .cta-banner::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 15% 50%, rgba(58,143,168,0.2) 0%, transparent 60%),
            radial-gradient(ellipse 50% 70% at 85% 50%, rgba(201,168,92,0.15) 0%, transparent 60%);
          pointer-events: none;
        }

        .cta-banner-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .cta-content { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }

        .cta-tag {
          display: inline-block;
          padding: 5px 14px;
          border: 1px solid rgba(201,168,92,0.4);
          border-radius: 100px;
          color: var(--gold);
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 700;
          color: #fff;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .cta-sub {
          color: rgba(255,255,255,0.5);
          font-size: 1.05rem;
          margin-bottom: 2.5rem;
          line-height: 1.7;
        }

        .cta-btns {
          display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;
        }

        .btn-cta-outline {
          padding: 13px 28px;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          color: rgba(255,255,255,0.85);
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.3s;
        }
        .btn-cta-outline:hover { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.4); }

        /* ── Footer ── */
        .footer-cta {
          background: var(--navy-mid);
          padding: 6rem 1.5rem;
          text-align: center;
          margin-top: 0;
          position: relative;
          overflow: hidden;
        }
        .footer-cta::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(201,168,92,0.4), transparent);
        }

        .footer-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.75rem;
        }

        .footer-sub {
          color: rgba(255,255,255,0.45);
          font-size: 1rem;
          margin-bottom: 2rem;
        }

        .btn-footer {
          padding: 15px 36px;
          background: linear-gradient(135deg, var(--gold) 0%, #b8893a 100%);
          color: var(--navy);
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: transform 0.3s, box-shadow 0.3s;
          box-shadow: 0 4px 24px rgba(201,168,92,0.3);
        }
        .btn-footer:hover { transform: translateY(-3px); box-shadow: 0 10px 36px rgba(201,168,92,0.45); }

        /* ── Fade-in animation ── */
        .fade-up { opacity: 0; transform: translateY(28px); }
        .fade-up.visible { opacity: 1; transform: translateY(0); transition: opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1); }

        @media (max-width: 640px) {
          .stat-pill { padding: 16px 20px; }
          .stat-num { font-size: 1.7rem; }
          .hero-stats { gap: 0; }
          .stat-pill:first-child { border-radius: 16px 16px 0 0; }
          .stat-pill:last-child  { border-radius: 0 0 16px 16px; }
          .filter-card { padding: 1.5rem; }
        }
      `}</style>

      <div className="page-root">
        {/* ── Hero ── */}
        <section className="hero" ref={heroRef}>
          <div className="hero-bg-layer" />
          <div className="hero-grid" />
          <div className="hero-orb-1" />
          <div className="hero-orb-2" />

          <div className="hero-content">
            {/* Eyebrow */}
            <div
              className="hero-eyebrow"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.9s cubic-bezier(0.22,1,0.36,1)"
              }}
            >
              <span className="dot" />
              Premium Travel Experiences
            </div>

            {/* Title */}
            <h1
              className="hero-title"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(30px)",
                transition: "all 1s cubic-bezier(0.22,1,0.36,1) 0.1s"
              }}
            >
              Discover Your
              <em>Dream Destination</em>
            </h1>

            {/* Subtitle */}
            <p
              className="hero-subtitle"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(20px)",
                transition: "all 1s cubic-bezier(0.22,1,0.36,1) 0.2s"
              }}
            >
              Handpicked journeys crafted for the discerning traveller —
              exclusive deals, seamless experiences, unforgettable memories.
            </p>

            {/* CTA Buttons */}
            <div
              className="hero-cta-group"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(20px)",
                transition: "all 1s cubic-bezier(0.22,1,0.36,1) 0.3s"
              }}
            >
              <button
                className="btn-primary"
                onClick={() => document.getElementById("packages-grid")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore Packages ↓
              </button>
              <button
                className="btn-ghost"
                onClick={() => {
                  const wa = `https://wa.me/918700750589?text=${encodeURIComponent("Hi! I'd like to know more about your travel packages.")}`;
                  window.open(wa, "_blank");
                }}
              >
                💬 Talk to an Expert
              </button>
            </div>

            {/* Stats */}
            <div
              className="hero-stats"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(20px)",
                transition: "all 1s cubic-bezier(0.22,1,0.36,1) 0.4s"
              }}
            >
              {[
                { num: "20+", label: "Premium Packages" },
                { num: "5", label: "Categories" },
                { num: "50+", label: "Destinations" },
              ].map((s) => (
                <div key={s.label} className="stat-pill">
                  <span className="stat-num">{s.num}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="scroll-hint">
            <span>Scroll</span>
            <div className="scroll-line" />
          </div>
        </section>

        {/* ── Packages Section ── */}
        <section className="body-section" id="packages-grid">
          {/* Filter Card */}
          <div
            className="filter-card"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(24px)",
              transition: "all 1s cubic-bezier(0.22,1,0.36,1) 0.1s"
            }}
          >
            <div className="filter-header">
              <div>
                <div className="sep" style={{ marginBottom: "0.5rem" }}>
                  <div className="sep-line" />
                  <div className="sep-diamond" />
                  <div className="sep-line rev" />
                </div>
                <h2 className="filter-title">Refine Your Journey</h2>
              </div>
              <span className="results-badge">
                ✦ {filteredPackages.length} packages found
              </span>
            </div>
            <ModernFilterSection
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPriceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedDuration={duration}
              setDuration={setDuration}
              filteredCount={filteredPackages.length}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Package Grid */}
          <PackageGridLayout
            packages={filteredPackages}
            onViewDetails={handleViewDetails}
            onGetQuery={handleGetQuery}
            isLoaded={isLoaded}
            selectedCategory={selectedCategory}
          />

          {/* CTA Banner */}
          {filteredPackages.length > 0 && (
            <div className="cta-banner">
              <div className="cta-banner-grid" />
              <div className="cta-content">
                <span className="cta-tag">✦ Bespoke Service</span>
                <h3 className="cta-title">Can't Find the Perfect Escape?</h3>
                <p className="cta-sub">
                  Our travel specialists will craft an itinerary tailored precisely to your vision,
                  budget, and travel style.
                </p>
                <div className="cta-btns">
                  <button className="btn-primary">📞 Contact Us</button>
                  <button className="btn-cta-outline">✨ Customize Trip</button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── Footer CTA ── */}
        <footer className="footer-cta">
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <span className="cta-tag" style={{ marginBottom: "1.25rem", display: "inline-block" }}>
              Limited Time Offers
            </span>
            <h3 className="footer-headline">Ready to Start Your Journey?</h3>
            <p className="footer-sub">
              Book now and unlock exclusive discounts on all packages
            </p>
            <button className="btn-footer">🚀 Explore All Packages</button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default TourPackages;