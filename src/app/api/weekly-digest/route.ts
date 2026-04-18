import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Weekly digest signup — stores email + corridor preference.
// Cron job (future) will send weekly summary of cheapest providers for that corridor.
//
// Env vars:
//   RESEND_API_KEY=re_xxx
//   RESEND_DIGEST_AUDIENCE_ID=xxx  (falls back to RESEND_AUDIENCE_ID)
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const obj = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const email = String(obj.email ?? "").trim().toLowerCase();
  const corridor = String(obj.corridor ?? "").trim().toLowerCase();
  const source = typeof obj.source === "string" ? obj.source.slice(0, 60) : "weekly-digest";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }
  if (!corridor || corridor.length > 80) {
    return NextResponse.json({ error: "Please choose a corridor." }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_DIGEST_AUDIENCE_ID || process.env.RESEND_AUDIENCE_ID;

  const payload = { email, corridor, source, timestamp: new Date().toISOString() };

  if (!apiKey || !audienceId) {
    console.log("[weekly-digest] Signup (Resend not configured):", JSON.stringify(payload));
    return NextResponse.json({ ok: true, stored: false }, { status: 200 });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.contacts.create({
      email,
      audienceId,
      firstName: `digest-${corridor}`,
      unsubscribed: false,
    });
    return NextResponse.json({ ok: true, stored: true }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (/already exists|duplicate/i.test(msg)) {
      return NextResponse.json({ ok: true, stored: true, existing: true }, { status: 200 });
    }
    console.error("[weekly-digest] Resend error:", msg);
    return NextResponse.json({ error: "Could not subscribe. Please try again." }, { status: 500 });
  }
}
