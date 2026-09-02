/**
 * Shared helper for generating canonical metadata.
 *
 * The site is English-only — non-English locales (es/fr/pt) were retired on
 * 2026-04-27 and middleware returns 410 Gone for those prefixes. There is no
 * alternate language version, so hreflang has been dropped — a single-language
 * site does not need hreflang tags.
 */

const SITE_URL = "https://sendmoneycompare.com";

/**
 * Generate canonical URL for Next.js Metadata API.
 *
 * @param path - Page path (e.g. "guides/some-slug", "companies/wise", or "" for homepage)
 * @param _locale - Kept for call-site compatibility; ignored (site is EN-only)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getAlternates(path: string, _locale: string) {
  const cleanPath = path.replace(/^\/+/, "");
  const canonical = cleanPath ? `${SITE_URL}/${cleanPath}` : SITE_URL;
  return { canonical };
}

/**
 * Default social preview image: the root dynamic OG route.
 *
 * Next's file-based `opengraph-image` only reaches routes that do not define
 * their own `openGraph` object — a template that sets `openGraph: { title,
 * description, url }` replaces the inherited one and silently drops the image.
 * That left 264 pages with no og:image (2026-09-02 audit): the whole /iban,
 * /compare, /swift-codes, /exchange-rates, /travel, /cash-out, /business,
 * /banks and /tools families. Spread this into any openGraph object that does
 * not set a more specific image.
 */
export const DEFAULT_OG_IMAGES = [
  { url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 },
];
