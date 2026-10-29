import { getFlagUrl } from "@/components/CircleFlag";
import type { ActivityItem, LiveActivity } from "@/lib/live-activity";
import styles from "./LiveActivity.module.css";

/** What the wide-screen card and the phone stream both show. */

export interface RateUpdate {
  from: string;
  to: string;
  /** The send amount the payout is for, in `from`. */
  amount: number;
  provider: string;
  logo?: string;
  /** What the top provider pays out for `amount`, rounded. */
  receive: number;
  providers: number;
  /** When that quote was collected, UTC ms. */
  at: number;
}

export type Entry =
  | { type: "reader"; item: ActivityItem }
  | { type: "rate"; rate: RateUpdate }
  | { type: "savings"; vsBankPer1000: number };

const METHOD_HREF = "/guides/how-much-can-you-save-comparing-money-transfers";
export const DISMISS_KEY = "smc_live_activity_off";
export const RECENT_MS = 30 * 60_000;
/** Country names that read "in the …". */
export const DEFINITE = new Set(["US", "GB", "AE", "NL", "PH", "DO", "BS", "GM", "CF", "CD", "KM", "MV", "MH", "SB", "VA", "CZ"]);

let regionNames: Intl.DisplayNames | null | undefined;
export function countryName(code: string): string {
  if (regionNames === undefined) {
    try {
      regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    } catch {
      regionNames = null;
    }
  }
  return regionNames?.of(code) ?? code;
}

export function money(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: amount % 1 ? 2 : 0 }).format(amount);
  } catch {
    return `${amount.toLocaleString("en")} ${currency}`;
  }
}

export function ago(at: number, now: number, hourly?: boolean): string {
  if (hourly) {
    // `at` is when the hour began; the event was somewhere inside it.
    const hours = Math.max(1, Math.round((now - at - 30 * 60_000) / 3_600_000));
    return hours < 24 ? `about ${hours} hour${hours === 1 ? "" : "s"} ago` : hours < 36 ? "yesterday" : `${Math.round(hours / 24)} days ago`;
  }
  const mins = Math.max(0, Math.round((now - at) / 60_000));
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  return hours < 24 ? `${hours} hour${hours === 1 ? "" : "s"} ago` : `${Math.round(hours / 24)} days ago`;
}

export function hrefOf(entry: Entry): string {
  if (entry.type === "savings") return METHOD_HREF;
  const p = entry.type === "reader" ? entry.item : entry.rate;
  if (!p.from || !p.to) return "/send-money";
  return `/send-money#from=${p.from}&to=${p.to}${p.amount ? `&amount=${p.amount}` : ""}`;
}

/** The `kind` live_activity_clicked carries. */
export function kindOf(entry: Entry): string {
  return entry.type === "reader" ? entry.item.kind : entry.type;
}

/** The counter line: people here now, else in the last 6 hours. */
export function counterText(feed: LiveActivity | null): string {
  if (feed?.source !== "live") return "Recent activity";
  if (feed.here != null && feed.here >= 2) return `Live · ${feed.here} people here now`;
  if (feed.people != null && feed.people >= 2) return `Live · ${feed.people} people in the last 6 hours`;
  return "Live";
}

/** Never over a field being typed in, a dialog, or the welcome-back card. */
export function activityBlocked(): boolean {
  const el = document.activeElement;
  const typing = el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  return (
    document.visibilityState !== "visible" ||
    typing ||
    Boolean(document.querySelector("[data-welcome-back], dialog[open], [aria-modal='true']"))
  );
}

/**
 * How far up a bottom-left element `width` wide must sit to clear what is
 * docked under it now: the forex ticker, and when showing, the Send bar, the
 * WhatsApp pill, the back-to-top pill or the cookie banner (all `.pwa-lift`).
 * Measured as they come and go, since they appear and hide as the reader scrolls.
 */
export function bottomClearance(width: number, edge: number): number {
  let clear = 0;
  for (const el of document.querySelectorAll<HTMLElement>(".pwa-lift, [data-forex-ticker]")) {
    const r = el.getBoundingClientRect();
    if (r.height === 0 || r.top >= window.innerHeight || r.right < edge || r.left > edge + width) continue;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.opacity === "0" || style.display === "none") continue;
    clear = Math.max(clear, window.innerHeight - r.top);
  }
  return Math.round(clear);
}

export function Flag({ code, size, className = "" }: { code: string; size: number; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`${styles.flag} ${className}`} src={getFlagUrl(code)} alt="" width={size} height={size} decoding="async" />;
}
