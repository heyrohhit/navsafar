/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://navsafar.com",
  generateRobotsTxt: true, // Generate robots.txt
  // India-specific: prioritize Hindi/English content
  alternateRefs: [
    {
      href: "https://navsafar.com",
      hreflang: "en-IN",
    },
    {
      href: "https://navsafar.com",
      hreflang: "en",
    },
    // Add Hindi version later: { href: "https://navsafar.com/hi", hreflang: "hi-IN" }
  ],
  // Exclude admin routes
  exclude: ["/admin/**", "/api/**"],
  // Transform for better India SEO (add Indian city keywords)
  transform: async (config, path) => {
    // Add priorities based on page importance
    let priority = 0.5; // default
    let changefreq = "weekly";

    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    } else if (path.startsWith("/packages") || path.startsWith("/destinations")) {
      priority = 0.9;
      changefreq = "weekly";
    } else if (path.includes("/blog")) {
      priority = 0.7;
      changefreq = "weekly";
    } else {
      priority = 0.5;
      changefreq = "monthly";
    }

    return {
      loc: path,
      changefreq,
      priority,
      // Add custom images for important pages
      images: path === "/" ? [`/assets/bg.jpg`] : undefined,
    };
  },
};

export default config;
