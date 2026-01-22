import ServicePageClient from "./ServicePageClient";
import { generateSeoMetadata } from "@/lib/seo";

export const getInfo = generateSeoMetadata("servie");

export default function page() {
  return <ServicePageClient />;
}