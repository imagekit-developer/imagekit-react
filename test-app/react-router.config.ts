import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  ssr: true, // Since we cannot disable ssr on selected pages, setting it to false here and using prerender for one path specifically
  prerender: ["/ssr"], // This will essentially prerender and hamari ssr ki testing ho jayegi
} satisfies Config;
