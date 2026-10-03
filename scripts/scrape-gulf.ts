/**
 * Gulf operators — what a sender in Saudi Arabia, the UAE, Kuwait, Qatar, Oman
 * or Bahrain actually pays.
 *
 * WHY
 * On 2026-10-03 every provider we scraped was probed for Gulf senders: Wise
 * rejects SAR/KWD/QAR/OMR/BHD (HTTP 422) and offers AED only from a balance,
 * Remitly sends from the UAE only, Ria answers "Country not available", XE
 * serves EU/UK/US/CA/AU/NZ senders only, TapTap sends from AED and BHD only.
 * Saudi→India — the most-visited corridor page — was left with two gap-fill
 * rows. These operators are how Gulf residents really send.
 *
 * SOURCES (anonymous public endpoints, each verified 2026-10-03)
 *  - Western Union (SA, AE, KW, BH): POST /wuconnect/prices/catalog with the
 *    country's client code, read from `sender_country_config` on
 *    /{cc}/en/web/send-money/start (`clientProd`). Returns rate AND fee per
 *    amount. The fee is charged on top (receive = send × rate), so rows are
 *    restated to the site's convention: receive = (send − fee) × rate. Funding
 *    is cash at an agent (`fund_in: CA`), the retail price. QA answers 301 and
 *    OM 503 — no client code to read.
 *  - e& money (UAE): GET /en/home.moneyexchangerate.html. Rate per delivery
 *    option plus fee (AED 15) and VAT (AED 0.75), both paid by the sender.
 *  - Al Ansari Exchange (UAE): its public converter gives the rate, not the
 *    fee; the fee comes from its published schedule in PUBLISHED_FEES, with the
 *    source. A destination with no published fee is SKIPPED — never priced at
 *    0, which is how the Wise placeholder showed 0% / $0 on every Gulf route
 *    (CLAUDE.md failure mode 13). Lulu's UAE fees are published too, but its
 *    rate feed is not yet confirmed (luluProbe).
 *
 * New routes show in the comparison only: corridor pages are capped by
 * src/data/corridor-page-allowlist.ts (strict rule 13).
 *
 * One output file for all operators. An operator that returns nothing this run
 * keeps its previous rows, which the merge layer's 72h stale gate then expires.
 */
import * as fs from "fs";
import * as path from "path";
import { sendAmountsFor, type ProviderQuote } from "./lib/browser";
import { roundRate } from "./lib/scrape-budget";

const OUTPUT = path.join(__dirname, "..", "src", "data", "scraped", "gulf-quotes.json");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const NOW = new Date().toISOString();

/** Destinations the Gulf diaspora sends to, with the codes each API wants. */
const DESTS = [
  { cc: "IN", iso3: "IND", cur: "INR" },
  { cc: "PK", iso3: "PAK", cur: "PKR" },
  { cc: "PH", iso3: "PHL", cur: "PHP" },
  { cc: "BD", iso3: "BGD", cur: "BDT" },
  { cc: "EG", iso3: "EGY", cur: "EGP" },
  { cc: "NP", iso3: "NPL", cur: "NPR" },
  { cc: "LK", iso3: "LKA", cur: "LKR" },
] as const;
type Dest = (typeof DESTS)[number]["cur"];

/**
 * Fees published by rate-only operators, in the SEND currency, for a transfer
 * credited to a bank account, as the operator states them. Bands are checked in
 * order: the first whose `below` exceeds the amount applies, else the last. A
 * missing destination means no published fee, and that route is not shown.
 * Checked 2026-10-03; each entry cites the operator's own page.
 *
 * Not here, on purpose: Al Fardan (fee page behind a bot challenge, key-facts
 * PDF gives only "Max AED 200"), GCC Exchange ("can vary"), Al Dar and Musandam
 * (no fee published), Lulu outside the UAE (none published), and Al Ansari to
 * the Philippines (a further PHP 100–225 is deducted at payout, amount unstated).
 */
