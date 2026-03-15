import Link from "next/link";
import Container from "@/components/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container className="py-16 text-center">
      <h1 className="text-[64px] font-light text-[var(--color-primary)] mb-4">404</h1>
      <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-3">Page not found</h2>
      <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-8 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved. Try one of the links below.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-10 px-6 text-[14px] font-medium rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          Go home
        </Link>
        <Link
          href="/send-money"
          className="inline-flex items-center gap-2 h-10 px-6 text-[14px] font-medium rounded-full border border-[var(--color-outline)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors"
        >
          Compare rates
        </Link>
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 h-10 px-6 text-[14px] font-medium rounded-full border border-[var(--color-outline)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors"
        >
          Provider reviews
        </Link>
      </div>
    </Container>
  );
}
