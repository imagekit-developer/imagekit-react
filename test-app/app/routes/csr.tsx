import { Basic } from "~/components/basic";
import type { Route } from "./+types/home";
import { ImageEvents } from "~/components/ImageClient";
import { useState, useEffect } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function CSR() {
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    setPageLoaded(true);
  }, []);

  if (!pageLoaded) {
    return <>
      Loading...
    </>
  }

  return (
    <div className="container">
      <Basic />
      <h1>Advanced</h1>
      <ImageEvents />
    </div>
  )
}
