/**
 * SkyRemit API Scraper
 *
 * SkyRemit (skyremit.cn) is a CNY-out money transfer service backed by SkyEE360.
 * It exposes a real-time exchange rate API at:
 *   POST https://remit.skyee360.com/api/v1/ExchangeRateInquiry
 *
 * Request body:
 *   { sellCurrency, buyCurrency, exchangeType: "SellingQuota",
 *     transactionAmount, transactionCurrency: "CNY", objectName: "CONV_DIRECT" }
 *
 * Response body fields used:
 *   - buying.amount         — recipient receives (in buyCurrency)
 *   - selling.amount        — effective send amount after fee deducted (CNY)
 *   - feeAmount             — fixed fee in CNY (¥79 flat)
 *   - floatFeeAmount        — variable fee in CNY (0.38% of transaction)
 *   - totalCommissionAmt    — total fee = fixed + float
 *   - finalExchangeRateQuotation — CNY→buyCurrency rate after markup
 *
 * SkyRemit only sends CNY, so sendCurrency is always "CNY".
 * Payment via WeChat Pay / Alipay / bank transfer; bank deposit delivery.
 *
 * TLS note: remit.skyee360.com presents a Zscaler-signed cert not in Node's
 * default CA store. NODE_TLS_REJECT_UNAUTHORIZED=0 is set programmatically
 * before any fetch; this is safe here because we own/know the target host.
 */
// Must be set before any fetch call — Zscaler cert not in Node's CA bundle.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import {
  writeOutput,
  type ProviderQuote,
} from "./lib/browser";

import { currencies } from "../src/data/transfer-currencies";

const API_URL = "https://remit.skyee360.com/api/v1/ExchangeRateInquiry";
const SEND_CURRENCY = "CNY";
const SEND_AMOUNTS = [500, 1000, 3000, 5000, 10000, 30000, 100000];

const TRACKED_RECEIVE = new Set(
  currencies.map((c) => c.code).filter((c) => c !== SEND_CURRENCY)
);

const HEADERS = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Origin": "https://skyremit.cn",
  "Referer": "https://skyremit.cn/",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
};

interface SkyRemitResponseBody {
  buying: { amount: string; currencyCode: string };
  selling: { amount: number; currencyCode: string };
  feeAmount: number;
  totalCommissionAmt: string;
  finalExchangeRateQuotation: string;
}

interface SkyRemitResponse {
  meta: { ack: string };
  body: SkyRemitResponseBody;
}

async function fetchQuote(
  buyCurrency: string,
  sendAmount: number
): Promise<SkyRemitResponseBody | null> {
  const resp = await fetch(API_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      sellCurrency: SEND_CURRENCY,
      buyCurrency,
      exchangeType: "SellingQuota",
      transactionAmount: sendAmount,
      transactionCurrency: SEND_CURRENCY,
      objectName: "CONV_DIRECT",
    }),
  });

  if (!resp.ok) return null;

  const data = (await resp.json()) as SkyRemitResponse;
  if (data?.meta?.ack !== "true" || !data.body?.buying?.amount) return null;
  return data.body;
}

async function main() {
  console.log("=== SkyRemit API Scraper ===");
  console.log(`Endpoint: ${API_URL}`);
  console.log(`Send currency: ${SEND_CURRENCY}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  const startTime = Date.now();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;

  for (const receiveCurrency of TRACKED_RECEIVE) {
    let corridorSuccess = 0;

    for (const sendAmount of SEND_AMOUNTS) {
      const body = await fetchQuote(receiveCurrency, sendAmount);

      if (!body) {
        failCount++;
        continue;
      }

      const receiveAmount = parseFloat(body.buying.amount);
      const fee = parseFloat(body.totalCommissionAmt) || body.feeAmount || 0;
      const rate = parseFloat(body.finalExchangeRateQuotation);

      if (!receiveAmount || receiveAmount <= 0 || !rate || rate <= 0) {
        failCount++;
        continue;
      }

      allQuotes.push({
        provider: "SkyRemit",
        providerSlug: "skyremit",
        providerType: "moneyTransferProvider",
        sendCurrency: SEND_CURRENCY,
        receiveCurrency,
        sendAmount,
        fee: Math.round(fee * 100) / 100,
        exchangeRate: Math.round(rate * 100000) / 100000,
        receiveAmount: Math.round(receiveAmount * 100) / 100,
        paymentMethod: "WeChat Pay / Alipay / Bank Transfer",
        deliveryMethod: "Bank Deposit",
        deliveryEstimate: "1-2 days",
        dateCollected: new Date().toISOString(),
        source: "skyremit-api",
      });
      successCount++;
      corridorSuccess++;
    }

    if (corridorSuccess > 0) {
      console.log(`CNY→${receiveCurrency}: ${corridorSuccess} quotes`);
    } else {
      console.log(`CNY→${receiveCurrency}: not supported`);
    }
  }

  console.log(`\nTotal quotes: ${successCount} success, ${failCount} failed`);
  writeOutput("SkyRemit", "skyremit", allQuotes, startTime, successCount, failCount);
}

main().catch((err) => {
  console.error("SkyRemit scraper failed:", err);
  process.exit(1);
});
