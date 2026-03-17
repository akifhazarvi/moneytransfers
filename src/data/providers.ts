export interface Provider {
  slug: string;
  name: string;
  logo: string;
  rating: number;
  ratingLabel: "Excellent" | "Good" | "Fair" | "Poor";
  description: string;
  founded: number;
  headquarters: string;
  regulated: boolean;
  regulators: string[];
  website: string;
  minTransfer: number;
  maxTransfer: number | null;
  transferSpeed: string;
  supportedCountries: number;
  supportedCurrencies: number;
  paymentMethods: string[];
  deliveryMethods: string[];
  pros: string[];
  cons: string[];
  features: string[];
  feeStructure: string;
  exchangeRateMarkup: string;
}

export interface TransferQuote {
  providerSlug: string;
  sendAmount: number;
  sendCurrency: string;
  receiveCurrency: string;
  exchangeRate: number;
  fee: number;
  receiveAmount: number;
  transferSpeed: string;
  rating: number;
  ratingLabel: "Excellent" | "Good" | "Fair" | "Poor";
}

export const providers: Provider[] = [
  {
    slug: "wise",
    name: "Wise",
    logo: "/logos/wise.svg",
    rating: 4.7,
    ratingLabel: "Excellent",
    description: "Wise (formerly TransferWise) offers transparent, low-cost international money transfers using the real mid-market exchange rate with no hidden markups.",
    founded: 2011,
    headquarters: "London, UK",
    regulated: true,
    regulators: ["FCA", "FinCEN", "ASIC"],
    website: "https://wise.com",
    minTransfer: 1,
    maxTransfer: 1000000,
    transferSpeed: "1-2 business days",
    supportedCountries: 80,
    supportedCurrencies: 50,
    paymentMethods: ["Bank Transfer", "Debit Card", "Credit Card", "Apple Pay"],
    deliveryMethods: ["Bank Deposit", "Wise Account"],
    pros: [
      "Uses real mid-market exchange rate",
      "Transparent fee structure shown upfront",
      "Multi-currency account available",
      "Fast transfers to many countries",
      "Regulated in multiple jurisdictions",
    ],
    cons: [
      "Credit card payments have higher fees",
      "No cash pickup option",
      "Transfer limits may apply for new accounts",
    ],
    features: [
      "Multi-currency account",
      "Wise debit card",
      "Business account",
      "API for developers",
      "Batch payments",
    ],
    feeStructure: "Variable fee from 0.41%",
    exchangeRateMarkup: "0% (mid-market rate)",
  },
  {
    slug: "remitly",
    name: "Remitly",
    logo: "/logos/remitly.png",
    rating: 4.5,
    ratingLabel: "Excellent",
    description: "Remitly specializes in personal international money transfers with a focus on remittances to developing countries, offering competitive rates and fast delivery.",
    founded: 2011,
    headquarters: "Seattle, USA",
    regulated: true,
    regulators: ["FinCEN", "FCA"],
    website: "https://remitly.com",
    minTransfer: 1,
    maxTransfer: 10000,
    transferSpeed: "Minutes to 3-5 days",
    supportedCountries: 100,
    supportedCurrencies: 40,
    paymentMethods: ["Bank Transfer", "Debit Card", "Credit Card"],
    deliveryMethods: ["Bank Deposit", "Cash Pickup", "Mobile Money", "Home Delivery"],
    pros: [
      "Express transfers arrive in minutes",
      "Cash pickup available in many countries",
      "Mobile money delivery option",
      "First transfer promotions often available",
      "Home delivery in select countries",
    ],
    cons: [
      "Rates less competitive for large transfers",
      "No multi-currency account",
      "Focused mainly on remittance corridors",
    ],
    features: [
      "Express and economy delivery options",
      "Cash pickup network",
      "Mobile money transfers",
      "Recurring transfers",
      "Referral bonuses",
    ],
    feeStructure: "From $0 to $3.99 per transfer",
    exchangeRateMarkup: "0.5% - 2% above mid-market",
  },
  {
    slug: "ofx",
    name: "OFX",
    logo: "/logos/ofx.svg",
    rating: 4.4,
    ratingLabel: "Excellent",
    description: "OFX is a global money transfer service specializing in large transfers for individuals and businesses, offering competitive rates with no transfer fees.",
    founded: 1998,
    headquarters: "Sydney, Australia",
    regulated: true,
    regulators: ["ASIC", "FCA", "FinCEN"],
    website: "https://ofx.com",
    minTransfer: 100,
    maxTransfer: null,
    transferSpeed: "1-3 business days",
    supportedCountries: 190,
    supportedCurrencies: 55,
    paymentMethods: ["Bank Transfer"],
    deliveryMethods: ["Bank Deposit"],
    pros: [
      "No transfer fees on any amount",
      "Competitive rates for large transfers",
      "24/7 customer support",
      "Forward contracts available",
      "Business solutions",
    ],
    cons: [
      "Higher minimum transfer ($100+)",
      "Only bank transfer payments accepted",
      "Rates less competitive for small amounts",
    ],
    features: [
      "Forward contracts",
      "Limit orders",
      "Regular payment plans",
      "Business payments",
      "API integration",
    ],
    feeStructure: "No transfer fees",
    exchangeRateMarkup: "0.5% - 1.5% above mid-market",
  },
  {
    slug: "xe",
    name: "XE",
    logo: "/logos/xe.svg",
    rating: 4.3,
    ratingLabel: "Excellent",
    description: "XE is a trusted name in currency exchange, offering international money transfers with competitive rates and no transfer fees for most corridors.",
    founded: 1993,
    headquarters: "Newmarket, Canada",
    regulated: true,
    regulators: ["FCA", "FinCEN", "ASIC", "FINTRAC"],
    website: "https://xe.com",
    minTransfer: 1,
    maxTransfer: 500000,
    transferSpeed: "1-4 business days",
    supportedCountries: 130,
    supportedCurrencies: 130,
    paymentMethods: ["Bank Transfer", "Debit Card", "Credit Card"],
    deliveryMethods: ["Bank Deposit"],
    pros: [
      "Well-known and trusted brand",
      "No transfer fees for most transfers",
      "Supports 130+ currencies",
      "Rate alerts available",
      "Excellent currency data and tools",
    ],
    cons: [
      "Exchange rates include a markup",
      "No cash pickup option",
      "Transfer speed can be slow",
    ],
    features: [
      "Rate alerts",
      "Currency charts",
      "Forward contracts",
      "Regular transfers",
      "Business transfers",
    ],
    feeStructure: "No transfer fees",
    exchangeRateMarkup: "0.5% - 1.5% above mid-market",
  },
  {
    slug: "western-union",
    name: "Western Union",
    logo: "/logos/western-union.svg",
    rating: 3.8,
    ratingLabel: "Good",
    description: "Western Union is one of the world's oldest and largest money transfer companies, with an extensive agent network for cash pickups in 200+ countries.",
    founded: 1851,
    headquarters: "Denver, USA",
    regulated: true,
    regulators: ["FinCEN", "FCA", "Various"],
    website: "https://westernunion.com",
    minTransfer: 1,
    maxTransfer: 50000,
    transferSpeed: "Minutes to 5 days",
    supportedCountries: 200,
    supportedCurrencies: 130,
    paymentMethods: ["Bank Transfer", "Debit Card", "Credit Card", "Cash"],
    deliveryMethods: ["Bank Deposit", "Cash Pickup", "Mobile Wallet"],
    pros: [
      "Massive global agent network",
      "Cash pickup in 200+ countries",
      "Transfers can arrive in minutes",
      "Cash payment option available",
      "Well-established and trusted",
    ],
    cons: [
      "Higher fees than digital-only competitors",
      "Exchange rate markup can be significant",
      "Online rates differ from in-store",
    ],
    features: [
      "Cash pickup at 500,000+ locations",
      "Mobile wallet delivery",
      "WU rewards program",
      "In-store service",
      "Business solutions",
    ],
    feeStructure: "From $0 to $10+ depending on method",
    exchangeRateMarkup: "1% - 4% above mid-market",
  },
  {
    slug: "worldremit",
    name: "WorldRemit",
    logo: "/logos/worldremit.svg",
    rating: 4.2,
    ratingLabel: "Excellent",
    description: "WorldRemit is a digital-first remittance service offering fast, affordable international money transfers to 130+ countries with multiple delivery options.",
    founded: 2010,
    headquarters: "London, UK",
    regulated: true,
    regulators: ["FCA", "FinCEN"],
    website: "https://worldremit.com",
    minTransfer: 1,
    maxTransfer: 10000,
    transferSpeed: "Minutes to 3 days",
    supportedCountries: 130,
    supportedCurrencies: 70,
    paymentMethods: ["Bank Transfer", "Debit Card", "Credit Card", "Apple Pay"],
    deliveryMethods: ["Bank Deposit", "Cash Pickup", "Mobile Money", "Airtime Top-up"],
    pros: [
      "Fast transfers to many corridors",
      "Mobile money delivery available",
      "Airtime top-up option",
      "User-friendly mobile app",
      "Competitive rates for smaller transfers",
    ],
    cons: [
      "Transfer limits may be restrictive",
      "Not ideal for large/business transfers",
      "Rates vary significantly by corridor",
    ],
    features: [
      "Mobile money",
      "Airtime top-up",
      "Cash pickup",
      "Bank deposit",
      "Mobile app",
    ],
    feeStructure: "From $0.99 to $3.99",
    exchangeRateMarkup: "0.5% - 3% above mid-market",
  },
  {
    slug: "revolut",
    name: "Revolut",
    logo: "/logos/revolut.svg",
    rating: 4.4,
    ratingLabel: "Excellent",
    description: "Revolut is a digital banking app offering international money transfers at interbank rates during market hours, along with a full suite of financial services.",
    founded: 2015,
    headquarters: "London, UK",
    regulated: true,
    regulators: ["FCA", "ECB", "FinCEN"],
    website: "https://revolut.com",
    minTransfer: 1,
    maxTransfer: null,
    transferSpeed: "Instant to 3 days",
    supportedCountries: 150,
    supportedCurrencies: 36,
    paymentMethods: ["Bank Transfer", "Debit Card", "Revolut Balance"],
    deliveryMethods: ["Bank Deposit", "Revolut Account"],
    pros: [
      "Interbank rates during market hours",
      "Free transfers between Revolut users",
      "Multi-currency account",
      "Virtual and physical cards",
      "Crypto and stock trading available",
    ],
    cons: [
      "Weekend markup of 0.5-1%",
      "Free tier has monthly limits",
      "Customer support can be slow",
    ],
    features: [
      "Multi-currency account",
      "Virtual cards",
      "Crypto trading",
      "Stock trading",
      "Savings vaults",
    ],
    feeStructure: "Free up to £1,000/month, then 0.5%",
    exchangeRateMarkup: "0% weekdays, 0.5-1% weekends",
  },
  {
    slug: "paypal",
    name: "PayPal",
    logo: "/logos/paypal.svg",
    rating: 3.5,
    ratingLabel: "Good",
    description: "PayPal is a widely-used online payment platform that also offers international money transfers, though fees and exchange rates can be less competitive than specialists.",
    founded: 1998,
    headquarters: "San Jose, USA",
    regulated: true,
    regulators: ["FinCEN", "FCA", "Various"],
    website: "https://paypal.com",
    minTransfer: 1,
    maxTransfer: 60000,
    transferSpeed: "Instant to 3 days",
    supportedCountries: 200,
    supportedCurrencies: 25,
    paymentMethods: ["Bank Transfer", "Debit Card", "Credit Card", "PayPal Balance"],
    deliveryMethods: ["PayPal Account", "Bank Deposit"],
    pros: [
      "Widely accepted globally",
      "Instant transfers to PayPal users",
      "Buyer protection available",
      "Easy to use interface",
      "Available in 200+ countries",
    ],
    cons: [
      "High exchange rate markup (3-4%)",
      "Transfer fees can add up",
      "Recipient needs PayPal account for instant transfer",
    ],
    features: [
      "PayPal Wallet",
      "Buyer protection",
      "Business invoicing",
      "Pay Later options",
      "Integration with merchants",
    ],
    feeStructure: "5% with $0.99 min, $4.99 max",
    exchangeRateMarkup: "3% - 4% above mid-market",
  },
  {
    slug: "moneygram",
    name: "MoneyGram",
    logo: "/logos/moneygram.svg",
    rating: 3.7,
    ratingLabel: "Good",
    description: "MoneyGram is a global money transfer company with a large agent network, offering both online and in-person transfer options to 200+ countries.",
    founded: 1940,
    headquarters: "Dallas, USA",
    regulated: true,
    regulators: ["FinCEN", "FCA"],
    website: "https://moneygram.com",
    minTransfer: 1,
    maxTransfer: 10000,
    transferSpeed: "Minutes to 3 days",
    supportedCountries: 200,
    supportedCurrencies: 50,
    paymentMethods: ["Bank Transfer", "Debit Card", "Credit Card", "Cash"],
    deliveryMethods: ["Bank Deposit", "Cash Pickup", "Mobile Wallet"],
    pros: [
      "Large global agent network",
      "Cash pickup available worldwide",
      "Transfers can arrive in minutes",
      "In-store and online options",
      "Crypto integration with Stellar",
    ],
    cons: [
      "Higher fees for smaller transfers",
      "Exchange rate markup can be steep",
      "Online experience less polished",
    ],
    features: [
      "Cash pickup at 350,000+ locations",
      "Mobile wallet delivery",
      "Bill payment",
      "Loyalty rewards",
      "Crypto on/off ramp",
    ],
    feeStructure: "From $1.99 to $11.99+",
    exchangeRateMarkup: "1% - 3% above mid-market",
  },
  {
    slug: "xoom",
    name: "Xoom (PayPal)",
    logo: "/logos/xoom.svg",
    rating: 4.0,
    ratingLabel: "Good",
    description: "Xoom, a PayPal service, offers fast international money transfers with options for bank deposit, cash pickup, and mobile reload in 130+ countries.",
    founded: 2001,
    headquarters: "San Francisco, USA",
    regulated: true,
    regulators: ["FinCEN"],
    website: "https://xoom.com",
    minTransfer: 1,
    maxTransfer: 50000,
    transferSpeed: "Minutes to 3 days",
    supportedCountries: 130,
    supportedCurrencies: 50,
    paymentMethods: ["Bank Transfer", "Debit Card", "Credit Card"],
    deliveryMethods: ["Bank Deposit", "Cash Pickup", "Mobile Reload"],
    pros: [
      "Fast delivery to many countries",
      "Cash pickup widely available",
      "Mobile reload option",
      "Backed by PayPal",
      "No fees on some corridors",
    ],
    cons: [
      "Exchange rate includes markup",
      "Limited to personal transfers",
      "Not available in all countries for sending",
    ],
    features: [
      "Cash pickup",
      "Bank deposit",
      "Mobile reload",
      "Bill payment",
      "Door-to-door delivery in select countries",
    ],
    feeStructure: "From $0 to $4.99",
    exchangeRateMarkup: "1% - 3% above mid-market",
  },
  {
    slug: "torfx",
    name: "TorFX",
    logo: "/logos/torfx.svg",
    rating: 4.5,
    ratingLabel: "Excellent",
    description: "TorFX is an award-winning international payment specialist, ideal for large transfers with competitive exchange rates and dedicated account managers.",
    founded: 2004,
    headquarters: "Cornwall, UK",
    regulated: true,
    regulators: ["FCA", "ASIC", "FINTRAC"],
    website: "https://torfx.com",
    minTransfer: 100,
    maxTransfer: null,
    transferSpeed: "1-3 business days",
    supportedCountries: 60,
    supportedCurrencies: 30,
    paymentMethods: ["Bank Transfer"],
    deliveryMethods: ["Bank Deposit"],
    pros: [
      "Dedicated account managers",
      "No transfer fees",
      "Competitive rates for large sums",
      "Forward contracts available",
      "Award-winning service",
    ],
    cons: [
      "Higher minimum transfer amount",
      "No card payments",
      "Fewer supported countries than competitors",
    ],
    features: [
      "Dedicated account manager",
      "Forward contracts",
      "Limit orders",
      "Regular payment plans",
      "Business transfers",
    ],
    feeStructure: "No transfer fees",
    exchangeRateMarkup: "0.3% - 1.5% above mid-market",
  },
  {
    slug: "instarem",
    name: "InstaReM",
    logo: "/logos/instarem.svg",
    rating: 4.1,
    ratingLabel: "Good",
    description: "InstaReM (now Nium) offers competitive international money transfers across Asia-Pacific and global corridors with transparent pricing and fast delivery.",
    founded: 2014,
    headquarters: "Singapore",
    regulated: true,
    regulators: ["MAS", "ASIC", "FCA"],
    website: "https://instarem.com",
    minTransfer: 1,
    maxTransfer: 50000,
    transferSpeed: "1-3 business days",
    supportedCountries: 60,
    supportedCurrencies: 40,
    paymentMethods: ["Bank Transfer", "Debit Card"],
    deliveryMethods: ["Bank Deposit"],
    pros: [
      "Competitive rates for Asia-Pacific corridors",
      "Transparent fee structure",
      "InstaPoints rewards program",
      "Business payment solutions",
      "Fast delivery to select countries",
    ],
    cons: [
      "Limited coverage outside Asia-Pacific",
      "No cash pickup option",
      "Less well-known brand",
    ],
    features: [
      "InstaPoints rewards",
      "Business payments",
      "Multi-currency wallet",
      "API access",
      "Recurring transfers",
    ],
    feeStructure: "From $0 to flat fee per corridor",
    exchangeRateMarkup: "0.25% - 1% above mid-market",
  },
  {
    slug: "taptap-send",
    name: "TapTap Send",
    logo: "/logos/taptap-send.png",
    rating: 4.4,
    ratingLabel: "Excellent",
    description: "TapTap Send is a mobile-first money transfer app offering zero-fee transfers to select developing countries with competitive exchange rates.",
    founded: 2018,
    headquarters: "London, UK",
    regulated: true,
    regulators: ["FCA", "FinCEN"],
    website: "https://taptapsend.com",
    minTransfer: 10,
    maxTransfer: 10000,
    transferSpeed: "Minutes to 1 business day",
    supportedCountries: 30,
    supportedCurrencies: 20,
    paymentMethods: ["Debit Card"],
    deliveryMethods: ["Bank Deposit", "Mobile Money"],
    pros: [
      "Zero transfer fees on all corridors",
      "Competitive exchange rates",
      "Simple, mobile-first experience",
      "Fast delivery to many corridors",
      "Transparent pricing — what you see is what you get",
    ],
    cons: [
      "Limited to debit card funding only",
      "No cash pickup option",
      "Smaller country coverage than major providers",
      "Mobile app only — no web transfers",
    ],
    features: [
      "Zero-fee transfers",
      "Mobile app",
      "Recurring transfers",
      "Real-time tracking",
      "Instant delivery to select banks",
    ],
    feeStructure: "$0 (no fees)",
    exchangeRateMarkup: "0.5% - 1.5% above mid-market",
  },
  {
    slug: "ace-money-transfer",
    name: "ACE Money Transfer",
    logo: "/logos/ace-money-transfer.svg",
    rating: 4.3,
    ratingLabel: "Excellent",
    description: "ACE Money Transfer specializes in remittances to South Asia and Africa, offering competitive rates, low fees, and fast delivery with a strong focus on the Pakistan corridor.",
    founded: 2002,
    headquarters: "Manchester, UK",
    regulated: true,
    regulators: ["FCA", "FinCEN", "AUSTRAC"],
    website: "https://acemoneytransfer.com",
    minTransfer: 10,
    maxTransfer: 25000,
    transferSpeed: "Minutes to 2 business days",
    supportedCountries: 100,
    supportedCurrencies: 30,
    paymentMethods: ["Bank Transfer", "Debit Card", "Credit Card"],
    deliveryMethods: ["Bank Deposit", "Cash Pickup", "Mobile Wallet"],
    pros: [
      "Very competitive rates on Pakistan corridor",
      "Low fees — often free first transfer",
      "Cash pickup and bank deposit options",
      "Loyalty rewards program",
      "24/7 customer support",
    ],
    cons: [
      "Less known outside South Asian corridors",
      "Exchange rate can vary by payment method",
      "Higher fees for credit card funding",
    ],
    features: [
      "Loyalty rewards program",
      "Referral bonuses",
      "Mobile app",
      "Real-time tracking",
      "Cash pickup network",
    ],
    feeStructure: "From $0 to $4.99 depending on corridor",
    exchangeRateMarkup: "0.3% - 1.2% above mid-market",
  },
];

