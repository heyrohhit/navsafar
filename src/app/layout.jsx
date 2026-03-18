// src/app/layout.jsx  — only change: SiteShell replaces direct Header/Footer
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLoaderWrapper from "./components/loading/ClientLoaderWrapper";
import SiteShell from "./components/SiteShell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: { default: "NavSafar | Travel, Tours & Services", template: "%s | NavSafar" },
  description: "Explore the best travel packages, domestic & international tours, hotels, flights, visa services and travel insurance with NavSafar.",
  keywords: ["travel packages","domestic tours","international tours","luxury travel","holiday packages","flight booking","hotel booking","visa services","travel agency india","tour operator india"],
  authors: [{ name: "NavSafar", url: "https://navsafar.com" }],
  creator: "NavSafar", publisher: "NavSafar",
  openGraph: {
    title: "NavSafar | Explore The World With Us",
    description: "Discover domestic & international travel packages, hotels, flights and curated holiday experiences with NavSafar.",
    url: "https://navsafar.com", siteName: "NavSafar",
    images: [{ url: "https://navsafar.com/assets/logo.jpeg", width: 1200, height: 630, alt: "NavSafar Travel" }],
    locale: "en_US", type: "website",
  },
  twitter: {
    card: "summary_large_image", title: "NavSafar | Travel & Holiday Packages",
    description: "Plan your dream vacation with NavSafar. Explore curated domestic and international travel packages.",
    images: ["https://navsafar.com/assets/logo.jpeg"], creator: "@navsafar",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://navsafar.com" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        <ClientLoaderWrapper>
          {/* SiteShell renders Header+Footer only for non-admin routes */}
          <SiteShell>
            {children}
          </SiteShell>
        </ClientLoaderWrapper>
      </body>
    </html>
  );
}