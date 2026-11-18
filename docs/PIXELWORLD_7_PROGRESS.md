# PixelWorld 7.0 — İlerleme

Durum anahtarı: ✅ tamam · 🟡 kısmi · ⏳ yapılmadı

## v55 (2026-11-18)
- ✅ Oğuz yeni nesil prototip karakter: SDF heykelden tek parça pürüzsüz gövde, ayrı tişört/pantolon/ayakkabı katmanları, şekilli baş (göz kapağı, kirpik, kaş, dudak, kulak), 8 farklı saç modeli, iskeletli yürüyüş. Stüdyoda yüksek, dünyada düşük detay (LOD). Ayarlardan kapatılabilir.
- ✅ Menü ve karakter stüdyosu referans tasarıma göre yenilendi (mor tema, portreler, saç kartları, döndürme okları, "Kaydet ve Devam Et").
- ✅ Alçak çapraz kamera seçeneği (Ayarlar → Kamera & karakter).
- ✅ Bilekteki derin boşluk giderildi (eski ve yeni model).
- ✅ Stüdyoda yüz/vücut ayarında menüye atma: her kaydırmada yeniden üretim + bırakılmayan materyaller bellek taşırıyordu (mobil tarayıcı sayfayı yeniliyordu). Artık kaydırma bırakılınca üretiliyor, eski model ve materyaller temizleniyor, önbellek 30 parçayla sınırlı.
- ✅ Dış şehir halkası: Aksaz ve Bozdağ hariç tüm ilçelerde çekirdeğin çevresine ilçe karakterine göre blok, sokak, park parselleri (Çiğli konut, Karşıyaka/Alsancak ticari, Kocaeli kule+konut, Karabağlar alçak evler, Marmaris beyaz/kiremit, havalimanı depo). Tek birleşik mesh, gece pencere ışıkları.
- ✅ Çekirdekteki boşluklar: giriş/tabela kurallarını kontrol eden ikinci dolgu geçişi; önü açık tutulması gereken bölgelere görüşü kapatmayan alçak bahçe/çiçeklik.

## v56–57 (2026-11-18)
- ✅ NPC günlük yaşam yönetmeni: simit arabasına yürüme → sıra → satın alma → yerken yürüme; telefonla konuşma (telefon elde, konuşma balonları); bank molası (oturma pozu); nadir tartışma (yaklaşma, el kol hareketi, çevredekiler durup bakar, %12 kısa itişme, sakinleşme); iş saatleri (sabah/akşam işe gidip gelenler hızlı yürür, gece şehir sakinleşir; görünürlük kameradan uzaktayken değişir). Simit arabası olmayan ilçelere kaldırıma 2 araba.
- ✅ FitPark Spor Salonu (Çiğli, Kocaeli, Karşıyaka): koşu bandı, kondisyon bisikleti, dambıl, yoga, pilates, su sebili; kondisyon artar, her 4 antrenmanda kas +/kilo − (karakter modeline yansır); antrenman yapan NPC'ler.
- ✅ Strike Bowling & Bilardo (Bostanlı, Alsancak): bowling — pist fiziği, labut çarpışmaları, 10 frame strike/spare skoru, partnerle sıra; bilardo — 8 top kuralları (grup atama, faul, 8 topla kazanma/kaybetme), top fiziği, rakip yapay zekâsı.
- ✅ Parlak Oto Yıkama & Servis (Çiğli, Bostanlı, Kocaeli): otomatik/elle yıkama, yağ bakımı (5000 km), lastik, muayene (1 yıl), aksesuar. Araç kiri sürüşle/yağmurla artar ve arabanın rengine görünür şekilde yansır; bakım hatırlatması.

## v58
- ✅ PixelGram (telefon): akış, profil, bildirim; oyundan gerçek fotoğraf çekip paylaşma ya da anı paylaşma; beğeni, yorum, takip; karakterler zamanla paylaşım yapar, gönderine beğeni/yorum gelir; takip/beğeni ilişki bağını artırır.
- ✅ Kutlama (telefon): davetiye, pasta, süsleme, hediye; evde parti: balon & afiş, mumlu pasta, misafirler şarkı söyler, mum üfleme, hediye açma, fotoğraf (PixelGram + anılar).
- ✅ Hediye paketleme: 8 hediye × 4 paket kâğıdı, yanındaki karaktere verme, kutudan çıkma animasyonu, kişiye göre tepki (Denel Lego/F1 sever) ve bağ artışı. GTA 6 tek seferlik sürprizine dokunulmadı.

