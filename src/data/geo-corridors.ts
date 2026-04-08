/**
 * Geo-aware corridor data — maps send currencies to their most popular
 * destination corridors, based on World Bank remittance data and actual
 * scraped provider coverage.
 */

/** Country code (ISO 3166-1 alpha-2) → default send currency */
export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // USD
  US: "USD",
  // GBP
  GB: "GBP",
  // EUR (Eurozone + common EU)
  DE: "EUR", FR: "EUR", ES: "EUR", IT: "EUR", NL: "EUR", BE: "EUR",
  AT: "EUR", IE: "EUR", PT: "EUR", FI: "EUR", GR: "EUR", LU: "EUR",
  SK: "EUR", SI: "EUR", EE: "EUR", LV: "EUR", LT: "EUR", CY: "EUR",
  MT: "EUR", HR: "EUR",
  // AED
  AE: "AED",
  // SAR
  SA: "SAR",
  // CAD
  CA: "CAD",
  // AUD
  AU: "AUD",
  // NZD
  NZ: "NZD",
  // SGD
  SG: "SGD",
  // CHF
  CH: "CHF",
  // INR
  IN: "INR",
  // MYR
  MY: "MYR",
  // ZAR
  ZA: "ZAR",
  // Additional send currencies
  JP: "JPY",
  KR: "KRW",
  HK: "HKD",
  NO: "NOK",
  SE: "SEK",
  DK: "DKK",
  PL: "PLN",
  CZ: "CZK",
  HU: "HUF",
  IL: "ILS",
  KW: "KWD",
  QA: "QAR",
  BH: "BHD",
  OM: "OMR",
};

export interface PopularCorridor {
  /** Destination currency code */
  toCurrency: string;
  /** Country/region name for display */
  label: string;
  /** Corridor slug for linking to /send-money/[corridor] */
  corridorSlug: string;
  /** Flag emoji */
  flag: string;
  /** Currency symbol for display */
  symbol: string;
}

export interface GeoCurrencyConfig {
  /** Default receive currency for ComparisonWidget */
  defaultTo: string;
  /** Default send amount */
  defaultAmount: number;
  /** Top 5 popular destination corridors (for live rates bar + links) */
  popularCorridors: PopularCorridor[];
}

/**
 * Popular corridors per send currency.
 * Order matters — first 3 are used for the "Top Provider" section,
 * all 5 appear in the live rates bar.
 */
