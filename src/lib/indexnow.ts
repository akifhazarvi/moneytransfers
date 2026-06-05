/**
 * IndexNow client — pings Bing (and other IndexNow-compatible engines) when
 * pages are published or updated, so they get indexed within minutes instead
 * of waiting for the next sitemap crawl.
 *
 * Bing Webmaster's recommendation: submit URLs ONE AT A TIME (not batched)
 * to avoid being flagged for excessive submission load. We honour that here
 * with a sequential submitter that adds a small delay between hits.
 *
 * Spec: https://www.indexnow.org/documentation
 * Bing endpoint accepts the protocol on behalf of all IndexNow members
 * (Bing, Yandex, Seznam, Naver), so one ping reaches all of them.
 */

const HOST = "sendmoneycompare.com";
const KEY = process.env.INDEXNOW_KEY || "";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

export interface IndexNowResult {
  url: string;
  status: number;
  ok: boolean;
  error?: string;
}

/**
 * Submit a single URL to IndexNow. Returns whether the submission was accepted.
 * Bing prefers this single-URL form over batch submissions.
 *
 * Status codes per spec:
 *   200 — Accepted
 *   202 — Accepted (will process later)
 *   400 — Bad request (malformed URL)
 *   403 — Key invalid for this host
 *   422 — URL doesn't belong to the host
 *   429 — Throttled (too many requests)
 */
export async function submitUrl(url: string): Promise<IndexNowResult> {
  if (!url.startsWith("https://") || !url.includes(HOST)) {
    return { url, status: 0, ok: false, error: "URL must be HTTPS and on the configured host" };
  }
  const requestUrl = new URL(ENDPOINT);
  requestUrl.searchParams.set("url", url);
  requestUrl.searchParams.set("key", KEY);
  requestUrl.searchParams.set("keyLocation", KEY_LOCATION);

  try {
    const res = await fetch(requestUrl.toString(), {
      method: "GET",
      headers: { "User-Agent": `SendMoneyCompare-IndexNow/1.0 (+https://${HOST})` },
    });
    return { url, status: res.status, ok: res.ok };
  } catch (err) {
    return { url, status: 0, ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Submit many URLs sequentially with a small delay between requests so we
 * stay below Bing's per-host rate limit and follow their "no batch mode"
 * recommendation. Returns aggregate stats.
 */
export async function submitUrls(
  urls: string[],
  options: { delayMs?: number } = {}
): Promise<{ submitted: number; succeeded: number; failed: number; results: IndexNowResult[] }> {
  const delayMs = options.delayMs ?? 250;
  const results: IndexNowResult[] = [];
  let succeeded = 0;
  let failed = 0;

  for (const url of urls) {
    const r = await submitUrl(url);
    results.push(r);
    if (r.ok) succeeded++;
    else failed++;
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
  }

  return { submitted: urls.length, succeeded, failed, results };
}
