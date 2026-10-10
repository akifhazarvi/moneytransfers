/**
 * Builds src/data/research/delivery-speed.json — the figures behind
 * /guides/fastest-way-to-send-money-internationally.
 *
 * Everything here is what someone SAID about speed, except INPUT 2:
 *
 * INPUT 1: the quote archive (history/quotes-*.json.gz). Every row keeps the
 * delivery estimate its source published when we collected it. Wise's own API
 * (source wise-direct-*) is the only one that returns a live estimate per
 * quote, so it is the one promise followed over time: by weekday, amount and
 * route. Monito and RemitRoutes publish a time for many providers; where two
 * sources describe the same provider and route, we measure how often they
 * disagree.
 *
 * INPUT 2: src/data/research/delivery-tests.json, transfers we sent and timed
 * from each provider's own status timeline. For each, this looks up what our
 * archive recorded for that provider and route within 3 days of the send date.
 *
 * INPUT 3: the CFPB Consumer Complaint Database (CC0), the share of each
 * provider's US international-transfer complaints filed under "Money was not
 * available when promised". Network; if it fails, the previous block is kept.
 *
 * Run by hand when the guide is refreshed — not by the scrape workflows:
 *   NODE_EXTRA_CA_CERTS=~/.certs/combined-certs.pem npx tsx scripts/build-delivery-speed.ts
 * (the CA bundle only matters behind the office TLS proxy)
 */

import fs from "fs";
import path from "path";
import zlib from "zlib";

const HISTORY = "src/data/scraped/history";
const TESTS = "src/data/research/delivery-tests.json";
const OUT = "src/data/research/delivery-speed.json";

/** Wise figures are reported at this send amount (1,000 of the sending currency). */
const AMOUNT = 1000;
/**
 * Sending currencies where 1,000 units is roughly $600-$1,300, so "a transfer of
 * 1,000" means the same size of transfer on every route counted. CNY (~$140),
 * HKD (~$130) and JPY (~$7) routes would mix a small transfer into the figure.
 */
const MAJOR = new Set(["USD", "GBP", "EUR", "CAD", "AUD", "SGD", "CHF", "NZD"]);
/** The disagreement count looks at this many most recent days of snapshots. */
const DISAGREE_DAYS = 7;
/**
 * Sources "disagree" when their typical ranges do not overlap and the gap
 * between them is at least this: one source's SHORTEST typical time is a day
 * or more longer than another's LONGEST. "0-3 days" against "1 business day"
 * overlaps and is not counted.
 */
const DISAGREE_HOURS = 24;
/** Route examples in the guide's source table read this many recent days. */
const EXAMPLE_DAYS = 30;
const EXAMPLES: [string, string, string][] = [
  ["taptapsend", "USD", "PKR"],
  ["taptapsend", "USD", "EUR"],
  ["wise", "USD", "PKR"],
  ["wise", "USD", "EUR"],
];
/** A route counts as "near-always within a minute" at this share of quotes. */
const INSTANT_ROUTE_SHARE = 0.95;
/** A provider's complaint share is published only above this many complaints. */
const CFPB_MIN_COMPLAINTS = 50;
const CFPB_FROM = "2022-01-01";

// ── parse a published estimate into the range of hours it promises ─────────
/**
 * "Instant" → [0, 0]; "~15–30 min" → [0.25, 0.5]; "1-2 business days" → [24, 48].
 * A business day counts as 24 hours: the sources do not say which days they
 * skip, so this understates a weekend estimate rather than inventing one.
 * Returns null for anything else (a weekday date, an unknown phrase).
 */
export function estimateHours(raw: string | null | undefined): [number, number] | null {
  if (!raw) return null;
  const e = raw.trim().replace(/–/g, "-");
  let m: RegExpMatchArray | null;
  if (/^instant/i.test(e)) return [0, 0];
  if (/^minutes$/i.test(e)) return [0, 1];
  if (/^(minutes|same day) to 1 business day$/i.test(e) || /^same day - 1 business day$/i.test(e)) return [0, 24];
  if ((m = e.match(/^~?(\d+(?:\.\d+)?)(?:\s*-\s*(\d+(?:\.\d+)?))?\s*sec(?:ond)?s?$/i))) return [+m[1] / 3600, +(m[2] ?? m[1]) / 3600];
  if ((m = e.match(/^~?(\d+(?:\.\d+)?)(?:\s*-\s*(\d+(?:\.\d+)?))?\s*min(?:ute)?s?$/i))) return [+m[1] / 60, +(m[2] ?? m[1]) / 60];
  if ((m = e.match(/^(\d+)h (\d+)m$/))) return [+m[1] + +m[2] / 60, +m[1] + +m[2] / 60];
  if ((m = e.match(/^~?(\d+(?:\.\d+)?)(?:\s*-\s*(\d+(?:\.\d+)?))?\s*hours?$/i))) return [+m[1], +(m[2] ?? m[1])];
  if ((m = e.match(/^~?(\d+(?:\.\d+)?)(?:\s*-\s*(\d+(?:\.\d+)?))?\s*(?:business |working )?days?$/i))) return [24 * +m[1], 24 * +(m[2] ?? m[1])];
  return null;
}

