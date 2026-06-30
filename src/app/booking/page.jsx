import BookingPageClient from "./BookingPageClient";

export const metadata = {
  title: "Book Your Trip | NavSafar Travel",
  description: "Book your dream trip with NavSafar. Contact us for tour packages, flights, hotels, and complete travel solutions.",
  alternates: {
    canonical: "https://navsafar.com/booking",
  },
};

export default function page() {
  return <BookingPageClient />;
}