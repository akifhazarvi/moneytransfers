/** Promotional surfaces only; never replace a selected provider or quote action. */
export function tapTapReadingPlacement(pathname: string): { source: string; hasTicker: boolean } | null {
  const path = pathname.replace(/^\/en(?=\/|$)/, "").replace(/\/$/, "") || "/";
  const [, section, slug] = path.split("/");
  if (!["guides", "companies", "banks", "travel", "tools", "research", "news", "exchange-rates", "currency-converter"].includes(section)) return null;
  if (section === "companies" && ["torfx", "currencies-direct", "ofx", "moneycorp", "regencyfx"].includes(slug)) return null;
  return { source: `taptap_reading:${path.slice(1)}`, hasTicker: section === "exchange-rates" || section === "currency-converter" };
}