type Bands = { below?: number; fee: number }[];
const PUBLISHED_FEES: Record<string, { fees: Partial<Record<Dest, Bands>>; source: string }> = {
  // "Remittance Service Charges", alansariexchange.com/service/remittances/
  // (page dateModified 2024-12-23): "Below AED 1,000 – AED 18.57 Above AED
  // 1,000 – AED 25.24". VAT is not stated separately; the figures are the
  // sender's charge as published.
  "al-ansari-exchange": {
    source: "https://alansariexchange.com/service/remittances/",
    fees: {
      INR: [{ below: 1000, fee: 18.57 }, { fee: 25.24 }],
      BDT: [{ below: 1000, fee: 18.57 }, { fee: 25.24 }],
      LKR: [{ below: 1000, fee: 18.57 }, { fee: 25.24 }],
      NPR: [{ below: 1000, fee: 18.57 }, { fee: 25.24 }],
      PKR: [{ below: 740, fee: 20 }, { fee: 0 }],
      EGP: [{ below: 1500, fee: 17.38 }, { fee: 20 }],
    },
  },
  // "Customer Charges including VAT", luluexchange.com/wp-content/uploads/2025/07/
  // Service-cahrges-2025.pdf (July 2025): India/Bangladesh/Sri Lanka/Nepal
  // 19.50 / 26.50 either side of AED 1,000; Philippines 21; Pakistan 19.25
  // below AED 735, no charge above; Egypt 18.25 / 21 either side of AED 1,500.
  "lulu-exchange": {
    source: "https://luluexchange.com/wp-content/uploads/2025/07/Service-cahrges-2025.pdf",
    fees: {
      INR: [{ below: 1000, fee: 19.5 }, { fee: 26.5 }],
      BDT: [{ below: 1000, fee: 19.5 }, { fee: 26.5 }],
      LKR: [{ below: 1000, fee: 19.5 }, { fee: 26.5 }],
      NPR: [{ below: 1000, fee: 19.5 }, { fee: 26.5 }],
      PHP: [{ fee: 21 }],
      PKR: [{ below: 735, fee: 19.25 }, { fee: 0 }],
      EGP: [{ below: 1500, fee: 18.25 }, { fee: 21 }],
    },
  },
};

function feeFor(bands: Bands, amount: number): number {
  return (bands.find((b) => b.below !== undefined && amount < b.below) ?? bands[bands.length - 1]).fee;
}

function quote(
  provider: string,
  providerSlug: string,
  sendCurrency: string,
  receiveCurrency: string,
  sendAmount: number,
  fee: number,
  rate: number,
  source: string,
  extra: Partial<ProviderQuote> = {},
): ProviderQuote {
  return {
    provider,
    providerSlug,
    providerType: "moneyTransferProvider",
    sendCurrency,
    receiveCurrency,
    sendAmount,
    fee: Math.round(fee * 100) / 100,
    exchangeRate: roundRate(rate),
    receiveAmount: Math.round(Math.max(0, sendAmount - fee) * rate * 100) / 100,
    paymentMethod: null,
    deliveryMethod: "Bank Deposit",
    deliveryEstimate: null,
    dateCollected: NOW,
    source,
    ...extra,
  };
}

async function get(url: string, init: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: { "User-Agent": UA, Accept: "application/json, text/html", ...(init.headers ?? {}) },
    signal: AbortSignal.timeout(30_000),
  });
}

/** Run tasks with at most `limit` in flight. */
async function pool<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const out: T[] = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (next < tasks.length) {
        const i = next++;
        out[i] = await tasks[i]();
      }
    }),
  );
  return out;
}

// ── Western Union ────────────────────────────────────────────────────────────
const WU_COUNTRIES = [
  { cc: "SA", cur: "SAR" },
  { cc: "AE", cur: "AED" },
  { cc: "KW", cur: "KWD" },
  { cc: "BH", cur: "BHD" },
];

async function wuClient(cc: string): Promise<{ client: string; channel: string } | null> {
  const res = await get(`https://www.westernunion.com/${cc.toLowerCase()}/en/web/send-money/start`);
  if (!res.ok) return null;
  const html = await res.text();
  const m = new RegExp(
    `"${cc}":\\{"moduleGQLConfig":\\{"eco":\\{"product":\\{"origination":\\{"channel":"(\\w+)","client":"\\w+","clientProd":"(\\w+)"`,
  ).exec(html);
  return m ? { channel: m[1], client: m[2] } : null;
}

interface WuPayGroup { fx_rate?: number; gross_fee?: number }
interface WuGroup { service?: string; service_name?: string; pay_groups?: WuPayGroup[] }

