/**
 * Simple in-memory rate limiter for affiliate redirect routes.
 * Limits to maxRequests per windowMs per IP.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20; // per IP per window

// Cleanup old entries every 5 minutes to prevent memory growth
const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60_000);
// Don't hold a Node process open for this timer (tests and scripts exit when
// done); optional because Edge runtimes return a number, not a Timeout.
(cleanup as { unref?: () => void }).unref?.();

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || entry.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

/**
 * A separate fixed-window limiter with its own counts, for routes that need a
 * different budget from the redirect routes above (whose 20/minute is
 * unchanged). In memory, per function instance: it costs nothing to run and
 * stops a burst before the expensive work, but it cannot see other instances
 * or regions. The Vercel WAF rule on the same paths is the shared limit;
 * this is the second line behind it.
 */
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const counts = new Map<string, RateLimitEntry>();
  return function check(key: string): { allowed: boolean; retryAfterSeconds: number } {
    const now = Date.now();
    if (counts.size > 10_000) {
      for (const [k, e] of counts) if (e.resetAt < now) counts.delete(k);
    }
    const entry = counts.get(key);
    if (!entry || entry.resetAt < now) {
      counts.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterSeconds: 0 };
    }
    if (entry.count >= maxRequests) {
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
    }
    entry.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  };
}

/** The caller's IP as Vercel reports it (it overwrites both headers, so a client cannot spoof them). */
export function clientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
