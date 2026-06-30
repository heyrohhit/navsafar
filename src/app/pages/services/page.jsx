// src/app/services/page.jsx
// ✅ SERVER COMPONENT — metadata yahan kaam karta hai
import ServicesClient from "./ServicesClient";

export const metadata = {
  title: "Travel Services | Domestic & International Tours - NavSafar",
  description:
    "Explore our travel services - Domestic tours, International tours, Religious tours, Adventure tours, Family packages, Custom tours.",
  alternates: {
    canonical: "https://navsafar.com/services",
  },
  openGraph: {
    title: "Travel Services | Domestic & International Tours - NavSafar",
    description: "Explore our comprehensive travel services.",
    url: "https://navsafar.com/services",
    type: "website",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}