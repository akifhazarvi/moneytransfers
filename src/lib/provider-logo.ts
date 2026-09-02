/**
 * Provider/bank logo resolution — the single place that decides whether a logo
 * file actually exists before we put it in an <img src>.
 *
 * WHY THIS EXISTS
 * 19 call sites used to build a logo path by convention:
 *     provider?.logo || `/logos/${slug}.png`
 * That works for the 16 hand-curated providers in providers.ts and breaks for
 * every OTHER slug, because most rows on corridor/bank pages come from the
 * scraped Wise-comparison feed, whose `providerSlug` values are slugified bank
 * names we never had artwork for ("bnp-paribas", "z-rcher-kantonalbank" from
 * "Zurcher Kantonalbank"). Next's image optimizer answers a missing source with
 * HTTP 400, so those rows shipped 48 broken image requests across 500+ pages —
 * and any new bank the scraper picks up would silently add more.
 *
 * KNOWN_LOGOS is generated from public/logos (regenerate with
 * `npm run check:assets -- --write`), so resolution is a lookup against files
 * that exist at build time instead of a guess. Unknown slugs get the neutral
 * placeholder, which is a real file and therefore never 400s.
 */

/** Every file in public/logos at last sync. Generated — do not hand-edit. */
export const KNOWN_LOGOS: readonly string[] = [
  "ace-money-transfer.svg",
  "anz.png",
  "auckland-savings-bank-nz.png",
  "bank-of-america.png",
  "bank-of-new-zealand-nz.png",
  "barclays.png",
  "bmo.png",
  "bnc.png",
  "boss-money.png",
  "chase.png",
  "commerzbank.png",
  "commonwealth-bank-of-australia.png",
  "commonwealth-bank.png",
  "currencies-direct.png",
  "currency-solutions.png",
  "currencyfair.png",
  "dahabshiil.png",
  "deutsche-bank.png",
  "fairfx.png",
  "gme-remit.png",
  "halifax.png",
  "halo-financial.png",
  "hsbc-hk.png",
  "hsbc-sg.png",
  "hsbc.png",
  "icici-bank.png",
  "instarem.svg",
  "kiwibank.png",
  "koho.png",
  "lemfi.png",
  "lloyds.png",
  "monese.png",
  "moneycorp.png",
  "moneygram.svg",
  "mukuru.png",
  "nab.png",
  "national-australia-bank.png",
  "nationwide.png",
  "natwest.png",
  "ocbc.png",
  "ofx.svg",
  "panda-remit.png",
  "paypal.svg",
  "paysend.png",
  "placeholder.png",
  "pnb-europe.png",
  "postfinance.png",
  "profee.png",
  "raiffeisen-ch.png",
  "rbc.png",
  "rbs.png",
  "regencyfx.png",
  "remit2any.png",
  "remitly.png",
  "revolut.svg",
  "ria.png",
  "santander-uk.png",
  "sbi-california.png",
  "sbi-remit.png",
  "sbi.png",
  "scotiabank.png",
  "sendmoneycompare-logo.png",
  "sendmoneycompare-logo.svg",
  "sendwave.png",
  "singx.png",
  "skrill.png",
  "skyremit.png",
  "starling-bank.png",
  "starling.png",
  "taptap-send.png",
  "td-bank.png",
  "torfx.svg",
  "transfergo.png",
  "united-overseas-bank.png",
  "unplex.svg",
  "uob.png",
  "wells-fargo.png",
  "western-union.svg",
  "westpac-nz.png",
  "westpac.png",
  "wise.svg",
  "worldremit.svg",
  "xe.svg",
  "xoom.svg",
  "zkb.png",
];

const LOGO_SET = new Set(KNOWN_LOGOS);

/**
 * Scraped slugs that mean the same institution as artwork we already ship.
 * Keys are `providerSlug` values seen in the wise-comparison feed.
 */
const LOGO_ALIASES: Record<string, string> = {
  "chase-us": "chase.png",
  "hsbc-singapore": "hsbc-sg.png",
  "hsbc-hong-kong": "hsbc-hk.png",
  "royal-bank-of-canada": "rbc.png",
  "ocbc-wing-hang-bank": "ocbc.png",
  "united-overseas-bank-singapore": "united-overseas-bank.png",
  "wells-fargo-expresssend": "wells-fargo.png",
  "z-rcher-kantonalbank": "zkb.png",
  "zurcher-kantonalbank": "zkb.png",
  "commonwealth-bank-australia": "commonwealth-bank.png",
  "national-australia-bank-nab": "national-australia-bank.png",
  "santander": "santander-uk.png",
  "westpac-australia": "westpac.png",
};

/**
 * Neutral chip used when we have no artwork — a real file, so never a 400.
 *
 * PNG rather than SVG on purpose: `dangerouslyAllowSVG` is off in
 * next.config.ts (correctly), so an SVG handed to next/image without
 * `unoptimized` is rejected with the same HTTP 400 this module exists to
 * prevent, and most of the 18 call sites don't set that prop.
 */
export const PLACEHOLDER_LOGO = "/logos/placeholder.png";

/** True when we ship artwork (or an alias) for this slug. */
export function hasProviderLogo(slug: string | undefined | null): boolean {
  if (!slug) return false;
  if (LOGO_ALIASES[slug]) return true;
  return LOGO_SET.has(`${slug}.png`) || LOGO_SET.has(`${slug}.svg`);
}

/**
 * Resolve a logo path for a provider/bank slug.
 *
 * `explicit` is the curated `logo` field from providers.ts and wins when set.
 * The return value always points at a file that exists, so callers can drop it
 * straight into <Image src>; use `hasProviderLogo` first if you would rather
 * render initials than a placeholder.
 */
export function providerLogo(slug: string | undefined | null, explicit?: string | null): string {
  if (explicit) return explicit;
  if (!slug) return PLACEHOLDER_LOGO;
  const alias = LOGO_ALIASES[slug];
  if (alias) return `/logos/${alias}`;
  if (LOGO_SET.has(`${slug}.svg`)) return `/logos/${slug}.svg`;
  if (LOGO_SET.has(`${slug}.png`)) return `/logos/${slug}.png`;
  return PLACEHOLDER_LOGO;
}
