/**
 * Split a provider's `headquarters` display string into a schema.org
 * PostalAddress.
 *
 * FinancialService is a LocalBusiness subclass, so a validator expects a real
 * address. Both schema emission sites used to pass the whole display string as
 * `addressLocality`, producing `addressLocality: "London, UK"` — one field
 * holding a city and a country. That is wrong per the PostalAddress spec on all
 * 80 nodes the site emits.
 *
 * `headquarters` stays a display string used in prose; this only changes how it
 * is expressed as structured data.
 *
 * Shapes present in src/data/providers.ts:
 *   "London, UK"                    -> locality + country
 *   "Boston, Massachusetts, USA"    -> locality + region + country
 *   "China" / "Hong Kong"           -> country only, no invented locality
 *   "Dubai, UAE / London, UK"       -> first listed HQ wins
 */
export type PostalAddress = {
  "@type": "PostalAddress";
  addressLocality?: string;
  addressRegion?: string;
  addressCountry?: string;
};

export function postalAddress(headquarters: string | undefined | null): PostalAddress | undefined {
  if (!headquarters) return undefined;

  // "Dubai, UAE / London, UK" — take the first listed headquarters rather than
  // emitting a single address that is really two.
  const primary = headquarters.split("/")[0];
  const parts = primary.split(",").map((p) => p.trim()).filter(Boolean);
  if (!parts.length) return undefined;

  // A single token is a country or city-state ("China", "Hong Kong"). Do not
  // promote it to a locality — we do not know the city.
  if (parts.length === 1) return { "@type": "PostalAddress", addressCountry: parts[0] };

  const addressCountry = parts[parts.length - 1];
  const addressLocality = parts[0];
  const addressRegion = parts.length > 2 ? parts.slice(1, -1).join(", ") : undefined;

  return {
    "@type": "PostalAddress",
    addressLocality,
    ...(addressRegion ? { addressRegion } : {}),
    addressCountry,
  };
}
