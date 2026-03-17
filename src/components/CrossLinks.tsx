import Link from "next/link";
import Container from "@/components/Container";

interface LinkItem {
  href: string;
  label: string;
}

interface CrossLinksSection {
  title: string;
  links: LinkItem[];
}

interface CrossLinksProps {
  sections: CrossLinksSection[];
  background?: "white" | "dim";
}

export default function CrossLinks({ sections, background = "dim" }: CrossLinksProps) {
  if (sections.length === 0) return null;

  const bg =
    background === "white"
      ? "bg-[var(--color-surface)] border-t border-[var(--color-outline)]"
      : "bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]";

  return (
    <section className={`py-10 ${bg}`}>
      <Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-2sm font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-primary)] hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
