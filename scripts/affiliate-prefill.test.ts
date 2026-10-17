import assert from "node:assert/strict";
import test from "node:test";
import { getAffiliateUrl } from "../src/lib/affiliate";
import { decideRedirect, reviewPath } from "../src/lib/redirect-decision";

test("Remitly carries the send amount inside the Impact destination and keeps attribution", () => {
  for (const [from, to, path] of [
    ["USD", "INR", "/us/en/money-transfer/send-money-to-india"],
    ["GBP", "PHP", "/gb/en/money-transfer/send-money-to-philippines"],
  ]) {
    const url = new URL(getAffiliateUrl("remitly", {
      sourceCurrency: from, targetCurrency: to, sourceAmount: 750.25,
      clickId: "smc_test", clickref: "comparison",
    }));
    const landing = new URL(url.searchParams.get("u")!);
    assert.equal(landing.pathname, path);
    assert.equal(landing.searchParams.get("amount"), "750.25");
    assert.equal(url.searchParams.get("subId1"), "smc_test");
    assert.equal(url.pathname, "/c/7718824/663350/10408");
  }
});

test("invalid amounts are not passed to Remitly's calculator; unmapped corridors retain the campaign", () => {
  for (const sourceAmount of [undefined, NaN, Infinity, 0, -1]) {
    const url = new URL(getAffiliateUrl("remitly", { sourceCurrency: "USD", targetCurrency: "INR", sourceAmount }));
    assert.equal(new URL(url.searchParams.get("u")!).searchParams.has("amount"), false);
  }
  const url = new URL(getAffiliateUrl("remitly", { sourceCurrency: "USD", targetCurrency: "EUR", sourceAmount: 750 }));
  assert.equal(url.searchParams.has("u"), false);
});

test("Partnerize clickref precedes destination so it cannot be swallowed by the landing URL", () => {
  for (const provider of ["instarem", "wise"]) {
    const url = getAffiliateUrl(provider, { sourceCurrency: "GBP", targetCurrency: "PHP", sourceAmount: 750, clickref: "comparison:GBP/PHP", clickId: "smc_test" });
    const [wrapper, encoded] = url.split("/destination:");
    assert.ok(wrapper.endsWith("/clickref:comparison%3AGBP%2FPHP"));
    const landing = new URL(decodeURIComponent(encoded));
    assert.equal(landing.searchParams.get("smc_click_id"), "smc_test");
    assert.equal(landing.href.includes("/clickref:"), false);
    if (provider === "instarem") {
      assert.equal(landing.pathname, "/en-us/send-money-to-philippines/");
      assert.equal(landing.searchParams.get("country_code"), "GB");
      assert.equal(landing.searchParams.get("smc_amount"), "750");
      assert.equal(landing.searchParams.has("source_amount"), false);
    }
  }
});

test("Instarem avoids misleading Japan or ambiguous shared-currency landing pages", () => {
  for (const targetCurrency of ["JPY", "EUR", "USD"]) {
    const url = getAffiliateUrl("instarem", { sourceCurrency: "GBP", targetCurrency });
    assert.equal(new URL(decodeURIComponent(url.split("/destination:")[1])).pathname, "/en-us/");
  }
});

test("the review gate remains and preserves the transfer and attribution parameters", () => {
  for (const provider of ["instarem", "remitly"]) {
    assert.equal(decideRedirect({ provider, tokenStatus: "valid", isBot: false }).outcome, "interstitial");
    const query = "from=GBP&to=PHP&amount=750&src=comparison&click_id=smc_test";
    assert.equal(reviewPath(provider, `https://sendmoneycompare.com/go/${provider}?${query}`, "go"), `/go/${provider}/review?${query}`);
  }
});
