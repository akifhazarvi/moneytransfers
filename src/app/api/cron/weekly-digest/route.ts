import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { corridors, type Corridor } from "@/data/corridors";
import { generateQuotes } from "@/lib/quotes-engine";
import WeeklyDigest from "@/emails/WeeklyDigest";

// Vercel cron — runs weekly. Triggered by vercel.json crons schedule.
// Auth: Vercel sends `Authorization: Bearer ${CRON_SECRET}` automatically when CRON_SECRET is set.
//
// Env vars required:
//   RESEND_API_KEY=re_xxx
//   RESEND_DIGEST_AUDIENCE_ID=xxx          (audience holding signups)
//   RESEND_FROM=digest@sendmoneycompare.com (verified sender)
//   CRON_SECRET=xxx                        (auto-checked by Vercel)
//
// Contact tagging: signups stored with firstName="digest-{corridor-slug}" by
// /api/weekly-digest. We parse that to group recipients per corridor.

export const maxDuration = 300; // 5 min — bumped from default 10s

const corridorBySlug = new Map<string, Corridor>(corridors.map((c) => [c.slug, c]));

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_DIGEST_AUDIENCE_ID || process.env.RESEND_AUDIENCE_ID;
  const from = process.env.RESEND_FROM || "digest@sendmoneycompare.com";

  if (!apiKey || !audienceId) {
    return NextResponse.json({ error: "Resend not configured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const list = await resend.contacts.list({ audienceId });
  const contacts = list.data?.data ?? [];

  const byCorridor = new Map<string, typeof contacts>();
  for (const c of contacts) {
    if (c.unsubscribed) continue;
    const slug = c.first_name?.replace(/^digest-/, "") ?? "";
    if (!corridorBySlug.has(slug)) continue;
    if (!byCorridor.has(slug)) byCorridor.set(slug, []);
    byCorridor.get(slug)!.push(c);
  }

  const results: { corridor: string; sent: number; failed: number }[] = [];

  for (const [slug, recipients] of byCorridor) {
    const corridor = corridorBySlug.get(slug)!;
    const quotes = generateQuotes(corridor.sampleAmount, corridor.fromCurrency, corridor.toCurrency);
    if (quotes.length === 0) {
      results.push({ corridor: slug, sent: 0, failed: 0 });
      continue;
    }

    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
      const unsubscribeUrl = `https://sendmoneycompare.com/api/unsubscribe?id=${recipient.id}&audience=${audienceId}`;
      const html = await render(
        WeeklyDigest({ corridor, quotes, unsubscribeUrl })
      );

      // Subject: curiosity-driven — hint at the deal, drive the click to our site.
      // Example: "USA → India: this week's cheapest provider is..."
      const subject = `${corridor.fromCountry} → ${corridor.toCountry}: this week's cheapest provider is…`;

      try {
        await resend.emails.send({
          from,
          to: recipient.email,
          subject,
          html,
          headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
        });
        sent++;
      } catch (err) {
        failed++;
        console.error(`[weekly-digest] send failed for ${recipient.email}:`, err);
      }
    }

    results.push({ corridor: slug, sent, failed });
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    results,
    totalContacts: contacts.length,
    corridorsProcessed: byCorridor.size,
  });
}
