import Link from "next/link";

export default function AffiliateDisclosure() {
  return (
    <div className="text-xs text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-lg px-4 py-2.5 leading-relaxed">
      {/* Kept short on purpose: it renders on every comparison surface, and the
          71-word version was repeated verbatim across hundreds of pages. The
          tie-break rule it used to spell out now lives on /editorial-policy
          and in the caption under each quote table. */}
      Some links are affiliate links — we may earn a commission at no extra cost to you. It never
      affects the order, which is set by what your recipient receives.{" "}
      <Link href="/editorial-policy" className="text-[var(--color-primary)] hover:underline">
        Editorial policy
      </Link>
    </div>
  );
}
