/**
 * Builds src/data/scraped/ppp-index.json — the dataset behind
 * /tools/salary-abroad ("what is your salary actually worth abroad?").
 *
 * WHAT IT ANSWERS
 * Every salary/cost-of-living calculator on the web converts your money at the
 * mid-market rate, for free. Nobody actually pays that rate. If you earn in one
 * currency and live in another, you lose a spread on every transfer — and our
 * own quote archive shows that spread ranges from 0.30% (Wise) to 4.76%
 * (PayPal), a ~16x difference on the same transfer. On a $60k salary that is
 * $180/yr versus $2,856/yr. This dataset lets the tool put both numbers on
 * screen: how much further your money goes, and how much of that advantage the
 * transfer itself takes back.
 *
 * WHY WORLD BANK AND NOT NUMBEO
 * Numbeo is free only for personal, academic and journalistic use; commercial
 * use needs a $260+/mo licence and republishing indices through a public-facing
 * feed needs their written consent. It is also crowdsourced self-reported data,
 * which is the single most common criticism levelled at charts built on it.
 * World Bank household-consumption PPP (PA.NUS.PRVT.PP) is official
 * International Comparison Program data, free, needs no API key, and is
 * defensible under scrutiny. The trade-off is country-level rather than
 * city-level granularity, which we state plainly in the UI.
 *
 * PPP conversion factor = units of local currency needed to buy what 1 USD buys
 * in the United States. Dividing the market rate by the PPP factor gives the
 * purchasing-power multiplier: >1 means your money goes further there.
 *
 * Usage: npx tsx scripts/build-ppp-index.ts
 */

import * as fs from "fs";
import * as path from "path";

const OUT = path.join("src/data/scraped/ppp-index.json");
const MIDMARKET = path.join("src/data/scraped/history/midmarket-daily.json");
const WB_INDICATOR = "PA.NUS.PRVT.PP"; // household + NPISH final consumption PPP
// mrv=5 (most recent 5 values) rather than mrnev=1 (most recent NON-EMPTY):
// mrnev returns an XML error on this endpoint, and per_page above ~1000 500s.
// Pulling 5 years and taking each country's latest non-null keeps countries
// whose most recent year happens to be unreported.
const WB_URL = `https://api.worldbank.org/v2/country/all/indicator/${WB_INDICATOR}?format=json&per_page=1000&mrv=5`;

// ISO2 -> currency, restricted to currencies we actually hold mid-market rates
// for. Eurozone members all map to EUR. Anything not listed is dropped rather
// than guessed: a wrong currency here silently produces a wrong multiplier.
const COUNTRY_CURRENCY: Record<string, string> = {
  US: "USD", GB: "GBP", CA: "CAD", AU: "AUD", NZ: "NZD", CH: "CHF", JP: "JPY",
  CN: "CNY", HK: "HKD", SG: "SGD", KR: "KRW", TW: "TWD", IN: "INR", PK: "PKR",
  BD: "BDT", LK: "LKR", NP: "NPR", PH: "PHP", VN: "VND", ID: "IDR", TH: "THB",
  MY: "MYR", AE: "AED", SA: "SAR", QA: "QAR", KW: "KWD", BH: "BHD", OM: "OMR",
  JO: "JOD", IL: "ILS", TR: "TRY", EG: "EGP", MA: "MAD", ZA: "ZAR", NG: "NGN",
  GH: "GHS", KE: "KES", TZ: "TZS", UG: "UGX", RW: "RWF", ZM: "ZMW", ET: "ETB",
  MX: "MXN", BR: "BRL", AR: "ARS", CL: "CLP", CO: "COP", PE: "PEN", BO: "BOB",
  GT: "GTQ", HN: "HNL", DO: "DOP", JM: "JMD", PL: "PLN", CZ: "CZK", HU: "HUF",
  RO: "RON", NO: "NOK", SE: "SEK", DK: "DKK", UA: "UAH", FJ: "FJD",
  // Eurozone
  AT: "EUR", BE: "EUR", CY: "EUR", EE: "EUR", FI: "EUR", FR: "EUR", DE: "EUR",
  GR: "EUR", IE: "EUR", IT: "EUR", LV: "EUR", LT: "EUR", LU: "EUR", MT: "EUR",
  NL: "EUR", PT: "EUR", SK: "EUR", SI: "EUR", ES: "EUR", HR: "EUR",
  // CFA zones share a peg to EUR but are distinct currencies we do hold
  CM: "XAF", SN: "XOF", CI: "XOF",
};

