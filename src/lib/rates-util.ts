/** Pure function — safe for both client and server */
export function getRate(
  rates: Record<string, number>,
  from: string,
  to: string
): number {
  const fromRate = rates[from] || 1;
  const toRate = rates[to] || 1;
  return toRate / fromRate;
}
