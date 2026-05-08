/**
 * Shared helper for generating locale-aware alternates metadata.
 *
 * Ensures every page emits correct hreflang link tags:
 * - Self-referencing tag for current locale
 * - Return tags for all other locales
 * - x-default pointing to English version
 * - Canonical URL matching the current locale
 */

const SITE_URL = "https://sendmoneycompare.com";
// Non-English locales (es/fr/pt) were retired on 2026-04-27 — middleware
// returns 410 Gone for those prefixes. With no alternate language version
// being served, hreflang collapses to English-only.
const LOCALES = ["en"] as const;

/**
 * Generate alternates object for Next.js Metadata API.
 *
 * @param path - Page path without locale prefix (e.g. "guides/some-slug", "companies/wise", or "" for homepage)
 * @param locale - Current page locale
 * @returns Metadata alternates object with canonical + languages (hreflang)
 */
export function getAlternates(path: string, locale: string) {
  const cleanPath = path.replace(/^\/+/, "");
  const canonical =
    locale === "en"
      ? cleanPath
        ? `${SITE_URL}/${cleanPath}`
        : SITE_URL
      : cleanPath
        ? `${SITE_URL}/${locale}/${cleanPath}`
        : `${SITE_URL}/${locale}`;

  const languages: Record<string, string> = {
    "x-default": cleanPath ? `${SITE_URL}/${cleanPath}` : SITE_URL,
  };

  for (const loc of LOCALES) {
    languages[loc] =
      loc === "en"
        ? cleanPath
          ? `${SITE_URL}/${cleanPath}`
          : SITE_URL
        : cleanPath
          ? `${SITE_URL}/${loc}/${cleanPath}`
          : `${SITE_URL}/${loc}`;
  }

  return { canonical, languages };
}
