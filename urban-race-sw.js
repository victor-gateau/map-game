'use strict';
// Public application assets only. Account data stays in the existing account-scoped storage.
const CACHE_VERSION='ur-shell-v1';
const CACHE_PREFIX='urban-race-shell:'+self.registration.scope;
const CACHE_NAME=CACHE_PREFIX+CACHE_VERSION;
const base=new URL(self.registration.scope),indexURL=new URL('index.html',base).href;
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('message',event=>{if(event.data?.type==='UR_CACHE_INFO')event.ports[0]?.postMessage({cacheName:CACHE_NAME});});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET')return;
 const navigation=req.mode==='navigate'&&url.origin===base.origin&&(url.pathname===base.pathname||url.pathname===new URL(indexURL).pathname);
 const asset=(url.origin===base.origin&&url.pathname.startsWith(base.pathname)&&/\.(js|css)$/.test(url.pathname)&&!url.pathname.endsWith('/urban-race-sw.js'))||url.origin==='https://unpkg.com'&&url.pathname.startsWith('/leaflet@1.9.4/dist/')||url.origin==='https://cdn.jsdelivr.net'&&url.pathname==='/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
 if(!navigation&&!asset)return; // No interception of auth, RPCs, editor HTML, tiles or other sites.
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE_NAME);
  const ready=await cache.match(new URL('__urban_offline_ready__',base).href);
  if(navigation){try{return await fetch(req);}catch(error){if(ready){const page=await cache.match(indexURL);if(page)return page;}throw error;}}
  try{return await fetch(req);}catch(error){if(ready){const stored=await cache.match(req);if(stored)return stored;}throw error;}
 })());
});
