// Type for rate-insights.json (28 MB). Without it TypeScript infers a type from
// the whole file: 1.4M types and 3.8 GB to check the project, which crashed the
// editor's TypeScript server. rate-history.ts casts it to RateInsight records.
declare const data: Record<string, unknown>;
export default data;
