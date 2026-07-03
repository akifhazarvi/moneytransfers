/**
 * Affiliate redirect tracking.
 *
 * Maps provider slugs to affiliate URLs. When a user clicks "Visit provider",
 * they go through /go/[provider] which logs the click and redirects.
 */

export interface AffiliateParams {
  sourceCurrency?: string;
  targetCurrency?: string;
  sourceAmount?: number;
  clickref?: string; // Partnerize sub-ID — appears as adref in the dashboard
  clickId?: string;  // Our smc_xxx click ID — appended as smc_click_id so providers can reconcile
  corridor?: string; // e.g. "USD-INR" — stamped as smc_corridor
  source?: string;   // originating surface — stamped as utm_content
}

// Extra tracking attributes we stamp on the outbound (non-Partnerize) URL so
// the PROVIDER can see, on their side, exactly what we sent them: which
// corridor, how much, from which surface, and a per-click id to reconcile
// against. `subid`/`aff_sub` are the near-universal sub-id param names most
// affiliate systems read; we set both plus our own `smc_*` namespace so nothing
// is lost regardless of how the provider's tracking is wired.
function appendTrackingAttrs(u: URL, clickId?: string): void {
  if (clickId) {
    if (!u.searchParams.has("smc_click_id")) u.searchParams.set("smc_click_id", clickId);
    // Common sub-id param names — harmless if the provider ignores them, and it
    // means our click id shows up in their reporting wherever they DO read one.
    if (!u.searchParams.has("subid")) u.searchParams.set("subid", clickId);
    if (!u.searchParams.has("aff_sub")) u.searchParams.set("aff_sub", clickId);
  }
}

