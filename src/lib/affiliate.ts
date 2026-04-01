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
}

const affiliateLinks: Record<string, string> = {
  wise: "https://wise.prf.hn/click/camref:1011l5EGnY",
  remitly: "https://remitly.com/?ref=moneytransfers",
  ofx: "https://ofx.com/?ref=moneytransfers",
  xe: "https://xe.com/?ref=moneytransfers",
  "western-union": "https://westernunion.com/?ref=moneytransfers",
  worldremit: "https://worldremit.com/?ref=moneytransfers",
  revolut: "https://revolut.com/?ref=moneytransfers",
  paypal: "https://paypal.com/?ref=moneytransfers",
  moneygram: "https://moneygram.com/?ref=moneytransfers",
  xoom: "https://xoom.com/?ref=moneytransfers",
  torfx: "https://torfx.com/?ref=moneytransfers",
  instarem: "https://instarem.com/?ref=moneytransfers",
  "taptap-send": "https://taptapsend.com/?ref=moneytransfers",
  "ace-money-transfer": "https://acemoneytransfer.com/?ref=moneytransfers",
  currencyfair: "https://currencyfair.com/?ref=moneytransfers",
  skrill: "https://skrill.com/?ref=moneytransfers",
  "currencies-direct": "https://currenciesdirect.com/?ref=moneytransfers",
  monese: "https://monese.com/?ref=moneytransfers",
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
};

function buildWiseDeepLink(params: AffiliateParams): string {
  const base = affiliateLinks.wise;
  if (!params.sourceCurrency && !params.targetCurrency) return base;

  const dest = new URL("https://wise.com/us/pricing/send-money");
  if (params.sourceCurrency) dest.searchParams.set("sourceCurrency", params.sourceCurrency);
  if (params.targetCurrency) dest.searchParams.set("targetCurrency", params.targetCurrency);
  if (params.sourceAmount) dest.searchParams.set("sourceAmount", String(params.sourceAmount));

  return `${base}/destination:${encodeURIComponent(dest.toString())}`;
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

  if (providerSlug === "wise" && params?.sourceCurrency) {
    return buildWiseDeepLink(params);
  }

  return url;
}

export function getGoUrl(providerSlug: string, params?: AffiliateParams): string {
  const base = `/go/${providerSlug}`;
  if (!params?.sourceCurrency && !params?.targetCurrency) return base;

  const searchParams = new URLSearchParams();
  if (params.sourceCurrency) searchParams.set("from", params.sourceCurrency);
  if (params.targetCurrency) searchParams.set("to", params.targetCurrency);
  if (params.sourceAmount) searchParams.set("amount", String(params.sourceAmount));

  return `${base}?${searchParams.toString()}`;
}
