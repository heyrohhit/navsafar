// Private, per-user area (also proxy-gated behind auth) — never index it.
// Applies to /dashboard and /dashboard/profile.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return children;
}