const affiliateLinks: Record<string, string> = {
  // --- Core providers (hardcoded in providers.ts) ---
  wise: "https://wise.prf.hn/click/camref:1011l5EGnY",
  remitly: "https://remitly.com/?ref=sendmoneycompare",
  ofx: "https://ofx.com/?ref=sendmoneycompare",
  xe: "https://xe.com/?ref=sendmoneycompare",
  "western-union": "https://westernunion.com/?ref=sendmoneycompare",
  worldremit: "https://worldremit.com/?ref=sendmoneycompare",
  revolut: "https://revolut.com/?ref=sendmoneycompare",
  paypal: "https://paypal.com/?ref=sendmoneycompare",
  moneygram: "https://moneygram.com/?ref=sendmoneycompare",
  xoom: "https://xoom.com/?ref=sendmoneycompare",
  torfx: "https://torfx.com/?ref=sendmoneycompare",
  instarem: "https://instarem.prf.hn/click/camref:1100l5Nn6Z/[p_id:1011l637599]",
  unplex: "https://unplex.money/?ref=sendmoneycompare&utm_source=sendmoneycompare",
  "taptap-send": "https://taptapsend.com/?ref=sendmoneycompare",
  "ace-money-transfer": "https://acemoneytransfer.com/?ref=sendmoneycompare",
  currencyfair: "https://currencyfair.com/?ref=sendmoneycompare",
  skrill: "https://skrill.com/?ref=sendmoneycompare",
  "currencies-direct": "https://currenciesdirect.com/?ref=sendmoneycompare",
  monese: "https://monese.com/?ref=sendmoneycompare",
  chase: "https://chase.com/personal/international-transfers",
  "bank-of-america": "https://bankofamerica.com/foreign-exchange/",
  "wells-fargo": "https://wellsfargo.com/international-remittances/",
  hsbc: "https://hsbc.com/ways-to-bank/international-transfers",
  barclays: "https://barclays.co.uk/ways-to-bank/international-payments/",
  lloyds: "https://lloydsbank.com/international-payments.html",
  nationwide: "https://nationwide.co.uk/current-accounts/international-payments/",
  "commonwealth-bank": "https://commbank.com.au/international-transfers",
  anz: "https://anz.com.au/ways-to-bank/international-money-transfers/",
  westpac: "https://westpac.com.au/personal-banking/international-transfers/",
  santander: "https://santander.co.uk/ways-to-bank/international-payments/",
  natwest: "https://natwest.com/international-payments.html",
  "td-bank": "https://td.com/us/en/personal-banking/international-transfers/",

  // --- Aggregator slug aliases (same provider, different slug across sources) ---
  "revolut-money-transfer": "https://revolut.com/?ref=sendmoneycompare",
  "chase-bank": "https://chase.com/personal/international-transfers",
  taptapsend: "https://taptapsend.com/?ref=sendmoneycompare",
  "xe-money-transfer": "https://xe.com/?ref=sendmoneycompare",
  "xe-money-transfer-fx": "https://xe.com/?ref=sendmoneycompare",
  rbs: "https://rbs.co.uk/international-payments.html",
  "the-royal-bank-of-scotland": "https://rbs.co.uk/international-payments.html",
  uob: "https://uob.com.sg/personal/save/international-transfers.page",

  // --- Aggregator-only fintechs ---
  ria: "https://riamoneytransfer.com/?ref=sendmoneycompare",
  sendwave: "https://sendwave.com/?ref=sendmoneycompare",
  transfergo: "https://transfergo.com/?ref=sendmoneycompare",
  paysend: "https://paysend.com/?ref=sendmoneycompare",
  moneycorp: "https://moneycorp.com/?ref=sendmoneycompare",
  "panda-remit": "https://pandaremit.com/?ref=sendmoneycompare",
  singx: "https://singx.co/?ref=sendmoneycompare",
  profee: "https://profee.com/?ref=sendmoneycompare",
  mukuru: "https://mukuru.com/?ref=sendmoneycompare",
  dahabshiil: "https://dahabshiil.com/?ref=sendmoneycompare",
  "boss-money": "https://bossmoney.com/?ref=sendmoneycompare",
  koho: "https://koho.ca/?ref=sendmoneycompare",
  fairfx: "https://fairfx.com/?ref=sendmoneycompare",
  regencyfx: "https://www.regencyfx.com/partner/sendmoneycompare",
  "pnb-europe": "https://pnbeuropebank.com/?ref=sendmoneycompare",
  starling: "https://starlingbank.com/?ref=sendmoneycompare",
  halifax: "https://halifax.co.uk/?ref=sendmoneycompare",
  "remit2any": "https://remit2any.com/?ref=sendmoneycompare",

  // --- Aggregator-only banks ---
  scotiabank: "https://scotiabank.com/international-money-transfer",
  bmo: "https://bmo.com/main/personal/bank-accounts/international-money-transfer/",
  rbc: "https://rbcroyalbank.com/international-money-transfer/",
  bnc: "https://bnc.ca/en/personal/international-money-transfer",
  "icici-bank": "https://icicibank.com/money-transfer",
  "state-bank-of-india": "https://sbi.co.in/web/nri/money-transfer",
  "sbi-remit": "https://sbiremit.com/?ref=sendmoneycompare",
  "sbi-california": "https://sbical.com/?ref=sendmoneycompare",
  ocbc: "https://ocbc.com/personal-banking/international-transfers.page",
  "united-overseas-bank": "https://uob.com.sg/personal/save/international-transfers.page",
  "deutsche-bank": "https://deutsche-bank.de/international-transfers",
  commerzbank: "https://commerzbank.de/international-transfers",
  nab: "https://nab.com.au/personal/international-transfers",
  kiwibank: "https://kiwibank.co.nz/personal-banking/international-transfers/",
  "auckland-savings-bank-nz": "https://asb.co.nz/international-transfers",
  "bank-of-new-zealand-nz": "https://bnz.co.nz/personal-banking/international-transfers",
  postfinance: "https://postfinance.ch/en/private/products/international-payments.html",
  "raiffeisen-ch": "https://raiffeisen.ch/international-payments",
  zkb: "https://zkb.ch/en/private/international-payments",
  "hsbc-hk": "https://hsbc.com.hk/international-transfers/",
  "hsbc-sg": "https://hsbc.com.sg/international-transfers/",
};

