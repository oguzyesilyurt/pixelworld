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
function satisfaction(p){const fs=featScore(p),cb=compBest(p),featK=clamp(fs/(cb*1.1),0,1.25);const bugK=Math.min(.45,p.bugs*.045);const load=p.users/Math.max(1,capOf()),speedK=load<=1?0:load<1.6?Math.min(.5,(load-1)*.35):.65;
  return {total:Math.round(clamp(30+featK*62-bugK*100-speedK*100,0,100)),feat:Math.round(featK*100),bug:Math.round(bugK*100),speed:Math.round(speedK*100),load:load}}

/* ---------------- üretim: işçi görevleri ---------------- */
/* görev: {k:'comp'|'mod'|'fix', id} — tekrar eder; modül için bileşen stoktan düşülür */
function rate(e,k,id){const s=(k==='comp'?e.sk[COMP[id].sk]:k==='mod'?Math.max(e.sk.fe||0,e.sk.be||0):Math.max(e.sk.be||0,(e.sk.qa||0)*1.5))||0;const mot=e.mot!=null?e.mot:e.mood;const dk=st().of?deskOf(e):1;return .5*s*(.75+.25*mot/100)*trMul(e,k,id)*(dk?(dk.pc!=null?PCT[dk.pc][1]:1):.5)*(1+(st().of?meetBoost():0))}/* iş puanı / oyun dakikası */
function workNeed(k,id){return k==='comp'?COMP[id].w:k==='mod'?MOD[id].w:40}
function canStart(k,id){const S=st();if(k!=='mod')return true;const n=MOD[id].need;return Object.keys(n).every(c=>S.inv.comp[c]>=n[c])}
function takeFor(k,id){const S=st();if(k==='mod'){const n=MOD[id].need;Object.keys(n).forEach(c=>S.inv.comp[c]-=n[c])}}
function give(k,id){const S=st();if(k==='comp')S.inv.comp[id]++;else if(k==='mod')S.inv.mod[id]++;else if(k==='fix'&&S.product&&S.product.bugs>0){S.product.bugs--;S.product.fixed=(S.product.fixed||0)+1;log('🐞 Bir hata düzeltildi ('+S.product.bugs+' kaldı)')}}
function setTask(e,k,id){e.task=k?{k:k,id:id}:null;e.prog=0;e.holding=false;if(k&&canStart(k,id)){takeFor(k,id);e.holding=true}}
function work(min,atDesk){const S=st();S.team.forEach(e=>{if(!e.task||e.away)return;if(e.founder&&!atDesk)return;/* kurucu yalnız bilgisayar başındayken */
  const t=e.task;if(t.k==='fix'&&(!S.product||!S.product.bugs)){return}
  if(!e.holding){if(!canStart(t.k,t.id))return;takeFor(t.k,t.id);e.holding=true}
  e.prog+=rate(e,t.k,t.id)*min;const need=workNeed(t.k,t.id);while(e.prog>=need){e.prog-=need;give(t.k,t.id);e.holding=false;e.mot=clamp((e.mot!=null?e.mot:e.mood)-.05,0,100);
    if(canStart(t.k,t.id)&&!(t.k==='fix'&&(!S.product||!S.product.bugs))){takeFor(t.k,t.id);e.holding=true}else{e.prog=0;break}}})}

/* ---------------- özellik kur / yükselt ---------------- */
function featCost(p,k){const lv=(p.feat[k]||0)+1,n=FEAT[k].need,o={};Object.keys(n).forEach(m=>o[m]=n[m]*lv);return o}
function canBuild(p,k){const S=st(),c=featCost(p,k);return Object.keys(c).every(m=>S.inv.mod[m]>=c[m])&&(p.feat[k]||0)<5}
function build(k){const S=st(),p=S.product;if(!p||!canBuild(p,k))return;const c=featCost(p,k);Object.keys(c).forEach(m=>S.inv.mod[m]-=c[m]);p.feat[k]=(p.feat[k]||0)+1;
  /* her geliştirme yeni hata getirebilir */const nb=Math.random()<.55*bugMul()?1+(Math.random()<.35*bugMul()?1:0):0;p.bugs+=nb;if(p.live){p.ver=+(p.ver+.1).toFixed(1)}
  log(FEAT[k].ic+' '+FEAT[k].n+' → seviye '+p.feat[k]+(nb?' · '+nb+' yeni hata':''));P().sfx('blip');render()}
function release(){const S=st(),p=S.product;if(!p||p.live)return;const nf=Object.values(p.feat).filter(v=>v>0).length;if(nf<2){P().toast('🚀 Yayın için en az 2 özellik gerekli');return}
  p.live=true;p.ver=1.0;p.users=Math.round(40+featScore(p)*3);p.relDay=S.day;log('🚀 '+p.name+' yayında! İlk gün '+fmt(p.users)+' kullanıcı');P().toast('🚀 '+p.name+' yayınlandı!');P().sfx('coin');try{P().mem('🚀',p.name+' adlı ürünümü yayınladım')}catch(e){}render()}

/* ---------------- gün sonu: kullanıcı, gelir, gider, hatalar ---------------- */
function daily(){const S=ensureOS(),p=S.product;let inc=0,exp=srvCost()+OFF().rent;let nu=0;incDaily();
  if(p&&p.live){const T=TYPES[p.type],sat=satisfaction(p),share=clamp(featScore(p)/(featScore(p)+T.comp.reduce((s,c)=>s+c[1],0)),0,1),room=Math.max(0,T.market*share-p.users);
    const g=T.growth*(sat.total-45)/100*(sat.total>45?1+Math.min(.6,sumLv('mkt')*.04):1);nu=Math.round(Math.max(-p.users*.12,(g>0?room*.025*g+p.users*.06*g:p.users*g*.5))+(sat.total>50?5:0));p.users=Math.max(0,p.users+nu);if(sat.load>1.6){const lost=Math.round(p.users*.08);p.users-=lost;nu-=lost;log('💥 Site çöktü! Kapasite yetmiyor · −'+fmt(lost)+' kullanıcı')}
    /* gelir: abonelik %6 ödeyen × aylık fiyat/30 · reklam kullanıcı başı günlük gösterim · lisans yeni kullanıcının %2'si satın alır · komisyon %2 alışveriş × sepet × %5 */
    if(T.model==='abonelik')inc=p.users*.06*T.price/30;else if(T.model==='reklam')inc=p.users*T.price*.05;else if(T.model==='lisans')inc=Math.max(0,nu)*T.price*.02+p.users*.002*T.price/30;else inc=p.users*.02*T.price*.05;
    inc*=1+Math.min(.4,sumLv('sales')*.03);/* yeni hatalar: kullanıcıya ve koda göre */if(Math.random()<Math.min(.7,(.08+p.users/20000)*bugMul()))p.bugs++;p.sat=sat.total;p.peak=Math.max(p.peak||0,p.users)}
  exp=Math.round(exp*(1-Math.min(.2,sumLv('acc')*.02)));const payroll=dailyIK();inc=Math.round(inc);S.cash+=inc-exp;exp+=payroll;S.hist.push({d:S.day,inc:inc,exp:exp,u:p&&p.live?p.users:0,nu:nu});S.hist=S.hist.slice(-30);try{const ak=1-Math.min(.2,sumLv('acc')*.02);dailyFin({urun:inc,srv:Math.round(srvCost()*ak),kira:Math.round(OFF().rent*ak),bordro:payroll})}catch(e){console.error(e)}
  if(p&&p.live)log('📅 Gün '+S.day+': '+(nu>=0?'+':'')+fmt(nu)+' kullanıcı · gelir '+fmt(inc)+'🪙 · gider '+fmt(exp)+'🪙');
  if(S.cash<0&&!S.warned){S.warned=1;P().toast('⚠️ Buludex kasası ekside! Finans → şirkete para aktar')}}
