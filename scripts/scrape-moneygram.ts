/**
 * MoneyGram Browser Automation Scraper
 *
 * MoneyGram uses a Next.js site with dynamic rate loading.
 *
 * Strategy (multi-pronged):
 * 1. Navigate to corridor page (/us/en/corridor/india) → wait for rate widget to load →
 *    scrape displayed exchange rate from DOM.
 * 2. Navigate to MGO homepage → select destination via React dropdown → proceed to send
 *    flow → intercept pricing API calls from consumerapi.moneygram.com.
 * 3. Attempt a direct browser-context fetch to the consumer API with the public client key.
 *
 * The corridor page shows a single exchange rate (no amount input), so we compute
 * receive amounts from the rate. The MGO send flow may yield amount-specific quotes
 * with fees when the API intercept succeeds.
 */
import {
  OUTPUT_DIR,
  NAV_TIMEOUT,
  MAX_RETRIES,
  SEND_AMOUNTS,
  delay,
  jitteredDelay,
  dismissOverlays,
  setupBrowserContext,
  fillAmountInput,
  withRetry,
  writeOutput,
  parseNumber,
  type ProviderQuote,
} from "./lib/browser";
import type { BrowserContext, Page } from "playwright";

/* ------------------------------------------------------------------ */
/*  Corridor definitions                                               */
/* ------------------------------------------------------------------ */

const CORRIDORS = [
  { from: "USD", to: "INR", destCountry: "India", sendPath: "us/en", countrySlug: "india" },
  { from: "USD", to: "PHP", destCountry: "Philippines", sendPath: "us/en", countrySlug: "philippines" },
  { from: "USD", to: "MXN", destCountry: "Mexico", sendPath: "us/en", countrySlug: "mexico" },
  { from: "USD", to: "NGN", destCountry: "Nigeria", sendPath: "us/en", countrySlug: "nigeria" },
  { from: "USD", to: "PKR", destCountry: "Pakistan", sendPath: "us/en", countrySlug: "pakistan" },
  { from: "USD", to: "BDT", destCountry: "Bangladesh", sendPath: "us/en", countrySlug: "bangladesh" },
  { from: "USD", to: "GHS", destCountry: "Ghana", sendPath: "us/en", countrySlug: "ghana" },
  { from: "USD", to: "KES", destCountry: "Kenya", sendPath: "us/en", countrySlug: "kenya" },
  { from: "USD", to: "BRL", destCountry: "Brazil", sendPath: "us/en", countrySlug: "brazil" },
  { from: "USD", to: "COP", destCountry: "Colombia", sendPath: "us/en", countrySlug: "colombia" },
  { from: "USD", to: "GTQ", destCountry: "Guatemala", sendPath: "us/en", countrySlug: "guatemala" },
  { from: "USD", to: "EUR", destCountry: "Germany", sendPath: "us/en", countrySlug: "germany" },
  { from: "GBP", to: "INR", destCountry: "India", sendPath: "gb/en", countrySlug: "india" },
  { from: "GBP", to: "NGN", destCountry: "Nigeria", sendPath: "gb/en", countrySlug: "nigeria" },
  { from: "GBP", to: "PKR", destCountry: "Pakistan", sendPath: "gb/en", countrySlug: "pakistan" },
  { from: "GBP", to: "PHP", destCountry: "Philippines", sendPath: "gb/en", countrySlug: "philippines" },
  { from: "EUR", to: "INR", destCountry: "India", sendPath: "de/en", countrySlug: "india" },
  { from: "EUR", to: "NGN", destCountry: "Nigeria", sendPath: "de/en", countrySlug: "nigeria" },
  { from: "CAD", to: "INR", destCountry: "India", sendPath: "ca/en", countrySlug: "india" },
  { from: "CAD", to: "PHP", destCountry: "Philippines", sendPath: "ca/en", countrySlug: "philippines" },
  { from: "AUD", to: "INR", destCountry: "India", sendPath: "au/en", countrySlug: "india" },
];

/* ------------------------------------------------------------------ */
/*  API response parsing                                               */
/* ------------------------------------------------------------------ */

