
import { getStaticMetadata } from "../../lib/seo";
import Gallery from "./Gallery";

export const metadata = getStaticMetadata("gallery");

export default function page() {
  return <Gallery />;
}