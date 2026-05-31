/**
 * Geo-aware corridor data — maps send currencies to their most popular
 * destination corridors, based on World Bank remittance data and actual
 * scraped provider coverage.
 *
 * Two modes:
 *  - "Sender" countries (US, UK, Gulf, EU, etc.): from = local currency, to = top remittance destination
 *  - "Receiver" countries (PK, PH, NG, etc.): from = dominant sending currency (e.g. USD/GBP/EUR),
 *    to = local currency. Reflects that visitors from these countries are comparing services to
 *    receive money, not send it.
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
  CN: "CNY",
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
  CNY: {
    defaultTo: "USD",
    defaultAmount: 5000,
    popularCorridors: [
      { toCurrency: "USD", label: "United States", corridorSlug: "cny-to-usd", flag: "🇺🇸", symbol: "$" },
      { toCurrency: "EUR", label: "Europe", corridorSlug: "cny-to-eur", flag: "🇪🇺", symbol: "€" },
      { toCurrency: "GBP", label: "United Kingdom", corridorSlug: "cny-to-gbp", flag: "🇬🇧", symbol: "£" },
      { toCurrency: "AUD", label: "Australia", corridorSlug: "cny-to-aud", flag: "🇦🇺", symbol: "A$" },
      { toCurrency: "SGD", label: "Singapore", corridorSlug: "cny-to-sgd", flag: "🇸🇬", symbol: "S$" },
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
  // Gulf sender currencies
  KWD: {
    defaultTo: "INR",
    defaultAmount: 200,
    popularCorridors: [
      { toCurrency: "INR", label: "India", corridorSlug: "kuwait-to-india", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "PKR", label: "Pakistan", corridorSlug: "kuwait-to-pakistan", flag: "🇵🇰", symbol: "Rs" },
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "kwd-to-php", flag: "🇵🇭", symbol: "₱" },
      { toCurrency: "BDT", label: "Bangladesh", corridorSlug: "kwd-to-bdt", flag: "🇧🇩", symbol: "৳" },
      { toCurrency: "EGP", label: "Egypt", corridorSlug: "kwd-to-egp", flag: "🇪🇬", symbol: "E£" },
    ],
  },
  QAR: {
    defaultTo: "INR",
    defaultAmount: 2000,
    popularCorridors: [
      { toCurrency: "INR", label: "India", corridorSlug: "qatar-to-india", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "PKR", label: "Pakistan", corridorSlug: "qatar-to-pakistan", flag: "🇵🇰", symbol: "Rs" },
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "qar-to-php", flag: "🇵🇭", symbol: "₱" },
      { toCurrency: "BDT", label: "Bangladesh", corridorSlug: "qar-to-bdt", flag: "🇧🇩", symbol: "৳" },
      { toCurrency: "EGP", label: "Egypt", corridorSlug: "qar-to-egp", flag: "🇪🇬", symbol: "E£" },
    ],
  },
  OMR: {
    defaultTo: "INR",
    defaultAmount: 300,
    popularCorridors: [
      { toCurrency: "INR", label: "India", corridorSlug: "oman-to-india", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "PKR", label: "Pakistan", corridorSlug: "oman-to-pakistan", flag: "🇵🇰", symbol: "Rs" },
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "omr-to-php", flag: "🇵🇭", symbol: "₱" },
      { toCurrency: "BDT", label: "Bangladesh", corridorSlug: "omr-to-bdt", flag: "🇧🇩", symbol: "৳" },
      { toCurrency: "EGP", label: "Egypt", corridorSlug: "omr-to-egp", flag: "🇪🇬", symbol: "E£" },
    ],
  },
  BHD: {
    defaultTo: "INR",
    defaultAmount: 300,
    popularCorridors: [
      { toCurrency: "INR", label: "India", corridorSlug: "bahrain-to-india", flag: "🇮🇳", symbol: "₹" },
      { toCurrency: "PKR", label: "Pakistan", corridorSlug: "bahrain-to-pakistan", flag: "🇵🇰", symbol: "Rs" },
      { toCurrency: "PHP", label: "Philippines", corridorSlug: "bhd-to-php", flag: "🇵🇭", symbol: "₱" },
      { toCurrency: "BDT", label: "Bangladesh", corridorSlug: "bhd-to-bdt", flag: "🇧🇩", symbol: "৳" },
      { toCurrency: "EGP", label: "Egypt", corridorSlug: "bhd-to-egp", flag: "🇪🇬", symbol: "E£" },
    ],
  },
};

/** Fallback config when geo-currency is unknown or not in our map */
export const DEFAULT_GEO_CONFIG = GEO_CORRIDORS.USD;

