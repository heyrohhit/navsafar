// Utility page — keep out of the search index (client component, so noindex
// lives here in the server layout).
export const metadata = {
  robots: { index: false, follow: false },
};

export default function SignupLayout({ children }) {
  return children;
}
