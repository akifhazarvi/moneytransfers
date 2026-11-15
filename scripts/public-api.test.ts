/**
 * Unit tests for the Data API's pieces that have no network: the waitlist's
 * validation (only the email may cost us a lead) and the per-IP limiter.
 *
 *   npx tsx --test scripts/public-api.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { overRate, parseSignup } from "../src/lib/api-waitlist";
import { clientIp, createRateLimiter } from "../src/lib/rate-limit";

test("waitlist: only a valid email is required", () => {
  const r = parseSignup({ email: "  Person@Example.COM " });
  assert.equal(r.ok, true);
  if (r.ok !== true) return;
  assert.equal(r.entry.email, "person@example.com");
  assert.equal(r.entry.plan, "developer"); // default
  assert.equal(r.entry.useCase, "");
  assert.equal(r.entry.suspect, "");
});

test("waitlist: an invalid email is the only rejection", () => {
  for (const email of ["", "nope", "a@b", "a b@c.com", 42, null]) {
    const r = parseSignup({ email });
    assert.equal(r.ok, false, String(email));
  }
});

test("waitlist: unknown plan or use case never loses the lead", () => {
  const r = parseSignup({ email: "x@y.io", plan: "platinum", useCase: "spying", company: "A".repeat(300), note: "B".repeat(900) });
  assert.equal(r.ok, true);
  if (r.ok !== true) return;
  assert.equal(r.entry.plan, "developer");
  assert.equal(r.entry.useCase, "");
  assert.equal(r.entry.company.length, 100);
  assert.equal(r.entry.note.length, 500);
});

test("waitlist: a filled honeypot is kept as suspect, not rejected", () => {
  const r = parseSignup({ email: "bot@spam.io", website: "http://spam" });
  assert.equal(r.ok, true);
  if (r.ok === true) assert.equal(r.entry.suspect, "honeypot");
});

test("waitlist: the per-IP hourly count marks suspects only past 30", () => {
  assert.equal(overRate(30), false);
  assert.equal(overRate(31), true);
});

test("limiter: allows the budget, then 429s with a Retry-After, per key", () => {
  const check = createRateLimiter(3, 60_000);
  for (let i = 0; i < 3; i++) assert.equal(check("1.1.1.1").allowed, true);
  const blocked = check("1.1.1.1");
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds >= 1 && blocked.retryAfterSeconds <= 60);
  assert.equal(check("2.2.2.2").allowed, true, "another IP has its own count");
});

test("limiter: the window resets", async () => {
  const check = createRateLimiter(1, 50);
  assert.equal(check("k").allowed, true);
  assert.equal(check("k").allowed, false);
  await new Promise((r) => setTimeout(r, 60));
  assert.equal(check("k").allowed, true);
});

test("clientIp: x-real-ip, then the first x-forwarded-for hop", () => {
  assert.equal(clientIp(new Request("https://x", { headers: { "x-real-ip": "9.9.9.9", "x-forwarded-for": "1.1.1.1" } })), "9.9.9.9");
  assert.equal(clientIp(new Request("https://x", { headers: { "x-forwarded-for": "1.1.1.1, 10.0.0.1" } })), "1.1.1.1");
  assert.equal(clientIp(new Request("https://x")), "unknown");
});
