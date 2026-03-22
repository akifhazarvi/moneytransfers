import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, Instrument_Serif, Share_Tech_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-display",
  weight: "400",
});

const SITE_URL = "https://sendmoneycompare.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Compare 35+ Money Transfer Services — Find the Cheapest Rate (2026)",
    template: "%s | SendMoneyCompare",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const nonce = (await headers()).get("x-nonce") || "";

  return (
    <html lang={locale} className={`${inter.variable} ${instrumentSerif.variable} ${shareTechMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://open.er-api.com" />
        <link rel="preconnect" href="https://hatscripts.github.io" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
