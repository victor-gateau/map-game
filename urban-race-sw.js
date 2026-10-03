'use strict';
// Retirement worker: replace the previously deployed file with this one.
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const prefix='urban-race-shell:'+self.registration.scope;
 for(const key of await caches.keys())if(key.startsWith(prefix))await caches.delete(key);
 await self.registration.unregister();
 await self.clients.claim();
})()));
