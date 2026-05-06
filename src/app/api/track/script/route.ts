/**
 * Purpose: GET /api/track/script?v=VARIANT_ID — Returns tracking JavaScript snippet
 * Dependencies: None (pure response generation)
 * Related: /api/track (POST endpoint), /api/events/capi
 *
 * WHY: Serves a lightweight <2KB tracking script that auto-captures pageviews,
 *      scroll depth, CTA clicks, and form submissions. No cookies — uses
 *      localStorage for session ID. Privacy-first by design.
 *
 * USAGE: <script src="/api/track/script?v=VARIANT_ID&debug=true" defer></script>
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ─── Query Params Schema ─────────────────────────────────────────────────────

const scriptParamsSchema = z.object({
  v: z.string().uuid({ message: 'Missing ?v=VARIANT_ID query parameter' }),
  debug: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
});

// ─── Tracking Script Template ────────────────────────────────────────────────
// WHY: Template literal with placeholders — keeps script readable here,
//      gets compiled to minified output at response time.
//      All strings use single quotes to avoid escaping in the template.

function generateScript(variantId: string, debug: boolean): string {
  // WHY: Debug flag injected as literal true/false — dead code eliminated by
  //      browser JS engine when false, zero overhead in production.
  const debugFlag = debug ? 'true' : 'false';

  return `!function(){'use strict';
var V='${variantId}',D=${debugFlag},K='ecom_sid',
API='/api/track',SCROLL=[25,50,75,100],
SID=(function(){try{var s=localStorage.getItem(K);if(s)return s;
s=crypto.randomUUID?crypto.randomUUID():'x-'+Date.now()+'-'+Math.random().toString(36).slice(2);
localStorage.setItem(K,s);return s}catch(e){return 'ns-'+Date.now()}})(),
sent={};

function send(e,d){
  var p={variantId:V,event:e,sessionId:SID,data:d,url:location.href,
  referrer:document.referrer,userAgent:navigator.userAgent};
  if(D)console.log('[track]',e,d||'');
  var b=new Blob([JSON.stringify(p)],{type:'application/json'});
  if(navigator.sendBeacon){navigator.sendBeacon(API,b)}else{
  var r=new XMLHttpRequest();r.open('POST',API,true);
  r.setRequestHeader('Content-Type','application/json');r.send(JSON.stringify(p))}
}

function mark(k){if(sent[k])return true;sent[k]=1;return false}

// pageview on load
send('pageview',{timeOnPage:0});

// scroll depth tracking
var tracked=0;
function onScroll(){
  var pct=Math.round((window.scrollY/(document.documentElement.scrollHeight-window.innerHeight))*100);
  for(var i=0;i<SCROLL.length;i++){
    if(pct>=SCROLL[i]&&tracked<SCROLL[i]){
      tracked=SCROLL[i];
      var key='scroll:'+SCROLL[i];
      if(!mark(key))send('scroll',{scrollDepth:SCROLL[i]});
    }
  }
}
window.addEventListener('scroll',onScroll,{passive:true});

// CTA click tracking — data-track="cta" or data-track="cta-BLOCKID"
document.addEventListener('click',function(e){
  var el=e.target.closest('[data-track]');
  if(!el)return;
  var t=el.getAttribute('data-track');
  if(t&&t.startsWith('cta')){
    var bid=el.getAttribute('data-block-id')||el.id||t;
    var key='cta:'+bid;
    if(!mark(key))send('cta_click',{blockId:bid,elementId:el.id});
  }
},true);

// form submission tracking
document.addEventListener('submit',function(e){
  var f=e.target;
  if(!f||f.tagName!=='FORM')return;
  var bid=f.getAttribute('data-block-id')||f.id||'form';
  send('form_submit',{blockId:bid,elementId:f.id});
},true);

// time on page — send before unload
var start=Date.now();
function onUnload(){
  var sec=Math.round((Date.now()-start)/1000);
  send('pageview',{timeOnPage:sec});
}
window.addEventListener('beforeunload',onUnload);
window.addEventListener('visibilitychange',function(){
  if(document.visibilityState==='hidden')onUnload();
});
}();`;
}

// ─── GET Handler ─────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const parsed = scriptParamsSchema.safeParse({
    v: searchParams.get('v'),
    debug: searchParams.get('debug'),
  });

  if (!parsed.success) {
    // WHY: Return JS that throws in console — better DX than a JSON error for a script tag
    const errorMsg = parsed.error.issues[0]?.message ?? 'Invalid parameters';
    return new NextResponse(
      `console.error('[ecom-track] ${errorMsg}');`,
      {
        status: 400,
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      },
    );
  }

  const { v: variantId, debug } = parsed.data;
  const script = generateScript(variantId, debug);

  return new NextResponse(script, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      // WHY: Cache for 1 hour — the variant ID is in the URL, so each variant gets
      //      its own cached script. Debug mode disables cache.
      'Cache-Control': debug ? 'no-cache, no-store' : 'public, max-age=3600, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