// ---------------------------------------------------------------------------
// Receiver-country corridors
// ---------------------------------------------------------------------------
// Countries where visitors are primarily looking to RECEIVE money (diaspora
// communities, migrant worker families, etc.). We show them the dominant
// inbound remittance corridor instead of their local send currency.
// Sources: World Bank Remittance Prices Worldwide, IFAD, UN migration data.

export interface ReceiverCountryConfig {
  /** Most common sending currency for remittances to this country */
  fromCurrency: string;
  /** Local receive currency */
  toCurrency: string;
  /** Sensible default amount in fromCurrency */
  defaultAmount: number;
}

export const RECEIVER_COUNTRY_CORRIDORS: Record<string, ReceiverCountryConfig> = {
  // ── South Asia (Gulf + UK + US send to these) ───────────────────────────
  // India: predominantly a receiver (USD→INR is world's largest corridor)
  IN:  { fromCurrency: "USD", toCurrency: "INR",  defaultAmount: 1000 },
  // Pakistan: largest inbound from UAE, Saudi, UK, USA — USD is most universal
  PK:  { fromCurrency: "USD", toCurrency: "PKR",  defaultAmount: 1000 },
  BD:  { fromCurrency: "USD", toCurrency: "BDT",  defaultAmount: 1000 },
  NP:  { fromCurrency: "USD", toCurrency: "NPR",  defaultAmount: 1000 },
  LK:  { fromCurrency: "USD", toCurrency: "LKR",  defaultAmount: 1000 },
  AF:  { fromCurrency: "USD", toCurrency: "AFN",  defaultAmount: 500  },

  // ── Southeast Asia ───────────────────────────────────────────────────────
  PH:  { fromCurrency: "USD", toCurrency: "PHP",  defaultAmount: 1000 },
  VN:  { fromCurrency: "USD", toCurrency: "VND",  defaultAmount: 1000 },
  // Indonesia: mostly Malaysia + Gulf send — USD is still most universal
  ID:  { fromCurrency: "USD", toCurrency: "IDR",  defaultAmount: 1000 },
  KH:  { fromCurrency: "USD", toCurrency: "KHR",  defaultAmount: 500  },
  MM:  { fromCurrency: "USD", toCurrency: "MMK",  defaultAmount: 500  },
  LA:  { fromCurrency: "USD", toCurrency: "LAK",  defaultAmount: 500  },

  // ── Latin America & Caribbean ────────────────────────────────────────────
  // Mexico: 98 % of remittances come from USA (World Bank)
  MX:  { fromCurrency: "USD", toCurrency: "MXN",  defaultAmount: 1000 },
  CO:  { fromCurrency: "USD", toCurrency: "COP",  defaultAmount: 1000 },
  DO:  { fromCurrency: "USD", toCurrency: "DOP",  defaultAmount: 500  },
  GT:  { fromCurrency: "USD", toCurrency: "GTQ",  defaultAmount: 500  },
  HN:  { fromCurrency: "USD", toCurrency: "HNL",  defaultAmount: 500  },
  NI:  { fromCurrency: "USD", toCurrency: "NIO",  defaultAmount: 300  },
  PE:  { fromCurrency: "USD", toCurrency: "PEN",  defaultAmount: 1000 },
  BO:  { fromCurrency: "USD", toCurrency: "BOB",  defaultAmount: 500  },
  PY:  { fromCurrency: "USD", toCurrency: "PYG",  defaultAmount: 500  },
  BR:  { fromCurrency: "USD", toCurrency: "BRL",  defaultAmount: 1000 },
  // Jamaica: UK is top sender
  JM:  { fromCurrency: "GBP", toCurrency: "JMD",  defaultAmount: 500  },
  HT:  { fromCurrency: "USD", toCurrency: "HTG",  defaultAmount: 300  },
  TT:  { fromCurrency: "USD", toCurrency: "TTD",  defaultAmount: 500  },
  GY:  { fromCurrency: "USD", toCurrency: "GYD",  defaultAmount: 300  },
  SR:  { fromCurrency: "USD", toCurrency: "SRD",  defaultAmount: 300  },

  // ── Sub-Saharan Africa ───────────────────────────────────────────────────
  // Nigeria: UK is top sender, but USD is widely used for fx reference
  NG:  { fromCurrency: "GBP", toCurrency: "NGN",  defaultAmount: 500  },
  KE:  { fromCurrency: "USD", toCurrency: "KES",  defaultAmount: 500  },
  GH:  { fromCurrency: "GBP", toCurrency: "GHS",  defaultAmount: 500  },
  ET:  { fromCurrency: "USD", toCurrency: "ETB",  defaultAmount: 500  },
  TZ:  { fromCurrency: "USD", toCurrency: "TZS",  defaultAmount: 500  },
  UG:  { fromCurrency: "USD", toCurrency: "UGX",  defaultAmount: 500  },
  RW:  { fromCurrency: "USD", toCurrency: "RWF",  defaultAmount: 300  },
  // Gambia: UK diaspora dominant
  GM:  { fromCurrency: "GBP", toCurrency: "GMD",  defaultAmount: 300  },
  SL:  { fromCurrency: "GBP", toCurrency: "SLL",  defaultAmount: 300  },
  LR:  { fromCurrency: "USD", toCurrency: "LRD",  defaultAmount: 300  },
  MZ:  { fromCurrency: "USD", toCurrency: "MZN",  defaultAmount: 300  },
  AO:  { fromCurrency: "USD", toCurrency: "AOA",  defaultAmount: 300  },
  // Francophone West Africa: France/EU dominant
  SN:  { fromCurrency: "EUR", toCurrency: "XOF",  defaultAmount: 500  },
  CI:  { fromCurrency: "EUR", toCurrency: "XOF",  defaultAmount: 500  },
  ML:  { fromCurrency: "EUR", toCurrency: "XOF",  defaultAmount: 500  },
  BF:  { fromCurrency: "EUR", toCurrency: "XOF",  defaultAmount: 500  },
  BJ:  { fromCurrency: "EUR", toCurrency: "XOF",  defaultAmount: 300  },
  TG:  { fromCurrency: "EUR", toCurrency: "XOF",  defaultAmount: 300  },
  NE:  { fromCurrency: "EUR", toCurrency: "XOF",  defaultAmount: 300  },
  GN:  { fromCurrency: "EUR", toCurrency: "GNF",  defaultAmount: 300  },
  CM:  { fromCurrency: "EUR", toCurrency: "XAF",  defaultAmount: 500  },
  CV:  { fromCurrency: "EUR", toCurrency: "CVE",  defaultAmount: 300  },
  BI:  { fromCurrency: "USD", toCurrency: "BIF",  defaultAmount: 200  },

  // ── North Africa / MENA ──────────────────────────────────────────────────
  EG:  { fromCurrency: "USD", toCurrency: "EGP",  defaultAmount: 1000 },
  // Morocco, Tunisia, Algeria: France/EU diaspora dominant
  MA:  { fromCurrency: "EUR", toCurrency: "MAD",  defaultAmount: 1000 },
  TN:  { fromCurrency: "EUR", toCurrency: "TND",  defaultAmount: 1000 },
  DZ:  { fromCurrency: "EUR", toCurrency: "DZD",  defaultAmount: 1000 },
  JO:  { fromCurrency: "USD", toCurrency: "JOD",  defaultAmount: 1000 },
  LB:  { fromCurrency: "USD", toCurrency: "LBP",  defaultAmount: 500  },
  IQ:  { fromCurrency: "USD", toCurrency: "IQD",  defaultAmount: 500  },
  YE:  { fromCurrency: "USD", toCurrency: "YER",  defaultAmount: 300  },
  // Sudan / Somalia: diaspora sends USD
  SD:  { fromCurrency: "USD", toCurrency: "SDG",  defaultAmount: 300  },
  SO:  { fromCurrency: "USD", toCurrency: "SOS",  defaultAmount: 300  },

  // ── Eastern Europe & Balkans ─────────────────────────────────────────────
  UA:  { fromCurrency: "EUR", toCurrency: "UAH",  defaultAmount: 1000 },
  // Romania: large EU diaspora (Italy, Spain, Germany)
  RO:  { fromCurrency: "EUR", toCurrency: "RON",  defaultAmount: 1000 },
  MD:  { fromCurrency: "EUR", toCurrency: "MDL",  defaultAmount: 500  },
  RS:  { fromCurrency: "EUR", toCurrency: "RSD",  defaultAmount: 500  },
  BA:  { fromCurrency: "EUR", toCurrency: "BAM",  defaultAmount: 500  },
  AL:  { fromCurrency: "EUR", toCurrency: "ALL",  defaultAmount: 500  },
  MK:  { fromCurrency: "EUR", toCurrency: "MKD",  defaultAmount: 500  },
  BG:  { fromCurrency: "EUR", toCurrency: "BGN",  defaultAmount: 500  },

  // ── Caucasus & Central Asia ──────────────────────────────────────────────
  GE:  { fromCurrency: "USD", toCurrency: "GEL",  defaultAmount: 500  },
  AM:  { fromCurrency: "USD", toCurrency: "AMD",  defaultAmount: 500  },
  AZ:  { fromCurrency: "USD", toCurrency: "AZN",  defaultAmount: 500  },
  UZ:  { fromCurrency: "USD", toCurrency: "UZS",  defaultAmount: 500  },
  KG:  { fromCurrency: "USD", toCurrency: "KGS",  defaultAmount: 300  },
  TJ:  { fromCurrency: "USD", toCurrency: "TJS",  defaultAmount: 300  },
  KZ:  { fromCurrency: "USD", toCurrency: "KZT",  defaultAmount: 500  },
  MN:  { fromCurrency: "USD", toCurrency: "MNT",  defaultAmount: 300  },

  // ── Pacific ──────────────────────────────────────────────────────────────
  // Fiji: Australia is top sender
  FJ:  { fromCurrency: "AUD", toCurrency: "FJD",  defaultAmount: 1000 },
};

