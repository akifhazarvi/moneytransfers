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
  // Persistent first-party GA4 cookie (the _ga client_id) so the same human is
  // counted as ONE user across page loads and return visits. Previously
  // client_storage:'none' kept the id in memory only, which re-minted a new
  // client_id constantly and inflated the user count (787 users / 31 sessions).
  // Cookies are now allowed; consent is geo-gated (banner for UK/EU/EEA/CH).
  if(navigator.webdriver===true){window['ga-disable-G-HJH07QEJ30']=true;return;}
  var geo=(document.cookie.match(/(?:^|; )geo-country=([A-Z]{2})/)||[])[1]||'';
  var consentCountries={AT:1,BE:1,BG:1,HR:1,CY:1,CZ:1,DK:1,EE:1,FI:1,FR:1,DE:1,GR:1,HU:1,IE:1,IT:1,LV:1,LT:1,LU:1,MT:1,NL:1,PL:1,PT:1,RO:1,SK:1,SI:1,ES:1,SE:1,GB:1,IS:1,LI:1,NO:1,CH:1};
  // Honor a stored choice (smc_consent) if present; else default by geo.
  // UK/EU/EEA/CH default to 'denied' until the CookieConsentBanner grants it;
  // everyone else is 'granted' so analytics + the _ga cookie work immediately.
  var stored=(document.cookie.match(/(?:^|; )smc_consent=(granted|denied)/)||[])[1]||'';
  var analytics=stored||(consentCountries[geo]?'denied':'granted');
  gtag('consent','default',{
    'analytics_storage':analytics,
    'ad_storage':'denied',
    'ad_user_data':'denied',
    'ad_personalization':'denied'
  });
  gtag('js',new Date());
  // Fire the landing pageview. For UK/EU users defaulting to 'denied', GA4
  // buffers/drops it; CookieConsentBanner re-sends it after they accept.
  var cfg={send_page_view:true};
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

// Interstitial Continue-click tracker (injected ONLY into the /go + /out
// interstitial HTML, not the app). The interstitial is standalone HTML with no
// gtag, so a real click on Continue (or a cross-sell row) is beaconed to
// /api/track/continue, which relays `interstitial_continue` to GA4. This is the
// clean "genuine human proceeded to a provider" conversion — distinct from the
// raw affiliate_redirect count, which fires on every hit incl. bots/gated.
//
// It reads provider/from/to/src/ai_src/cid off the clicked link's URL and off
// the page's own /go URL so attribution matches the redirect. sendBeacon is
// fire-and-forget and survives the navigation, so it never delays the click.
// Same-origin POST → allowed by connect-src 'self'. No hash needed:
// script-src includes 'unsafe-inline'.
export const CONTINUE_INLINE = `(function(){
  function param(u,k){try{return new URL(u,location.href).searchParams.get(k)||''}catch(e){return''}}
  function cid(){try{var m=document.cookie.match(/_ga=([^;]+)/);if(m){var p=m[1].split('.');if(p.length>=4)return p[2]+'.'+p[3]}}catch(e){}return''}
  function beacon(href){
    try{
      var q='provider='+encodeURIComponent(param(href,'provider')||(href.match(/\\/(?:go|out)\\/([^/?#]+)/)||[])[1]||'');
      ['from','to','src','ai_src'].forEach(function(k){var v=param(href,k);if(v)q+='&'+k+'='+encodeURIComponent(v)});
      var c=param(href,'cid')||cid();if(c)q+='&cid='+encodeURIComponent(c);
      navigator.sendBeacon('/api/track/continue?'+q);
    }catch(e){}
  }
  document.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('a.btn,a.row'):null;
    if(a&&a.getAttribute('href'))beacon(a.getAttribute('href'));
  },true);
})();`;

// Microsoft Clarity — session recordings + heatmaps (project x2rwjue57c). The
// stock async loader, verbatim, so the SHA-256 below stays stable. Clarity is a
// behavioral tool, not an ad tag: it needs no consent 'default' wiring and fires
// on every rendered HTML page (including the /go + /out interstitials, which
// embed the SAME string). Requires clarity.ms in the middleware CSP script-src,
// connect-src (beacon) and img-src (1x1 pixel). Editing this string breaks CSP —
// regenerate CLARITY_INLINE_SHA256 (scripts/check-inline-script-hashes.ts).
export const CLARITY_INLINE = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","x2rwjue57c");`;

// SHA-256 hashes of the strings above, base64-encoded. Used by middleware
// CSP. Verified by scripts/check-inline-script-hashes.ts at build time.
export const GTAG_INLINE_SHA256 = "vFs8yu5/dujeSSGQ8vbhX1jCd1iZFizSLx6JM97qj8M=";
export const THEME_INLINE_SHA256 = "O2lh+6ke8O9D5iLJMhLaeqDtYz9aD/Bxt91b6GnUyRI=";
export const CLARITY_INLINE_SHA256 = "iFSmoMFj82SS8nkpxuxb66/9ZMn1PaeAyBLnSLnjI+o=";
