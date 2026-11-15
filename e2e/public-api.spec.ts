import { test, expect } from "./fixtures";

/**
 * The public Data API (/api/v1, documented on /developers) is a contract with
 * whoever builds on it: add fields, never change or remove one. Asserted here
 * against each production deploy, like the extension's v1.
 *
 * Nothing here writes: the waitlist is only sent an invalid email, so CI never
 * adds a row to the real list. Rate limits are not exercised here (a burst from
 * the CI runner would spend its own minute of quota and prove nothing new).
 */

// Runs in the desktop-chrome project only (playwright.config.ts).
test.describe("public Data API v1", () => {
  test("quotes: the comparison's rows as clean JSON", async ({ request }) => {
    const res = await request.get("/api/v1/quotes?from=USD&to=INR&amount=1000");
    expect(res.status()).toBe(200);
    expect(res.headers()["access-control-allow-origin"]).toBe("*");
    expect(res.headers()["cache-control"]).toMatch(/s-maxage=\d+/);
    const q = await res.json();
    expect(q.query).toEqual({ from: "USD", to: "INR", amount: 1000 });
    expect(q.midMarket.rate).toBeGreaterThan(0);
    expect(Date.parse(q.midMarket.asOf)).toBeGreaterThan(0);
    expect(typeof q.comparedProviders).toBe("number");
    expect(q.compareUrl).toMatch(/^https:\/\/sendmoneycompare\.com\/send-money#from=USD&to=INR/);
    expect(q.licence).toMatchObject({ name: "CC BY 4.0" });
    expect(q.docs).toBe("https://sendmoneycompare.com/developers");
    expect(q.quotes.length).toBeGreaterThan(2);

    let expectedRank = 1;
    for (const row of q.quotes) {
      expect(typeof row.provider.slug).toBe("string");
      expect(typeof row.provider.name).toBe("string");
      expect(row.receiveAmount).toBeGreaterThan(0);
      expect(row.exchangeRate).toBeGreaterThan(0);
      expect(typeof row.fee).toBe("number");
      expect(typeof row.aboveLargerPayout).toBe("boolean");
      for (const key of ["markupPct", "speed", "note", "firstTransfer"]) expect(row, key).toHaveProperty(key);
      // Ranked rows are numbered 1..n in order; unranked rows carry null and a note.
      if (row.rank === null) expect(row.note).toBeTruthy();
      else expect(row.rank).toBe(expectedRank++);
      // Display-only fields stay out of the data API.
      for (const key of ["logo", "sendUrl", "offer", "collapsed"]) expect(row, key).not.toHaveProperty(key);
    }
    expect(expectedRank - 1).toBe(q.comparedProviders);
  });

  test("history: daily mid-market rates, oldest first", async ({ request }) => {
    const res = await request.get("/api/v1/history?from=GBP&to=PKR");
    expect(res.status()).toBe(200);
    const h = await res.json();
    expect(h.pair).toEqual({ from: "GBP", to: "PKR" });
    expect(h.points.length).toBeGreaterThan(30);
    for (let i = 1; i < h.points.length; i++) expect(h.points[i].date > h.points[i - 1].date).toBe(true);
    for (const p of h.points.slice(-5)) expect(p.rate).toBeGreaterThan(0);
  });

  test("bad input is a 400 that points at the docs", async ({ request }) => {
    for (const path of ["/api/v1/quotes?from=USD&to=USD", "/api/v1/quotes?from=USD&to=INR&amount=-5", "/api/v1/history?from=US&to=INR"]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(400);
      expect((await res.json()).docs).toBe("https://sendmoneycompare.com/developers");
    }
  });

  test("/api/ai publishes no hand-typed figures and no guessed links", async ({ request }) => {
    const info = await (await request.get("/api/ai")).json();
    const facts: string[] = info.keyFacts;
    expect(facts.some((f) => /\$905 billion/.test(f))).toBe(true);
    expect(facts.some((f) => /\$860 billion|550,000|0% markup/.test(f))).toBe(false);
    for (const p of info.providers) {
      if (p.rating !== null) expect(p.ratingSource).toBe("Trustpilot");
      if (p.reviewUrl !== null) expect(p.reviewUrl).toMatch(/^https:\/\/sendmoneycompare\.com\/companies\/[a-z0-9-]+$/);
    }
    const quotes = await (await request.get("/api/ai?from=USD&to=INR&amount=1000")).json();
    expect(quotes.compareUrl).toMatch(/^https:\/\/sendmoneycompare\.com\/send-money#from=USD&to=INR/);
    for (const r of quotes.results) expect(typeof r.ranked).toBe("boolean");
    expect((await request.get("/api/ai?from=USD&to=INR&amount=abc")).status()).toBe(400);
  });

  test("waitlist rejects an invalid email without storing anything", async ({ request }) => {
    const res = await request.post("/api/waitlist", { data: { email: "not-an-email", plan: "developer" } });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toMatch(/valid email/i);
  });
});

test.describe("/developers", () => {
  test("the live demo sends a real request and shows the answer", async ({ page }) => {
    await page.goto("/developers");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Money transfer prices");
    await page.selectOption("#pg-from", "GBP");
    await page.selectOption("#pg-to", "PKR");
    await page.fill("#pg-amount", "500");
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.locator("#demo")).toContainText(/200 OK/);
    await expect(page.locator("#demo")).toContainText(/\d+ ms/);
    await expect(page.locator("#demo pre")).toContainText('"from": "GBP"');
  });

  test("the waitlist form asks for a valid email before sending", async ({ page }) => {
    await page.goto("/developers#join-business");
    await expect(page.locator("#wl-plan")).toHaveValue("business");
    let posted = false;
    page.on("request", (r) => {
      if (r.url().includes("/api/waitlist")) posted = true;
    });
    await page.fill("#wl-email", "nope");
    await page.getByRole("button", { name: "Join the waitlist" }).click();
    await expect(page.locator("#waitlist")).toContainText("Enter a valid email address.");
    expect(posted).toBe(false);
  });
});
