# PixelWorld · Stabilite turu (v110)

Test ortamı: Chrome (ANGLE/D3D11), AMD Radeon 610M, 1280×800.

## 1) Test turu
**Ayarlar → 🧪 Test → 🚦 Test turu** sırayla şunları açar ve her birinde 2 sn bekler:
- 13 mahalle,
- ardından ilk 3 mahalle yeniden (bellekten boşaltılıp yeniden kurulmalarını sınamak için),
- tüm iç mekânlar,
- dispose edilen 4 iç mekân yeniden.

Hatalar şu kaynaklardan toplanır: `showErrOnce`, `console.error`, `window.onerror`, `unhandledrejection`. Sonuç bir pencerede ve konsolda tablo olarak gösterilir.

İç mekân listesi `door()` ve `enter()` çağrılarından toplanan anahtarlar, `INT` anahtarları ve sabit bir listenin birleşimidir. Yolculuk sahneleri (uçak, tekne, `rest_*`) kendi akışlarından açıldığı için turda atlanır.

**Son tur:** 16 mahalle, 24 iç mekân, 153 sn, **0 hata**.

| Mahalle | Kurulum (ms) |
|---|---|
| merkez | 539 |
| karsiyaka | 450 |
| alsancak | 285 |
| bostanli | 307 |
| cigli | 402 |
| karabaglar | 374 |
| kocaeli | 222 |
| mall_forum | 365 |
| mall_mavibahce | 163 |
| mall_hilltown | 133 |
| aksaz | 323 |
| marmaris | 280 |
| bozdag | 158 |
| merkez (yeniden kurulum) | 445 |

## 2) Bulunan ve düzeltilen hatalar
| # | Sorun | Düzeltme |
|---|---|---|
| 1 | v109 dokulu malzemelerde Sims görüş kesiti (`cutPatch`) kaybolmuştu. Oyuncunun önündeki bina şeffaflaşmıyordu. | Doku shader'ı görüş kesiti kodunu da ekliyor. |
| 2 | v109 dokulu malzemeler mg38 statik birleştirmesine girmiyordu (çizim çağrısı artışı). | `mgMatOK`/`mgKey` dokulu malzemeyi tanıyor; birleşik mesh aynı doku ayarlarını alıyor. |
| 3 | Mahalle yeniden kurulunca heap büyüyordu (iki turda 428 → 747 MB). Gruptan çıkarılmış ama dispose edilmemiş geometriler renderer'da kalıyordu. | Kurulum sırasında oluşan geometriler mahalle adıyla kaydediliyor ve boşaltmada dispose ediliyor. |
| 4 | Eski mahalleyi tutan global listeler: `V3S` (kişi iskeletleri), `VEND` (satıcılar), `carMeshes`, `C_REF`, `FACES`, `glows`, `facades`. | Boşaltma ve dispose sonrası budanıyor. |

## 3) Kayıt uyumluluğu
`normalizeSave110` her kayıt okumasında çalışır (`readSaveSafe`). Bozuk ya da tipi yanlış alan varsayılana döner, kayıt çökmeden yüklenir.

**Ayarlar → 💾 Kayıt uyumluluk testi** aşağıdaki durumları yükler ve oyun durumunun tutarlılığını (değişmezlerini) kontrol eder.

| Durum | Varsayılana dönen alanlar | Sonuç |
|---|---|---|
| v1 (eski, yalnız temel alanlar) | — | ✅ |
| lookv 2 · `home.own` yok · SCN yok | home.own | ✅ |
| Bozuk tipler | hunger, mood, looks, bonds.ogus, day, hyg, home.own, home.loan, own, furn.ev_cigli, x.know, x.mem, x.depo, x.inv, x.x67, x.x102, x.gt, x.x80.scn | ✅ |
| SCN eksik alanlar | — (`tasks`, `done`, `timers`, `v` tamamlanır) | ✅ |
| `v` alanı yok | Kayıt yok sayılır, yeni oyun başlar | ✅ |
| Kök bir dizi | Yok sayılır | ✅ |
| Boş nesne | — | ✅ |

Kontrol edilen değişmezler:
- `coins`, `hunger`, `mood`, `GT`, `HOME.day` geçerli sayı,
- `HOME.own` nesne,
- `SCN.tasks`, `KNOW`, `MEM` dizi,
- tüm `BONDS` değerleri sayı.

Test bittikten sonra kayıt yazımı durur ve "🔄 Asıl kayda dön" sayfayı yeniler.

## 4) Performans
**Ayarlar → 📊 FPS göster** sol altta şunları gösterir: FPS, karedeki toplam çizim çağrısı ve üçgen sayısı (gölge ve post-process geçişleri dahil), geometri ve doku sayısı, bellekteki mahalle ve iç mekân sayısı.

**Statik birleştirme (mg38 genişletmesi):**
- dokulu (v109) malzemeler artık birleşiyor,
- `b2`/`merged` işaretli statik bina grupları artık birleşiyor.

Çizim çağrıları (Orta kalite, öğlen, yalnız ana sahne render'ı):

| Mahalle | v109 | v110 |
|---|---|---|
| Çiğli | 422 | 363 (−14%) |
| Merkez | 375 | 389 (+4%) |
| Alsancak | 303 | 272 (−10%) |

**Uzak nesneler:**
- Kameradan 60+ birim uzaktaki yayalar donar.
- Uzaktaki araçlar yolda ilerlemeye devam eder; konum, yön ve tekerlek animasyonu saniyede bir güncellenir.

**İç mekân dispose:**
- Çıkışta kullanılmayan iç mekânların geometrisi, malzemesi ve dokusu serbest bırakılır.
- Kalıcı durumu olan iç mekânlar tutulur: `ev_*`, ofis `of1–3`, `komsu_*`, içinde partnerin bulunduğu iç mekân.
- Son turda 18 iç mekân dispose edildi. Yeniden girişte hata yok.

## 5) Bellek: mahalle LRU
- Bellekte en fazla 3 mahalle tutulur. En eski kullanılan boşaltılır; aktif mahalle ve iç mekândan dönülecek mahalle hariç.
- Geri gelinince aynı tohumla yeniden kurulur: `rnd` mahalle adının hash'iyle tohumlanır.
- Merkez yeniden kurulumu: mesh, çarpışma kutusu ve etkileşim noktası sayıları aynı (2563 / 451 / 23).
- Arabanın durduğu mahalle yeniden kurulunca araba yerine konur.

13 mahalle × 2 tur, GC sonrası:

| | Heap | GPU geometri |
|---|---|---|
| LRU kapalı (13 mahalle bellekte) | 438 MB | 13 445 |
| LRU açık (3 mahalle) | **167 MB** | **1 893** (tur sonunda sabit) |

## Bilinen sınırlar
- Kodda 180 `Math.random` çağrısı var. Yeniden kurulumda yerleşim aynı, ama yaya ve araç başlangıç konumları gibi bazı rastgele ayrıntılar değişebilir.
- Turdan sonraki heap (~527 MB) yüklü 3 mahalle ile bilerek tutulan 6 ev/ofis iç mekânını içerir. Yalnız iç mekân gir-çık senaryosunda heap 99 MB'de kalıyor.
- Merkez'de birleştirme sonrası çizim çağrısı %4 arttı. Nedeni: tohumlu `rnd` yüzünden merkezin rastgele süslemeleri v109'dakinden farklı dağıldı.
