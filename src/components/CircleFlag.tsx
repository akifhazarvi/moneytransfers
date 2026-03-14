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

export function getFlagUrl(code: string): string {
  // If it's a 3-letter currency code, map it; otherwise treat as 2-letter country code
  const country = code.length === 3
    ? (CURRENCY_TO_COUNTRY[code.toUpperCase()] ?? code.slice(0, 2).toLowerCase())
    : code.toLowerCase();
  return `https://hatscripts.github.io/circle-flags/flags/${country}.svg`;
}

export default function CircleFlag({
  code,
  size = 20,
  className = "",
}: {
  /** 2-letter country code or 3-letter currency code */
  code: string;
  /** Size in pixels (default 20) */
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getFlagUrl(code)}
      alt={`${code} flag`}
      width={size}
      height={size}
      className={`inline-block rounded-full shrink-0 ${className}`}
      loading="lazy"
    />
  );
}
