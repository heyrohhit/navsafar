import Contact from "./Contact";
import { getStaticMetadata } from "../../lib/seo";

export const metadata = getStaticMetadata("contact");

export default function page() {
  return <Contact />;
}