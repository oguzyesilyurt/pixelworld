// v134: OFFLINE-FIRST. Kurulumda tüm oyun varlıkları önbelleğe alınır; her istek önce önbellekten döner,
//       arka planda ağdan tazelenir (stale-while-revalidate). Ağ yokken gezinme isteklerinde index.html döner.
//       Yeni sürüm: CACHE adı değişince yeni service worker tüm listeyi tarayıcı HTTP önbelleğini atlayarak (cache:'reload')
//       indirir, eskisini siler; sayfa açılış/menüdeyse sessizce yenilenir (index.html v131/v134).
// Kayıtlar localStorage + IndexedDB'de; service worker onlara dokunmaz, güncellemede silinmez.
// Liste testi: node tools/check-offline.js (diskte olmayan ya da listede unutulmuş yerel dosya varsa hata verir).
const CACHE='pixelworld-v135';
const CORE=['./','./index.html','./tycoon.js','./manifest.json','./lib/three.min.js','./lib/peerjs.min.js','./lib/qrcode.js',
  './icons/icon-192.png','./icons/icon-512.png','./icons/icon-1024.png','./icons/maskable-192.png','./icons/maskable-512.png','./icons/maskable-1024.png','./icons/apple-touch-icon.png',
  './icons/sc-continue.png','./icons/sc-phone.png','./icons/sc-map.png'];
const SPLASH=['640x1136','1136x640','750x1334','1334x750','1242x2208','2208x1242','828x1792','1792x828','1242x2688','2688x1242','1125x2436','2436x1125','1170x2532','2532x1170','1284x2778','2778x1284','1179x2556','2556x1179','1290x2796','2796x1290'].map(s=>'./icons/splash/'+s+'.png');
const FILES=CORE.concat(SPLASH);
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(async c=>{
  /* çekirdek dosyalar zorunlu: biri inmezse kurulum başarısız olur (yarım önbellekle çevrimdışı kalınmaz) */
  await Promise.all(CORE.map(f=>fetch(new Request(f,{cache:'reload'})).then(r=>{if(!r.ok)throw new Error(f+' '+r.status);return c.put(f,r)})));
  await Promise.all(SPLASH.map(f=>c.add(new Request(f,{cache:'reload'})).catch(()=>{})))}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE&&/^pixelworld-/.test(x)).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const SCOPE=()=>new URL(self.registration.scope).pathname;
const keyOf=u=>u.origin===self.location.origin&&u.pathname.indexOf(SCOPE())===0?'./'+u.pathname.slice(SCOPE().length):null;
function revalidate(req,key){return fetch(req,{cache:'no-store'}).then(res=>{if(res&&res.ok&&res.type!=='opaque'){const cp=res.clone();caches.open(CACHE).then(c=>c.put(key||req,cp))}return res})}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(!/^https?:$/.test(u.protocol))return;
  /* dinamik istekler (bulut kaydı, PeerJS sinyal sunucusu) önbelleğe alınmaz */
  if(/supabase\.co|peerjs\.com/.test(u.host))return;
  const k=keyOf(u);
  /* gezinme: önce önbellekteki index.html; arka planda tazele; ağ yoksa yine index.html */
  if(r.mode==='navigate'||k==='./'||k==='./index.html'){
    e.respondWith(caches.open(CACHE).then(c=>c.match('./index.html').then(m=>{const net=revalidate(new Request('./index.html'),'./index.html').catch(()=>null);if(m){e.waitUntil(net);return m}
      return net.then(x=>x||c.match('./')).then(x=>x||new Response('<h1>PixelWorld</h1><p>İlk açılış için bir kez internet gerekli.</p>',{headers:{'Content-Type':'text/html; charset=utf-8'}}))})));return}
  /* diğer her şey: stale-while-revalidate (aynı kökende sorgu parametresi yok sayılır: tycoon.js?v=…) */
  e.respondWith(caches.open(CACHE).then(c=>c.match(k||r,{ignoreSearch:!!k}).then(m=>{const net=revalidate(r,k).catch(()=>null);if(m){e.waitUntil(net);return m}
    return net.then(x=>x||new Response('',{status:504,statusText:'offline'}))})))});
// v133: sistem bildirimine dokununca oyuna dön ve ilgili ekranı aç (mesajlar / aramalar)
self.addEventListener('notificationclick',e=>{e.notification.close();const open=(e.notification.data&&e.notification.data.open)||'chat';
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{const c=cs.find(x=>'focus' in x);if(c){c.postMessage({pw:'open',open:open});return c.focus()}return self.clients.openWindow('./index.html?go=phone')}))});
// v134: sayfa "önbellekte eksik var mı?" diye sorabilir
self.addEventListener('message',e=>{const d=e.data||{};if(d.pw!=='cacheCheck')return;e.waitUntil(caches.open(CACHE).then(async c=>{const miss=[];for(const f of FILES){if(!(await c.match(f)))miss.push(f)}if(e.source&&e.source.postMessage)e.source.postMessage({pw:'cacheReport',cache:CACHE,total:FILES.length,missing:miss})}))});
