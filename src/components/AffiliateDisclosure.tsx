import Link from "next/link";

export default function AffiliateDisclosure() {
  return (
    <div className="text-xs text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-lg px-4 py-2.5 leading-relaxed">
      Some links on this page are affiliate links. We may earn a commission at no extra cost to you. This does not affect our rankings, which are based on real transfer data.{" "}
      <Link href="/editorial-policy" className="text-[var(--color-primary)] hover:underline">
        Editorial policy
      </Link>
    </div>
  );
}
