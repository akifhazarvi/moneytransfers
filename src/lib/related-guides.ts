/**
 * The "Related guides" list under every guide: the curated relatedSlugs, then
 * — only where a guide is under-linked — one or two topical extras.
 *
 * WHY (round-3 freelance brief §5.3, 2026-10-08)
 * Every Google-eligible page should receive in-content links from at least 3
 * other eligible pages. The curated lists are lopsided: on 2026-10-08 one
 * guide was named in 78 of them, three more in 40+, while 24 eligible guides
 * were in none and 58 more in one or two. A list repeated site-wide would
 * add the same text everywhere (rule 3), so the extras are assigned per guide
 * instead: each under-linked guide is offered to its closest siblings (shared
 * tags, then category, then title words), and no list grows past six, so a
 * guide's own list changes by at most a couple of entries.
 *
 * Deterministic (no dates, no randomness), so the same build gives the same
 * lists. Sources and targets are Google-eligible only (CLAUDE.md rule 14): a
 * guide released to Google joins the pool on the next build.
 */
import { blogPosts, getBlogPost, type BlogPost } from "@/data/blog-posts";
import { isLinkEligible } from "@/lib/link-eligibility";

/** In-content inbound links each guide should get from sibling lists. */
const TARGET = 3;
/** A list is topped up to this length at most (every donor may give one). */
const MAX_LIST = 6;

const guideHref = (slug: string) => `/guides/${slug}`;

/**
 * Guides with their own route under src/app/[locale]/guides/<slug>/: that page
 * renders instead of the [slug] template, so it shows no "Related guides" list
 * and cannot be a donor (an extra given to it would never render).
 */
const OWN_ROUTE = new Set([
  "bank-vs-app-transfer-cost-2026",
  "best-apps-to-send-money-from-us-2026",
  "best-day-to-send-money-abroad",
  "fx-cost-vs-purchasing-power",
  "gbp-forecast-2026",
  "how-much-can-you-save-comparing-money-transfers",
]);
const STOP = new Set(["the", "a", "an", "to", "of", "and", "or", "for", "in", "on", "from", "with", "how", "what", "your", "you", "is", "are", "best", "guide", "money", "send", "sending", "transfer", "transfers", "2026", "vs"]);
const words = (p: BlogPost) => new Set(p.title.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w)));

function build(): Map<string, string[]> {
  const eligible = blogPosts.filter((p) => isLinkEligible(guideHref(p.slug)));
  const curated = new Map(
    eligible.map((p) => [
      p.slug,
      (p.relatedSlugs ?? []).filter((s) => s !== p.slug && getBlogPost(s) && isLinkEligible(guideHref(s))),
    ]),
  );
  const inbound = new Map(eligible.map((p) => [p.slug, 0]));
  for (const [from, list] of curated) if (!OWN_ROUTE.has(from)) for (const s of list) if (inbound.has(s)) inbound.set(s, inbound.get(s)! + 1);

  const tags = new Map(eligible.map((p) => [p.slug, new Set(p.tags.map((t) => t.toLowerCase()))]));
  const titleWords = new Map(eligible.map((p) => [p.slug, words(p)]));
  const score = (d: BlogPost, t: BlogPost) => {
    let n = d.category === t.category ? 2 : 0;
    for (const tag of tags.get(t.slug)!) if (tags.get(d.slug)!.has(tag)) n += 3;
    for (const w of titleWords.get(t.slug)!) if (titleWords.get(d.slug)!.has(w)) n += 1;
    return n;
  };

  const extras = new Map(eligible.map((p) => [p.slug, [] as string[]]));
  const needy = eligible
    .filter((p) => inbound.get(p.slug)! < TARGET)
    .sort((a, b) => inbound.get(a.slug)! - inbound.get(b.slug)! || a.slug.localeCompare(b.slug));
  for (const target of needy) {
    const donors = eligible
      .filter((d) => d.slug !== target.slug && !OWN_ROUTE.has(d.slug) && !curated.get(d.slug)!.includes(target.slug))
      .map((d) => ({ d, s: score(d, target) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s || extras.get(a.d.slug)!.length - extras.get(b.d.slug)!.length || a.d.slug.localeCompare(b.d.slug));
    for (const { d } of donors) {
      if (inbound.get(target.slug)! >= TARGET) break;
      const room = Math.max(1, MAX_LIST - curated.get(d.slug)!.length);
      if (extras.get(d.slug)!.length >= room) continue;
      extras.get(d.slug)!.push(target.slug);
      inbound.set(target.slug, inbound.get(target.slug)! + 1);
    }
  }
  return new Map(eligible.map((p) => [p.slug, [...curated.get(p.slug)!, ...extras.get(p.slug)!]]));
}

let lists: Map<string, string[]> | null = null;

/** The related guides to list under `slug` (eligible only, curated first). */
export function relatedGuides(slug: string): BlogPost[] {
  lists ??= build();
  return (lists.get(slug) ?? []).map((s) => getBlogPost(s)).filter((p): p is BlogPost => !!p);
}
