/** Daily operational totals only: no IP, cookie, URL, referrer or user ID stored. */
export const CONSENT_METRIC_EVENTS = ["shown", "accepted", "rejected", "updated", "qualified_redirect"] as const;
export type ConsentMetric = typeof CONSENT_METRIC_EVENTS[number];

export async function countConsentMetric(event: ConsentMetric): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return;
  const key = `consent:v2:${new Date().toISOString().slice(0, 10)}`;
  try {
    await fetch(`${url}/pipeline`, {
      method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify([["HINCRBY", key, event, 1], ["EXPIRE", key, 90 * 86400]]), cache: "no-store",
    });
  } catch { /* measurement must never block a choice or redirect */ }
}