export { currencies } from "@/data/transfer-currencies";

// --- Exchange rates from XE mid-market (authoritative) with static fallback ---
import {
  midMarketRates,
  getMidMarketRate,
  quotesByCorridor,
  quotesByCorridorAmount,
  findNearestAmount,
  trustpilotIndex,
  providerNames,
  allProviderSlugs,
  type NormalizedQuote,
} from "@/lib/unified-quotes";

export const exchangeRates: Record<string, number> = midMarketRates;

export function getExchangeRate(from: string, to: string): number {
  return getMidMarketRate(from, to);
}

// Map Trustpilot labels to our 4-value system
function toRatingLabel(score: number): Provider["ratingLabel"] {
  if (score >= 4.3) return "Excellent";
  if (score >= 3.5) return "Good";
  if (score >= 2.5) return "Fair";
  return "Poor";
}

// Overlay Trustpilot ratings onto hardcoded providers
for (const provider of providers) {
  const tp = trustpilotIndex[provider.slug];
  if (tp) {
    provider.rating = tp.score;
    provider.ratingLabel = toRatingLabel(tp.score);
  }
}

// Fallback simulation config for providers/corridors not in scraped data
const fallbackMarkups: Record<string, { markup: number; fee: number; speed: string }> = {
  wise: { markup: 0.004, fee: 6, speed: "1-2 business days" },
  remitly: { markup: 0.009, fee: 1.99, speed: "Minutes to 3 days" },
  ofx: { markup: 0.027, fee: 8, speed: "1-3 business days" },
  xe: { markup: 0.009, fee: 0, speed: "1-4 business days" },
  "western-union": { markup: 0.025, fee: 4.99, speed: "Minutes to 5 days" },
  worldremit: { markup: 0.015, fee: 2.99, speed: "Minutes to 3 days" },
  revolut: { markup: 0.003, fee: 0, speed: "Instant to 3 days" },
  paypal: { markup: 0.035, fee: 2.99, speed: "Instant to 3 days" },
  moneygram: { markup: 0.004, fee: 1.99, speed: "Minutes to 3 days" },
  xoom: { markup: 0.023, fee: 0, speed: "Minutes to 3 days" },
  torfx: { markup: 0.006, fee: 0, speed: "1-3 business days" },
  instarem: { markup: 0.004, fee: 0, speed: "1-3 business days" },
  "taptap-send": { markup: 0.008, fee: 0, speed: "Minutes to 1 day" },
  "ace-money-transfer": { markup: 0.006, fee: 2.99, speed: "Minutes to 2 days" },
};