// UTM params appended to every destination URL so the provider's own
// analytics (GA4, etc.) correctly attributes traffic to sendmoneycompare.com
// even when noreferrer strips the Referer header.
const UTM_PARAMS = {
  utm_source: "sendmoneycompare",
  utm_medium: "referral",
  utm_campaign: "comparison",
} as const;

function appendUtms(url: string, clickId?: string, extra?: { corridor?: string; amount?: number; source?: string; from?: string; to?: string }): string {
  // Partnerize deep-link URLs are structured as path segments — don't mangle them.
  // UTMs go on the inner destination URL (built by buildWiseDeepLink / buildInstaremDeepLink),
  // not the prf.hn wrapper.
  if (url.includes("prf.hn")) return url;
  const u = new URL(url);
  for (const [k, v] of Object.entries(UTM_PARAMS)) {
    if (!u.searchParams.has(k)) u.searchParams.set(k, v);
  }
  // utm_content carries the source surface (which page/button sent them) so it
  // shows up in the provider's own GA without needing a custom param.
  if (extra?.source && !u.searchParams.has("utm_content")) {
    u.searchParams.set("utm_content", extra.source);
  }
  // Extra attributes so the provider sees the full context of what we sent —
  // corridor both combined (smc_corridor) and split (smc_from/smc_to) so it's
  // readable however the provider's system parses it, plus the amount.
  if (extra?.corridor && !u.searchParams.has("smc_corridor")) {
    u.searchParams.set("smc_corridor", extra.corridor);
  }
  if (extra?.from && !u.searchParams.has("smc_from")) {
    u.searchParams.set("smc_from", extra.from.toUpperCase());
  }
  if (extra?.to && !u.searchParams.has("smc_to")) {
    u.searchParams.set("smc_to", extra.to.toUpperCase());
  }
  if (extra?.amount && !u.searchParams.has("smc_amount")) {
    u.searchParams.set("smc_amount", String(extra.amount));
  }
  appendTrackingAttrs(u, clickId);
  return u.toString();
}

function appendClickref(url: string, clickref: string | undefined): string {
  if (!clickref) return url;
  // Partnerize links use path-style params: /clickref:VALUE
  if (url.includes("prf.hn")) {
    return `${url}/clickref:${encodeURIComponent(clickref)}`;
  }
  // All other links: append as query param
  const u = new URL(url);
  u.searchParams.set("clickref", clickref);
  return u.toString();
}

// Map a source currency to the ISO-3166 alpha-2 country code Instarem expects
// in `country_code` (the sending country). Covers Instarem's supported send
// markets; unknown currencies omit the param and let Instarem geo-default.
const SEND_CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: "US",
  GBP: "GB",
  EUR: "DE", // Instarem's primary EUR send market
  AUD: "AU",
  CAD: "CA",
  SGD: "SG",
  HKD: "HK",
  MYR: "MY",
  JPY: "JP",
  NZD: "NZ",
  CHF: "CH",
};

// Instarem's calculator reads source/destination currency, amount and the
// sending country from query params, pre-filling the quote on landing.
// Wrapped in Partnerize's `/destination:` segment like the Wise deep link.
function buildInstaremDeepLink(params: AffiliateParams): string {
  const base = affiliateLinks.instarem;

  const dest = new URL("https://www.instarem.com/en-us/");
  if (params.sourceCurrency) {
    const src = params.sourceCurrency.toUpperCase();
    dest.searchParams.set("source_currency", src);
    const country = SEND_CURRENCY_TO_COUNTRY[src];
    if (country) dest.searchParams.set("country_code", country);
  }
  if (params.targetCurrency) {
    dest.searchParams.set("destination_currency", params.targetCurrency.toUpperCase());
  }
  if (params.sourceAmount) {
    dest.searchParams.set("source_amount", String(params.sourceAmount));
  }
  // UTMs + click ID on the inner destination URL (prf.hn wrapper is left untouched)
  for (const [k, v] of Object.entries(UTM_PARAMS)) {
    if (!dest.searchParams.has(k)) dest.searchParams.set(k, v);
  }
  if (params.clickId) dest.searchParams.set("smc_click_id", params.clickId);

  const withDest = `${base}/destination:${encodeURIComponent(dest.toString())}`;
  return appendClickref(withDest, params.clickref);
}

