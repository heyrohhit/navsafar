// src/app/components/SiteShell.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Renders Header + Footer only for non-admin routes.
// VisitorTracker fires on every page visit (including admin-excluded pages).
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import { usePathname } from "next/navigation";
import Header          from "./header/header";
import Footer          from "./common/Footer";
import VisitorTracker  from "./tracking/VisitorTracker";
import WhatsAppFloat from "./sections/WhatsAppFloat";

export default function SiteShell({ children }) {
  const path    = usePathname();
  const isAdmin = path?.startsWith("/admin");

  return (
    <>
      {/* Track every public page visit — exclude /admin */}
      {!isAdmin && <VisitorTracker />}

      {/* Header + Footer only for public pages */}
      {isAdmin ? (
        children
      ) : (
        <>
          <Header />
          <WhatsAppFloat/>
          {children}
          <Footer />
        </>
      )}
    </>
  );
}