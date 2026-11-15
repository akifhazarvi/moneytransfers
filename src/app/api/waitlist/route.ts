import { NextResponse } from "next/server";
import { countSignup, notifySignup, overRate, parseSignup, storeSignup } from "@/lib/api-waitlist";
import { classifyTrafficSource } from "@/lib/traffic-source";

export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * POST /api/waitlist — join the Data API waitlist from /developers.
 *
 * Nothing that reaches here with a valid email is thrown away. A normal lead
 * goes to Redis AND to an email (src/lib/api-waitlist.ts); a signup that looks
 * automated (honeypot, crawler user agent, cross-site, over the per-IP rate)
 * is kept in a separate suspect list and still answered with success, so a bot
 * learns nothing. Only when every copy fails does it answer 502 — and then
 * the lead is written to the runtime log, and the form offers a ready-made
 * email to us instead. The country comes from Vercel's header, never the form.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = JSON.parse((await request.text()).slice(0, 4000));
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (!body || typeof body !== "object") return json({ error: "Invalid request." }, 400);

  const parsed = parseSignup(body);
  if (!parsed.ok) return json({ error: parsed.error }, 400);
  const entry = parsed.entry;

  const site = request.headers.get("sec-fetch-site");
  const userAgent = request.headers.get("user-agent") || "";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!entry.suspect && site && site !== "same-origin") entry.suspect = "cross-site";
  if (!entry.suspect && classifyTrafficSource(userAgent, request.headers.get("referer")).isBot) entry.suspect = "crawler";
  if (!entry.suspect && overRate(await countSignup(ip))) entry.suspect = "rate";

  const header = request.headers.get("x-vercel-ip-country") || "";
  const country = /^[A-Z]{2}$/.test(header) ? header : "";
  const at = new Date().toISOString();

  const stored = await storeSignup(entry, country, at);
  const notified = await notifySignup(entry, country, at, stored).catch(() => false);

  if (stored || notified || entry.suspect) {
    if (!stored && entry.suspect) console.warn("[api-waitlist] suspect signup not stored", JSON.stringify({ ...entry, country, at }));
    return json({ ok: true });
  }
  // Last copy: Vercel runtime logs. Searchable as "[api-waitlist] LOST".
  console.error("[api-waitlist] LOST — store and email both failed", JSON.stringify({ ...entry, country, at }));
  return json({ error: "We could not save that just now.", fallback: true }, 502);
}
