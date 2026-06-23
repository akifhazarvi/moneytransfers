type BadgeVariant = "primary" | "success" | "warning" | "danger" | "neutral" | "info";

const variantMap: Record<BadgeVariant, string> = {
  // Soft, low-saturation pastel chips — indigo only as a whisper (lavender tile)
  primary: "text-[var(--tile-lavender-ink)] bg-[var(--tile-lavender-bg)]",
  // positives keep the green family (mint)
  success: "text-[var(--tile-mint-ink)] bg-[var(--tile-mint-bg)]",
  warning: "text-[var(--tile-butter-ink)] bg-[var(--tile-butter-bg)]",
  danger:  "text-[var(--tile-blush-ink)] bg-[var(--tile-blush-bg)]",
  neutral: "text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)]",
  info:    "text-[var(--tile-sky-ink)] bg-[var(--tile-sky-bg)]",
};

// News category → variant mapping
const categoryVariantMap: Record<string, BadgeVariant> = {
  "Industry News":   "primary",
  "Provider Update": "success",
  "Announcement":    "neutral",
  "Regulatory":      "info",
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
