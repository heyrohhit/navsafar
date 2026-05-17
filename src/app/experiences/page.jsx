// src/app/experiences/page.jsx
import ExperienceCategories from "./ExperienceCategories";

export const metadata = {
  title: "Travel Experiences | Domestic & International - NavSafar",
  description: "Explore travel experiences by category - International, Domestic, Family, Religious, Cultural, Adventure, Beach, Luxury, Wildlife, Romantic, Historical, Urban tours.",
  alternates: {
    canonical: "https://navsafar.com/experiences",
  },
  openGraph: {
    title: "Travel Experiences | Domestic & International - NavSafar",
    description: "Explore travel experiences by category - find your perfect trip.",
    url: "https://navsafar.com/experiences",
    type: "website",
  },
};

export default function ExperiencesPage() {
  return <ExperienceCategories />;
}