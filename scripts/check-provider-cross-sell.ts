import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { selectCrossSellPartners, siteCrossSellConfig, crossSellComparisonHref } from "../src/lib/provider-cross-sell";
import { getGoUrl, MONETISED_SLUGS } from "../src/lib/affiliate";
import { generateQuotes } from "../src/lib/quotes-engine";
import { HIDDEN_PROVIDER_SLUGS } from "../src/data/providers";

const personal = selectCrossSellPartners();
assert.equal(personal[0].slug, "taptap-send");
for (const intent of ["personal", "business"] as const) {
  for (const partner of selectCrossSellPartners({ intent })) {
    assert(MONETISED_SLUGS.has(partner.slug), `${partner.slug} must be an actual partner`);
    assert(!HIDDEN_PROVIDER_SLUGS.has(partner.slug));
    assert(existsSync(`public${partner.logo}`), `Missing logo: ${partner.logo}`);
  }
}
// TapTap Send is deliberately ungated (see UNGATED_PARTNER): its card makes no
// corridor-specific claim, so it survives an empty eligible set — nothing else does.
assert.deepEqual(selectCrossSellPartners({ eligible: [] }).map((p) => p.slug), ["taptap-send"]);
assert.deepEqual(selectCrossSellPartners({ intent: "business", eligible: ["taptap-send", "remitly"] }), []);
assert(!selectCrossSellPartners({ exclude: "taptap-send" }).some(p => p.slug === "taptap-send"));

for (const [from, to, amount] of [["USD", "INR", 1000], ["GBP", "USD", 1000], ["USD", "EUR", 50000]] as const) {
  const eligible = generateQuotes(amount, from, to).map(q => q.providerSlug);
  for (const partner of selectCrossSellPartners({ eligible })) {
    assert(partner.slug === "taptap-send" || eligible.includes(partner.slug), "A corridor spotlight must be in the corridor quote set");
    const url = new URL(getGoUrl(partner.slug, { sourceCurrency: from, targetCurrency: to, sourceAmount: amount, clickref: "partner_inline:guide:test" }), "https://sendmoneycompare.com");
    assert.equal(url.searchParams.get("from"), from);
    assert.equal(url.searchParams.get("to"), to);
    assert.equal(url.searchParams.get("amount"), String(amount));
    assert.equal(url.searchParams.get("src"), "partner_inline:guide:test");
  }
}
// "/" opted out on 2026-09-19: the homepage already runs PartnerFeatureBlock's
// live-rate ad for the same partner (see siteCrossSellConfig).
for (const path of ["/", "/guides", "/guides/example", "/privacy", "/about", "/for-ai", "/send-money", "/send-money/us-to-india", "/business/compare", "/cash-out"]) {
  assert.equal(siteCrossSellConfig(path), null, `Unexpected duplicate/irrelevant placement: ${path}`);
}
for (const path of ["/research", "/tools/fee-impact", "/news/example", "/companies/wise", "/banks/chase", "/iban/gb", "/swift-codes/gb", "/travel/india", "/exchange-rates/usd-inr"]) {
  assert(siteCrossSellConfig(path), `Missing content placement: ${path}`);
}
assert.equal(siteCrossSellConfig("/en/business/payments")?.intent, "business");
assert.equal(siteCrossSellConfig("/companies/wise")?.exclude, "wise");
assert.equal(siteCrossSellConfig("/en/companies/torfx")?.intent, "business");
assert.equal(crossSellComparisonHref("business", { from: "USD", to: "EUR", amount: 50000 }), "/business/compare");
// No amount since 2026-09-25: one comparison URL per pair, not one per page.
assert.equal(crossSellComparisonHref("personal", { from: "GBP", to: "USD", amount: 1000 }), "/send-money?from=GBP&to=USD");
console.log("Provider cross-sell checks passed: eligibility, intent, exclusions, assets, partner status and attribution.");
