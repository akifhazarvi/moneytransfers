/**
 * Parse a YYYY-MM-DD string as a local date (not UTC) and format it.
 * Prevents the off-by-one bug where `new Date("2026-03-14")` is parsed as
 * midnight UTC, which displays as March 13 in US timezones.
 */
export function formatLocalDate(
  dateStr: string,
  options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" }
): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", options);
}