// ---------------------------------------------------------------------------
// Unified geo defaults helper
// ---------------------------------------------------------------------------

export interface GeoDefaults {
  fromCurrency: string;
  toCurrency: string;
  defaultAmount: number;
}

/**
 * Returns the best { fromCurrency, toCurrency, defaultAmount } for a given
 * ISO 3166-1 alpha-2 country code.
 *
 * Priority:
 *   1. Receiver-country override (diaspora-aware inbound corridor)
 *   2. Sender-country: local currency + GEO_CORRIDORS default destination
 *   3. Global fallback: USD → INR
 */
export function getGeoDefaults(country: string): GeoDefaults {
  // Receiver-country override
  const receiverConfig = RECEIVER_COUNTRY_CORRIDORS[country];
  if (receiverConfig) {
    return {
      fromCurrency: receiverConfig.fromCurrency,
      toCurrency: receiverConfig.toCurrency,
      defaultAmount: receiverConfig.defaultAmount,
    };
  }

  // Sender country: local currency + corridor defaultTo
  const localCurrency = COUNTRY_TO_CURRENCY[country];
  if (localCurrency) {
    const corridorConfig = GEO_CORRIDORS[localCurrency];
    if (corridorConfig) {
      return {
        fromCurrency: localCurrency,
        toCurrency: corridorConfig.defaultTo,
        defaultAmount: corridorConfig.defaultAmount,
      };
    }
    // Local currency known but no corridor data — use USD→INR fallback to
    return { fromCurrency: localCurrency, toCurrency: "INR", defaultAmount: 1000 };
  }

  // Global fallback
  return { fromCurrency: "USD", toCurrency: "INR", defaultAmount: 1000 };
}