function parseMoneyGramApiResponse(
  body: string,
  sendCurrency: string,
  receiveCurrency: string,
  expectedAmount: number
): ProviderQuote | null {
  try {
    const data = JSON.parse(body);

    // MoneyGram consumer API shapes vary:
    // { estimateResponse: { receiveAmounts: [...], exchangeRate, fees } }
    // { feeEstimate: [...], exchangeRate }
    // { data: { rate, fee, receiveAmount } }
    // { exchangeRate, fee, receiveAmount, sendAmount }
    const root = data?.estimateResponse || data?.feeEstimate || data?.data || data?.result || data;

    // Handle array of fee estimates (one per delivery method)
    if (Array.isArray(root)) {
      const bankOption = root.find(
        (r: Record<string, unknown>) =>
          (r.deliveryOption as string)?.toLowerCase().includes("bank") ||
          (r.receiveMethod as string)?.toLowerCase().includes("account") ||
          (r.serviceOption as string)?.toLowerCase().includes("deposit")
      ) || root[0];

      if (bankOption) {
        return extractMoneyGramQuote(bankOption, sendCurrency, receiveCurrency, expectedAmount);
      }
    }

    // Handle nested receiveAmounts array
    if (root?.receiveAmounts && Array.isArray(root.receiveAmounts)) {
      const bankOption = root.receiveAmounts.find(
        (r: Record<string, unknown>) =>
          (r.deliveryOption as string)?.toLowerCase().includes("bank") ||
          (r.receiveMethod as string)?.toLowerCase().includes("account")
      ) || root.receiveAmounts[0];

      const rate = parseFloat(String(root.exchangeRate || root.rate || "0"));
      if (bankOption) {
        return extractMoneyGramQuote(
          { ...bankOption, exchangeRate: rate },
          sendCurrency, receiveCurrency, expectedAmount
        );
      }
    }

    return extractMoneyGramQuote(root, sendCurrency, receiveCurrency, expectedAmount);
  } catch {
    return null;
  }
}

function extractMoneyGramQuote(
  obj: Record<string, unknown>,
  sendCurrency: string,
  receiveCurrency: string,
  expectedAmount: number
): ProviderQuote | null {
  const rate = parseFloat(
    String(obj.exchangeRate || obj.rate || obj.fx_rate || obj.fxRate || "0")
  );
  const fee = parseFloat(
    String(obj.fee || obj.transferFee || obj.totalFee || obj.fees || obj.sendFee || "0")
  );
  const sendAmount = parseFloat(
    String(obj.sendAmount || obj.principalAmount || obj.send_amount || "0")
  ) || expectedAmount;
  const receiveAmount = parseFloat(
    String(obj.receiveAmount || obj.destinationAmount || obj.receive_amount || obj.estimatedReceiveAmount || "0")
  );
  const deliveryEstimate =
    (obj.deliveryOption as string) || (obj.deliveryEstimate as string) ||
    (obj.serviceOption as string) || null;

  if (!receiveAmount && !rate) return null;

  const effectiveRate = rate || (receiveAmount > 0 ? receiveAmount / (sendAmount - fee) : 0);
  const effectiveReceive = receiveAmount || (sendAmount - fee) * rate;

  if (effectiveReceive <= 0) return null;

  return {
    provider: "MoneyGram",
    providerSlug: "moneygram",
    providerType: "moneyTransferProvider",
    sendCurrency,
    receiveCurrency,
    sendAmount,
    fee: Math.round(fee * 100) / 100,
    exchangeRate: Math.round(effectiveRate * 10000) / 10000,
    receiveAmount: Math.round(effectiveReceive * 100) / 100,
    deliveryEstimate,
    deliveryMethod: null,
    dateCollected: new Date().toISOString(),
    source: "moneygram-browser",
  };
}

/* ------------------------------------------------------------------ */
/*  Strategy 1 — Corridor page DOM scraping                            */
/* ------------------------------------------------------------------ */

/**
 * Navigate to the corridor-specific page (e.g. /us/en/corridor/india).
 * The page has rate widget placeholders ("Loading exchange rate information")
 * that get replaced with actual rates once the client-side JS hydrates.
 * We wait for the rate to appear, extract it, and compute receive amounts.
 */
