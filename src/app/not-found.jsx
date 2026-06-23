// src/app/not-found.jsx
// ✅ TECHNICAL SEO: Custom 404 page
// - Returns proper 404 HTTP status (Next.js does this automatically)
// - Internal links for crawlability
// - No noindex needed — Next.js 404 is excluded from sitemap automatically
import Link from "next/link";

export const metadata = {
  title: "Page Not Found | NavSafar Travel",
  description: "The page you are looking for does not exist. Browse our tour packages, destinations and travel guides instead.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const quickLinks = [
    { label: "Home",           href: "/"               },
    { label: "Destinations",   href: "/destinations"   },
    { label: "Tour Packages",  href: "/tour-packages"  },
    { label: "Travel Blog",    href: "/blog"           },
    { label: "Contact Us",     href: "/pages/contact"  },
  ];

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center bg-white">
      <span className="text-8xl font-black text-[#0f6477] leading-none">404</span>
      <h1 className="mt-4 text-2xl font-bold text-gray-800">Page Not Found</h1>
      <p className="mt-3 text-gray-500 max-w-md">
        Oops! The page you are looking for may have been moved or doesn&apos;t exist.
        Let us help you find your perfect trip.
      </p>

      <nav aria-label="Helpful links" className="mt-10 flex flex-wrap gap-3 justify-center">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-5 py-2.5 rounded-xl border border-[#0f6477] text-[#0f6477] hover:bg-[#0f6477] hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link
        href="/"
        className="mt-8 px-8 py-3 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold rounded-xl transition-colors duration-200"
      >
        Go to Homepage
      </Link>
    </main>
  );
}
