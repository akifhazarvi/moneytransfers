/**
 * Ria Money Transfer Scraper (Hybrid: Browser Auth + API Calls)
 *
 * Strategy: Use ONE Playwright page load to extract the Bearer JWT token
 * from Ria's homepage, then call their Calculate API directly for all corridors.
 *
 * This is ~10x faster than browser-per-corridor since only 1 page load is needed.
 *
 * API: POST https://public.riamoneytransfer.com/MoneyTransferCalculator/Calculate
 * Auth: Bearer JWT (extracted from page load, expires ~20min)
 * Required headers: authorization, client-type, culturecode, appversion
 */
import {
  setupBrowserContext,
  delay,
  jitteredDelay,
  dismissOverlays,
  blockHeavyResources,
  NAV_TIMEOUT,
  SEND_AMOUNTS,
  writeOutput,
  type ProviderQuote,
} from "./lib/browser";

const DELAY_MS = 800;

const CORRIDORS = [
  // From USD (US) — Ria's largest market
  { from: "USD", to: "INR", countryFrom: "US", countryTo: "IN" },
  { from: "USD", to: "PHP", countryFrom: "US", countryTo: "PH" },
  { from: "USD", to: "MXN", countryFrom: "US", countryTo: "MX" },
  { from: "USD", to: "NGN", countryFrom: "US", countryTo: "NG" },
  { from: "USD", to: "PKR", countryFrom: "US", countryTo: "PK" },
  { from: "USD", to: "BDT", countryFrom: "US", countryTo: "BD" },
  { from: "USD", to: "GHS", countryFrom: "US", countryTo: "GH" },
  { from: "USD", to: "KES", countryFrom: "US", countryTo: "KE" },
  { from: "USD", to: "BRL", countryFrom: "US", countryTo: "BR" },
  { from: "USD", to: "COP", countryFrom: "US", countryTo: "CO" },
  { from: "USD", to: "GTQ", countryFrom: "US", countryTo: "GT" },
  { from: "USD", to: "EUR", countryFrom: "US", countryTo: "DE" },
  { from: "USD", to: "GBP", countryFrom: "US", countryTo: "GB" },
  { from: "USD", to: "DOP", countryFrom: "US", countryTo: "DO" },
  { from: "USD", to: "PEN", countryFrom: "US", countryTo: "PE" },
  { from: "USD", to: "JMD", countryFrom: "US", countryTo: "JM" },
  { from: "USD", to: "HNL", countryFrom: "US", countryTo: "HN" },
  { from: "USD", to: "IDR", countryFrom: "US", countryTo: "ID" },
  { from: "USD", to: "THB", countryFrom: "US", countryTo: "TH" },
  { from: "USD", to: "VND", countryFrom: "US", countryTo: "VN" },
  { from: "USD", to: "ZAR", countryFrom: "US", countryTo: "ZA" },
  { from: "USD", to: "ETB", countryFrom: "US", countryTo: "ET" },
  { from: "USD", to: "MAD", countryFrom: "US", countryTo: "MA" },
  { from: "USD", to: "EGP", countryFrom: "US", countryTo: "EG" },
  { from: "USD", to: "LKR", countryFrom: "US", countryTo: "LK" },
  { from: "USD", to: "NPR", countryFrom: "US", countryTo: "NP" },
  { from: "USD", to: "UGX", countryFrom: "US", countryTo: "UG" },
  { from: "USD", to: "TZS", countryFrom: "US", countryTo: "TZ" },
  { from: "USD", to: "XOF", countryFrom: "US", countryTo: "SN" },
  { from: "USD", to: "PLN", countryFrom: "US", countryTo: "PL" },
  { from: "USD", to: "RON", countryFrom: "US", countryTo: "RO" },
  { from: "USD", to: "TRY", countryFrom: "US", countryTo: "TR" },
  { from: "USD", to: "CNY", countryFrom: "US", countryTo: "CN" },
  // From GBP (UK)
  { from: "GBP", to: "INR", countryFrom: "GB", countryTo: "IN" },
  { from: "GBP", to: "NGN", countryFrom: "GB", countryTo: "NG" },
  { from: "GBP", to: "PKR", countryFrom: "GB", countryTo: "PK" },
  { from: "GBP", to: "PHP", countryFrom: "GB", countryTo: "PH" },
  { from: "GBP", to: "EUR", countryFrom: "GB", countryTo: "DE" },
  { from: "GBP", to: "BDT", countryFrom: "GB", countryTo: "BD" },
  { from: "GBP", to: "GHS", countryFrom: "GB", countryTo: "GH" },
  { from: "GBP", to: "KES", countryFrom: "GB", countryTo: "KE" },
  { from: "GBP", to: "ZAR", countryFrom: "GB", countryTo: "ZA" },
  { from: "GBP", to: "PLN", countryFrom: "GB", countryTo: "PL" },
  { from: "GBP", to: "RON", countryFrom: "GB", countryTo: "RO" },
  // From EUR (Germany)
  { from: "EUR", to: "INR", countryFrom: "DE", countryTo: "IN" },
  { from: "EUR", to: "NGN", countryFrom: "DE", countryTo: "NG" },
  { from: "EUR", to: "PHP", countryFrom: "DE", countryTo: "PH" },
  { from: "EUR", to: "PKR", countryFrom: "DE", countryTo: "PK" },
  { from: "EUR", to: "GBP", countryFrom: "DE", countryTo: "GB" },
  { from: "EUR", to: "MAD", countryFrom: "DE", countryTo: "MA" },
  { from: "EUR", to: "TRY", countryFrom: "DE", countryTo: "TR" },
  { from: "EUR", to: "BRL", countryFrom: "DE", countryTo: "BR" },
  { from: "EUR", to: "COP", countryFrom: "DE", countryTo: "CO" },
  // From CAD (Canada)
  { from: "CAD", to: "INR", countryFrom: "CA", countryTo: "IN" },
  { from: "CAD", to: "PHP", countryFrom: "CA", countryTo: "PH" },
  { from: "CAD", to: "PKR", countryFrom: "CA", countryTo: "PK" },
  { from: "CAD", to: "NGN", countryFrom: "CA", countryTo: "NG" },
  // From AUD (Australia)
  { from: "AUD", to: "INR", countryFrom: "AU", countryTo: "IN" },
  { from: "AUD", to: "PHP", countryFrom: "AU", countryTo: "PH" },
  { from: "AUD", to: "PKR", countryFrom: "AU", countryTo: "PK" },
  // From AED (UAE)
  { from: "AED", to: "INR", countryFrom: "AE", countryTo: "IN" },
  { from: "AED", to: "PKR", countryFrom: "AE", countryTo: "PK" },
  { from: "AED", to: "PHP", countryFrom: "AE", countryTo: "PH" },
  { from: "AED", to: "BDT", countryFrom: "AE", countryTo: "BD" },
  // From SGD (Singapore)
  { from: "SGD", to: "INR", countryFrom: "SG", countryTo: "IN" },
  { from: "SGD", to: "PHP", countryFrom: "SG", countryTo: "PH" },
  // From SAR (Saudi Arabia)
  { from: "SAR", to: "INR", countryFrom: "SA", countryTo: "IN" },
  { from: "SAR", to: "PKR", countryFrom: "SA", countryTo: "PK" },
  { from: "SAR", to: "BDT", countryFrom: "SA", countryTo: "BD" },
  { from: "SAR", to: "PHP", countryFrom: "SA", countryTo: "PH" },
  // From NZD (New Zealand)
  { from: "NZD", to: "INR", countryFrom: "NZ", countryTo: "IN" },
  { from: "NZD", to: "PHP", countryFrom: "NZ", countryTo: "PH" },
];

