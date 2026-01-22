import ContactPageClient from "./ContactPageClient"
import { generateSeoMetadata } from "@/lib/seo";

export const getinfo = generateSeoMetadata("contact");

export default function page() {
  return <ContactPageClient />;
}