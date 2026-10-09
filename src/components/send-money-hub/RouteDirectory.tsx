import Link from "next/link";
import type { DestinationGroup } from "@/lib/send-money-hub";

/**
 * The hub's links to country and route pages — Google-eligible pages only,
 * grouped by destination (see getRouteDirectory). Navigation, not content: it
 * titles itself with a styled <p> and its <nav> label, never an <h2> (CLAUDE.md
 * rule 4). Each URL appears once.
 */
export default function RouteDirectory({ groups }: { groups: DestinationGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <nav
      aria-label="Country and route comparison pages"
      className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8"
    >
      <p className="text-lg font-medium text-[var(--color-on-surface)] mb-1">Country and route pages</p>
      <p className="text-2sm text-[var(--color-on-surface-variant)] mb-5 leading-relaxed">
        These destinations and routes have a page of their own, with the full provider table, rate history and what the
        recipient needs. Any other pair can be compared with the form at the top of this page.
      </p>
      <ul className="divide-y divide-[var(--color-outline)]">
        {groups.map((g) => (
          <li key={g.country} className="py-2.5 sm:grid sm:grid-cols-[10rem_1fr] sm:gap-4">
            <span className="block text-sm font-medium text-[var(--color-on-surface)] mb-1 sm:mb-0">{g.country}</span>
            <span className="flex flex-wrap gap-x-4 gap-y-1 text-2sm">
              {g.countryPage && (
                <Link href={g.countryPage.href} className="text-[var(--color-primary)] hover:underline">
                  {g.countryPage.label}
                </Link>
              )}
              {g.routes.map((r) => (
                <Link key={r.href} href={r.href} className="text-[var(--color-primary)] hover:underline">
                  {r.label}
                </Link>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
