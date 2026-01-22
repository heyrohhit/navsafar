import CorporatePageClient from "./CorporatePageClient"
import { generateSeoMetadata } from "../../lib/seo";

export const metadata = generateSeoMetadata("services");

export default function page() {
  return <CorporatePageClient />;
}