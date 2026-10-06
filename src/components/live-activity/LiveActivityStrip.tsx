"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Pause, PiggyBank, Play } from "lucide-react";
import { getFlagUrl } from "@/components/CircleFlag";
import type { ActivityItem, LiveActivity } from "@/lib/live-activity";
import { trackLiveActivityClicked, trackLiveActivityShown } from "@/lib/analytics";
import styles from "./LiveActivity.module.css";

export interface RateUpdate {
  from: string;
  to: string;
  provider: string;
  /** What the top provider pays out for 1,000 of `from`, rounded. */
  receive: number;
  providers: number;
  /** When that quote was collected, UTC ms. */
  at: number;
}

interface Summary {
  vsBankPer1000: number | null;
  countries: string[];
}

type Entry =
  | { type: "reader"; item: ActivityItem }
  | { type: "rate"; rate: RateUpdate }
  | { type: "savings"; vsBankPer1000: number }
  | { type: "countries"; codes: string[] };

const FEED_URL = "/api/live-activity";
const METHOD_HREF = "/guides/how-much-can-you-save-comparing-money-transfers";
/** The edge caches the feed for 15 seconds. */
const POLL_MS = 30_000;
const STEP_MS = 5_000;
const STEP_STILL_MS = 8_000;
const RECENT_MS = 30 * 60_000;
/** Country names that read "in the …". */
const DEFINITE = new Set(["US", "GB", "AE", "NL", "PH", "DO", "BS", "GM", "CF", "CD", "KM", "MV", "MH", "SB", "VA", "CZ"]);

