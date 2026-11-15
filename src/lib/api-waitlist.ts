import { API_PLANS, WAITLIST_PLAN_IDS, WAITLIST_USE_CASE_IDS, type ApiPlanId } from "@/data/api-plans";

/**
 * The Data API waitlist (/developers → POST /api/waitlist).
 *
 * Every lead is kept, in two places, so one failing never loses it:
 *   1. Upstash Redis — the store the live activity strip already uses (REST
 *      only; see activity-store.ts for the plan and its command budget):
 *        wl:api          hash, email → JSON {plan, useCase, company, note, country, at}
 *                        (a repeat signup replaces the answers)
 *        wl:api:first    hash, email → when that email first joined
 *        wl:api:suspect  hash, the same shape, for signups that looked automated
 *                        (honeypot filled, crawler user agent, over the per-IP
 *                        rate) — kept for review, never emailed, never deleted
 *        wl:rl:<ip>      signups from one IP in the last hour
 *   2. Resend — an email to WAITLIST_NOTIFY_TO for every lead (not suspects),
 *      and, when RESEND_WAITLIST_AUDIENCE_ID is set, a contact in that
 *      audience so the launch email can go out as one broadcast.
 * If both fail the route logs the lead to the runtime log, the last copy.
 * Export: `node --env-file=.env.local scripts/export-waitlist.mjs`.
 */

const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
const RESEND_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM = process.env.RESEND_FROM || "";
const NOTIFY_TO = process.env.WAITLIST_NOTIFY_TO || "info@sendmoneycompare.com";
const RESEND_AUDIENCE = process.env.RESEND_WAITLIST_AUDIENCE_ID || "";

export const storeEnabled = Boolean(URL_ && TOKEN);
export const notifyEnabled = Boolean(RESEND_KEY && RESEND_FROM);

const LIST_KEY = "wl:api";
const FIRST_KEY = "wl:api:first";
const SUSPECT_KEY = "wl:api:suspect";
/** Generous, so an office or a carrier NAT never turns people away; past it a signup is kept as suspect. */
const SIGNUPS_PER_IP_HOUR = 30;

export interface WaitlistEntry {
  email: string;
  plan: ApiPlanId;
  useCase: string;
  company: string;
  note: string;
  /** Why the signup was filed as suspect; empty for a normal lead. */
  suspect: string;
}

export type ParseResult = { ok: true; entry: WaitlistEntry } | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const text = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

/**
 * Validate a signup. Only the email is required: a missing or unknown plan
 * becomes "developer", an unknown use case is left blank, so no answer the
 * form might send can cost us the lead. A filled honeypot marks it suspect.
 */
export function parseSignup(body: Record<string, unknown>): ParseResult {
  const email = text(body.email, 254).toLowerCase();
  if (!EMAIL.test(email)) return { ok: false, error: "Enter a valid email address." };
  const planIn = text(body.plan, 20) as ApiPlanId;
  const useCaseIn = text(body.useCase, 20);
  return {
    ok: true,
    entry: {
      email,
      plan: WAITLIST_PLAN_IDS.includes(planIn) ? planIn : "developer",
      useCase: WAITLIST_USE_CASE_IDS.includes(useCaseIn) ? useCaseIn : "",
      company: text(body.company, 100),
      note: text(body.note, 500),
      suspect: text(body.website, 200) ? "honeypot" : "",
    },
  };
}

type Command = (string | number)[];

async function pipeline(commands: Command[]): Promise<unknown[]> {
  const res = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`waitlist store ${res.status}`);
  return ((await res.json()) as { result?: unknown }[]).map((r) => r.result ?? null);
}

/** Signups from this IP in the last hour, this one included; 0 when the store is down. */
export async function countSignup(ip: string): Promise<number> {
  if (!storeEnabled) return 0;
  const key = `wl:rl:${ip}`;
  try {
    const [count] = await pipeline([["INCR", key], ["EXPIRE", key, 3600]]);
    return Number(count) || 0;
  } catch {
    return 0;
  }
}

export function overRate(count: number): boolean {
  return count > SIGNUPS_PER_IP_HOUR;
}

/** Keep the lead in Redis. True when stored. */
export async function storeSignup(entry: WaitlistEntry, country: string, at: string): Promise<boolean> {
  if (!storeEnabled) return false;
  const { email, suspect, ...answers } = entry;
  const record = JSON.stringify({ ...answers, country, at, ...(suspect ? { suspect } : {}) });
  try {
    await pipeline(
      suspect
        ? [["HSET", SUSPECT_KEY, email, record]]
        : [["HSET", LIST_KEY, email, record], ["HSETNX", FIRST_KEY, email, at]],
    );
    return true;
  } catch {
    return false;
  }
}

const planName = (id: string) => API_PLANS.find((p) => p.id === id)?.name ?? id;

/** Email the lead to the team (and add it to the launch audience). True when the email was accepted. */
export async function notifySignup(entry: WaitlistEntry, country: string, at: string, stored: boolean): Promise<boolean> {
  if (!notifyEnabled || entry.suspect) return false;
  const headers = { authorization: `Bearer ${RESEND_KEY}`, "content-type": "application/json" };
  const lines = [
    `Email: ${entry.email}`,
    `Plan: ${planName(entry.plan)}`,
    `Use case: ${entry.useCase || "(not given)"}`,
    `Company: ${entry.company || "(not given)"}`,
    `Needs: ${entry.note || "(not given)"}`,
    `Country: ${country || "(unknown)"}`,
    `Joined: ${at}`,
    "",
    stored ? "Also stored in Redis (wl:api)." : "NOT stored in Redis — this email is the only copy. Add it by hand.",
  ];
  const sends: Promise<Response>[] = [
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers,
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [NOTIFY_TO],
        reply_to: entry.email,
        subject: `Data API waitlist: ${planName(entry.plan)} — ${entry.email}`,
        text: lines.join("\n"),
      }),
      cache: "no-store",
    }),
  ];
  if (RESEND_AUDIENCE) {
    sends.push(
      fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE}/contacts`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email: entry.email, unsubscribed: false }),
        cache: "no-store",
      }),
    );
  }
  const [mail] = await Promise.allSettled(sends);
  return mail.status === "fulfilled" && mail.value.ok;
}