/** Which family published the estimate: the provider itself, or a comparison source. */
function sourceFamily(source: string, provider: string): string | null {
  if (source.startsWith("monito")) return "monito";
  if (source.startsWith("remitroutes")) return "remitroutes";
  if (source.startsWith("exiap") || source.startsWith("compareremit")) return null;
  if (source.startsWith("wise-direct")) return provider === "wise" ? "own" : null;
  // lemfi-api, skyremit-api, pandaremit-api, ofx-api, ace-html: the provider's own calculator
  return "own";
}

// ── helpers ─────────────────────────────────────────────────────────────────
const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : NaN;
};
const pct = (n: number, d: number) => (d ? Math.round((1000 * n) / d) / 10 : 0);
const round1 = (n: number) => Math.round(n * 10) / 10;
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayOf = (file: string) => file.slice("quotes-".length, "quotes-".length + 10);

interface Row {
  providerSlug?: string;
  provider?: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  deliveryEstimate?: string | null;
  dateCollected?: string;
  source?: string;
}

// ── load the archive once ───────────────────────────────────────────────────
const files = fs.readdirSync(HISTORY).filter((f) => /^quotes-.*\.json\.gz$/.test(f)).sort();
const lastDay = dayOf(files[files.length - 1]);
const daysBefore = (day: string, n: number) => new Date(Date.parse(`${day}T00:00:00Z`) - n * 864e5).toISOString().slice(0, 10);

interface WiseObs { route: string; amount: number; hours: number; weekday: number }
const wiseObs: WiseObs[] = [];
/** provider|route → family → [lower, upper] hours, recent window only */
const recent = new Map<string, Map<string, [number, number][]>>();
const examples = new Map<string, Map<string, number[]>>();
/** day → rows with an estimate, for the test lookups */
const byDay = new Map<string, { key: string; family: string; value: string }[]>();
let firstDay = "";
let firstWiseDay = "";

const recentFrom = daysBefore(lastDay, DISAGREE_DAYS - 1);
const exampleFrom = daysBefore(lastDay, EXAMPLE_DAYS - 1);
const exampleKeys = new Set(EXAMPLES.map(([p, f, t]) => `${p}|${f}-${t}`));

for (const file of files) {
  const day = dayOf(file);
  let rows: Row[];
  try {
    rows = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(HISTORY, file))).toString());
  } catch {
    continue;
  }
  for (const q of rows) {
    if (!q.deliveryEstimate || !q.source) continue;
    const provider = q.providerSlug ?? q.provider ?? "";
    const family = sourceFamily(q.source, provider);
    if (!family) continue;
    const range = estimateHours(q.deliveryEstimate);
    if (!firstDay) firstDay = day;
    const key = `${provider}|${q.sendCurrency}-${q.receiveCurrency}`;

    const list = byDay.get(day) ?? [];
    list.push({ key, family, value: q.deliveryEstimate });
    byDay.set(day, list);

    if (!range) continue;
    if (provider === "wise" && family === "own" && q.dateCollected) {
      if (!firstWiseDay) firstWiseDay = day;
      wiseObs.push({
        route: `${q.sendCurrency}-${q.receiveCurrency}`,
        amount: q.sendAmount,
        hours: range[1],
        weekday: new Date(q.dateCollected).getUTCDay(),
      });
    }
    if (day >= recentFrom) {
      const fam = recent.get(key) ?? new Map<string, [number, number][]>();
      fam.set(family, [...(fam.get(family) ?? []), range]);
      recent.set(key, fam);
    }
    if (day >= exampleFrom && exampleKeys.has(key)) {
      const fam = examples.get(key) ?? new Map<string, number[]>();
      fam.set(family, [...(fam.get(family) ?? []), range[1]]);
      examples.set(key, fam);
    }
  }
}

