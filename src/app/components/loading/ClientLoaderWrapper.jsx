"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import LoadingScreen from "./LoadingScreen";

export default function ClientLoaderWrapper({ children }) {

  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = "auto";
    }, 3000);

    return () => clearTimeout(timer);

  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return children;
}