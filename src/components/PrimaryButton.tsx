import Link from "@/components/EligibleLink";
import { type ReactNode } from "react";
import { affiliateRel, isAffiliateHref, isLinkEligible } from "@/lib/link-eligibility";

interface BaseProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "gold";
}

interface ButtonProps extends BaseProps {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
}

interface LinkProps extends BaseProps {
  href: string;
  external?: boolean;
}

type Props = ButtonProps | LinkProps;

const sizeMap = {
  sm: "h-9 px-5 text-2sm",
  md: "h-10 px-6 text-sm",
  lg: "h-12 px-8 text-md",
};

const variantMap = {
  // Ink-filled in light, near-white pill in dark (Wealthsimple). Uses --color-cta
  // so it never washes out to pale periwinkle on charcoal. Carries the brand shadow.
  primary:   "bg-[var(--color-cta)] text-[var(--color-cta-text)] hover:bg-[var(--color-cta-hover)] shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-lg)]",
  // Floating white pill — what the screenshots actually use for secondary actions.
  secondary: "bg-[var(--color-surface)] text-[var(--color-on-surface)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
  // Gold — reserved for the "best pick / apply" moment, the one warm accent.
  gold:      "text-[#1A1916] hover:brightness-[1.04] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] [background:var(--gradient-gold)]",
};

export default function PrimaryButton(props: Props) {
  const { children, className = "", size = "md", variant = "primary" } = props;
  const base =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]";

  const classes = `${base} ${variantMap[variant]} ${sizeMap[size]} ${className}`.trim();

  if ("href" in props && props.href) {
    // Affiliate redirects carry nofollow sponsored (CLAUDE.md rule 14).
    if (isAffiliateHref(props.href)) {
      return (
        <a href={props.href} target="_blank" rel={affiliateRel("noopener noreferrer")} className={classes}>
          {children}
        </a>
      );
    }
    if ((props as LinkProps).external) {
      return (
        <a href={props.href} target="_blank" rel="noopener noreferrer nofollow" className={classes}>
          {children}
        </a>
      );
    }
    // A button to a page Google may not index has nowhere to send the reader
    // that we may link to: render nothing rather than a dead button.
    if (!isLinkEligible(props.href)) return null;
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { onClick, type = "button" } = props as ButtonProps;
  return (
    <button onClick={onClick} type={type} className={classes}>
      {children}
    </button>
  );
}