async function westernUnion(): Promise<ProviderQuote[]> {
  const rows: ProviderQuote[] = [];
  for (const { cc, cur } of WU_COUNTRIES) {
    const cfg = await wuClient(cc).catch(() => null);
    if (!cfg) {
      console.log(`  ✗ Western Union ${cc}: no client code on the start page`);
      continue;
    }
    const tasks = DESTS.flatMap((d) =>
      sendAmountsFor(cur).map((amount) => async () => {
        const body = {
          header_request: { version: "0.5", request_type: "PRICECATALOG" },
          sender: { client: cfg.client, channel: cfg.channel, funds_in: "*", curr_iso3: cur, cty_iso2_ext: cc, send_amount: String(amount) },
          receiver: { curr_iso3: d.cur, cty_iso2_ext: d.cc, cty_iso2: d.cc },
        };
        try {
          const res = await get("https://www.westernunion.com/wuconnect/prices/catalog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          if (!res.ok) return null;
          const json = (await res.json()) as { services_groups?: WuGroup[] };
          const groups = json.services_groups ?? [];
          // Bank deposit ("DIRECT TO BANK", service 500) is what every other
          // row in the comparison prices; cash pickup is the fallback.
          const bank = groups.find((g) => g.service === "500");
          const group = bank ?? groups.find((g) => g.service === "000");
          const pg = group?.pay_groups?.[0];
          if (!pg?.fx_rate) return null;
          return quote("Western Union", "western-union", cur, d.cur, amount, Number(pg.gross_fee) || 0, Number(pg.fx_rate), "gulf-western-union", {
            paymentMethod: "Cash at agent",
            deliveryMethod: bank ? "Bank Deposit" : "Cash Pickup",
          });
        } catch {
          return null;
        }
      }),
    );
    const got = (await pool(tasks, 4)).filter((q): q is ProviderQuote => !!q);
    console.log(`  ${got.length ? "✓" : "✗"} Western Union ${cc}: ${got.length}/${tasks.length} quotes`);
    rows.push(...got);
  }
  return rows;
}

// ── e& money (UAE) ───────────────────────────────────────────────────────────
/** USD 100 at the AED's 3.6725 peg. */
const E_AND_PKR_FREE_ABOVE_AED = 367.25;
interface EandRate { exchangeRate?: string; fee?: { amount?: string }; vat?: string; deliveryOptionText?: string }

async function eandMoney(): Promise<ProviderQuote[]> {
  const rows: ProviderQuote[] = [];
  for (const d of DESTS) {
    try {
      const res = await get(
        `https://www.eandmoney.com/en/home.moneyexchangerate.html?receiverCountry=${d.iso3}&receiverCurrency=${d.cur}&currentLanguage=en`,
        { headers: { "Content-Type": "application/json", "CSRF-Token": "" } },
      );
      if (!res.ok) continue;
      const json = (await res.json()) as { rates?: EandRate[] };
      const options = json.rates ?? [];
      const opt = options.find((o) => o.deliveryOptionText === "Bank account") ?? options[0];
      const rate = Number(opt?.exchangeRate);
      if (!rate) continue;
      // Fee and VAT are both paid by the sender: AED 15 + AED 0.75. The API
      // quotes for AED 1, so it cannot show e&'s one amount rule: "Bank
      // transactions to Pakistan over USD 100 are free of charge"
      // (eandmoney.com/en/send-abroad.html FAQ, checked 2026-10-03).
      const fee = (Number(opt?.fee?.amount) || 0) + (Number(opt?.vat) || 0);
      const isBank = opt?.deliveryOptionText === "Bank account";
      for (const amount of sendAmountsFor("AED")) {
        const freeToPakistan = d.cur === "PKR" && isBank && amount > E_AND_PKR_FREE_ABOVE_AED;
        rows.push(quote("e& money", "e-and-money", "AED", d.cur, amount, freeToPakistan ? 0 : fee, rate, "gulf-e-and-money", {
          deliveryMethod: opt?.deliveryOptionText === "Bank account" ? "Bank Deposit" : (opt?.deliveryOptionText ?? null),
        }));
      }
    } catch {
      // next destination
    }
  }
  console.log(`  ${rows.length ? "✓" : "✗"} e& money: ${rows.length} quotes`);
  return rows;
}

// ── Rate-only operators ──────────────────────────────────────────────────────
// Each returns its published rate per destination; rows are only built where
// PUBLISHED_FEES has that operator's fee for that destination.

async function alAnsari(): Promise<Partial<Record<Dest, number>>> {
  // WordPress converter; the nonce comes from the homepage. trtype=BT is bank transfer.
  const IDS: Partial<Record<Dest, number>> = { INR: 26, PKR: 27, PHP: 49, BDT: 59, EGP: 19, NPR: 98 };
  const home = await get("https://alansariexchange.com/");
  const cookie = (home.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
  // The converter's nonce lives in CC_Ajax_Object; the page carries other
  // plugins' ajax_nonce values that admin-ajax rejects with 403 "-1".
  const nonce = /CC_Ajax_Object\s*=\s*\{[^}]*"ajax_nonce":"([a-f0-9]+)"/.exec(await home.text())?.[1];
  if (!nonce) return {};
  const out: Partial<Record<Dest, number>> = {};
  for (const [cur, id] of Object.entries(IDS) as [Dest, number][]) {
    const res = await get("https://alansariexchange.com/wp-admin/admin-ajax.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: cookie },
      body: `action=convert_action&currfrom=91&currto=${id}&cntcode=${id}&amt=1000&security=${nonce}&trtype=BT`,
    });
    const json = (await res.json().catch(() => null)) as { amount?: string; status_msg?: string } | null;
    const amount = Number(json?.amount);
    if (json?.status_msg === "SUCCESS" && amount > 0) out[cur] = amount / 1000;
  }
  return out;
}




/**
 * Lulu Exchange's live rates sit on a non-standard port (9443) that some
 * networks block, and the response format is not yet confirmed. Until the CI
 * log shows which field is the remittance (TT) rate, this only logs a sample;
 * it emits no rows. Published UAE fees are already in PUBLISHED_FEES.
 */
async function luluProbe(): Promise<void> {
  const payload = encodeURIComponent(JSON.stringify({ activityType: "rates.get", aglcid: 784278, instype: "LR" }));
  try {
    const res = await get(`https://lieservices.luluone.com:9443/liveccyrates?payload=${payload}`);
    const body = await res.text();
    console.log(`  · Lulu Exchange (probe only): HTTP ${res.status}, ${body.length} bytes: ${body.slice(0, 600).replace(/\s+/g, " ")}`);
  } catch (err) {
    console.log(`  · Lulu Exchange (probe only): ${(err as Error).message?.slice(0, 80)}`);
  }
}

/**
 * Operators with a public rate but no published fee are not collected — a rate
 * without its fee cannot be compared, and $0 would be invented. Their endpoints,
 * verified 2026-10-03, for when a fee is published:
 *  - GCC Exchange (UAE): GET gccexchange.com/media/index.php/exchangerate/getexchangerate
 *    — `exchangerate[].ExchangeRate` is AED per unit of foreign currency.
 *  - Al Dar Exchange (Qatar): GET aldarexchange.com/api/home/currency-calculaterate
 *    ?curcode=INR&lcyamount=1000 — confirm it is the remittance, not the cash, rate.
 *  - Musandam Exchange (Oman): GET musandamexchange.om/remittance/{1 INR, 2 BDT,
 *    3 PKR, 4 LKR, 5 PHP} — "Direct Bank Credit Rate". Its server omits the
 *    Sectigo intermediate certificate, so Node needs it supplied.
 *  - Al Fardan (UAE): POST alfardanexchange.com/currency_converter behind a
 *    Sucuri challenge; its fee page is behind the same challenge.
 */
const RATE_ONLY: { name: string; slug: string; cur: string; fetch: () => Promise<Partial<Record<Dest, number>>> }[] = [
  { name: "Al Ansari Exchange", slug: "al-ansari-exchange", cur: "AED", fetch: alAnsari },
];

async function rateOnly(): Promise<ProviderQuote[]> {
  const rows: ProviderQuote[] = [];
  for (const op of RATE_ONLY) {
    const published = PUBLISHED_FEES[op.slug];
    let rates: Partial<Record<Dest, number>> = {};
    try {
      rates = await op.fetch();
    } catch (err) {
      console.log(`  ✗ ${op.name}: ${(err as Error).message?.slice(0, 80)}`);
      continue;
    }
    let built = 0;
    for (const [cur, rate] of Object.entries(rates) as [Dest, number][]) {
      const bands = published?.fees[cur];
      if (!bands || !rate) continue; // no published fee: not shown
      for (const amount of sendAmountsFor(op.cur)) {
        rows.push(quote(op.name, op.slug, op.cur, cur, amount, feeFor(bands, amount), rate, `gulf-${op.slug}`));
        built++;
      }
    }
    const withRate = Object.keys(rates).length;
    console.log(`  ${built ? "✓" : "·"} ${op.name}: rates for ${withRate} destinations, ${built} quotes${published ? "" : " (no published fee yet — not shown)"}`);
  }
  return rows;
}

async function main() {
  console.log("=== Gulf operators ===\n");
  const start = Date.now();
  const fresh = [...(await westernUnion()), ...(await eandMoney()), ...(await rateOnly())];
  await luluProbe();

  // Carry forward an operator that returned nothing this run.
  let previous: ProviderQuote[] = [];
  try {
    previous = JSON.parse(fs.readFileSync(OUTPUT, "utf8"));
  } catch {
    // first run
  }
  const freshSlugs = new Set(fresh.map((q) => q.providerSlug));
  const carried = previous.filter((q) => !freshSlugs.has(q.providerSlug));
  const all = [...fresh, ...carried];

  if (fresh.length === 0 && previous.length) {
    console.error("\n✗ Gulf operators: 0 quotes — keeping the previous gulf-quotes.json");
    process.exit(0);
  }
  fs.writeFileSync(OUTPUT, JSON.stringify(all, null, 2));
  console.log(`\n✓ ${fresh.length} fresh + ${carried.length} carried rows → gulf-quotes.json (${Math.round((Date.now() - start) / 1000)}s)`);
}

main();
