"use client";

import Link from "next/link";
import { trackGuideSidebarCTA } from "@/lib/analytics";

interface Props {
  slug: string;
}

export default function GuideSidebarCTA({ slug }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-sm)] border border-[var(--color-outline)]">
      <div className="bg-[var(--color-primary)] px-5 py-4">
        <p className="text-md font-semibold text-white mb-1">Find the best rate today</p>
        <p className="text-2sm text-white/70">Compare 50+ apps in seconds</p>
      </div>
      <div className="bg-[var(--color-surface)] px-5 py-4 space-y-3">
        <Link
          href="/send-money"
          onClick={() => trackGuideSidebarCTA(slug)}
          className="flex items-center justify-center w-full h-10 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          Compare Rates →
        </Link>
        <div className="flex items-center justify-center gap-4">
          <span className="flex items-center gap-1 text-2xs text-[var(--color-on-surface-muted)]">
            <svg className="w-3 h-3 text-[var(--color-success)]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            50+ apps
          </span>
          <span className="flex items-center gap-1 text-2xs text-[var(--color-on-surface-muted)]">
            <svg className="w-3 h-3 text-[var(--color-success)]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Live rates
          </span>
        </div>
      </div>
    </div>
  );
}
