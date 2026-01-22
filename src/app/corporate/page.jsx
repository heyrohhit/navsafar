import CorporatePageClient from "./CorporatePageClient";
import { generateSeoMetadata } from "@/lib/seo";

export async function getInfo() {
  return generateSeoMetadata("corporate");
}

export default function Page() {
  return <CorporatePageClient />;
}
