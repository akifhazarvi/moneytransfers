import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import CircleFlag from "@/components/CircleFlag";
import PartnerFeatureBlock, { tapTapSendsFrom } from "@/components/PartnerFeatureBlock";
import ReviewContinue from "@/components/go-review/ReviewContinue";
import StayConnected from "@/components/go-review/StayConnected";
import { isValidProviderSlug } from "@/lib/affiliate";
import { partnerQuoteFrom } from "@/lib/partner-quote";
import { providerLogo } from "@/lib/provider-logo";
import { generateQuotes } from "@/lib/quotes-engine";
import { DIRECT_PROVIDERS, providerDisplayName } from "@/lib/redirect-decision";
import "./review.css";

/**
 * The page between a click and every provider but TapTap Send (owner decision
 * 2026-10-05; the routing is in src/lib/redirect-decision.ts). It is a page of
 * the site, not a stopgap: the visitor's pick stays one obvious tap away
 * ("Continue to Wise"), and beside it the paid partner is offered on the same
 * corridor with the same quote the comparison ranks, then the app and the
 * WhatsApp channel.
 *
 * Rendered per request (it reads the query) and never indexed: /go is
 * disallowed in robots.txt, the worker never caches it, and it says noindex.
 */

type Props = {
  params: Promise<{ locale: string; provider: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { provider } = await params;
  return {
    title: `Continue to ${providerDisplayName(provider)}`,
    robots: { index: false, follow: false },
  };
}

const money = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });

export default async function GoReviewPage({ params, searchParams }: Props) {
  const { locale, provider } = await params;
  setRequestLocale(locale);
  if (!isValidProviderSlug(provider)) notFound();

  const query = await searchParams;
  const one = (key: string) => {
    const v = query[key];
    return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
  };

  // Continue hands the whole query back to the route it came from, so the
  // attribution (src, click_id, cid, ai_src, t) survives the stop here.
  const via = one("via") === "out" ? "out" : "go";
  const forward = new URLSearchParams();
  for (const key of Object.keys(query)) {
    const value = one(key);
    if (value && key !== "via" && key !== "continue") forward.set(key, value);
  }
  forward.set("continue", "1");
  const continueHref = `/${via}/${provider}?${forward}`;

  const name = providerDisplayName(provider);
  const code = (v?: string) => (v && /^[a-z]{3}$/i.test(v) ? v.toUpperCase() : undefined);
  const from = code(one("from"));
  const to = code(one("to"));
  const requested = Number(one("amount"));
  const amount = requested > 0 && requested <= 1_000_000 ? requested : 1000;
  const route = from && to && from !== to ? { from, to, amount } : undefined;

  // One generateQuotes() pass, the same rows the comparison ranks, so neither
  // figure on this page can differ from the table the visitor came from.
  let quotes: ReturnType<typeof generateQuotes> = [];
  if (route) {
    try {
      quotes = generateQuotes(route.amount, route.from, route.to);
    } catch {
      quotes = [];
    }
  }
  const pick = quotes.find((q) => q.providerSlug === provider && !q.isIndicative);

  // TapTap is the offer, so it is not offered to itself (a TapTap hit only
  // lands here when the route held back a self-identifying crawler), nor where
  // TapTap cannot send from the visitor's currency.
  const partnerShown = !DIRECT_PROVIDERS.has(provider) && (!route || tapTapSendsFrom(route.from));
  const partnerQuote = partnerShown && route ? partnerQuoteFrom(quotes, route.from, route.to) : undefined;
  const partner = !partnerShown ? "none" : partnerQuote ? "quote" : "card";
  // Said only when measured: both payouts for the same amount, TapTap's higher.
  const gain = pick && partnerQuote && partnerQuote.sendAmount === pick.sendAmount ? partnerQuote.receiveAmount - pick.receiveAmount : 0;

  const corridor = route ? `${route.from}-${route.to}` : "";
  const origin = one("click_id") ? "on_site" : "external";
  const beacon = new URLSearchParams({ provider });
  for (const key of ["from", "to", "src", "ai_src", "cid"]) {
    const value = one(key);
    if (value) beacon.set(key, value);
  }
  const backHref = route ? `/send-money?from=${route.from}&to=${route.to}&amount=${route.amount}` : "/send-money";

  return (
    <div className="go-review">
      <section className="go-review-hero">
        <Container>
          <div className={`go-review-grid${partnerShown ? "" : " go-review-grid--solo"}`}>
            <div className="go-review-handoff">
              <div className="go-review-route" aria-hidden="true">
                <span className="go-review-tile">
                  <Image src="/icon-192x192.png" alt="" width={40} height={40} priority />
                </span>
                <span className="go-review-route-arrow">→</span>
                <span className="go-review-tile go-review-tile--provider">
                  <Image src={providerLogo(provider)} alt="" width={44} height={44} priority />
                </span>
              </div>
              <p className="go-review-eyebrow">Your selected provider</p>
              <h1 className="go-review-title">
                Continue with <span>{name}</span>
              </h1>
              <p className="go-review-description">You’ll complete your transfer on {name}’s website. Review their final rate and fees before sending.</p>

              {route && (
                <div className="go-review-transfer">
                  <p className="go-review-transfer-line">
                    <CircleFlag code={route.from} size={22} priority />
                    <span>{money(route.amount)} {route.from}</span>
                    <span aria-hidden="true" className="go-review-transfer-arrow">→</span>
                    <span className="sr-only">to</span>
                    <CircleFlag code={route.to} size={22} priority />
                    <span>{pick ? `${money(pick.receiveAmount)} ${route.to}` : route.to}</span>
                  </p>
                  {pick && <p className="go-review-transfer-note">{name}’s quote in our latest data. Confirm the final amount with {name}.</p>}
                </div>
              )}

              <div className="go-review-actions">
                <ReviewContinue
                  href={continueHref}
                  provider={provider}
                  corridor={corridor}
                  partner={partner}
                  origin={origin}
                  beacon={beacon.toString()}
                  className="conversion-button go-review-continue"
                >
                  Continue to {name}
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </ReviewContinue>
                <Link href={backHref} className="go-review-back">Back to the comparison</Link>
              </div>

              <ul className="go-review-trust">
                <li>You finish on {name}’s own site</li>
                <li>We never handle your money</li>
                <li>Comparing is free</li>
              </ul>
            </div>

            {partnerShown && (
              <div className="go-review-partner">
                <p className="go-review-kicker">Another option · Sponsored</p>
                {gain > 0 && route && (
                  <p className="go-review-gain">
                    TapTap Send pays <strong>{money(gain)} {route.to} more</strong> than {name} on this transfer
                  </p>
                )}
                <PartnerFeatureBlock source="go_review" variant="card" quote={partnerQuote} linkContext={route} />
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="go-review-more">
        <Container>
          <h2 className="go-review-more-kicker">Make your next comparison easier</h2>
          <StayConnected from={route?.from} to={route?.to} />
        </Container>
      </section>
    </div>
  );
}
