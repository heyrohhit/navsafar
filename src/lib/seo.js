const siteConfig = {
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

  about: {
    title: "About Us",
    description:
      "Learn more about Navsafar Travel Solutions, our mission, vision, and expertise in providing reliable travel services in India.",
    path: "/about",
  },

  services: {
    title: "Our Travel Services",
    description:
      "Explore our travel services including holiday packages, corporate travel management, MICE services, and hotel bookings.",
    path: "/services",
  },

  contact: {
    title: "Contact Us",
    description:
      "Get in touch with Navsafar Travel Solutions for travel inquiries, bookings, and customized tour packages.",
    path: "/contact",
  },
  corporate: {
  title: "Corporate Travel Management",
  description:
    "Professional corporate travel management and business travel solutions by Navsafar Travel Solutions.",
  path: "/corporate",
},
};

export function generateSeoMetadata(pageKey) {
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
