/**
 * Renders a circular flag image using hatscripts/circle-flags CDN.
 * Accepts either a 2-letter country code (e.g. "us") or a 3-letter currency code (e.g. "USD").
 */

const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: "us", GBP: "gb", EUR: "eu", CAD: "ca", AUD: "au", INR: "in",
  PHP: "ph", MXN: "mx", NGN: "ng", PKR: "pk", BDT: "bd", JPY: "jp",
  CNY: "cn", BRL: "br", KES: "ke", GHS: "gh", ZAR: "za", AED: "ae",
  SGD: "sg", NZD: "nz", COP: "co", VND: "vn", TRY: "tr", IDR: "id",
  MAD: "ma", MYR: "my", FJD: "fj", GTQ: "gt",
};

// Flags self-hosted in /public/flags/ for cache-control and to avoid
// hatscripts.github.io's 10-minute CDN TTL on the critical-path homepage flags.
const LOCAL_FLAGS = new Set([
  "us", "gb", "eu", "ca", "au", "in", "ph", "mx", "ng", "pk",
  "bd", "jp", "cn", "br", "ke", "gh", "za", "ae", "sg", "nz",
  "co", "vn", "tr", "id", "ma", "my", "fj", "gt",
]);

const CURRENCY_NAMES: Record<string, string> = {
  USD: "United States", GBP: "United Kingdom", EUR: "European Union", CAD: "Canada",
  AUD: "Australia", INR: "India", PHP: "Philippines", MXN: "Mexico",
  NGN: "Nigeria", PKR: "Pakistan", BDT: "Bangladesh", JPY: "Japan",
  CNY: "China", BRL: "Brazil", KES: "Kenya", GHS: "Ghana",
  ZAR: "South Africa", AED: "UAE", SGD: "Singapore", NZD: "New Zealand",
  COP: "Colombia", VND: "Vietnam", TRY: "Turkey", IDR: "Indonesia",
  MAD: "Morocco", MYR: "Malaysia", FJD: "Fiji", GTQ: "Guatemala",
};

export function getFlagUrl(code: string): string {
  const country = code.length === 3
    ? (CURRENCY_TO_COUNTRY[code.toUpperCase()] ?? code.slice(0, 2).toLowerCase())
    : code.toLowerCase();
  return LOCAL_FLAGS.has(country)
    ? `/flags/${country}.svg`
    : `https://hatscripts.github.io/circle-flags/flags/${country}.svg`;
}

export default function CircleFlag({
  code,
  size = 20,
  className = "",
  priority = false,
}: {
  /** 2-letter country code or 3-letter currency code */
  code: string;
  /** Size in pixels (default 20) */
  size?: number;
  className?: string;
  /** Set true for above-fold flags to prevent lazy-loading and improve LCP */
  priority?: boolean;
}) {
  const countryName = CURRENCY_NAMES[code.toUpperCase()] || code;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getFlagUrl(code)}
      alt={`Flag of ${countryName}`}
      width={size}
      height={size}
      className={`inline-block rounded-full shrink-0 ${className}`}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
    />
  );
}
