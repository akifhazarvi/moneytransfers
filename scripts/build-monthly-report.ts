/**
 * Monthly money transfer price report → src/data/research/monthly-cost-report.json
 *
 *   npx tsx scripts/build-monthly-report.ts
 *
 * Run by hand after a month closes (like build-reader-pulse.ts); the page shows
 * the file's own generatedAt and month labels, so a stale edition reads as stale.
 *
 * Input: the guarded daily series aggregate-history.ts writes to
 * src/data/scraped/history/corridors/{FROM}-{TO}.json (one row per day and
 * provider for a 100-unit send, after source tiering and the quote-integrity
 * guards) and the USD-based mid-market closes in history/midmarket-daily.json.
 * Nothing is re-scraped or re-merged here, so this report cannot disagree with
 * the history the rest of the site reads.
 *
 * Definitions (as in the Remittance Cost Index):
 *   total cost %  = 1 − receiveAmount ÷ (100 × mid): fee plus margin, kept only
 *                   inside [−2%, 40%) like trueCostPct();
 *   bank vs specialist = providerKind() from remittance-cost-index.ts.
 *
 * WHY A FIXED PANEL (found 2026-11-15, building the first edition): coverage
 * grows. In October the Gulf scraper added Western Union, Al Ansari and e&
 * money on AED routes, and AED→INR's top payout "got 3 points cheaper" with no
 * price moving. So every figure here uses only route+provider pairs quoted on
 * at least MIN_DAYS days in EVERY month shown: a change is then the same
 * providers on the same routes charging differently. Routes involving a
 * PARALLEL_RATE_CURRENCIES currency are left out: there the mid-market
 * benchmark itself is unreliable (USD→NGN reads as beating mid-market).
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { providerKind } from "../src/lib/remittance-cost-index";
import { PARALLEL_RATE_CURRENCIES } from "../src/lib/quote-integrity";
import { getProviderName, HIDDEN_PROVIDER_SLUGS } from "../src/data/providers";

const ROOT = join(__dirname, "..");
const HISTORY = join(ROOT, "src/data/scraped/history");
const OUT = join(ROOT, "src/data/research/monthly-cost-report.json");
const AMOUNT = 100;
const MIN_DAYS = 10;

type Row = { receiveAmount: number };
type Day = { date: string; providers: Record<string, Row> };
type Obs = { date: string; slug: string; pct: number; receive: number };

const median = (xs: number[]) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const r2 = (n: number | null) => (n === null ? null : Math.round(n * 100) / 100);

const mid = new Map<string, Record<string, number>>(
  (JSON.parse(readFileSync(join(HISTORY, "midmarket-daily.json"), "utf8")) as { date: string; rates: Record<string, number> }[]).map(
    (d) => [d.date, { USD: 1, ...d.rates }],
  ),
);

// ── 1. Every usable observation, by route ──────────────────────────────────
const byRoute = new Map<string, Obs[]>();
for (const file of readdirSync(join(HISTORY, "corridors")).filter((f) => f.endsWith(".json"))) {
  const route = file.replace(/\.json$/, "");
  const [from, to] = route.split("-");
  if (PARALLEL_RATE_CURRENCIES.has(from) || PARALLEL_RATE_CURRENCIES.has(to)) continue;
  const obs: Obs[] = [];
  for (const day of JSON.parse(readFileSync(join(HISTORY, "corridors", file), "utf8")) as Day[]) {
    const rates = mid.get(day.date);
    if (!rates?.[from] || !rates?.[to]) continue;
    const midRate = rates[to] / rates[from];
    for (const [slug, row] of Object.entries(day.providers)) {
      if (HIDDEN_PROVIDER_SLUGS.has(slug) || !(row.receiveAmount > 0)) continue;
      const pct = (1 - row.receiveAmount / (AMOUNT * midRate)) * 100;
      if (Number.isFinite(pct) && pct >= -2 && pct < 40) obs.push({ date: day.date, slug, pct, receive: row.receiveAmount });
    }
  }
  if (obs.length) byRoute.set(route, obs);
}

// ── 2. Months shown and the route+provider panel ───────────────────────────
// The first month in the archive is partial (collection began mid-month), so
// it is left out; the current month is shown to date and labelled as such.
const allMonths = [...new Set([...byRoute.values()].flatMap((o) => o.map((x) => x.date.slice(0, 7))))].sort();
const monthsShown = allMonths.slice(1);
const today = new Date().toISOString().slice(0, 10);
const currentMonth = today.slice(0, 7);

const daysPerPairMonth = new Map<string, Map<string, Set<string>>>(); // "route|slug" → month → dates
for (const [route, obs] of byRoute) {
  for (const o of obs) {
    const key = `${route}|${o.slug}`;
    let m = daysPerPairMonth.get(key);
    if (!m) daysPerPairMonth.set(key, (m = new Map()));
    const month = o.date.slice(0, 7);
    let s = m.get(month);
    if (!s) m.set(month, (s = new Set()));
    s.add(o.date);
  }
}
const panelPairs = new Set(
  [...daysPerPairMonth.entries()]
    .filter(([, m]) => monthsShown.every((month) => (m.get(month)?.size ?? 0) >= MIN_DAYS))
    .map(([key]) => key),
);
const panelRoutes = new Set([...panelPairs].map((k) => k.split("|")[0]));

// ── 3. Monthly figures over the panel ──────────────────────────────────────
interface MonthAcc {
  specialist: number[];
  bank: number[];
  topPayout: number[];
  contestedDays: number;
  rotated: number;
  ledDays: Map<string, number>;
}
const acc = new Map<string, MonthAcc>(monthsShown.map((m) => [m, { specialist: [], bank: [], topPayout: [], contestedDays: 0, rotated: 0, ledDays: new Map() }]));
/** route → month → slug → that provider's costs, for the movers. */
const pairCosts = new Map<string, Map<string, Map<string, number[]>>>();

