import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

/**
 * Read-only report over the first-party event store. The auditable, owned
 * numbers — per-use-case counts, by provider, by id_source (proves the leak is
 * closing), and a TapTap-style per-click export.
 *
 * Guarded by a shared secret: requires ?key=<TRACK_REPORT_KEY>. Solo-founder
 * simple, scriptable for CSV/cron pulls, no login.
 *
 * Views (?view=):
 *   summary  (default) — total redirects + breakdown by id_source over the window
 *   providers          — redirect count per provider
 *   clicks             — raw rows (per-click proof; supports &provider= filter)
 * Window: &days=N (default 28).
 */

export const dynamic = "force-dynamic"; // never cache a report

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  const secret = process.env.TRACK_REPORT_KEY;
  const { searchParams } = new URL(request.url);

  // Fail closed: if no secret is configured, the endpoint is disabled.
  if (!secret) {
    return NextResponse.json(
      { error: "report disabled — set TRACK_REPORT_KEY" },
      { status: 503 },
    );
  }
  if (searchParams.get("key") !== secret) return unauthorized();

  if (!process.env.POSTGRES_URL) {
    return NextResponse.json(
      { error: "store not provisioned — POSTGRES_URL missing" },
      { status: 503 },
    );
  }

  const view = searchParams.get("view") || "summary";
  const days = Math.min(Math.max(Number(searchParams.get("days")) || 28, 1), 365);
  const provider = searchParams.get("provider") || undefined;

  try {
    if (view === "geo") {
      const { rows } = await sql`
        SELECT coalesce(country, '(none)') AS country, count(*)::int AS redirects
        FROM events
        WHERE event = 'affiliate_redirect'
          AND ts > now() - (${days} || ' days')::interval
        GROUP BY country ORDER BY redirects DESC LIMIT 20;
      `;
      return NextResponse.json({ view, days, geo: rows });
    }

    if (view === "daily") {
      const { rows } = await sql`
        SELECT to_char(date_trunc('day', ts), 'YYYY-MM-DD') AS day,
               count(*)::int AS redirects,
               count(*) FILTER (WHERE is_bot IS NOT TRUE)::int AS non_bot
        FROM events
        WHERE event = 'affiliate_redirect'
          AND ts > now() - (${days} || ' days')::interval
        GROUP BY 1 ORDER BY 1 ASC;
      `;
      return NextResponse.json({ view, days, daily: rows });
    }

    if (view === "providers") {
      const { rows } = await sql`
        SELECT provider, count(*)::int AS redirects,
               count(*) FILTER (WHERE is_bot IS NOT TRUE)::int AS non_bot
        FROM events
        WHERE event = 'affiliate_redirect'
          AND ts > now() - (${days} || ' days')::interval
        GROUP BY provider
        ORDER BY redirects DESC;
      `;
      return NextResponse.json({ view, days, providers: rows });
    }

    if (view === "clicks") {
      const { rows } = provider
        ? await sql`
            SELECT ts, provider, corridor, click_id, id_source, is_bot,
                   traffic_source, country, region, city
            FROM events
            WHERE event = 'affiliate_redirect'
              AND provider = ${provider}
              AND ts > now() - (${days} || ' days')::interval
            ORDER BY ts DESC LIMIT 5000;
          `
        : await sql`
            SELECT ts, provider, corridor, click_id, id_source, is_bot,
                   traffic_source, country, region, city
            FROM events
            WHERE event = 'affiliate_redirect'
              AND ts > now() - (${days} || ' days')::interval
            ORDER BY ts DESC LIMIT 5000;
          `;
      return NextResponse.json({ view, days, provider: provider ?? "all", count: rows.length, clicks: rows });
    }

    // summary (default) — total + the id_source breakdown that proves the leak
    // is closing (fabricated share should approach zero).
    const totals = await sql`
      SELECT count(*)::int AS total_redirects,
             count(*) FILTER (WHERE is_bot IS NOT TRUE)::int AS non_bot,
             count(DISTINCT vid)::int AS unique_visitors
      FROM events
      WHERE event = 'affiliate_redirect'
        AND ts > now() - (${days} || ' days')::interval;
    `;
    const byIdSource = await sql`
      SELECT coalesce(id_source, '(none)') AS id_source, count(*)::int AS n
      FROM events
      WHERE event = 'affiliate_redirect'
        AND ts > now() - (${days} || ' days')::interval
      GROUP BY id_source ORDER BY n DESC;
    `;
    // Top providers inline so the at-a-glance summary answers "who did they go
    // to" without switching views. Full list is still in ?view=providers.
    const topProviders = await sql`
      SELECT coalesce(provider, '(none)') AS provider, count(*)::int AS n
      FROM events
      WHERE event = 'affiliate_redirect'
        AND ts > now() - (${days} || ' days')::interval
      GROUP BY provider ORDER BY n DESC LIMIT 15;
    `;
    return NextResponse.json({
      view: "summary",
      days,
      totals: totals.rows[0] ?? {},
      by_id_source: byIdSource.rows,
      top_providers: topProviders.rows,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "query failed", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