async function scrapeCorridorPage(
  context: BrowserContext,
  corridor: (typeof CORRIDORS)[number],
  amount: number
): Promise<ProviderQuote | null> {
  const page = await context.newPage();
  let capturedQuote: ProviderQuote | null = null;

  try {
    // Intercept API calls that may contain rate/fee data
    page.on("response", async (response) => {
      const url = response.url();
      if (
        (url.includes("consumerapi.moneygram.com") ||
         url.includes("moneygram.com/api") ||
         url.includes("webv2cms")) &&
        response.status() === 200
      ) {
        try {
          const ct = response.headers()["content-type"] || "";
          if (!ct.includes("json")) return;
          const body = await response.text();
          if (
            body.includes("exchangeRate") || body.includes("fxRate") ||
            body.includes("receiveAmount") || body.includes("\"rate\"")
          ) {
            const parsed = parseMoneyGramApiResponse(body, corridor.from, corridor.to, amount);
            if (parsed && parsed.receiveAmount > 0) {
              capturedQuote = parsed;
            }
          }
        } catch {
          // Response not readable
        }
      }
    });

    const url = `https://www.moneygram.com/${corridor.sendPath}/corridor/${corridor.countrySlug}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await delay(2000);
    await dismissOverlays(page);

    // Wait for the rate widget to finish loading.
    // The page initially shows "Loading exchange rate information" which gets
    // replaced with actual rate text like "1 USD = 85.1234 INR".
    try {
      await page.waitForFunction(
        () => {
          const body = document.body?.textContent || "";
          // Check that at least one "Loading exchange rate" placeholder is gone
          // and that a rate pattern like "= X.XXXX" appears
          return (
            !body.includes("Loading exchange rate information") ||
            /\d+\.\d{2,}/.test(body)
          );
        },
        { timeout: 15000 }
      );
    } catch {
      // Timeout waiting for rate — continue and try to scrape what we can
    }

    await delay(2000);

    // If we captured an API response, use it
    if (capturedQuote) return capturedQuote;

    // Scrape rate from DOM
    const bodyText = await page.locator("body").textContent({ timeout: 5000 });
    if (!bodyText) return null;

    // Look for rate patterns: "1 USD = 85.1234 INR" or "USD = 85.1234INR"
    const corridorRateRegex = new RegExp(
      `(?:1\\s*)?${corridor.from}\\s*=\\s*([\\d,.]+)\\s*${corridor.to}`,
      "i"
    );
    const rateMatch = bodyText.match(corridorRateRegex);

    // Also try generic rate pattern
    const genericRateMatch = bodyText.match(
      /(?:Exchange\s*Rate|Rate)[:\s]*([\d,.]+)/i
    );

    const rate = rateMatch
      ? parseNumber(rateMatch[1])
      : genericRateMatch
        ? parseNumber(genericRateMatch[1])
        : 0;

    if (!rate || rate <= 0) return null;

    // Corridor page shows only the rate, no fees.
    // Compute receive amount from the rate and send amount.
    const receiveAmount = Math.round(amount * rate * 100) / 100;

    return {
      provider: "MoneyGram",
      providerSlug: "moneygram",
      providerType: "moneyTransferProvider",
      sendCurrency: corridor.from,
      receiveCurrency: corridor.to,
      sendAmount: amount,
      fee: 0,
      exchangeRate: Math.round(rate * 10000) / 10000,
      receiveAmount,
      deliveryEstimate: null,
      deliveryMethod: null,
      dateCollected: new Date().toISOString(),
      source: "moneygram-browser-corridor",
    };
  } catch (err) {
    console.log(`    ⚠ Corridor page error: ${(err as Error).message?.slice(0, 80)}`);
    return null;
  } finally {
    await page.close();
  }
}

/* ------------------------------------------------------------------ */
/*  Strategy 2 — MGO app send flow with API interception               */
/* ------------------------------------------------------------------ */

/**
 * Navigate to the MGO homepage, select a destination country using the
 * React custom dropdown, proceed into the send flow, fill an amount,
 * and capture API responses with pricing data.
 */
async function scrapeMgoFlow(
  context: BrowserContext,
  corridor: (typeof CORRIDORS)[number],
  amount: number
): Promise<ProviderQuote | null> {
  const page = await context.newPage();
  let capturedQuote: ProviderQuote | null = null;

  try {
    // Intercept MoneyGram's pricing/estimate API calls
    page.on("response", async (response) => {
      const url = response.url();
      if (
        (url.includes("consumerapi.moneygram.com") ||
         url.includes("moneygram.com") && url.includes("api")) &&
        (url.includes("estimate") || url.includes("price") || url.includes("fee") ||
         url.includes("quote") || url.includes("rate") || url.includes("calculate") ||
         url.includes("send") || url.includes("transaction"))
      ) {
        try {
          const ct = response.headers()["content-type"] || "";
          if (!ct.includes("json")) return;
          const body = await response.text();
          if (
            body.includes("exchangeRate") || body.includes("\"rate\"") ||
            body.includes("receiveAmount") || body.includes("fee") ||
            body.includes("estimateResponse") || body.includes("fxRate")
          ) {
            const parsed = parseMoneyGramApiResponse(body, corridor.from, corridor.to, amount);
            if (parsed && parsed.receiveAmount > 0) {
              capturedQuote = parsed;
            }
          }
        } catch {
          // Not readable
        }
      }
    });

    // Navigate to MGO homepage
    const url = `https://www.moneygram.com/mgo/${corridor.sendPath}/`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await delay(3000);
    await dismissOverlays(page);

    // --- Select destination country ---
    // The MGO homepage has a React custom dropdown with text "Select a country".
    // We need to: 1) Click the dropdown trigger 2) Type to search 3) Select the country.

    let countrySelected = false;

    // Approach A: Click any element containing "Select a country" text
    const dropdownTriggerSelectors = [
      'text="Select a country"',
      ':has-text("Select a country")',
      '[class*="country"] >> text="Select a country"',
      'button:has-text("Select a country")',
      'div[role="combobox"]',
      'div[role="listbox"]',
      '[aria-haspopup="listbox"]',
      '[aria-haspopup="true"]',
      'input[placeholder*="country" i]',
      'input[placeholder*="select" i]',
      'input[aria-label*="country" i]',
      'input[aria-label*="destination" i]',
      'input[aria-label*="receive" i]',
      'input[aria-label*="send" i]',
    ];

    for (const sel of dropdownTriggerSelectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 2000 })) {
          await el.click();
          await delay(1000);

          // After clicking, look for a search/filter input that appeared
          const searchInputSelectors = [
            'input[placeholder*="search" i]',
            'input[placeholder*="country" i]',
            'input[placeholder*="filter" i]',
            'input[type="search"]',
            'input[role="searchbox"]',
            'input[aria-label*="search" i]',
            'input[aria-label*="filter" i]',
            // The dropdown may have turned the trigger into an input
            'input:focus',
          ];

          let searchInput = null;
          for (const searchSel of searchInputSelectors) {
            try {
              const inp = page.locator(searchSel).first();
              if (await inp.isVisible({ timeout: 1500 })) {
                searchInput = inp;
                break;
              }
            } catch {
              continue;
            }
          }

          if (searchInput) {
            await searchInput.fill(corridor.destCountry);
            await delay(1000);
          } else {
            // If no search input, try typing directly (some dropdowns filter on keypress)
            await page.keyboard.type(corridor.destCountry, { delay: 80 });
            await delay(1000);
          }

          // Click the matching country option
          const optionSelectors = [
            `[role="option"]:has-text("${corridor.destCountry}")`,
            `li:has-text("${corridor.destCountry}")`,
            `button:has-text("${corridor.destCountry}")`,
            `a:has-text("${corridor.destCountry}")`,
            `div[class*="option"]:has-text("${corridor.destCountry}")`,
            `span:has-text("${corridor.destCountry}")`,
          ];

          for (const optSel of optionSelectors) {
            try {
              const opt = page.locator(optSel).first();
              if (await opt.isVisible({ timeout: 2000 })) {
                await opt.click({ timeout: 3000 });
                countrySelected = true;
                await delay(2000);
                break;
              }
            } catch {
              continue;
            }
          }

          if (countrySelected) break;
        }
      } catch {
        continue;
      }
    }

    // Approach B: Try clicking any element that looks like a country link/button
    if (!countrySelected) {
      try {
        const countryLink = page.locator(
          `a:has-text("${corridor.destCountry}"), ` +
          `button:has-text("${corridor.destCountry}"), ` +
          `[data-testid*="country"]:has-text("${corridor.destCountry}")`
        ).first();
        if (await countryLink.isVisible({ timeout: 2000 })) {
          await countryLink.click({ timeout: 3000 });
          countrySelected = true;
          await delay(2000);
        }
      } catch {
        // Not found
      }
    }

    if (!countrySelected) {
      console.log(`    ⚠ Could not select country: ${corridor.destCountry}`);
      return null;
    }

    // Click "Send money" button if visible (may navigate to amount entry page)
    try {
      const sendBtn = page.locator(
        'button:has-text("Send money"), ' +
        'a:has-text("Send money"), ' +
        'button:has-text("Get started"), ' +
        'a:has-text("Get started"), ' +
        'button:has-text("Continue"), ' +
        'button[type="submit"]'
      ).first();
      if (await sendBtn.isVisible({ timeout: 2000 })) {
        await sendBtn.click({ timeout: 3000 });
        await delay(3000);
        await dismissOverlays(page);
      }
    } catch {
      // Button not found — may have auto-navigated
    }

    // Fill send amount if an input is available
    const filled = await fillAmountInput(page, amount, [
      'input[data-testid*="send"]',
      'input[data-testid*="amount"]',
      'input[name*="send"]',
      'input[name*="amount"]',
      'input[id*="send"]',
      'input[id*="amount"]',
      'input[aria-label*="send" i]',
      'input[aria-label*="you send" i]',
      'input[aria-label*="amount" i]',
      'input[inputmode="decimal"]',
      'input[inputmode="numeric"]',
      'input[type="tel"]',
      'input[type="number"]',
    ]);

    if (filled) {
      await page.keyboard.press("Tab");
      await delay(5000);
    } else {
      await delay(3000);
    }

    if (capturedQuote) return capturedQuote;

    // Fallback: scrape the DOM for any displayed rate/fee/receive info
    return await scrapeDom(page, corridor.from, corridor.to, amount);
  } catch (err) {
    console.log(`    ⚠ MGO flow error: ${(err as Error).message?.slice(0, 80)}`);
    return null;
  } finally {
    await page.close();
  }
}

