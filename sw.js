const C='gyd-v4';
const CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(u.origin===location.origin && (r.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('.xlsx'))){
    // oldal: hálózat előbb (friss verzió), net nélkül a mentett
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();const key=u.pathname.endsWith('.xlsx')?r:'./index.html';if(res.ok)caches.open(C).then(c=>c.put(key,cp));return res;}).catch(()=>caches.match(u.pathname.endsWith('.xlsx')?r:'./index.html')));
    return;
  }
  // minden más (ikonok, betűk, Excel-olvasó): mentett előbb
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;})));
});