## v59
- ✅ GünGün Süpermarket (Çiğli, Karşıyaka, Kocaeli, Bostanlı, Karabağlar): oyuncunun önünde yürüyen alışveriş arabası (ürünler arabada görünür), 7 reyon/26 ürün, iki kasa ve kasiyer, ödeme → ürünler envantere (yemek sistemiyle aynı format), elde poşetler, alışveriş yapan NPCler.
- ✅ Ege Üniversitesi kampüsü (Karşıyaka, Kocaeli): 5 bölüm, kayıt, ders (oturarak), kütüphane, kantin, 3 soruluk bölüm sınavı (bilgi + doğru cevap → AA–FF, +6 kredi), transkript, 24 kredide mezuniyet (anı + PixelGram).
- ✅ Otel işleri: otel resepsiyonlarının yanında iş noktası; resepsiyonist/garson/temizlik/aşçı/güvenlik; başvuru, vardiya animasyonu, ücret (+ garsona bahşiş).
- ✅ Yeni mekânlar yerleştirilirken giriş görüşü kontrolü (kamera önünü bina kapatmıyor).

## v60 (düzeltme)
- ✅ v59'daki görüş kontrolü yoğun ilçelerde (Çiğli) hiç yer bulamayınca spor salonu/oto yıkama/market yerleşmiyordu. Artık çekirdekte görüşü açık yer yoksa mekân doğu halka yolunun karşısına (dış halka) yerleşiyor; önü açık ve yürüyerek ulaşılabilir.

## Paket 7.0 maddeleri
| Madde | Durum |
|---|---|
| Boş alan doldurma, min zoom | ✅ v55 |
| Aksaz koruma | ✅ dokunulmadı |
| NPC günlük yaşam (simit, telefon, tartışma, iş) | ✅ v56 (iş yerinde çalışma animasyonu yok) |
| Araç bakımı / oto yıkama | ✅ v57 |
| Süpermarket | ✅ v59 |
| Okul/üniversite | ✅ v59 (üniversite; ilk/orta okul yok) |
| Kendi işletmen | ⏳ yapılmadı |
| Trafik kuralları | ⏳ yapılmadı (sürüş koduna dokunma kuralı nedeniyle ayrı tasarım gerekiyor) |
| Spor salonu | ✅ v57 |
| Otel işleri | ✅ v59 |
| Doğum günü | ✅ v58 |
| Sosyal medya | ✅ v58 |
| Hediye paketleme | ✅ v58 |
| Bowling / bilardo | ✅ v57 (2D oyun ekranı) |

## Bilinen sorunlar / eksikler
- Kendi işletmeni açma ve trafik kuralları (ışık, yaya geçidi, ceza, sürüş modları) yapılmadı.
- NPCler iş yerinde çalışma animasyonu yapmıyor (iş saatinde görünmez oluyorlar).
- Yeni nesil karakter yalnız Oğuz için (prototip); diğer karakterler onay sonrası.
- Çiğli'de 3 eski giriş görüş sorunu kalıyor (yüksek kule binaları önünde).
- Dış halka binaları dekor (girilemez).

## v61 — kullanıcı geri bildirimi düzeltmeleri
- Oğuz yeniden eski (diğer karakterlerle aynı) modele döndü. Yeni SDF modeli artık Ayarlar → "Yeni nesil Oğuz (deneysel)" ile isteğe bağlı (varsayılan kapalı; eski `SET.proto` anahtarı yok sayılır).
- Yol kenarı park araçlarında (parkCar, galeri, otopark dışı) tekerlekler hiç çizilmiyordu → araç başına tek birleşik teker mesh'i eklendi.
- Bina kaldırma sonrası konan alçak park (lowPark38) yola taşıyorsa artık konmuyor (Karşıyaka sahil yolundaki çit+bank).
- `terrain()` içindeki 60 rastgele yarı saydam yeşil zemin lekesi kaldırıldı; lowFill55 çimi normal çim rengine çekildi.
- Yeni mekân yerleşimi (spor salonu, süpermarket, oto yıkama, bowling, üniversite) `rsv60`: kapı önü 7 m boş + tabela görünürlüğü; olmazsa girişsiz sıradan binaları kaldırıp yer açar; en son dış halka (x=94) — bu durumda kamera sınırı o mahallede genişler, mekânlar birbirinin önünü kapatmaz.

