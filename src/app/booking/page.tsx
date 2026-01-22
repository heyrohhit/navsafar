import BookingPageClient from "./BookingPageClient";
import { generateSeoMetadata } from "../lib/seo";

export const metadata = generateSeoMetadata("home");

export default function page() {
  return <BookingPageClient />;
}