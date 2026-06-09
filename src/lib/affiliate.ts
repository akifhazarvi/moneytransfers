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
  instarem: "https://instarem.prf.hn/click/camref:1100l5Nn6Z",
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

function buildWiseDeepLink(params: AffiliateParams): string {
  const base = affiliateLinks.wise;

  const dest = new URL("https://wise.com/us/pricing/send-money");
  if (params.sourceCurrency) dest.searchParams.set("sourceCurrency", params.sourceCurrency);
  if (params.targetCurrency) dest.searchParams.set("targetCurrency", params.targetCurrency);
  if (params.sourceAmount) dest.searchParams.set("sourceAmount", String(params.sourceAmount));

  const withDest = `${base}/destination:${encodeURIComponent(dest.toString())}`;
  return appendClickref(withDest, params.clickref);
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
    return appendClickref(url, params?.clickref);
  }

  return appendClickref(url, params?.clickref);
}

export function getGoUrl(providerSlug: string, params?: AffiliateParams): string {
  const base = `/go/${providerSlug}`;
  const searchParams = new URLSearchParams();
  if (params?.sourceCurrency) searchParams.set("from", params.sourceCurrency);
  if (params?.targetCurrency) searchParams.set("to", params.targetCurrency);
  if (params?.sourceAmount) searchParams.set("amount", String(params.sourceAmount));
  if (params?.clickref) searchParams.set("src", params.clickref);
  const qs = searchParams.toString();
  return qs ? `${base}?${qs}` : base;
}
