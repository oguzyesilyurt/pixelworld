#!/usr/bin/env node
/* PixelWorld çevrimdışı liste testi
   1) sw.js içindeki CORE + SPLASH listesindeki her dosya diskte var mı?
   2) index.html, manifest.json ve tycoon.js'in başvurduğu yerel dosyalar (icons/, lib/, splash, manifest, tycoon.js…)
      service worker listesinde mi? Unutulan varsa çevrimdışıyken eksik kalır.
   Kullanım: node tools/check-offline.js   (hata varsa çıkış kodu 1) */
const fs=require('fs'),path=require('path');const ROOT=path.join(__dirname,'..');
const sw=fs.readFileSync(path.join(ROOT,'sw.js'),'utf8');
const sandbox={};new Function('self','caches','fetch',sw.replace(/self\.addEventListener[\s\S]*$/m,'')+';self.__F={CORE,SPLASH,FILES}')(sandbox,{},()=>{});
const {CORE,SPLASH,FILES}=sandbox.__F;const norm=f=>f.replace(/^\.\//,'').replace(/\?.*$/,'');
let bad=0;const listed=new Set(FILES.map(norm).filter(Boolean));
for(const f of FILES){const p=norm(f);if(!p)continue;if(!fs.existsSync(path.join(ROOT,p))){console.log('✗ listede ama diskte yok:',p);bad++}}
const refs=new Set();const scan=(file,txt)=>{const re=/["'(]((?:\.\/)?(?:icons|lib)\/[A-Za-z0-9_\-./]+\.(?:png|jpg|jpeg|webp|svg|js|json|woff2?|ttf|mp3|ogg|wav))(?:\?[^"')]*)?["')]/g;let m;while((m=re.exec(txt)))refs.add(norm(m[1]))};
['index.html','manifest.json','tycoon.js'].forEach(f=>scan(f,fs.readFileSync(path.join(ROOT,f),'utf8')));
['index.html','tycoon.js','manifest.json'].forEach(f=>refs.add(f));
for(const r of refs){if(!listed.has(r)){console.log('✗ başvuruluyor ama önbellek listesinde yok:',r);bad++}if(!fs.existsSync(path.join(ROOT,r))){console.log('✗ başvuruluyor ama diskte yok:',r);bad++}}
/* diskteki varlık klasörlerinde listede olmayan dosya */
['icons','icons/splash','lib'].forEach(d=>fs.readdirSync(path.join(ROOT,d)).forEach(n=>{const p=d+'/'+n;if(fs.statSync(path.join(ROOT,p)).isFile()&&!listed.has(p)){console.log('✗ diskte var ama önbellek listesinde yok:',p);bad++}}));
const size=FILES.map(norm).filter(Boolean).reduce((s,p)=>s+(fs.existsSync(path.join(ROOT,p))?fs.statSync(path.join(ROOT,p)).size:0),0);
console.log((bad?'✗ ':'✓ ')+FILES.length+' dosya listede ('+CORE.length+' çekirdek + '+SPLASH.length+' açılış görseli) · '+refs.size+' yerel başvuru · toplam '+(size/1048576).toFixed(1)+' MB'+(bad?' · '+bad+' sorun':' · eksik yok'));
process.exit(bad?1:0);
