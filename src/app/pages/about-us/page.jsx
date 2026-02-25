import About from "./About";
import { getStaticMetadata } from "../../lib/seo";

export const metadata = getStaticMetadata("about");

export default function page() {
  return <About />;
}