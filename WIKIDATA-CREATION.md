# Wikidata Item Creation — SendMoneyCompare

Copy-paste cheat-sheet. ~20 min. Free. No Wikipedia article needed.
All values below match the Organization schema in `src/app/[locale]/layout.tsx` 1:1.
Verified 2026-06-21: **no existing Wikidata item** for this brand → you're creating fresh.

---

## Step 0 — Account
1. https://www.wikidata.org → **Create account** (top right).
2. Username = **your real name (Akif Hazarvi)**, NOT the brand. Brand-named
   accounts get flagged and items deleted as promotional.
3. Confirm email.

## Step 1 — Create the item
Go to: **https://www.wikidata.org/wiki/Special:NewItem**

| Field | Paste this |
|---|---|
| Language | `en` |
| Label | `SendMoneyCompare` |
| Description | `international money transfer comparison website` |

Click **Create** → note your **Q-ID** (e.g. `Q1234567`). Send it to Claude to wire the `sameAs`.

After creating, add aliases (under the label, "also known as"):
```
Send Money Compare
SMC
sendmoneycompare.com
```

## Step 2 — Add statements
Click **+ add statement** for each row. Type the property name in the box; it
autocompletes to the P-number.

| Property | Value to enter |
|---|---|
| `instance of` (P31) | `website` |
| `official website` (P856) | `https://sendmoneycompare.com` |
| `inception` (P571) | `2024` |
| `country` (P17) | `United States of America` |
| `headquarters location` (P159) | `Denver` (Colorado, US) |
| `Crunchbase organization ID` (P2088) | `send-money-compare` |
| `Trustpilot company ID` (P9899) | `sendmoneycompare.com` |
| `founded by` (P112) | `Akif Hazarvi` *(see note)* |

> **founded by note:** Wikidata wants this to link to a *person item*. If no
> Wikidata item exists for "Akif Hazarvi", either skip this statement (fine) or
> create a minimal person item first (Label `Akif Hazarvi`, Description
> `founder of SendMoneyCompare`) and link it. Skipping is the low-effort path.

## Step 3 — Reference EVERY statement (this is what prevents deletion)
Under each statement → **add reference** → property `reference URL` (P854) → paste:

| For these statements | Use this reference URL |
|---|---|
| inception, country, headquarters, founded by | `https://www.crunchbase.com/organization/send-money-compare` |
| Trustpilot company ID | `https://www.trustpilot.com/review/sendmoneycompare.com` |
| official website, instance of | `https://sendmoneycompare.com` (own site OK for these two only) |

**Rule:** never reference your own site for factual claims (inception, country,
founders) — Wikidata wants third-party corroboration. Crunchbase + Trustpilot
are your two strongest, both already public.

## Step 4 — (optional) external IDs that feed the Knowledge Graph
These help Google link the entity. Add as statements if available:
- `LinkedIn company ID` (P4264) → `sendmoneycompare`
- `X username` (P2002) → `sendmoneycompare`
- `Facebook ID` (P2013) → `sendmoneycompare`

(These mirror your existing `sameAs` array, closing the entity graph.)

---

## The 3 rules that keep it alive
1. **Notability** — Wikidata's bar is "a serious, publicly available reference."
   Your Crunchbase + Trustpilot entries clear it. No press coverage required.
2. **Neutral description** — factual only. No "best", "trusted", "leading".
3. **Reference everything** — unreferenced promotional items are what get deleted.

## When done
Paste the **Q-ID** to Claude. It will:
1. Add `https://www.wikidata.org/wiki/Q…` to the Organization `sameAs` array in
   `src/app/[locale]/layout.tsx` (closes the loop both directions).
2. Add the Wikidata ID as a schema `identifier` if useful.

---

### Reference: your exact org facts (from layout.tsx, keep consistent)
- Name: **SendMoneyCompare** · Aliases: Send Money Compare, SMC
- Founded: **2024** · HQ: **Denver, CO, US**
- Founders: Akif Hazarvi (Founder & Editor-in-Chief), Ahsan Mukhtar (Co-founder),
  Awais Imran (Content Writer & Reviews Editor)
- Existing sameAs: Trustpilot, Crunchbase, LinkedIn (company), X, Facebook, GitHub
