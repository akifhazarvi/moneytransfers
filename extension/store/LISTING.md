# Store listing: copy and paste

For the Chrome Web Store developer dashboard (https://chrome.google.com/webstore/devconsole)
and Microsoft Edge Add-ons (https://partner.microsoft.com/dashboard/microsoftedge). Same zip
for both: `extension/sendmoneycompare-extension-<version>.zip` (`npm run build:extension`).

Wording follows the site's claim rules: no "cheapest", no scores, no provider counts.

## Store listing tab

**Name** (from the manifest): SendMoneyCompare: Transfers, Rates & Converter

**Summary** (from the manifest, 132 max): See what money transfer providers pay out for your amount, convert at the mid-market rate, follow rate charts and set rate alerts.

**Category:** Tools · **Language:** English

**Description:**

```
Sending money abroad? See what each provider pays out before you choose.

COMPARE
Type an amount and see what each money transfer provider pays out after its fee and exchange-rate markup, in payout order. The same comparison as sendmoneycompare.com: tap any provider for its rate, fee, markup and delivery time, and Send takes you to it.

ALREADY ON A PROVIDER'S SITE?
Open SendMoneyCompare on Wise, Remitly, Western Union or another provider's page. It reads the amount you entered there and shows how that provider compares for it.

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

No account. Usage sharing is optional and off until you turn it on. To show prices the extension asks sendmoneycompare.com for public quotes and rates, sending only the currencies and amount you compare. Your watchlist and alerts stay in your browser.

Some Send buttons are affiliate links: we may earn a commission when you use a provider. It never changes the order.
```

**Graphic assets** (all in `extension/store/`):
- Store icon 128×128: `store-icon-128.png`
- Screenshots 1280×800, in this order: `screenshot-1-compare.png`, `screenshot-2-here.png`, `screenshot-3-convert.png`, `screenshot-4-offers.png`, `screenshot-5-rates.png`
- Small promo tile 440×280: `promo-tile-440x280.png`
- Marquee promo tile 1400×560: `marquee-1400x560.png`

**Official URL:** https://sendmoneycompare.com (the dashboard verifies it through Search Console)
**Homepage URL:** https://sendmoneycompare.com/
**Support URL:** https://sendmoneycompare.com/contact

## Privacy practices tab

**Single purpose:**

```
Help people sending money abroad compare what money transfer providers pay out, and follow the exchange rates that decide it: a provider comparison, a mid-market currency converter, rate charts and rate alerts, all from sendmoneycompare.com's data.
```

**Permission justifications:**

| Permission | Justification to paste |
|---|---|
| activeTab | When the user opens the extension on a money transfer provider's page, it reads the amount and currencies shown there so it can compare that transfer. Only after the user clicks the extension, only on that tab. |
| scripting | Runs the read-only function that finds the amount and currencies on the provider page the user opened the extension on (granted through activeTab). Nothing is changed on the page. |
| storage | Keeps the user's last comparison, converter currencies, watchlist, alerts and settings, and recent answers so the popup opens instantly and works offline. |
| alarms | Checks exchange rates about every 15 minutes to fire the user's rate alerts and update the optional rate on the toolbar icon. |
| contextMenus | Adds "Compare sending …" and "Convert …" when the user right-clicks a selected amount. |
| notifications (optional) | Shows a notification when a rate alert the user set is reached. Requested only when the user sets their first alert. |

**Remote code:** No, I am not using remote code. (All JavaScript is in the package; the extension fetches JSON data only.)

**Data usage:** tick **User activity** only, and describe it as: "Only if the user turns on 'Share anonymous usage' (off by default): which tab they opened, which route they compared and which provider they chose, with a random ID for the browser, sent to sendmoneycompare.com and forwarded to Google Analytics." Nothing else is collected: quote requests carry only currencies and an amount, with no identifier or cookies, and provider pages are read only locally. Then certify all three:
- I do not sell or transfer user data to third parties, outside of the approved use cases
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- I do not use or transfer user data to determine creditworthiness or for lending purposes

**Privacy policy URL:** https://sendmoneycompare.com/privacy-policy (it has a "SendMoneyCompare browser extension" section)

## Distribution tab

Visibility: Public · Regions: all.

## Account

The developer account is a Google account plus a one-time US$5 registration fee. Use the
account that owns sendmoneycompare.com in Search Console, so the Official URL verifies.
