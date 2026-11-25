/* =====================================================================
   Buludex Yönetim — şirket yönetim oyunu (PixelWorld)
   Bu adım: ÜRÜN GELİŞTİRME çekirdeği
   - bileşen → modül → özellik üretim zinciri, ürün puanı
   - yayın, günlük kullanıcı büyümesi, memnuniyet (özellik + hata + hız), hata düzeltme
   Ana oyunla bağ: window.PWB köprüsü (index.html). Kayıt: SAVE.BT
   ===================================================================== */
(function(){'use strict';
const P=()=>window.PWB;if(!P()){console.warn('tycoon.js: PWB köprüsü yok');return}

/* ---------------- veri tabloları ---------------- */
/* bileşenler: kim üretir (beceri), iş puanı */
const COMP={
  ui:{n:'UI parçası',ic:'🧩',sk:'fe',w:45},
  be:{n:'Backend modülü',ic:'⚙️',sk:'be',w:60},
  gfx:{n:'Grafik',ic:'🎨',sk:'ds',w:50},
  db:{n:'Veritabanı katmanı',ic:'🗄️',sk:'be',w:60},
  net:{n:'Ağ/API katmanı',ic:'🌐',sk:'be',w:70}};
/* modüller: bileşenlerden toplanır */
const MOD={
  arayuz:{n:'Arayüz modülü',ic:'🖥️',need:{ui:2,gfx:1},w:30},
  kimlik:{n:'Kimlik modülü',ic:'🔐',need:{be:1,db:1},w:35},
  veri:{n:'Veri modülü',ic:'📦',need:{db:2,be:1},w:35},
  ag:{n:'Ağ modülü',ic:'📡',need:{net:1,be:1},w:35},
  gorsel:{n:'Görsel modül',ic:'🖼️',need:{gfx:2,ui:1},w:30}};
/* özellikler: modüllerden kurulur; seviye başına aynı modül seti × seviye */
const FEAT={
  giris:{n:'Giriş sistemi',ic:'🔑',need:{arayuz:1,kimlik:1}},
  odeme:{n:'Ödeme',ic:'💳',need:{kimlik:1,veri:1,arayuz:1}},
  mesaj:{n:'Mesajlaşma',ic:'💬',need:{ag:1,arayuz:1,veri:1}},
  rapor:{n:'Raporlama',ic:'📊',need:{veri:2,arayuz:1}},
  akis:{n:'Akış & paylaşım',ic:'📰',need:{ag:1,gorsel:1,veri:1}},
  arama:{n:'Arama',ic:'🔎',need:{veri:1,ag:1}},
  bildirim:{n:'Bildirimler',ic:'🔔',need:{ag:1,arayuz:1}},
  sepet:{n:'Sepet & ürün kataloğu',ic:'🛒',need:{veri:1,gorsel:1,arayuz:1}},
  senk:{n:'Dosya senkronu',ic:'🔄',need:{ag:2,veri:1}},
  paylas:{n:'Dosya paylaşımı',ic:'📎',need:{ag:1,kimlik:1}},
  motor:{n:'Oyun motoru',ic:'🎮',need:{gorsel:2,arayuz:1}},
  liderlik:{n:'Liderlik tablosu',ic:'🏆',need:{veri:1,ag:1}},
  fatura:{n:'Fatura & e-defter',ic:'🧾',need:{veri:1,rapor:0,kimlik:1}},
  musteri:{n:'Müşteri kartları',ic:'👥',need:{veri:1,arayuz:1}}};
FEAT.fatura.need={veri:1,kimlik:1,arayuz:1};
/* ürün türleri: pazar (potansiyel kullanıcı), rakipler (puan), gelir modeli, önemli özellikler (ağırlık) */
const TYPES={
  sosyal:{n:'Sosyal medya uygulaması',ic:'📱',market:900000,model:'reklam',price:3.5,growth:1.25,comp:[['Pixelgram',38],['Kordon Chat',22],['Ege Sosyal',12]],w:{giris:1,akis:1.6,mesaj:1.4,bildirim:1,arama:.6,paylas:.5}},
  muhasebe:{n:'Muhasebe yazılımı',ic:'🧮',market:60000,model:'lisans',price:1200,growth:.55,comp:[['Defterim',30],['Mali Pro',18]],w:{giris:1,fatura:1.6,rapor:1.5,odeme:.8,musteri:.8,arama:.4}},
  eticaret:{n:'E-ticaret sitesi',ic:'🛍️',market:400000,model:'komisyon',price:300,growth:.9,comp:[['Pazarcık',42],['İzmir Çarşı',16]],w:{giris:.8,sepet:1.6,odeme:1.5,arama:1.1,bildirim:.6,musteri:.5}},
  crm:{n:'CRM',ic:'🤝',market:45000,model:'abonelik',price:280,growth:.5,comp:[['SatışPro',34],['Körfez CRM',20]],w:{giris:1,musteri:1.6,rapor:1.3,bildirim:.8,mesaj:.7,arama:.6}},
  oyun:{n:'Mobil oyun',ic:'🎮',market:700000,model:'reklam',price:2.8,growth:1.4,comp:[['Martı Run',30],['Boyoz Saga',24]],w:{motor:1.8,giris:.6,liderlik:1.1,bildirim:.6,odeme:.6}},
  bulut:{n:'Bulut depolama (Buludex)',ic:'☁️',market:250000,model:'abonelik',price:90,growth:.8,comp:[['Kutubox',36],['Ege Drive',18]],w:{giris:1,senk:1.7,paylas:1.3,arama:.7,odeme:.7,bildirim:.4}}};
const MODELN={abonelik:'Abonelik (aylık)',reklam:'Reklam',lisans:'Lisans (tek sefer)',komisyon:'Satış komisyonu'};
/* sunucu (bu adımda yalnız ev bilgisayarı; kapasiteyi aşınca hız düşer) */
const SRV={home:{n:'Ev bilgisayarı (sunucu)',cap:800,cost:15}};
const SKN={fe:'Frontend',be:'Backend',ds:'Tasarım'};

/* ---------------- durum ---------------- */
function fresh(){return {v:1,cash:15000,day:P().day,lastDay:P().day,speed:1,
  team:[{id:'oguz',n:'Oğuz',role:'Kurucu · Full-stack',sk:{fe:3,be:3,ds:2},task:null,prog:0,founder:true,mood:80}],
  inv:{comp:{ui:0,be:0,gfx:0,db:0,net:0},mod:{arayuz:0,kimlik:0,veri:0,ag:0,gorsel:0}},
  product:null,office:'Ev · çalışma masası',server:'home',hist:[],log:[],tut:0}}
let BT=null;
function st(){if(!BT)BT=fresh();return BT}
const fmt=v=>Math.round(v).toLocaleString('tr-TR');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function log(t){const S=st();S.log.unshift({d:S.day,h:P().GT|0,t:t});S.log.length=Math.min(S.log.length,40)}

/* ---------------- ürün puanı, memnuniyet ---------------- */
function featScore(p){const T=TYPES[p.type];let s=0;Object.keys(p.feat).forEach(k=>{const lv=p.feat[k];if(!lv)return;const w=T.w[k]!=null?T.w[k]:.25;s+=w*(lv*6+lv*lv*1.5)});return Math.round(s)}
function compBest(p){return Math.max(...TYPES[p.type].comp.map(c=>c[1]))}
function capOf(){const S=st();return SRV[S.server].cap}
function satisfaction(p){const fs=featScore(p),cb=compBest(p),featK=clamp(fs/(cb*1.1),0,1.25);const bugK=Math.min(.45,p.bugs*.045);const load=p.users/capOf(),speedK=load<=1?0:Math.min(.5,(load-1)*.35);
  return {total:Math.round(clamp(30+featK*62-bugK*100-speedK*100,0,100)),feat:Math.round(featK*100),bug:Math.round(bugK*100),speed:Math.round(speedK*100),load:load}}

/* ---------------- üretim: işçi görevleri ---------------- */
/* görev: {k:'comp'|'mod'|'fix', id} — tekrar eder; modül için bileşen stoktan düşülür */
function rate(e,k,id){const s=k==='comp'?e.sk[COMP[id].sk]:k==='mod'?Math.max(e.sk.fe,e.sk.be):e.sk.be;return .5*s*(.75+.25*e.mood/100)}/* iş puanı / oyun dakikası */
function workNeed(k,id){return k==='comp'?COMP[id].w:k==='mod'?MOD[id].w:40}
function canStart(k,id){const S=st();if(k!=='mod')return true;const n=MOD[id].need;return Object.keys(n).every(c=>S.inv.comp[c]>=n[c])}
function takeFor(k,id){const S=st();if(k==='mod'){const n=MOD[id].need;Object.keys(n).forEach(c=>S.inv.comp[c]-=n[c])}}
function give(k,id){const S=st();if(k==='comp')S.inv.comp[id]++;else if(k==='mod')S.inv.mod[id]++;else if(k==='fix'&&S.product&&S.product.bugs>0){S.product.bugs--;S.product.fixed=(S.product.fixed||0)+1;log('🐞 Bir hata düzeltildi ('+S.product.bugs+' kaldı)')}}
function setTask(e,k,id){e.task=k?{k:k,id:id}:null;e.prog=0;e.holding=false;if(k&&canStart(k,id)){takeFor(k,id);e.holding=true}}
function work(min,atDesk){const S=st();S.team.forEach(e=>{if(!e.task)return;if(e.founder&&!atDesk)return;/* kurucu yalnız bilgisayar başındayken */
  const t=e.task;if(t.k==='fix'&&(!S.product||!S.product.bugs)){return}
  if(!e.holding){if(!canStart(t.k,t.id))return;takeFor(t.k,t.id);e.holding=true}
  e.prog+=rate(e,t.k,t.id)*min;const need=workNeed(t.k,t.id);while(e.prog>=need){e.prog-=need;give(t.k,t.id);e.holding=false;e.mood=clamp(e.mood-.15,30,100);
    if(canStart(t.k,t.id)&&!(t.k==='fix'&&(!S.product||!S.product.bugs))){takeFor(t.k,t.id);e.holding=true}else{e.prog=0;break}}})}

/* ---------------- özellik kur / yükselt ---------------- */
function featCost(p,k){const lv=(p.feat[k]||0)+1,n=FEAT[k].need,o={};Object.keys(n).forEach(m=>o[m]=n[m]*lv);return o}
function canBuild(p,k){const S=st(),c=featCost(p,k);return Object.keys(c).every(m=>S.inv.mod[m]>=c[m])&&(p.feat[k]||0)<5}
function build(k){const S=st(),p=S.product;if(!p||!canBuild(p,k))return;const c=featCost(p,k);Object.keys(c).forEach(m=>S.inv.mod[m]-=c[m]);p.feat[k]=(p.feat[k]||0)+1;
  /* her geliştirme yeni hata getirebilir */const nb=Math.random()<.55?1+(Math.random()<.35?1:0):0;p.bugs+=nb;if(p.live){p.ver=+(p.ver+.1).toFixed(1)}
  log(FEAT[k].ic+' '+FEAT[k].n+' → seviye '+p.feat[k]+(nb?' · '+nb+' yeni hata':''));P().sfx('blip');render()}
function release(){const S=st(),p=S.product;if(!p||p.live)return;const nf=Object.values(p.feat).filter(v=>v>0).length;if(nf<2){P().toast('🚀 Yayın için en az 2 özellik gerekli');return}
  p.live=true;p.ver=1.0;p.users=Math.round(40+featScore(p)*3);p.relDay=S.day;log('🚀 '+p.name+' yayında! İlk gün '+fmt(p.users)+' kullanıcı');P().toast('🚀 '+p.name+' yayınlandı!');P().sfx('coin');try{P().mem('🚀',p.name+' adlı ürünümü yayınladım')}catch(e){}render()}

/* ---------------- gün sonu: kullanıcı, gelir, gider, hatalar ---------------- */
function daily(){const S=st(),p=S.product;let inc=0,exp=SRV[S.server].cost;let nu=0;
  if(p&&p.live){const T=TYPES[p.type],sat=satisfaction(p),share=clamp(featScore(p)/(featScore(p)+T.comp.reduce((s,c)=>s+c[1],0)),0,1),room=Math.max(0,T.market*share-p.users);
    const g=T.growth*(sat.total-45)/100;nu=Math.round(Math.max(-p.users*.12,(g>0?room*.025*g+p.users*.06*g:p.users*g*.5))+(sat.total>50?5:0));p.users=Math.max(0,p.users+nu);
    /* gelir: abonelik %6 ödeyen × aylık fiyat/30 · reklam kullanıcı başı günlük gösterim · lisans yeni kullanıcının %2'si satın alır · komisyon %2 alışveriş × sepet × %5 */
    if(T.model==='abonelik')inc=p.users*.06*T.price/30;else if(T.model==='reklam')inc=p.users*T.price*.05;else if(T.model==='lisans')inc=Math.max(0,nu)*T.price*.02+p.users*.002*T.price/30;else inc=p.users*.02*T.price*.05;
    /* yeni hatalar: kullanıcıya ve koda göre */if(Math.random()<Math.min(.7,.08+p.users/20000))p.bugs++;p.sat=sat.total;p.peak=Math.max(p.peak||0,p.users)}
  inc=Math.round(inc);S.cash+=inc-exp;S.hist.push({d:S.day,inc:inc,exp:exp,u:p&&p.live?p.users:0,nu:nu});S.hist=S.hist.slice(-30);
  if(p&&p.live)log('📅 Gün '+S.day+': '+(nu>=0?'+':'')+fmt(nu)+' kullanıcı · gelir '+fmt(inc)+'🪙 · gider '+fmt(exp)+'🪙');
  if(S.cash<0&&!S.warned){S.warned=1;P().toast('⚠️ Buludex kasası ekside! Finans → şirkete para aktar')}}
/* oyun saati ilerledikçe (açık ya da kapalı) */
function tick(min,atDesk){const S=st();if(min<=0)return;work(min,atDesk);const d=P().day;while(S.lastDay<d){S.lastDay++;S.day=S.lastDay;daily()}if(OPEN)renderSoft()}

/* ---------------- arayüz ---------------- */
let OPEN=false,TAB='panel',root=null,loopId=0,lastT=0,softT=0;
const css=`#tyc{position:fixed;inset:0;z-index:200;display:none;background:#0d1117;color:#e6edf3;font:14px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
#tyc.on{display:grid;grid-template-columns:200px 1fr;grid-template-rows:56px 1fr}
#tyc .tb{grid-column:1/3;display:flex;align-items:center;gap:14px;padding:0 14px;background:#161b22;border-bottom:1px solid #30363d}
#tyc .tb .lg{font-weight:800;font-size:16px;letter-spacing:.3px}#tyc .tb .lg b{color:#58a6ff}
#tyc .tb .pill{background:#21262d;border:1px solid #30363d;border-radius:20px;padding:5px 12px;font-weight:600;white-space:nowrap}
#tyc .tb .cash{color:#3fb950}#tyc .tb .cash.neg{color:#f85149}
#tyc .sp{display:flex;gap:4px}#tyc .sp button,#tyc .x{background:#21262d;border:1px solid #30363d;color:#e6edf3;border-radius:8px;padding:5px 10px;font:inherit;font-weight:700;cursor:pointer}
#tyc .sp button.on{background:#1f6feb;border-color:#1f6feb}#tyc .x{margin-left:auto;background:#da3633;border-color:#da3633}
#tyc .nav{background:#161b22;border-right:1px solid #30363d;padding:10px 8px;display:flex;flex-direction:column;gap:4px;overflow:auto}
#tyc .nav button{text-align:left;background:none;border:0;color:#c9d1d9;padding:9px 12px;border-radius:8px;font:inherit;cursor:pointer}
#tyc .nav button.on{background:#1f6feb33;color:#fff;box-shadow:inset 3px 0 0 #58a6ff}#tyc .nav button:hover{background:#21262d}#tyc .nav small{display:block;opacity:.55;font-size:11px}
#tyc .main{overflow:auto;padding:18px 22px}
#tyc h2{margin:0 0 12px;font-size:20px}#tyc h3{margin:16px 0 8px;font-size:15px;color:#8b949e;font-weight:600}
#tyc .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
#tyc .card{background:#161b22;border:1px solid #30363d;border-radius:12px;padding:12px 14px}
#tyc .kpi{font-size:24px;font-weight:800}#tyc .kpi small{font-size:12px;opacity:.6;font-weight:500;display:block}
#tyc .row{display:flex;align-items:center;gap:8px;justify-content:space-between;margin:4px 0}
#tyc .bar{height:8px;background:#21262d;border-radius:5px;overflow:hidden;flex:1}#tyc .bar i{display:block;height:100%;background:#3fb950;border-radius:5px}
#tyc .btn{background:#238636;border:1px solid #2ea043;color:#fff;border-radius:8px;padding:6px 12px;font:inherit;font-weight:600;cursor:pointer}
#tyc .btn.s{background:#21262d;border-color:#30363d}#tyc .btn:disabled{opacity:.4;cursor:not-allowed}#tyc .btn.b{background:#1f6feb;border-color:#388bfd}
#tyc .tag{display:inline-block;font-size:11px;padding:2px 7px;border-radius:10px;background:#21262d;border:1px solid #30363d;margin:2px 4px 2px 0}
#tyc .tag.ok{border-color:#2ea043;color:#3fb950}#tyc .tag.no{border-color:#da3633;color:#f85149}
#tyc .muted{opacity:.6;font-size:12px}#tyc table{width:100%;border-collapse:collapse}#tyc td,#tyc th{padding:6px 8px;border-bottom:1px solid #21262d;text-align:left;font-size:13px}
#tyc select{background:#0d1117;color:#e6edf3;border:1px solid #30363d;border-radius:8px;padding:6px 8px;font:inherit}
#tyc input{background:#0d1117;color:#e6edf3;border:1px solid #30363d;border-radius:8px;padding:6px 8px;font:inherit}
#tyc .types{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
#tyc .types .card{cursor:pointer}#tyc .types .card:hover{border-color:#58a6ff}#tyc .types .card.sel{border-color:#58a6ff;box-shadow:0 0 0 2px #1f6feb55}
#tyc .log div{font-size:12px;padding:3px 0;border-bottom:1px dashed #21262d}
@media (max-width:760px),(max-height:520px){#tyc.on{grid-template-columns:62px 1fr;grid-template-rows:48px 1fr}#tyc .nav button{padding:8px 6px;font-size:18px;text-align:center}#tyc .nav button span,#tyc .nav small{display:none}#tyc .tb{gap:8px;padding:0 8px}#tyc .tb .lg{display:none}#tyc .tb .pill{padding:4px 8px;font-size:12px}#tyc .main{padding:12px}}`;
const NAV=[['panel','📊','Panel'],['urun','🧪','Ürünler'],['ekip','👥','Ekip'],['ofis','🏢','Ofis'],['sunucu','🖧','Sunucular'],['finans','💰','Finans'],['yatirim','🤝','Yatırımcılar']];
function el(t,c,h){const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function ensureUI(){if(root)return;const s=document.createElement('style');s.textContent=css;document.head.appendChild(s);root=el('div','');root.id='tyc';document.body.appendChild(root);
  root.addEventListener('pointerdown',e=>e.stopPropagation());root.addEventListener('keydown',e=>e.stopPropagation())}
function hhmm(m){m=((m%1440)+1440)%1440;const h=Math.floor(m/60),n=Math.floor(m%60);return (h<10?'0':'')+h+':'+(n<10?'0':'')+n}
function topBar(){const S=st();const tb=el('div','tb');tb.innerHTML='<span class="lg">💼 <b>Buludex</b> Yönetim</span><span class="pill cash'+(S.cash<0?' neg':'')+'" id="tycCash">🪙 '+fmt(S.cash)+'</span><span class="pill" id="tycDate">📅 Gün '+P().day+' · '+hhmm(P().GT)+'</span>';
  const sp=el('div','sp');[[0,'⏸'],[1,'1x'],[2,'2x'],[4,'4x']].forEach(q=>{const b=el('button',S.speed===q[0]?'on':'',q[1]);b.onclick=()=>{S.speed=q[0];render()};sp.appendChild(b)});tb.appendChild(sp);
  const x=el('button','x','✕ Kapat');x.onclick=close;tb.appendChild(x);return tb}
function nav(){const n=el('div','nav');NAV.forEach(q=>{const b=el('button',TAB===q[0]?'on':'',q[1]+' <span>'+q[2]+'</span>');b.onclick=()=>{TAB=q[0];render()};n.appendChild(b)});n.appendChild(el('div','muted','<br>Bu adım: ürün geliştirme çekirdeği. Ekip, ofis, sunucu ve yatırım sonraki adımlarda.'));return n}
function render(){if(!OPEN)return;ensureUI();root.innerHTML='';root.appendChild(topBar());root.appendChild(nav());const m=el('div','main');root.appendChild(m);(VIEWS[TAB]||VIEWS.panel)(m)}
function renderSoft(){const now=performance.now();if(now-softT<400)return;softT=now;const S=st();const c=document.getElementById('tycCash');if(c){c.textContent='🪙 '+fmt(S.cash);c.classList.toggle('neg',S.cash<0)}const d=document.getElementById('tycDate');if(d)d.textContent='📅 Gün '+P().day+' · '+hhmm(P().GT);
  document.querySelectorAll('#tyc [data-prog]').forEach(b=>{const e=S.team.find(q=>q.id===b.dataset.prog);if(e&&e.task)b.style.width=Math.min(100,e.prog/workNeed(e.task.k,e.task.id)*100)+'%'});
  document.querySelectorAll('#tyc [data-inv]').forEach(x=>{const [k,id]=x.dataset.inv.split(':');x.textContent=S.inv[k][id]});
  if(now-(renderSoft.full||0)>2500){renderSoft.full=now;if(TAB==='panel'||TAB==='urun'||TAB==='ekip')render()}}
const VIEWS={
panel(m){const S=st(),p=S.product;m.appendChild(el('h2','','📊 Panel'));
  if(!p){const c=el('div','card');c.innerHTML='<b>Hoş geldin Oğuz 👋</b><p>Buludex şimdilik senin evindeki bir masa ve bir fikirden ibaret. Önce bir ürün türü seç, sonra bileşen üret, modül topla, özellik kur ve yayınla.</p>';const b=el('button','btn b','🧪 İlk ürününü oluştur');b.onclick=()=>{TAB='urun';render()};c.appendChild(b);m.appendChild(c);return}
  const sat=satisfaction(p),T=TYPES[p.type],g=el('div','grid');m.appendChild(g);
  const K=(t,v,s)=>{const c=el('div','card');c.innerHTML='<div class="kpi">'+v+'<small>'+t+(s?' · '+s:'')+'</small></div>';g.appendChild(c)};
  K(T.ic+' '+p.name,p.live?'v'+p.ver.toFixed(1):'Geliştiriliyor',T.n);K('Kullanıcı',fmt(p.users||0),p.live?'zirve '+fmt(p.peak||p.users):'yayında değil');K('Memnuniyet',(p.live?sat.total:'—')+(p.live?'%':''),'özellik %'+sat.feat+' · hata −'+sat.bug+' · hız −'+sat.speed);
  const last=S.hist[S.hist.length-1];K('Dünkü gelir',last?fmt(last.inc)+'🪙':'—',MODELN[T.model]);K('Ürün puanı',featScore(p),'en iyi rakip '+compBest(p));K('Açık hata',p.bugs,'🐞'+(p.bugs?' · Ekip → hata düzelt':''));
  m.appendChild(el('h3','','Çalışanlar'));const tc=el('div','card');S.team.forEach(e=>{const r=el('div','row');r.innerHTML='<span>'+e.n+' · '+(e.task?taskName(e.task):'<span class="muted">boşta</span>')+'</span>';const b=el('div','bar');b.innerHTML='<i data-prog="'+e.id+'" style="width:'+(e.task?Math.min(100,e.prog/workNeed(e.task.k,e.task.id)*100):0)+'%"></i>';r.appendChild(b);tc.appendChild(r)});m.appendChild(tc);
  m.appendChild(el('h3','','Son olaylar'));const lg=el('div','card log');S.log.slice(0,10).forEach(q=>lg.appendChild(el('div','','<span class="muted">Gün '+q.d+' '+hhmm(q.h)+'</span> · '+q.t)));if(!S.log.length)lg.appendChild(el('div','muted','Henüz olay yok'));m.appendChild(lg)},
urun(m){const S=st(),p=S.product;m.appendChild(el('h2','','🧪 Ürünler'));
  if(!p){m.appendChild(el('p','muted','Bir ürün türü seç. Her türün pazarı, rakipleri ve gelir modeli farklı.'));const tp=el('div','types');let sel=null;const nm=el('input','');nm.placeholder='Ürün adı';
    Object.keys(TYPES).forEach(k=>{const T=TYPES[k],c=el('div','card');c.innerHTML='<b>'+T.ic+' '+T.n+'</b><div class="muted">Pazar: '+fmt(T.market)+' kişi · '+MODELN[T.model]+'</div><div class="muted">Rakipler: '+T.comp.map(q=>q[0]+' ('+q[1]+')').join(', ')+'</div><div>'+Object.keys(T.w).sort((a,b)=>T.w[b]-T.w[a]).slice(0,3).map(f=>'<span class="tag">'+FEAT[f].ic+' '+FEAT[f].n+'</span>').join('')+'</div>';
      c.onclick=()=>{sel=k;tp.querySelectorAll('.card').forEach(x=>x.classList.remove('sel'));c.classList.add('sel');if(!nm.value||nm.dataset.auto){nm.value=k==='bulut'?'Buludex':{sosyal:'Körfezgram',muhasebe:'Defterix',eticaret:'Kordonpazar',crm:'Müşterix',oyun:'Martı Kaçış'}[k];nm.dataset.auto=1}};tp.appendChild(c)});m.appendChild(tp);
    const f=el('div','card');f.style.marginTop='12px';f.appendChild(nm);const b=el('button','btn b','Oluştur');b.style.marginLeft='8px';b.onclick=()=>{if(!sel){P().toast('Bir tür seç');return}S.product={type:sel,name:(nm.value||'Ürün').slice(0,24),feat:{},bugs:0,users:0,live:false,ver:0};log('🧪 '+S.product.name+' projesi başladı ('+TYPES[sel].n+')');
      if(!S.team[0].task)setTask(S.team[0],'comp','ui');render()};f.appendChild(b);m.appendChild(f);return}
  const T=TYPES[p.type];const h=el('div','card');h.innerHTML='<b>'+T.ic+' '+p.name+'</b> <span class="tag">'+T.n+'</span><span class="tag">'+MODELN[T.model]+'</span><span class="tag">Puan '+featScore(p)+' / rakip '+compBest(p)+'</span>'+(p.live?'<span class="tag ok">Yayında v'+p.ver.toFixed(1)+'</span>':'<span class="tag">Geliştiriliyor</span>');
  if(!p.live){const rb=el('button','btn','🚀 Yayınla');rb.style.marginLeft='8px';rb.onclick=release;h.appendChild(rb)}m.appendChild(h);
  m.appendChild(el('h3','','Envanter'));const iv=el('div','card');iv.innerHTML='<div>'+Object.keys(COMP).map(k=>'<span class="tag">'+COMP[k].ic+' '+COMP[k].n+': <b data-inv="comp:'+k+'">'+S.inv.comp[k]+'</b></span>').join('')+'</div><div>'+Object.keys(MOD).map(k=>'<span class="tag">'+MOD[k].ic+' '+MOD[k].n+': <b data-inv="mod:'+k+'">'+S.inv.mod[k]+'</b></span>').join('')+'</div>';m.appendChild(iv);
  m.appendChild(el('h3','','Özellikler (modüllerden kurulur · seviye 1–5)'));const tb=el('table','');tb.innerHTML='<tr><th>Özellik</th><th>Önem</th><th>Seviye</th><th>Gereken modüller</th><th></th></tr>';
  Object.keys(FEAT).sort((a,b)=>(T.w[b]||0)-(T.w[a]||0)).forEach(k=>{const F=FEAT[k],lv=p.feat[k]||0,c=featCost(p,k),w=T.w[k];const tr=el('tr','');
    tr.innerHTML='<td>'+F.ic+' '+F.n+'</td><td>'+(w?'★'.repeat(Math.round(w*2)).slice(0,4):'<span class="muted">düşük</span>')+'</td><td>'+(lv?'Sv '+lv:'—')+'</td><td>'+(lv>=5?'<span class="muted">en üst</span>':Object.keys(c).map(q=>'<span class="tag '+(S.inv.mod[q]>=c[q]?'ok':'no')+'">'+MOD[q].ic+' '+c[q]+'</span>').join(''))+'</td>';
    const td=el('td','');const b=el('button','btn'+(lv?' s':''),lv?'⬆ Yükselt':'＋ Kur');b.disabled=!canBuild(p,k);b.onclick=()=>build(k);td.appendChild(b);tr.appendChild(td);tb.appendChild(tr)});const tc=el('div','card');tc.appendChild(tb);m.appendChild(tc);
  m.appendChild(el('h3','','Rakipler'));const rc=el('div','card');T.comp.forEach(q=>{const r=el('div','row');r.innerHTML='<span>'+q[0]+'</span><span class="muted">puan '+q[1]+'</span>';rc.appendChild(r)});const me=el('div','row');me.innerHTML='<b>'+p.name+'</b><b>puan '+featScore(p)+'</b>';rc.appendChild(me);m.appendChild(rc)},
ekip(m){const S=st();m.appendChild(el('h2','','👥 Ekip'));m.appendChild(el('p','muted','Çalışanlar bileşen üretir (UI, backend, grafik, veritabanı, ağ), bileşenlerden modül toplar ya da hata düzeltir. Görev bitince aynı görevi tekrarlar. Kurucu (Oğuz) yalnız bu ekran açıkken çalışır.'));
  S.team.forEach(e=>{const c=el('div','card');c.innerHTML='<b>'+e.n+'</b> <span class="tag">'+e.role+'</span> '+Object.keys(e.sk).map(k=>'<span class="tag">'+SKN[k]+' '+e.sk[k]+'</span>').join('')+' <span class="tag">Moral %'+Math.round(e.mood)+'</span>';
    const sel=document.createElement('select');sel.innerHTML='<option value="">— boşta —</option><optgroup label="Bileşen üret">'+Object.keys(COMP).map(k=>'<option value="comp:'+k+'">'+COMP[k].ic+' '+COMP[k].n+' ('+COMP[k].w+' iş)</option>').join('')+'</optgroup><optgroup label="Modül topla">'+Object.keys(MOD).map(k=>'<option value="mod:'+k+'">'+MOD[k].ic+' '+MOD[k].n+' · '+Object.keys(MOD[k].need).map(q=>MOD[k].need[q]+'×'+COMP[q].n).join(' + ')+'</option>').join('')+'</optgroup><option value="fix:bug">🐞 Hata düzelt</option>';
    sel.value=e.task?e.task.k+':'+e.task.id:'';sel.onchange=()=>{const v=sel.value;if(!v)setTask(e,null);else{const [k,id]=v.split(':');setTask(e,k,id)}render()};const r=el('div','row');r.appendChild(sel);const b=el('div','bar');b.innerHTML='<i data-prog="'+e.id+'" style="width:'+(e.task?Math.min(100,e.prog/workNeed(e.task.k,e.task.id)*100):0)+'%"></i>';r.appendChild(b);c.appendChild(r);
    if(e.task&&e.task.k==='mod'&&!e.holding&&!canStart('mod',e.task.id))c.appendChild(el('div','muted','⏳ Bileşen bekliyor: '+Object.keys(MOD[e.task.id].need).map(q=>MOD[e.task.id].need[q]+'×'+COMP[q].n).join(' + ')));
    if(e.task)c.appendChild(el('div','muted','Hız: '+rate(e,e.task.k,e.task.id).toFixed(2)+' iş/dk · bir adet ≈ '+Math.round(workNeed(e.task.k,e.task.id)/rate(e,e.task.k,e.task.id))+' oyun dakikası'));m.appendChild(c)});
  m.appendChild(el('div','card muted','👔 İşe alım, maaşlar ve eğitim bir sonraki adımda.'))},
ofis(m){const S=st();m.appendChild(el('h2','','🏢 Ofis'));m.appendChild(el('div','card','<b>'+S.office+'</b><p class="muted">1 masa · kurucu tek başına. Ofis kiralama ve masa düzeni bir sonraki adımda.</p>'))},
sunucu(m){const S=st(),p=S.product,s=SRV[S.server];m.appendChild(el('h2','','🖧 Sunucular'));const c=el('div','card');const load=p&&p.live?p.users/s.cap:0;
  c.innerHTML='<b>'+s.n+'</b><div class="row"><span>Kapasite</span><b>'+fmt(s.cap)+' kullanıcı</b></div><div class="row"><span>Yük</span><div class="bar"><i style="width:'+Math.min(100,load*100)+'%;background:'+(load>1?'#f85149':load>.8?'#d29922':'#3fb950')+'"></i></div><b>%'+Math.round(load*100)+'</b></div><div class="row"><span>Günlük gider</span><b>'+s.cost+'🪙</b></div><p class="muted">Kapasite aşılınca ürün yavaşlar, memnuniyet düşer. Sunucu kiralama bir sonraki adımda.</p>';m.appendChild(c)},
finans(m){const S=st();m.appendChild(el('h2','','💰 Finans'));const g=el('div','grid');m.appendChild(g);const L=S.hist.slice(-7),inc=L.reduce((s,q)=>s+q.inc,0),exp=L.reduce((s,q)=>s+q.exp,0);
  [['Kasa',fmt(S.cash)+'🪙'],['Son 7 gün gelir',fmt(inc)+'🪙'],['Son 7 gün gider',fmt(exp)+'🪙'],['Net',(inc-exp>=0?'+':'')+fmt(inc-exp)+'🪙']].forEach(q=>{const c=el('div','card');c.innerHTML='<div class="kpi">'+q[1]+'<small>'+q[0]+'</small></div>';g.appendChild(c)});
  const t=el('div','card');t.innerHTML='<b>Şirkete para aktar</b><p class="muted">Kişisel hesabından ('+fmt(P().coins)+'🪙) Buludex kasasına.</p>';[1000,5000,10000].forEach(v=>{const b=el('button','btn s','+'+fmt(v)+'🪙');b.style.marginRight='6px';b.onclick=()=>{if(P().payPersonal(v)){S.cash+=v;log('💰 Kurucu '+fmt(v)+'🪙 aktardı');render()}else P().toast('Kişisel bakiye yetmiyor')};t.appendChild(b)});m.appendChild(t);
  m.appendChild(el('h3','','Günlük'));const tb=el('table','');tb.innerHTML='<tr><th>Gün</th><th>Kullanıcı</th><th>Yeni</th><th>Gelir</th><th>Gider</th></tr>'+S.hist.slice(-10).reverse().map(q=>'<tr><td>'+q.d+'</td><td>'+fmt(q.u)+'</td><td>'+(q.nu>=0?'+':'')+fmt(q.nu)+'</td><td>'+fmt(q.inc)+'</td><td>'+fmt(q.exp)+'</td></tr>').join('');const c2=el('div','card');c2.appendChild(tb);m.appendChild(c2)},
yatirim(m){m.appendChild(el('h2','','🤝 Yatırımcılar'));m.appendChild(el('div','card','<p class="muted">Henüz yatırımcı ilgisi yok. Ürün yayınlanıp kullanıcı topladıkça melek yatırımcılar ve fonlar görüşmek isteyecek (sonraki adım).</p>'))}};
function taskName(t){return t.k==='comp'?COMP[t.id].ic+' '+COMP[t.id].n:t.k==='mod'?MOD[t.id].ic+' '+MOD[t.id].n:'🐞 Hata düzeltme'}

/* ---------------- aç / kapat · zaman döngüsü ---------------- */
function loop(){if(!OPEN)return;const now=performance.now(),dt=Math.min(.25,(now-lastT)/1000);lastT=now;const S=st();
  if(S.speed>0){const min=dt*1*S.speed;/* 1x = saniyede 1 oyun dakikası (dünyanın 2 katı) */P().advance(min);tick(min,true)}else renderSoft();loopId=requestAnimationFrame(loop)}
function open(){const S=st();ensureUI();OPEN=true;root.classList.add('on');P().pause(true);lastT=performance.now();if(S.lastDay>P().day)S.lastDay=P().day;render();cancelAnimationFrame(loopId);loopId=requestAnimationFrame(loop);P().sfx('blip')}
function close(){OPEN=false;if(root)root.classList.remove('on');cancelAnimationFrame(loopId);P().pause(false);P().save()}
/* köprüye kaydol */
P().bt={get:()=>BT,set:o=>{BT=(o&&typeof o==='object'&&o.v)?Object.assign(fresh(),o):null},tick:(min,desk)=>{try{tick(min,!!desk)}catch(e){console.error(e)}},open:open,close:close,get isOpen(){return OPEN},
  _t:{st:st,work:work,daily:daily,build:build,release:release,setTask:setTask,satisfaction:satisfaction,featScore:featScore,TYPES:TYPES,render:render,go:t=>{TAB=t;render()}}};
if(P().pendingBT!==undefined){P().bt.set(P().pendingBT);P().pendingBT=undefined}
})();
