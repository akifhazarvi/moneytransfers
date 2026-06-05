import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AdSenseLoader from "@/components/AdSenseLoader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  // Text must paint immediately on the metric-matched system fallback rather
  // than wait on the 84 KB Inter woff2, which Lighthouse showed at the END of
  // a 741 ms critical chain (delaying LCP/FCP on Slow 4G). adjustFontFallback
  // (on by default) size-adjusts the fallback so the swap is near-invisible.
  // (Inter is a variable font — omitting `weight` loads one woff2 covering all
  // weights, which is smaller than pinning multiple static instances.)
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
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
        {/* Only GTM is on the critical path (loads in the initial document).
            Trustpilot's widget and the er-api forex fetch both fire after
            hydration from useEffect, so preconnecting to them wastes a
            connection slot and can delay genuinely critical requests
            (Lighthouse flags them as "unused preconnect"). dns-prefetch is
            the cheap hint that still warms DNS for those later requests. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://widget.trustpilot.com" />
        <link rel="dns-prefetch" href="https://open.er-api.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://hatscripts.github.io" />
      </head>
      <body className="antialiased">
        {/* AdSense loader — rendered on every page EXCEPT the home route, so
            Auto Ads never run on the brand-defining homepage / comparison
            widget. See AdSenseLoader.tsx for the route gate. */}
        <AdSenseLoader />
        {children}
      </body>
    </html>
  );
}
