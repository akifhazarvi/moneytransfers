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
      className={`flex items-center gap-1.5 h-8 px-3.5 rounded-full text-2sm font-medium transition-all ${
        active
          ? "bg-[var(--color-primary)] text-white border border-transparent shadow-[var(--shadow-primary)]"
          : "bg-[var(--color-surface)] border border-[var(--color-outline)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-on-surface-variant)] hover:shadow-[var(--shadow-sm)] hover:-translate-y-px"
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
