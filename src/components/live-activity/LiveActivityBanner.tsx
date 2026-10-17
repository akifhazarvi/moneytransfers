"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "@/components/EligibleLink";
import { Send, X } from "lucide-react";
import type { LiveActivity } from "@/lib/live-activity";
import { trackLiveActivityClicked, trackLiveActivityShown } from "@/lib/analytics";
import { Flag, RECENT_MS, activityBlocked, countryName, hrefOf, kindOf, money, type Entry } from "./shared";
import styles from "./LiveActivityBanner.module.css";

/**
 * Phones: live activity as one slim banner at the bottom (34px, one line).
 * Every 5–7 seconds the next real item arrives: a paper plane flies along the
 * route between two flags (or from the reader's country to the provider they
 * chose), then the line slides in like a departure board. It sits at the
 * lowest spot nothing docked is using (Send bar, ticker, WhatsApp and back-to-
 * top pills, cookie banner), so it never covers them.
 *
 * Always on, never replayed: each item shows once per visit (sessionStorage);
 * when every real item has been shown, the last one stays until the feed
 * brings a new one. A full feed (~50 items) lasts 4–5 minutes.
 */

const FIRST_MS = 2_500;
const STEP_MIN_MS = 5_000;
const STEP_MAX_MS = 7_000;
const GAP = 8;
const SEEN_KEY = "smc_live_seen";
const SEEN_CAP = 300;

type Shown = { id: number; entry: Entry };

function keyOf(entry: Entry): string {
  if (entry.type === "savings") return "savings";
  if (entry.type === "rate") return `rate:${entry.rate.from}${entry.rate.to}:${entry.rate.at}`;
  const i = entry.item;
  return `reader:${i.at}:${i.country}:${i.kind}:${i.from ?? ""}${i.to ?? ""}:${i.providerSlug ?? ""}`;
}

function readSeen(): Set<string> {
  try {
    const keys: unknown = JSON.parse(sessionStorage.getItem(SEEN_KEY) || "[]");
    return new Set(Array.isArray(keys) ? keys.filter((k): k is string => typeof k === "string") : []);
  } catch {
    return new Set();
  }
}

function writeSeen(keys: Set<string>) {
  try {
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...keys].slice(-SEEN_CAP)));
  } catch {
    // private mode: items may repeat on the next page, never within one
  }
}

/** Names a one-line banner cannot fit, as people say them. */
const SHORT_NAMES: Record<string, string> = { US: "US", GB: "UK", AE: "UAE" };
const placeName = (code: string) => SHORT_NAMES[code] ?? countryName(code);

/** "now", "12m", "3h", "2d": when it happened, in the space a banner has. */
function since(at: number, now: number, hourly?: boolean): string {
  // An hourly item happened somewhere inside the hour that began at `at`.
  const mins = Math.max(0, Math.round((now - at - (hourly ? 30 * 60_000 : 0)) / 60_000));
  if (mins < 2) return hourly ? "1h" : "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  return hours < 24 ? `${hours}h` : `${Math.round(hours / 24)}d`;
}

/**
 * The lowest offset from the viewport's bottom where a full-width band
 * `height` tall touches nothing docked, never below `floor`.
 */
function freeBottom(height: number, floor: number): number {
  const vh = window.innerHeight;
  const docked: { low: number; high: number }[] = [];
  for (const el of document.querySelectorAll<HTMLElement>(".pwa-lift, [data-forex-ticker]")) {
    const r = el.getBoundingClientRect();
    if (r.height === 0 || r.top >= vh || r.bottom <= 0) continue;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.opacity === "0" || style.display === "none") continue;
    docked.push({ low: Math.max(0, vh - r.bottom), high: vh - r.top });
  }
  const spots = [floor, ...docked.map((d) => d.high + GAP)].filter((b) => b >= floor).sort((a, b) => a - b);
  return spots.find((b) => docked.every((d) => b + height + GAP <= d.low || b >= d.high + GAP)) ?? spots[spots.length - 1];
}

/** The iPhone home-indicator inset, which CSS knows and JS does not. */
function safeAreaBottom(): number {
  const probe = document.createElement("div");
  probe.style.cssText = "position:fixed;left:0;bottom:0;width:0;height:env(safe-area-inset-bottom,0px);visibility:hidden;pointer-events:none";
  document.body.appendChild(probe);
  const inset = probe.getBoundingClientRect().height;
  probe.remove();
  return inset;
}

/** Where the plane leaves from and lands. */
function Route({ entry }: { entry: Entry }) {
  let from: string | null = null;
  let to: string | null = null;
  let logo: string | undefined;
  if (entry.type === "rate") {
    from = entry.rate.from;
    to = entry.rate.to;
  } else if (entry.type === "reader") {
    const { item } = entry;
    if (item.kind === "chose") {
      from = item.country;
      logo = item.logo;
      to = logo ? null : (item.to ?? null);
    } else {
      from = item.from ?? item.country;
      to = item.to ?? null;
    }
  }
  if (!from) return null;
  return (
    <span className={styles.route} aria-hidden="true">
      <Flag code={from} size={16} className={styles.flag} />
      {to || logo ? (
        <>
          <span className={styles.track}>
            <Send size={10} className={styles.plane} strokeWidth={2.5} />
          </span>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className={`${styles.land} ${styles.logo}`} src={logo} alt="" width={16} height={16} decoding="async" />
          ) : (
            <Flag code={to!} size={16} className={`${styles.flag} ${styles.land}`} />
          )}
        </>
      ) : null}
    </span>
  );
}

