import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MoneyTransfers — Compare International Money Transfers",
    short_name: "MoneyTransfers",
    description:
      "Compare 60+ money transfer services to find the best exchange rates and lowest fees for sending money abroad.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a73e8",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon",
      },
    ],
  };
}
