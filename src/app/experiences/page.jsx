// src/app/experiences/page.jsx
// ✅ SERVER COMPONENT
import ExperienceCategories from "./ExperienceCategories";

export const metadata = {
  title: "Travel Experiences | Domestic & International — NavSafar",
  description:
    "Explore travel experiences by category — International, Domestic, Family, Religious, Cultural, Adventure, Beach, Luxury, Wildlife, Romantic, Historical and Urban tours.",
  keywords: [
    "travel experiences india",
    "adventure tours india",
    "family travel packages",
    "beach holiday india",
    "luxury travel india",
    "religious tours india",
    "wildlife safari india",
    "honeymoon packages india",
  ],
  alternates: {
    canonical: "https://navsafar.com/experiences",
    languages: {
      "x-default": "https://navsafar.com/experiences",
      "en-IN": "https://navsafar.com/experiences",
      "en": "https://navsafar.com/experiences",
    },
  },
  openGraph: {
    title: "Travel Experiences | Domestic & International — NavSafar",
    description: "Explore travel experiences by category — find your perfect trip with NavSafar.",
    url: "https://navsafar.com/experiences",
    type: "website",
    siteName: "NavSafar Travel Solutions",
    locale: "en_IN",
    images: [{ url: "https://navsafar.com/assets/bg.jpg", width: 1200, height: 630, alt: "NavSafar Experiences" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Experiences | NavSafar",
    description: "Explore travel experiences by category — adventure, family, beach, luxury & more.",
    images: ["https://navsafar.com/assets/bg.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function ExperiencesPage() {
  return <ExperienceCategories />;
}
