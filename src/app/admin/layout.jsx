// src/app/admin/layout.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin section gets its own bare layout — no site Header, no Footer.
// Search engines are blocked via robots meta.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata = {
  title:  "NavSafar Admin Panel",
  robots: { index: false, follow: false }, // hide from Google
};

export default function AdminLayout({ children }) {
  return (
    // Renders directly inside <body> — no Header / Footer wrappers
    <div suppressHydrationWarning>
      {children}
    </div>
  );
}