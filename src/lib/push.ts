/**
 * Expo push delivery.
 *
 * Talks to Expo's send endpoint with plain fetch rather than pulling in
 * expo-server-sdk. The SDK's value is chunking and receipt polling; chunking is
 * four lines, and the send response already reports DeviceNotRegistered
 * per-message, which is the only receipt outcome we act on. Matching the
 * codebase's existing style (ga4-server.ts, server-track.ts) keeps one less
 * dependency in a path that must never break.
 *
 * Receipt polling — the second-stage /getReceipts call that catches failures
 * Expo only learns about after accepting the message — is deliberately not here.
 * It needs a follow-up job a few minutes later; the send-time errors caught
 * below cover the case that matters (a token that has gone dead).
 */

const ENDPOINT = "https://exp.host/--/api/v2/push/send";

/** Expo accepts at most 100 messages per request. */
const CHUNK = 100;

export type PushMessage = {
  to: string;
  title: string;
  body: string;
  /** Delivered to the app on tap. Keep it small — Expo caps the payload. */
  data?: Record<string, string>;
};

export type PushOutcome = {
  to: string;
  ok: boolean;
  /** Expo's ticket id, when accepted. */
  ticketId?: string;
  error?: string;
  /**
   * True when Expo says this token no longer belongs to an install. The caller
   * must stop using it — retrying dead tokens is what gets a sender
   * rate-limited.
   */
  deviceNotRegistered?: boolean;
};

type ExpoTicket = {
  status?: string;
  id?: string;
  message?: string;
  details?: { error?: string };
};

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/**
 * Send push messages, returning one outcome per message in the same order.
 *
 * Never throws. A transport failure marks that whole chunk as failed rather
 * than losing the caller's place — the alert rows are already written by the
 * time this runs, so a failure is recoverable and visible.
 */
export async function sendPush(messages: PushMessage[]): Promise<PushOutcome[]> {
  if (messages.length === 0) return [];

  const token = process.env.EXPO_ACCESS_TOKEN;
  const headers: Record<string, string> = {
    "content-type": "application/json",
    accept: "application/json",
    // Expo asks for this so it can gzip the response.
    "accept-encoding": "gzip, deflate",
  };
  // Optional: only needed once push security is enabled on the Expo project.
  if (token) headers.authorization = `Bearer ${token}`;

  const results: PushOutcome[] = [];

  for (const group of chunk(messages, CHUNK)) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify(group),
      });

      const payload = (await res.json().catch(() => null)) as { data?: ExpoTicket[] } | null;
      const tickets = payload?.data;

      if (!res.ok || !Array.isArray(tickets) || tickets.length !== group.length) {
        // Expo rejected the batch, or answered with a shape we can't line up
        // against the messages we sent. Fail the whole chunk rather than
        // guessing which message each ticket belongs to.
        for (const m of group) {
          results.push({ to: m.to, ok: false, error: `expo batch failed (HTTP ${res.status})` });
        }
        continue;
      }

      tickets.forEach((ticket, i) => {
        if (ticket.status === "ok") {
          results.push({ to: group[i].to, ok: true, ticketId: ticket.id });
        } else {
          results.push({
            to: group[i].to,
            ok: false,
            error: ticket.message ?? ticket.details?.error ?? "unknown expo error",
            deviceNotRegistered: ticket.details?.error === "DeviceNotRegistered",
          });
        }
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "network error";
      for (const m of group) results.push({ to: m.to, ok: false, error: message });
    }
  }

  return results;
}
