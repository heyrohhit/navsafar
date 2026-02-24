import BookingPageClient from "./BookingPageClient";
import { generateSeoMetadata } from "../lib/seo";

export const getInfo = generateSeoMetadata("home");

export default function page() {
  return <BookingPageClient />;
}