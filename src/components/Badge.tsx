type BadgeVariant = "primary" | "success" | "warning" | "danger" | "neutral";

const variantMap: Record<BadgeVariant, string> = {
  primary: "text-[var(--color-primary)] bg-[var(--color-primary-surface)]",
  success: "text-[var(--color-success-dark)] bg-[var(--color-success-surface)]",
  warning: "text-[var(--color-warning-dark)] bg-[var(--color-warning-surface)]",
  danger:  "text-[var(--color-danger)] bg-[var(--color-danger-surface)]",
  neutral: "text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)]",
};

// News category → variant mapping
const categoryVariantMap: Record<string, BadgeVariant> = {
  "Industry News":   "primary",
  "Provider Update": "success",
  "Announcement":    "neutral",
  "Regulatory":      "neutral",
};

interface Props {
  label: string;
  variant?: BadgeVariant;
  /** Pass a news category string to auto-map to the correct variant */
  category?: string;
  className?: string;
}

export default function Badge({ label, variant, category, className = "" }: Props) {
  const resolvedVariant =
    variant ?? (category ? (categoryVariantMap[category] ?? "neutral") : "neutral");

  return (
    <span
      className={`inline-flex items-center text-2xs font-medium px-2.5 py-1 rounded-full ${variantMap[resolvedVariant]} ${className}`}
    >
      {label}
    </span>
  );
}
