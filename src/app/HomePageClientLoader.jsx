"use client";
import dynamic from "next/dynamic";

const HomePageClient = dynamic(() => import("./HomePageClient"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "60vh", background: "#fff" }} />,
});

export default function HomePageClientLoader() {
  return <HomePageClient />;
}