/* ------------------------------------------------------------------ */
/*  Strategy 3 — Direct consumer API call from browser context         */
/* ------------------------------------------------------------------ */

/**
 * Attempt to call MoneyGram's consumer API directly from within the
 * browser page context. The public client key is embedded in the MGO
 * app's JavaScript and can be used for unauthenticated estimate calls.
 */
async function tryDirectApi(
  context: BrowserContext,
  corridor: (typeof CORRIDORS)[number],
  amount: number
): Promise<ProviderQuote | null> {
  const page = await context.newPage();

  try {
    // First load the MGO page to get same-origin context and cookies
    await page.goto(`https://www.moneygram.com/mgo/${corridor.sendPath}/`, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT,
    });
    await delay(2000);

    // Try calling the consumer API with the public Basic auth key
    const clientKey = "Basic W0VCX2VkYjI0ZDc5LTA0ODItNDdlMi1hNmQ2LTc4ZGY5YzI4MmM0ZTo1MTNlMTEyOS0yZTJmLTRlYmUtYjkwMi02YTVkMGViMDNjZjc=";

    // Country code mapping for the API
    const countryCodeMap: Record<string, string> = {
      India: "IND", Philippines: "PHL", Mexico: "MEX", Nigeria: "NGA",
      Pakistan: "PAK", Bangladesh: "BGD", Ghana: "GHA", Kenya: "KEN",
      Brazil: "BRA", Colombia: "COL", Guatemala: "GTM", Germany: "DEU",
    };
    const destCode = countryCodeMap[corridor.destCountry] || corridor.destCountry.slice(0, 3).toUpperCase();

    // Sending country code based on sendPath
    const sendCountryMap: Record<string, string> = {
      "us/en": "USA", "gb/en": "GBR", "de/en": "DEU", "ca/en": "CAN", "au/en": "AUS",
    };
    const sendCode = sendCountryMap[corridor.sendPath] || "USA";

    // Try multiple API endpoint patterns
    const apiPatterns = [
      `https://consumerapi.moneygram.com/services/capi/api/v2/nonauth/estimator?sendCountry=${sendCode}&receiveCountry=${destCode}&sendCurrency=${corridor.from}&receiveCurrency=${corridor.to}&sendAmount=${amount}&deliveryOption=BANK_DEPOSIT`,
      `https://consumerapi.moneygram.com/services/capi/api/v1/nonauth/estimator?sendCountry=${sendCode}&receiveCountry=${destCode}&sendCurrency=${corridor.from}&receiveCurrency=${corridor.to}&sendAmount=${amount}`,
      `https://consumerapi.moneygram.com/services/capi/api/v2/nonauth/feeEstimate?sendCountry=${sendCode}&receiveCountry=${destCode}&sendCurrency=${corridor.from}&receiveCurrency=${corridor.to}&sendAmount=${amount}`,
    ];

    for (const apiUrl of apiPatterns) {
      try {
        const responseText = await page.evaluate(
          async ({ fetchUrl, authKey }) => {
            try {
              const res = await fetch(fetchUrl, {
                headers: {
                  Authorization: authKey,
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                credentials: "omit",
              });
              if (res.ok) return await res.text();
              return null;
            } catch {
              return null;
            }
          },
          { fetchUrl: apiUrl, authKey: clientKey }
        );

        if (responseText) {
          const parsed = parseMoneyGramApiResponse(
            responseText, corridor.from, corridor.to, amount
          );
          if (parsed && parsed.receiveAmount > 0) {
            parsed.source = "moneygram-browser-api";
            return parsed;
          }
        }
      } catch {
        continue;
      }
    }

    return null;
  } catch (err) {
    console.log(`    ⚠ Direct API error: ${(err as Error).message?.slice(0, 80)}`);
    return null;
  } finally {
    await page.close();
  }
}