export function generateQuotes(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  liveRates?: Record<string, number>
): TransferQuote[] {
  const corridorKey = `${fromCurrency}_${toCurrency}`;
  const corridorQuotes = quotesByCorridor[corridorKey];

  const baseRate = liveRates
    ? (liveRates[toCurrency] || 1) / (liveRates[fromCurrency] || 1)
    : getExchangeRate(fromCurrency, toCurrency);

  if (corridorQuotes && corridorQuotes.length > 0) {
    // Try exact amount match first, then nearest scraped amount
    const nearestAmount = findNearestAmount(amount);
    const amountKey = `${corridorKey}_${nearestAmount}`;
    const nearestQuotes = quotesByCorridorAmount[amountKey] || corridorQuotes;
    const isExactAmount = nearestAmount === amount;

    // Deduplicate by provider slug (prefer the nearest amount quote)
    const providerQuoteMap = new Map<string, NormalizedQuote>();
    for (const sq of nearestQuotes) {
      const existing = providerQuoteMap.get(sq.providerSlug);
      if (!existing || sq.sourcePriority < existing.sourcePriority) {
        providerQuoteMap.set(sq.providerSlug, sq);
      }
    }

    const quotes: TransferQuote[] = [];

    for (const sq of providerQuoteMap.values()) {
      const provider = providers.find((p) => p.slug === sq.providerSlug);

      // Use real markup from scraped data, apply to live or static base rate
      const markupPct = sq.markup / 100;
      const providerRate = baseRate * (1 - markupPct);

      let fee: number;
      let receiveAmount: number;

      if (isExactAmount) {
        fee = sq.fee;
        receiveAmount = (amount - fee) * providerRate;
      } else {
        const feeRatio = sq.fee / (sq.sendAmount || 1000);
        fee = Math.max(feeRatio * amount, sq.fee * 0.5);
        receiveAmount = (amount - fee) * providerRate;
      }

      // Use Trustpilot rating if available, otherwise provider default or 3.5
      const tp = trustpilotIndex[sq.providerSlug];
      const rating = tp?.score ?? provider?.rating ?? 3.5;
      const ratingLabel = toRatingLabel(rating);

      quotes.push({
        providerSlug: sq.providerSlug,
        sendAmount: amount,
        sendCurrency: fromCurrency,
        receiveCurrency: toCurrency,
        exchangeRate: Math.round(providerRate * 10000) / 10000,
        fee: Math.round(fee * 100) / 100,
        receiveAmount: Math.round(receiveAmount * 100) / 100,
        transferSpeed: sq.deliveryEstimate || provider?.transferSpeed || "1-3 business days",
        rating,
        ratingLabel,
      });
    }

    // Include remaining hardcoded providers using fallback data
    const scrapedSlugs = new Set(quotes.map((q) => q.providerSlug));
    for (const provider of providers) {
      if (scrapedSlugs.has(provider.slug)) continue;
      const config = fallbackMarkups[provider.slug] || { markup: 0.02, fee: 2.99, speed: "1-3 days" };
      const providerRate = baseRate * (1 - config.markup);
      const receiveAmount = (amount - config.fee) * providerRate;
      quotes.push({
        providerSlug: provider.slug,
        sendAmount: amount,
        sendCurrency: fromCurrency,
        receiveCurrency: toCurrency,
        exchangeRate: Math.round(providerRate * 10000) / 10000,
        fee: Math.round(config.fee * 100) / 100,
        receiveAmount: Math.round(receiveAmount * 100) / 100,
        transferSpeed: config.speed,
        rating: provider.rating,
        ratingLabel: provider.ratingLabel,
      });
    }

    return quotes.sort((a, b) => b.receiveAmount - a.receiveAmount);
  }

  // Fallback: simulate quotes for corridors we didn't scrape
  return providers.map((provider) => {
    const config = fallbackMarkups[provider.slug] || { markup: 0.02, fee: 2.99, speed: "1-3 days" };
    const providerRate = baseRate * (1 - config.markup);
    const receiveAmount = (amount - config.fee) * providerRate;

    return {
      providerSlug: provider.slug,
      sendAmount: amount,
      sendCurrency: fromCurrency,
      receiveCurrency: toCurrency,
      exchangeRate: Math.round(providerRate * 10000) / 10000,
      fee: Math.round(config.fee * 100) / 100,
      receiveAmount: Math.round(receiveAmount * 100) / 100,
      transferSpeed: config.speed,
      rating: provider.rating,
      ratingLabel: provider.ratingLabel,
    };
  }).sort((a, b) => b.receiveAmount - a.receiveAmount);
}

