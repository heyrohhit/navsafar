/**
 * FILE: src/app/destinations/page.jsx
 *
 * Server Component wrapper — NO "use client", NO metadata here.
 * Metadata is handled by destinations/layout.jsx
 * UI is handled by DestinationsDetailsShow.jsx (Client Component)
 */

import DestinationsDetailsShow from "./DestinationsDetailsShow";

export default function DestinationsPage() {
  return <DestinationsDetailsShow />;
}