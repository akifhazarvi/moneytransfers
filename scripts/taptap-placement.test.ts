import test from "node:test";
import assert from "node:assert/strict";
import { tapTapReadingPlacement } from "../src/lib/taptap-placement";

test("reading CTA supports editorial and rate discovery with source attribution", () => {
  assert.deepEqual(tapTapReadingPlacement("/en/guides/send-money-home/"), { source: "taptap_reading:guides/send-money-home", hasTicker: false });
  assert.deepEqual(tapTapReadingPlacement("/exchange-rates/usd-to-inr"), { source: "taptap_reading:exchange-rates/usd-to-inr", hasTicker: true });
  assert.ok(tapTapReadingPlacement("/companies/taptap-send"));
});

test("reading CTA stays out of transactions, legal pages, and business specialists", () => {
  for (const path of ["/", "/send-money", "/send-money/usa-to-india", "/go/wise", "/business", "/business/compare", "/privacy", "/cookies", "/companies/torfx", "/companies/ofx", "/about"]) {
    assert.equal(tapTapReadingPlacement(path), null, path);
  }
});
