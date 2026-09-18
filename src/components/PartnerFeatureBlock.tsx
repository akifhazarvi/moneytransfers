import Link from "next/link";
import ProviderLink from "@/components/ProviderLink";
import Container from "@/components/Container";
import { getGoUrl } from "@/lib/affiliate";
import { CONSISTENCY_ROWS } from "@/lib/consistency-index";
import { currencies, sendCurrencies } from "@/data/transfer-currencies";

function ordinal(n: number): string {
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th";
  return `${n}${suffix}`;
}

function symbolFor(code: string): string {
  return (
    sendCurrencies.find((c) => c.code === code)?.symbol ||
    currencies.find((c) => c.code === code)?.symbol ||
    code
  );
}

function money(n: number, dp = 0): string {
  return n.toLocaleString(undefined, { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

/**
 * The partner's own live quote for the corridor this block sits on.
 *
 * Every figure here comes from the SAME `generateQuotes()` row the ranked table
 * on the page already renders, never a second calculation — so the panel cannot
 * drift from the comparison above it. Callers pass it only when they actually
 * hold a TapTap quote for the route; on corridors we have no quote for, the
 * block falls back to the site-wide measured facts and shows no numbers rather
 * than inventing any.
 *
 * `worstReceiveAmount` drives the savings line, which is the weaker but
 * always-true claim ("more than the lowest-paying provider we quote").
 * `isBest` unlocks the strong claim ("the most of all N providers"), and is set
 * only where TapTap genuinely tops the corridor — the distinction that the
 * Sep 11 2026 USD→PKR removal was about. See
 * [[project_taptap_earned_highlight_sep11]].
 */
export interface PartnerQuote {
  fromCurrency: string;
  toCurrency: string;
  sendAmount: number;
  receiveAmount: number;
  exchangeRate: number;
  fee: number;
  transferSpeed?: string;
  worstReceiveAmount?: number;
  providerCount?: number;
  isBest?: boolean;
}

/**
 * The one paid-partner spotlight this site runs, wherever it appears. Shared
 * by the homepage, every guide and every corridor page so the copy cannot
 * drift into two stories — the standing facts are recomputed from the
 * consistency index and corridor-leader archive on each build, and the
 * corridor numbers come from the page's own live quotes.
 *
 * `variant="inline"` matches the `.smc-featured` aside used inside article
 * prose; `"section"` is the full-bleed treatment for the homepage and corridor
 * pages. Both sit below/after any ranked comparison — the partnership buys
 * placement, never a position in a ranked table.
 */
export default function PartnerFeatureBlock({
  source,
  variant = "section",
  quote,
  linkContext,
}: {
  source: string;
  variant?: "section" | "inline";
  quote?: PartnerQuote;
  /**
   * The corridor this placement sits on, if any. Threaded into the /go link
   * exactly like every other CTA on the page — omitting it drops
   * from/to/amount from the outbound affiliate URL, so the /go route can't
   * forward them to getAffiliateUrl or the interstitial's corridor label.
   */
  linkContext?: { from: string; to: string; amount: number };
}) {
  const slug = "taptap-send";
  const rank = CONSISTENCY_ROWS.findIndex((r) => r.providerSlug === slug) + 1;
  const row = CONSISTENCY_ROWS.find((r) => r.providerSlug === slug);

  if (!row || rank <= 0) return null;

  const context = linkContext ?? (quote
    ? { from: quote.fromCurrency, to: quote.toCurrency, amount: quote.sendAmount }
    : undefined);

  const href = context
    ? getGoUrl(slug, {
        sourceCurrency: context.from,
        targetCurrency: context.to,
        sourceAmount: context.amount,
        clickref: source,
      })
    : getGoUrl(slug);
  const corridorForTracking = context ? `${context.from}-${context.to}` : "";

  const sendSymbol = quote ? symbolFor(quote.fromCurrency) : "";
  const recvSymbol = quote ? symbolFor(quote.toCurrency) : "";
  const savings = quote?.worstReceiveAmount !== undefined
    ? quote.receiveAmount - quote.worstReceiveAmount
    : 0;

  const inline = variant === "inline";

  /** Send → receive panel. The concrete number a reader can act on. */
  const ratePanel = quote && (
    <div className="mt-4 rounded-xl border border-[var(--color-success-dark)]/30 bg-[var(--color-success-surface)]/50 p-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="text-2xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
            You send
          </p>
          <p className="text-lg font-bold text-[var(--color-on-surface)] tabular-nums">
            {sendSymbol}{money(quote.sendAmount)}
          </p>
        </div>
        <span aria-hidden="true" className="text-xl text-[var(--color-success-dark)] pb-1">&rarr;</span>
        <div className="text-right">
          <p className="text-2xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
            They receive
          </p>
          <p className="text-lg font-bold text-[var(--color-success-dark)] tabular-nums">
            {recvSymbol}{money(quote.receiveAmount, 2)}
          </p>
        </div>
      </div>
      <p className="mt-3 text-2xs text-[var(--color-on-surface-variant)]">
        Rate {quote.exchangeRate.toFixed(4)} {quote.fromCurrency}/{quote.toCurrency}
        {" · "}
        {quote.fee === 0 ? "No transfer fee" : `${sendSymbol}${money(quote.fee, 2)} fee`}
        {quote.transferSpeed ? ` · ${quote.transferSpeed}` : ""}
        {" · quoted from our live comparison, refreshed every 6 hours"}
      </p>
    </div>
  );

  /** What the reader gains, in the currency they care about. */
  const savingsLine = quote && savings > 0 && (
    <p className={inline ? "" : "mt-3 text-sm text-[var(--color-on-surface)] leading-relaxed"}>
      That is{" "}
      <strong className="text-[var(--color-success-dark)] tabular-nums">
        {recvSymbol}{money(savings, 2)} more
      </strong>{" "}
      in your recipient&rsquo;s hands than the lowest-paying provider we quote on this route right now
      {quote.isBest && quote.providerCount
        ? ` — and the most of all ${quote.providerCount} providers we compare today`
        : ""}
      .
    </p>
  );

  // Deliberately short. These are sitewide facts about TapTap, not corridor
  // facts, and this block renders on ~546 indexable pages — the long version
  // ran ~45 identical words on every one of them and was the second-largest
  // repeated text block on the site while Google was declining to index it.
  // The claim is unchanged and still measured; the detail moves behind the
  // link, which also gives the consistency index an inline entry point from
  // every corridor and guide instead of only a footer mention.
  // The live per-corridor rate, payout and savings lines below stay as they
  // are — those genuinely vary by route and are the point of the block.
  const standingClaim = (
    <>
      ranks {ordinal(rank)} of {CONSISTENCY_ROWS.length} providers in our{" "}
      <Link href="/provider-consistency">consistency index</Link>, leading {row.corridorsLed} corridors
    </>
  );

  const ctaLabel = quote
    ? `Send ${sendSymbol}${money(quote.sendAmount)} with TapTap Send`
    : "Send with TapTap Send";

  const disclosure = "We earn a commission if you send with TapTap Send. That is why it is featured here — it is not why it sits where it does in the comparison, which is ordered on measured payout alone. Which provider is cheapest changes with your route and amount, so compare yours before you send.";

  if (inline) {
    return (
      <aside className="smc-featured" data-badge="Partner">
        <p>
          <strong>
            <Link href="/companies/taptap-send">TapTap Send</Link>
          </strong>{" "}
          is the partner we recommend first for everyday remittances, and the measurement behind that is ours: it{" "}
          {standingClaim}.
        </p>
        {ratePanel}
        {savingsLine}
        <p>{disclosure}</p>
        <p>
          <ProviderLink
            href={href}
            provider={slug}
            source={source}
            corridor={corridorForTracking}
            className="smc-send"
          >
            {ctaLabel}
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
            The partner we recommend first for everyday remittances, and the measurement behind that is ours: it{" "}
            {standingClaim}.
          </p>
          {ratePanel}
          {savingsLine}
          <p className="mt-3 text-xs text-[var(--color-on-surface-variant)] leading-relaxed">{disclosure}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <ProviderLink
              href={href}
              provider={slug}
              source={source}
              corridor={corridorForTracking}
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              {ctaLabel}
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