export function getProvider(slug: string): Provider | undefined {
  return providers.find((p) => p.slug === slug);
}

/** All provider slugs we have data for (hardcoded + scraped sources like Monito) */
export function getAllProviderSlugs(): string[] {
  const slugs = new Set<string>(providers.map((p) => p.slug));
  for (const s of allProviderSlugs) slugs.add(s);
  return [...slugs].sort();
}

/** Get display name for any provider slug (hardcoded or discovered) */
export function getProviderName(slug: string): string {
  const provider = providers.find((p) => p.slug === slug);
  if (provider) return provider.name;
  return providerNames[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export const popularCorridors = [
  { from: "USD", to: "INR", label: "USA to India" },
  { from: "GBP", to: "EUR", label: "UK to Europe" },
  { from: "USD", to: "PHP", label: "USA to Philippines" },
  { from: "USD", to: "MXN", label: "USA to Mexico" },
  { from: "GBP", to: "INR", label: "UK to India" },
  { from: "CAD", to: "INR", label: "Canada to India" },
  { from: "USD", to: "NGN", label: "USA to Nigeria" },
  { from: "GBP", to: "PKR", label: "UK to Pakistan" },
];

export const guides = [
  {
    slug: "how-to-send-money-abroad",
    title: "How to Send Money Abroad: Complete Guide",
    excerpt: "Everything you need to know about sending money internationally, from choosing a provider to understanding fees and exchange rates.",
    category: "Guides",
    readTime: "8 min read",
  },
  {
    slug: "cheapest-way-to-send-money",
    title: "Cheapest Way to Send Money Internationally",
    excerpt: "Compare the most affordable options for international transfers and learn how to minimize fees and get the best exchange rates.",
    category: "Guides",
    readTime: "6 min read",
  },
  {
    slug: "exchange-rate-explained",
    title: "Exchange Rates Explained: Mid-Market vs Provider Rates",
    excerpt: "Understand the difference between mid-market exchange rates and the rates offered by money transfer providers.",
    category: "Education",
    readTime: "5 min read",
  },
  {
    slug: "money-transfer-safety",
    title: "Is Sending Money Online Safe? Security Guide",
    excerpt: "Learn about the security measures that protect your money when using online transfer services and how to stay safe.",
    category: "Education",
    readTime: "7 min read",
  },
  {
    slug: "business-international-payments",
    title: "International Payments for Business: Best Options",
    excerpt: "A comprehensive guide to making international business payments, including batch transfers, invoicing, and FX management.",
    category: "Business",
    readTime: "10 min read",
  },
  {
    slug: "remittance-trends",
    title: "Global Remittance Trends & Statistics 2026",
    excerpt: "The latest data on global remittance flows, top corridors, and emerging trends in international money transfers.",
    category: "Research",
    readTime: "12 min read",
  },
  {
    slug: "money-transfer-promo-codes-referral-programs",
    title: "Money Transfer Promo Codes & Refer-a-Friend Deals (2026)",
    excerpt: "Every active promo code, sign-up bonus, and referral program from 14 top providers — save on fees and earn rewards.",
    category: "Guides",
    readTime: "14 min read",
  },
];
