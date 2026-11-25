# PixelWorld · Performans (v117)

**Ölçüm ortamı:** Chrome (ANGLE/D3D11), AMD Radeon 610M (entegre GPU), 1280×800, devicePixelRatio 1, FPS sınırı kapalı, öğlen.
- Her satır, sahnede 5 sn bekledikten sonra 3 sn'lik ortalama.
- **Orta kalite**, mobilin varsayılan kademesi. Bu GPU, orta seviye bir telefon için vekil olarak kullanıldı.
- "render" sütunu `renderer.render` çağrısının CPU süresi; GPU beklemesini de içerir.

**Ölçüm aracı:** Ayarlar → 🧪 Test → **📈 Performans paneli**. Sol altta şunları gösterir: FPS, kare süresi, JS süresi, render süresi, çizim çağrısı, üçgen, geometri/doku sayısı, bellekteki mahalle ve iç mekân sayısı.

## Önce → sonra
| Kalite | Sahne | FPS | Kare (ms) | JS (ms) | Render (ms) | Çizim çağrısı | Üçgen | Geo / doku (önce) |
|---|---|---|---|---|---|---|---|---|
| mid | merkez | 56.3 → **58.3** | 17.8 → 17.2 | 0.5 → 0.7 | 16 → 19 | 475 → **317** (-33%) | 197k → 160k | 2327 / 199 |
| mid | karsiyaka | 58.7 → **56.7** | 17.1 → 17.6 | 0.6 → 0.6 | 15.5 → 15.9 | 368 → **329** (-11%) | 193k → 173k | 2957 / 298 |
| mid | alsancak | 60.2 → **63** | 16.6 → 15.9 | 0.5 → 0.5 | 14.9 → 14.6 | 372 → **285** (-23%) | 227k → 171k | 2578 / 273 |
| mid | bostanli | 53.8 → **54.7** | 18.6 → 18.3 | 0.6 → 0.6 | 16.8 → 16.5 | 528 → **356** (-33%) | 300k → 215k | 2275 / 297 |
| mid | cigli | 57.3 → **56.8** | 17.5 → 17.6 | 0.6 → 0.7 | 15.9 → 15.8 | 414 → **405** (-2%) | 194k → 187k | 2597 / 260 |
| mid | karabaglar | 57.5 → **57.7** | 17.4 → 17.4 | 0.6 → 0.7 | 15.8 → 15.4 | 373 → **301** (-19%) | 230k → 190k | 2931 / 316 |
| mid | kocaeli | 58.8 → **58** | 17 → 17.3 | 0.5 → 0.6 | 15.7 → 15.5 | 479 → **361** (-25%) | 277k → 217k | 2587 / 298 |
| mid | mall_forum | 53.3 → **54.8** | 18.8 → 18.3 | 0.4 → 0.5 | 17.4 → 16.8 | 287 → **293** (2%) | 249k → 284k | 2118 / 264 |
| mid | marmaris | 56 → **54** | 17.9 → 18.4 | 0.6 → 0.7 | 16.3 → 16.3 | 585 → **469** (-20%) | 323k → 265k | 1852 / 282 |
| mid | iç aspava | 146.3 → **142.7** | 6.8 → 7.1 | 0.5 → 0.6 | 5.5 → 5.7 | 1292 → **1186** (-8%) | 211k → 211k | 2778 / 275 |
| mid | iç of2 | 263.3 → **277.7** | 3.9 → 3.6 | 0.2 → 0.3 | 3.5 → 3.3 | 436 → **298** (-32%) | 82k → 56k | 2493 / 280 |
| mid | iç hastane | 246.3 → **261.8** | 4.1 → 3.9 | 0.3 → 0.3 | 3.2 → 3.2 | 441 → **350** (-21%) | 66k → 58k | 2719 / 294 |
| mid | iç ev_karabaglar | 202.8 → **199.7** | 4.9 → 5 | 0.3 → 0.4 | 4.2 → 4 | 869 → **720** (-17%) | 53k → 43k | 2996 / 304 |
| mid | iç havalimani | 204.5 → **198.7** | 4.9 → 5 | 0.3 → 0.3 | 4 → 4.3 | 152 → **170** (12%) | 70k → 75k | 3128 / 318 |
| high | cigli | 42.7 → **43.2** | 23.4 → 23.2 | 1.4 → 0.7 | 20.8 → 21 | 470 → **383** (-19%) | 208k → 171k | 1308 / 119 |
| high | merkez | 44.5 → **46.5** | 22.5 → 21.6 | 0.9 → 0.6 | 19.8 → 19.9 | 507 → **294** (-42%) | 201k → 135k | 2378 / 204 |
| high | mall_forum | 46.7 → **48.5** | 21.4 → 20.7 | 0.5 → 0.9 | 19.8 → 18.6 | 337 → **327** (-3%) | 324k → 324k | 2742 / 217 |

**Hedef:** orta seviye telefonda dünya ≥ 45 FPS, iç mekân ≥ 55 FPS.
- Bu donanımda Orta kalitede dünya **54–63 FPS**, iç mekânlar **143–278 FPS**; hedef karşılanıyor.
- Yüksek kalite (bloom/post-process açık) dünyada 43–48 FPS.

Görsel kontrol: önce ve sonra ekran görüntüleri (Merkez otoparkı, Çiğli, Forum, Aspava) aynı. Arabaların tekerlek ve gölgeleri, karakterler ve gölgeleri yerinde.

