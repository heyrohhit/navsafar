import BookingPageClient from "./BookingPageClient";
import { getStaticMetadata } from "../lib/seo";

export const getInfo = getStaticMetadata("booking");

export default function page() {
  return <BookingPageClient />;
}