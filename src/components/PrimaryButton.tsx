import Link from "next/link";
import { type ReactNode } from "react";

interface BaseProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
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
  primary:   "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]",
  secondary: "border border-[var(--color-outline)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)]",
};

export default function PrimaryButton(props: Props) {
  const { children, className = "", size = "md", variant = "primary" } = props;
  const base =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-150 hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] active:shadow-none active:scale-[0.98]";

  const classes = `${base} ${variantMap[variant]} ${sizeMap[size]} ${className}`.trim();

  if ("href" in props && props.href) {
    if ((props as LinkProps).external) {
      return (
        <a href={props.href} target="_blank" rel="noopener noreferrer nofollow" className={classes}>
          {children}
        </a>
      );
    }
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
