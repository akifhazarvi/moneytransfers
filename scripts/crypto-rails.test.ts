import assert from "node:assert/strict";
import test from "node:test";
import { GET } from "../src/app/api/crypto-rails/route";
import source from "../src/data/scraped/remitroutes-crypto.json";

const request = (query: string) => GET(new Request(`https://sendmoneycompare.com/api/crypto-rails?${query}`));

test("rejects missing, malformed and out-of-range query values", async () => {
  for (const query of ["", "from=USD&to=INR", "from=USD&to=INR&amount=Infinity",
    "from=USD&to=INR&amount=-1", "from=USD&to=INR&amount=1000001",
    "from=USD,GBP&to=INR&amount=1000"]) {
    assert.equal((await request(query)).status, 400, query);
  }
});

test("returns a bounded, ranked selection for the requested corridor", async () => {
  const fixture = source[0];
  const response = await request(`from=${fixture.sendCurrency.toLowerCase()}&to=${fixture.receiveCurrency.toLowerCase()}&amount=${fixture.sendAmount}`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control")!, /s-maxage=3600/);
  const data = await response.json();
  assert.equal(data.from, fixture.sendCurrency);
  assert.equal(data.to, fixture.receiveCurrency);
  assert.equal(data.amount, fixture.sendAmount);
  assert.ok(data.rails.length > 0 && data.rails.length <= 5);
  const candidates = source.filter(r => r.sendCurrency === data.from && r.receiveCurrency === data.to && r.sendAmount === data.amount);
  assert.equal(data.rails[0].feePercent, Math.min(...candidates.map(r => r.feePercent)));
  const slugs = new Set();
  let previous = -Infinity;
  for (const rail of data.rails) {
    assert.equal(rail.sendCurrency, data.from);
    assert.equal(rail.receiveCurrency, data.to);
    assert.equal(rail.sendAmount, data.amount);
    assert.ok(rail.feePercent >= previous);
    assert.ok(!slugs.has(rail.providerSlug));
    slugs.add(rail.providerSlug);
    previous = rail.feePercent;
  }
});

test("unsupported corridors have no rails or cash-out link", async () => {
  const response = await request("from=ZZZ&to=ZZZ&amount=1000");
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.deepEqual(data.rails, []);
  assert.equal(data.cashout, null);
});
