/**
 * Bank & Broker Rates from ExchangeRates.org.uk
 *
 * Provides traditional bank transfer rates (Lloyds, NatWest, Halifax, RBS, Bank of Scotland)
 * and TorFX broker rates for SEO-rich comparison on corridor pages.
 *
 * These are kept separate from the main unified-quotes index because:
 * 1. They serve a different purpose (SEO content vs provider comparison)
 * 2. The providers (banks) don't have review pages on our site
 * 3. We link out to exchangerates.org.uk as the source
 */
import exchangeratesUkQuotes from "@/data/scraped/exchangerates-uk-quotes.json";

export interface BankRate {
  provider: string;
  providerSlug: string;
  providerType: string; // "BANK" or "BROKER"
  exchangeRate: number;
  fee: number;
  receiveAmount: number;
  deliveryEstimate: string | null;
}

interface RawQuote {
  provider: string;
  providerSlug: string;
  providerType: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  receiveAmount: number;
  deliveryEstimate: string | null;
  source: string;
}

// Map from currency pair to exchangerates.org.uk URL slug
const EXCHANGERATES_URL_MAP: Record<string, string> = {
  "USD_MXN": "usa-to-mexico",
  "USD_INR": "usa-to-india",
  "USD_PHP": "usa-to-philippines",
  "USD_CNY": "usa-to-china",
  "GBP_EUR": "uk-to-spain",
  "GBP_AUD": "uk-to-australia",
  "GBP_INR": "uk-to-india",
  "GBP_CAD": "uk-to-canada",
  "CAD_INR": "canada-to-india",
  "CAD_PHP": "canada-to-philippines",
  "AUD_PHP": "australia-to-philippines",
  "AUD_GBP": "australia-to-uk",
  "NZD_INR": "new-zealand-to-india",
  "SGD_INR": "singapore-to-india",
  "AED_INR": "united-arab-emirates-to-india",
  "EUR_INR": "belgium-to-india",
};

// Index quotes by corridor+amount for fast lookup
const bankRateIndex: Record<string, BankRate[]> = {};

for (const raw of exchangeratesUkQuotes as RawQuote[]) {
  const key = `${raw.sendCurrency}_${raw.receiveCurrency}_${raw.sendAmount}`;
  if (!bankRateIndex[key]) bankRateIndex[key] = [];
  bankRateIndex[key].push({
    provider: raw.provider,
    providerSlug: raw.providerSlug,
    providerType: raw.providerType,
    exchangeRate: raw.exchangeRate,
    fee: raw.fee,
    receiveAmount: raw.receiveAmount,
    deliveryEstimate: raw.deliveryEstimate,
  });
}

/**
 * Get bank/broker rates for a corridor and amount.
 * Returns rates sorted by best receive amount (descending).
 */
export function getBankRates(
  sendCurrency: string,
  receiveCurrency: string,
  sendAmount: number
): BankRate[] {
  const key = `${sendCurrency}_${receiveCurrency}_${sendAmount}`;
  const rates = bankRateIndex[key];
  if (!rates) return [];
  return [...rates].sort((a, b) => b.receiveAmount - a.receiveAmount);
}

/**
 * Check if bank rates are available for a currency pair.
 */
export function hasBankRates(sendCurrency: string, receiveCurrency: string): boolean {
  const key = `${sendCurrency}_${receiveCurrency}`;
  return key in EXCHANGERATES_URL_MAP;
}

/**
 * Get the exchangerates.org.uk source URL for a currency pair.
 */
export function getBankRatesSourceUrl(
  sendCurrency: string,
  receiveCurrency: string,
  amount?: number
): string | null {
  const key = `${sendCurrency}_${receiveCurrency}`;
  const slug = EXCHANGERATES_URL_MAP[key];
  if (!slug) return null;
  const base = `https://www.exchangerates.org.uk/compare-money-transfers/best-rate-send-${slug}`;
  return amount ? `${base}?amount=${amount}` : base;
}
