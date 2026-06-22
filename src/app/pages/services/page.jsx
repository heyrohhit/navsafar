// src/app/services/page.jsx
// ✅ SERVER COMPONENT — metadata yahan kaam karta hai
import ServicesClient from "./ServicesClient";

export const metadata = {
  title: "Travel Services | Domestic & International Tours — NavSafar",
  description:
    "Explore NavSafar's travel services — domestic tours, international tours, religious tours, adventure tours, family packages, honeymoon packages and custom itineraries.",
  keywords: [
    "travel services india",
    "domestic tour packages",
    "international tour packages",
    "religious tours india",
    "adventure travel india",
    "family holiday packages",
    "corporate travel services",
    "visa assistance india",
  ],
  alternates: {
    canonical: "https://navsafar.com/pages/services",
    languages: {
      "x-default": "https://navsafar.com/pages/services",
      "en-IN": "https://navsafar.com/pages/services",
      "en": "https://navsafar.com/pages/services",
    },
  },
  openGraph: {
    title: "Travel Services | Domestic & International Tours — NavSafar",
    description: "Explore NavSafar's comprehensive travel services for Indian travellers.",
    url: "https://navsafar.com/pages/services",
    type: "website",
    siteName: "NavSafar Travel Solutions",
    locale: "en_IN",
    images: [{ url: "https://navsafar.com/assets/bg.jpg", width: 1200, height: 630, alt: "NavSafar Travel Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Services | NavSafar",
    description: "Domestic & international tours, flights, hotels, visa services and more.",
    images: ["https://navsafar.com/assets/bg.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function ServicesPage() {
  return <ServicesClient />;
}