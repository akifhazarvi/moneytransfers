"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { useTranslations } from "next-intl";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <Container className="py-16 text-center">
      <h1 className="text-[64px] font-light text-[var(--color-danger)] mb-4">{t("title")}</h1>
      <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-3">{t("description")}</h2>
      <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-8 max-w-md mx-auto">
        {t("descriptionDetail")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 h-10 px-6 text-[14px] font-medium rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          {t("tryAgain")}
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-10 px-6 text-[14px] font-medium rounded-full border border-[var(--color-outline)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors"
        >
          {t("goHome")}
        </Link>
      </div>
    </Container>
  );
}
