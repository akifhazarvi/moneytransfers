# Provider handoff audit — 2026-10-17

Review page and TapTap offer remain unchanged. Changes are local, not deployed.

## Confirmed and corrected

- Remitly's public calculator reads `amount` (send amount by default). Tested USD → INR with 750 directly and through Impact; the input displayed 750.00. Added the parameter inside Impact's `u` destination, preserving campaign 10408 and `subId1`.
- Partnerize consumes the trailing `/clickref:` when it follows `/destination:`. The old live redirect appended `/clickref:prefill_audit` to the destination's final query value. Moving clickref before destination eliminated the contamination. Applied to Instarem and the identical Wise builder.
- Instarem ignored `destination_currency=PHP` on its home page and displayed INR. `/en-us/send-money-to-philippines/?country_code=US` selected USD → PHP; `country_code=GB` selected GBP → PHP. The UK Pakistan page also selected GBP → PKR.
- Checked 26 Instarem destination pages for HTTP status and initial calculator currencies. Added the 25 that matched: INR, PHP, PKR, BDT, NPR, LKR, VND, CNY, IDR, MYR, THB, AUD, CAD, SGD, HKD, NZD, GBP, NGN, KES, GHS, UGX, BRL, COP, MXN, PEN. Japan returned 200 but selected USD, so JPY is excluded. Other corridors retain the existing home-page fallback. This is not a verification of every sending-country/receiving-country combination.

## Unresolved provider-side behavior

Instarem's amount stayed at 1,000 with `source_amount=750`, `amount=750`, and `send_amount=750`. Its public script initializes the calculator from server-rendered inputs. We now send the requested amount as `smc_amount` metadata, without implying it prefills the calculator. Instarem needs to provide a supported amount-prefill URL; do not claim full prefill until a browser test passes.

Partnerize returned a generated `clickref` and the configured affiliate campaign on Instarem's landing URL. This verifies the redirect, not credited commissions or publisher sub-ID reporting.

Impact reached the intended Remitly page and added affiliate campaign parameters, but `irclickid` was empty in the automated tests. It is unknown whether this is automated-traffic handling or a wider attribution issue. Do not assert that commissions are correctly attributed based on this test. Check a normal human click against Impact's click report and ask Impact/Remitly to confirm campaign 10408 is active for the relevant sending markets and conversion event.

The review page preserves from/to/amount/src/click_id on Continue. Existing clicks without a supplied click_id can receive different minted IDs on the initial visit and Continue; the outgoing ID is the one relevant to reconciliation. Existing concurrent tracking edits were left intact.

## Partner questions (draft only; not sent)

Instarem: What supported affiliate landing URL preserves the sending country, receiving currency, and send amount? Your home page ignored destination_currency=PHP and source_amount=750, while the Philippines page selected PHP but retained a 1,000 send amount. Please also confirm the publisher clickref appears in Partnerize reporting when placed before destination.

Remitly/Impact: Please verify campaign 10408 and publisher 7718824 are active and eligible for our sending markets. Our automated redirect reached the correct page but returned an empty irclickid. Is that expected for automated tests? Which conversion event and customer eligibility rules determine commission, and can a human test click with subId1 be reconciled in your reporting?
