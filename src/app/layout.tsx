import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = "https://sendmoneycompare.com";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Compare Money Transfer Apps — Find the Cheapest Rate in 2026",
    template: "%s | SendMoneyCompare",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Affiliate-network domain verification. Each partner network drops a
  // verification meta to prove we own the domain. Add new entries here as
  // partners request them; remove if the partnership ends.
  verification: {
    other: {
      // Remitly via FlexOffers — requested by Ahsun 2026-05-12
      "fo-verify": "77fb4b4b-5063-4b40-be91-b0a44a65eb39",
      // Revolut via Impact — requested by Ahsun 2026-05-12
      "impact-site-verification": "da153f9e-905b-492c-bbbf-d06ad999817e",
    },
  },
  icons: {
    // Bing prefers the legacy 'shortcut icon' rel and is slower than Google
    // to refresh favicons for newer domains. Declaring 'shortcut icon' first
    // (mapped from icons.shortcut by Next.js Metadata API) gives Bing's
    // crawler the rel signal it grades highest. The numbered .ico is also
    // referenced explicitly so the favicon URL changes at deploy and
    // forces Bing to re-fetch instead of serving the cached generic globe.
    shortcut: ["/favicon.ico"],
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Single-locale site: hardcode lang="en". Calling next-intl's getLocale()
  // here reads the x-next-intl-locale request header, which opts the ENTIRE
  // app into dynamic rendering — every route built as ƒ (Dynamic) and served
  // Cache-Control: no-store. That was the real root cause of the May 2026
  // deindex (not the geo cookies). With one locale there is nothing to read.
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://widget.trustpilot.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://open.er-api.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://hatscripts.github.io" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
