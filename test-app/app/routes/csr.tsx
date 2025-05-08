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
  // Since we cannot selectively disable SSR on a route, we can use a state variable to determine if the page has loaded. This is a workaround to simulate CSR.
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
