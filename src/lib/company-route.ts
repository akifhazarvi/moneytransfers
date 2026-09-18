/**
 * `companyPageRenders`, split out of route-map.ts so client components can ask
 * it without pulling that module's data graph.
 *
 * WHY THIS FILE EXISTS
 * route-map.ts is the one place link generators ask "does this URL render?", so
 * it imports every route's source list — allCorridors, blogPosts, newsItems,
 * wiseCountries, getSwiftCountries (swift-codes.json alone is 3.8 MB) and more.
 * That is fine on the server. But ProviderCard is a client component and needed
 * exactly one predicate from it — a single Set.has() — and that import put
 * megabytes of route data into the browser bundle on every page rendering a
 * provider card.
 *
 * This predicate depends only on `providers` (16 curated entries, already in the
 * client bundle via SendMoneyClient) and the small gone-companies set, so it is
 * safe to import from client code. route-map.ts re-exports it, so the "ask
 * route-map" rule in CLAUDE.md still holds for server callers.
 */
import { providers } from "@/data/providers";
import { GONE_COMPANY_SLUGS } from "@/lib/gone-companies";

// Retired review pages serve 410 from middleware, so a link into one is a link
// into a dead URL — drop it at the generator rather than the template.
const PROVIDER_SLUGS = new Set(
  providers.map((p) => p.slug).filter((slug) => !GONE_COMPANY_SLUGS.has(slug)),
);

export const companyPageRenders = (slug?: string | null) => Boolean(slug && PROVIDER_SLUGS.has(slug));
