const SYMBOLS: Record<string, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  CAD: "C$",
  AUD: "A$",
  INR: "₹",
  PHP: "₱",
  MXN: "$",
  NGN: "₦",
};

export function fmtAmount(currency: string, amount: number): string {
  const symbol = SYMBOLS[currency] ?? "";
  const rounded = Math.round(amount);
  const withCommas = rounded.toLocaleString("en-US");
  return symbol ? `${symbol}${withCommas}` : `${withCommas} ${currency}`;
}

export function fmtSend(currency: string, amount: number): string {
  return fmtAmount(currency, amount);
}
