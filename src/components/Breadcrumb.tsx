import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-xs text-[var(--color-on-surface-muted)] mb-6 ${className}`}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-[var(--color-on-surface-variant)] truncate max-w-[260px]"
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