function Words({ entry, now }: { entry: Entry; now: number }) {
  if (entry.type === "rate") {
    const { rate } = entry;
    return (
      <>
        <strong>{rate.provider}</strong>{" "}pays <strong>{money(rate.receive, rate.to)}</strong>{" "}for {money(rate.amount, rate.from)}
        <span className={styles.when}>{" "}· {since(rate.at, now)}</span>
      </>
    );
  }
  if (entry.type !== "reader") return null;
  const { item } = entry;
  const amount = item.amount && item.from ? money(item.amount, item.from) : null;
  return (
    <>
      <strong>{placeName(item.country)}</strong>{" "}
      {item.kind === "chose" ? (
        <>
          chose <strong>{item.provider ?? "a provider"}</strong>
        </>
      ) : item.from ? (
        <>
          compared <strong>{amount ?? "rates"}</strong>
        </>
      ) : !item.hourly && now - item.at < RECENT_MS ? (
        "is comparing rates"
      ) : (
        "compared rates"
      )}
      <span className={styles.when}>{" "}· {since(item.at, now, item.hourly)}</span>
    </>
  );
}

export default function LiveActivityBanner({
  entries,
  feed,
  placement,
  onDismiss,
}: {
  entries: Entry[];
  feed: LiveActivity | null;
  placement: string;
  onDismiss: () => void;
}) {
  const [shown, setShown] = useState<Shown | null>(null);
  const [hidden, setHidden] = useState(false);
  const [now, setNow] = useState(0);
  const [bottom, setBottom] = useState<number | null>(null);
  const latest = useRef(entries);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    // The 30-day line needs two lines to say honestly; the wide card carries it.
    latest.current = entries.filter((e) => e.type !== "savings");
  }, [entries]);

  // The next item every 5–7 seconds, while there is one the reader has not seen.
  useEffect(() => {
    const seen = readSeen();
    let id = 0;
    let announced = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (activityBlocked()) {
        setHidden(true);
        timer = setTimeout(tick, 2_000);
        return;
      }
      setHidden(false);
      setNow(Date.now());
      const list = latest.current;
      const fresh = list.find((e) => !seen.has(keyOf(e)));
      if (fresh) {
        seen.add(keyOf(fresh));
        writeSeen(seen);
        setShown({ id: ++id, entry: fresh });
      } else {
        // Everything real has been shown this visit: the last one stays until
        // the feed (polled every 30 s) brings something new.
        setShown((current) => current ?? (list.length ? { id: ++id, entry: list[0] } : null));
      }
      if (!announced && list.length) {
        announced = true;
        trackLiveActivityShown(placement);
      }
      timer = setTimeout(tick, STEP_MIN_MS + Math.random() * (STEP_MAX_MS - STEP_MIN_MS));
    };
    timer = setTimeout(tick, FIRST_MS);
    return () => clearTimeout(timer);
  }, [placement]);

  // The lowest free spot; docked bars come and go as the reader scrolls, and
  // the cookie banner and the WhatsApp pill arrive on their own.
  useEffect(() => {
    const floor = safeAreaBottom() + GAP;
    let frame = 0;
    const measure = () => {
      frame = 0;
      setBottom(freeBottom(bar.current?.offsetHeight || 34, floor));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    schedule();
    const every = setInterval(schedule, 1_000);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(every);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  if (!shown) return null;
  const live = feed?.source === "live";
  const here = live && feed.here != null && feed.here >= 2 ? feed.here : null;

  return (
    <aside
      ref={bar}
      aria-label="Live activity on SendMoneyCompare"
      data-nosnippet=""
      data-hidden={hidden || bottom == null ? "" : undefined}
      className={styles.banner}
      style={bottom != null ? ({ "--la-bottom": `${bottom}px` } as CSSProperties) : undefined}
    >
      <Link
        href={hrefOf(shown.entry)}
        className={styles.bar}
        onClick={() => trackLiveActivityClicked(placement, kindOf(shown.entry))}
      >
        <span className={`${styles.tag} ${live ? "" : styles.tagQuiet}`}>
          <span className={styles.dot} aria-hidden="true" />
          {live ? "Live" : "Recent"}
          {here ? <span className={styles.here}>{here}{" "}here</span> : null}
        </span>
        <span key={shown.id} className={styles.item}>
          <Route entry={shown.entry} />
          <span className={styles.text}>
            <Words entry={shown.entry} now={now} />
          </span>
        </span>
      </Link>
      <button type="button" className={styles.close} aria-label="Hide live activity for this visit" onClick={onDismiss}>
        <X size={13} aria-hidden="true" />
      </button>
    </aside>
  );
}
