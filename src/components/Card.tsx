import Link from "next/link";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  href?: string;
  className?: string;
  highlight?: boolean;
  id?: string;
}

export default function Card({ children, href, className = "", highlight = false, id }: Props) {
  // Cards float on the warm-grey canvas via shadow, not a hard border. The
  // hairline is near-invisible — present when you look, absent when you don't.
  const base =
    "bg-[var(--color-surface)] rounded-[20px] transition-all duration-200 ease-out";

  // Highlight = the "best pick". A warm gold ring (the brand's one warmth)
  // marks it without the heavy-navy-border shout of a typical card UI.
  const border = highlight
    ? "ring-1 ring-[var(--color-accent)]/40 shadow-[var(--shadow-md)]"
    : "ring-1 ring-[var(--color-outline)]/70 shadow-[var(--shadow-sm)]";

  const hover = href
    ? highlight
      ? "hover:shadow-[var(--shadow-xl)] hover:-translate-y-1"
      : "hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 hover:ring-[var(--color-primary-light)]"
    : "";

  const classes = `${base} ${border} ${hover} p-5 ${className}`.trim();

  if (href) {
    return (
      <Link href={href} id={id} className={`block ${classes}`}>
        {children}
      </Link>
    );
  }

  return (
    <div id={id} className={classes}>
      {children}
    </div>
  );
}
