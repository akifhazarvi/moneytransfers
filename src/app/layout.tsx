import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getLocale } from "next-intl/server";
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
      "Compare 35+ Money Transfer Services — Find the Cheapest Rate (2026)",
    template: "%s | SendMoneyCompare",
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

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://open.er-api.com" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
