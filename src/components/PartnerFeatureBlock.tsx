import Link from "next/link";
import ProviderLink from "@/components/ProviderLink";
import Container from "@/components/Container";
import { getGoUrl } from "@/lib/affiliate";
import { CONSISTENCY_INDEX, CONSISTENCY_ROWS } from "@/lib/consistency-index";
import { unanimousLeads } from "@/lib/unanimous-leads";

function ordinal(n: number): string {
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th";
  return `${n}${suffix}`;
}

/**
 * Corridor-specific proof that TapTap actually leads THIS route, computed by
 * the caller from the same ranked quotes the visible table renders — never
 * recomputed here — so the claim can't diverge from what the reader can see
 * above it. Pass this ONLY when the caller has confirmed TapTap is the
 * corridor's #1 by receive amount; omitting it (most corridors — TapTap leads
 * 40 of 216) falls back to the site-wide facts below, never a fabricated
 * per-corridor number. This is exactly the failure the Sep 11 2026 removal of
 * "TapTap is consistently at or near the top" from the USD→PKR page (0 of 91
 * days) was about — see [[project_taptap_earned_highlight_sep11]].
 */
interface CorridorLead {
  fromCurrency: string;
  toCurrency: string;
  sendSymbol: string;
  sendAmount: number;
  receiveSymbol: string;
  savingsAmount: number;
  worstProviderName: string;
  providerCount: number;
}

/**
 * The one paid-partner spotlight this site runs, wherever it appears. Shared
 * by the homepage and every guide so the copy cannot drift into two stories —
 * everything below is recomputed from the consistency index and
 * corridor-leader archive on each build, the same rule
 * [[project_taptap_earned_highlight_sep11]] set for the homepage version this
 * replaces. `variant="inline"` matches the `.smc-featured` aside style already
 * used by the few guides that hand-authored this block in prose; `"section"`
 * is the full-bleed homepage treatment. Both sit below/after any ranked
 * comparison on the page — the partnership buys placement, never a spot in
 * the ranked table.
 */
export default function PartnerFeatureBlock({
  source,
  variant = "section",
  corridorLead,
  linkContext,
}: {
  source: string;
  variant?: "section" | "inline";
  corridorLead?: CorridorLead;
  /**
   * The corridor this placement sits on, if any (a guide's inline-quote
   * corridor, or the corridor page's own route). Threaded into the /go link
   * exactly like every other CTA on the page (corridor_hero, results,
   * sticky_cta) — omitting it doesn't just weaken the click event, it drops
   * from/to/amount from the actual outbound affiliate URL, so the /go route
   * can't forward them to getAffiliateUrl or the interstitial's corridor
   * label. Homepage has no single corridor, so it's left undefined there.
   */
  linkContext?: { from: string; to: string; amount: number };
}) {
  const slug = "taptap-send";
  const rank = CONSISTENCY_ROWS.findIndex((r) => r.providerSlug === slug) + 1;
  const row = CONSISTENCY_ROWS.find((r) => r.providerSlug === slug);
  const sweep = unanimousLeads(slug);

  // No measured row for the partner slug (e.g. a stale build) — say nothing
  // rather than render an unsupported claim.
  if (!row || rank <= 0) return null;

  // clickref carries `source` into the URL itself (Partnerize + /go's own
  // server-side tracking read it from the querystring, not from the React
  // event) so ProviderLink's href stays in lockstep with its onClick
  // regardless of which surface rendered this block.
  const href = linkContext
    ? getGoUrl(slug, {
        sourceCurrency: linkContext.from,
        targetCurrency: linkContext.to,
        sourceAmount: linkContext.amount,
        clickref: source,
      })
    : getGoUrl(slug);
  // Every other CTA on a corridor/guide page passes a real "USD-INR" string to
  // trackProviderClicked; leaving this blank would make partner_inline clicks
  // the one gap in that dimension across the whole site.
  const corridorForTracking = linkContext ? `${linkContext.from}-${linkContext.to}` : "";

  const sweepClause = sweep.corridors >= 2 && (
    <>
      {" "}
      and delivered the most on <strong className="font-semibold text-[var(--color-on-surface)]">every one</strong> of the last{" "}
      {sweep.days} comparable days on {sweep.corridors} of them
    </>
  );

  // Only rendered when the caller confirmed TapTap is #1 on this exact
  // corridor's live quotes — the one sentence in this component that names a
  // dollar figure for a specific route rather than a site-wide count.
  const corridorProof = corridorLead && corridorLead.savingsAmount > 0 && (
    <p className={variant === "inline" ? "" : "mt-3 text-sm text-[var(--color-on-surface)] leading-relaxed"}>
      <strong>
        On {corridorLead.fromCurrency} → {corridorLead.toCurrency} today, it is the best of {corridorLead.providerCount}{" "}
        providers we compare
      </strong>{" "}
      — sending {corridorLead.sendSymbol}
      {corridorLead.sendAmount.toLocaleString()} gets your recipient{" "}
      <strong className="text-[var(--color-success-dark)] tabular-nums">
        {corridorLead.receiveSymbol}
        {corridorLead.savingsAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </strong>{" "}
      more than {corridorLead.worstProviderName}, the lowest-paying provider we quote on this route right now.
    </p>
  );

  if (variant === "inline") {
    return (
      <aside className="smc-featured" data-badge="Partner">
        <p>
          <strong>
            <Link href="/companies/taptap-send">TapTap Send</Link>
          </strong>{" "}
          is the partner we recommend first for everyday remittances, and the measurement behind that is ours: it
          ranks {ordinal(rank)} of {CONSISTENCY_ROWS.length} providers in our consistency index and is the most
          frequent winner on {row.corridorsLed} of the {CONSISTENCY_INDEX.comparableCorridors} corridors we can
          compare{sweepClause}.
        </p>
        {corridorProof}
        <p>
          We earn a commission if you send with TapTap Send. That is why it is featured here — it is not why it
          sits where it does in the comparison above, which is ordered on measured payout alone. Which provider is
          cheapest changes with your route and amount, so compare yours before you send.
        </p>
        <p>
          <ProviderLink
            href={href}
            provider={slug}
            source={source}
            corridor={corridorForTracking}
            className="smc-send"
          >
            Send with TapTap Send
          </ProviderLink>
        </p>
      </aside>
    );
  }

  return (
    <section className="py-8 sm:py-12 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
      <Container>
        <div className="max-w-3xl mx-auto rounded-2xl bg-[var(--color-surface)] ring-1 ring-[var(--color-outline)]/60 p-6 sm:p-8">
          <span className="inline-block text-2xs font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
            Partner
          </span>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">
            TapTap Send
          </h2>
          <p className="mt-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            The partner we recommend first for everyday remittances, and the measurement behind that is ours: it
            ranks {ordinal(rank)} of {CONSISTENCY_ROWS.length} providers in our consistency index, is the most
            frequent winner on {row.corridorsLed} of the {CONSISTENCY_INDEX.comparableCorridors} corridors we can
            compare{sweepClause}.
          </p>
          {corridorProof}
          <p className="mt-3 text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
            We earn a commission if you send with TapTap Send. That is why it is featured here — it is not why it
            sits where it does in the comparisons above, which are ordered on measured payout alone. Which provider
            is cheapest changes with your route and amount, so compare yours before you send.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <ProviderLink
              href={href}
              provider={slug}
              source={source}
              corridor={corridorForTracking}
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Send with TapTap Send
            </ProviderLink>
            <Link href="/companies/taptap-send" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
              Read our review &rarr;
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
