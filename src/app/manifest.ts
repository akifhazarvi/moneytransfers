import type { MetadataRoute } from "next";

/**
 * Web app manifest, served at /manifest.webmanifest (Next links it from every
 * page). It is the only manifest: a second copy in public/manifest.json was
 * declared in the root layout but never reached a page, because this
 * file-based one wins. Two manifests that disagree on name and icons is how
 * an install ends up with the wrong label.
 *
 * `id` is fixed so the installed app keeps its identity if start_url ever
 * changes. Shortcuts point at hub pages that always render; check:pwa asserts
 * every icon, screenshot and shortcut target exists before a build ships.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "SendMoneyCompare — Compare International Money Transfers",
    short_name: "SendMoney",
    description:
      "Compare fees, exchange rates and delivery times from leading providers to find the cheapest way to send money internationally.",
    lang: "en",
    dir: "ltr",
    start_url: "/send-money",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    // Match the sticky header's surface so the title/status bar blends into
    // it. Pages refine this per colour scheme with <meta name="theme-color">.
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    categories: ["finance", "utilities"],
    prefer_related_applications: false,
    launch_handler: { client_mode: "navigate-existing" },
    icons: [
      { src: "/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
    shortcuts: [
      {
        name: "Compare transfer providers",
        short_name: "Compare",
        url: "/send-money",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Exchange rates",
        short_name: "Rates",
        url: "/exchange-rates",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Currency converter",
        short_name: "Converter",
        url: "/currency-converter",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
    screenshots: [
      {
        src: "/pwa/screenshot-wide.jpg",
        sizes: "1280x720",
        type: "image/jpeg",
        form_factor: "wide",
        label: "Compare money transfer providers side by side",
      },
      {
        src: "/pwa/screenshot-narrow.jpg",
        sizes: "780x1688",
        type: "image/jpeg",
        form_factor: "narrow",
        label: "Compare money transfer providers on your phone",
      },
    ],
  };
}