## Teşhis
- **JS süresi küçük:** her sahnede 0,3–0,7 ms. Kare süresinin neredeyse tamamı render.
- **Çözünürlük etkisiz:** render ölçeğini 0,7'ye indirmek FPS'i değiştirmedi; piksel doldurma darboğaz değil.
- **Sahne matrisleri etkisiz:** `scene.autoUpdate=false` (matris güncellemesi yok) fark yaratmadı.
- **Gölge en büyük kalem:** gölge haritası kapatılınca 56 → 72 FPS.
- **Çizim çağrısı dağılımı (Orta, Merkez, ana geçiş):**
  - karakter parçaları ≈ 80–120 (karakter başına ~15 mesh),
  - park etmiş araba başına ~12–14,
  - gündüz opaklığı 0 olan far ve lamba sprite'ları,
  - AVM tabelaları ≈ 90.

## Yapılanlar
1. **Ölçüm:** performans paneli eklendi; JS ve render süreleri ayrı ölçülüyor.
2. **Çizim çağrıları:**
   - **Karakter uzuvları:** her kol ve bacaktaki düz renkli parçalar (kol, ön kol, el / bacak, ayakkabı) oluşturma anında tek mesh'e birleşiyor. Vertex color ve paylaşımlı malzeme kullanılıyor, kemik hareketi aynı. Karakter başına 10 uzuv çağrısı 4'e iniyor; gölge geçişinde de aynı kazanç var.
   - **Park etmiş arabalar:** lastik, jant yüzü ve gölge plakası mahalle başına `InstancedMesh`. Hareket eden araç algılanınca otomatik geri dönülüyor (her karede bir aracın matrisi kontrol ediliyor).
   - **Işıma sprite'ları:** opaklığı ~0 olanlar (gündüz far ve lambalar) çizilmiyor; gece aynen görünüyor.
   - **mg38:** v114'te birleştirme eşiği 3'ten 2'ye indirilmişti; v110'da dokulu malzemeler ve `b2` grupları kapsama alınmıştı.
3. **Görünmeyeni çizme:**
   - mg38 birleşik mesh'leri 36 birimlik hücrelere bölünmüş durumda; her hücrenin kendi bounding sphere'i var, frustum culling çalışıyor.
   - Aktif olmayan mahalle ve iç mekân grupları `visible=false` ile render'dan çıkıyor.
   - v110'dan beri bellekte en fazla 3 mahalle tutuluyor; kullanılmayan iç mekânlar çıkışta dispose ediliyor.
4. **Gölge:**
   - Kamera ve oyuncu durağanken gölge haritası her 3 karede bir güncelleniyor, hareket varken kalite kademesindeki sıklıkta.
   - Gölge haritası boyutu kaliteye göre (1024/2048/4096) ve oyuncuyu izleyen, texel'e oturan gölge kamerası v108'den.
   - Gerçek ışık yalnız Yüksek'te 2, Ultra'da 4; gece lamba havuzları additive decal.
5. **Çözünürlük:**
   - pixelRatio Yüksek'te en fazla 1,5, Ultra'da 2.
   - Dinamik ölçek: FPS 40'ın altında 2,5 sn kalırsa render ölçeği 0,85'e iniyor, 54'ün üstünde 6 sn kalırsa 1'e dönüyor.
   - UI DOM olduğu için keskin kalıyor.
6. **JS:**
   - Trafik araçlarında kare başına 4 yeni `Vector3` yerine önceden ayrılmış vektörler.
   - Menü, telefon ya da tam ekran pencere açıkken 3D render 10 FPS (oyun mantığı aynı hızda).
   - Uzak NPC/araç dondurma (v110), uzak yürüyenlerin 5 karede bir güncellenmesi (v38) ve yüz animasyonu mesafe sınırı (v112) zaten vardı.
7. **Yükleme:** yeni mahalle ya da iç mekân kurulunca `renderer.compile` geçiş ekranı altında çalışıyor; ilk karede shader derleme takılması olmuyor. Büyük canvas dokuları zaten önbellekli (cephe, yüz, doku).

## Yapılmayanlar ve nedenleri
- **Global `std()` önbelleği:** Pek çok kod `std()` ile aldığı malzemenin rengini ya da emissive değerini sonradan tek tek değiştiriyor. Paylaşmak bunları birbirine bağlar ve görüntüyü bozar. Statik meshlerde mg38 zaten renkten bağımsız birleştiriyor (rengi vertex color'a taşıyor).
- **Tabela ve cephe doku atlası:** UV'leri yeniden yazmak ve mipmap taşmasını önlemek gerekiyor. Ölçülen kazanç yalnız AVM'lerde anlamlı (~90 çağrı); ayrı bir adım olarak bırakıldı.
- **Uzak bina LOD'u:** Ortografik izometrik kamerada "uzak" bina yok; görüş alanı sabit bir kutu. Görünenin dışı zaten frustum ile kesiliyor.
- **Statik/dinamik ayrı gölge haritası:** three r128'de standart ışıkla mümkün değil. Bunun yerine durağan anda seyrek güncelleme yapılıyor.
- **HUD güncellemeleri:** zaten 4–5 Hz. JS toplamı < 1 ms olduğundan ek bir kazanç ölçülemedi.
