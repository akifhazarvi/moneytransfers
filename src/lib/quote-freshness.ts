/** Collection dates belong to observations, never to builds or unrelated routes. */
export function collectionInstant(value: unknown): string | undefined {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}(T|$)/.test(value)) return undefined;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : undefined;
}

/** An estimate is only as fresh as its oldest input. Missing dates stay unknown. */
export function oldestCollection(...values: (string | undefined)[]): string | undefined {
  const dates = values.map(collectionInstant);
  if (!dates.length || dates.some((date) => !date)) return undefined;
  return (dates as string[]).sort()[0];
}

export function quoteFreshness(quotes: readonly { dateCollected?: string; isIndicative?: boolean }[]) {
  const measured = quotes.filter((quote) => !quote.isIndicative);
  const dates = measured.map((quote) => collectionInstant(quote.dateCollected)).filter((date): date is string => !!date).sort();
  return {
    oldest: dates[0],
    latest: dates.at(-1),
    undated: measured.length - dates.length,
  };
}
