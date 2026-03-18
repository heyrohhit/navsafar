// src/app/components/SiteShell.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Wraps Header + Footer only for non-admin routes.
// Admin pages get a clean slate — no site header, no site footer.
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import { usePathname } from "next/navigation";
import Header from "./header/header";
import Footer from "./common/Footer";

export default function SiteShell({ children }) {
  const path     = usePathname();
  const isAdmin  = path?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}