import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import "./conversion.css";
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

// Display serif — the Wealthsimple-style confident headline face. Loaded
// globally (single 400 weight, ~small woff2) so `--font-display` headings are
// consistent on every route, not just /exchange-rates. Falls back to Georgia.
//
// preload:false — the homepage LCP is the sans <h1> (Inter), and the serif is
// never above the fold there, yet next/font preloads every declared face by
// default. That second high-priority font preload competed with the LCP-critical
// Inter woff2 and the render-blocking CSS, inflating the hero title's render
// delay (~3 s in PageSpeed). With preload off the serif still loads on demand via
// @font-face, and display:swap paints the metric-matched Georgia fallback first
// on the few routes where it is above the fold — so no LCP is delayed, only a
// brief, shift-free swap remains.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-instrument-serif",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const SITE_URL = "https://sendmoneycompare.com";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  // Colours the browser UI and, once installed, the app's title/status bar.
  // Matches --color-surface in each scheme so it blends into the sticky
  // header; ThemeProvider rewrites it when the visitor toggles the theme.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0C0E" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // No `template` here. It appended " | SendMoneyCompare" (19 chars) to every
  // child page title, which pushed 82 indexable pages past Bing's ~85-char
  // limit — reported as "Title too long", High severity, 79 pages. On a title
  // that long the SERP truncates before the brand is ever shown, so the suffix
  // cost length without being seen, and the truncation cut the informative tail
  // instead. Bing CTR has halved over the same period (1.41% in June to 0.72% in
  // August) while impressions rose, which is the shape you get when titles rank
  // but read badly. Pages that want the brand can add it themselves; `default`
  // below still carries it for the homepage.
  title: {
    default:
      "Compare Money Transfer Apps — Find the Cheapest Rate in 2026",
    // Identity template: child titles pass through untouched. Next requires a
    // `template` whenever `default` is used, so "%s" is how you opt out.
    template: "%s",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Third-party domain verification. Each network drops a verification meta to
  // prove we own the domain. Add new entries here as partners request them;
  // remove if the partnership ends.
  verification: {
    other: {
      // Remitly via FlexOffers — requested by Ahsun 2026-05-12
      "fo-verify": "77fb4b4b-5063-4b40-be91-b0a44a65eb39",
      // Impact — one tag per Impact account; an array renders one meta each.
      // da153f9e: Revolut, requested by Ahsun 2026-05-12. 2276c799: added 2026-10-03.
      "impact-site-verification": [
        "da153f9e-905b-492c-bbbf-d06ad999817e",
        "2276c799-86ca-46e3-b42c-95f3654f39c0",
      ],
      // AdSense site verification. Google's snippet check crawls the homepage,
      // but AdSenseLoader deliberately loads adsbygoogle.js ONLY on /guides/*
      // and /news/* articles (thin-content allowlist), so the crawler finds no
      // ad code and verification fails. This meta verifies on every page
      // WITHOUT loading the ad script, so the allowlist stays intact.
      // Must match ADSENSE_CLIENT in components/AdSenseLoader.tsx.
      "google-adsense-account": "ca-pub-4359442444470890",
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
  // The manifest is src/app/manifest.ts, which Next links on its own. The
  // `manifest: "/manifest.json"` that stood here never rendered (the
  // file-based one wins) and pointed at a second, divergent copy.
  applicationName: "SendMoneyCompare",
  // iOS reads these when a visitor adds the site to the Home Screen: open it
  // full-screen, label it "SendMoney", and keep the status bar opaque so the
  // sticky header is not drawn underneath it.
  appleWebApp: {
    capable: true,
    title: "SendMoney",
    statusBarStyle: "default",
  },
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
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
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
