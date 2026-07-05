// src/app/tour-packages/page.jsx
// ✅ SERVER COMPONENT — metadata yahan kaam karta hai
import SearchPackages from "./SearchPackages"

export const metadata = {
  title: "Search | NavSafar Travel",
  description: "Search tour packages, destinations, and travel experiences at NavSafar.",
  alternates: {
    canonical: "https://www.navsafar.com/search",
  },
  // On-site search results are low-value/duplicate-prone — keep them out of the index.
  robots: { index: false, follow: true },
};

// Metadata server component se export hoti hai, client component se NAHI.
// isliye page.jsx server component raha aur interactive logic alag file mein gaya.
export default function SearchPack() {
  return <SearchPackages />;
}