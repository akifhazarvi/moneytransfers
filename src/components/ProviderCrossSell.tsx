import { generateQuotes } from "@/lib/quotes-engine";
import { selectCrossSellPartners } from "@/lib/provider-cross-sell";
import ProviderCrossSellCards, { type ProviderCrossSellCardsProps } from "@/components/ProviderCrossSellCards";

/** Resolve corridor eligibility on the server. Only the selected presentation
 * cards reach the client, never the full provider/quote datasets.
 */
export default function ProviderCrossSell({ eligible, exclude, ...props }: Omit<ProviderCrossSellCardsProps, "partners"> & { eligible?: readonly string[]; exclude?: string }) {
  const eligibleProviders = eligible ?? (props.context
    ? generateQuotes(props.context.amount, props.context.from, props.context.to).map((quote) => quote.providerSlug)
    : undefined);
  const partners = selectCrossSellPartners({
    intent: props.intent, eligible: eligibleProviders, exclude,
    limit: props.placement === "inline" || props.placement === "sidebar" ? 1 : 3,
  });
  return <ProviderCrossSellCards {...props} partners={partners} />;
}
