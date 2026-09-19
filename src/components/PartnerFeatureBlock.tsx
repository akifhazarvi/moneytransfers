import Link from "next/link";
import Image from "next/image";
import ProviderLink from "@/components/ProviderLink";
import Container from "@/components/Container";
import { getGoUrl } from "@/lib/affiliate";
import { providerLogo } from "@/lib/provider-logo";
import { currencies, sendCurrencies } from "@/data/transfer-currencies";

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
 * block shows no numbers rather than inventing any.
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
 * The one paid-partner ad this site runs, wherever it appears: a labelled ad
 * unit showing TapTap Send's live rate and payout for the route the reader is
 * on, and a button. It is an ad, so it says so and stops there — it makes no
 * editorial claim and never takes a position in a ranked table.
 *
 * `variant="inline"` matches the `.smc-featured` aside used inside article
 * prose; `"section"` is the full-bleed treatment for the homepage and corridor
 * pages; `"card"` is the same card with no section/Container wrapper, for
 * slots that already sit inside a Container (the inline comparison tables).
 * All three sit below/after any ranked comparison.
 */
export default function PartnerFeatureBlock({
  source,
  variant = "section",
  quote,
  linkContext,
}: {
  source: string;
  variant?: "section" | "inline" | "card";
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

  const inline = variant === "inline";
  const bare = variant === "card";

  /** Send → receive panel. The concrete number a reader can act on. */
  const ratePanel = quote && (
    <div className={`${inline ? "" : "mt-4 "}rounded-xl border border-[var(--color-success-dark)]/30 bg-[var(--color-success-surface)]/50 p-4`}>
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
      </p>
    </div>
  );

  /**
   * What the reader gains here, in the currency they care about.
   *
   * Restored 2026-09-19 after a de-duplication pass removed it with the
   * standing editorial claim. That trim was right about the claim — ~45
   * identical words on ~546 indexable pages — but this line is NOT that: it is
   * computed per corridor and differs on every one, so it adds no repeated
   * text, and it is the only part of the ad that answers "why tap". Gated the
   * same way it always was: the always-true comparison against the
   * lowest-paying quote, with the stronger "most of all N" appended only where
   * TapTap actually tops the route.
   */
  const savings = quote?.worstReceiveAmount !== undefined
    ? quote.receiveAmount - quote.worstReceiveAmount
    : 0;

  const savingsLine = quote && savings > 0 && (
    <p className={`${inline ? "" : "mt-3 "}text-sm text-[var(--color-on-surface)]`}>
      <strong className="text-[var(--color-success-dark)] tabular-nums">
        {recvSymbol}{money(savings, 2)} more
      </strong>{" "}
      than the lowest-paying provider we quote on this route
      {quote.isBest && quote.providerCount
        ? `, and the most of all ${quote.providerCount} we compare`
        : ""}
      .
    </p>
  );

  const ctaLabel = quote
    ? `Send ${sendSymbol}${money(quote.sendAmount)} with TapTap Send`
    : "Send with TapTap Send";

  // One short line, not a paragraph. An affiliate placement has to be
  // identifiable as paid; the "Ad" badge plus this does that. The essay that
  // used to sit here ran on ~546 indexable pages.
  const disclosure = "We earn a commission on transfers made through this link.";

  if (inline) {
    return (
      <aside className="smc-featured" data-badge="Ad">
        <p>
          <strong>
            <Link href="/companies/taptap-send">TapTap Send</Link>
          </strong>
        </p>
        {ratePanel}
        {savingsLine}
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
        <p className="text-2xs text-[var(--color-on-surface-variant)]">{disclosure}</p>
      </aside>
    );
  }

  const card = (
    <div className={`${bare ? "my-10 " : "max-w-3xl mx-auto "}rounded-2xl bg-[var(--color-surface)] ring-1 ring-[var(--color-outline)]/60 p-6 sm:p-8`}>
      <div className="flex items-center gap-3">
        <Image
          src={providerLogo(slug)}
          alt="TapTap Send"
          width={40}
          height={40}
          className="rounded-lg object-contain"
        />
        <div>
          <span className="block text-2xs font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
            Ad
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">
            TapTap Send
          </h2>
        </div>
      </div>
      {ratePanel}
      {savingsLine}
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
      <p className="mt-4 text-2xs text-[var(--color-on-surface-variant)]">{disclosure}</p>
    </div>
  );

  if (bare) return card;

  return (
    <section className="py-8 sm:py-12 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
      <Container>{card}</Container>
    </section>
  );
}
