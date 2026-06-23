interface Props {
  rating: number;
  label: "Excellent" | "Good" | "Fair" | "Poor";
  size?: "sm" | "md" | "lg";
}

const colorMap = {
  // Excellent / Good read as trust positives → soft mint (green family, reserved for positives)
  Excellent: { bg: "bg-[var(--tile-mint-bg)]", text: "text-[var(--tile-mint-ink)]" },
  Good: { bg: "bg-[var(--tile-sage-bg)]", text: "text-[var(--tile-sage-ink)]" },
  // Fair / Poor stay quietly warm without shouting
  Fair: { bg: "bg-[var(--tile-butter-bg)]", text: "text-[var(--tile-butter-ink)]" },
  Poor: { bg: "bg-[var(--tile-blush-bg)]", text: "text-[var(--tile-blush-ink)]" },
};

export default function RatingBadge({ rating, label, size = "sm" }: Props) {
  const colors = colorMap[label] || colorMap.Good;
  const sizeClass = size === "lg" ? "text-sm px-3 py-1" : size === "md" ? "text-xs px-2.5 py-0.5" : "text-2xs px-2 py-0.5";

  return (
    <span className={`inline-flex items-center gap-1 ${colors.bg} ${colors.text} ${sizeClass} font-semibold tabular-nums rounded-full`} role="img" aria-label={`${rating.toFixed(1)} out of 5 stars, rated ${label}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {rating.toFixed(1)}
    </span>
  );
}
