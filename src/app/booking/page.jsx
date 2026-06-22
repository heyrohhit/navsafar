import BookingPageClient from "./BookingPageClient";

export const metadata = {
  title: "Book Your Trip | NavSafar Travel",
  description: "Book your dream trip with NavSafar Travel Solutions. Contact us for customised tour packages, flights, hotels, visa and complete travel solutions for Indian travellers.",
  keywords: [
    "book tour package india",
    "travel booking online",
    "book holiday package",
    "navsafar booking",
    "trip planning india",
  ],
  alternates: {
    canonical: "https://navsafar.com/booking",
    languages: {
      "x-default": "https://navsafar.com/booking",
      "en-IN": "https://navsafar.com/booking",
      "en": "https://navsafar.com/booking",
    },
  },
  openGraph: {
    title: "Book Your Trip | NavSafar Travel",
    description: "Book customised tour packages with NavSafar — best prices, expert planning for Indian travellers.",
    url: "https://navsafar.com/booking",
    type: "website",
    siteName: "NavSafar Travel Solutions",
    locale: "en_IN",
    images: [{ url: "https://navsafar.com/assets/bg.jpg", width: 1200, height: 630, alt: "NavSafar Book Trip" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Your Trip | NavSafar Travel",
    description: "Book customised tour packages with NavSafar.",
    images: ["https://navsafar.com/assets/bg.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function page() {
  return <BookingPageClient />;
}