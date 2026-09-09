import { MATERIALITY_BAND_PCT } from "@/lib/rank-quotes";

/**
 * Explains a row that sits above a visibly larger payout.
 *
 * Quotes refresh every ~6 hours and major pairs move more than the materiality
 * band intraday, so a gap inside it says nothing reliable about who is actually
 * cheaper at the moment someone sends. rankQuotes therefore treats those as
 * tied and puts the higher-rated provider first — accurate, disclosed, and
 * completely invisible to someone scanning two big numbers in a table.
 *
 * On GBP→INR that produced ₹128,372 above ₹128,487: a 0.09% gap worth about
 * 90p on £1,000, printed at a magnitude that looks like real money. The fix is
 * to state the reason in the row, not to change an order we measured and
 * published.
 */
export default function TiedNote({ rating, className = "" }: { rating?: number; className?: string }) {
  return (
    <p
      className={`text-2xs text-[var(--color-on-surface-variant)] mt-0.5 flex items-center gap-1 ${className}`}
      title={`Payouts within ${MATERIALITY_BAND_PCT}% of each other move by more than that between our updates, so we treat them as tied and list the higher-rated provider first.`}
    >
      <span aria-hidden="true">≈</span>
      <span>
        Effectively tied
        {typeof rating === "number" ? ` · rated ${rating.toFixed(1)}` : ""}
      </span>
    </p>
  );
}
