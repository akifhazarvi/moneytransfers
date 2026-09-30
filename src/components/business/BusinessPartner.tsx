import Image from "next/image";
import ProviderLink from "@/components/ProviderLink";
import ConversionImpression from "@/components/ConversionImpression";
export default function BusinessPartner({ source }: { source: string }) {
  return <aside className="business-partner" aria-label="Sponsored: TapTap Send Business">
    <ConversionImpression source={source} corridor="business" />
    <div><Image src="/logos/taptap-send.png" alt="" width={48} height={48} /><span className="conversion-sponsored">Sponsored</span></div>
    <div><p className="business-eyebrow">Partner spotlight</p><h2>Explore TapTap Send Business</h2><p>Check supported business types, destinations and transfer limits before opening an account.</p><a href="https://business.taptapsend.com/faq" target="_blank" rel="noopener noreferrer">Read the business FAQs ↗</a></div>
    <ProviderLink href="https://business.taptapsend.com/" provider="taptap-send" source={source} corridor="business" className="conversion-button conversion-button--accent">Explore business payments <span aria-hidden="true">↗</span></ProviderLink>
    <p className="business-partner-disclosure">Paid partner placement. Separate from the providers scored in our comparison; sponsorship does not change their ranking. This link opens TapTap Send’s business service.</p>
  </aside>;
}
