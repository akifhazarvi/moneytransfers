# Country and payment-method eligibility — measured 2026-09-11

Both the plan and the second batch note flag this as the last open integrity
gap: "country/payment-method eligibility needs stronger source fields through
the quote engine; present estimates must not be represented as verified
bank/wallet quotes for every country sharing a currency." This is the
measurement behind that sentence.

## The scale

Across the **841** corridor pages this build renders:

| | |
| --- | --- |
| Distinct currency pairs | 383 |
| Pairs serving more than one page | 284 |
| **Pages sharing a pair with another page** | **742 (88%)** |

Twelve pages share each of the busier EUR pairs. `EUR-TZS` is rendered by
`austria-to-tanzania`, `belgium-to-tanzania`, `finland-to-tanzania`,
`france-to-tanzania`, `ireland-to-tanzania`, `netherlands-to-tanzania`,
`eur-to-tzs` and five more. Every one of them shows the same quote table.

## The data cannot support the distinction

Field census across every `*quotes*.json` (3,268 sampled rows, all sources):

```
provider  providerSlug  providerType  sendCurrency  receiveCurrency
sendAmount  fee  exchangeRate  receiveAmount  deliveryEstimate
dateCollected  source  paymentMethod  deliveryMethod  markup
midMarketRate  payinMethod  payoutMethod  providerScore …
```

**There is no sending-country field in any source.** Not one. A quote is
identified by currency pair alone, so a EUR→TZS observation collected for a
French sender is indistinguishable from one for an Austrian sender. Whether a
provider actually serves Austria→Tanzania is not something this dataset knows.

### Correction (same day): method provenance is not recoverable either

The first version of this file said `paymentMethod` (2,868 rows) and
`deliveryMethod` (2,468) "DO exist and are not surfaced, so delivery-method
provenance is partially recoverable". **That was wrong, and the error was mine:
the census sampled only the first 400 rows per file, so those counts were the
sum of capped samples, not real coverage.**

Counted across all **19,787** quote rows:

| Field | Rows present | Coverage | Sources |
| --- | --- | --- | --- |
| `deliveryMethod` | 647 | **3.3%** | skyremit 448, ria 132, pandaremit 45, remitly 22 |
| `paymentMethod` | 672 | **3.4%** | same four |

The values are also not normalised — `Bank Deposit` alongside `BANK_DEPOSIT`,
`Debit Card` alongside `DEBIT` — and the single largest value is a bundle rather
than a method: `WeChat Pay / Alipay / Bank Transfer` accounts for 448 of the 672.

So method provenance is **not** partially recoverable. Plumbing the field through
the pipeline would deliver a value that is absent 96.7% of the time, from four
sources, in inconsistent casing. Country eligibility is not recoverable, and
neither is method.

### A related finding this turned up

`providers.ts` carries hand-maintained `paymentMethods[]` and `deliveryMethods[]`
arrays per provider — "Bank Deposit", "Cash Pickup", "Mobile Money" and so on.
Those are **editorial claims with no measured backing**: the observed method is
absent from 96.7% of quotes, so nothing in the pipeline can confirm or contradict
them. They are the same shape as the provider ranking claims cleared earlier
today — a hand-typed assertion standing where measurement is assumed. They have
not been audited.

## What follows

**This cannot be fixed by editing copy, and should not be papered over with
one.** Two honest options, in order of cost:

1. **Disclose it where the quotes render.** One sentence on the corridor page:
   quotes are collected by currency pair; we do not verify that every provider
   serves your specific sending country; confirm availability before committing.
   True today, invents nothing, and matches how the delivery-time basis was
   handled in `2ff16a34a`. **Not applied in this pass** — the corridor route file
   held another session's uncommitted work at the time, and committing it would
   have swept their change. Apply once that lands.
2. **Carry origin country through the pipeline.** The scrapers would need to
   record which sending country a quote was collected for, which is a scraper
   change per source, not a rendering change. Only worth doing if country-level
   eligibility is going to be claimed rather than disclosed away.

**It also compounds a known SEO risk.** 88% pair-sharing is the same shape as
the August 2026 finding that 331 near-duplicate EUR corridor pages (88-91%
similar) regrew the sitemap — twelve pages whose comparison table is identical
by construction are hard to argue as twelve distinct answers. The editorial
question of whether `austria-to-tanzania` deserves its own URL is separate from,
and larger than, the disclosure.
