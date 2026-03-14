import Link from "next/link";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { blogPosts, blogCategories } from "@/data/blog-posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Money Transfer Guides & Resources | MoneyTransfers",
  description:
    "Expert guides on international money transfers, exchange rates, fees, and how to save money sending money abroad.",
  alternates: {
    canonical: "https://moneytransfers.com/guides",
  },
  openGraph: {
    title: "Money Transfer Guides — Expert Resources for Sending Money Abroad",
    description:
      "Expert guides on international money transfers, exchange rates, fees, and how to save money sending money abroad.",
    url: "https://moneytransfers.com/guides",
  },
};

export default function GuidesPage() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <Container className="py-8">
      <nav className="text-[13px] text-[var(--color-on-surface-variant)] mb-6">
        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
        {" / "}
        <span className="text-[var(--color-on-surface)]">Guides</span>
      </nav>

      <h1 className="text-[28px] md:text-[36px] font-normal text-[var(--color-on-surface)] mb-2">
        Guides & Resources
      </h1>
      <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-8">
        Expert guides to help you understand international money transfers, save
        on fees, and get the best exchange rates.
      </p>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {blogCategories.map((cat) => (
          <span
            key={cat}
            className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap cursor-pointer transition-colors ${
              cat === "All"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface-dim)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"
            }`}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Featured Guide */}
      <Link
        href={`/guides/${featured.slug}`}
        className="block bg-gradient-to-br from-[var(--color-primary)] to-[#3a5ba6] rounded-2xl p-8 md:p-12 mb-8 text-white hover:shadow-lg transition-shadow"
      >
        <span className="text-[12px] font-medium bg-[var(--color-surface)]/20 px-3 py-1 rounded-full">
          Featured Guide
        </span>
        <h2 className="text-[24px] md:text-[30px] font-normal mt-4 mb-3">
          {featured.title}
        </h2>
        <p className="text-[14px] text-white/80 mb-6 max-w-2xl">
          {featured.excerpt}
        </p>
        <div className="flex items-center gap-4">
          <span className="text-[13px] text-white/60">
            {featured.readTime}
          </span>
          <span className="bg-[var(--color-surface)] text-[var(--color-primary)] px-6 py-2 rounded-full text-[13px] font-medium">
            Read Guide
          </span>
        </div>
      </Link>

      {/* Guide Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rest.map((post) => (
          <Card key={post.slug} href={`/guides/${post.slug}`} className="group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-medium text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2 py-0.5 rounded-full">
                {post.category}
              </span>
              <span className="text-[12px] text-[var(--color-on-surface-variant)]">
                {post.readTime}
              </span>
            </div>
            <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-2 leading-snug">
              {post.title}
            </h3>
            <p className="text-[13px] text-[var(--color-on-surface-variant)] line-clamp-3">
              {post.excerpt}
            </p>
            <div className="mt-4">
              <span className="text-[13px] text-[var(--color-primary)] font-medium group-hover:underline">
                Read more &rarr;
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Cross-links */}
      <div className="mt-12 pt-8 border-t border-[var(--color-outline)]">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Tools</h3>
            <ul className="space-y-2">
              <li><Link href="/send-money" className="text-[14px] text-[var(--color-primary)] hover:underline">Compare rates calculator</Link></li>
              <li><Link href="/compare" className="text-[14px] text-[var(--color-primary)] hover:underline">Head-to-head comparisons</Link></li>
              <li><Link href="/currency-converter" className="text-[14px] text-[var(--color-primary)] hover:underline">Currency converter</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Top providers</h3>
            <ul className="space-y-2">
              <li><Link href="/companies/wise" className="text-[14px] text-[var(--color-primary)] hover:underline">Wise review</Link></li>
              <li><Link href="/companies/remitly" className="text-[14px] text-[var(--color-primary)] hover:underline">Remitly review</Link></li>
              <li><Link href="/companies" className="text-[14px] text-[var(--color-primary)] hover:underline">All provider reviews</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Popular corridors</h3>
            <ul className="space-y-2">
              <li><Link href="/send-money/usa-to-india" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to India</Link></li>
              <li><Link href="/send-money/usa-to-pakistan" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to Pakistan</Link></li>
              <li><Link href="/send-money/usa-to-philippines" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to Philippines</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-[var(--color-surface-dim)] rounded-2xl p-8 md:p-12 mt-12 text-center">
        <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-3">
          Stay Updated
        </h2>
        <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6 max-w-lg mx-auto">
          Get the latest guides, rate alerts, and money-saving tips delivered to
          your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 border border-[var(--color-outline)] rounded-full px-4 py-3 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
          />
          <button className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-full text-[13px] font-medium hover:bg-[var(--color-primary-dark)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>
    </Container>
  );
}
