import DestinationsSection from "./DestinationsDetailsShow";
import { getStaticMetadata } from "../lib/seo";

// Fully static metadata export — Next.js compatible
export const metadataget = getStaticMetadata("destinations");

export default function Page( {limit} ) {
  return <DestinationsSection limit={limit}/>;
}