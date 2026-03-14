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
};

export function getAffiliateUrl(providerSlug: string, fallbackUrl?: string): string {
  return affiliateLinks[providerSlug] || fallbackUrl || `https://${providerSlug.replace(/-/g, "")}.com`;
}

export function getGoUrl(providerSlug: string): string {
  return `/go/${providerSlug}`;
}