/* ------------------------------------------------------------------ */
/*  DOM scraping fallback                                              */
/* ------------------------------------------------------------------ */

async function scrapeDom(
  page: Page,
  sendCurrency: string,
  receiveCurrency: string,
  amount: number
): Promise<ProviderQuote | null> {
  try {
    const bodyText = await page.locator("body").textContent({ timeout: 3000 });
    if (!bodyText) return null;

    // Match corridor-specific rate: "1 USD = 85.1234 INR" or "USD = 85.1234INR"
    const corridorRateRegex = new RegExp(
      `(?:1\\s*)?${sendCurrency}\\s*=\\s*([\\d,.]+)\\s*${receiveCurrency}`,
      "i"
    );
    const rateMatch = bodyText.match(corridorRateRegex) ||
      bodyText.match(/(?:Exchange\s*Rate|Rate)[:\s]*([\d,.]+)/i);
    const feeMatch = bodyText.match(/(?:Fee|Transfer fee|Service fee)[:\s$]*([\d,.]+)/i);

    // Find receive amount with the target currency
    const receivePattern = new RegExp(`([\\d,]+(?:\\.\\d{1,4})?)\\s*${receiveCurrency}`, "g");
    let receiveAmount = 0;
    let match;
    while ((match = receivePattern.exec(bodyText)) !== null) {
      const num = parseNumber(match[1]);
      // Filter out tiny values (like "1 INR") — receive should be proportional to send
      if (num > amount * 0.01 && num > receiveAmount) receiveAmount = num;
    }

    const rate = rateMatch ? parseNumber(rateMatch[1]) : 0;
    const fee = feeMatch ? parseNumber(feeMatch[1]) : 0;

    if (!rate && !receiveAmount) return null;

    const effectiveRate = rate || (receiveAmount > 0 ? receiveAmount / amount : 0);
    const effectiveReceive = receiveAmount || (rate > 0 ? amount * rate : 0);

    if (effectiveReceive <= 0) return null;

    return {
      provider: "MoneyGram",
      providerSlug: "moneygram",
      providerType: "moneyTransferProvider",
      sendCurrency,
      receiveCurrency,
      sendAmount: amount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: Math.round(effectiveRate * 10000) / 10000,
      receiveAmount: Math.round(effectiveReceive * 100) / 100,
      deliveryEstimate: null,
      deliveryMethod: null,
      dateCollected: new Date().toISOString(),
      source: "moneygram-browser-dom",
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Orchestrator: try all strategies for a corridor + amount           */
/* ------------------------------------------------------------------ */

async function scrapeCorridorAmount(
  context: BrowserContext,
  corridor: (typeof CORRIDORS)[number],
  amount: number
): Promise<ProviderQuote | null> {
  // Strategy 1: Corridor page (fast — just needs rate from the page)
  const corridorQuote = await scrapeCorridorPage(context, corridor, amount);
  if (corridorQuote) return corridorQuote;

  // Strategy 2: Direct consumer API call from browser context
  const apiQuote = await tryDirectApi(context, corridor, amount);
  if (apiQuote) return apiQuote;

  // Strategy 3: Full MGO send flow with form interaction
  const mgoQuote = await scrapeMgoFlow(context, corridor, amount);
  if (mgoQuote) return mgoQuote;

  return null;
}

/* ------------------------------------------------------------------ */
/*  Main entry point                                                   */
/* ------------------------------------------------------------------ */

async function main() {
  console.log("=== MoneyGram Browser Automation Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  const context = await setupBrowserContext();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  // For corridor page strategy, we only need the rate once per corridor
  // (it doesn't change with amount). Cache the rate to avoid redundant page loads.
  const corridorRateCache = new Map<string, number>();

  try {
    for (const corridor of CORRIDORS) {
      console.log(`\n📍 ${corridor.from} → ${corridor.to} (${corridor.destCountry})`);

      for (const amount of SEND_AMOUNTS) {
        console.log(`  Scraping: ${corridor.from} → ${corridor.to} ($${amount})...`);

        const cacheKey = `${corridor.sendPath}:${corridor.to}`;
        const cachedRate = corridorRateCache.get(cacheKey);

        let quote: ProviderQuote | null = null;

        // If we already have the rate from the corridor page, reuse it
        if (cachedRate && cachedRate > 0) {
          const receiveAmount = Math.round(amount * cachedRate * 100) / 100;
          quote = {
            provider: "MoneyGram",
            providerSlug: "moneygram",
            providerType: "moneyTransferProvider",
            sendCurrency: corridor.from,
            receiveCurrency: corridor.to,
            sendAmount: amount,
            fee: 0,
            exchangeRate: Math.round(cachedRate * 10000) / 10000,
            receiveAmount,
            deliveryEstimate: null,
            deliveryMethod: null,
            dateCollected: new Date().toISOString(),
            source: "moneygram-browser-corridor",
          };
        } else {
          quote = await withRetry(
            () => scrapeCorridorAmount(context, corridor, amount),
            MAX_RETRIES
          );

          // Cache the rate if we got one from the corridor page
          if (quote && quote.exchangeRate > 0) {
            corridorRateCache.set(cacheKey, quote.exchangeRate);
          }
        }

        if (quote) {
          allQuotes.push(quote);
          successCount++;
          console.log(
            `    ✓ Fee: ${quote.fee}, Rate: ${quote.exchangeRate}, Receive: ${quote.receiveAmount} [${quote.source}]`
          );
        } else {
          failCount++;
          console.log(`    ✗ No data after ${MAX_RETRIES} attempts`);
        }

        // Only add delay between corridors if we didn't use cache
        if (!cachedRate) {
          await jitteredDelay(3000);
        }
      }
    }
  } finally {
    await context.browser()?.close();
  }

  writeOutput("MoneyGram", "moneygram", allQuotes, startTime, successCount, failCount);
}

main().catch((err) => {
  console.error("MoneyGram scraper failed:", err);
  process.exit(1);
});
