import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
  localePrefix: "as-needed", // No /en/ prefix for default locale
  // Single-locale site: never write the NEXT_LOCALE cookie and never sniff
  // Accept-Language. Both make next-intl's middleware emit a Set-Cookie on
  // the response, which forces Next into dynamic rendering and serves
  // Cache-Control: no-store — the signal that contributed to the May 2026
  // deindex. With one locale there is nothing to detect or persist.
  localeCookie: false,
  localeDetection: false,
});