function buildWiseDeepLink(params: AffiliateParams): string {
  const base = affiliateLinks.wise;

  const dest = new URL("https://wise.com/us/pricing/send-money");
  if (params.sourceCurrency) dest.searchParams.set("sourceCurrency", params.sourceCurrency);
  if (params.targetCurrency) dest.searchParams.set("targetCurrency", params.targetCurrency);
  if (params.sourceAmount) dest.searchParams.set("sourceAmount", String(params.sourceAmount));
  // UTMs + click ID on the inner destination URL (prf.hn wrapper is left untouched)
  for (const [k, v] of Object.entries(UTM_PARAMS)) {
    if (!dest.searchParams.has(k)) dest.searchParams.set(k, v);
  }
  if (params.clickId) dest.searchParams.set("smc_click_id", params.clickId);

  const withDest = `${base}/destination:${encodeURIComponent(dest.toString())}`;
  return appendClickref(withDest, params.clickref);
}

/**
 * A provider slug is valid for redirect IFF it's a non-empty, well-formed
 * slug. We deliberately do NOT require it to exist in `affiliateLinks`: many
 * legitimate slugs (e.g. `lemfi`, `sbi`) have no dedicated affiliate URL yet
 * and fall back to a generic destination — those are real clicks and must
 * still redirect. The ONLY thing this rejects is the bare/garbage path (e.g.
 * a crawler hitting `/go/` with no slug), which otherwise fires an
 * affiliate_redirect GA event with provider="" and pollutes the report.
 */
export function isValidProviderSlug(providerSlug: string): boolean {
  return /^[a-z0-9][a-z0-9-]*$/.test(providerSlug);
}

export function getAffiliateUrl(
  providerSlug: string,
  params?: AffiliateParams,
  fallbackUrl?: string,
): string {
  const url = affiliateLinks[providerSlug] || fallbackUrl;
  if (!url) {
    return "https://sendmoneycompare.com/send-money";
  }

  if (providerSlug === "wise") {
    if (params?.sourceCurrency || params?.targetCurrency) {
      return buildWiseDeepLink(params ?? {});
    }
    return appendClickref(appendUtms(url, params?.clickId, { corridor: params?.corridor, amount: params?.sourceAmount, source: params?.source, from: params?.sourceCurrency, to: params?.targetCurrency }), params?.clickref);
  }

  if (providerSlug === "instarem") {
    if (params?.sourceCurrency || params?.targetCurrency) {
      return buildInstaremDeepLink(params ?? {});
    }
    return appendClickref(appendUtms(url, params?.clickId, { corridor: params?.corridor, amount: params?.sourceAmount, source: params?.source, from: params?.sourceCurrency, to: params?.targetCurrency }), params?.clickref);
  }

  return appendClickref(appendUtms(url, params?.clickId, { corridor: params?.corridor, amount: params?.sourceAmount, source: params?.source, from: params?.sourceCurrency, to: params?.targetCurrency }), params?.clickref);
}

export function getGoUrl(providerSlug: string, params?: AffiliateParams): string {
  // Guard against empty/malformed slugs (e.g. a quote with no providerSlug,
  // see unified-quotes.ts fallback to ""). Rendering `/go/` with no slug
  // produces a live button that, when clicked, fires affiliate_redirect with
  // provider="" — polluting the provider report. Returning the generic
  // send-money page keeps the link working without emitting a junk redirect.
  if (!isValidProviderSlug(providerSlug)) {
    return "/send-money";
  }
  const base = `/go/${providerSlug}`;
  const searchParams = new URLSearchParams();
  if (params?.sourceCurrency) searchParams.set("from", params.sourceCurrency);
  if (params?.targetCurrency) searchParams.set("to", params.targetCurrency);
  if (params?.sourceAmount) searchParams.set("amount", String(params.sourceAmount));
  if (params?.clickref) searchParams.set("src", params.clickref);
  const qs = searchParams.toString();
  return qs ? `${base}?${qs}` : base;
}
