// libs/seo.js
export const siteConfig = {
  name: "Navsafar Travel Solutions",
  url: "https://navsafar.vercel.app",
};

export const seoData = {
  home: {
    title: "Best Travel Agency in India",
    description:
      "Navsafar Travel Solutions offers customized tour packages, corporate travel, MICE services, and complete domestic & international travel solutions.",
    path: "/",
  },
  destinations: {
    title: "Top Destinations in India & Abroad | Navsafar Travel",
    description:
      "Explore the most popular domestic and international destinations with Navsafar Travel Solutions. Customized tours, hotels, and complete travel planning available.",
    path: "/destinations",
  },
  tourPackages: {
    title: "Tour Packages - Domestic & International | Navsafar",
    description:
      "Discover our exclusive tour packages for domestic and international travel. Get fully customized itineraries and bookings with Navsafar Travel Solutions.",
    path: "/tour-packages",
  },
  corporate: {
    title: "Corporate Travel Management | Navsafar Travel",
    description:
      "Professional corporate travel management and business travel solutions by Navsafar Travel Solutions. Efficient travel planning for your business.",
    path: "/corporate",
  },
  services: {
    title: "Our Travel Services | Navsafar Travel Solutions",
    description:
      "Explore our travel services including holiday packages, corporate travel management, MICE services, hotel bookings, and flights.",
    path: "/services",
  },
  about: {
    title: "About Us | Navsafar Travel Solutions",
    description:
      "Learn more about Navsafar Travel Solutions, our mission, vision, and expertise in providing reliable travel services in India.",
    path: "/about",
  },
  contact: {
    title: "Contact Us | Navsafar Travel Solutions",
    description:
      "Get in touch with Navsafar Travel Solutions for travel inquiries, bookings, and customized tour packages.",
    path: "/contact",
  },
  blog: {
    title: "Travel Blog | Navsafar Travel",
    description:
      "Read our travel blog for tips, destination guides, and travel inspiration from Navsafar Travel Solutions.",
    path: "/blog",
  },
};

export function getStaticMetadata(pageKey) {
  const page = seoData[pageKey];
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `${siteConfig.url}${page.path}`,
    },
    openGraph: {
      title: `${page.title} | ${siteConfig.name}`,
      description: page.description,
      url: `${siteConfig.url}${page.path}`,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | ${siteConfig.name}`,
      description: page.description,
    },
  };
}