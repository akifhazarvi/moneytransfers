"use client";

import { usePathname } from "next/navigation";

const ADSENSE_CLIENT = "ca-pub-4359442444470890";

// ADS ONLY ON SUBSTANTIVE CONTENT (allowlist, not blocklist).
//
// AdSense flagged the site "low value content" (Jun 2026): with Auto Ads on,
// adsbygoogle.js loaded site-wide — including the ~350 thin, template-driven
// pages (corridors, compare, iban, swift, banks). A reviewer landing on a
// sparse auto-generated page with ads = the textbook thin-content violation.
//
// Fix: load the ad script ONLY on our genuinely substantive editorial pages —
// the long-form /guides/* and /news/* articles (1,500+ words, original POV).
// Everywhere else (the programmatic surface, the homepage conversion path)
// stays ad-free, so the only pages a reviewer ever sees ads on are real,
// high-value content. Keeps the thin pages for SEO/affiliate, just ad-free.
const LOCALE_PREFIX = /^\/[a-z]{2}(?=\/|$)/;

// Substantive content sections that may carry ads. A page qualifies only if
// it's an ARTICLE within these (i.e. /guides/<slug>, not the /guides index).
const AD_ALLOWED_SECTIONS = ["/guides/", "/news/"];

function isAdAllowedRoute(pathname: string): boolean {
  const path = pathname.replace(LOCALE_PREFIX, "") || "/";
  return AD_ALLOWED_SECTIONS.some(
    (sec) => path.startsWith(sec) && path.length > sec.length,
  );
}

export default function AdSenseLoader() {
  const pathname = usePathname();

  if (!isAdAllowedRoute(pathname)) return null;

  // Native <script> rather than next/script's <Script>: the latter stamps a
  // `data-nscript` attribute that AdSense's loader rejects with a console
  // warning ("AdSense head tag doesn't support data-nscript attribute"). A
  // plain tag loads identically without the warning.
  return (
    <script
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}