## v62 — manzara, ulaşım, deniz canlıları, go-kart
- Sürüş manzarası: koni (piramit) dağlar ve sisle beyaza dönen yarım küre tepeler kaldırıldı; 3 katmanlı yumuşak dağ sırası (uzakta karlı zirve), bulutlar dağların üstüne taşındı. Marmaris dağ yolu da aynı. Sürüş kodu (driveUpdate/DR mantığı) değişmedi.
- Ulaşım durak paneli yeniden yazıldı (ızgara, metin taşmıyor, mobil uyumlu). ESHOT artık 10 durak: Kordon, Halkapınar, Karşıyaka, Bostanlı, Çiğli, Karabağlar, Havalimanı, 3 AVM.
- Tekne: burun tarafından da atlama + burun merdiveniyle çıkış.
- Balıklar: torna gövde, çatal kuyruk, yüzgeç, göz; kuyruk çırpma (shader). Köpek balığı yeni model. Mercan resifleri (dallı, beyin, yelpaze, masa, anemon, sünger, deniz çayırı) dalışta ve akvaryumda.
- Dalış: alan genişledi, kayalar takılmıyor, bırakınca süzülme, daha çok balık sürüsü, bazen köpek balığı.
- Safari parkı: zürafa, zebra, fil, aslan, geyik, flamingo pürüzsüz (SDF) modeller + desen (benek/çizgi).
- Go-kart: pist boş alana (Karabağlar dış halka) taşındı; gerçek parkur (asfalt, kerb, kum, lastik bariyer, start köprüsü ışıkları, tribün, pit, bayraklar, dönen kartlar). Yeni yarış oyunu: takip kamerası, gerçek parkur, 4 rakip, minimap, start ışıkları, fren.

## v63 — mevsimsel hava, kar, üşüme, yeni Pazarcık
- Hava artık günler arası süreç: açık / parçalı / bulutlu / yağmurlu / karlı. Yağış bitince ertesi gün hemen güneş açmaz (bulutlu → parçalı → açık). Kar sadece kışın ve mevsim geçişlerinde (sonbahar sonu, ilkbahar başı), soğuk günlerde.
- Sıcaklık: mevsim eğrisi + günlük salınım + rastgele sapma; saatte gösterilir (örn. "❄️ 2°"). Saate dokununca hava paneli.
- Kar: düşen tane efekti (sürüşte de), yerde biriken ve günler içinde eriyen kar örtüsü (denize taşmaz), gri gökyüzü.
- Üşüme: soğukta giyim sıcaklığı yetersizse üşüme birikir ("Brr… üşüdüm"); eşik aşılınca yalnızca bazen (%22) soğuk algınlığı/grip (mevcut hastalık sistemi). Ihlamur/çorba üşümeyi alır.
- Kışlık giyim: mont/kaban (yüksek sıcaklık), kazak, polar, yağmurluk, kar botu, bere, atkı, eldiven, termal içlik, şemsiye, ısıtıcı. Aksesuarlar saat paneli > Kışlıklar'dan takılıp çıkarılır. (Bere/atkı/eldiven için karakter üstünde görsel yok — sadece sıcaklık etkisi.)
- Pazarcık: yeni kategoriler (❄️ Kışlık, Elektronik, Ev & Mutfak, Spor & Outdoor, Kitap & Hobi, Makyaj & Bakım…), çalışan arama kutusu, ~50 yeni ürün. Bilgisayar/TV/konsol artık Mobilya'da değil Elektronik'te.
- Eski hata düzeltildi: renk seçmeli ürünler kargo açılınca kayboluyordu (sipariş defteri eklendi, kayda yazılır).

## v64 — iç mekânlar
- Havalimanı yeniden: 66×46 terminal. Akış ve ayrı alanlar: giriş güvenliği (X-ray, kapı detektörü, polis) → check-in holü (8 kontuar, bekleme şeritleri, bagaj bandı) → valiz teslimi (self bag-drop + dönen bant) → pasaport & polis kontrolü (kabinler; %35 rastgele soruşturma soruları, yanlış cevapta ek kontrol) → bekleme alanı: duty free, yemek alanı (3 tezgâh + masalar), uzun banklar (uzanıp kestirilebilir, uyuyan yolcular), şarj istasyonu, 3 kapı, apronda 3 uçak + körük. 46 yürüyen yolcu (instanced) + personel/oturan figürler.
- Performans: iç mekânlar için derin statik birleştirme (mergeDeep64) ve hafif figürler; havalimanı 959 → ~146 çizim çağrısı.
- Mağazalar (AVM dükkanları): temaya göre duvar üniteleri — giyim askıları + katlı ürün, makyaj raf + ışık, ayakkabı duvarı, elektronik ekran duvarı, kitaplık, mücevher vitrini, hediyelik raflar; boş ahşap dolaplar tema rafına çevrildi; ek kasa/POS/poşet, tablo, sarkıt lambalar, paspas.
- Restoranlar (RESTS — Aspava ayrı sistem, dokunulmadı): arka duvarda şişe & kadeh rafları, şarap rafı, tablolar, aplikler, masalarda tabak/kadeh/peçete/vazo, her masaya sarkıt lamba.
- Süpermarket yeniden: 30×20; reyonlar ve kasalar ayrı bölgede (iç içe sorun çözüldü). Arka duvar buzdolapları (süt ürünleri/içecek), şarküteri-kasap tezgâhı, fırın rafları, manav sandıkları, 6 orta reyon (asma tabelalı), 4 kasa (ekran, poşet direği), sepet parkı, alışveriş yapan kalabalık.
