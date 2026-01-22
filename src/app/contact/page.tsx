import ContactPageClient from "./ContactPageClient"
import { generateSeoMetadata } from "../../lib/seo";

export const metadata = generateSeoMetadata("contact");

export default function page() {
  return <ContactPageClient />;
}