/* oyun saati ilerledikçe (açık ya da kapalı) */
function tick(min,atDesk){const S=st();if(min<=0)return;work(min,atDesk);try{incTick(min)}catch(e){}const d=P().day;while(S.lastDay<d){S.lastDay++;S.day=S.lastDay;daily()}if(OPEN)renderSoft()}

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
#tyc .types select{width:100%;margin:6px 0;box-sizing:border-box}#tyc .types .row{flex-wrap:wrap}
#tyc .log div{font-size:12px;padding:3px 0;border-bottom:1px dashed #21262d}
@media (max-width:760px),(max-height:520px){#tyc.on{grid-template-columns:62px 1fr;grid-template-rows:48px 1fr}#tyc .nav button{padding:8px 6px;font-size:18px;text-align:center}#tyc .nav button span,#tyc .nav small{display:none}#tyc .tb{gap:8px;padding:0 8px}#tyc .tb .lg{display:none}#tyc .tb .pill{padding:4px 8px;font-size:12px}#tyc .main{padding:12px}}`;
const NAV=[['panel','📊','Panel'],['urun','🧪','Ürünler'],['ekip','👥','Ekip'],['ik','🧑‍💼','İşe alım'],['ofis','🏢','Ofis'],['sunucu','🖧','Sunucular'],['dept','🏛️','Departmanlar'],['pazar','📣','Pazarlama'],['satis','🤝','Satış'],['finans','💰','Finans'],['yatirim','💎','Yatırımcılar']];
function el(t,c,h){const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function ensureUI(){if(root)return;const s=document.createElement('style');s.textContent=css;document.head.appendChild(s);root=el('div','');root.id='tyc';document.body.appendChild(root);
  root.addEventListener('pointerdown',e=>e.stopPropagation());root.addEventListener('keydown',e=>e.stopPropagation())}
function hhmm(m){m=((m%1440)+1440)%1440;const h=Math.floor(m/60),n=Math.floor(m%60);return (h<10?'0':'')+h+':'+(n<10?'0':'')+n}
function topBar(){const S=st();const tb=el('div','tb');tb.innerHTML='<span class="lg">💼 <b>Buludex</b> Yönetim</span><span class="pill cash'+(S.cash<0?' neg':'')+'" id="tycCash">🪙 '+fmt(S.cash)+'</span><span class="pill" id="tycDate">📅 Gün '+P().day+' · '+hhmm(P().GT)+'</span>';
  const sp=el('div','sp');[[0,'⏸'],[1,'1x'],[2,'2x'],[4,'4x']].forEach(q=>{const b=el('button',S.speed===q[0]?'on':'',q[1]);b.onclick=()=>{S.speed=q[0];render()};sp.appendChild(b)});tb.appendChild(sp);
  const x=el('button','x','✕ Kapat');x.onclick=close;tb.appendChild(x);return tb}
function nav(){const n=el('div','nav');NAV.forEach(q=>{const b=el('button',TAB===q[0]?'on':'',q[1]+' <span>'+q[2]+'</span>');b.onclick=()=>{TAB=q[0];render()};n.appendChild(b)});return n}
function render(){if(!OPEN)return;ensureUI();root.innerHTML='';root.appendChild(topBar());root.appendChild(nav());const m=el('div','main');root.appendChild(m);(VIEWS[TAB]||VIEWS.panel)(m)}
function renderSoft(){const now=performance.now();if(now-softT<400)return;softT=now;const S=st();const c=document.getElementById('tycCash');if(c){c.textContent='🪙 '+fmt(S.cash);c.classList.toggle('neg',S.cash<0)}const d=document.getElementById('tycDate');if(d)d.textContent='📅 Gün '+P().day+' · '+hhmm(P().GT);
  document.querySelectorAll('#tyc [data-prog]').forEach(b=>{const e=S.team.find(q=>q.id===b.dataset.prog);if(e&&e.task)b.style.width=Math.min(100,e.prog/workNeed(e.task.k,e.task.id)*100)+'%'});
  document.querySelectorAll('#tyc [data-inv]').forEach(x=>{const [k,id]=x.dataset.inv.split(':');x.textContent=S.inv[k][id]});
  if(now-(renderSoft.full||0)>2500){renderSoft.full=now;if(TAB==='panel'||TAB==='urun')render()}}
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


/* =====================================================================
   EKİP & İK: roller, kişilik, işe alım (ilan → aday → mülakat → teklif/pazarlık), referans, oyun karakterleri,
   motivasyon (mesai, maaş, konfor, ikramiye, etkinlik), eğitim, terfi, işten çıkarma
   ===================================================================== */
const ROLES={
  fe:{n:'Frontend geliştirici',ic:'🧑‍💻',sk:{fe:1},base:30000},be:{n:'Backend geliştirici',ic:'👨‍💻',sk:{be:1},base:33000},mob:{n:'Mobil geliştirici',ic:'📱',sk:{fe:.8,be:.6},base:32000},
  ds:{n:'Tasarımcı',ic:'🎨',sk:{ds:1},base:27000},ops:{n:'Sistem yöneticisi',ic:'🖧',sk:{be:.6},base:31000},qa:{n:'QA tester',ic:'🐞',sk:{be:.4,qa:1},base:24000},
  mkt:{n:'Pazarlamacı',ic:'📣',sk:{},base:26000},sales:{n:'Satışçı',ic:'🤝',sk:{},base:25000},hr:{n:'İK uzmanı',ic:'🧑‍💼',sk:{},base:24000},acc:{n:'Muhasebeci',ic:'🧾',sk:{},base:25000},pm:{n:'Proje yöneticisi',ic:'📋',sk:{fe:.4,be:.4},base:36000}};
/* pasif katkılar (geliştirici olmayanlar) */
const PASSIVE={mkt:'Kullanıcı büyümesi +%4/seviye',sales:'Gelir +%3/seviye',hr:'Aday sayısı ve kalitesi artar, moral düşüşü yavaşlar',acc:'Giderler −%2/seviye',ops:'Sunucu kapasitesi +%10/seviye',pm:'Tüm ekibin hızı +%5/seviye (en çok %30)',qa:'Hata düzeltme ×1,5 ve yeni hata riski azalır'};
const TRAITS={caliskan:['💪 Çalışkan','Hız +%15'],tembel:['🦥 Tembel','Hız −%20, moral çabuk düşer'],yaratici:['✨ Yaratıcı','Arayüz ve grafikte +%15'],titiz:['🔍 Titiz','Yeni hata riski −%40'],
  sosyal:['🗣️ Sosyal','Takım morali +'],hirsli:['🚀 Hırslı','Hızlı ama terfi bekler'],daginik:['🌀 Dağınık','Hata riski +%40']};
const GOOD=['caliskan','yaratici','titiz','sosyal','hirsli'],BAD=['tembel','daginik'];
const QS=[['🛠️ Teknik soru: bu ürünün mimarisini nasıl kurarsın?','skill'],['🕗 Gerekirse hafta sonu çalışır mısın?','caliskan|tembel'],['🧩 Bir projede işler ters gidince ne yaparsın?','titiz|daginik'],
  ['🎨 En gurur duyduğun işini anlat','yaratici'],['👥 Ekip çalışmasında rolün nedir?','sosyal'],['📈 5 yıl sonra kendini nerede görüyorsun?','hirsli'],['💰 Neden önceki işinden ayrılıyorsun?','tembel|daginik']];
const NAMES=['Elif','Mert','Zeynep','Can','Ece','Burak','Selin','Emre','Defne','Kaan','İrem','Onur','Melis','Arda','Nazlı','Barış','Ceren','Tolga','Damla','Kerem','Aslı','Umut','Pelin','Yiğit','Gizem','Deniz','Ozan','Buse','Efe','Sena'];
const SURN=['Yılmaz','Kaya','Demir','Şahin','Çelik','Aydın','Öztürk','Arslan','Doğan','Kılıç','Aslan','Koç','Kurt','Özdemir','Polat','Erdem','Ateş','Güneş','Tekin','Uçar'];
const FACES=['👩','👨','🧑','👩‍🦱','👨‍🦱','👩‍🦰','🧔','👱‍♀️','👱','👩‍🦳'],TINT=['#3a8ee6','#e8833a','#3fb950','#a371f7','#db61a2','#d29922','#2ea6a6'];
/* oyun karakterleri (Gökay hariç) */
const CHARS={kiz:{n:'Denel',fit:'mkt',lv:6,tr:['caliskan','sosyal']},abla:{n:'Çiço',fit:'pm',lv:5,tr:['titiz','sosyal']},esi:{n:'Gökhan',fit:'sales',lv:5,tr:['sosyal','hirsli']},
  almira:{n:'Almira',fit:'hr',lv:4,tr:['titiz','caliskan']},berke:{n:'Berke',fit:'ops',lv:5,tr:['caliskan','titiz']}};
const rnd=Math.random,pickA=a=>a[Math.floor(rnd()*a.length)];
function ensureIK(){const S=st();S.cands=S.cands||[];S.ads=S.ads||[];S.comfort=S.comfort||{chair:0,coffee:0,plants:0,game:0};S.charOffers=S.charOffers||{};
  S.team.forEach(e=>{if(e.founder){e.role=e.role||'CEO';e.rk=e.rk||'ceo';e.title=e.title||'CEO';e.mot=e.mot!=null?e.mot:(e.mood||85);e.traits=e.traits||['caliskan','hirsli'];e.sal=0;e.lv=e.lv||6;e.spd=e.spd||1}
    if(e.mot==null)e.mot=e.mood!=null?e.mood:75});return S}
function sumLv(rk){return st().team.filter(e=>e.rk===rk&&!e.away).reduce((s,e)=>s+e.lv,0)}
function mkSkills(rk,lv){const s={fe:0,be:0,ds:0,qa:0},m=ROLES[rk].sk;Object.keys(m).forEach(k=>s[k]=Math.max(1,Math.round(lv*m[k]*10)/10));return s}
function newCand(rk,o){o=o||{};const S=st(),hrB=Math.min(2,sumLv('hr')*.15),lv=clamp(Math.round(o.lv||(2+rnd()*5+hrB+(o.ref?1:0))),1,10);
  const nt=1+(rnd()<.5?1:0),tr=[];while(tr.length<nt){const t=(rnd()<(o.ref?.12:.3))?pickA(BAD):pickA(GOOD);if(tr.indexOf(t)<0&&!(t==='tembel'&&tr.indexOf('caliskan')>=0)&&!(t==='caliskan'&&tr.indexOf('tembel')>=0))tr.push(t)}
  const shown=o.ref?tr.slice():tr.filter(()=>rnd()<.35);const inflate=o.ref?0:(rnd()<.35?1+Math.floor(rnd()*2):0);
  const exp=Math.round(ROLES[rk].base*(.55+lv*.1)*(.9+rnd()*.25)/500)*500;
  return {id:'c'+Date.now().toString(36)+Math.floor(rnd()*1e4),n:o.n||pickA(NAMES)+' '+pickA(SURN),rk:rk,lv:lv,cvLv:clamp(lv+inflate,1,10),spd:+(.85+rnd()*.35).toFixed(2),traits:tr,shown:shown,exp:exp,face:pickA(FACES),tint:pickA(TINT),
    ref:o.ref||null,asked:[],skillKnown:!!o.ref,neg:0,day:S.day,ttl:o.ref?12:6,char:o.char||null}}
function stars(n){const k=Math.round(n/2);return '★★★★★'.slice(0,k)+'<span style="opacity:.3">'+'★★★★★'.slice(k)+'</span>'}
/* iş ilanı: süre boyunca her gün aday gelir */
const AD={3:2500,7:5000,14:8500};
function postAd(rk,days){const S=st();const c=AD[days];if(S.cash<c){P().toast('Kasada yeterli para yok');return}S.cash-=c;S.ads.push({rk:rk,until:S.day+days,day:S.day});log('📢 İlan: '+ROLES[rk].n+' · '+days+' gün · −'+fmt(c)+'🪙');
  for(let i=0;i<1+Math.floor(rnd()*2);i++)S.cands.push(newCand(rk));render()}
/* mülakat: soru gizli özelliği ortaya çıkarır */
function ask(c,qi){const S=st();if(c.asked.length>=3||c.asked.indexOf(qi)>=0)return;c.asked.push(qi);const k=QS[qi][1];let ans='';
  if(k==='skill'){c.skillKnown=true;ans=c.cvLv>c.lv?'Cevapları yüzeysel kaldı · gerçek seviye '+c.lv+' (CV\'de '+c.cvLv+')':'Çok net anlattı · seviye '+c.lv+' doğrulandı'}
  else{const hit=k.split('|').find(t=>c.traits.indexOf(t)>=0);if(hit){if(c.shown.indexOf(hit)<0)c.shown.push(hit);ans='Ortaya çıktı: '+TRAITS[hit][0]}else ans='Belirgin bir şey çıkmadı'}
  c.notes=(c.notes||[]).concat([QS[qi][0]+' → '+ans]);render()}
/* teklif ve pazarlık */
function offer(c,sal){const S=st();const r=sal/c.exp,trust=c.ref?.12:0,p=clamp(.15+(r-.85)*2.2+trust,0,.97);
  if(rnd()<p){hire(c,sal);return}
  if(c.neg<2&&r>.78){c.neg++;c.counter=Math.round(c.exp*(1+.04*c.neg)/500)*500;P().toast('💬 '+c.n+': "'+fmt(c.counter)+'🪙 olursa kabul ederim"');render();return}
  S.cands=S.cands.filter(q=>q!==c);P().toast('🙅 '+c.n+' teklifi reddetti');log('🙅 '+c.n+' teklifi reddetti');render()}
function hire(c,sal){const S=st();S.cands=S.cands.filter(q=>q!==c);const e={id:'e'+Date.now().toString(36),n:c.n,rk:c.rk,role:ROLES[c.rk].n,title:ROLES[c.rk].n,lv:c.lv,spd:c.spd,sal:sal,mot:c.ref?85:75,traits:c.traits,shown:c.traits.slice(),
  sk:mkSkills(c.rk,c.lv),task:null,prog:0,hired:S.day,face:c.face,tint:c.tint,ot:false,promo:S.day,ref:c.ref,char:c.char||null};S.team.push(e);
  const dev=Object.keys(ROLES[c.rk].sk).length;if(dev){if(e.sk.ds>=e.sk.fe&&e.sk.ds>=e.sk.be)setTask(e,'comp','gfx');else if(e.sk.fe>=e.sk.be)setTask(e,'comp','ui');else setTask(e,'comp','be');if(c.rk==='qa')setTask(e,'fix','bug')}
  log('🤝 '+e.n+' işe başladı · '+e.title+' · '+fmt(sal)+'🪙/10 gün');P().toast('🤝 '+e.n+' Buludex ekibine katıldı!');P().sfx('coin');render()}
/* oyun karakterine teklif (kabul o karakterin oyununda; burada ilişki ve maaşa göre ön yanıt) */
function charOffer(k,rk,sal){const S=st(),C=CHARS[k],cur=P().charSal(k)||25000,bond=P().bond(k),p=clamp(.25+bond/200+(sal/cur-1)*.9,.05,.95);
  if(rnd()<p){const e={id:'ch_'+k,n:C.n,rk:rk,role:ROLES[rk].n,title:ROLES[rk].n,lv:C.lv+(C.fit===rk?0:-2),spd:1,sal:sal,mot:88,traits:C.tr,shown:C.tr.slice(),sk:mkSkills(rk,C.lv+(C.fit===rk?0:-2)),task:null,prog:0,hired:S.day,face:'⭐',tint:'#d29922',ot:false,promo:S.day,char:k};
    S.team=S.team.filter(q=>q.id!==e.id);S.team.push(e);if(Object.keys(ROLES[rk].sk).length)setTask(e,'comp',e.sk.ds>e.sk.fe?'gfx':e.sk.fe>=e.sk.be?'ui':'be');
    P().hireChar(k,{t:ROLES[rk].n,sal:sal});log('⭐ '+C.n+' teklifi kabul etti · '+ROLES[rk].n+(P().charJob(k)!=='Buludex'?' · '+P().charJob(k)+'\'dan ayrılacak':''));P().toast('⭐ '+C.n+' "Varım!" dedi · onunla oynarken işi Buludex olacak');P().sfx('coin')}
  else{S.charOffers[k]=S.day;P().toast('🙂 '+C.n+': "Şimdilik kendi işimde kalayım, sağ ol"');log('🙂 '+C.n+' teklifi şimdilik geri çevirdi')}render()}
/* motivasyon, eğitim, terfi, ikramiye, işten çıkarma */
function comfortLv(){const c=st().comfort;return c.chair*6+c.coffee*8+c.plants*4+c.game*7}
function bonus(e){const S=st(),c=Math.round(e.sal*.3);if(S.cash<c){P().toast('Kasa yetmiyor');return}S.cash-=c;e.mot=clamp(e.mot+15,0,100);log('🎁 '+e.n+'\'e ikramiye · −'+fmt(c)+'🪙');render()}
function train(e){const S=st(),c=6000+e.lv*1500;if(S.cash<c){P().toast('Kasa yetmiyor');return}if(e.lv>=10){P().toast('En üst seviyede');return}S.cash-=c;e.away=S.day+3;e.trainTo=e.lv+1;e.mot=clamp(e.mot+8,0,100);log('🎓 '+e.n+' 3 günlük eğitime gitti · −'+fmt(c)+'🪙');render()}
function promote(e){const S=st();e.sal=Math.round(e.sal*1.15/500)*500;e.mot=clamp(e.mot+20,0,100);e.promo=S.day;e.title=(/^Kıdemli /.test(e.title)?'Lider ':'Kıdemli ')+ROLES[e.rk].n;e.lv=Math.min(10,e.lv+(e.traits.indexOf('hirsli')>=0?1:0));e.sk=mkSkills(e.rk,e.lv);log('⬆️ '+e.n+' terfi etti: '+e.title+' · '+fmt(e.sal)+'🪙/10 gün');if(e.char)P().hireChar(e.char,{t:e.title,sal:e.sal,st:'kabul'});render()}
function fire(e,why){const S=st();if(e.founder)return;const sev=Math.round(e.sal*.5);S.cash-=sev;S.team=S.team.filter(q=>q!==e);S.team.forEach(q=>{if(!q.founder)q.mot=clamp(q.mot-5,0,100)});
  log((why==='istifa'?'🚪 '+e.n+' istifa etti':'✂️ '+e.n+' işten çıkarıldı · tazminat '+fmt(sev)+'🪙'));if(e.char)P().fireChar(e.char,why==='istifa'?'Buludex\'ten istifa ettin.':'Oğuz seni Buludex\'ten çıkardı. Tazminatın yattı.');render()}
function teamEvent(){const S=st(),n=S.team.length,c=1500*n;if(S.cash<c){P().toast('Kasa yetmiyor');return}S.cash-=c;S.team.forEach(e=>e.mot=clamp(e.mot+10,0,100));log('🎳 Takım etkinliği · −'+fmt(c)+'🪙 · herkesin morali +10');P().sfx('coin');render()}
function buyComfort(k){const S=st(),C={chair:[4000,'🪑 Ergonomik sandalyeler'],coffee:[6000,'☕ Kahve makinesi'],plants:[1500,'🪴 Bitkiler'],game:[9000,'🎮 Oyun köşesi']}[k];if(S.comfort[k]>=3){P().toast('En üst seviye');return}
  if(S.cash<C[0]){P().toast('Kasa yetmiyor');return}S.cash-=C[0];S.comfort[k]++;log(C[1]+' · seviye '+S.comfort[k]+' · −'+fmt(C[0])+'🪙');render()}
/* günlük İK: maaş, moral, istifa, eğitim dönüşü, ilan adayları, referans araması */
function dailyIK(){const S=ensureIK();let pay=0;const accK=1-Math.min(.2,sumLv('acc')*.02),soc=S.team.filter(e=>e.traits.indexOf('sosyal')>=0).length,hrK=Math.min(.5,sumLv('hr')*.05);
  S.team.forEach(e=>{if(e.founder)return;pay+=e.sal/10;
    if(e.away&&S.day>=e.away){e.away=0;e.lv=e.trainTo||e.lv;e.sk=mkSkills(e.rk,e.lv);log('🎓 '+e.n+' eğitimden döndü · seviye '+e.lv)}
    const mkt=ROLES[e.rk].base*(.55+e.lv*.1),salK=(e.sal/mkt-1)*8;let d=-.8*(1-hrK)+salK*.5+comfortLv()*.04+soc*.4+(e.ot?-2.2:0)+(e.traits.indexOf('tembel')>=0?-.6:0)+(S.cash<0?-4:0)+(deskOf(e)?0:-2)+(e.traits.indexOf('hirsli')>=0&&S.day-e.promo>20?-1.2:0);
    e.mot=clamp(e.mot+d,0,100);if(e.mot<25&&rnd()<.08+(25-e.mot)*.01){P().toast('🚪 '+e.n+' istifa etti! (moral düşüktü)');fire(e,'istifa')}});
  pay=Math.round(pay*accK);S.cash-=pay;if(pay)S.lastPay=pay;
  S.ads=S.ads.filter(a=>a.until>=S.day);S.ads.forEach(a=>{const n=(rnd()<.6?1:0)+(rnd()<hrK+.15?1:0);for(let i=0;i<n;i++)S.cands.push(newCand(a.rk))});
  S.cands=S.cands.filter(c=>S.day-c.day<=c.ttl);
  /* referans: Denel, Çiço, Gökhan, Berke, Almira ara sıra arar */
  if(P().ceo&&S.product&&rnd()<.18&&!S.refToday){S.refToday=S.day;const who=pickA(Object.keys(CHARS)),rk=pickA(['fe','be','mob','ds','qa','pm']),c=newCand(rk,{ref:CHARS[who].n,lv:4+Math.floor(rnd()*4)});c.roleN=ROLES[rk].n;c.lvTxt=['işinde çok iyi','çok çalışkan biri','yaratıcı biri','tecrübeli'][Math.floor(rnd()*4)];
    setTimeout(()=>{const ok=P().refCall(who,c,acc=>{if(acc){st().cands.unshift(c);log('📞 '+CHARS[who].n+' aday önerdi: '+c.n+' ('+ROLES[rk].n+') · referanslı');P().toast('📄 '+c.n+' adayı İK havuzuna eklendi (referans: '+CHARS[who].n+')')}});
      if(!ok){st().cands.unshift(c);log('📨 '+CHARS[who].n+' mesaj attı: aday önerisi '+c.n)}},4000)}
  if(S.refToday!==S.day)S.refToday=0;return pay}
/* üretim hızına İK etkileri */
function trMul(e,k,id){let m=e.spd||1;const t=e.traits||[];if(t.indexOf('caliskan')>=0)m*=1.15;if(t.indexOf('tembel')>=0)m*=.8;if(t.indexOf('hirsli')>=0)m*=1.08;if(t.indexOf('yaratici')>=0&&k==='comp'&&(id==='ui'||id==='gfx'))m*=1.15;
  if(e.ot)m*=1.3;m*=1+Math.min(.3,sumLv('pm')*.05);return m}
function bugMul(){const T=st().team;let m=1;if(T.some(e=>e.traits&&e.traits.indexOf('titiz')>=0))m*=.6;if(T.some(e=>e.traits&&e.traits.indexOf('daginik')>=0))m*=1.4;if(sumLv('qa'))m*=.8;return m}
/* ---------------- görünümler: Ekip, İşe alım, Ofis ---------------- */
function avatar(e){return '<span style="display:inline-grid;place-items:center;width:42px;height:42px;border-radius:50%;background:'+(e.tint||'#30363d')+';font-size:24px;flex:none">'+(e.char&&P().charImg(e.char)?'<img src="'+P().charImg(e.char)+'" style="width:42px;height:42px;border-radius:50%;object-fit:cover">':(e.face||'🧑'))+'</span>'}
function trTags(e,all){return (all?e.traits:(e.shown||[])).map(t=>'<span class="tag '+(BAD.indexOf(t)>=0?'no':'ok')+'" title="'+TRAITS[t][1]+'">'+TRAITS[t][0]+'</span>').join('')+(!all&&(e.shown||[]).length<e.traits.length?'<span class="tag">❔ gizli özellik</span>':'')}
VIEWS.ekip=function(m){const S=ensureIK();m.appendChild(el('h2','','👥 Ekip · '+S.team.length+' kişi'));const pay=S.team.reduce((s,e)=>s+(e.sal||0)/10,0);
  m.appendChild(el('p','muted','Günlük maaş yükü '+fmt(pay)+'🪙 · ofis konforu '+comfortLv()+' · Oğuz CEO (yalnız bu ekran açıkken üretir), çalışanlar her zaman.'));
  const ev=el('button','btn s','🎳 Takım etkinliği · '+fmt(1500*S.team.length)+'🪙');ev.onclick=teamEvent;m.appendChild(ev);
  S.team.forEach(e=>{const c=el('div','card');c.style.marginTop='10px';const dev=e.founder||Object.keys((ROLES[e.rk]||{sk:{}}).sk).length>0;
    c.innerHTML='<div class="row" style="justify-content:flex-start;gap:10px">'+avatar(e)+'<div style="flex:1"><b>'+e.n+'</b> <span class="tag">'+e.title+'</span>'+(e.founder?'':'<span class="tag">Sv '+e.lv+'</span><span class="tag">'+fmt(e.sal)+'🪙/10 gün</span>')+(e.ref?'<span class="tag ok">referans: '+e.ref+'</span>':'')+(e.char?'<span class="tag ok">⭐ tanıdık</span>':'')+(e.away?'<span class="tag">🎓 eğitimde (Gün '+e.away+')</span>':'')+'<div>'+trTags(e,true)+'</div></div></div>';
    const mr=el('div','row');mr.innerHTML='<span class="muted" style="width:70px">Motivasyon</span>';const mb=el('div','bar');mb.innerHTML='<i style="width:'+Math.round(e.mot)+'%;background:'+(e.mot>60?'#3fb950':e.mot>30?'#d29922':'#f85149')+'"></i>';mr.appendChild(mb);mr.appendChild(el('b','',Math.round(e.mot)+'%'));c.appendChild(mr);
    if(dev){const sel=document.createElement('select');sel.innerHTML='<option value="">— boşta —</option><optgroup label="Bileşen üret">'+Object.keys(COMP).map(k=>'<option value="comp:'+k+'">'+COMP[k].ic+' '+COMP[k].n+'</option>').join('')+'</optgroup><optgroup label="Modül topla">'+Object.keys(MOD).map(k=>'<option value="mod:'+k+'">'+MOD[k].ic+' '+MOD[k].n+'</option>').join('')+'</optgroup><option value="fix:bug">🐞 Hata düzelt</option>';
      sel.value=e.task?e.task.k+':'+e.task.id:'';sel.onchange=()=>{const v=sel.value;if(!v)setTask(e,null);else{const [k,id]=v.split(':');setTask(e,k,id)}render()};const r=el('div','row');r.appendChild(sel);const b=el('div','bar');b.innerHTML='<i data-prog="'+e.id+'" style="width:'+(e.task?Math.min(100,e.prog/workNeed(e.task.k,e.task.id)*100):0)+'%"></i>';r.appendChild(b);c.appendChild(r);
      if(e.task)c.appendChild(el('div','muted','Hız: '+rate(e,e.task.k,e.task.id).toFixed(2)+' iş/dk'+(e.task.k==='mod'&&!e.holding&&!canStart('mod',e.task.id)?' · ⏳ bileşen bekliyor':'')))}
    if(PASSIVE[e.rk])c.appendChild(el('div','muted','Katkı: '+PASSIVE[e.rk]));
    if(!e.founder){const a=el('div','row');a.style.justifyContent='flex-start';a.style.flexWrap='wrap';const B=(t,f,cls)=>{const x=el('button','btn '+(cls||'s'),t);x.onclick=f;a.appendChild(x)};
      B(e.ot?'⏰ Mesai: açık':'⏰ Fazla mesai',()=>{e.ot=!e.ot;render()});B('🎁 İkramiye · '+fmt(e.sal*.3)+'🪙',()=>bonus(e));if(!e.away)B('🎓 Eğitim · '+fmt(6000+e.lv*1500)+'🪙',()=>train(e));B('⬆️ Terfi (+%15)',()=>promote(e));B('✂️ Çıkar',()=>{if(confirm(e.n+' işten çıkarılsın mı? Tazminat '+fmt(e.sal*.5)+'🪙'))fire(e)},'s');c.appendChild(a)}
    m.appendChild(c)})};
VIEWS.ik=function(m){const S=ensureIK();m.appendChild(el('h2','','🧑‍💼 İşe alım'));
  const ad=el('div','card');ad.innerHTML='<b>📢 İş ilanı ver</b><p class="muted">İlan süresince her gün yeni adaylar gelir. İK uzmanı aday sayısını ve kalitesini artırır.</p>';const rs=document.createElement('select');rs.innerHTML=Object.keys(ROLES).map(k=>'<option value="'+k+'">'+ROLES[k].ic+' '+ROLES[k].n+'</option>').join('');ad.appendChild(rs);
  Object.keys(AD).forEach(d=>{const b=el('button','btn s',d+' gün · '+fmt(AD[d])+'🪙');b.style.marginLeft='6px';b.onclick=()=>postAd(rs.value,+d);ad.appendChild(b)});
  if(S.ads.length)ad.appendChild(el('div','muted','Aktif ilanlar: '+S.ads.map(a=>ROLES[a.rk].n+' (Gün '+a.until+'\'e kadar)').join(' · ')));m.appendChild(ad);
  m.appendChild(el('h3','','📄 Aday havuzu ('+S.cands.length+')'));if(!S.cands.length)m.appendChild(el('div','card muted','Henüz aday yok. İlan ver ya da tanıdıklarından referans bekle.'));
  const g=el('div','types');m.appendChild(g);S.cands.forEach(c=>{const k=el('div','card');k.style.cursor='default';
    k.innerHTML='<div class="row" style="justify-content:flex-start;gap:10px">'+avatar(c)+'<div><b>'+c.n+'</b><div class="muted">'+ROLES[c.rk].ic+' '+ROLES[c.rk].n+'</div></div></div><div class="row"><span>Beceri</span><span style="color:#d29922">'+stars(c.skillKnown?c.lv:c.cvLv)+(c.skillKnown?'':' <span class="muted">(CV)</span>')+'</span></div><div class="row"><span>Maaş beklentisi</span><b>'+fmt(c.exp)+'🪙/10 gün</b></div><div>'+trTags(c,false)+'</div>'+(c.ref?'<div class="tag ok">🤝 Referans: '+c.ref+' · güvenilir</div>':'')+(c.notes?'<div class="muted">'+c.notes.join('<br>')+'</div>':'');
    if(c.asked.length<3){const q=document.createElement('select');q.innerHTML='<option value="">🎤 Mülakat sorusu seç ('+(3-c.asked.length)+' hak)</option>'+QS.map((x,i)=>c.asked.indexOf(i)<0?'<option value="'+i+'">'+x[0]+'</option>':'').join('');q.onchange=()=>{if(q.value!=='')ask(c,+q.value)};k.appendChild(q)}
    const o=el('div','row');o.style.flexWrap='wrap';o.style.justifyContent='flex-start';[[.9,'−%10'],[1,'Beklenti'],[1.1,'+%10']].forEach(q=>{const v=Math.round(c.exp*q[0]/500)*500,b=el('button','btn '+(q[0]===1?'':'s'),q[1]+' · '+fmt(v));b.onclick=()=>offer(c,v);o.appendChild(b)});
    if(c.counter){const b=el('button','btn b','Karşı teklif · '+fmt(c.counter));b.onclick=()=>hire(c,c.counter);o.appendChild(b)}const x=el('button','btn s','✖');x.onclick=()=>{S.cands=S.cands.filter(q=>q!==c);render()};o.appendChild(x);k.appendChild(o);g.appendChild(k)});
  if(P().ceo){m.appendChild(el('h3','','⭐ Tanıdıkları işe al'));const t=el('div','card');t.appendChild(el('div','muted','Kabul ederlerse o karakterle oynarken işi Buludex olur, maaşı şirketten ödenir; mevcut işi varsa "istifa edip geç" seçeneği çıkar.'));
    Object.keys(CHARS).forEach(k=>{const C=CHARS[k];const inT=S.team.find(e=>e.char===k);const r=el('div','row');r.style.flexWrap='wrap';r.innerHTML='<span style="display:flex;align-items:center;gap:8px">'+avatar({char:k,face:'⭐',tint:'#d29922'})+'<b>'+C.n+'</b> <span class="muted">· şu an: '+(P().charJob(k)||'—')+' · bağ %'+Math.round(P().bond(k))+'</span></span>';
      if(inT)r.appendChild(el('span','tag ok','Ekipte · '+inT.title));else if(S.charOffers[k]===S.day)r.appendChild(el('span','tag','Bugün sordun'));else{const sel=document.createElement('select');sel.innerHTML=Object.keys(ROLES).map(q=>'<option value="'+q+'"'+(q===C.fit?' selected':'')+'>'+ROLES[q].n+'</option>').join('');const sal=Math.round(((P().charSal(k)||25000)*1.1)/500)*500;
        const b=el('button','btn b','Teklif · '+fmt(sal)+'🪙');b.onclick=()=>charOffer(k,sel.value,sal);r.appendChild(sel);r.appendChild(b)}t.appendChild(r)});m.appendChild(t)}};
VIEWS.ofis=function(m){const S=ensureIK();m.appendChild(el('h2','','🏢 Ofis'));m.appendChild(el('div','card','<b>'+S.office+'</b><p class="muted">Konfor puanı '+comfortLv()+' · motivasyonu her gün artırır. Ofis kiralama bir sonraki adımda.</p>'));
  const g=el('div','grid');m.appendChild(g);[['chair',4000,'🪑 Ergonomik sandalyeler'],['coffee',6000,'☕ Kahve makinesi'],['plants',1500,'🪴 Bitkiler'],['game',9000,'🎮 Oyun köşesi']].forEach(q=>{const c=el('div','card');c.innerHTML='<b>'+q[2]+'</b><div class="muted">Seviye '+S.comfort[q[0]]+'/3</div>';const b=el('button','btn s','Al · '+fmt(q[1])+'🪙');b.disabled=S.comfort[q[0]]>=3;b.onclick=()=>buyComfort(q[0]);c.appendChild(b);g.appendChild(c)})};

/* =====================================================================
   OFİS (2D plan, sürükle-bırak, taşınma kademeleri) · SUNUCULAR (ev, rack, bulut, veri merkezi) · KESİNTİLER + nöbet mini oyunu
   ===================================================================== */
const OFFICES=[
  {k:'ev',n:'Ev odası',ic:'🏠',w:6,h:5,rent:0,dep:0,move:0,racks:1,note:'Oğuz\'un çalışma odası'},
  {k:'garaj',n:'Garaj ofis',ic:'🚗',w:9,h:7,rent:400,dep:4000,move:3000,racks:2,note:'Karabağlar\'da kiralık garaj'},
  {k:'kucuk',n:'Küçük ofis · Bayraklı',ic:'🏢',w:12,h:9,rent:1500,dep:30000,move:8000,racks:4,note:'Bayraklı\'da 2+1 ofis katı'},
  {k:'plazakat',n:'Plaza katı',ic:'🏙️',w:18,h:12,rent:5000,dep:100000,move:20000,racks:8,note:'Bayraklı plazasında bir kat'},
  {k:'plaza',n:'Tüm plaza',ic:'🌆',w:26,h:16,rent:16000,dep:400000,move:60000,racks:20,note:'Plazanın tamamı'},
  {k:'gokdelen',n:'Buludex Tower · Halkapınar',ic:'🗼',w:34,h:22,rent:8000,dep:0,move:120000,buy:12000000,racks:40,note:'Kendi gökdelenin (satın alma + bakım)'}];
const ITEMS={
  desk:{n:'Masa + bilgisayar',ic:'🖥️',w:2,h:1,c:2500,desk:true},chair:{n:'Ergonomik sandalye',ic:'🪑',w:1,h:1,c:1500,cf:2},plant:{n:'Bitki',ic:'🪴',w:1,h:1,c:600,cf:2},
  coffee:{n:'Kahve makinesi',ic:'☕',w:1,h:1,c:6000,cf:8},kitchen:{n:'Mutfak',ic:'🍳',w:2,h:2,c:15000,cf:10},game:{n:'Oyun alanı',ic:'🎮',w:2,h:2,c:12000,cf:8},
  meet:{n:'Toplantı odası',ic:'🗣️',w:3,h:3,c:25000,cf:6,prod:.04}};
const PCT=[['Ofis bilgisayarı',1,0],['İş istasyonu',1.12,6000],['Üst düzey iş istasyonu',1.25,15000]];
function ensureOS(){const S=st();if(!S.of){S.of={tier:0,items:[],store:[]};S.of.items.push({id:'i1',t:'desk',x:0,y:0,pc:0});S.nid=S.nid||2}
  if(!S.srv)S.srv={racks:[],cloud:0,dc:{land:0,power:0,cooling:0,gen:0},inc:null,incLog:[]};S.nid=S.nid||100;
  /* v119 eski konfor sayaçları → plan eşyası */if(S.comfort&&!S.comfortMig){S.comfortMig=1;const m={chair:'chair',coffee:'coffee',plants:'plant',game:'game'};Object.keys(m).forEach(k=>{for(let i=0;i<(S.comfort[k]||0);i++)S.of.store.push({id:'i'+(S.nid++),t:m[k]})})}
  return S}
function OFF(){return OFFICES[ensureOS().of.tier]}
function cellsOf(it){const I=ITEMS[it.t],r=it.r?1:0;return {w:r?I.h:I.w,h:r?I.w:I.h}}
function fits(it,x,y,ignore){const S=st(),o=OFF(),c=cellsOf(it);if(x<0||y<0||x+c.w>o.w||y+c.h>o.h)return false;for(const q of S.of.items){if(q===ignore||q===it)continue;const d=cellsOf(q);if(x<q.x+d.w&&x+c.w>q.x&&y<q.y+d.h&&y+c.h>q.y)return false}return true}
function placeFree(it){const o=OFF();for(let y=0;y<o.h;y++)for(let x=0;x<o.w;x++){if(fits(it,x,y)){it.x=x;it.y=y;return true}}return false}
function desks(){return st().of.items.filter(i=>ITEMS[i.t].desk)}
/* masa ataması: çalışan sırasına göre; masası olmayan yavaş çalışır ve morali düşer */
function deskOf(e){const S=st(),i=S.team.indexOf(e),D=desks().slice().sort((a,b)=>a.y-b.y||a.x-b.x);return D[i]||null}
function comfortLv(){const S=ensureOS();let c=0;const cnt={};S.of.items.forEach(i=>{const I=ITEMS[i.t];if(!I.cf)return;cnt[i.t]=(cnt[i.t]||0)+1;const per=Math.max(1,Math.ceil(S.team.length/4));c+=I.cf*(cnt[i.t]<=per?1:.3)});return Math.round(c)}
function meetBoost(){return st().of.items.some(i=>i.t==='meet')?ITEMS.meet.prod:0}
function buyItem(t){const S=ensureOS(),I=ITEMS[t];if(S.cash<I.c){P().toast('Kasa yetmiyor');return}const it={id:'i'+(S.nid++),t:t,pc:0};if(!placeFree(it)){P().toast('📦 Ofiste yer yok · depoya kondu (taşınınca yerleştir)');S.of.store.push(it)}else S.of.items.push(it);S.cash-=I.c;log(I.ic+' '+I.n+' alındı · −'+fmt(I.c)+'🪙');render()}
function sellItem(it){const S=st();S.of.items=S.of.items.filter(q=>q!==it);S.cash+=Math.round(ITEMS[it.t].c*.4);OSEL=null;render()}
function upgradePC(it){const S=st();if(it.pc>=2)return;const c=PCT[it.pc+1][2];if(S.cash<c){P().toast('Kasa yetmiyor');return}S.cash-=c;it.pc++;log('🖥️ Bilgisayar yükseltildi: '+PCT[it.pc][0]+' · −'+fmt(c)+'🪙');render()}
function moveTo(k){const S=ensureOS(),i=OFFICES.findIndex(o=>o.k===k),O=OFFICES[i];if(i<=S.of.tier)return;const cost=(O.buy||0)+O.dep+O.move;if(S.cash<cost){P().toast('Kasa yetmiyor · '+fmt(cost)+'🪙 gerekli');return}
  const old=OFFICES[S.of.tier];S.cash-=cost;S.cash+=Math.round(old.dep*.8);S.of.tier=i;const all=S.of.items.concat(S.of.store);S.of.items=[];S.of.store=[];all.sort((a,b)=>(ITEMS[b.t].w*ITEMS[b.t].h)-(ITEMS[a.t].w*ITEMS[a.t].h)).forEach(it=>{if(placeFree(it))S.of.items.push(it);else S.of.store.push(it)});
  log(O.ic+' Taşındık: '+O.n+' · '+(O.buy?'satın alma '+fmt(O.buy)+' + ':'')+(O.dep?'depozito '+fmt(O.dep)+' + ':'')+'taşınma '+fmt(O.move)+'🪙'+(old.dep?' · eski depozitonun %80\'i iade':''));P().toast(O.ic+' Buludex taşındı: '+O.n);P().sfx('coin');try{P().mem(O.ic,'Buludex '+O.n+'\'na taşındı')}catch(e){}render()}
/* ---------------- sunucular ---------------- */
const CPU=[['4 çekirdek',1,8000],['8 çekirdek',2.3,18000],['16 çekirdek',5,40000]],RAM=[['32 GB',1,3000],['128 GB',1.5,9000],['512 GB',2,28000]],DISK=[['2 TB',2,2000],['8 TB',8,6000],['32 TB',32,18000]];
const DCB={land:['🏞️ Arsa (Kemalpaşa OSB)',450000],power:['⚡ Enerji altyapısı',180000],cooling:['❄️ Soğutma',140000],gen:['🔋 Yedek jeneratör',90000]};
const CLOUD={users:6000,tb:5,cost:600};
function dcOn(){const d=ensureOS().srv.dc;return d.land&&d.power&&d.cooling}
function rackCap(r){return Math.round(1200*CPU[r.c][1]*RAM[r.r][1])}
function rackLimit(){return dcOn()?200:OFF().racks}
function storageNeed(p){if(!p||!p.live)return 0;return p.users*(p.type==='bulut'?.0015:.0002)}/* TB · bulutta kullanıcı başı ~1,5 GB */
function storageHave(){const S=ensureOS();return 2+S.srv.racks.reduce((s,r)=>s+DISK[r.d][1],0)+S.srv.cloud*CLOUD.tb}
function capRaw(){const S=ensureOS();return 800+S.srv.racks.reduce((s,r)=>s+rackCap(r),0)+S.srv.cloud*CLOUD.users}
const INCF={disk:.6,ddos:.35,alarm:.8,guc:.2};
function capOf(){const S=ensureOS();let c=capRaw()*(1+Math.min(1,sumLv('ops')*.1));const I=S.srv.inc;if(I&&!I.done)c*=INCF[I.t];const p=S.product,need=storageNeed(p),have=storageHave();if(need>have)c*=Math.max(.3,have/need);return Math.round(c)}
function srvCost(){const S=ensureOS(),pw=dcOn()?70:120;return 15+S.srv.racks.length*pw+S.srv.cloud*CLOUD.cost+(dcOn()?1500:0)}
function buyRack(c,r,d){const S=ensureOS();if(S.srv.racks.length>=rackLimit()){P().toast(dcOn()?'Veri merkezi dolu':'Ofiste rack yeri kalmadı · taşın ya da veri merkezi kur');return}const cost=CPU[c][2]+RAM[r][2]+DISK[d][2];if(S.cash<cost){P().toast('Kasa yetmiyor');return}
  S.cash-=cost;const k={id:'r'+(S.nid++),c:c,r:r,d:d,day:S.day};S.srv.racks.push(k);log('🖧 Rack sunucu: '+CPU[c][0]+' · '+RAM[r][0]+' · '+DISK[d][0]+' · +'+fmt(rackCap(k))+' kullanıcı · −'+fmt(cost)+'🪙');P().sfx('coin');render()}
function sellRack(k){const S=st();S.srv.racks=S.srv.racks.filter(q=>q!==k);S.cash+=Math.round((CPU[k.c][2]+RAM[k.r][2]+DISK[k.d][2])*.35);render()}
function cloudSet(n){const S=ensureOS();S.srv.cloud=Math.max(0,n);render()}
function buildDC(k){const S=ensureOS(),c=DCB[k][1];if(S.srv.dc[k])return;if(k!=='land'&&!S.srv.dc.land){P().toast('Önce arsa al');return}if(S.cash<c){P().toast('Kasa yetmiyor');return}S.cash-=c;S.srv.dc[k]=1;log(DCB[k][0]+' tamam · −'+fmt(c)+'🪙'+(dcOn()&&k!=='gen'?' · 🏭 veri merkezi çalışıyor':''));render()}
/* ---------------- kesintiler ---------------- */
const INC={disk:{n:'💽 Disk arızası',d:'Bir rack sunucuda disk bozuldu, RAID bozuk modda'},ddos:{n:'🌊 DDoS saldırısı',d:'Binlerce IP\'den sahte trafik geliyor'},alarm:{n:'⏰ Gece yarısı alarmı',d:'Yedekleme işi patladı, disk doldu'},guc:{n:'⚡ Elektrik kesintisi',d:'Veri merkezinde/ofiste güç gitti'}};
const NOB={
  disk:[{log:['[02:13] ata3.00: failed command: READ FPDMA QUEUED','[02:13] md0: Disk failure on sdb, disabling device','[02:13] md0: Operation continuing on 1 devices'],q:'İlk ne yaparsın?',o:[['Arızalı diski diziden çıkar, yedek diski ekleyip RAID rebuild başlat',1],['Sunucuyu hemen yeniden başlat',0],['Veritabanını silip yedekten kur',0],['Sabah bakarım, şimdi uyu',0]]},
        {log:['[02:31] md0: recovery 34% ... finish=41min','[02:31] app: p95 latency 2.1s'],q:'Rebuild sürerken?',o:[['Durum sayfasına bakım notu yaz, ağır raporları kuyruğa al',1],['Rebuild\'i durdurup tekrar başlat',0],['Tüm trafiği kapat',0]]}],
  ddos:[{log:['[21:04] nginx: 48211 req/s (normal 900)','[21:04] top: CPU 99% · load 64.2','[21:04] 3.214 farklı IP · aynı User-Agent'],q:'İlk ne yaparsın?',o:[['CDN/WAF koruma modunu aç, IP başına oran sınırı koy',1],['Sunucuyu kapat, saldırgan sıkılsın',0],['Bütün IP\'leri tek tek elle engelle',0],['Fiyatları düşür',0]]},
        {log:['[21:12] waf: 41k req/s blocked','[21:12] saldırı yeni subnet\'ten devam ediyor'],q:'Saldırı sürüyor, sonra?',o:[['Şüpheli bölge trafiğine geçici CAPTCHA/engelleme koy',1],['WAF\'ı kapat, belki geçer',0],['Veritabanını yeniden başlat',0]]}],
  alarm:[{log:['[00:00] cron: backup.sh FAILED (exit 28)','[00:00] df: /var 100% used','[00:01] app: cannot write session file'],q:'Gece yarısı ne yaparsın?',o:[['Eski logları sıkıştırıp arşive taşı, yedeği yeniden çalıştır',1],['Uygulama klasörünü sil',0],['Alarmı sustur, yat',0],['Sunucuyu formatla',0]]},
        {log:['[00:22] df: /var 41% used','[00:22] backup.sh OK'],q:'Tekrar olmasın diye?',o:[['Log rotasyonu ve disk doluluk uyarısı (%80) kur',1],['Yedeklemeyi tamamen kapat',0],['Daha çok kahve iç',0]]}],
  guc:[{log:['[03:40] ups: on battery · 9 min left','[03:40] pdu: input power lost'],q:'Jeneratör yok, ne yaparsın?',o:[['Kritik olmayan servisleri kapat, veritabanını güvenle durdur',1],['Hiçbir şey yapma, UPS yeter',0],['Tüm sunucuları aynı anda yeniden başlat',0]]},
       {log:['[04:55] power restored','[04:55] db: crash recovery needed?'],q:'Güç geldi:',o:[['Veritabanını tutarlılık kontrolüyle başlat, sonra uygulamayı aç',1],['Her şeyi aynı anda aç',0],['Bir gün bekle',0]]}]};
function incStart(t){const S=ensureOS();if(S.srv.inc&&!S.srv.inc.done)return;const ops=S.team.filter(e=>e.rk==='ops'&&!e.away).sort((a,b)=>b.lv-a.lv)[0];
  S.srv.inc={t:t,day:S.day,min:0,done:false,ops:ops?ops.n:null,need:ops?Math.round((9-Math.min(7,ops.lv*.8))*60):null,step:0,wrong:0};log('🚨 '+INC[t].n+' · '+INC[t].d+(ops?' · '+ops.n+' müdahale ediyor':' · nöbet sende!'));
  const msg=INC[t].n+(ops?' · '+ops.n+' ilgileniyor':' · sistem yöneticin yok, bilgisayara geçip nöbeti sen tut!');if(OPEN){P().toast('🚨 '+msg);render()}else try{P().notify('🚨 Buludex',msg)}catch(e){P().toast('🚨 '+msg)}}
function incTick(min){const S=st();const I=S.srv&&S.srv.inc;if(!I||I.done)return;I.min+=min;if(I.need&&I.min>=I.need)incEnd(I.ops+' sorunu çözdü');else if(!I.need&&I.min>=1440)incEnd('Barındırma sağlayıcısı 1 gün sonra düzeltti (nöbet tutulmadı)')}
function incEnd(by){const S=st(),I=S.srv.inc;if(!I||I.done)return;I.done=true;S.srv.incLog.unshift({t:I.t,d:I.day,dur:Math.round(I.min),by:by});S.srv.incLog.length=Math.min(12,S.srv.incLog.length);log('✅ '+INC[I.t].n+' çözüldü · '+by+' · '+Math.round(I.min)+' dk');P().toast('✅ Kesinti çözüldü: '+INC[I.t].n);if(OPEN)render()}
function incDaily(){const S=ensureOS(),p=S.product;if(!p||!p.live)return;const I=S.srv.inc;if(I&&!I.done){p.bugs+=0;return}
  const r=Math.random(),hasHW=S.srv.racks.length>0;if(hasHW&&r<.05+S.srv.racks.length*.008)incStart('disk');else if(p.users>1500&&r<.11)incStart('ddos');else if(r<.16)incStart('alarm');else if(hasHW&&!S.srv.dc.gen&&r<.19)incStart('guc')}
/* nöbet mini oyunu */
let NOBET=null;
function nobet(){const S=st(),I=S.srv.inc;if(!I||I.done)return;NOBET={t:I.t,step:I.step||0};drawNobet()}
function drawNobet(){const S=st(),I=S.srv.inc;let ov=document.getElementById('nob112');if(!ov){ov=el('div','');ov.id='nob112';ov.style.cssText='position:absolute;inset:0;background:rgba(1,4,9,.82);display:grid;place-items:center;z-index:5';root.appendChild(ov)}ov.innerHTML='';if(!I||I.done||!NOBET){ov.remove();return}
  const st2=NOB[I.t][NOBET.step],box=el('div','card');box.style.cssText='width:min(640px,92%);background:#0d1117;border-color:#f85149';box.innerHTML='<b>🚨 Nöbet · '+INC[I.t].n+'</b> <span class="muted">adım '+(NOBET.step+1)+'/'+NOB[I.t].length+(I.wrong?' · yanlış hamle '+I.wrong:'')+'</span>';
  const pre=el('pre','');pre.style.cssText='background:#010409;color:#7ee787;padding:10px;border-radius:8px;font:12px/1.5 ui-monospace,Consolas,monospace;white-space:pre-wrap;margin:10px 0';pre.textContent=st2.log.join('\n');box.appendChild(pre);box.appendChild(el('div','','<b>'+st2.q+'</b>'));
  st2.o.slice().sort(()=>Math.random()-.5).forEach(o=>{const b=el('button','btn s',o[0]);b.style.cssText='display:block;width:100%;text-align:left;margin:6px 0';b.onclick=()=>{if(o[1]){NOBET.step++;I.step=NOBET.step;P().sfx('blip');if(NOBET.step>=NOB[I.t].length){NOBET=null;incEnd('Oğuz nöbette çözdü');try{P().mem('🚨','Gece nöbetinde '+INC[I.t].n.slice(3).toLowerCase()+' sorununu çözdüm')}catch(e){}drawNobet();return}}
      else{I.wrong++;I.min+=45;P().toast('❌ Yanlış hamle · kesinti uzadı (+45 dk)');const p=S.product;if(p)p.users=Math.max(0,Math.round(p.users*.99))}drawNobet()};box.appendChild(b)});
  const x=el('button','btn s','Sonra dönerim');x.onclick=()=>{NOBET=null;drawNobet()};box.appendChild(x);ov.appendChild(box)}
/* ---------------- görünümler ---------------- */
let OSEL=null,DRAG=null;
VIEWS.ofis=function(m){const S=ensureOS(),O=OFF(),D=desks().length,need=S.team.length;m.appendChild(el('h2','','🏢 Ofis · '+O.ic+' '+O.n));
  const top=el('div','grid');m.appendChild(top);[['Masa / çalışan',D+' / '+need+(D<need?' ⚠️':'')],['Konfor',comfortLv()],['Günlük kira',fmt(O.rent)+'🪙'],['Rack yeri',ensureOS().srv.racks.length+' / '+rackLimit()]].forEach(q=>{const c=el('div','card');c.innerHTML='<div class="kpi">'+q[1]+'<small>'+q[0]+'</small></div>';top.appendChild(c)});
  if(D<need)m.appendChild(el('div','card','⚠️ '+(need-D)+' çalışanın masası yok · %50 yavaş çalışır ve morali düşer. Masa al ya da daha büyük ofise taşın.'));
  /* palet */const pal=el('div','card');pal.style.marginTop='10px';pal.innerHTML='<b>🛒 Eşya al</b> <span class="muted">· boş yere konur, sürükleyerek taşı; tıkla: seç</span><br>';Object.keys(ITEMS).forEach(k=>{const I=ITEMS[k],b=el('button','btn s',I.ic+' '+I.n+' · '+fmt(I.c)+'🪙');b.style.margin='4px 6px 0 0';b.onclick=()=>buyItem(k);pal.appendChild(b)});m.appendChild(pal);
  /* plan */const wrap=el('div','card');wrap.style.marginTop='10px';wrap.style.overflow='auto';m.appendChild(wrap);const cs=Math.max(22,Math.min(44,Math.floor((Math.min(innerWidth,1400)-330)/O.w)));
  const g=el('div','');g.style.cssText='position:relative;width:'+(O.w*cs)+'px;height:'+(O.h*cs)+'px;background-color:#1b222c;background-image:linear-gradient(#2d3540 1px,transparent 1px),linear-gradient(90deg,#2d3540 1px,transparent 1px);background-size:'+cs+'px '+cs+'px;border:2px solid #58a6ff55;border-radius:6px;touch-action:none';wrap.appendChild(g);
  const deskList=desks().slice().sort((a,b)=>a.y-b.y||a.x-b.x);
  S.of.items.forEach(it=>{const I=ITEMS[it.t],c=cellsOf(it),d=el('div','');const owner=I.desk?S.team[deskList.indexOf(it)]:null;
    d.style.cssText='position:absolute;left:'+(it.x*cs+2)+'px;top:'+(it.y*cs+2)+'px;width:'+(c.w*cs-4)+'px;height:'+(c.h*cs-4)+'px;border-radius:6px;display:grid;place-items:center;font-size:'+Math.round(cs*.55)+'px;cursor:grab;user-select:none;background:'+(I.desk?'#2f81f7aa':I.cf?'#3fb95066':'#d2992266')+';'+(OSEL===it?'outline:2px solid #fff;':'');
    d.innerHTML=I.ic+(I.desk?'<span style="position:absolute;bottom:1px;left:3px;font-size:9px;color:#fff;max-width:90%;overflow:hidden;white-space:nowrap">'+(owner?owner.n.split(' ')[0]:'boş')+' · '+['I','II','III'][it.pc]+'</span>':'');d.title=I.n;
    d.onpointerdown=e=>{e.preventDefault();DRAG={it:it,el:d,sx:e.clientX,sy:e.clientY,ox:it.x,oy:it.y,moved:false};d.setPointerCapture(e.pointerId)};
    d.onpointermove=e=>{if(!DRAG||DRAG.it!==it)return;const dx=Math.round((e.clientX-DRAG.sx)/cs),dy=Math.round((e.clientY-DRAG.sy)/cs);if(dx||dy)DRAG.moved=true;const nx=DRAG.ox+dx,ny=DRAG.oy+dy,ok=fits(it,nx,ny,it);d.style.left=(nx*cs+2)+'px';d.style.top=(ny*cs+2)+'px';d.style.opacity=ok?1:.45;DRAG.nx=nx;DRAG.ny=ny;DRAG.ok=ok};
    d.onpointerup=e=>{if(!DRAG||DRAG.it!==it)return;const D2=DRAG;DRAG=null;if(D2.moved&&D2.ok){it.x=D2.nx;it.y=D2.ny}else if(!D2.moved){OSEL=OSEL===it?null:it}render()};g.appendChild(d)});
  if(OSEL&&S.of.items.indexOf(OSEL)>=0){const I=ITEMS[OSEL.t],c=el('div','card');c.style.marginTop='8px';c.innerHTML='<b>'+I.ic+' '+I.n+'</b>'+(I.desk?' <span class="tag">'+PCT[OSEL.pc][0]+' · hız ×'+PCT[OSEL.pc][1]+'</span>':'')+(I.cf?' <span class="tag">konfor +'+I.cf+'</span>':'')+(I.prod?' <span class="tag">ekip hızı +%'+I.prod*100+'</span>':'');
    const B=(t,f)=>{const x=el('button','btn s',t);x.style.marginLeft='6px';x.onclick=f;c.appendChild(x)};if(I.desk&&OSEL.pc<2)B('⬆ '+PCT[OSEL.pc+1][0]+' · '+fmt(PCT[OSEL.pc+1][2])+'🪙',()=>upgradePC(OSEL));if(cellsOf(OSEL).w!==cellsOf(OSEL).h)B('⟳ Döndür',()=>{OSEL.r=!OSEL.r;if(!fits(OSEL,OSEL.x,OSEL.y,OSEL)){OSEL.r=!OSEL.r;P().toast('Döndürmeye yer yok')}render()});B('💸 Sat (%40)',()=>sellItem(OSEL));m.appendChild(c)}
  if(S.of.store.length){const c=el('div','card');c.style.marginTop='8px';c.innerHTML='<b>📦 Depo</b> ';S.of.store.forEach(it=>{const b=el('button','btn s',ITEMS[it.t].ic+' yerleştir');b.style.marginLeft='6px';b.onclick=()=>{if(placeFree(it)){S.of.store=S.of.store.filter(q=>q!==it);S.of.items.push(it);render()}else P().toast('Yer yok')};c.appendChild(b)});m.appendChild(c)}
  m.appendChild(el('h3','','🚚 Taşınma'));const t=el('table','');t.innerHTML='<tr><th>Ofis</th><th>Alan</th><th>Rack</th><th>Kira/gün</th><th>Taşınma toplamı</th><th></th></tr>';
  OFFICES.forEach((o,i)=>{const tr=el('tr','');const tot=(o.buy||0)+o.dep+o.move;tr.innerHTML='<td>'+o.ic+' '+o.n+'<div class="muted">'+o.note+'</div></td><td>'+o.w+'×'+o.h+'</td><td>'+o.racks+'</td><td>'+fmt(o.rent)+'</td><td>'+(i?(o.buy?'satın alma '+fmt(o.buy)+' + ':'')+(o.dep?'depozito '+fmt(o.dep)+' + ':'')+'taşınma '+fmt(o.move)+' = <b>'+fmt(tot)+'🪙</b>':'—')+'</td>';
    const td=el('td','');if(i===S.of.tier)td.appendChild(el('span','tag ok','Buradasın'));else if(i>S.of.tier){const b=el('button','btn b','Taşın');b.disabled=S.cash<tot;b.onclick=()=>{if(confirm(o.n+' ofisine taşınılsın mı? '+fmt(tot)+'🪙'))moveTo(o.k)};td.appendChild(b)}tr.appendChild(td);t.appendChild(tr)});const tc=el('div','card');tc.appendChild(t);m.appendChild(tc)};
VIEWS.sunucu=function(m){const S=ensureOS(),p=S.product,cap=capOf(),raw=capRaw(),I=S.srv.inc;m.appendChild(el('h2','','🖧 Sunucular'));
  const load=p&&p.live?p.users/Math.max(1,cap):0,need=storageNeed(p),have=storageHave();const g=el('div','grid');m.appendChild(g);
  [['Kapasite',fmt(cap)+' kullanıcı'+(cap<raw?' (kesinti/disk etkisi)':'')],['Yük','%'+Math.round(load*100)+(load>1.6?' · ÇÖKTÜ':load>1?' · yavaş':'')],['Depolama',need.toFixed(1)+' / '+have.toFixed(1)+' TB'],['Günlük gider',fmt(srvCost())+'🪙']].forEach(q=>{const c=el('div','card');c.innerHTML='<div class="kpi" style="color:'+(q[0]==='Yük'&&load>1?'#f85149':'inherit')+'">'+q[1]+'<small>'+q[0]+'</small></div>';g.appendChild(c)});
  if(I&&!I.done){const c=el('div','card');c.style.cssText='margin-top:10px;border-color:#f85149';c.innerHTML='<b>🚨 '+INC[I.t].n+'</b> · '+INC[I.t].d+' · kapasite ×'+INCF[I.t]+' · '+Math.round(I.min)+' dk sürüyor'+(I.ops?' · '+I.ops+' ilgileniyor (~'+Math.max(0,Math.round((I.need-I.min)))+' dk)':'');if(!I.ops||I.min>60){const b=el('button','btn','🛠️ Nöbeti devral');b.style.marginLeft='8px';b.onclick=nobet;c.appendChild(b)}m.appendChild(c)}
  m.appendChild(el('h3','','🏠 Ev bilgisayarı · 800 kullanıcı (her zaman)'));
  m.appendChild(el('h3','','🗄️ Rack sunucular ('+S.srv.racks.length+' / '+rackLimit()+(dcOn()?' · veri merkezinde':' · ofiste')+')'));const rc=el('div','card');
  const mk=(L,lbl)=>{const s=document.createElement('select');s.innerHTML=L.map((q,i)=>'<option value="'+i+'">'+lbl+': '+q[0]+' · '+fmt(q[2])+'🪙</option>').join('');s.style.margin='0 6px 6px 0';return s};const sc=mk(CPU,'CPU'),sr=mk(RAM,'RAM'),sd=mk(DISK,'Disk');[sc,sr,sd].forEach(x=>rc.appendChild(x));
  const info=el('span','muted','');const upd=()=>{const r={c:+sc.value,r:+sr.value,d:+sd.value};info.textContent=' → '+fmt(rackCap(r))+' kullanıcı · '+DISK[r.d][1]+' TB · '+fmt(CPU[r.c][2]+RAM[r.r][2]+DISK[r.d][2])+'🪙';};[sc,sr,sd].forEach(x=>x.onchange=upd);upd();const bb=el('button','btn','Satın al');bb.onclick=()=>buyRack(+sc.value,+sr.value,+sd.value);rc.appendChild(bb);rc.appendChild(info);
  S.srv.racks.forEach(k=>{const r=el('div','row');r.innerHTML='<span>🖧 '+CPU[k.c][0]+' · '+RAM[k.r][0]+' · '+DISK[k.d][0]+'</span><span class="muted">'+fmt(rackCap(k))+' kullanıcı</span>';const x=el('button','btn s','Sat');x.onclick=()=>sellRack(k);r.appendChild(x);rc.appendChild(r)});m.appendChild(rc);
  m.appendChild(el('h3','','☁️ Bulut kiralama (esnek)'));const cl=el('div','card');cl.innerHTML='<div class="row"><span>'+S.srv.cloud+' birim · birim başı '+fmt(CLOUD.users)+' kullanıcı + '+CLOUD.tb+' TB · '+fmt(CLOUD.cost)+'🪙/gün</span></div>';[-1,1,5].forEach(d=>{const b=el('button','btn s',(d>0?'+':'')+d);b.style.marginRight='6px';b.onclick=()=>cloudSet(S.srv.cloud+d);cl.appendChild(b)});m.appendChild(cl);
  m.appendChild(el('h3','','🏭 Kendi veri merkezin'));const dc=el('div','card');dc.appendChild(el('div','muted','Arsa + enerji + soğutma ile çalışır: 200 rack yeri, rack başı enerji 70🪙/gün (ofiste 120), bakım 1.500🪙/gün. Jeneratör elektrik kesintisini önler.'));
  Object.keys(DCB).forEach(k=>{const r=el('div','row');r.innerHTML='<span>'+DCB[k][0]+'</span>';if(S.srv.dc[k])r.appendChild(el('span','tag ok','Kuruldu'));else{const b=el('button','btn s',fmt(DCB[k][1])+'🪙');b.onclick=()=>buildDC(k);r.appendChild(b)}dc.appendChild(r)});m.appendChild(dc);
  if(S.srv.incLog.length){m.appendChild(el('h3','','Kesinti geçmişi'));const h=el('div','card log');S.srv.incLog.forEach(q=>h.appendChild(el('div','','Gün '+q.d+' · '+INC[q.t].n+' · '+q.dur+' dk · '+q.by)));m.appendChild(h)}};

{const _pv=VIEWS.panel;VIEWS.panel=function(m){const S=st(),I=S.srv&&S.srv.inc;if(I&&!I.done){const c=el('div','card');c.style.cssText='border-color:#f85149;margin-bottom:10px';c.innerHTML='🚨 <b>'+INC[I.t].n+'</b> · '+INC[I.t].d+(I.ops?' · '+I.ops+' ilgileniyor':' · sistem yöneticisi yok');const b=el('button','btn','🛠️ Nöbeti devral');b.style.marginLeft='8px';b.onclick=nobet;c.appendChild(b);m.appendChild(c)}_pv(m)}}
/* =====================================================================
   DEPARTMANLAR · FİNANS (bilanço, nakit akışı, vergi, kredi, iflas) · PAZARLAMA (billboard 3D'de) · SATIŞ (B2B)
   YATIRIMCILAR (Melek→Tohum→Seri A→Seri B, sunum mini oyunu, hisse pazarlığı, hedefler) · RAKİPLER (pazar payı, satın alma) · HALKA ARZ
   ŞİRKETTEN OĞUZ'A: CEO maaşı + temettü (coins)
   ===================================================================== */
const DEPTS={yazilim:{n:'Yazılım',ic:'💻',roles:['fe','be','mob','qa','pm'],b:'Geliştirici hızı +%2/müdür seviyesi'},tasarim:{n:'Tasarım',ic:'🎨',roles:['ds'],b:'Arayüz/grafik hızı +%3/seviye'},
  bt:{n:'BT / Altyapı',ic:'🖧',roles:['ops'],b:'Kesintiler %8/seviye daha hızlı çözülür, kapasite +%2/seviye'},pazarlama:{n:'Pazarlama',ic:'📣',roles:['mkt'],b:'Kampanya verimi +%4/seviye'},
  satis:{n:'Satış',ic:'🤝',roles:['sales'],b:'B2B kapanış şansı +%3/seviye'},ik:{n:'İK',ic:'🧑‍💼',roles:['hr'],b:'İlanlarda günlük +1 aday, motivasyon kaybı −%5/seviye'},finans:{n:'Finans',ic:'🧾',roles:['acc'],b:'Kurumlar vergisi −0,5 puan/seviye (en çok −5), kredi faizi düşer'}};
function ensureFin(){const S=ensureOS();if(!S.fin)S.fin={days:[],months:[],loans:[],tax:20,ceoSal:0,divK:0,eq:100,rounds:[],goals:[],camps:[],b2b:{leads:[],deals:[]},rivals:null,ipo:null,negDays:0,offers:[],lastMonth:Math.floor(S.day/30)};S.mgr=S.mgr||{};
  const p=S.product;if(p&&!S.fin.rivals){S.fin.rivals=TYPES[p.type].comp.map((c,i)=>({n:c[0],sc:c[1],u:Math.round(TYPES[p.type].market*(.12-i*.03))}));if(S.fin.rivals.length<3)S.fin.rivals.push({n:'Bornova Labs',sc:14,u:Math.round(TYPES[p.type].market*.03)})}return S}
function mgrLv(d){const S=st();const e=S.mgr&&S.mgr[d]&&S.team.find(q=>q.id===S.mgr[d]);return e&&!e.away?e.lv:0}
/* müdür bonuslarını mevcut sistemlere bağla */
{const _tm=trMul;trMul=function(e,k,id){let m=_tm(e,k,id);const d=deptOf(e);if(d==='yazilim')m*=1+mgrLv('yazilim')*.02;if(d==='tasarim'||(k==='comp'&&(id==='ui'||id==='gfx')))m*=1+mgrLv('tasarim')*.03;return m}}
function deptOf(e){for(const k in DEPTS)if(DEPTS[k].roles.indexOf(e.rk)>=0)return k;return null}
{const _c=capOf;capOf=function(){return Math.round(_c()*(1+mgrLv('bt')*.02))}}
{const _it=incTick;incTick=function(min){return _it(min*(1+mgrLv('bt')*.08))}}
{const _di=dailyIK;dailyIK=function(){const S=st(),k=mgrLv('ik');S.team.forEach(e=>{if(!e.founder)e.mot=clamp(e.mot+k*.05,0,100)});const r=_di();if(k&&S.ads.length)S.ads.forEach(a=>{if(Math.random()<.6)S.cands.push(newCand(a.rk))});return r}}
/* ---------------- günlük finans ---------------- */
function rateLoan(){return .0009-mgrLv('finans')*.00004}/* günlük faiz */
function dailyFin(D){const S=ensureFin(),F=S.fin,p=S.product;const row={d:S.day,inc:{urun:D.urun,b2b:0,yatirim:0},exp:{bordro:D.bordro,kira:D.kira,sunucu:D.srv,pazarlama:0,vergi:0,faiz:0,ceo:0}};
  /* pazarlama kampanyaları */F.camps.forEach(c=>{if(c.left<=0)return;c.left--;const k=1+mgrLv('pazarlama')*.04,sat=p&&p.live?Math.max(.3,(p.sat||50)/70):0;let nu=0;
    if(c.t==='sosyal'){row.exp.pazarlama+=c.daily;nu=c.daily/ (p&&TYPES[p.type].model==='lisans'?60:9)*k*sat}else if(c.t==='billboard'){nu=(c.big/c.days)/7*k*sat}else if(c.t==='influencer'){nu=c.left===c.days-1?c.big/5*k*sat:c.big/60*k*sat}
    if(p&&p.live){nu=Math.round(nu);p.users+=nu;c.got=(c.got||0)+nu}});F.camps=F.camps.filter(c=>c.left>0||S.day-c.end<1);if(!F.camps.some(c=>c.t==='billboard'&&c.left>0))P().billboard(null);
  /* B2B sözleşmeleri */F.b2b.deals.forEach(d=>{if(d.left>0){row.inc.b2b+=Math.round(d.monthly/30);d.left--}});F.b2b.deals=F.b2b.deals.filter(d=>d.left>0);b2bDaily();
  /* krediler */F.loans.forEach(l=>{const i=Math.round(l.bal*l.r);row.exp.faiz+=i;const pr=Math.min(l.bal,l.inst);l.bal-=pr;row.exp.faiz+=0;S.cash-=pr;l.paid=(l.paid||0)+pr});F.loans=F.loans.filter(l=>l.bal>1);
  /* CEO maaşı (10 günde bir) */if(F.ceoSal&&S.day%10===0){row.exp.ceo=F.ceoSal;P().payOut(F.ceoSal,'💼 Buludex CEO maaşı')}
  S.cash+=row.inc.b2b-row.exp.pazarlama-row.exp.faiz-row.exp.ceo;F.days.push(row);F.days=F.days.slice(-90);
  /* rakipler */rivalsDaily();
  /* ay sonu: vergi, bilanço, temettü, yatırımcı hedefleri */const mo=Math.floor(S.day/30);if(mo>F.lastMonth){F.lastMonth=mo;monthEnd()}
  /* nakit: kredi / iflas uyarısı */if(S.cash<0){F.negDays++;if(F.negDays===1||F.negDays%5===0){const msg='⚠️ Kasa ekside ('+fmt(S.cash)+'🪙) · '+F.negDays+'. gün · kredi al, masrafı kıs ya da para aktar'+(F.negDays>=20?' · 30 günde iflas!':'');log(msg);if(OPEN)P().toast(msg);else P().notify('🏦 Buludex',msg)}
    if(F.negDays>=30)bankrupt()}else F.negDays=0;
  /* yatırımcı hedef baskısı + satın alma teklifi */goalsDaily();buyoutDaily()}
function taxRate(){return Math.max(15,20-Math.min(5,mgrLv('finans')*.5))}
function monthEnd(){const S=st(),F=S.fin,L=F.days.slice(-30);const sum=(o,k)=>L.reduce((s,r)=>s+(r[o][k]||0),0);const inc={urun:sum('inc','urun'),b2b:sum('inc','b2b'),yatirim:sum('inc','yatirim')},exp={bordro:sum('exp','bordro'),kira:sum('exp','kira'),sunucu:sum('exp','sunucu'),pazarlama:sum('exp','pazarlama'),faiz:sum('exp','faiz'),ceo:sum('exp','ceo')};
  const ti=inc.urun+inc.b2b,te=Object.values(exp).reduce((a,b)=>a+b,0),pre=ti-te,tax=pre>0?Math.round(pre*taxRate()/100):0;S.cash-=tax;exp.vergi=tax;const net=pre-tax;
  let div=0;if(net>0&&F.divK){div=Math.min(Math.round(net*F.divK*F.eq/100),Math.max(60000,3*(F.ceoSal||20000)));S.cash-=Math.round(div*100/F.eq);P().payOut(div,'📈 Buludex temettüsü (%'+F.eq.toFixed(1)+' hisse)')}
  F.months.push({m:F.lastMonth,inc:inc,exp:exp,pre:pre,tax:tax,net:net,div:div,cash:S.cash,users:S.product?S.product.users:0});F.months=F.months.slice(-24);log('🧾 Ay sonu: gelir '+fmt(ti)+' · gider '+fmt(te)+' · vergi '+fmt(tax)+' · net '+(net>=0?'+':'')+fmt(net)+'🪙'+(div?' · temettü '+fmt(div)+'🪙':''))}
function takeLoan(a,days){const S=ensureFin(),r=rateLoan();S.fin.loans.push({a:a,bal:a,r:r,inst:Math.ceil(a/days),day:S.day});S.cash+=a;S.fin.days.length&&(S.fin.days[S.fin.days.length-1].inc.yatirim+=0);log('🏦 Kredi: '+fmt(a)+'🪙 · '+days+' gün · günlük faiz %'+(r*100).toFixed(2));render()}
function bankrupt(){const S=st();const name=S.product?S.product.name:'Buludex';log('💀 İflas');P().notify('💀 Buludex iflas etti','Kasa 30 gün boyunca ekside kaldı. Şirket kapandı; yeni bir başlangıç yapabilirsin.');try{P().mem('💀',name+' iflas etti… ama girişimcilik bitmez')}catch(e){}BT=fresh();render()}
/* ---------------- pazarlama ---------------- */
const CAMP={sosyal:{n:'📱 Sosyal medya reklamı',d:'Günlük bütçe · harcadıkça kullanıcı',opts:[[1000,7],[3000,7],[8000,14]]},billboard:{n:'🪧 Billboard (İzmir)',d:'7 gün · şehirde dev pano · 3D dünyada görünür',opts:[[35000,7],[80000,14]]},influencer:{n:'🤳 Influencer',d:'Tek seferlik patlama + kısa kuyruk',opts:[[20000,5],[60000,7]]}};
function startCamp(t,o){const S=ensureFin(),p=S.product;if(!p||!p.live){P().toast('Önce ürünü yayınla');return}const cost=t==='sosyal'?o[0]*o[1]:o[0];if(t!=='sosyal'){if(S.cash<cost){P().toast('Kasa yetmiyor');return}S.cash-=cost;S.fin.days.length&&(S.fin.days[S.fin.days.length-1].exp.pazarlama+=cost)}
  const c={t:t,daily:t==='sosyal'?o[0]:0,big:o[0],days:o[1],left:o[1],start:S.day,end:S.day+o[1]};S.fin.camps.push(c);log(CAMP[t].n+' başladı · '+fmt(cost)+'🪙');
  if(t==='billboard'){const T=TYPES[p.type];P().billboard({name:p.name,ic:T.ic,slogan:{bulut:'Dosyaların her yerde',sosyal:'İzmir burada konuşuyor',muhasebe:'Defterin cebinde',eticaret:'Kordon\'dan kapına',crm:'Müşterin hep yanında',oyun:'Martılar seni bekliyor'}[p.type]||'Şimdi indir',until:c.end})}render()}
/* ---------------- satış (B2B) ---------------- */
const COS=['Ege Lojistik A.Ş.','Körfez Gıda','Marmara Otomotiv','Kordon Hukuk Bürosu','Bornova Tekstil','Gediz Enerji','İzmir Liman İşl.','Alsancak Mimarlık','Karşıyaka Diş Klinikleri','Çiğli OSB Metal','Buca Eczaneleri','Torbalı Tarım Koop.'];
function b2bOK(){const p=st().product;return p&&p.live}
function b2bDaily(){const S=st(),F=S.fin,p=S.product;if(!b2bOK())return;const T=TYPES[p.type],w={muhasebe:1.5,crm:1.5,bulut:1,eticaret:.7,sosyal:.4,oyun:.3}[p.type]||.5;
  if(F.b2b.leads.length<4&&Math.random()<.25*w+sumLv('sales')*.02){const seats=[5,10,25,50,120][Math.floor(Math.random()*5)],per={muhasebe:250,crm:220,bulut:90,eticaret:400,sosyal:150,oyun:120}[p.type]||150;
    F.b2b.leads.push({id:'L'+Date.now().toString(36),co:COS[Math.floor(Math.random()*COS.length)],seats:seats,per:per,months:[6,12,24][Math.floor(Math.random()*3)],p:.35+featScore(p)/400,day:S.day})}
  /* satışçılar kendiliğinden kapatır */const sl=sumLv('sales');if(sl&&F.b2b.leads.length&&Math.random()<.15+sl*.02){b2bClose(F.b2b.leads[0],true)}F.b2b.leads=F.b2b.leads.filter(l=>S.day-l.day<15)}
function b2bClose(l,auto){const S=st(),F=S.fin;F.b2b.leads=F.b2b.leads.filter(q=>q!==l);const pr=clamp(l.p+mgrLv('satis')*.03+sumLv('sales')*.015-(l.disc?0:.05)+(l.disc||0),0,.95);
  if(Math.random()<pr){const monthly=Math.round(l.seats*l.per*(1-(l.disc||0)));F.b2b.deals.push({co:l.co,seats:l.seats,monthly:monthly,left:l.months*30,months:l.months,day:S.day});log('🤝 B2B sözleşme: '+l.co+' · '+l.seats+' lisans · '+fmt(monthly)+'🪙/ay · '+l.months+' ay'+(auto?' (satış ekibi)':''));if(OPEN)P().toast('🤝 '+l.co+' sözleşmeyi imzaladı!')}
  else{log('🙅 '+l.co+' teklifi reddetti');if(!auto)P().toast('🙅 '+l.co+' şimdilik almadı')}render()}
/* ---------------- yatırımcılar ---------------- */
const ROUNDS=[{k:'melek',n:'Melek yatırımcı',who:'Zeynep Hanım (melek yatırımcı)',min:{u:1000,rev:0},amt:[150000,400000],eq:[8,15],goal:{u:10000,days:90}},
  {k:'tohum',n:'Tohum',who:'Ege Girişim Fonu',min:{u:8000,rev:500},amt:[600000,1500000],eq:[10,18],goal:{u:40000,days:120}},
  {k:'seriA',n:'Seri A',who:'Körfez Ventures',min:{u:30000,rev:2500},amt:[3000000,7000000],eq:[15,22],goal:{u:100000,days:180}},
  {k:'seriB',n:'Seri B',who:'Anadolu Growth Partners',min:{u:90000,rev:8000},amt:[12000000,25000000],eq:[12,20],goal:{u:250000,days:240}}];
function revDay(){const L=st().fin.days.slice(-7);return L.length?L.reduce((s,r)=>s+r.inc.urun+r.inc.b2b,0)/L.length:0}
function valuation(){const S=st(),p=S.product;if(!p)return 0;const rev=revDay()*365,uv=(p.users||0)*{sosyal:18,oyun:15,eticaret:30,bulut:40,crm:120,muhasebe:110}[p.type];return Math.round(Math.max(rev*4,uv)*(.7+(p.sat||50)/170)/1000)*1000}
function nextRound(){const S=ensureFin();return ROUNDS[S.fin.rounds.length]||null}
const PQ=[['Kullanıcı edinme maliyetiniz ne kadar?',(S)=>{const p=S.product,c=S.fin.camps.length;return [['Kampanyalarla ölçtük, kullanıcı başı ~'+(c?'40':'—')+'🪙 ve düşüyor',c?2:0],['Organik büyüyoruz, reklama hiç para vermedik',c?0:2],['Bilmiyorum, önemli değil',-1]]}],
  ['Kullanıcılar neden kalıyor?',(S)=>{const s=S.product.sat||50;return [['Memnuniyet %'+s+', hata sayısını düşük tutuyoruz',s>=55?2:0],['Rakiplerden ucuzuz',1],['Kalmıyorlar ama yeni gelen çok',-1]]}],
  ['Paranızı neye harcayacaksınız?',()=>[['Ekip (%50), altyapı (%30), pazarlama (%20)',2],['Ofisi güzelleştireceğiz',-1],['Hepsini reklama',0]]],
  ['Rakibiniz sizi kopyalarsa?',(S)=>[['Ürün puanımız '+featScore(S.product)+', yol haritamız hızlı',featScore(S.product)>=compBest(S.product)?2:1],['Dava açarız',-1],['Kopyalayamazlar',0]]],
  ['Kâra ne zaman geçiyorsunuz?',(S)=>{const m=S.fin.months.slice(-1)[0];return [['Son ay net '+(m?fmt(m.net):'—')+'🪙, '+(m&&m.net>0?'zaten kârdayız':'büyümeye yatırım yapıyoruz'),m&&m.net>0?2:1],['Asla, büyüme her şey',0],['Yarın',-1]]}]];
let PITCH=null;
function pitchStart(){const S=ensureFin(),R=nextRound();if(!R)return;const p=S.product;if(!p||!p.live||p.users<R.min.u||revDay()<R.min.rev){P().toast('Bu tur için en az '+fmt(R.min.u)+' kullanıcı ve günde '+fmt(R.min.rev)+'🪙 gelir gerekli');return}
  if(S.fin.lastPitch&&S.day-S.fin.lastPitch<5){P().toast('Yatırımcılar 5 gün sonra tekrar görüşmek istiyor');return}S.fin.lastPitch=S.day;const qs=PQ.slice().sort(()=>Math.random()-.5).slice(0,3);PITCH={R:R,q:qs,i:0,score:0};drawPitch()}
function drawPitch(){let ov=document.getElementById('pitch120');if(!ov){ov=el('div','');ov.id='pitch120';ov.style.cssText='position:absolute;inset:0;background:rgba(1,4,9,.85);display:grid;place-items:center;z-index:6';root.appendChild(ov)}ov.innerHTML='';if(!PITCH){ov.remove();return}
  const S=st(),p=S.product,R=PITCH.R,box=el('div','card');box.style.cssText='width:min(680px,94%);background:#0d1117;border-color:#58a6ff';ov.appendChild(box);
  if(PITCH.i===0&&!PITCH.shown){box.innerHTML='<b>🎤 Sunum · '+R.who+'</b><p class="muted">'+R.n+' turu</p>';const g=el('div','grid');[['Kullanıcı',fmt(p.users)],['Günlük gelir',fmt(revDay())+'🪙'],['Memnuniyet','%'+(p.sat||'—')],['Ürün puanı',featScore(p)],['Ekip',S.team.length+' kişi'],['Değerleme (tahmin)',fmt(valuation())+'🪙']].forEach(q=>{const c=el('div','card');c.innerHTML='<div class="kpi">'+q[1]+'<small>'+q[0]+'</small></div>';g.appendChild(c)});box.appendChild(g);
    const b=el('button','btn b','📊 Metrikleri sundum, sorulara geç');b.style.marginTop='10px';b.onclick=()=>{PITCH.shown=1;drawPitch()};box.appendChild(b);return}
  if(PITCH.i<PITCH.q.length){const q=PITCH.q[PITCH.i];box.innerHTML='<b>❓ '+R.who+':</b> '+q[0]+' <span class="muted">('+(PITCH.i+1)+'/3)</span>';q[1](S).sort(()=>Math.random()-.5).forEach(o=>{const b=el('button','btn s',o[0]);b.style.cssText='display:block;width:100%;text-align:left;margin:6px 0';b.onclick=()=>{PITCH.score+=o[1];PITCH.i++;P().sfx(o[1]>0?'blip':'bump');drawPitch()};box.appendChild(b)});return}
  /* teklif: skora göre değerleme */const k=clamp(.75+PITCH.score*.07,.55,1.2),pre=Math.round(valuation()*k/1000)*1000,amt=clamp(Math.round(pre*(R.eq[0]+R.eq[1])/200/1000)*1000,R.amt[0],R.amt[1]),eq=+(amt/(pre+amt)*100).toFixed(1);
  if(PITCH.score<1){box.innerHTML='<b>🙅 '+R.who+'</b><p>"Şimdilik geçiyoruz, metrikleriniz büyüyünce tekrar konuşalım."</p>';const x=el('button','btn s','Kapat');x.onclick=()=>{PITCH=null;drawPitch()};box.appendChild(x);return}
  PITCH.offer=PITCH.offer||{amt:amt,eq:eq,neg:0};const O=PITCH.offer;box.innerHTML='<b>💼 Teklif · '+R.who+'</b><p>'+fmt(O.amt)+'🪙 karşılığında <b>%'+O.eq+'</b> hisse · ön değerleme '+fmt(Math.round(O.amt*100/O.eq-O.amt))+'🪙</p><p class="muted">Hedef: '+R.goal.days+' gün içinde '+fmt(R.goal.u)+' kullanıcı · kaçırılırsa yönetim kurulu baskısı</p><p class="muted">Kurucu payın şu an %'+S.fin.eq.toFixed(1)+' → kabul edersen %'+(S.fin.eq*(1-O.eq/100)).toFixed(1)+'</p>';
  const acc=el('button','btn','✅ Kabul');acc.onclick=()=>closeRound(R,O);box.appendChild(acc);
  if(O.neg<2){const n=el('button','btn s','🤝 Daha az hisse iste');n.style.marginLeft='8px';n.onclick=()=>{O.neg++;if(Math.random()<.55-O.neg*.1+PITCH.score*.03){O.eq=+(O.eq*.85).toFixed(1);P().toast('👍 Yatırımcı kabul etti: %'+O.eq)}else{PITCH=null;P().toast('🚪 Yatırımcı masadan kalktı');log('🚪 '+R.who+' pazarlıkta çekildi')}drawPitch()};box.appendChild(n)}
  const x=el('button','btn s','Reddet');x.style.marginLeft='8px';x.onclick=()=>{PITCH=null;drawPitch()};box.appendChild(x)}
function closeRound(R,O){const S=st(),F=S.fin;S.cash+=O.amt;F.eq=+(F.eq*(1-O.eq/100)).toFixed(2);F.rounds.push({k:R.k,n:R.n,who:R.who,amt:O.amt,eq:O.eq,day:S.day,val:Math.round(O.amt*100/O.eq)});F.goals.push({r:R.n,u:R.goal.u,until:S.day+R.goal.days,ok:false,miss:0});
  F.days.length&&(F.days[F.days.length-1].inc.yatirim+=O.amt);log('💰 '+R.n+': '+R.who+' '+fmt(O.amt)+'🪙 yatırdı · %'+O.eq+' hisse');P().toast('💰 '+R.n+' tamam! +'+fmt(O.amt)+'🪙');P().sfx('coin');try{P().mem('💰','Buludex '+R.n+' yatırımı aldı: '+fmt(O.amt)+'🪙')}catch(e){}PITCH=null;drawPitch();render()}
function goalsDaily(){const S=st(),F=S.fin,u=S.product?S.product.users:0;F.goals.forEach(g=>{if(g.ok)return;if(u>=g.u){g.ok=true;log('🎯 Yatırımcı hedefi tutturuldu: '+g.r+' · '+fmt(g.u)+' kullanıcı');return}
  if(S.day>=g.until&&!g.miss){g.miss=1;S.team.forEach(e=>{if(!e.founder)e.mot=clamp(e.mot-15,0,100)});F.valHit=(F.valHit||1)*.8;const msg='📉 '+g.r+' hedefi kaçtı ('+fmt(g.u)+' kullanıcı) · yönetim kurulu baskısı: ekip morali −15, değerleme −%20';log(msg);P().notify('📉 Yönetim kurulu',msg)}})}
{const _v=valuation;valuation=function(){return Math.round(_v()*(st().fin&&st().fin.valHit||1))}}
/* ---------------- rakipler, satın alma teklifi ---------------- */
function rivalsDaily(){const S=st(),F=S.fin,p=S.product;if(!p||!F.rivals)return;const M=TYPES[p.type].market;F.rivals.forEach(r=>{const g=(Math.random()*.012)-.002+(r.sc>featScore(p)?.004:0);r.u=Math.max(100,Math.round(Math.min(M*.6,r.u*(1+g))));if(Math.random()<.02)r.sc+=2});
  F.share=F.share||[];const tot=F.rivals.reduce((s,r)=>s+r.u,0)+(p.users||0);F.share.push({d:S.day,me:(p.users||0)/tot,r:F.rivals.map(r=>r.u/tot)});F.share=F.share.slice(-60)}
function buyoutDaily(){const S=st(),F=S.fin,p=S.product;if(!p||!p.live||F.ipo||F.offers.length||p.users<20000||Math.random()>.03)return;const r=F.rivals.slice().sort((a,b)=>b.u-a.u)[0];const v=Math.round(valuation()*(1.1+Math.random()*.5)/10000)*10000;
  F.offers.push({by:r.n,v:v,day:S.day});const msg='📨 '+r.n+' Buludex\'i '+fmt(v)+'🪙 değerlemeyle satın almak istiyor (senin payın %'+F.eq.toFixed(1)+' → '+fmt(v*F.eq/100)+'🪙)';log(msg);P().notify('📨 Satın alma teklifi',msg)}
function sellCompany(o){const S=st(),F=S.fin,mine=Math.round(o.v*F.eq/100);P().payOut(mine,'🏁 Buludex satışı · '+o.by);log('🏁 Buludex '+o.by+'\'a satıldı · payına '+fmt(mine)+'🪙');try{P().mem('🏁','Buludex\'i '+o.by+'\'a sattım · '+fmt(mine)+'🪙')}catch(e){}P().notify('🏁 Exit!','Buludex '+o.by+'\'a satıldı. Payın '+fmt(mine)+'🪙 hesabına geçti. Yeni bir girişime başlayabilirsin.');BT=fresh();render()}
/* ---------------- halka arz ---------------- */
function ipoOK(){const S=st(),F=S.fin,p=S.product;return !F.ipo&&F.rounds.some(r=>r.k==='seriB')&&p&&p.users>=200000&&(F.months.slice(-1)[0]||{}).net>0}
function doIPO(){const S=st(),F=S.fin;if(!ipoOK())return;const v=Math.round(valuation()*1.3/10000)*10000,price=+(v/10000000).toFixed(2),raise=Math.round(v*.15);S.cash+=raise;F.eq=+(F.eq*.85).toFixed(2);const sell=Math.round(v*F.eq/100*.05);
  F.ipo={day:S.day,v:v,price:price,px:[price]};P().payOut(sell,'🔔 Halka arz · payının %5\'i satıldı');log('🔔 Halka arz! BLDX · '+price+'🪙/hisse · şirket değeri '+fmt(v)+'🪙 · kasaya '+fmt(raise)+'🪙');try{P().mem('🔔','Buludex borsada! BLDX işlem görmeye başladı')}catch(e){}bell();render()}
function bell(){let ov=el('div','');ov.style.cssText='position:absolute;inset:0;z-index:7;display:grid;place-items:center;background:radial-gradient(circle,#1f6feb55,#010409ee);overflow:hidden';ov.innerHTML='<div style="text-align:center"><div id="bell120" style="font-size:120px;transform-origin:50% 10%;animation:bl120 .5s ease-in-out 6 alternate">🔔</div><div style="font-size:30px;font-weight:800;margin-top:10px">BLDX · Borsa İstanbul\'da!</div><div class="muted">Açılış zili çaldı · Buludex artık halka açık bir şirket</div></div>';
  const st2=document.createElement('style');st2.textContent='@keyframes bl120{from{transform:rotate(-22deg)}to{transform:rotate(22deg)}}@keyframes cf120{to{transform:translateY(110vh) rotate(720deg)}}';ov.appendChild(st2);
  for(let i=0;i<70;i++){const c=el('i','');c.style.cssText='position:absolute;top:-20px;left:'+Math.random()*100+'%;width:8px;height:14px;background:'+['#ffd84a','#3fb950','#58a6ff','#f85149','#db61a2'][i%5]+';animation:cf120 '+(2+Math.random()*2)+'s linear '+(Math.random()*1.2)+'s forwards';ov.appendChild(c)}
  root.appendChild(ov);P().sfx('coin');setTimeout(()=>P().sfx('bell'),300);ov.onclick=()=>ov.remove();setTimeout(()=>ov.remove(),5200)}
/* hisse fiyatı (halka arz sonrası, günlük) */{const _rd=rivalsDaily;rivalsDaily=function(){_rd();const F=st().fin;if(F.ipo){const last=F.ipo.px[F.ipo.px.length-1],tgt=valuation()/10000000;const nx=+(last+(tgt-last)*.1+(Math.random()-.5)*last*.04).toFixed(2);F.ipo.px.push(Math.max(.01,nx));F.ipo.px=F.ipo.px.slice(-90)}}}
/* ---------------- grafik yardımcısı ---------------- */
function chart(W,H,series,opt){const c=document.createElement('canvas');c.width=W*2;c.height=H*2;c.style.cssText='width:100%;max-width:'+W+'px;height:'+H+'px';const g=c.getContext('2d');g.scale(2,2);g.fillStyle='#0d1117';g.fillRect(0,0,W,H);
  const all=series.flatMap(s=>s.v);if(!all.length){g.fillStyle='#8b949e';g.fillText('Veri yok',10,20);return c}let mn=Math.min(0,...all),mx=Math.max(...all);if(mx===mn)mx=mn+1;const X=i=>8+i*(W-16)/Math.max(1,series[0].v.length-1),Y=v=>H-14-(v-mn)/(mx-mn)*(H-26);
  if(mn<0){g.strokeStyle='#f8514955';g.beginPath();g.moveTo(8,Y(0));g.lineTo(W-8,Y(0));g.stroke()}series.forEach(s=>{g.strokeStyle=s.c;g.lineWidth=2;g.beginPath();s.v.forEach((v,i)=>{i?g.lineTo(X(i),Y(v)):g.moveTo(X(i),Y(v))});g.stroke()});
  g.fillStyle='#8b949e';g.font='10px system-ui';g.fillText(fmt(mx),10,10);g.fillText(fmt(mn),10,H-3);return c}
/* ---------------- görünümler ---------------- */
VIEWS.finans=function(m){const S=ensureFin(),F=S.fin;m.appendChild(el('h2','','💰 Finans'));const L=F.days.slice(-30),sum=(o,k)=>L.reduce((s,r)=>s+(r[o][k]||0),0);
  const inc=sum('inc','urun')+sum('inc','b2b'),exp=['bordro','kira','sunucu','pazarlama','faiz','ceo'].reduce((s,k)=>s+sum('exp',k),0);const g=el('div','grid');m.appendChild(g);
  [['Kasa',fmt(S.cash)+'🪙'],['Son 30 gün gelir',fmt(inc)+'🪙'],['Son 30 gün gider',fmt(exp)+'🪙'],['Kurumlar vergisi','%'+taxRate()],['Kurucu hissesi','%'+F.eq.toFixed(1)],['Değerleme',fmt(valuation())+'🪙']].forEach(q=>{const c=el('div','card');c.innerHTML='<div class="kpi">'+q[1]+'<small>'+q[0]+'</small></div>';g.appendChild(c)});
  if(F.negDays)m.appendChild(el('div','card','<b style="color:#f85149">⚠️ Kasa '+F.negDays+' gündür ekside</b> · 30 günde iflas. Kredi al, maliyet kıs ya da kişisel paradan aktar.'));
  m.appendChild(el('h3','','📈 Nakit akışı (son 30 gün)'));const cc=el('div','card');let run=S.cash;const cash=[];for(let i=L.length-1;i>=0;i--){cash.unshift(run);const r=L[i];run-=(r.inc.urun+r.inc.b2b+r.inc.yatirim)-(Object.values(r.exp).reduce((a,b)=>a+b,0))}
  cc.appendChild(chart(760,160,[{v:cash,c:'#58a6ff'},{v:L.map(r=>r.inc.urun+r.inc.b2b),c:'#3fb950'},{v:L.map(r=>Object.values(r.exp).reduce((a,b)=>a+b,0)),c:'#f85149'}]));cc.appendChild(el('div','muted','🔵 kasa · 🟢 günlük gelir · 🔴 günlük gider'));m.appendChild(cc);
  m.appendChild(el('h3','','🧾 Gelir-gider tablosu (son 30 gün)'));const t=el('table','');const rows=[['Ürün geliri',sum('inc','urun')],['B2B lisans',sum('inc','b2b')],['Yatırım',sum('inc','yatirim')],['— Bordro',-sum('exp','bordro')],['— Kira',-sum('exp','kira')],['— Sunucu',-sum('exp','sunucu')],['— Pazarlama',-sum('exp','pazarlama')],['— Kredi',-sum('exp','faiz')],['— CEO maaşı',-sum('exp','ceo')]];
  t.innerHTML=rows.map(r=>'<tr><td>'+r[0]+'</td><td style="text-align:right;color:'+(r[1]<0?'#f85149':'#3fb950')+'">'+fmt(r[1])+'🪙</td></tr>').join('');const tc=el('div','card');tc.appendChild(t);m.appendChild(tc);
  m.appendChild(el('h3','','📒 Aylık bilanço'));const mb=el('table','');mb.innerHTML='<tr><th>Ay</th><th>Gelir</th><th>Gider</th><th>Vergi</th><th>Net</th><th>Temettü</th><th>Kasa</th></tr>'+(F.months.slice(-6).reverse().map(q=>{const ti=q.inc.urun+q.inc.b2b,te=Object.values(q.exp).reduce((a,b)=>a+b,0)-q.tax;return '<tr><td>'+(q.m)+'</td><td>'+fmt(ti)+'</td><td>'+fmt(te)+'</td><td>'+fmt(q.tax)+'</td><td style="color:'+(q.net<0?'#f85149':'#3fb950')+'">'+fmt(q.net)+'</td><td>'+fmt(q.div)+'</td><td>'+fmt(q.cash)+'</td></tr>'}).join('')||'<tr><td colspan="7" class="muted">İlk ay sonu (her 30 günde bir) henüz gelmedi</td></tr>');const mc=el('div','card');mc.appendChild(mb);m.appendChild(mc);
  m.appendChild(el('h3','','🏦 Kredi'));const kc=el('div','card');F.loans.forEach(l=>kc.appendChild(el('div','row','<span>'+fmt(l.a)+'🪙 · kalan '+fmt(l.bal)+'</span><span class="muted">günlük faiz %'+(l.r*100).toFixed(2)+' · taksit '+fmt(l.inst)+'</span>')));
  [[100000,60],[500000,120],[2000000,240]].forEach(q=>{const b=el('button','btn s',fmt(q[0])+'🪙 · '+q[1]+' gün');b.style.marginRight='6px';b.onclick=()=>takeLoan(q[0],q[1]);kc.appendChild(b)});m.appendChild(kc);
  m.appendChild(el('h3','','👤 Oğuz\'a ödeme (kişisel hesaba)'));const oc=el('div','card');oc.innerHTML='<p class="muted">CEO maaşı her 10 günde bir, temettü ay sonunda net kârın seçtiğin oranı × kurucu hissen (aylık en çok 3 maaş ya da 60.000🪙). Kişisel hesabın: '+fmt(P().coins)+'🪙</p>';
  const sel=document.createElement('select');sel.innerHTML=[0,15000,25000,35000].map(v=>'<option value="'+v+'"'+(F.ceoSal===v?' selected':'')+'>CEO maaşı: '+(v?fmt(v)+'🪙/10 gün':'yok')+'</option>').join('');sel.onchange=()=>{F.ceoSal=+sel.value;render()};oc.appendChild(sel);
  const ds=document.createElement('select');ds.style.marginLeft='8px';ds.innerHTML=[0,.1,.25].map(v=>'<option value="'+v+'"'+(F.divK===v?' selected':'')+'>Temettü: %'+v*100+' net kâr</option>').join('');ds.onchange=()=>{F.divK=+ds.value;render()};oc.appendChild(ds);
  const t2=el('div','');t2.style.marginTop='8px';[1000,5000,10000].forEach(v=>{const b=el('button','btn s','Şirkete +'+fmt(v)+'🪙');b.style.marginRight='6px';b.onclick=()=>{if(P().payPersonal(v)){S.cash+=v;log('💰 Kurucu '+fmt(v)+'🪙 aktardı');render()}else P().toast('Kişisel bakiye yetmiyor')};t2.appendChild(b)});oc.appendChild(t2);m.appendChild(oc)};
VIEWS.dept=function(m){const S=ensureFin();m.appendChild(el('h2','','🏛️ Departmanlar'));const g=el('div','types');m.appendChild(g);
  Object.keys(DEPTS).forEach(k=>{const D=DEPTS[k],mem=S.team.filter(e=>D.roles.indexOf(e.rk)>=0),c=el('div','card');c.style.cursor='default';c.innerHTML='<b>'+D.ic+' '+D.n+'</b> <span class="tag">'+mem.length+' kişi</span><div class="muted">Müdür bonusu: '+D.b+'</div>';
    const sel=document.createElement('select');sel.innerHTML='<option value="">— müdür yok —</option>'+mem.map(e=>'<option value="'+e.id+'"'+(S.mgr[k]===e.id?' selected':'')+'>'+e.n+' · Sv '+e.lv+'</option>').join('');sel.onchange=()=>{const id=sel.value;if(id){S.mgr[k]=id;const e=S.team.find(q=>q.id===id);if(e){e.mot=clamp(e.mot+10,0,100);e.title=D.n+' Müdürü';log('🏛️ '+e.n+' '+D.n+' müdürü oldu')}}else delete S.mgr[k];render()};c.appendChild(sel);
    if(!mem.length)c.appendChild(el('div','muted','Bu departmanda çalışan yok · İşe alım\'dan ilan ver'));const lv=mgrLv(k);if(lv)c.appendChild(el('div','tag ok','Aktif bonus · müdür seviyesi '+lv));g.appendChild(c)})};
VIEWS.pazar=function(m){const S=ensureFin(),F=S.fin;m.appendChild(el('h2','','📣 Pazarlama'));const g=el('div','types');m.appendChild(g);
  Object.keys(CAMP).forEach(k=>{const C=CAMP[k],c=el('div','card');c.style.cursor='default';c.innerHTML='<b>'+C.n+'</b><div class="muted">'+C.d+'</div>';C.opts.forEach(o=>{const cost=k==='sosyal'?o[0]*o[1]:o[0];const b=el('button','btn s',(k==='sosyal'?fmt(o[0])+'🪙/gün × '+o[1]+' gün':fmt(o[0])+'🪙 · '+o[1]+' gün')+' = '+fmt(cost)+'🪙');b.style.cssText='display:block;margin:6px 0';b.onclick=()=>startCamp(k,o);c.appendChild(b)});g.appendChild(c)});
  m.appendChild(el('h3','','Kampanyalar'));const t=el('div','card');if(!F.camps.length)t.appendChild(el('div','muted','Aktif kampanya yok'));F.camps.slice().reverse().forEach(c=>t.appendChild(el('div','row','<span>'+CAMP[c.t].n+' · Gün '+c.start+'–'+c.end+'</span><span class="muted">'+(c.left>0?c.left+' gün kaldı':'bitti')+' · +'+fmt(c.got||0)+' kullanıcı</span>')));m.appendChild(t);
  if(F.camps.some(c=>c.t==='billboard'&&c.left>0))m.appendChild(el('div','card','🪧 Billboard şu an İzmir\'de (Merkez, Alsancak, Karşıyaka) panolarda yayında · 3D dünyada görebilirsin.'))};
VIEWS.satis=function(m){const S=ensureFin(),F=S.fin;m.appendChild(el('h2','','🤝 Satış · B2B'));m.appendChild(el('p','muted','Şirket müşterileri ürününü toplu lisansla kullanır: sözleşme süresince aylık lisans geliri. Muhasebe ve CRM için en çok talep var; satış ekibi fırsatları kendiliğinden kapatır.'));
  const lc=el('div','card');lc.innerHTML='<b>Fırsatlar ('+F.b2b.leads.length+')</b>';if(!F.b2b.leads.length)lc.appendChild(el('div','muted','Henüz fırsat yok · satışçı al ya da ürünü büyüt'));
  F.b2b.leads.forEach(l=>{const r=el('div','row');r.style.flexWrap='wrap';r.innerHTML='<span><b>'+l.co+'</b> · '+l.seats+' lisans × '+fmt(l.per)+'🪙/ay · '+l.months+' ay</span><span class="muted">şans ~%'+Math.round(clamp(l.p+mgrLv('satis')*.03,0,.95)*100)+'</span>';const a=el('button','btn','🤝 Toplantı · teklif ver');a.onclick=()=>b2bClose(l,false);const d=el('button','btn s','%15 indirimle');d.onclick=()=>{l.disc=.15;b2bClose(l,false)};r.appendChild(a);r.appendChild(d);lc.appendChild(r)});m.appendChild(lc);
  m.appendChild(el('h3','','Sözleşmeler'));const dc=el('div','card');if(!F.b2b.deals.length)dc.appendChild(el('div','muted','Aktif sözleşme yok'));F.b2b.deals.forEach(d=>dc.appendChild(el('div','row','<span>'+d.co+' · '+d.seats+' lisans</span><span>'+fmt(d.monthly)+'🪙/ay · '+Math.ceil(d.left/30)+' ay kaldı</span>')));m.appendChild(dc)};
VIEWS.yatirim=function(m){const S=ensureFin(),F=S.fin,R=nextRound(),p=S.product;m.appendChild(el('h2','','🤝 Yatırımcılar'));const g=el('div','grid');m.appendChild(g);
  [['Değerleme',fmt(valuation())+'🪙'],['Kurucu hissesi','%'+F.eq.toFixed(1)],['Toplam yatırım',fmt(F.rounds.reduce((s,r)=>s+r.amt,0))+'🪙'],['Günlük gelir (7g ort.)',fmt(revDay())+'🪙']].forEach(q=>{const c=el('div','card');c.innerHTML='<div class="kpi">'+q[1]+'<small>'+q[0]+'</small></div>';g.appendChild(c)});
  const rc=el('div','card');rc.style.marginTop='10px';rc.innerHTML='<b>Turlar</b>';ROUNDS.forEach((r,i)=>{const done=F.rounds.find(q=>q.k===r.k);rc.appendChild(el('div','row','<span>'+(done?'✅':i===F.rounds.length?'➡️':'🔒')+' '+r.n+' · '+r.who+'</span><span class="muted">'+(done?fmt(done.amt)+'🪙 · %'+done.eq:'en az '+fmt(r.min.u)+' kullanıcı · '+fmt(r.min.rev)+'🪙/gün')+'</span>'))});
  if(R){const ok=p&&p.live&&p.users>=R.min.u&&revDay()>=R.min.rev;const b=el('button','btn b','🎤 '+R.n+' sunumu yap');b.disabled=!ok;b.onclick=pitchStart;rc.appendChild(b)}m.appendChild(rc);
  if(F.goals.length){const gc=el('div','card');gc.style.marginTop='10px';gc.innerHTML='<b>🎯 Yatırımcı hedefleri</b>';F.goals.forEach(q=>gc.appendChild(el('div','row','<span>'+q.r+': '+fmt(q.u)+' kullanıcı</span><span>'+(q.ok?'✅ tuttu':q.miss?'❌ kaçtı':'Gün '+q.until+'\'e kadar · '+Math.max(0,q.until-S.day)+' gün')+'</span>')));m.appendChild(gc)}
  m.appendChild(el('h3','','🏁 Rakipler ve pazar payı'));const rv=el('div','card');if(F.rivals){const tot=F.rivals.reduce((s,r)=>s+r.u,0)+(p?p.users:0),bar=el('div','');bar.style.cssText='display:flex;height:22px;border-radius:6px;overflow:hidden;margin:6px 0';const col=['#58a6ff','#f85149','#d29922','#a371f7'];
    [{n:p?p.name:'Biz',u:p?p.users:0}].concat(F.rivals).forEach((r,i)=>{const w=r.u/tot*100;const s=el('div','');s.style.cssText='width:'+w+'%;background:'+col[i];s.title=r.n+' %'+w.toFixed(1);bar.appendChild(s);rv.appendChild(el('div','row','<span><i style="display:inline-block;width:10px;height:10px;background:'+col[i]+';border-radius:2px"></i> '+r.n+'</span><span>'+fmt(r.u)+' · %'+w.toFixed(1)+'</span>'))});rv.insertBefore(bar,rv.firstChild);
    if(F.share&&F.share.length>1)rv.appendChild(chart(760,120,[{v:F.share.map(q=>q.me*100),c:col[0]}].concat(F.rivals.map((r,i)=>({v:F.share.map(q=>(q.r[i]||0)*100),c:col[i+1]})))))}m.appendChild(rv);
  F.offers.forEach(o=>{const c=el('div','card');c.style.cssText='margin-top:10px;border-color:#d29922';c.innerHTML='📨 <b>'+o.by+'</b> satın almak istiyor · '+fmt(o.v)+'🪙 · senin payın '+fmt(o.v*F.eq/100)+'🪙';const a=el('button','btn','Sat');a.style.marginLeft='8px';a.onclick=()=>{if(confirm('Buludex '+o.by+'\'a satılsın mı?'))sellCompany(o)};const x=el('button','btn s','Reddet');x.style.marginLeft='6px';x.onclick=()=>{F.offers=F.offers.filter(q=>q!==o);log('🙅 '+o.by+' teklifi reddedildi');render()};c.appendChild(a);c.appendChild(x);m.appendChild(c)});
  m.appendChild(el('h3','','🔔 Halka arz'));const ic=el('div','card');if(F.ipo){ic.innerHTML='<b>BLDX</b> · '+F.ipo.px[F.ipo.px.length-1]+'🪙/hisse · şirket değeri '+fmt(valuation())+'🪙';ic.appendChild(chart(760,120,[{v:F.ipo.px,c:'#3fb950'}]))}
  else{ic.innerHTML='<p class="muted">Şartlar: Seri B tamam · en az 200.000 kullanıcı · son ay kârlı</p>';const b=el('button','btn','🔔 Halka arz et');b.disabled=!ipoOK();b.onclick=()=>{if(confirm('Buludex halka arz edilsin mi?'))doIPO()};ic.appendChild(b)}m.appendChild(ic)};

/* ---------------- aç / kapat · zaman döngüsü ---------------- */
function loop(){if(!OPEN)return;const now=performance.now(),dt=Math.min(.25,(now-lastT)/1000);lastT=now;const S=st();
  if(S.speed>0){const min=dt*1*S.speed;/* 1x = saniyede 1 oyun dakikası (dünyanın 2 katı) */P().advance(min);tick(min,true)}else renderSoft();loopId=requestAnimationFrame(loop)}
function open(){const S=ensureIK();ensureOS();ensureFin();try{const bb=S.fin.camps.find(c=>c.t==='billboard'&&c.left>0);if(bb&&S.product)P().billboard({name:S.product.name,ic:TYPES[S.product.type].ic,slogan:'',until:bb.end})}catch(e){}ensureUI();OPEN=true;root.classList.add('on');P().pause(true);lastT=performance.now();if(S.lastDay>P().day)S.lastDay=P().day;render();cancelAnimationFrame(loopId);loopId=requestAnimationFrame(loop);P().sfx('blip')}
function close(){OPEN=false;if(root)root.classList.remove('on');cancelAnimationFrame(loopId);P().pause(false);P().save()}
/* köprüye kaydol */
P().bt={get:()=>BT,set:o=>{BT=(o&&typeof o==='object'&&o.v)?Object.assign(fresh(),o):null},tick:(min,desk)=>{try{tick(min,!!desk)}catch(e){console.error(e)}},open:open,close:close,get isOpen(){return OPEN},
  _t:{ensureFin:ensureFin,startCamp:startCamp,b2bClose:b2bClose,pitchStart:pitchStart,closeRound:closeRound,valuation:valuation,monthEnd:monthEnd,takeLoan:takeLoan,doIPO:doIPO,sellCompany:sellCompany,mgrLv:mgrLv,revDay:revDay,dailyFin:dailyFin,ensureOS:ensureOS,buyItem:buyItem,moveTo:moveTo,buyRack:buyRack,cloudSet:cloudSet,buildDC:buildDC,incStart:incStart,incEnd:incEnd,nobet:nobet,capOf:capOf,deskOf:deskOf,comfortLv:comfortLv,fits:fits,ensureIK:ensureIK,postAd:postAd,ask:ask,offer:offer,hire:hire,charOffer:charOffer,dailyIK:dailyIK,promote:promote,train:train,fire:fire,bonus:bonus,teamEvent:teamEvent,newCand:newCand,st:st,work:work,daily:daily,build:build,release:release,setTask:setTask,satisfaction:satisfaction,featScore:featScore,TYPES:TYPES,render:render,go:t=>{TAB=t;render()}}};
if(P().pendingBT!==undefined){P().bt.set(P().pendingBT);P().pendingBT=undefined}
})();
