// v40: HTML her zaman önce ağdan (güncellemeler kendiliğinden gelir), çevrimdışıyken önbellekten.
// v126: oyun betikleri (tycoon.js) de önce ağdan; kurulumda tarayıcı HTTP önbelleği atlanır (cache:'reload'),
//       böylece yeni index.html ile eski tycoon.js karışmaz. Çevrimdışıyken sorgu parametresi yok sayılarak önbellekten.
// Kayıtlar localStorage/IndexedDB'de; service worker onlara dokunmaz, güncellemede silinmez.
const CACHE='pixelworld-v128';
const FILES=['./','./index.html','./tycoon.js','./manifest.json','./icons/icon-192.png','./icons/icon-512.png','./lib/three.min.js','https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(f=>c.add(new Request(f,{cache:'reload'})).catch(()=>c.add(f).catch(()=>{}))))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim()});
const isHTML=r=>r.mode==='navigate'||/\/(index\.html)?(\?.*)?$/.test(new URL(r.url).pathname+new URL(r.url).search);
const isGameJS=r=>{const u=new URL(r.url);return u.origin===self.location.origin&&/\/tycoon\.js$/.test(u.pathname)};
const netFirst=(e,r,fb)=>e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{if(res&&res.ok){const c=res.clone();caches.open(CACHE).then(ca=>ca.put(fb||r,c))}return res}).catch(()=>caches.match(fb||r,{ignoreSearch:true}).then(m=>m||caches.match(r,{ignoreSearch:true}))));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  if(isHTML(r)){e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{const c=res.clone();caches.open(CACHE).then(ca=>ca.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));return}
  if(isGameJS(r)){netFirst(e,r,new URL('./tycoon.js',self.location).href);return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(ca=>ca.put(r,c));return res})))});
