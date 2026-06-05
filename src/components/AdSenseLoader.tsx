"use client";

import { usePathname } from "next/navigation";

const ADSENSE_CLIENT = "ca-pub-4359442444470890";

// Routes that must stay 100% ad-free. With AdSense Auto Ads enabled in the
// dashboard, Google injects ads on every page that loads adsbygoogle.js — so
// the only reliable way to keep a page ad-free is to NOT load the script there.
// usePathname() returns the raw path including any locale prefix, so we strip a
// leading /xx locale segment before matching the home route.
//
// Home page is deliberately excluded: it is the brand-defining first impression
// and hosts the comparison widget + Send buttons (the provider_clicked
// north-star conversion). An Auto-Ads anchor/in-content unit there would
// cannibalize affiliate clicks and cheapen the premium feel.
const LOCALE_PREFIX = /^\/[a-z]{2}(?=\/|$)/;

function isAdFreeRoute(pathname: string): boolean {
  const path = pathname.replace(LOCALE_PREFIX, "") || "/";
  // Home page: "" (after stripping the locale root) or "/"
  return path === "/" || path === "";
}

export default function AdSenseLoader() {
  const pathname = usePathname();

  if (isAdFreeRoute(pathname)) return null;

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