const noSubscribe = () => () => {};
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia?.(REDUCED_MOTION);
  mq?.addEventListener("change", onChange);
  return () => mq?.removeEventListener("change", onChange);
}
const readReducedMotion = () => window.matchMedia?.(REDUCED_MOTION).matches === true;

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
    return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${amount.toLocaleString("en")} ${currency}`;
  }
}

function ago(at: number, now: number, hourly?: boolean): string {
  const mins = Math.max(0, Math.round((now - at) / 60_000));
  if (hourly) {
    // `at` is when the hour began; the event was somewhere inside it.
    const hours = Math.max(1, Math.round((now - at - 30 * 60_000) / 3_600_000));
    return hours < 24 ? `about ${hours} hour${hours === 1 ? "" : "s"} ago` : hours < 36 ? "yesterday" : `${Math.round(hours / 24)} days ago`;
  }
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  return hours < 24 ? `${hours} hour${hours === 1 ? "" : "s"} ago` : `${Math.round(hours / 24)} days ago`;
}

/** Readers' events lead; rate updates and the 30-day figures are woven between them. */
function weave(items: ActivityItem[], rates: RateUpdate[], summary: Summary | null): Entry[] {
  const readers: Entry[] = items.map((item) => ({ type: "reader", item }));
  const extras: Entry[] = rates.map((rate) => ({ type: "rate", rate }));
  if (summary?.vsBankPer1000 != null) extras.splice(1, 0, { type: "savings", vsBankPer1000: summary.vsBankPer1000 });
  if (summary?.countries.length) extras.splice(3, 0, { type: "countries", codes: summary.countries });
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
  const pair = entry.type === "reader" ? entry.item : entry.type === "rate" ? entry.rate : null;
  return pair?.from && pair.to ? `/send-money?from=${pair.from}&to=${pair.to}` : "/send-money";
}

function Flag({ code }: { code: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={styles.flag} src={getFlagUrl(code)} alt="" width={22} height={22} decoding="async" />;
}

function Message({ entry, now }: { entry: Entry; now: number }) {
  switch (entry.type) {
    case "reader": {
      const { item } = entry;
      const recent = !item.hourly && now - item.at < RECENT_MS;
      const route = item.from && item.to ? `${item.from} → ${item.to}` : null;
      const what =
        item.kind === "chose"
          ? `chose ${item.provider ?? "a provider"}${route ? ` for ${route}` : ""}`
          : route
            ? `compared ${route}`
            : recent
              ? "is comparing transfers"
              : "compared transfers";
      return (
        <>
          <Flag code={item.country} />
          <span className={styles.text}>
            Someone in {DEFINITE.has(item.country) ? "the " : ""}<strong>{countryName(item.country)}</strong>{" "}{what}
          </span>
          <span className={styles.when}>{ago(item.at, now, item.hourly)}</span>
        </>
      );
    }
    case "rate": {
      const { rate } = entry;
      return (
        <>
          <Flag code={rate.to} />
          <span className={styles.text}>
            {rate.from} → {rate.to}: <strong>{rate.provider}</strong>{" "}pays {money(rate.receive, rate.to)} for{" "}
            {money(1000, rate.from)}, top of {rate.providers}{" "}quotes
          </span>
          <span className={styles.when}>updated {ago(rate.at, now)}</span>
        </>
      );
    }
    case "savings":
      return (
        <>
          <span className={styles.icon} aria-hidden="true"><PiggyBank size={14} /></span>
          <span className={styles.text}>
            Readers&rsquo; picks paid a median <strong>{money(Math.round(entry.vsBankPer1000), "USD")}</strong>{" "}more per $1,000 than banks
          </span>
          <span className={styles.when}>last 30 days</span>
        </>
      );
    case "countries":
      return (
        <>
          <span className={styles.stack} aria-hidden="true">
            {entry.codes.slice(0, 4).map((c) => <Flag key={c} code={c} />)}
          </span>
          <span className={styles.text}>
            People in <strong>{entry.codes.length}{" "}countries</strong>{" "}compared rates here
          </span>
          <span className={styles.when}>last 30 days</span>
        </>
      );
  }
}

export default function LiveActivityStrip({ placement, rates, summary }: { placement: string; rates: RateUpdate[]; summary: Summary | null }) {
  const ref = useRef<HTMLElement>(null);
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);
  const still = useSyncExternalStore(subscribeReducedMotion, readReducedMotion, () => false);
  const [inView, setInView] = useState(false);
  const [feed, setFeed] = useState<LiveActivity | null>(null);
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false);

  // Visible on screen (or about to be): start fetching, rotating and counting.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = (visible: boolean) => {
      setInView(visible);
      if (visible) setNow(Date.now());
    };
    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => show(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver((entries) => show(entries.some((e) => e.isIntersecting)), { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shownOnce = useRef(false);
  useEffect(() => {
    if (!inView || shownOnce.current) return;
    shownOnce.current = true;
    trackLiveActivityShown(placement);
  }, [inView, placement]);

  // The feed: once on sight, then every POLL_MS while the strip is on screen.
  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const load = () => {
      if (document.visibilityState === "hidden") return;
      fetch(FEED_URL)
        .then((r) => (r.ok ? (r.json() as Promise<LiveActivity>) : null))
        .then((json) => {
          if (!cancelled && json) {
            setFeed(json);
            setNow(Date.now());
          }
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
  }, [inView]);

  const entries = useMemo(() => weave(feed?.items ?? [], rates, summary), [feed, rates, summary]);
  const halted = paused || hovered || !inView || entries.length < 2;

  // One item at a time.
  useEffect(() => {
    if (halted) return;
    const t = setInterval(() => {
      setIndex((i) => i + 1);
      setNow(Date.now());
    }, still ? STEP_STILL_MS : STEP_MS);
    return () => clearInterval(t);
  }, [halted, still]);

  const entry = entries.length ? entries[index % entries.length] : null;
  const live = feed?.source === "live";
  // "Here now" includes the reader looking at it, so one is not news.
  const counter = !live
    ? "Recent activity"
    : feed.here != null && feed.here >= 2
      ? `${feed.here} people here now`
      : feed.people != null && feed.people >= 2
        ? `${feed.people} people in the last 6 hours`
        : "Live";

  return (
    <aside
      ref={ref}
      aria-label="Live activity on SendMoneyCompare"
      data-nosnippet=""
      className={styles.strip}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {mounted && (
        <>
          <span className={`${styles.pill} ${live ? "" : styles.pillQuiet}`}>
            <span className={styles.dot} aria-hidden="true" />
            {counter}
          </span>
          {entry && now > 0 && (
            <Link
              key={index}
              href={hrefOf(entry)}
              className={`${styles.message} ${still ? styles.messageStill : ""}`}
              onClick={() => trackLiveActivityClicked(placement, entry.type === "reader" ? entry.item.kind : entry.type)}
            >
              <Message entry={entry} now={now} />
            </Link>
          )}
          {placement !== "send-money" && (
            <Link href="/send-money" className={styles.cta} onClick={() => trackLiveActivityClicked(placement, "find_rate")}>
              Find my rate
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          )}
          {entries.length > 1 && (
            <button
              type="button"
              className={styles.pause}
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play activity" : "Pause activity"}
            >
              {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
            </button>
          )}
        </>
      )}
    </aside>
  );
}
