"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeftRight } from "lucide-react";
import { trackGuideSidebarCTA } from "@/lib/analytics";
import { COVERAGE } from "@/lib/site-stats";

interface Props {
  slug: string;
  from?: string;
  to?: string;
  amount?: number;
}

export default function GuideSidebarCTA({ slug, from, to, amount }: Props) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (amount) params.set("amount", String(amount));
  const qs = params.toString();
  const href = qs ? `/send-money?${qs}` : "/send-money";
  const label = from && to ? `Compare ${from} → ${to}` : "Compare live rates";
  return (
    <div className="guide-sidebar-cta">
      <ArrowLeftRight size={22} strokeWidth={1.5} aria-hidden="true" />
      <p>{from && to ? `Sending ${from} to ${to}?` : "Ready to make your move?"}</p>
      <span>See what your recipient gets. Compare {COVERAGE.providers} in one place.</span>
      <Link href={href} onClick={() => trackGuideSidebarCTA(slug)}>{label}<ArrowRight size={16} aria-hidden="true" /></Link>
      <small>Free to compare · No sign-up needed</small>
    </div>
  );
}
