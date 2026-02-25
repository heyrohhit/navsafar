import BookingPageClient from "./BookingPageClient";
import { generateSeoMetadata } from "../lib/seo";

export const getInfo = generateSeoMetadata("booking");

export default function page() {
  return <BookingPageClient />;
}