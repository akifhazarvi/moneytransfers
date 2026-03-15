import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SendMoneyCompare — Compare International Money Transfers",
    short_name: "SendMoneyCompare",
    description:
      "Compare fees, exchange rates and delivery times from leading providers to find the cheapest way to send money internationally.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a73e8",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
