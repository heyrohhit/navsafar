export const dynamic = "force-dynamic";

/**
 * FILE: src/app/destinations/page.jsx
 *
 * Server Component wrapper — NO "use client", NO metadata here.
 * Metadata is handled by destinations/layout.jsx
 * UI is handled by DestinationsDetailsShow.jsx (Client Component)
 */

import DestinationsDetailsShow from "./DestinationsDetailsShow";
import UniversalSchemaInjector from "../components/seo/UniversalSchemaInjector";
import { getPackagesAsync } from "../../lib/getPackages";

export default async function DestinationsPage() {
  const packages = await getPackagesAsync();
  // Deduplicate by city for ItemList
  const seen = new Set();
  const destinations = packages.filter((p) => {
    if (seen.has(p.city)) return false;
    seen.add(p.city);
    return true;
  });

  return (
    <>
      <UniversalSchemaInjector
        type="itemList"
        items={destinations}
        pageUrl="https://navsafar.com/destinations"
        listName="Travel Destinations — NavSafar"
      />
      <DestinationsDetailsShow />
    </>
  );
}