/**
 * Delivery speed: what providers and comparison sources PROMISE (our quote
 * archive) against what happened on transfers we sent and timed ourselves.
 *
 * Two inputs, both committed:
 *   src/data/research/delivery-tests.json  — hand-entered from each app's own
 *     status timeline (no names, account numbers or card digits).
 *   src/data/research/delivery-speed.json  — built by
 *     scripts/build-delivery-speed.ts from the archive, the tests and the CFPB
 *     complaint database. Run by hand; it is not rebuilt by the scrape jobs.
 *
 * Server-only (guides render tokens on the server; the CSV route and /research
 * are server components). Nothing here measures when a RECIPIENT'S bank
 * credited the money — the tests time the provider's own last step, and the
 * copy says so.
 */

import tests from "@/data/research/delivery-tests.json";
import speed from "@/data/research/delivery-speed.json";
import { longDay } from "@/lib/content-dates";

type Test = (typeof tests.transfers)[number] & { retryAfterMinutes?: number; dateNote?: string };
type SourceStat = { quotes: number; minHours: number; maxHours: number; withinMinutePct: number } | null;

export const DELIVERY_TESTS = tests.transfers as Test[];
export const DELIVERY_SPEED = speed;

const PROVIDER_NAMES: Record<string, string> = { taptapsend: "TapTap Send", wise: "Wise" };
const providerName = (slug: string) => PROVIDER_NAMES[slug] ?? slug;
const route = (from: string, to: string) => `${from}→${to}`;
const nf = (n: number) => n.toLocaleString("en-US");

/** "under a minute", "16 min", "1 hour", "11 hours", "6 days". */
export function fmtHours(h: number): string {
  if (h < 1 / 60) return "under a minute";
  if (h < 1) return `${Math.round(h * 60)} min`;
  if (h < 1.5) return "1 hour";
  if (h < 48) return `${Math.round(h)} hours`;
  return `${Math.round(h / 24)} days`;
}

