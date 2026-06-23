import Link from "next/link";

interface Props {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  centered?: boolean;
  accent?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View all",
  centered = false,
  accent = false,
}: Props) {
  return (
    <div className={`mb-8 ${centered ? "text-center" : ""}`}>
      {accent && (
        <div
          className={`h-[3px] w-9 bg-[var(--color-accent)] rounded-full mb-4 ${centered ? "mx-auto" : ""}`}
        />
      )}
      <div className={`flex items-baseline ${centered ? "justify-center" : "justify-between"}`}>
        <h2 className="font-display text-3xl sm:text-4xl font-normal text-[var(--color-on-surface)] leading-[1.1] tracking-[-0.01em]">
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="ws-pill shrink-0 ml-4"
          >
            {viewAllLabel} →
          </Link>
        )}
      </div>
      {subtitle && (
        <p className="mt-2.5 text-md text-[var(--color-on-surface-variant)] max-w-[600px] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
