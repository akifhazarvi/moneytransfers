/**
 * The one place that answers "should this guide be indexed, and submitted?".
 *
 * WHY THIS EXISTS
 * The guide route derived noindex from `SITEMAP_GUIDE_SLUGS` while
 * `sitemap.ts` derived submission from the same set. That kept the two signals
 * consistent, which is what it was for — but it also welded an editorial
 * decision to a demand-gated list. A guide was noindexed because it was not
 * earning impressions, and it could not earn impressions because it was
 * noindexed. The 2026-09-07 audit found 40 guides sitting in that loop.
 *
 * `contentStatus` on the post breaks the loop without loosening the indexing
 * model. Both callers ask this module, so "submitted ⇒ indexable and
 * self-canonical" still holds by construction, and `check:indexing` still
 * guards it.
 *
 * DEFAULT IS DELIBERATE
 * With `contentStatus` unset the answer is exactly what the allowlist said
 * before, so introducing this changed no page's behaviour. Promotions and
 * demotions happen one guide at a time, each visible in a diff — the audit's
 * explicit warning was against another blanket change.
 */
import type { BlogPost } from "@/data/blog-posts";
import { SITEMAP_GUIDE_SLUGS } from "@/lib/sitemap-allowlists";

/**
 * True when the guide should carry `index, follow` AND appear in sitemap.xml.
 *
 * These are deliberately the same predicate. Submitting a noindex URL is the
 * contradiction the May 2026 deindex was traced to, so the only way to make a
 * guide indexable is to make it submitted at the same time.
 */
export function guideIsIndexable(post: Pick<BlogPost, "slug" | "contentStatus">): boolean {
  switch (post.contentStatus) {
    case "published":
      return true;
    case "draft":
    case "archived":
      return false;
    default:
      // No explicit call recorded yet — fall back to the submission allowlist,
      // which is how every guide behaved before contentStatus existed.
      return SITEMAP_GUIDE_SLUGS.has(post.slug);
  }
}
