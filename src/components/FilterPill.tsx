interface Props {
  label: string;
  active?: boolean;
  dropdown?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export default function FilterPill({ label, active = false, dropdown = false, onClick, icon }: Props) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 h-8 px-3 rounded-full text-[13px] font-medium transition-colors ${
        active
          ? "bg-[var(--color-primary-surface)] text-[var(--color-primary)] border border-[var(--color-primary)]"
          : "border border-[var(--color-outline)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"
      }`}
    >
      {icon}
      {label}
      {dropdown && (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </button>
  );
}
