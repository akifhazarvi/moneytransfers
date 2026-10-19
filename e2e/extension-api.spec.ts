import { test, expect } from "./fixtures";

/**
 * The browser extension's API is a contract with installed copies, which update
 * on the stores' schedule, not ours (extension/README.md). Every field the
 * extension reads is asserted here, against each production deploy.
 */

// Runs in the desktop-chrome project only (playwright.config.ts).
test.describe("extension API v1", () => {
  test("compare: the rows /send-money shows, with what the popup prints", async ({ request }) => {
    const res = await request.get("/api/ext/v1/compare?from=USD&to=INR&amount=1000");
    expect(res.status()).toBe(200);
    expect(res.headers()["access-control-allow-origin"]).toBe("*");
    const c = await res.json();
    expect(c).toMatchObject({ from: "USD", to: "INR", amount: 1000 });
    expect(c.mid).toBeGreaterThan(0);
    expect(Date.parse(c.midAsOf)).toBeGreaterThan(0);
    expect(typeof c.compared).toBe("number");
    expect(typeof c.topLabel).toBe("boolean");
    expect(c.compareUrl).toMatch(/^https:\/\/sendmoneycompare\.com\/send-money#from=USD&to=INR/);
    expect(c.rows.length).toBeGreaterThan(2);
    for (const row of c.rows) {
      expect(typeof row.slug).toBe("string");
      expect(typeof row.name).toBe("string");
      expect(row.logo).toMatch(/^https:\/\/sendmoneycompare\.com\/logos\//);
      expect(row.receive).toBeGreaterThan(0);
      expect(typeof row.fee).toBe("number");
      expect(row.rate).toBeGreaterThan(0);
      for (const key of ["ranked", "collapsed", "tiedAhead"]) expect(typeof row[key], key).toBe("boolean");
      for (const key of ["markupPct", "speed", "trustpilot", "note", "firstTransfer", "offer", "website"]) expect(row, key).toHaveProperty(key);
      expect(row.sendUrl).toMatch(/^https:\/\/sendmoneycompare\.com\/go\/[a-z0-9-]+\?.*src=extension/);
    }
  });

  test("rates: live or snapshot, with the closes the period changes need", async ({ request }) => {
    const res = await request.get("/api/ext/v1/rates");
    expect(res.status()).toBe(200);
    const r = await res.json();
    expect(["live", "snapshot"]).toContain(r.source);
    // Both feeds stale for two days means the scrape and the licensed feed are down.
    expect(Date.now() - Date.parse(r.asOf)).toBeLessThan(2 * 86_400_000);
    expect(r.rates.USD).toBe(1);
    expect(r.rates.INR).toBeGreaterThan(0);
    for (const period of ["1D", "1W", "15D", "30D"]) {
      expect(r.ago[period], period).not.toBeNull();
      expect(r.ago[period].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(r.ago[period].rates.INR, period).toBeGreaterThan(0);
    }
  });

  test("history and activity", async ({ request }) => {
    const h = await (await request.get("/api/ext/v1/history?from=USD&to=INR")).json();
    expect(h.points.length).toBeGreaterThan(30);
    expect(h.points[0]).toEqual([expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/), expect.any(Number)]);
    expect(h).toHaveProperty("timing");
    expect(h).toHaveProperty("usualLeader");

    const a = await (await request.get("/api/ext/v1/activity")).json();
    expect(["live", "snapshot"]).toContain(a.source);
    expect(Array.isArray(a.items)).toBe(true);
  });

  test("bad input answers 400; events accept only extension origins and always 204", async ({ request }) => {
    expect((await request.get("/api/ext/v1/compare?from=USD&to=USD&amount=10")).status()).toBe(400);
    expect((await request.get("/api/ext/v1/history?from=US")).status()).toBe(400);
    const preflight = await request.fetch("/api/ext/v1/events", { method: "OPTIONS" });
    expect(preflight.status()).toBe(204);
    expect(preflight.headers()["access-control-allow-methods"]).toContain("POST");
    const post = await request.post("/api/ext/v1/events", { data: { events: [] } });
    expect(post.status()).toBe(204);
  });
});
