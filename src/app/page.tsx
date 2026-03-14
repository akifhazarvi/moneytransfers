import Container from "@/components/Container";
import Card from "@/components/Card";
import SectionHeader from "@/components/SectionHeader";
import PrimaryButton from "@/components/PrimaryButton";
import ComparisonWidget from "@/components/ComparisonWidget";
import RatingBadge from "@/components/RatingBadge";
import { providers, popularCorridors, guides, currencies } from "@/data/providers";

export default function Home() {
  const topProviders = providers.slice(0, 6);

  return (
    <>
      {/* Hero — Google-style clean white with centered search */}
      <section className="bg-white pt-12 pb-8">
        <Container>
          <div className="text-center mb-8">
            <h1 className="text-[36px] md:text-[46px] font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              International money transfers,{" "}
              <span className="text-[var(--color-primary)]">compared</span>
            </h1>
            <p className="text-[16px] text-[var(--color-on-surface-variant)] mt-3 max-w-lg mx-auto">
              Find the best exchange rates and lowest fees across 200+ providers
            </p>
          </div>
          <div className="max-w-[860px] mx-auto">
            <ComparisonWidget />
          </div>
        </Container>
      </section>

      {/* Trusted By — light gray bar */}
      <section className="bg-white border-b border-[var(--color-outline)] pb-10">
        <Container>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-[13px] text-[var(--color-on-surface-variant)]">
            {["200+ providers", "Real-time rates", "Expert reviews", "100% independent"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[var(--color-success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Popular Routes */}
      <section className="py-10">
        <Container>
          <SectionHeader title="Popular transfer routes" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularCorridors.map((corridor) => (
              <Card
                key={`${corridor.from}-${corridor.to}`}
                href={`/send-money?from=${corridor.from}&to=${corridor.to}&amount=1000`}
                className="!p-3 flex items-center gap-3"
              >
                <div className="text-[20px] leading-none">
                  {currencies.find((c) => c.code === corridor.from)?.flag}
                  <span className="text-[var(--color-on-surface-variant)] text-[14px] mx-1">→</span>
                  {currencies.find((c) => c.code === corridor.to)?.flag}
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[var(--color-on-surface)]">{corridor.label}</p>
                  <p className="text-[12px] text-[var(--color-on-surface-variant)]">{corridor.from} → {corridor.to}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <SectionHeader title="How it works" centered />
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { step: "1", title: "Enter your transfer", desc: "Tell us the amount, origin, and destination." },
              { step: "2", title: "Compare providers", desc: "See fees, rates, and speed from every provider." },
              { step: "3", title: "Save money", desc: "Pick the best deal and send with confidence." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-[16px] font-medium flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-1">{item.title}</h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Top Providers */}
      <section className="py-10">
        <Container>
          <SectionHeader title="Top-rated providers" viewAllHref="/companies" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topProviders.map((provider) => (
              <Card key={provider.slug} href={`/companies/${provider.slug}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={provider.logo} alt={provider.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-[var(--color-on-surface)]">{provider.name}</h3>
                    <RatingBadge rating={provider.rating} label={provider.ratingLabel} />
                  </div>
                </div>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] line-clamp-2 mb-3">{provider.description}</p>
                <div className="flex gap-4 text-[12px] text-[var(--color-on-surface-variant)]">
                  <span>{provider.supportedCountries}+ countries</span>
                  <span>{provider.transferSpeed}</span>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Guides */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <SectionHeader title="Latest guides" viewAllHref="/guides" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {guides.slice(0, 3).map((guide) => (
              <Card key={guide.slug} href={`/guides#${guide.slug}`}>
                <span className="text-[11px] font-medium text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2 py-0.5 rounded-full">
                  {guide.category}
                </span>
                <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mt-3 mb-1.5 leading-snug">{guide.title}</h3>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] line-clamp-2">{guide.excerpt}</p>
                <p className="text-[12px] text-[var(--color-on-surface-variant)] mt-3">{guide.readTime}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-14 bg-white">
        <div className="max-w-lg mx-auto px-6 text-center">
          <h2 className="text-[24px] font-normal text-[var(--color-on-surface)] mb-3">
            Ready to save on your next transfer?
          </h2>
          <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
            Join thousands who compare before they send.
          </p>
          <PrimaryButton href="/send-money" size="lg">
            Compare providers
          </PrimaryButton>
        </div>
      </section>
    </>
  );
}
