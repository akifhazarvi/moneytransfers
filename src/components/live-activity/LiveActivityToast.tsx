"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiggyBank, X } from "lucide-react";
import { getFlagUrl } from "@/components/CircleFlag";
import type { ActivityItem, LiveActivity } from "@/lib/live-activity";
import { trackLiveActivityClicked, trackLiveActivityDismissed, trackLiveActivityShown } from "@/lib/analytics";
import styles from "./LiveActivity.module.css";

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

type Entry =
  | { type: "reader"; item: ActivityItem }
  | { type: "rate"; rate: RateUpdate }
  | { type: "savings"; vsBankPer1000: number };

const FEED_URL = "/api/live-activity";
const METHOD_HREF = "/guides/how-much-can-you-save-comparing-money-transfers";
/** The edge caches the feed for 15 seconds. */
const POLL_MS = 30_000;
/** Each card stays this long (longer while hovered or focused)… */
const SHOW_MS = 6_000;
/** …then the next arrives after 10–15 seconds, so content is never covered for long. */
const GAP_MIN_MS = 10_000;
const GAP_MAX_MS = 15_000;
const FIRST_DELAY_MS = 4_000;
const RECENT_MS = 30 * 60_000;
/** Above this width the card sits bottom-left (see the CSS module). */
const WIDE = "(min-width: 640px)";
const CARD_WIDTH = 380;
const EDGE = 16;
const DISMISS_KEY = "smc_live_activity_off";
/** Pages where a card would get in the way of the one thing the page is for. */
const QUIET_PATHS = /^\/(go|out|privacy|terms|cookies)(\/|$)/;
/** Country names that read "in the …". */
const DEFINITE = new Set(["US", "GB", "AE", "NL", "PH", "DO", "BS", "GM", "CF", "CD", "KM", "MV", "MH", "SB", "VA", "CZ"]);

const noSubscribe = () => () => {};
const readDismissed = () => {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
};

let regionNames: Intl.DisplayNames | null | undefined;
function countryName(code: string): string {
  if (regionNames === undefined) {
    try {
      regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    } catch {
      regionNames = null;
    }
  }
  return regionNames?.of(code) ?? code;
}

function money(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: amount % 1 ? 2 : 0 }).format(amount);
  } catch {
    return `${amount.toLocaleString("en")} ${currency}`;
  }
}

function ago(at: number, now: number, hourly?: boolean): string {
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

/** Readers' events lead; a rate update or the 30-day line follows every second one. */
function weave(items: ActivityItem[], rates: RateUpdate[], vsBankPer1000: number | null): Entry[] {
  const readers: Entry[] = items.map((item) => ({ type: "reader", item }));
  const extras: Entry[] = rates.map((rate) => ({ type: "rate", rate }));
  if (vsBankPer1000 != null) extras.splice(1, 0, { type: "savings", vsBankPer1000 });
  const out: Entry[] = [];
  let r = 0;
  let e = 0;
  while (r < readers.length || e < extras.length) {
    if (r < readers.length) out.push(readers[r++]);
    if (r < readers.length) out.push(readers[r++]);
    if (e < extras.length) out.push(extras[e++]);
  }
  return out;
}

function hrefOf(entry: Entry): string {
  if (entry.type === "savings") return METHOD_HREF;
  const p = entry.type === "reader" ? entry.item : entry.rate;
  if (!p.from || !p.to) return "/send-money";
  return `/send-money?from=${p.from}&to=${p.to}${p.amount ? `&amount=${p.amount}` : ""}`;
}

function placementOf(pathname: string): string {
  const path = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  if (path === "/") return "home";
  const [, section, slug] = path.split("/");
  if (section === "send-money") return slug ? "corridor" : "send-money";
  if (section === "guides") return slug ? "guide" : "guides-hub";
  return section || "other";
}

/**
 * How far up the bottom-left card must sit to clear what is docked there now:
 * the forex ticker, and when showing, the Send bar, the guide nudge or the
 * cookie banner (all `.pwa-lift`). Measured on each show, since those come and
 * go as the reader scrolls.
 */
function bottomClearance(): number {
  let clear = 0;
  for (const el of document.querySelectorAll<HTMLElement>(".pwa-lift, [data-forex-ticker]")) {
    const r = el.getBoundingClientRect();
    if (r.height === 0 || r.top >= window.innerHeight || r.right < EDGE || r.left > EDGE + CARD_WIDTH) continue;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.opacity === "0" || style.display === "none") continue;
    clear = Math.max(clear, window.innerHeight - r.top);
  }
  return Math.round(clear) + 12;
}

