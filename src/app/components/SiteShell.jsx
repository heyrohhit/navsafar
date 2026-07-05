// src/app/components/SiteShell.jsx
"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Header      from "./header/header";
import Footer      from "./common/Footer";
import WhatsAppFloat from "./sections/WhatsAppFloat";

// ✅ VisitorTracker lazy load — FCP pe load nahi padega
const VisitorTracker = dynamic(() => import("./tracking/VisitorTracker"), {
  ssr: false,
});

// Chrome (header/footer/tracking) uses usePathname to hide itself on /admin.
// CRITICAL: this component must NOT wrap `children`. usePathname makes it bail to
// client-side rendering during static/ISR prerender; if `children` were nested
// inside, the page would bail too and its notFound()/redirect() would degrade to
// a soft-404 / client redirect (HTTP 200) instead of a real 404/301. Keeping the
// chrome and the page as siblings isolates the bail to the chrome only.
function Chrome({ slot }) {
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;

  if (slot === "top")    return (<><VisitorTracker /><Header /><WhatsAppFloat /></>);
  if (slot === "bottom") return <Footer />;
  return null;
}

export default function SiteShell({ children }) {
  return (
    <>
      {/* Chrome bails to CSR (usePathname) inside its own Suspense … */}
      <Suspense fallback={null}>
        <Chrome slot="top" />
      </Suspense>

      {/* … but the page renders server-side, so 404/301 status codes work. */}
      {children}

      <Suspense fallback={null}>
        <Chrome slot="bottom" />
      </Suspense>
    </>
  );
}
