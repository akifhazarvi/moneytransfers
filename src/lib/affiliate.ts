/**
 * Affiliate redirect tracking.
 *
 * Maps provider slugs to affiliate URLs. When a user clicks "Visit provider",
 * they go through /api/go/[provider] which logs the click and redirects.
 */

const affiliateLinks: Record<string, string> = {
  wise: "https://wise.com/?ref=moneytransfers",
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
};

export function getAffiliateUrl(providerSlug: string, fallbackUrl?: string): string {
  const url = affiliateLinks[providerSlug] || fallbackUrl;
  if (!url) {
    // Do not generate unknown URLs — return a safe fallback to the homepage
    return "https://sendmoneycompare.com/send-money";
  }
  return url;
}

export function getGoUrl(providerSlug: string): string {
  return `/go/${providerSlug}`;
}