function Flag({ code, size, className = "" }: { code: string; size: number; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`${styles.flag} ${className}`} src={getFlagUrl(code)} alt="" width={size} height={size} decoding="async" />;
}

function Route({ from, to }: { from: string; to: string }) {
  return (
    <span className={styles.route}>
      <Flag code={from} size={14} />
      {from}
      <span aria-hidden="true">→</span>
      <Flag code={to} size={14} />
      {to}
    </span>
  );
}

function Avatar({ entry }: { entry: Entry }) {
  if (entry.type === "savings") {
    return (
      <span className={`${styles.avatar} ${styles.avatarIcon}`} aria-hidden="true">
        <PiggyBank size={20} />
      </span>
    );
  }
  const logo = entry.type === "rate" ? entry.rate.logo : entry.item.kind === "chose" ? entry.item.logo : undefined;
  const badge = entry.type === "rate" ? entry.rate.to : entry.item.country;
  if (!logo) {
    return (
      <span className={styles.avatar} aria-hidden="true">
        <Flag code={entry.type === "reader" ? entry.item.country : entry.rate.to} size={40} className={styles.avatarFlag} />
      </span>
    );
  }
  return (
    <span className={`${styles.avatar} ${styles.avatarLogo}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt="" width={28} height={28} decoding="async" />
      <Flag code={badge} size={16} className={styles.badge} />
    </span>
  );
}

function Body({ entry, now }: { entry: Entry; now: number }) {
  if (entry.type === "savings") {
    return (
      <>
        <span className={styles.text}>
          Readers&rsquo; picks paid a median <strong>{money(Math.round(entry.vsBankPer1000), "USD")}</strong>{" "}more per $1,000 than banks
        </span>
        <span className={styles.meta}>Priced against each day&rsquo;s quotes · last 30 days</span>
      </>
    );
  }
  if (entry.type === "rate") {
    const { rate } = entry;
    return (
      <>
        <span className={styles.text}>
          <strong>{rate.provider}</strong>{" "}pays <strong>{money(rate.receive, rate.to)}</strong>{" "}for {money(rate.amount, rate.from)}
        </span>
        <span className={styles.meta}>
          <Route from={rate.from} to={rate.to} /> · top of {rate.providers}{" "}quotes · updated {ago(rate.at, now)}
        </span>
      </>
    );
  }
  const { item } = entry;
  const where = (
    <>
      {DEFINITE.has(item.country) ? "the " : ""}
      <strong>{countryName(item.country)}</strong>
    </>
  );
  const amount = item.amount && item.from ? <strong>{money(item.amount, item.from)}</strong> : null;
  return (
    <>
      <span className={styles.text}>
        Someone in {where}{" "}
        {item.kind === "chose" ? (
          <>
            chose <strong>{item.provider ?? "a provider"}</strong>
            {amount ? <>{" "}for {amount}</> : null}
          </>
        ) : item.from ? (
          <>compared {amount ?? "rates"}</>
        ) : !item.hourly && now - item.at < RECENT_MS ? (
          "is comparing rates"
        ) : (
          "compared rates"
        )}
      </span>
      <span className={styles.meta}>
        {item.from && item.to ? <><Route from={item.from} to={item.to} /> · </> : null}
        {ago(item.at, now, item.hourly)}
      </span>
    </>
  );
}

export default function LiveActivityToast({ rates, vsBankPer1000 }: { rates: RateUpdate[]; vsBankPer1000: number | null }) {
  const pathname = usePathname() || "/";
  const path = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  const quiet = QUIET_PATHS.test(path);
  const placement = placementOf(pathname);
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);
  const storedOff = useSyncExternalStore(noSubscribe, readDismissed, () => true);
  const [closed, setClosed] = useState(false);
  const [feed, setFeed] = useState<LiveActivity | null>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(-1);
  const [now, setNow] = useState(0);
  const [lift, setLift] = useState<number | null>(null);
  const held = useRef(false);
  const announced = useRef(false);

  const off = quiet || storedOff || closed;
  const entries = useMemo(() => weave(feed?.items ?? [], rates, vsBankPer1000), [feed, rates, vsBankPer1000]);
  const hasEntries = entries.length > 0;

  // The feed: on arrival, then every POLL_MS while the tab is visible.
  useEffect(() => {
    if (off) return;
    let cancelled = false;
    const load = () => {
      if (document.visibilityState === "hidden") return;
      fetch(FEED_URL)
        .then((r) => (r.ok ? (r.json() as Promise<LiveActivity>) : null))
        .then((json) => {
          if (!cancelled && json) setFeed(json);
        })
        .catch(() => {});
    };
    const first = setTimeout(load, 0);
    const poll = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearTimeout(first);
      clearInterval(poll);
    };
  }, [off]);

  // One card at a time: show for SHOW_MS, then a 10–15 second gap. Never over
  // a field being typed in, a dialog, or the welcome-back card.
  useEffect(() => {
    if (off || !hasEntries) return;
    let timer: ReturnType<typeof setTimeout>;
    const blocked = () => {
      const el = document.activeElement;
      const typing = el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
      return (
        document.visibilityState !== "visible" ||
        typing ||
        Boolean(document.querySelector("[data-welcome-back], dialog[open], [aria-modal='true']"))
      );
    };
    const show = () => {
      if (blocked()) {
        timer = setTimeout(show, 3_000);
        return;
      }
      setNow(Date.now());
      setLift(window.matchMedia?.(WIDE).matches ? bottomClearance() : null);
      setIndex((i) => i + 1);
      setOpen(true);
      if (!announced.current) {
        announced.current = true;
        trackLiveActivityShown(placement);
      }
      timer = setTimeout(hide, SHOW_MS);
    };
    const hide = () => {
      if (held.current) {
        timer = setTimeout(hide, 1_500);
        return;
      }
      setOpen(false);
      timer = setTimeout(show, GAP_MIN_MS + Math.random() * (GAP_MAX_MS - GAP_MIN_MS));
    };
    timer = setTimeout(show, FIRST_DELAY_MS);
    return () => clearTimeout(timer);
  }, [off, hasEntries, placement]);

  if (!mounted || off || index < 0 || !hasEntries) return null;
  const entry = entries[index % entries.length];
  const live = feed?.source === "live";
  const counter = !live
    ? "Recent activity"
    : feed.here != null && feed.here >= 2
      ? `Live · ${feed.here} people here now`
      : feed.people != null && feed.people >= 2
        ? `Live · ${feed.people} people in the last 6 hours`
        : "Live";

  return (
    <aside
      aria-label="Live activity on SendMoneyCompare"
      data-nosnippet=""
      data-open={open ? "" : undefined}
      aria-hidden={open ? undefined : true}
      className={styles.toast}
      style={lift != null ? ({ "--la-bottom": `${lift}px` } as CSSProperties) : undefined}
      onMouseEnter={() => {
        held.current = true;
      }}
      onMouseLeave={() => {
        held.current = false;
      }}
      onFocus={() => {
        held.current = true;
      }}
      onBlur={() => {
        held.current = false;
      }}
    >
      <Link
        key={index}
        href={hrefOf(entry)}
        tabIndex={open ? undefined : -1}
        className={styles.card}
        onClick={() => trackLiveActivityClicked(placement, entry.type === "reader" ? entry.item.kind : entry.type)}
      >
        <Avatar entry={entry} />
        <span className={styles.body}>
          <span className={`${styles.counter} ${live ? "" : styles.counterQuiet}`}>
            <span className={styles.dot} aria-hidden="true" />
            {counter}
          </span>
          <Body entry={entry} now={now} />
        </span>
      </Link>
      <button
        type="button"
        className={styles.close}
        tabIndex={open ? undefined : -1}
        aria-label="Hide live activity for this visit"
        onClick={() => {
          try {
            sessionStorage.setItem(DISMISS_KEY, "1");
          } catch {
            // private mode: closes for this page only
          }
          setClosed(true);
          trackLiveActivityDismissed(placement);
        }}
      >
        <X size={14} aria-hidden="true" />
      </button>
    </aside>
  );
}
