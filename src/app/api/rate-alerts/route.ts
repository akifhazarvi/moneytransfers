import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CURRENCY_RE = /^[A-Z]{3}$/;

// Rate alert signup — stores email + preferred currency pair + optional target rate.
// Uses Resend audience with contact metadata (firstName/lastName fields repurposed as
// "fromCurrency"/"toCurrency" on the contact record until Resend adds custom fields).
//
// Env vars:
//   RESEND_API_KEY=re_xxx
//   RESEND_RATE_ALERT_AUDIENCE_ID=xxx  (falls back to RESEND_AUDIENCE_ID if unset)
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const obj = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const email = String(obj.email ?? "").trim().toLowerCase();
  const fromCurrency = String(obj.fromCurrency ?? "").trim().toUpperCase();
  const toCurrency = String(obj.toCurrency ?? "").trim().toUpperCase();
  const targetRate = obj.targetRate !== undefined && obj.targetRate !== "" ? Number(obj.targetRate) : null;
  const source = typeof obj.source === "string" ? obj.source.slice(0, 60) : "rate-alert";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }
  if (!CURRENCY_RE.test(fromCurrency) || !CURRENCY_RE.test(toCurrency)) {
    return NextResponse.json({ error: "Please select valid currencies." }, { status: 422 });
  }
  if (fromCurrency === toCurrency) {
    return NextResponse.json({ error: "Source and destination currencies must differ." }, { status: 422 });
  }
  if (targetRate !== null && (Number.isNaN(targetRate) || targetRate <= 0)) {
    return NextResponse.json({ error: "Target rate must be a positive number." }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_RATE_ALERT_AUDIENCE_ID || process.env.RESEND_AUDIENCE_ID;

  const payload = {
    email,
    pair: `${fromCurrency}-${toCurrency}`,
    targetRate,
    source,
    timestamp: new Date().toISOString(),
  };

  if (!apiKey || !audienceId) {
    console.log("[rate-alerts] Signup (Resend not configured):", JSON.stringify(payload));
    return NextResponse.json({ ok: true, stored: false }, { status: 200 });
  }

  try {
    const resend = new Resend(apiKey);
    // Store pair metadata in firstName/lastName until Resend adds proper custom fields.
    // firstName = currency pair, lastName = target rate (or "any")
    await resend.contacts.create({
      email,
      audienceId,
      firstName: payload.pair,
      lastName: targetRate !== null ? String(targetRate) : "any",
      unsubscribed: false,
    });
    return NextResponse.json({ ok: true, stored: true }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (/already exists|duplicate/i.test(msg)) {
      return NextResponse.json({ ok: true, stored: true, existing: true }, { status: 200 });
    }
    console.error("[rate-alerts] Resend error:", msg);
    return NextResponse.json({ error: "Could not set up alert. Please try again." }, { status: 500 });
  }
}
