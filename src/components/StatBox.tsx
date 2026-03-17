interface Props {
  label: string;
  value: string | number;
  className?: string;
  badge?: string;
}

export default function StatBox({ label, value, className = "", badge }: Props) {
  return (
    <div
      className={`bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline)] shadow-[var(--shadow-xs)] px-4 py-3 text-center ${className}`.trim()}
    >
      <p className="text-overline text-[var(--color-on-surface-muted)] mb-1">{label}</p>
      <p className="text-[17px] font-semibold text-[var(--color-on-surface)] leading-snug">{value}</p>
      {badge && (
        <span className="inline-block mt-1 text-[10px] font-semibold text-[var(--color-success-dark)] bg-[var(--color-success-surface)] px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}
