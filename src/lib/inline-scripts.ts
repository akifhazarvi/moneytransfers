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

// Basic Consent Mode: no Google request or pre-consent event replay.
// Worldwide explicit opt-in also covers missing/stale geolocation.
export const GTAG_INLINE = `(function(){
  var id='G-HJH07QEJ30',host=location.hostname,started=false,loaded=false;
  var production=host==='sendmoneycompare.com'||host.slice(-21)==='.sendmoneycompare.com';
  function allowed(){return !navigator.globalPrivacyControl&&navigator.doNotTrack!=='1'&&/(?:^|;\\s*)smc_consent=v2\\.granted\\.(?:granted|denied)(?:;|$)/.test(document.cookie);}
  window.dataLayer=window.dataLayer||[];
  function push(){window.dataLayer.push(arguments);}
  window.gtag=function(){
    if(arguments[0]==='consent'){push.apply(null,arguments);return;}
    if(!allowed()||navigator.webdriver===true||!production)return;
    if(!started)load();
    push.apply(null,arguments);
  };
  push('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  function load(){
    if(!allowed()||!production||navigator.webdriver===true)return;
    if(!started){
      started=true;
      push('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
      push('js',new Date());
      var internal=(location.search.match(/[?&]smc_internal=([01])/)||[])[1];
      if(internal)document.cookie='smc_internal='+internal+';path=/;max-age='+(internal==='1'?31536000:0)+';SameSite=Lax;Secure';
      if(/(?:^|; )smc_internal=1/.test(document.cookie))push('set',{traffic_type:'internal'});
      try{
        var h=document.referrer?new URL(document.referrer).hostname.toLowerCase():'';
        var ai={'chatgpt.com':'chatgpt','chat.openai.com':'chatgpt','perplexity.ai':'perplexity','www.perplexity.ai':'perplexity','copilot.microsoft.com':'copilot','gemini.google.com':'gemini','claude.ai':'claude','you.com':'you','phind.com':'phind'};
        if(ai[h])sessionStorage.setItem('first_ai_src',ai[h]);
        var src=sessionStorage.getItem('first_ai_src');if(src)push('set','user_properties',{ai_referrer:src});
        var dm=navigator.standalone===true||matchMedia('(display-mode: standalone)').matches?'standalone':matchMedia('(display-mode: minimal-ui)').matches?'minimal-ui':'browser';
        push('set',{display_mode:dm});
        if(dm!=='browser')push('set','user_properties',{app_display_mode:dm});
        var geo=(document.cookie.match(/(?:^|; )geo-country=([A-Z]{2})/)||[])[1];
        if(geo)push('set','user_properties',{geo_country:geo});
      }catch(e){}
      // Exactly one current-page view when consent becomes available.
      push('config',id,{send_page_view:true,page_location:location.href,page_title:document.title,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:15552000});
    }
    if(loaded)return;loaded=true;
    var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.appendChild(s);
  }
  function update(){
    window['ga-disable-'+id]=!allowed();
    if(allowed())load();
    else if(started)push('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  }
  window['ga-disable-'+id]=!allowed()||!production||navigator.webdriver===true;
  addEventListener('smc:consent-changed',update);
  var review=/\\/(?:go|out)\\//.test(location.pathname);
  var events=review?['pointerdown','pointermove','keydown','touchstart','wheel']:['pointerdown','keydown','scroll','touchstart'];
  events.forEach(function(e){addEventListener(e,load,{passive:true,once:true});});
  if(!review)setTimeout(load,4000);
})();`;

export const THEME_INLINE = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`;

// Replay is separately opt-in; advertising consent always remains denied.
export const CLARITY_INLINE = `(function(w,d){
  var loaded=false,host=location.hostname;
  function allowed(){return !navigator.globalPrivacyControl&&navigator.doNotTrack!=='1'&&/(?:^|;\\s*)smc_consent=v2\\.(?:granted|denied)\\.granted(?:;|$)/.test(d.cookie);}
  function update(){
    if(navigator.webdriver===true||(host!=='sendmoneycompare.com'&&host.slice(-21)!=='.sendmoneycompare.com'))return;
    if(!allowed()){if(loaded)w.clarity('consentv2',{analytics_Storage:'denied',ad_Storage:'denied'});return;}
    if(loaded)return;
    loaded=true;
    w.clarity=w.clarity||function(){(w.clarity.q=w.clarity.q||[]).push(arguments);};
    w.clarity('consentv2',{analytics_Storage:'granted',ad_Storage:'denied'});
    var s=d.createElement('script');s.async=true;s.src='https://www.clarity.ms/tag/x2rwjue57c';d.head.appendChild(s);
  }
  w.addEventListener('smc:consent-changed',update);
  ['pointermove','pointerdown','touchstart','scroll','keydown'].forEach(function(e){w.addEventListener(e,update,{passive:true,once:true});});
})(window,document);`;

// SHA-256 hashes of the strings above, base64-encoded. Used by middleware
// CSP. Verified by scripts/check-inline-script-hashes.ts at build time.
export const GTAG_INLINE_SHA256 = "AnYM+0Tj4RVrguVPWPcvdSW9Axv5auOKtaZYL/LATYc=";
export const THEME_INLINE_SHA256 = "O2lh+6ke8O9D5iLJMhLaeqDtYz9aD/Bxt91b6GnUyRI=";
export const CLARITY_INLINE_SHA256 = "NoQUAYRPvHlcc+B+FtNVIvwAPmP8xKQLCeaSKKCxR7E=";

// PWA install capture. Chrome/Edge/Samsung fire `beforeinstallprompt` once the
// manifest is parsed, which can be before React hydrates. A listener added in a
// component effect misses it, and then there is no install button to offer.
// This runs at parse time, stashes the event on window.__smcInstallPrompt and
// announces it with `smc:installable`, which src/lib/pwa.ts subscribes to.
// preventDefault() suppresses Android's own mini-infobar, which docks at the
// bottom of the screen on top of StickyBestCTA's Send button. `appinstalled`
// records the install so the prompt is not offered again in the browser tab,
// and leaves window.__smcInstalled for PwaManager: an install finished from
// the address-bar icon can land before hydration, and CI caught that event
// being dropped (no listener yet, so no `pwa_installed`).
// Editing this string breaks CSP — regenerate PWA_INLINE_SHA256.
export const PWA_INLINE = `(function(){try{addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__smcInstallPrompt=e;dispatchEvent(new Event('smc:installable'))});addEventListener('appinstalled',function(){window.__smcInstallPrompt=null;window.__smcInstalled=1;try{localStorage.setItem('smc_pwa_installed','1')}catch(e){}dispatchEvent(new Event('smc:installed'))})}catch(e){}})()`;
export const PWA_INLINE_SHA256 = "Q9LfnkzSrEQk1WT5KVSpaKKj371Kcti2qHhFZmfsLfY=";
