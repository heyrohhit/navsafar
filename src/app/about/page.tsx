// app/about/page.js

import AboutPageClient from "./AboutPageClient";
import { generateSeoMetadata } from "../../lib/seo";

export const metadata = generateSeoMetadata("about");

export default function AboutPage() {
  return <AboutPageClient />;
}

