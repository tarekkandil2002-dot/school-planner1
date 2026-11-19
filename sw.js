const CACHE_NAME='school-planner-v7';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE_NAME).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME),hit=await cache.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{if(r&&r.ok)cache.put(e.request,r.clone());return r}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    const r=await net;if(r)return r;
    if(e.request.mode==='navigate')return cache.match('./index.html');
    return new Response('',{status:504});
  })());
});