export const GEO_CORRIDORS: Record<string, GeoCurrencyConfig> = {
  USD: {
    defaultTo: "INR",
    defaultAmount: 1000,
    popularCorridors: [
      { toCurrency: "INR", label: "India", corridorSlug: "usa-to-india", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "MXN", label: "Mexico", corridorSlug: "usa-to-mexico", flag: "🇲🇽", symbol: "MX$" },
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "usa-to-philippines", flag: "🇵🇭", symbol: "₱" },
      { toCurrency: "PKR", label: "Pakistan", corridorSlug: "usa-to-pakistan", flag: "🇵🇰", symbol: "Rs" },
      { toCurrency: "EUR", label: "Europe", corridorSlug: "usd-to-eur", flag: "🇪🇺", symbol: "€" },
    ],
  },
  GBP: {
    defaultTo: "INR",
    defaultAmount: 1000,
    popularCorridors: [
      { toCurrency: "INR", label: "India", corridorSlug: "uk-to-india", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "EUR", label: "Europe", corridorSlug: "uk-to-europe", flag: "🇪🇺", symbol: "€" },
      { toCurrency: "PKR", label: "Pakistan", corridorSlug: "uk-to-pakistan", flag: "🇵🇰", symbol: "Rs" },
      { toCurrency: "NGN", label: "Nigeria", corridorSlug: "uk-to-nigeria", flag: "🇳🇬", symbol: "₦" },
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "gbp-to-php", flag: "🇵🇭", symbol: "₱" },
    ],
  },
  EUR: {
    defaultTo: "INR",
    defaultAmount: 1000,
    popularCorridors: [
      { toCurrency: "INR", label: "India", corridorSlug: "europe-to-india", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "eur-to-php", flag: "🇵🇭", symbol: "₱" },
      { toCurrency: "NGN", label: "Nigeria", corridorSlug: "eur-to-ngn", flag: "🇳🇬", symbol: "₦" },
      { toCurrency: "MAD", label: "Morocco", corridorSlug: "eur-to-mad", flag: "🇲🇦", symbol: "MAD" },
      { toCurrency: "TRY", label: "Turkey", corridorSlug: "eur-to-try", flag: "🇹🇷", symbol: "₺" },
    ],
  },
  AED: {
    defaultTo: "INR",
    defaultAmount: 1000,
    popularCorridors: [
      { toCurrency: "INR", label: "India", corridorSlug: "uae-to-india", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "PKR", label: "Pakistan", corridorSlug: "uae-to-pakistan", flag: "🇵🇰", symbol: "Rs" },
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "uae-to-philippines", flag: "🇵🇭", symbol: "₱" },
      { toCurrency: "BDT", label: "Bangladesh", corridorSlug: "aed-to-bdt", flag: "🇧🇩", symbol: "৳" },
      { toCurrency: "EGP", label: "Egypt", corridorSlug: "aed-to-egp", flag: "🇪🇬", symbol: "E£" },
    ],
  },
  SAR: {
    defaultTo: "INR",
    defaultAmount: 1000,
    popularCorridors: [
      { toCurrency: "INR", label: "India", corridorSlug: "saudi-to-india", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "PKR", label: "Pakistan", corridorSlug: "saudi-to-pakistan", flag: "🇵🇰", symbol: "Rs" },
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "sar-to-php", flag: "🇵🇭", symbol: "₱" },
      { toCurrency: "BDT", label: "Bangladesh", corridorSlug: "sar-to-bdt", flag: "🇧🇩", symbol: "৳" },
      { toCurrency: "EGP", label: "Egypt", corridorSlug: "sar-to-egp", flag: "🇪🇬", symbol: "E£" },
    ],
  },
  CAD: {
    defaultTo: "INR",
    defaultAmount: 1000,
    popularCorridors: [
      { toCurrency: "INR", label: "India", corridorSlug: "canada-to-india", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "canada-to-philippines", flag: "🇵🇭", symbol: "₱" },
      { toCurrency: "PKR", label: "Pakistan", corridorSlug: "cad-to-pkr", flag: "🇵🇰", symbol: "Rs" },
      { toCurrency: "NGN", label: "Nigeria", corridorSlug: "cad-to-ngn", flag: "🇳🇬", symbol: "₦" },
      { toCurrency: "EUR", label: "Europe", corridorSlug: "cad-to-eur", flag: "🇪🇺", symbol: "€" },
    ],
  },
  AUD: {
    defaultTo: "INR",
    defaultAmount: 1000,
    popularCorridors: [
      { toCurrency: "INR", label: "India", corridorSlug: "australia-to-india", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "australia-to-philippines", flag: "🇵🇭", symbol: "₱" },
      { toCurrency: "GBP", label: "United Kingdom", corridorSlug: "aud-to-gbp", flag: "🇬🇧", symbol: "£" },
      { toCurrency: "EUR", label: "Europe", corridorSlug: "aud-to-eur", flag: "🇪🇺", symbol: "€" },
      { toCurrency: "VND", label: "Vietnam", corridorSlug: "aud-to-vnd", flag: "🇻🇳", symbol: "₫" },
    ],
  },
  NZD: {
    defaultTo: "INR",
    defaultAmount: 1000,
    popularCorridors: [
      { toCurrency: "INR", label: "India", corridorSlug: "new-zealand-to-india", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "nzd-to-php", flag: "🇵🇭", symbol: "₱" },
      { toCurrency: "GBP", label: "United Kingdom", corridorSlug: "nzd-to-gbp", flag: "🇬🇧", symbol: "£" },
      { toCurrency: "AUD", label: "Australia", corridorSlug: "nzd-to-aud", flag: "🇦🇺", symbol: "A$" },
      { toCurrency: "EUR", label: "Europe", corridorSlug: "nzd-to-eur", flag: "🇪🇺", symbol: "€" },
    ],
  },
  SGD: {
    defaultTo: "INR",
    defaultAmount: 1000,
    popularCorridors: [
      { toCurrency: "INR", label: "India", corridorSlug: "singapore-to-india", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "singapore-to-philippines", flag: "🇵🇭", symbol: "₱" },
      { toCurrency: "MYR", label: "Malaysia", corridorSlug: "sgd-to-myr", flag: "🇲🇾", symbol: "RM" },
      { toCurrency: "IDR", label: "Indonesia", corridorSlug: "sgd-to-idr", flag: "🇮🇩", symbol: "Rp" },
      { toCurrency: "EUR", label: "Europe", corridorSlug: "sgd-to-eur", flag: "🇪🇺", symbol: "€" },
    ],
  },
  CHF: {
    defaultTo: "EUR",
    defaultAmount: 1000,
    popularCorridors: [
      { toCurrency: "EUR", label: "Europe", corridorSlug: "chf-to-eur", flag: "🇪🇺", symbol: "€" },
      { toCurrency: "INR", label: "India", corridorSlug: "chf-to-inr", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "GBP", label: "United Kingdom", corridorSlug: "chf-to-gbp", flag: "🇬🇧", symbol: "£" },
      { toCurrency: "USD", label: "United States", corridorSlug: "chf-to-usd", flag: "🇺🇸", symbol: "$" },
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "chf-to-php", flag: "🇵🇭", symbol: "₱" },
    ],
  },
  JPY: {
    defaultTo: "PHP",
    defaultAmount: 100000,
    popularCorridors: [
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "japan-to-philippines", flag: "🇵🇭", symbol: "₱" },
      { toCurrency: "INR", label: "India", corridorSlug: "japan-to-india", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "USD", label: "United States", corridorSlug: "japan-to-usa", flag: "🇺🇸", symbol: "$" },
      { toCurrency: "BRL", label: "Brazil", corridorSlug: "jpy-to-brl", flag: "🇧🇷", symbol: "R$" },
      { toCurrency: "VND", label: "Vietnam", corridorSlug: "jpy-to-vnd", flag: "🇻🇳", symbol: "₫" },
    ],
  },
  HKD: {
    defaultTo: "PHP",
    defaultAmount: 5000,
    popularCorridors: [
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "hong-kong-to-philippines", flag: "🇵🇭", symbol: "₱" },
      { toCurrency: "INR", label: "India", corridorSlug: "hong-kong-to-india", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "IDR", label: "Indonesia", corridorSlug: "hkd-to-idr", flag: "🇮🇩", symbol: "Rp" },
      { toCurrency: "USD", label: "United States", corridorSlug: "hkd-to-usd", flag: "🇺🇸", symbol: "$" },
      { toCurrency: "GBP", label: "United Kingdom", corridorSlug: "hkd-to-gbp", flag: "🇬🇧", symbol: "£" },
    ],
  },
  KRW: {
    defaultTo: "PHP",
    defaultAmount: 1000000,
    popularCorridors: [
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "south-korea-to-philippines", flag: "🇵🇭", symbol: "₱" },
      { toCurrency: "VND", label: "Vietnam", corridorSlug: "south-korea-to-vietnam", flag: "🇻🇳", symbol: "₫" },
      { toCurrency: "USD", label: "United States", corridorSlug: "krw-to-usd", flag: "🇺🇸", symbol: "$" },
      { toCurrency: "INR", label: "India", corridorSlug: "krw-to-inr", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "IDR", label: "Indonesia", corridorSlug: "krw-to-idr", flag: "🇮🇩", symbol: "Rp" },
    ],
  },
  MYR: {
    defaultTo: "INR",
    defaultAmount: 2000,
    popularCorridors: [
      { toCurrency: "INR", label: "India", corridorSlug: "malaysia-to-india", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "IDR", label: "Indonesia", corridorSlug: "malaysia-to-indonesia", flag: "🇮🇩", symbol: "Rp" },
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "malaysia-to-philippines", flag: "🇵🇭", symbol: "₱" },
      { toCurrency: "BDT", label: "Bangladesh", corridorSlug: "myr-to-bdt", flag: "🇧🇩", symbol: "৳" },
      { toCurrency: "NPR", label: "Nepal", corridorSlug: "myr-to-npr", flag: "🇳🇵", symbol: "Rs" },
    ],
  },
  ZAR: {
    defaultTo: "NGN",
    defaultAmount: 5000,
    popularCorridors: [
      { toCurrency: "NGN", label: "Nigeria", corridorSlug: "south-africa-to-nigeria", flag: "🇳🇬", symbol: "₦" },
      { toCurrency: "GBP", label: "United Kingdom", corridorSlug: "south-africa-to-uk", flag: "🇬🇧", symbol: "£" },
      { toCurrency: "KES", label: "Kenya", corridorSlug: "south-africa-to-kenya", flag: "🇰🇪", symbol: "KSh" },
      { toCurrency: "USD", label: "United States", corridorSlug: "zar-to-usd", flag: "🇺🇸", symbol: "$" },
      { toCurrency: "ZMW", label: "Zambia", corridorSlug: "zar-to-zmw", flag: "🇿🇲", symbol: "ZK" },
    ],
  },
  INR: {
    defaultTo: "USD",
    defaultAmount: 50000,
    popularCorridors: [
      { toCurrency: "USD", label: "United States", corridorSlug: "india-to-usa", flag: "🇺🇸", symbol: "$" },
      { toCurrency: "GBP", label: "United Kingdom", corridorSlug: "india-to-uk", flag: "🇬🇧", symbol: "£" },
      { toCurrency: "CAD", label: "Canada", corridorSlug: "india-to-canada", flag: "🇨🇦", symbol: "C$" },
      { toCurrency: "AUD", label: "Australia", corridorSlug: "india-to-australia", flag: "🇦🇺", symbol: "A$" },
      { toCurrency: "EUR", label: "Europe", corridorSlug: "inr-to-eur", flag: "🇪🇺", symbol: "€" },
    ],
  },
};

/** Fallback config when geo-currency is unknown or not in our map */
export const DEFAULT_GEO_CONFIG = GEO_CORRIDORS.USD;
