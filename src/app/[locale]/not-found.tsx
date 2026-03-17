import Link from "next/link";
import Container from "@/components/Container";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("notFound");
  return {
    title: t("description"),
    robots: { index: false, follow: false },
  };
}

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <Container className="py-16 text-center">
      <h1 className="text-display font-light text-[var(--color-primary)] mb-4">{t("title")}</h1>
      <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-3">{t("description")}</h2>
      <p className="text-sm text-[var(--color-on-surface-variant)] mb-8 max-w-md mx-auto">
        {t("descriptionDetail")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-10 px-6 text-sm font-medium rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          {t("goHome")}
        </Link>
        <Link
          href="/send-money"
          className="inline-flex items-center gap-2 h-10 px-6 text-sm font-medium rounded-full border border-[var(--color-outline)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors"
        >
          {t("compareRates")}
        </Link>
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 h-10 px-6 text-sm font-medium rounded-full border border-[var(--color-outline)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors"
        >
          {t("providerReviews")}
        </Link>
      </div>
    </Container>
  );
}
