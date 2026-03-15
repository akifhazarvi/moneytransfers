"use client";

import Link from "next/link";
import Container from "@/components/Container";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="py-16 text-center">
      <h1 className="text-[64px] font-light text-[var(--color-danger)] mb-4">Oops</h1>
      <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-3">Something went wrong</h2>
      <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-8 max-w-md mx-auto">
        An unexpected error occurred. Please try again or return to the homepage.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 h-10 px-6 text-[14px] font-medium rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-10 px-6 text-[14px] font-medium rounded-full border border-[var(--color-outline)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors"
        >
          Go home
        </Link>
      </div>
    </Container>
  );
}
