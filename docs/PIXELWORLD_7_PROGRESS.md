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