// ── Wise's own promise: weekday, amount, route ──────────────────────────────
const MINUTE = 1 / 60;
function shares(obs: WiseObs[]) {
  const h = obs.map((o) => o.hours);
  return {
    quotes: obs.length,
    withinMinutePct: pct(h.filter((x) => x <= MINUTE).length, h.length),
    withinHourPct: pct(h.filter((x) => x <= 1).length, h.length),
    withinDayPct: pct(h.filter((x) => x <= 24).length, h.length),
    medianHours: round1(median(h)),
  };
}
const atAmount = wiseObs.filter((o) => o.amount === AMOUNT && MAJOR.has(o.route.slice(0, 3)));
const weekdays = [1, 2, 3, 4, 5, 6, 0].map((d) => ({ day: WEEKDAYS[d], ...shares(atAmount.filter((o) => o.weekday === d)) }));
const weekdayMedian = round1(median(atAmount.filter((o) => o.weekday >= 1 && o.weekday <= 5).map((o) => o.hours)));

const routes = [...new Set(atAmount.map((o) => o.route))].sort();
const routeStats = routes.map((route) => ({ route, ...shares(atAmount.filter((o) => o.route === route)) })).filter((r) => r.quotes > 0);
const nearInstant = routeStats.filter((r) => r.withinMinutePct >= INSTANT_ROUTE_SHARE * 100);
const slowest = [...routeStats].sort((a, b) => b.medianHours - a.medianHours).slice(0, 6);

// Philippines: the amount, not the day, moves the promise (InstaPay caps a transfer at PHP 50,000)
const php = ["USD-PHP", "GBP-PHP"].map((route) => {
  const small = wiseObs.filter((o) => o.route === route && o.amount === 100);
  const large = wiseObs.filter((o) => o.route === route && o.amount === AMOUNT);
  return { route, at100: shares(small), at1000: shares(large) };
});

// ── sources that disagree about the same provider and route ─────────────────
let pairs = 0;
let disagreeing = 0;
for (const fam of recent.values()) {
  if (fam.size < 2) continue;
  pairs++;
  const typical = [...fam.values()].map((rs) => [median(rs.map((r) => r[0])), median(rs.map((r) => r[1]))]);
  const latestStart = Math.max(...typical.map((t) => t[0]));
  const earliestEnd = Math.min(...typical.map((t) => t[1]));
  if (latestStart - earliestEnd >= DISAGREE_HOURS) disagreeing++;
}

const exampleRows = EXAMPLES.map(([provider, from, to]) => {
  const fam = examples.get(`${provider}|${from}-${to}`) ?? new Map<string, number[]>();
  const bySource = Object.fromEntries(
    ["own", "monito", "remitroutes"].map((f) => {
      const h = fam.get(f) ?? [];
      return [f, h.length ? { quotes: h.length, minHours: round1(Math.min(...h)), maxHours: round1(Math.max(...h)), withinMinutePct: pct(h.filter((x) => x <= MINUTE).length, h.length) } : null];
    }),
  );
  return { provider, from, to, ...bySource };
});

// ── what the archive said around each test transfer ─────────────────────────
interface TestFile { transfers: { id: string; provider: string; from: string; to: string; sentDate: string }[] }
const tests = (JSON.parse(fs.readFileSync(TESTS, "utf8")) as TestFile).transfers.map((t) => {
  const key = `${t.provider}|${t.from}-${t.to}`;
  const tally = new Map<string, Map<string, number>>();
  for (let d = -3; d <= 3; d++) {
    const day = daysBefore(t.sentDate, -d);
    for (const r of byDay.get(day) ?? []) {
      if (r.key !== key) continue;
      const values = tally.get(r.family) ?? new Map<string, number>();
      values.set(r.value, (values.get(r.value) ?? 0) + 1);
      tally.set(r.family, values);
    }
  }
  const advertised = [...tally.entries()].map(([source, values]) => ({
    source,
    values: [...values.entries()].sort((a, b) => b[1] - a[1]).map(([value, quotes]) => ({ value, quotes })),
  }));
  return { id: t.id, advertised: advertised.length ? advertised : null, beforeArchive: t.sentDate < firstDay };
});

