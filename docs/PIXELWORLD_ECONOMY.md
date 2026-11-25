# PixelWorld · Ekonomi tablosu (v111)

Tüm fiyat ve gelirler `index.html` başındaki `const ECO={...}` nesnesinde toplanır. Diğer tablolar ve fonksiyonlar sayıları buradan okur: `SAL`, `CARDS`, `JOBPOOL` maaşları, menüler, `CARSI`, `CATALOG`/`FURN`, `LIST`, `CARLIST`, `PREMC`, `LOANT67`, `KF_BR`, `SR_RENT`, `SVC`, `SS_FAULTS`, ulaşım ücretleri, miras teklifleri, pasif gelir tavanı.

**Kayıtlı paraya dokunulmaz.** `coins`, borçlar, krediler ve birikim aynen kalır. Eski kayıtta yalnız ölçek değerleri yeni ölçeğe taşınır: kabul edilmiş iş maaşı ve başvurular ×10, kafe hemşirelik maaşı tabanı ×10, kredi kartı limiti yeni tablodaki değere yükseltilir.

## 1. Gelir: maaş (10 günde bir)
| Karakter | Eski | Yeni | Günlük karşılığı |
|---|---|---|---|
| Oğuz (`sen`) | 2.600 | **32.000** | 3.200 |
| Denel (`kiz`) | 2.000 | **26.000** | 2.600 |
| Abla | 2.200 | **28.000** | 2.800 |
| Eniştem (`esi`) | 2.800 | **34.000** | 3.400 |
| Almira | 2.300 | **28.000** | 2.800 |
| Berke | 2.500 | **30.000** | 3.000 |
| Yeğen (harçlık) | 250 | 3.000 | 300 |

- **LinkedIn teklifleri:** `JOBPOOL` × 10, haftalık ±1.000. Aralık 25.000–45.000.
- **Kredi kartı limitleri:** 36.000–60.000.

## 2. Günlük yaşam
| Kalem | Fiyat |
|---|---|
| Dışarıda yemek (menüler ×2) | çay 20 · kahve 40 · tost 70 · döner 120 · Adana 180 · karışık ızgara 280 |
| Çarşı ve sinema | ×2 |
| Ulaşım | otobüs 20 · metro 20 · tramvay/İZBAN 25 · Havaş 80 · taksi 250 · havalimanı taksisi 300 |
| Mobilya/eşya kataloğu | ×4 (kanepe 600, yatak 800) |
| Usta | elektrik 750 · tesisatçı 600 · beyaz eşya 1.050 |
| Kiracı tamiri | hasar puanı başına 84 |
| İkinci el araç arızaları | ×3,5 (debriyaj 7.700 · şanzıman 22.800) |

**Tipik bir gün:** iki öğün dışarıda + kahve + iki yolculuk ≈ **400–600**. Kirada oturuluyorsa 1+1 kira ≈ 250/gün eklenir. Günlük gider böylece maaşın **%20–30'u**; günde **1.900–2.500** birikir.

## 3. Ev (satış) ve kira
Kira = fiyat / 110, haftalık (`ECO.home.rentDiv`).

| İlan | Fiyat | Haftalık kira |
|---|---|---|
| Çiğli 1+1 (`cig1`) | **190.000** | 1.730 |
| Halkapınar 1+1 (`hlk1`) | 230.000 | 2.090 |
| Çiğli 2+1 (`cig2`) | 240.000 | 2.180 |
| Bostanlı 2+1 / bahçeli kiralık | 300.000 | 2.730 |
| Alsancak 2+1 | 320.000 | 2.910 |
| Bahçeli müstakil 2+1 | 360.000 | 3.270 |
| Bostanlı 3+1 | 380.000 | 3.450 |
| Kordon 3+1 / Bornova bahçeli | 420.000 | 3.820 |
| **Eski müstakil villa (`krb1`)** | **820.000** | 7.450 |
| **Bornova teraslı villa** | **850.000** | 7.730 |
| **Bornova havuzlu villa** | **1.150.000** | 10.450 |
| **Modern havuzlu villa (`krb2`)** | **1.300.000** | 11.820 |
| Büyükannenin arsasına yapılan ev | 900.000 + model | — |

- **Konut kredisi:** v92 kuralları korundu (50–80B, 12/24/36 gün, %2–4). Yalnız maaş eşiği yeni ölçeğe taşındı: 10B maaşta 50B limit, 30B ve üstünde 80B limit.
- **İlk ev hesabı:** 190B'lik 1+1 = 80B kredi + 110B peşinat. Peşinat 44–58 günlük birikim.

