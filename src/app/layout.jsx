import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import FooterPage from "./pages/footer-page";
import { PremiumHeader } from "./components/premium-header";

import { Playfair_Display, Inter } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Navsafar Travel Solutions | Best Travel Agency in India",
    template: "%s | Navsafar Travel Solutions",
  },

  description:
    "Navsafar Travel Solutions is a professional travel agency in India offering customized tour packages, corporate travel, MICE services, hotel bookings, and complete domestic & international travel solutions.",

  keywords: [
    "Navsafar Travel Solutions",
    "travel agency in India",
    "best travel agency in Delhi",
    "tour and travel services",
    "corporate travel management",
    "MICE travel services",
    "domestic tour packages",
    "international tour packages",
    "holiday packages India",
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: "Navsafar Travel Solutions | Best Travel Agency in India",
    description:
      "Plan your perfect journey with Navsafar Travel Solutions. We provide expert travel planning, corporate travel, MICE, and customized tour packages across India and worldwide.",
    url: "https://navsafar.vercel.app",
    siteName: "Navsafar Travel Solutions",
    images: [
      {
        url: "https://navsafar.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Navsafar Travel Solutions",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Navsafar Travel Solutions | Best Travel Agency in India",
    description:
      "Trusted travel agency offering tour packages, corporate travel & MICE services in India and abroad.",
    images: ["https://navsafar.vercel.app/og-image.jpg"],
  },

  alternates: {
    canonical: "https://navsafar.vercel.app",
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-playfair ${geistSans.variable} ${geistMono.variable}`}>
         <PremiumHeader />
        {children}
        <FooterPage/>
      </body>
    </html>
  );
}