// ── CFPB: complaints that money was not available when promised ────────────
const CFPB_API = "https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/";
const CFPB_PRODUCT = "Money transfer, virtual currency, or money service•International money transfer";
const CFPB_ISSUE = "Money was not available when promised";
const CFPB_COMPANIES: { slug: string; name: string; company: string; note?: string }[] = [
  { slug: "wise", name: "Wise", company: "TransferWise Ltd" },
  { slug: "remitly", name: "Remitly", company: "Remitly, Inc." },
  { slug: "western-union", name: "Western Union", company: "WESTERN UNION COMPANY, THE" },
  { slug: "moneygram", name: "MoneyGram", company: "MONEYGRAM PAYMENT SYSTEMS WORLDWIDE INC" },
  { slug: "ria", name: "Ria", company: "Ria Envia, LLC" },
  { slug: "worldremit", name: "WorldRemit", company: "WorldRemit Corp." },
  { slug: "sendwave", name: "Sendwave", company: "Chime Inc.", note: "filed under its legal name, Chime Inc." },
  { slug: "taptap-send", name: "TapTap Send", company: "TapTap Send Inc." },
  { slug: "xoom", name: "Xoom", company: "XOOM CORPORATION" },
  { slug: "revolut", name: "Revolut", company: "Revolut Technologies Inc." },
  { slug: "paysend", name: "Paysend", company: "Paysend US LLC" },
];

async function cfpbCount(params: Record<string, string>): Promise<number> {
  const url = `${CFPB_API}?${new URLSearchParams({ size: "0", no_aggs: "true", product: CFPB_PRODUCT, date_received_min: CFPB_FROM, ...params })}`;
  const res = await fetch(url, { headers: { "User-Agent": "sendmoneycompare.com research (build-delivery-speed)" }, signal: AbortSignal.timeout(60_000) });
  if (!res.ok) throw new Error(`CFPB ${res.status}`);
  const json = (await res.json()) as { hits: { total: { value: number } } };
  return json.hits.total.value;
}

async function pullCfpb() {
  const to = new Date().toLocaleDateString("en-CA"); // local yyyy-mm-dd, the day the pull ran
  const providers = [];
  for (const c of CFPB_COMPANIES) {
    const intl = await cfpbCount({ company: c.company, date_received_max: to });
    const delay = await cfpbCount({ company: c.company, issue: CFPB_ISSUE, date_received_max: to });
    providers.push({ ...c, intlComplaints: intl, delayComplaints: delay, sharePct: intl >= CFPB_MIN_COMPLAINTS ? Math.round((100 * delay) / intl) : null });
  }
  return { pulledAt: to, from: CFPB_FROM, to, product: CFPB_PRODUCT, issue: CFPB_ISSUE, minComplaints: CFPB_MIN_COMPLAINTS, licence: "CC0", source: "https://www.consumerfinance.gov/data-research/consumer-complaints/", providers };
}

(async () => {
  let cfpb: unknown = null;
  try {
    cfpb = await pullCfpb();
  } catch (err) {
    const previous = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")).cfpb : null;
    if (!previous) throw new Error(`CFPB pull failed and no previous block to keep: ${(err as Error).message}`);
    console.warn(`WARN CFPB pull failed (${(err as Error).message}); keeping the block from ${previous.pulledAt}`);
    cfpb = previous;
  }

  const out = {
    generatedAt: lastDay,
    archive: { from: firstDay, to: lastDay, snapshots: files.length },
    method: {
      amount: AMOUNT,
      weekday: "UTC day the quote was collected",
      withinMinute: "the estimate is 'Instant' or at most 1 minute",
      businessDay: "counted as 24 hours",
      disagreement: `provider-and-route pairs described by two or more sources in the last ${DISAGREE_DAYS} days; they disagree when the typical ranges (median shortest to median longest time) do not overlap and lie ${DISAGREE_HOURS} hours or more apart`,
    },
    wise: {
      from: firstWiseDay,
      to: lastDay,
      quotes: wiseObs.length,
      routes: new Set(wiseObs.map((o) => o.route)).size,
      majorCurrencies: [...MAJOR],
      majorRoutes: routeStats.length,
      overall: { at100: shares(wiseObs.filter((o) => o.amount === 100)), at1000: shares(atAmount) },
      weekdayMedianHours: weekdayMedian,
      weekdays,
      nearInstantRoutes: nearInstant.length,
      nearInstantShare: INSTANT_ROUTE_SHARE,
      slowest: slowest.map((r) => ({ route: r.route, medianHours: r.medianHours })),
      php,
    },
    disagreement: { from: recentFrom, to: lastDay, pairs, disagreeing, pct: Math.round((100 * disagreeing) / Math.max(1, pairs)) },
    examples: { from: exampleFrom, to: lastDay, rows: exampleRows },
    tests,
    cfpb,
  };
  fs.writeFileSync(OUT, `${JSON.stringify(out, null, 1)}\n`);
  console.log(`Wrote ${OUT}: ${wiseObs.length} Wise estimates (${routeStats.length} major-currency routes at ${AMOUNT}); ${disagreeing}/${pairs} pairs disagree; ${tests.length} tests`);
})();
