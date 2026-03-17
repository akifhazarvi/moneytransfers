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
  const base =
    "bg-[var(--color-surface)] rounded-2xl transition-all duration-200";

  const border = highlight
    ? "border-2 border-[var(--color-primary)] shadow-[var(--shadow-md)]"
    : "border border-[var(--color-outline)] shadow-[var(--shadow-xs)]";

  const hover = highlight
    ? "hover:shadow-[var(--shadow-lg)]"
    : "hover:shadow-[var(--shadow-md)] hover:border-[var(--color-on-surface-muted)]";

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
