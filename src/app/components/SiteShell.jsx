// src/app/components/SiteShell.jsx
"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Header         from "./header/header";
import Footer         from "./common/Footer";
import VisitorTracker from "./tracking/VisitorTracker";
import WhatsAppFloat  from "./sections/WhatsAppFloat";

// ✅ Inner component uses the hook — wrapped in Suspense below
function ShellContent({ children }) {
  const path    = usePathname();
  const isAdmin = path?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <VisitorTracker />}

      {isAdmin ? (
        children
      ) : (
        <>
          <Header />
          <WhatsAppFloat />
          {children}
          <Footer />
        </>
      )}
    </>
  );
}

// ✅ Suspense boundary prevents blocking prerender
export default function SiteShell({ children }) {
  return (
    <Suspense fallback={null}>
      <ShellContent>{children}</ShellContent>
    </Suspense>
  );
}