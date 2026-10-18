import { NextResponse } from "next/server";
import { countConsentMetric, type ConsentMetric } from "@/lib/consent-metrics";
import { checkRateLimit } from "@/lib/rate-limit";

const EVENTS = new Set(["shown", "accepted", "rejected", "updated"]);

export async function POST(request: Request) {
  const done = () => new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  // A same-origin UI action, never a cross-site counter. No cookies are read.
  if (request.headers.get("origin") !== new URL(request.url).origin) return done();
  if (request.headers.get("sec-fetch-site") !== "same-origin") return done();
  if (Number(request.headers.get("content-length")) > 128) return done();
  // IP only used for a short-lived, in-memory abuse limit; never sent to the store.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip && !checkRateLimit(`consent:${ip}`).allowed) return done();
  try {
    const text = await request.text();
    if (text.length > 128) return done();
    const { event } = JSON.parse(text);
    if (typeof event === "string" && EVENTS.has(event)) await countConsentMetric(event as ConsentMetric);
  } catch { /* malformed telemetry is ignored */ }
  return done();
}
