// src/app/services/page.jsx
// ✅ SERVER COMPONENT — metadata yahan kaam karta hai
import ServicesClient from "./ServicesClient";

export const metadata = {
  title: "Travel Services | Domestic & International Tours - NavSafar",
  description:
    "Explore our travel services - Domestic tours, International tours, Religious tours, Adventure tours, Family packages, Custom tours.",
  alternates: {
    canonical: "https://www.navsafar.com/services",
  },
  openGraph: {
    title: "Travel Services | Domestic & International Tours - NavSafar",
    description: "Explore our comprehensive travel services.",
    url: "https://www.navsafar.com/services",
    type: "website",
  },
};

export default function ServicesPage() {
  return (
    <>
      {/* FAQPage JSON-LD for AEO/GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What travel services does NavSafar offer in India?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "NavSafar offers domestic and international tour packages, flight and hotel bookings, visa assistance, corporate travel management and MICE (Meetings, Incentives, Conferences and Exhibitions) services for clients across India.",
                },
              },
              {
                "@type": "Question",
                name: "Does NavSafar provide visa assistance for international trips?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, we help with visa documentation and applications for popular destinations like Dubai, Thailand, Singapore, Schengen countries and more, guiding you through the requirements step by step.",
                },
              },
              {
                "@type": "Question",
                name: "Can NavSafar handle corporate and MICE travel?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. We manage corporate offsites, incentive trips, conferences and exhibitions end to end — including flights, stays, transfers, venues and on-ground coordination.",
                },
              },
              {
                "@type": "Question",
                name: "Does NavSafar offer travel insurance?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We can guide you on suitable travel insurance options for domestic and international trips so you're covered for medical emergencies, cancellations and lost baggage. Ask our team for current plans.",
                },
              },
            ],
          }),
        }}
      />
      <ServicesClient />
    </>
  );
}