for (const route of panelRoutes) {
  const obs = byRoute.get(route)!.filter((o) => panelPairs.has(`${route}|${o.slug}`));
  const byDate = new Map<string, Obs[]>();
  for (const o of obs) {
    if (!byDate.has(o.date)) byDate.set(o.date, []);
    byDate.get(o.date)!.push(o);
    const month = o.date.slice(0, 7);
    let rm = pairCosts.get(route);
    if (!rm) pairCosts.set(route, (rm = new Map()));
    let mm = rm.get(month);
    if (!mm) rm.set(month, (mm = new Map()));
    if (!mm.has(o.slug)) mm.set(o.slug, []);
    mm.get(o.slug)!.push(o.pct);
  }
  const leadersByMonth = new Map<string, string[]>();
  for (const [date, day] of byDate) {
    const month = date.slice(0, 7);
    const a = acc.get(month);
    if (!a || day.length < 2) continue; // a contested day needs two panel providers
    const top = day.reduce((x, y) => (y.receive > x.receive ? y : x));
    a.contestedDays++;
    a.topPayout.push(top.pct);
    for (const o of day) (providerKind(o.slug, getProviderName(o.slug)) === "bank" ? a.bank : a.specialist).push(o.pct);
    if (!leadersByMonth.has(month)) leadersByMonth.set(month, []);
    leadersByMonth.get(month)!.push(top.slug);
  }
  for (const [month, leaders] of leadersByMonth) {
    const a = acc.get(month)!;
    const counts = new Map<string, number>();
    for (const l of leaders) counts.set(l, (counts.get(l) ?? 0) + 1);
    const usual = [...counts.entries()].sort((x, y) => y[1] - x[1])[0][0];
    a.rotated += leaders.filter((l) => l !== usual).length;
    for (const [l, n] of counts) a.ledDays.set(l, (a.ledDays.get(l) ?? 0) + n);
  }
}

const months = monthsShown.map((month) => {
  const a = acc.get(month)!;
  return {
    month,
    toDate: month === currentMonth ? today : null,
    contestedDays: a.contestedDays,
    specialistMedianPct: r2(median(a.specialist)),
    bankMedianPct: r2(median(a.bank)),
    topPayoutMedianPct: r2(median(a.topPayout)),
    specialistQuotes: a.specialist.length,
    bankQuotes: a.bank.length,
    /** Route-days on which the top payout went to someone other than that route's most frequent leader that month. */
    rotationPct: a.contestedDays ? Math.round((a.rotated / a.contestedDays) * 1000) / 10 : null,
    // No "most days at the top" field: the panel keeps only providers quoted in
    // every month since April, so its leader (InstaReM on the first run) is not
    // the site-wide leader {{TOP_LEADER}} reads, and two answers to "who leads"
    // would contradict each other. Leadership is reported by the consistency index.
  };
});

// ── 4. Movers: same providers, same route, latest complete month vs previous ──
const complete = months.filter((m) => m.month < currentMonth);
const latest = complete.at(-1)?.month ?? null;
const previous = complete.at(-2)?.month ?? null;
const movers =
  latest && previous
    ? [...panelRoutes]
        .map((route) => {
          const now = pairCosts.get(route)?.get(latest);
          const before = pairCosts.get(route)?.get(previous);
          if (!now || !before) return null;
          // Per provider, its median cost this month minus last; the route moves by the median of those.
          const changes = [...now.keys()].filter((s) => before.has(s)).map((s) => median(now.get(s)!)! - median(before.get(s)!)!);
          if (changes.length < 3) return null; // a move by one or two providers is not a route trend
          return { route: route.replace("-", " → "), providers: changes.length, changePts: r2(median(changes))! };
        })
        .filter((x): x is { route: string; providers: number; changePts: number } => x !== null && x.changePts !== 0)
        .sort((a, b) => a.changePts - b.changePts)
    : [];

const report = {
  generatedAt: new Date().toISOString(),
  amountUnits: AMOUNT,
  method:
    "Total cost = fee plus exchange-rate margin as a share of a 100-unit send, against that day's mid-market close, from the guarded daily history. Only route-and-provider pairs quoted on 10+ days in every month shown, so month-to-month changes are price changes, not coverage changes. Routes involving NGN, ARS, ETB and other parallel-rate currencies are excluded.",
  panel: { routes: panelRoutes.size, providerRoutePairs: panelPairs.size, minDaysPerMonth: MIN_DAYS },
  latestCompleteMonth: latest,
  previousMonth: previous,
  months,
  movers: { cheaper: movers.slice(0, 5), dearer: movers.slice(-5).reverse().filter((m) => m.changePts > 0) },
};

writeFileSync(OUT, JSON.stringify(report, null, 2) + "\n");
console.log(`build-monthly-report: ${panelRoutes.size} routes, ${panelPairs.size} route+provider pairs, ${months.length} months → ${OUT}`);
for (const s of months)
  console.log(
    `  ${s.month}${s.toDate ? " (to date)" : ""}  days ${s.contestedDays}  specialist ${s.specialistMedianPct}% (${s.specialistQuotes})  bank ${s.bankMedianPct}% (${s.bankQuotes})  top ${s.topPayoutMedianPct}%  rotation ${s.rotationPct}%`,
  );
console.log("  cheaper:", report.movers.cheaper.map((m) => `${m.route} ${m.changePts} (${m.providers})`).join(", "));
console.log("  dearer:", report.movers.dearer.map((m) => `${m.route} +${m.changePts} (${m.providers})`).join(", "));