// Locale mapping by send country
const LOCALE_MAP: Record<string, string> = {
  US: "en-us", GB: "en-gb", DE: "de-de", CA: "en-ca",
  AU: "en-au", AE: "en-ae", FR: "fr-fr", IT: "it-it",
};

/**
 * Step 1: Extract Bearer JWT from a single browser page load.
 * The token is sent as Authorization header on the Initialize call.
 */
async function extractBearerToken(locale: string = "en-us"): Promise<{ token: string; cookies: string } | null> {
  console.log("  Extracting Bearer JWT from Ria homepage...");
  const context = await setupBrowserContext();
  const page = await context.newPage();
  await blockHeavyResources(page);

  let token: string | null = null;
  let cookies: string = "";

  try {
    // Capture the Authorization header from the Initialize request
    page.on("request", (req) => {
      if (req.url().includes("Calculator/Initialize") || req.url().includes("Calculator/Calculate")) {
        const auth = req.headers()["authorization"];
        if (auth && auth.startsWith("Bearer ")) {
          token = auth;
        }
      }
    });

    await page.goto(`https://www.riamoneytransfer.com/${locale}/`, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT,
    });
    await delay(6000);
    await dismissOverlays(page);

    // Extract cookies for the API domain
    const allCookies = await context.cookies("https://public.riamoneytransfer.com");
    cookies = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");

    await context.browser()?.close();

    if (token) {
      console.log(`  ✓ Got Bearer token (${token.length} chars)`);
      return { token, cookies };
    }

    console.log("  ✗ No Bearer token captured");
    return null;
  } catch (err) {
    console.log(`  ✗ Error: ${(err as Error).message?.slice(0, 80)}`);
    await context.browser()?.close();
    return null;
  }
}

