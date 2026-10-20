# Store listing: copy and paste

For the Chrome Web Store developer dashboard (https://chrome.google.com/webstore/devconsole)
and Microsoft Edge Add-ons (https://partner.microsoft.com/dashboard/microsoftedge). Same zip
for both: `extension/sendmoneycompare-extension-<version>.zip` (`npm run build:extension`).

Wording follows the site's claim rules: no "cheapest", no scores, no provider counts.

## Store listing tab

**Name** (from the manifest): SendMoneyCompare: Transfers, Rates & Converter

**Summary** (from the manifest, 132 max): Know if a money transfer is a good deal: compare what providers pay out, convert at the mid-market rate, and set rate alerts.

**Category:** Tools · **Language:** English

**Description:**

```
Sending money abroad? Know if it's a good deal before you pay.

PRICE CHECK ON PROVIDER SITES
On Wise, Remitly, Western Union and other money transfer providers, SendMoneyCompare reads the amount and currencies in the provider's own calculator and tells you, as you type, whether it's a good deal, and who pays more for the same transfer. Turn it on with one click; it never runs on banks' sites and never edits provider forms or existing links.

COMPARE
Type an amount and see what each money transfer provider pays out after its fee and exchange-rate markup, in payout order. The same comparison as sendmoneycompare.com: tap any provider for its rate, fee, markup and delivery time, and Send takes you to it.

CONVERT SEVERAL CURRENCIES AT ONCE
Add the currencies you use and type in any of them; the rest convert at the mid-market rate. See each one's change over 1 day, 1 week, 15 days or 30 days, and a year of rate history for any pair.

OFFERS
First-transfer rates taken from providers' own quotes, and sign-up offers we check on each provider's site, with the date we checked.

RATES AND ALERTS
Follow currency pairs, see the trend at a glance, put a rate on the toolbar icon, and get a notification when a pair reaches the rate you choose.

ALSO
• Select an amount on any page, right-click, and compare or convert it.
• Type "smc 500 gbp inr" in the address bar.
• See what other senders on sendmoneycompare.com are comparing right now.

No account. Usage sharing is optional and off until you turn it on. To show prices the extension asks sendmoneycompare.com for public quotes and rates, sending only the currencies and amount you compare. Your watchlist and alerts use your browser's sync storage and may sync to other browsers signed in to the same account.

Some Send buttons are affiliate links: we may earn a commission when you use a provider. It never changes the order.
```

**Graphic assets** (all in `extension/store/`):
- Store icon 128×128: `store-icon-128.png`
- Screenshots 1280×800, in this order: `screenshot-1-compare.png`, `screenshot-2-price-check.png`, `screenshot-3-convert.png`, `screenshot-4-offers.png`, `screenshot-5-rates.png`
- Small promo tile 440×280: `promo-tile-440x280.png`
- Marquee promo tile 1400×560: `marquee-1400x560.png`

**Official URL:** https://sendmoneycompare.com (the dashboard verifies it through Search Console)
**Homepage URL:** https://sendmoneycompare.com/
**Support URL:** https://sendmoneycompare.com/contact

## Privacy practices tab

**Single purpose:**

```
Help people sending money abroad know whether a transfer is a good deal: compare what money transfer providers pay out (in the popup and, if the user turns it on, on providers' own sites), and follow the exchange rates that decide it with a mid-market converter, rate charts and rate alerts. All data comes from sendmoneycompare.com.
```

**Permission justifications:**

| Permission | Justification to paste |
|---|---|
| activeTab | When the user opens the extension on a money transfer provider's page, it reads the amount and currencies shown there so it can compare that transfer. Only after the user clicks the extension, only on that tab. |
| scripting | Runs the read-only function that finds the amount and currencies on the provider page the user opened the extension on (granted through activeTab), and, only if the user turns on price checks and grants those sites, registers the price-check script on the money transfer provider sites they granted. Nothing on the page is changed. |
| storage | Keeps the user's last comparison, converter currencies, watchlist, alerts and settings, and recent answers so the popup opens instantly and works offline. |
| alarms | Checks exchange rates about every 15 minutes to fire the user's rate alerts and update the optional rate on the toolbar icon. |
| contextMenus | Adds "Compare sending …" and "Convert …" when the user right-clicks a selected amount. |
| notifications (optional) | Shows a notification when a rate alert the user set is reached. Requested only when the user sets their first alert. |
| Host permissions (optional): 30 money transfer provider sites (wise.com, remitly.com, westernunion.com, …) | Requested only when the user turns on "Check prices on provider sites". On those sites a small panel reads the amount and currencies in the provider's own calculator and shows how that provider compares with others for the same transfer. Read-only: it never edits provider forms or existing links and adds its own clearly labelled comparison panel and Send links. Never requested for banks. |

**Remote code:** No, I am not using remote code. (All JavaScript is in the package; the extension fetches JSON data only.)

**Data usage:** tick **Website content** ("With the user's permission, the amount and currencies shown in a money transfer provider's calculator are sent to sendmoneycompare.com to fetch quotes for that transfer; nothing else from the page") and **User activity**, described as: "Only if the user turns on 'Share usage analytics' (off by default): which tab they opened, which route they compared and which provider they chose, with a random ID for the browser, sent to sendmoneycompare.com and forwarded to Google Analytics." Nothing else is collected: quote requests carry only currencies and an amount, with no identifier or cookies, and provider pages are read only locally. Then certify all three:
- I do not sell or transfer user data to third parties, outside of the approved use cases
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- I do not use or transfer user data to determine creditworthiness or for lending purposes

**Privacy policy URL:** https://sendmoneycompare.com/privacy-policy (it has a "SendMoneyCompare browser extension" section)

## Distribution tab

Visibility: Public · Regions: all.

## Account

The developer account is a Google account plus a one-time US$5 registration fee. Use the
account that owns sendmoneycompare.com in Search Console, so the Official URL verifies.

# Microsoft Edge Add-ons (Partner Center)

Same zip as Chrome. Microsoft re-signs it, so the Edge copy gets its own extension ID
and `update_url` (edge.microsoft.com); `lib/analytics.js` reads that to tag events
`ext_browser=edge` and links `utm_source=edge-extension`, and `lib/links.js` sends
"Rate us" to the Edge listing. Nothing in the package changes per store.

## Account

https://partner.microsoft.com/dashboard/microsoftedge/overview. No fee. It needs a
personal Microsoft account (Outlook/Hotmail/Live) or sign-in with GitHub; work and
school accounts are refused. Choose **Individual**: Company means business
verification (days to weeks, calls to a company approver) and cannot be switched
back. Country and account type are fixed after enrolment. Publisher display name
(≤50 characters): SendMoneyCompare.

## Pages, in Partner Center's order

1. **Packages:** Create new extension → upload `extension/sendmoneycompare-extension-<version>.zip`.
2. **Availability:** Public · all markets.
3. **Properties:** Category **Productivity** · Website https://sendmoneycompare.com/ ·
   Support https://sendmoneycompare.com/contact · Mature content: unticked.
4. **Privacy:** same five sections as Chrome's Privacy practices tab above: paste
   the single purpose, each permission justification, "No, I am not using remote
   code", the same data-usage boxes and certifications, and the privacy policy URL.
5. **Store listings → English → Edit details:**
   - Name and short description come from the manifest (read-only here).
   - Description: the one above (Edge wants 250–10,000 characters). Don't use
     "Generate with AI": its text would not follow the claim rules.
   - Extension logo: `store-icon-300.png` (1:1, 300×300 recommended, 128 minimum).
   - Small promotional tile `promo-tile-440x280.png`, large promotional tile
     `marquee-1400x560.png`.
   - Screenshots: the same five, same order (Edge takes up to 6).
   - Search terms (≤7 terms, ≤30 characters each, ≤21 words):
     `money transfer`, `currency converter`, `exchange rate`, `send money abroad`,
     `remittance`, `rate alert`, `mid-market rate`
6. **Publish → Notes for certification:**

```
No account or sign-in needed. All data comes from public JSON endpoints at https://sendmoneycompare.com/api/ext/v1/.
To test: click the toolbar icon. Compare shows what providers pay out for an amount; Convert, Offers and Rates are the other tabs.
Price check (optional host permissions): on the welcome page or in Settings, turn on "Check prices on provider sites" and grant the sites, then open https://wise.com/us/send-money/send-money-to-india. A panel reads the amount and currencies and compares the transfer. It changes nothing on the page.
Rate alerts ask for the notifications permission only when the first alert is set.
Send buttons open https://sendmoneycompare.com/go/<provider>, which redirects to the provider; some are affiliate links, disclosed in Settings.
```

Review takes up to seven business days; the status then reads **In the Store**.
The listing URL is on the extension's Overview page in Partner Center.