/** "under a minute", "1 minute", "16 minutes", "9 h 55 min". */
export function fmtMinutes(m: number): string {
  if (m <= 0) return "under a minute";
  if (m === 1) return "1 minute";
  if (m < 60) return `${m} minutes`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

/** "Fri, Oct 2, 2026"; an unconfirmed date names both candidates rather than guess. */
function sentLabel(t: Test): string {
  const day = t.weekday.slice(0, 3);
  if (!t.dateConfirmed && t.dateNote) {
    const both = t.dateNote.match(/\d{4}-\d{2}-\d{2}/g) ?? [t.sentDate];
    return `${day}, ${both.map(monthDay).join(" or ")}, ${t.sentDate.slice(0, 4)}`;
  }
  return `${day}, ${monthDay(t.sentDate)}, ${t.sentDate.slice(0, 4)}`;
}
const utc = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`);
const monthDay = (iso: string) => utc(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const monthYear = (iso: string) => utc(iso).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

const SOURCE_LABEL: Record<string, string> = { own: "the provider's own calculator", monito: "Monito", remitroutes: "RemitRoutes" };

function advertisedCell(id: string): string {
  const row = speed.tests.find((t) => t.id === id);
  if (!row?.advertised) return row?.beforeArchive ? "Before our archive began" : "Nothing published";
  return row.advertised
    .map((a) => {
      const total = a.values.reduce((n, v) => n + v.quotes, 0);
      const top = a.values[0];
      const share = top.quotes === total ? "every quote" : `${top.quotes} of ${total} quotes`;
      return `“${top.value}” (${SOURCE_LABEL[a.source] ?? a.source}, ${share} within 3 days)`;
    })
    .join("; ");
}

function resultCell(t: Test): string {
  if (t.outcome === "returned") {
    return `Returned, re-sent after ${fmtMinutes(t.retryAfterMinutes ?? 0)}; marked sent after ${fmtMinutes(t.durationMinutes)}`;
  }
  return fmtMinutes(t.durationMinutes);
}

export function renderSpeedTestTable(): string {
  const rows = DELIVERY_TESTS.map(
    (t) =>
      `<tr><td>${sentLabel(t)}</td><td>${providerName(t.provider)}</td><td>${route(t.from, t.to)}${t.payout ? `, ${t.payout}` : ""}</td><td>${t.amountShown}</td><td>${advertisedCell(t.id)}</td><td>${resultCell(t)}</td></tr>`,
  ).join("\n");
  return `<div class="blog-table-box">
<table>
<thead><tr><th>Sent</th><th>Provider</th><th>Route</th><th>Amount</th><th>Advertised for this route then</th><th>Set up to paid out</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
<p class="blog-footnote">Times are each app's own status timeline, to the minute. &ldquo;Paid out&rdquo; is the provider's last step (&ldquo;Transfer was successful&rdquo;, &ldquo;Your transfer's complete&rdquo;); we did not time when the receiving bank or wallet credited the money. Our quote archive starts in ${monthYear(speed.archive.from)}, so transfers before then have no archived promise. <a href="/api/data/delivery-speed">Download the table (CSV)</a>.</p>
</div>`;
}

export function renderWeekdayTable(): string {
  const rows = speed.wise.weekdays
    .map((d) => `<tr><td>${d.day}</td><td>${Math.round(d.withinHourPct)}%</td><td>${Math.round(d.withinDayPct)}%</td><td>${fmtHours(d.medianHours)}</td></tr>`)
    .join("\n");
  return `<div class="blog-table-box">
<table>
<thead><tr><th>Day we asked (UTC)</th><th>Promised within an hour</th><th>Promised within a day</th><th>Median promise</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
<p class="blog-footnote">Wise's own delivery estimate for a transfer of ${nf(speed.method.amount)} in ${speed.wise.majorCurrencies.join(", ")} (roughly $600 to $1,300), across ${speed.wise.majorRoutes} routes, ${longDay(speed.wise.from)} to ${longDay(speed.wise.to)} (${nf(speed.wise.overall.at1000.quotes)} quotes). A promise, not a measured arrival.</p>
</div>`;
}

function sourceCell(s: SourceStat): string {
  if (!s) return "—";
  if (s.withinMinutePct >= 90) return `Within a minute (${Math.round(s.withinMinutePct)}% of quotes)`;
  if (s.minHours === s.maxHours) return fmtHours(s.maxHours);
  return `${fmtHours(s.minHours)} to ${fmtHours(s.maxHours)}`;
}

function testCell(provider: string, from: string, to: string): string {
  const mine = DELIVERY_TESTS.filter((t) => t.provider === provider && t.from === from && t.to === to);
  if (!mine.length) return "—";
  return mine.map((t) => (t.outcome === "returned" ? `returned, ${fmtMinutes(t.durationMinutes)}` : fmtMinutes(t.durationMinutes))).join("; ");
}

export function renderSourceTable(): string {
  const rows = speed.examples.rows
    .map((r) => {
      const ex = r as typeof r & { own: SourceStat; monito: SourceStat; remitroutes: SourceStat };
      return `<tr><td>${providerName(r.provider)}</td><td>${route(r.from, r.to)}</td><td>${sourceCell(ex.own)}</td><td>${sourceCell(ex.monito)}</td><td>${sourceCell(ex.remitroutes)}</td><td>${testCell(r.provider, r.from, r.to)}</td></tr>`;
    })
    .join("\n");
  return `<div class="blog-table-box">
<table>
<thead><tr><th>Provider</th><th>Route</th><th>Provider's own estimate</th><th>Monito</th><th>RemitRoutes</th><th>Our test transfers</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
<p class="blog-footnote">Estimates each source published, ${longDay(speed.examples.from)} to ${longDay(speed.examples.to)}, shortest to longest. &ldquo;&mdash;&rdquo;: that source publishes no time for this provider and route. TapTap Send's own calculator returns no delivery time. Our tests are from 2023&ndash;2026, so they overlap these dates only for TapTap Send.</p>
</div>`;
}

export function renderCfpbTable(): string {
  const c = speed.cfpb;
  const shown = c.providers.filter((p) => p.sharePct != null).sort((a, b) => (b.sharePct ?? 0) - (a.sharePct ?? 0));
  const thin = c.providers.filter((p) => p.sharePct == null).map((p) => p.name);
  const rows = shown
    .map((p) => {
      const note = (p as { note?: string }).note;
      return `<tr><td>${p.name}${note ? ` (${note})` : ""}</td><td>${p.sharePct}%</td></tr>`;
    })
    .join("\n");
  return `<div class="blog-table-box">
<table>
<thead><tr><th>Provider</th><th>Share of its international-transfer complaints filed as &ldquo;money was not available when promised&rdquo;</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
<p class="blog-footnote">US consumer complaints about international transfers in the <a href="https://www.consumerfinance.gov/data-research/consumer-complaints/" target="_blank" rel="noopener noreferrer">CFPB Consumer Complaint Database</a>, ${longDay(c.from)} to ${longDay(c.to)}, by the issue the consumer chose. Shown only for providers with ${c.minComplaints}+ such complaints; ${thin.join(", ")} had fewer. Complaints are unverified and are not scaled by how many transfers each provider makes, so this is what people complain about, not a delay rate.</p>
</div>`;
}

/** Tests marked paid out within two minutes of being set up. */
const fastTests = () => DELIVERY_TESTS.filter((t) => t.outcome === "delivered" && t.durationMinutes <= 1);

export function renderSpeedTokens(html: string): string {
  if (!html.includes("{{SPEED_")) return html;
  let out = html;
  const tables: Record<string, () => string> = {
    "{{SPEED_TEST_TABLE}}": renderSpeedTestTable,
    "{{SPEED_WEEKDAY_TABLE}}": renderWeekdayTable,
    "{{SPEED_SOURCE_TABLE}}": renderSourceTable,
    "{{SPEED_CFPB_TABLE}}": renderCfpbTable,
  };
  for (const [token, render] of Object.entries(tables)) if (out.includes(token)) out = out.split(token).join(render());

  const w = speed.wise;
  const delivered = DELIVERY_TESTS.filter((t) => t.outcome === "delivered");
  const simple: Record<string, string> = {
    "{{SPEED_TESTS_TOTAL}}": String(DELIVERY_TESTS.length),
    "{{SPEED_TESTS_FAST}}": String(fastTests().length),
    "{{SPEED_TESTS_SLOWEST_DELIVERED}}": fmtMinutes(Math.max(...delivered.map((t) => t.durationMinutes))),
    "{{SPEED_WISE_QUOTES}}": nf(w.quotes),
    "{{SPEED_WISE_ROUTES}}": String(w.routes),
    "{{SPEED_WISE_MAJOR_ROUTES}}": String(w.majorRoutes),
    "{{SPEED_WISE_FROM}}": longDay(w.from),
    "{{SPEED_WISE_AMOUNT}}": nf(speed.method.amount),
    "{{SPEED_WISE_NEAR_INSTANT_ROUTES}}": String(w.nearInstantRoutes),
    "{{SPEED_WISE_NEAR_INSTANT_SHARE}}": `${Math.round(w.nearInstantShare * 100)}%`,
    "{{SPEED_WISE_SLOWEST}}": w.slowest.slice(0, 4).map((r) => `${r.route.replace("-", "→")} (${fmtHours(r.medianHours)})`).join(", "),
    "{{SPEED_DISAGREE_PCT}}": `${speed.disagreement.pct}%`,
    "{{SPEED_DISAGREE_PAIRS}}": String(speed.disagreement.pairs),
    "{{SPEED_ARCHIVE_FROM}}": longDay(speed.archive.from),
    "{{SPEED_CFPB_FROM}}": longDay(speed.cfpb.from),
  };
  for (const [token, value] of Object.entries(simple)) out = out.split(token).join(value);

  // Asked on that UTC day: {{SPEED_WISE_DAY:Saturday}} -> median promise ("under a minute");
  // {{SPEED_WISE_DAY_WITHIN_DAY:Saturday}} -> "63%" and {{SPEED_WISE_DAY_WITHIN_HOUR:Saturday}} -> "55%",
  // the shares of that day's promises within 24 hours / within an hour.
  out = out.replace(/\{\{SPEED_WISE_DAY(_WITHIN_DAY|_WITHIN_HOUR)?:([A-Za-z]+)\}\}/g, (match, kind: string | undefined, day: string) => {
    const row = w.weekdays.find((d) => d.day === day);
    if (!row) return match;
    if (kind === "_WITHIN_DAY") return `${Math.round(row.withinDayPct)}%`;
    if (kind === "_WITHIN_HOUR") return `${Math.round(row.withinHourPct)}%`;
    return fmtHours(row.medianHours);
  });
  // {{SPEED_PHP_SMALL:USD}} / {{SPEED_PHP_LARGE:USD}} -> "99%" / "0%" of quotes within a minute; {{SPEED_PHP_LARGE_MEDIAN:USD}} -> "6 hours"
  out = out.replace(/\{\{SPEED_PHP_(SMALL|LARGE|LARGE_MEDIAN):([A-Z]{3})\}\}/g, (match, kind: string, from: string) => {
    const row = w.php.find((p) => p.route === `${from}-PHP`);
    if (!row) return match;
    if (kind === "SMALL") return `${Math.round(row.at100.withinMinutePct)}%`;
    if (kind === "LARGE") return `${Math.round(row.at1000.withinMinutePct)}%`;
    return fmtHours(row.at1000.medianHours);
  });
  // {{SPEED_TEST_TIME:t06}} -> "9 h 55 min"; {{SPEED_TEST_RETRY:t06}} -> "7 h 31 min"
  out = out.replace(/\{\{SPEED_TEST_(TIME|RETRY):(t\d+)\}\}/g, (match, kind: string, id: string) => {
    const t = DELIVERY_TESTS.find((x) => x.id === id);
    const minutes = kind === "TIME" ? t?.durationMinutes : t?.retryAfterMinutes;
    return minutes == null ? match : fmtMinutes(minutes);
  });
  return out;
}

/** One sentence for /research, with its numbers. */
export function speedStudyFinding(): string {
  const w = speed.wise;
  const day = (name: string) => Math.round(w.weekdays.find((d) => d.day === name)?.withinDayPct ?? NaN);
  return `Wise promises delivery within a day on ${day("Monday")}% of its quotes for ${nf(speed.method.amount)} dollars, pounds or euros asked on a Monday and ${day("Saturday")}% on a Saturday; on ${speed.disagreement.pct}% of the provider-and-route pairs that two sources describe, the times they publish are at least a day apart; and ${fastTests().length} of our ${DELIVERY_TESTS.length} timed test transfers were paid out within two minutes.`;
}
