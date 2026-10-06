/**
 * Builds src/data/research/reader-pulse.json — the 30-day lines on the live
 * activity strip (src/components/live-activity/): what readers' provider
 * choices were worth, and the countries they read from.
 *
 * Input: a saved GA4 pull (--input=<file>, the Pull shape below) of
 *   - `provider_clicked` users per day × corridor × provider, last 60 days
 *     (China and Singapore excluded for the Sep 2026 browser-spoofing bot
 *     waves), each choice priced against that day's archived comparison with
 *     the same rules as the September study (scripts/lib/reader-choice-pricing.ts);
 *   - countries with engaged sessions in the last 30 days, for the flag line.
 * GA4 is read through the reporting API by hand (the Composio connection);
 * the site's org blocks service-account keys, so no workflow can pull it.
 *
 * The output holds medians per $1,000 and a country list, no sample sizes; the
 * counts are printed here so a run can be checked.
 *
 * Window: the last 30 days, widened to 60 when 30 days hold fewer than
 * MIN_PRICED priced choices. Below that even at 60 days the file is left as
 * it is. The strip drops these lines 45 days past their window.
 *
 * Usage: npx tsx scripts/build-reader-pulse.ts --input=reader-pulse-ga4.json
 */

import fs from "fs";
import {
  normalizeSlug, loadMidmarketByDay, lastSnapshotByDate, loadPools, priceChoices, summarise, type Choice,
} from "./lib/reader-choice-pricing";

const OUT = "src/data/research/reader-pulse.json";

const MIN_PRICED = 60;
/** The bank comparison is shown only when this many choices had a bank quote beside them. */
const MIN_BANK = 30;
/** A country joins the strip with this much evidence of a person reading, not a bot passing. */
const MIN_ENGAGED_SESSIONS = 2;
const MIN_ENGAGEMENT_SECONDS = 30;
/**
 * Not shown even when readers arrive from them: a flag there would read as a
 * place the compared providers serve. Comprehensively sanctioned jurisdictions,
 * plus Russia and Belarus, where the providers we list do not pay out.
 */
const NOT_SHOWN = new Set(["CU", "IR", "KP", "SY", "RU", "BY"]);

interface Pull {
  pulledAt: string;
  clicksWindow: { from: string; to: string };
  countriesWindow: { from: string; to: string };
  /** [YYYYMMDD, corridor as sent ("USD-INR", sometimes "USD_INR" or ""), provider, users] */
  clicks: [string, string, string, number][];
  /** [ISO 3166-1 alpha-2, engaged sessions, engagement seconds] */
  countries: [string, number, number][];
}

const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

function loadPull(): Pull | null {
  const inputArg = process.argv.find((a) => a.startsWith("--input="));
  if (!inputArg) {
    console.log("Usage: npx tsx scripts/build-reader-pulse.ts --input=<saved GA4 pull>");
    return null;
  }
  return JSON.parse(fs.readFileSync(inputArg.slice("--input=".length), "utf-8")) as Pull;
}

/** "USD_INR" and "usd-inr" are the same route; "", "business_compare" and "USD-USD" are not routes. */
function corridorOf(raw: string): string | null {
  const c = raw.trim().toUpperCase().replace("_", "-");
  return /^[A-Z]{3}-[A-Z]{3}$/.test(c) && c.slice(0, 3) !== c.slice(4) ? c : null;
}

function choicesFrom(pull: Pull): Choice[] {
  const merged = new Map<string, Choice>();
  for (const [ymd, rawCorridor, rawProvider, users] of pull.clicks) {
    const corridor = corridorOf(rawCorridor);
    if (!corridor || !rawProvider || !(users > 0) || !/^\d{8}$/.test(ymd)) continue;
    const date = `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
    const provider = normalizeSlug(rawProvider);
    const key = `${date}|${corridor}|${provider}`;
    const prev = merged.get(key);
    if (prev) prev.users += users;
    else merged.set(key, { date, corridor, provider, users });
  }
  return [...merged.values()].sort((a, b) => a.date.localeCompare(b.date) || a.corridor.localeCompare(b.corridor));
}

function priceWindow(choices: Choice[], from: string, to: string) {
  const inWindow = choices.filter((c) => c.date >= from && c.date <= to);
  const needed = new Map<string, Set<string>>();
  for (const c of inWindow) (needed.get(c.date) ?? needed.set(c.date, new Set()).get(c.date)!).add(c.corridor);
  const pools = loadPools(needed, lastSnapshotByDate(from, to), loadMidmarketByDay());
  const { priced, excluded } = priceChoices(inWindow, pools);
  return { from, to, choices: inWindow.reduce((s, c) => s + c.users, 0), excluded, totals: summarise(priced) };
}

function main() {
  const pull = loadPull();
  if (!pull) return;

  const choices = choicesFrom(pull);
  const to = pull.clicksWindow.to;
  let window = priceWindow(choices, addDays(to, -29), to);
  if (window.totals.pricedDecisions < MIN_PRICED) window = priceWindow(choices, pull.clicksWindow.from, to);
  console.log(
    `Choices ${window.from}..${window.to}: ${window.choices} with a corridor, ${window.totals.pricedDecisions} priced, ` +
      `${window.totals.bankDecisions} beside a bank quote; excluded ${JSON.stringify(window.excluded)}`,
  );
  if (window.totals.pricedDecisions < MIN_PRICED) {
    console.log(`::warning::Only ${window.totals.pricedDecisions} priced choices in 60 days (need ${MIN_PRICED}) — reader pulse keeps its committed figures.`);
    return;
  }

  const countries = pull.countries
    .filter(([code, engaged, seconds]) =>
      /^[A-Z]{2}$/.test(code) && !NOT_SHOWN.has(code) && engaged >= MIN_ENGAGED_SESSIONS && seconds >= MIN_ENGAGEMENT_SECONDS)
    .sort((a, b) => b[1] - a[1] || b[2] - a[2] || a[0].localeCompare(b[0]))
    .map(([code]) => code);
  console.log(`Countries ${pull.countriesWindow.from}..${pull.countriesWindow.to}: ${countries.length} of ${pull.countries.length} pass the engagement bar`);

  const t = window.totals;
  const figures = {
    pulledAt: pull.pulledAt,
    choices: {
      from: window.from,
      to: window.to,
      /** Median, per $1,000: the chosen provider's payout over the median bank quote on the route that day. */
      vsBankPer1000: t.bankDecisions >= MIN_BANK ? t.medianVsBankPer1000 : null,
      /** Share of choices paying more than the route's median quote that day. */
      shareAboveMedian: t.shareAboveMedian,
      /** Share of choices that were one of the day's three highest payouts. */
      shareTop3: t.shareTop3,
      shareTopPayer: t.shareTopPayer,
    },
    countries: { from: pull.countriesWindow.from, to: pull.countriesWindow.to, codes: countries },
  };

  // Rewrite only when a figure moved, so an unchanged pull does not commit a
  // timestamp every 6 hours.
  const previous = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf-8")) : null;
  const strip = (o: Record<string, unknown> | null) => (o ? JSON.stringify({ ...o, generatedAt: undefined, pulledAt: undefined }) : "");
  if (strip(previous) === strip(figures)) {
    console.log(`${OUT} unchanged`);
  } else {
    fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), ...figures }, null, 1) + "\n");
    console.log(`Wrote ${OUT}: ${JSON.stringify(figures.choices)}`);
  }
}

main();
