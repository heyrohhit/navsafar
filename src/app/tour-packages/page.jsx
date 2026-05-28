// src/app/tour-packages/page.jsx
// ✅ SERVER COMPONENT — metadata yahan kaam karta hai
import TourPackagesClient from "./TourPackagesClient";

export const metadata = {
  title: "Tour Packages | Domestic & International - NavSafar",
  description:
    "Browse 50+ tour packages across domestic and international destinations. Best price guarantee, custom itineraries, flights, hotels included.",
  alternates: {
    canonical: "https://navsafar.com/tour-packages",
  },
  openGraph: {
    title: "Tour Packages | Domestic & International - NavSafar",
    description:
      "Browse 50+ tour packages across domestic and international destinations.",
    url: "https://navsafar.com/tour-packages",
    type: "website",
  },
};

// Metadata server component se export hoti hai, client component se NAHI.
// isliye page.jsx server component raha aur interactive logic alag file mein gaya.
export default function TourPackagesPage() {
  return <TourPackagesClient />;
}