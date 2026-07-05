// Utility page — keep out of the search index (it's a client component, so the
// noindex directive lives in this server layout instead of the page's metadata).
export const metadata = {
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }) {
  return children;
}
