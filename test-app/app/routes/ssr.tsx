import { Basic } from "~/components/basic";
import type { Route } from "./+types/home";
import { ImageEvents } from "~/components/ImageClient";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function SSR() {
  return (
    <div className="container">
      <Basic />
      <h1>Advanced</h1>
      <ImageEvents />
    </div>
  )
}