/**
 * Step 2: Call the Calculate API directly with the extracted token.
 */
async function fetchRiaQuote(
  corridor: (typeof CORRIDORS)[number],
  amount: number,
  authToken: string,
  cookies: string
): Promise<ProviderQuote | null> {
  const locale = LOCALE_MAP[corridor.countryFrom] || "en-us";

  const body = {
    selections: {
      countryFrom: corridor.countryFrom,
      countryTo: corridor.countryTo,
      currencyFrom: corridor.from,
      currencyTo: corridor.to,
      amountFrom: amount,
      paymentMethod: "DebitCard",
      deliveryMethod: "BankDeposit",
      promoId: 0,
      shouldCalcAmountFrom: false,
      shouldCalcVariableRates: true,
      locale,
    },
  };

  try {
    const res = await fetch("https://public.riamoneytransfer.com/MoneyTransferCalculator/Calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
        "Client-Type": "PublicSite",
        CultureCode: locale.replace("-", "-").toUpperCase().replace(/^(..)-(..)/,
          (_, a, b) => `${a.toLowerCase()}-${b.toUpperCase()}`),
        AppVersion: "4.0",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "application/json",
        Origin: "https://www.riamoneytransfer.com",
        Referer: "https://www.riamoneytransfer.com/",
        Cookie: cookies,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      if (res.status === 401) console.log(`    ⚠ Token expired (401)`);
      return null;
    }

    const json = await res.json();
    const calc = json?.model?.transferDetails?.calculations;
    if (!calc) return null;

    const exchangeRate = calc.exchangeRate || 0;
    const receiveAmount = calc.amountTo || 0;
    const fee = calc.transferFee ?? calc.totalFeesAndTaxes ?? 0;

    if (!exchangeRate && !receiveAmount) return null;

    return {
      provider: "Ria Money Transfer",
      providerSlug: "ria",
      providerType: "moneyTransferProvider",
      sendCurrency: corridor.from,
      receiveCurrency: corridor.to,
      sendAmount: amount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: Math.round(exchangeRate * 10000) / 10000,
      receiveAmount: Math.round(receiveAmount * 100) / 100,
      paymentMethod: "Debit Card",
      deliveryMethod: "Bank Deposit",
      deliveryEstimate: null,
      dateCollected: new Date().toISOString(),
      source: "ria-api",
    };
  } catch (err) {
    console.log(`    ⚠ Failed: ${(err as Error).message?.slice(0, 60)}`);
    return null;
  }
}

async function main() {
  console.log("=== Ria Money Transfer Scraper (Hybrid Auth + API) ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  // Step 1: Get auth token via one browser page load
  const auth = await extractBearerToken();
  if (!auth) {
    console.error("Failed to extract Bearer token — cannot proceed");
    process.exit(1);
  }

  // Step 2: Call API for all corridors (no browser needed!)
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  for (const corridor of CORRIDORS) {
    console.log(`\n📍 ${corridor.from} → ${corridor.to}`);

    for (const amount of SEND_AMOUNTS) {
      console.log(`  Fetching: ${corridor.from} → ${corridor.to} ($${amount})...`);

      const quote = await fetchRiaQuote(corridor, amount, auth.token, auth.cookies);

      if (quote) {
        allQuotes.push(quote);
        successCount++;
        console.log(`    ✓ Fee: ${quote.fee}, Rate: ${quote.exchangeRate}, Receive: ${quote.receiveAmount}`);
      } else {
        failCount++;
        console.log(`    ✗ No data`);
      }

      await delay(DELAY_MS + Math.random() * 400);
    }
  }

  writeOutput("Ria Money Transfer", "ria", allQuotes, startTime, successCount, failCount);
}

main().catch((err) => {
  console.error("Ria scraper failed:", err);
});
