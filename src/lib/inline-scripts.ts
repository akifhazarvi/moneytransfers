/**
 * Inline scripts injected into <head> by [locale]/layout.tsx, paired with
 * SHA-256 hashes that the CSP script-src directive in middleware.ts uses
 * to authorize them.
 *
 * Why hashes and not nonces:
 *
 * Per-request nonces require reading the request's `x-nonce` header from
 * the layout via `await headers()`. That dynamic API call forces every
 * page into Next.js dynamic rendering, which auto-injects
 * `Cache-Control: private, no-cache, no-store, must-revalidate` and
 * overrides the next.config.ts headers config. That signal contributed
 * to the May 2026 deindex collapse — Google reads `no-store, must-
 * revalidate` as "do not trust this response."
 *
 * Hashes are static: the layout can render statically, next.config.ts's
 * `stale-while-revalidate=300` actually reaches crawlers, and the CSP
 * stays strict (only these exact byte sequences run).
 *
 * Changing GTAG_INLINE or THEME_INLINE breaks the CSP — the corresponding
 * hash in csp-hashes must be regenerated. The script at
 * scripts/check-inline-script-hashes.ts verifies they're in sync at build.
 */

export const GTAG_INLINE = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
(function(){
  // Track everyone. No consent banner, no _ga cookie. Consent Mode is
  // granted by default so GA4 actually records standard events and shows
  // them in reports. client_storage:'none' tells GA4 to keep the client_id
  // in memory for the session instead of writing it to a cookie — so we
  // don't drop any _ga cookie on the user's browser.
  if(navigator.webdriver===true){window['ga-disable-G-HJH07QEJ30']=true;return;}
  var geo=(document.cookie.match(/(?:^|; )geo-country=([A-Z]{2})/)||[])[1]||'';
  // EU/UK/EEA/CH require consent — everyone else auto-granted.
  var euUk={'AT':1,'BE':1,'BG':1,'HR':1,'CY':1,'CZ':1,'DK':1,'EE':1,'FI':1,'FR':1,'DE':1,'GR':1,'HU':1,'IE':1,'IT':1,'LV':1,'LT':1,'LU':1,'MT':1,'NL':1,'PL':1,'PT':1,'RO':1,'SK':1,'SI':1,'ES':1,'SE':1,'GB':1,'IS':1,'LI':1,'NO':1,'CH':1};
  var storedConsent=(document.cookie.match(/(?:^|; )smc_consent=([^;]+)/)||[])[1]||'';
  var analyticsStorage=euUk[geo]?(storedConsent==='granted'?'granted':'denied'):'granted';
  gtag('consent','default',{
    'analytics_storage':analyticsStorage,
    'ad_storage':'denied',
    'ad_user_data':'denied',
    'ad_personalization':'denied'
  });
  gtag('js',new Date());
  // EU/UK users start with analytics_storage:denied — suppress the automatic
  // pageview so we don't fire it while consent is blocked. CookieConsentBanner
  // fires a manual page_view event after the user clicks Accept.
  var sendPV=(analyticsStorage==='granted');
  var cfg={send_page_view:sendPV,client_storage:'none'};
  if(geo){cfg.country=geo;gtag('set','user_properties',{geo_country:geo});}
  // AI-search referral attribution — ChatGPT, Perplexity, Copilot etc strip
  // the Referer header, so GA4 logs source='chatgpt.com' with medium=(not set)
  // and dumps those sessions into 'Unassigned'. Detect the host explicitly
  // and inject campaign params so the very first pageview lands in Referral.
  try{
    var ref=document.referrer||'';
    var refHost='';try{refHost=ref?new URL(ref).hostname.toLowerCase():'';}catch(e){}
    var aiHosts={'chatgpt.com':'chatgpt','chat.openai.com':'chatgpt','perplexity.ai':'perplexity','www.perplexity.ai':'perplexity','copilot.microsoft.com':'copilot','gemini.google.com':'gemini','claude.ai':'claude','you.com':'you','phind.com':'phind'};
    var aiSource=(refHost && aiHosts[refHost]!==undefined)?aiHosts[refHost]:null;
    var stored=null;try{stored=sessionStorage.getItem('first_ai_src');}catch(e){}
    if(aiSource){try{sessionStorage.setItem('first_ai_src',aiSource);}catch(e){}}
    var src=aiSource||stored;
    if(src){
      cfg.campaign_source=src;
      cfg.campaign_medium='referral';
      cfg.campaign_name='ai_search';
      gtag('set','user_properties',{ai_referrer:src});
    }
  }catch(e){}
  gtag('config','G-HJH07QEJ30',cfg);
  var loaded=false;
  function loadGA(){
    if(loaded)return;loaded=true;
    var s=document.createElement('script');
    s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-HJH07QEJ30';
    document.head.appendChild(s);
    evts.forEach(function(e){removeEventListener(e,loadGA,opts)});
  }
  var evts=['pointerdown','keydown','scroll','touchstart'];
  var opts={passive:true,once:true};
  evts.forEach(function(e){addEventListener(e,loadGA,opts)});
  setTimeout(loadGA,4000);
})();`;

export const THEME_INLINE = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`;

// SHA-256 hashes of the strings above, base64-encoded. Used by middleware
// CSP. Verified by scripts/check-inline-script-hashes.ts at build time.
export const GTAG_INLINE_SHA256 = "qPXjxVNgJdwOQjpaoV0oAfKE/LkwfwRiGUZdEzQZ48I=";
export const THEME_INLINE_SHA256 = "O2lh+6ke8O9D5iLJMhLaeqDtYz9aD/Bxt91b6GnUyRI=";