## 4. Araba
| Araç | Fiyat | Birikim süresi* |
|---|---|---|
| Hatchback (4 renk) | 32.000–36.000 | 13–19 gün |
| SUV (3 renk) | 45.000–48.000 | 18–25 gün |
| Lüks: Roadster 320B · Limuzin 360B · El. Sedan 380B · GT Coupé 420B · Lüks SUV 480B · Süper GT Karbon 540B · Hiper Spor 580B · Altın Seri 600B | **300.000–600.000** | miras / taşıt kredisi (en fazla 250B) |

\* Günde 1.900–2.500 birikimle.

İkinci el pazarındaki fiyatlar bu tabandan yaş, km ve hasara göre hesaplanır.

## 5. Miras teklifleri
| Miras | Teklifler | Pazarlık tavanı |
|---|---|---|
| Bornova (büyükanne) | 1,2M–1,45M · 1,38M–1,63M · 1,56M–1,8M | **2M** |
| Menemen çiftliği (dede) | 650B–770B · 720B–840B · 800B–920B | 1M |

**Neden bu aralık?** 1,2–2M ile bir villa (820B–1,3M) ya da bir lüks araba (300–600B) ve bir daire alınabilir, ama ikisi birden zor sığar. Miras bir sıçrama sağlıyor, sınırsız para değil.

## 6. Pasif gelir
| Kaynak | Değer |
|---|---|
| Kafe (şube başı) | ciro = 1.500 + 25 × memnuniyet (2. şube ×1,15); malzeme %30; sabit gider 1.400 / 1.700. Net: memnuniyet 50'de ≈ +550, 100'de ≈ +1.400–1.700. Şube fiyatı 300B / 450B |
| Sera kirası (günlük) | Kooperatif 620 · Mehmet Bey 800 · Efe 980 |
| Sera ürünleri | Pazar satış fiyatları ×2 (aktif gelir). Tezgâh ücreti köy 60 / semt 100 |
| Ev kiraya verme | Haftalık kira × 0,9 − 40 (1+1 ≈ 1.520/hafta, villa ≈ 10.600/hafta) |

**Tavan:** Kafe, sera kirası ve ev kirasının günlük toplamı, günlük maaşın **%90'ını geçemez** (`ECO.passive.capK`). Fazlası "vergi + işletme gideri" olarak kesilir; kafe gün sonu raporunda gösterilir.

Örnek: Oğuz için tavan günde 2.880. Kafe 2 şube + sera kirası + bir kiralık daire tavanı doldurabilir, maaşı geçemez. Tek bir kaynak maaşın %20–50'si arası katkı sağlar.

## Gerekçe
- **Eski ölçek kopuktu:** Maaş günde ~260 🪙'ydi; bunun büyük kısmı yemek ve kiraya gidiyordu. 9B'lik hatchback için ~150 gün gerekiyordu, miras ise 1,2–2M'ydi (maaşın 5.000 katı).
- **Yeni ölçek:** Maaş ×12. Yaşam giderleri ×2 artırıldı; böylece maaşın %20–30'unu tutuyor (rahat ama anlamlı). Ekonomik arabalar 15–25 günlük birikime, daireler ilk evi kredi + ~2 aylık birikimle alınabilir aralığa oturtuldu.
- **Villalar ve lüks arabalar** yalnız maaşla 1–1,5 yıl sürer. Miras ise bunlardan birini hemen alır, ikisini birden almaya yetmez.
- **Pasif gelir** kafe/sera/kiralık ev için ciddi bir hedef, ama tavan sayesinde maaşın yerini tutmuyor.

## Bilinen sınırlar
- **Konut kredisi taksiti:** 80B ve 36 gün vadede günlük taksit ≈ 2.290. Denel'in günlük birikiminden (≈1.900) yüksek, bu yüzden peşinatın yanında birkaç günlük yedek gerekir. v92 vade kuralları değiştirilmedi.
- **Eski kayıtta araba:** Eski fiyatla (9B) alınmış bir araba yeni fiyattan satılırsa kâr eder. Paraya dokunmama kuralı gereği bu düzeltilmedi.
- **ECO dışında kalanlar:** Tekne fiyatları (320B–780B), market/kargo ürünleri, AVM kıyafetleri ve senaryo içi küçük bahşiş/ödül tutarları eski değerlerinde.