interface WBRow {
  countryiso3code?: string;
  country?: { id?: string; value?: string };
  date?: string;
  value?: number | null;
}

async function main(): Promise<void> {
  // Latest mid-market rates (base USD, units per USD).
  const hist = JSON.parse(fs.readFileSync(MIDMARKET, "utf-8")) as { date: string; rates: Record<string, number> }[];
  const latest = hist[hist.length - 1];
  const rates: Record<string, number> = { USD: 1, ...latest.rates };

  process.stdout.write(`Mid-market base: ${latest.date} (${Object.keys(latest.rates).length} currencies)\n`);

  // Paginate — mrv=5 across ~265 countries exceeds one page.
  const allRows: WBRow[] = [];
  let page = 1;
  let pages = 1;
  do {
    const res = await fetch(`${WB_URL}&page=${page}`);
    if (!res.ok) throw new Error(`World Bank API ${res.status} on page ${page}`);
    const json = (await res.json()) as [{ pages?: number }, WBRow[]];
    pages = json[0]?.pages ?? 1;
    allRows.push(...(json[1] ?? []));
    page++;
  } while (page <= pages);

  // Collapse to one row per country: the most recent year with a real value.
  const latestByCountry = new Map<string, WBRow>();
  for (const r of allRows) {
    const id = r.country?.id;
    if (!id || typeof r.value !== "number") continue;
    const prev = latestByCountry.get(id);
    if (!prev || (r.date ?? "") > (prev.date ?? "")) latestByCountry.set(id, r);
  }
  const rows = [...latestByCountry.values()];
  process.stdout.write(`World Bank: ${allRows.length} rows over ${pages} page(s) -> ${rows.length} countries with a value\n`);

  const countries: {
    iso2: string; iso3: string; name: string; currency: string;
    ppp: number; pppYear: string; rate: number; multiplier: number;
  }[] = [];
  const skipped: string[] = [];

  for (const r of rows) {
    const iso2 = r.country?.id;
    const name = r.country?.value;
    const ppp = r.value;
    if (!iso2 || !name || typeof ppp !== "number" || ppp <= 0) continue;

    const currency = COUNTRY_CURRENCY[iso2];
    // World Bank "countries" include aggregates (World, Euro area, OECD...).
    // Those have no ISO2 in our map, so they fall out here along with genuine
    // countries whose currency we don't price. Both are correct to drop.
    if (!currency) { skipped.push(`${iso2} ${name}`); continue; }

    const rate = rates[currency];
    if (!rate || rate <= 0) { skipped.push(`${iso2} ${name} (no rate for ${currency})`); continue; }

    // multiplier > 1 => 1 USD of income buys MORE there than in the US.
    const multiplier = rate / ppp;
    if (!isFinite(multiplier) || multiplier <= 0 || multiplier > 20) {
      skipped.push(`${iso2} ${name} (implausible multiplier ${multiplier.toFixed(2)})`);
      continue;
    }

    countries.push({
      iso2,
      iso3: r.countryiso3code ?? "",
      name,
      currency,
      ppp: Math.round(ppp * 1e6) / 1e6,
      pppYear: r.date ?? "",
      rate: Math.round(rate * 1e6) / 1e6,
      multiplier: Math.round(multiplier * 1000) / 1000,
    });
  }

  countries.sort((a, b) => b.multiplier - a.multiplier);

  const years = [...new Set(countries.map((c) => c.pppYear))].sort();
  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "World Bank, International Comparison Program (PA.NUS.PRVT.PP)",
    indicator: WB_INDICATOR,
    rateDate: latest.date,
    pppYears: { from: years[0], to: years[years.length - 1] },
    countryCount: countries.length,
    countries,
  };

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
  process.stdout.write(
    `Wrote ${OUT}\n` +
      `  ${countries.length} countries, PPP years ${out.pppYears.from}-${out.pppYears.to}\n` +
      `  dropped ${skipped.length} (aggregates + unpriced currencies)\n` +
      `  strongest: ${countries.slice(0, 3).map((c) => `${c.name} ${c.multiplier}x`).join(", ")}\n` +
      `  weakest:   ${countries.slice(-3).map((c) => `${c.name} ${c.multiplier}x`).join(", ")}\n`,
  );
}

main().catch((e) => { console.error(e); process.exit(1); });
