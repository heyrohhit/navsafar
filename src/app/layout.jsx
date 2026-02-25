import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header/header";
import Footer from "./components/common/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Professional SEO Metadata
export const metadata = {
  title: "Navsafar | Travel, Tours & Services",
  description: "Explore the best travel packages, domestic & international tours, hotels, flights, and more with Your Company Name. Plan your perfect trip today!",
  keywords: [
    "travel packages",
    "domestic tours",
    "international tours",
    "hotels and resorts",
    "flights booking",
    "visa services",
    "travel insurance",
    "travel agency"
  ],
  authors: [{ name: "Your Company Name", url: "https://www.yourwebsite.com" }],
  creator: "Your Company Name",
  publisher: "Your Company Name",
  openGraph: {
    title: "Your Company Name | Travel, Tours & Services",
    description: "Explore the best travel packages, domestic & international tours, hotels, flights, and more with Your Company Name. Plan your perfect trip today!",
    url: "https://www.yourwebsite.com",
    siteName: "Your Company Name",
    images: [
      {
        url: "https://www.yourwebsite.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Your Company Name - Travel & Tours",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Company Name | Travel, Tours & Services",
    description: "Explore the best travel packages, domestic & international tours, hotels, flights, and more with Your Company Name.",
    images: ["https://www.yourwebsite.com/og-image.jpg"],
    site: "@YourTwitterHandle",
    creator: "@YourTwitterHandle",
  },
  robots: "index, follow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}