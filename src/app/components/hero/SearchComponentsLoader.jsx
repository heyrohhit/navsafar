"use client";
import dynamic from "next/dynamic";

const SearchComponents = dynamic(() => import("./SearchComponents"), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: 80, background: "rgba(0,0,0,0.4)" }} />
  ),
});

export default function SearchComponentsLoader() {
  return <SearchComponents />;
}
