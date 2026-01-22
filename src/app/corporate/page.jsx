import CorporatePageClient from "./CorporatePageClient"
import { generateSeoMetadata } from "../lib/seo";

export const metadata = generateSeoMetadata("servie");

export default function page() {
  return <CorporatePageClient />;
}