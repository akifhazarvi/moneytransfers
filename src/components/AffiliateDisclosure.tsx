import Link from "next/link";

export default function AffiliateDisclosure() {
  return (
    <div className="text-xs text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-lg px-4 py-2.5 leading-relaxed">
      Some links on this page are affiliate links \u2014 we may earn a commission at no extra cost to you.
      Rankings come from live transfer data, and a provider that pays us more is never placed above a
      materially cheaper one. Where payouts land within 0.1% of each other \u2014 less than rates typically
      move between our updates \u2014 we rank by customer rating and show providers we partner with first.{" "}
      <Link href="/editorial-policy" className="text-[var(--color-primary)] hover:underline">
        Editorial policy
      </Link>
    </div>
  );
}
