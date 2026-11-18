# PixelWorld 8 — Real Life Expansion · ilerleme

Durum işaretleri: ✅ tamam · 🟡 kısmi · ⏳ yapılmadı

## v65
- ✅ **Banka 2.0** (`life67.js`): vadesiz hesap, gerçek hesap hareketleri (bakiye değişimleri izlenir; maaş, kredi, kart, transfer etiketli), birikim hesabı (günlük %0,2 faiz), kredi kartı (limit, kullanılabilir limit, 10 günde bir ekstre, asgari ödeme, son ödeme tarihi, gecikme faizi, borcu 3/6 taksite bölme), EFT ile karakterlere para gönderme (bağ artar), otomatik ödemeler listesi.
- ✅ **Krediler**: ihtiyaç / taşıt / tekne (+ mevcut konut kredisi korunarak). Tutar–vade seçimi, faiz, eşit taksit (anüite) ve ödeme planı tablosu; taksit maaşın %60'ını aşarsa red. Ödemeler her 7 oyun gününde; bakiye yetmezse karta yansır ve kredi notu düşer. Galeride "🏦 Krediyle al": araç hemen senin, borç sürer.
- ✅ **Yaşam istatistikleri** (`life68.js`, telefonda 📊 Yaşam): oynama süresi, çalışılan gün, kazanılan/harcanan para, gidilen semtler, mekânlar, araçlar, uçuşlar, mini oyunlar, işletme, arkadaş, eğitim, kitap, tamir, yemek, ulaşım, taşınma, tekne. Hepsi gerçek olaylardan sayılır (sayım v65'ten itibaren başlar).
- ✅ **Oyuncudan bağımsız şehir**: 16 şehir sakini iş değiştirir, arkadaş olur, taşınır, araba alır, okula başlar/mezun olur, işletme açar; işletmeler kapanır, yeni komşular gelir. Her yeni günde olasılıkla olay; çevrimdışı süreye göre en çok 6 olay ("Sen yokken şehirde" bildirimi). PixelGram'da "İzmir Gündem" gönderileri. 🟡 Yeni açılan işletmeler henüz haritada bina olarak görünmüyor (gündem/uygulama listesi).

## v66
- ✅ **Doğal hayvan yaşamı** (`life69.js`): her semtte 8 sokak kedisi (4 desen), 4 sokak köpeği (kulak küpeli), 2 kuş sürüsü (ağaçlara konar, oyuncu yaklaşınca kalkar), martılar (sahilde süzülür, korkuluğa konar), kelebekler (gündüz, sıcak ve kuru havada). Kediler dükkân önlerinde uyur, oyuncuya yaklaşır; köpekler yürür, dinlenir, bazen koşar. Kamera uzağındakiler gizlenir/güncellenmez. Pürüzsüz (SDF) modeller.
- ✅ **Yemek becerisi** (`life70.js`): 7 kategoride 22 tarif (kahvaltılık, çorba, makarna, et, sebze, tatlı, özel), beceriyle açılır. Gerçek adımlar: buzdolabından malzeme (elde kutu) → tezgâhta doğrama (kesme tahtası, sebzeler, bıçak) → ocak/tencere/fırın (tava efekti, fırın ışığı) → tabağı elde taşıyıp masaya koyma. Yüksek beceri: daha kaliteli (⭐), daha hızlı, daha az yanma. Ocak menüsünde "Tarif defteri" + eski hızlı menü korundu.
- ✅ **Tamir becerisi**: arızalanabilenlere lamba, komodin, mikrodalga, kettle, kahve makinesi, klozet, konsol ve mobilyalar eklendi (+ Marangoz servisi). Pazarcık'tan Tamir Seti → "Kendim tamir et": eşyaya yürür, elde anahtar ile çalışır, zamanlama mini oyunu (5 denemede 3 isabet; zorluk eşyaya göre 1–4, beceri arttıkça yeşil alan büyür). Mevcut servis çağırma korunuyor.
- ✅ **Kitapçı & kütüphane**: Sayfa Kitabevi (Bostanlı, Çiğli, Kocaeli, Karabağlar) ve Kent Kütüphanesi (Alsancak, Karşıyaka, Kocaeli). 7 tür, 21 kitap; kitapçıda satın al, kütüphanede 7 gün ücretsiz ödünç (süre dolunca otomatik iade). Çantadan "📖 Oku": karakter kitabı elinde tutar; 3 bölümde biter. Etkiler: Yemek → tarif öğrenir + mutfak; Teknoloji → tamir; Bilim/Tarih/Eğitim → üniversite bilgisi (sınav); Roman → keyif/sanat. Kütüphane: sessiz çalışma (bilgi +2), araştırma bilgisayarı, çalışan öğrenciler.
- 🟡 Kitap okurken/yemekte el nesneleri karakterin önünde konumlanıyor (kol kemiğine bağlı değil); karakterin kolları "telefon" pozunda.

## v67 — sağlık
- ✅ **Hasta akışı** (`life71.js`): telefonda 🩺 Sağlığım (durum, randevu al, rapor, reçete, muayene geçmişi) → hastanede "Hasta kaydı" (randevulu: kısa sıra; randevusuz: acil 60🪙) → bekleme koltuğunda otur, ekranda sıra numarası ilerler → "Muayene odasına gir" (bölmeli oda, perde, muayene masası; doktor konuşur) → teşhis.
- ✅ **Teşhise göre tedavi**: soğuk algınlığı (ilaç + 1 gün rapor), grip (ilaç + 2 gün rapor), halsizlik (gözlem yatağında serum + vitamin), baş ağrısı (ağrı kesici). Serum yalnızca halsizlikte. Mevcut ILL / medTake / eczane / "Muayene ol" mekanikleri korunuyor.
- ✅ **Reçete & eczane**: her eczanede "Reçeteyi göster" (25🪙 katkı payı), ilaç çantaya + ilk doz.
- ✅ **Rapor / devamsızlık**: raporluyken işyerine girince "çalışman gerekmiyor" uyarısı; ağır hastalıkta raporsuz günler sonraki maaştan %5/gün kesilir.
- ✅ **Yeni hastane**: Karşıyaka Devlet Hastanesi (Karşıyaka ve Bostanlı) — kabul, bekleme salonu, hastane eczanesi, muayene odası, gözlem yatağı, yürüyen hastalar. Kocaeli Şehir Hastanesi'ne de muayene odası + sıra ekranı + gözlem yatağı eklendi.
- ✅ **Almira'nın nöbeti**: görev türüne göre elde ekipman (tansiyon aleti, ilaç kabı, sargı, serum torbası), hasta teşekkür tepkileri, serum görevinden sonra yatağın yanında serum askısı kalır. Meslek/kimlik değişmedi.
- 🔧 Dış halkaya ikinci mekân sırası (x=114) eklendi; kalabalık Karşıyaka'da kütüphane ve hastane artık yerleşiyor.

## v68 — ulaşım & navigasyon
- ✅ **Otobüs** (`life72.js`): durakta durak panelinden hedef seç → durakta beklersin (hat no + tahmini süre), ESHOT/Havaş otobüsü yoldan gelip durur, İzmirim Kart ile binersin (ücret hareketlere yazılır) → otobüs içi: koltukta oturursun, diğer yolcular/şoför, kayan manzara ve yol, "Sıradaki durak" anonsu → hedefte durağın önünde inersin.
- ✅ **Tramvay/İZBAN/metro**: aynı kabin içi yolculuk (bekleme sahnesi yok).
- ✅ **Taksi**: telefonda 🚕 Taksi → sarı taksi yoldan gelip yanında durur → "Taksiye bin" → hedef ve taksimetre ücreti (mesafeye göre) → taksi içinde yolculuk (şoför, taksimetre) → varış. 90 sn beklemezsen gider.
- ✅ **Navigasyon** (🧭): şehir içi yakındaki mekânlar → zeminde mavi rota + hedef iğnesi (engellerden kaçan A* yol bulma), mesafe ve yürüme süresi, alternatif güzergâh; hedefe varınca "Vardın". Şehirler arası: her hedef için 🚗 (süre) / 🚌 (süre + ücret) / 🚕 (süre + ücret) seçenekleri.
- ✅ Aksaz Askerî Lojmanı gibi kısıtlı alanlar navigasyon/taksi listelerinde yok; erişim kuralları değişmedi. Marmaris/Aksaz/Kocaeli bağlantıları (mevcut yollar) korunuyor.
- 🟡 Otobüsler belirli sefer saatine göre değil, durağa gelişte rastgele 6–10 dk bekleme ile geliyor.

## v69 — tekne sahipliği & marina
- ✅ **Sarı Site** (`life73.js`, telefonda 🟨): 8 tekne ilanı (şişme bot, sürat, yelkenli, mini gulet), türe göre filtre, fiyat/yıl sıralama, ortalamaya göre fiyat karşılaştırması. Nakit veya 🏦 tekne kredisiyle satın alma (kredi bankada, tekne hemen senin).
- ✅ **Marmaris Marina**: marina ofisi (bağlama yeri kirala → haftalık 350🪙 otomatik ödeme; temizlik; periyodik bakım; tekneyi sat), yakıt istasyonu, özel iskele + kendi teknen iskelede durur. Mevcut tekne turu korunuyor.
- ✅ **Kendi tekneni kullan**: arkadaş davet (en çok 3, teknede oturur, konuşur) → açık deniz: motoru çalıştır, yön tuşlarıyla tekneyi sür (yakıt tükenir, tükenince römorkör), 4 koy (Cennet Adası, Kumlubük, Turunç, Gizli Mağara) yakınında demir at → denize atla/yüz → tekneye çık; fotoğraf (anı + arkadaşlarla bağ), marinaya dönüş (bağ +8, istatistik). Bakım çok gecikirse motor çalışmaz.
- 🟡 Tekne modelleri basit (gövde + kabin/yelken); dalga fiziği yok, yalnızca sallanma.

## v70 — taşınma günü & apartman yaşamı
- ✅ **Taşınma planı** (`life74.js`): ev kiralayınca/alınca → taşınma günü (bugün / +1 / +2) + nakliye firması (Ege Nakliyat 120, Körfez Taşımacılık 260, Lüks Evden Eve 480). Plan günü bildirim gelir ("Başlayalım" / "Bir gün ertele").
- ✅ **Kolileme**: evde "📦 Koli hazırla" — karakter eşyanın yanına yürür, elinde koli ile sarıp kapatır; koliler kapı yanında üst üste dizilir (eşya sayısına göre gereken koli).
- ✅ **Nakliye**: mevcut kamyon + taşıyıcı sekansı korunarak kamyonun arkasında koli yığını, taşıyıcıların elinde koli.
- ✅ **Yeni evde koli açma**: koliler girişte durur, "📦 Koli aç" (kapak açılır, eşyalar çıkar), son koliden sonra dekorasyon modu (📦 Depo) açılır. Mobilyalar depoya aktarılır (eski mekanizma) — eşya kaybı yok. Sahiplik/kira doğrulaması korunuyor (kira/sahiplik yoksa eski eve dönülür).
- ✅ **Apartman girişi (lobi)**: apartman evlerine girerken önce bina girişi — posta kutuları (posta: aidat bildirimi, faturalar, broşür, kartpostal), duyuru panosu, yönetici Nihat Bey (aidat öde, toplantıya katıl, arıza bildir), asansör (kapılar açılır; arızalıysa merdiven) ve merdiven → kat koridoru → daire.
- ✅ **Aidat**: 10 günde bir aidat bildirimi postaya düşer, 7 gün içinde yöneticiye ödenir; gecikince uyarı.
- ✅ **Apartman toplantıları**: ara sıra duyurulur (aidat artışı, ortak alan temizliği, bina bakımı, asansör arızası); evet/hayır oyunun sonuçları var (aidat değişir, merdiven nöbeti, komşu itibarı, asansör arızalanma olasılığı).
- ✅ **Komşuluk**: asansörde komşuyla sohbet, sabah evden çıkınca işe giden komşuyla karşılaşma (günaydın / yardım / çaya davet), rastgele komşu yardım isteği ve misafirlik daveti (bağ etkisi).
- 🟡 Kat koridoru ayrı bir sahne değil (geçiş anında anlatılıyor). Komşular lobide 3D figür olarak beklemiyor; karşılaşmalar menü/konuşma ile.

## Özet durum (v70)
| # | Bölüm | Durum |
|---|---|---|
| 1 | Apartman & komşuluk | ✅ (koridor ayrı sahne değil 🟡) |
| 2 | Banka & kredi | ✅ |
| 3 | Taşınma günü | ✅ |
| 4 | Tekne & marina | ✅ (basit fizik 🟡) |
| 5 | Sağlık | ✅ |
| 6 | Yemek becerisi | ✅ |
| 7 | Tamir becerisi | ✅ |
| 8 | Kitapçı & kütüphane | ✅ |
| 9 | Doğal hayvan yaşamı | ✅ |
| 10 | Navigasyon & toplu taşıma | ✅ (sefer saati tablosu yok 🟡) |
| 11 | Yaşam istatistikleri | ✅ (sayım v65'ten itibaren) |
| 12 | Bağımsız gelişen dünya | ✅ (yeni işletmeler haritada bina değil 🟡) |
| 13 | Entegrasyon | ✅ banka↔galeri/Sarı Site/marina/aidat/ulaşım, istatistik↔tüm olaylar |
| 15 | Kayıt | ✅ x67–x74, geri uyumlu |
| 16 | Optimizasyon | 🟡 masaüstü/mobil emülasyon testleri; gerçek iPhone'da denenmedi |

## Değiştirilen dosyalar
`index.html` (build), `sw.js`, `package.json`, `docs/PIXELWORLD_8_*.md`. Kaynak modüller (scratchpad, build74.sh ile birleştirilir): life67 (banka), life68 (istatistik/dünya), life69 (hayvanlar), life70 (yemek/tamir/kitap), life71 (sağlık), life72 (ulaşım), life73 (tekne), life74 (taşınma/apartman); life60 (dış halka 2. sıra).

## Bilinen hatalar / eksikler
- El nesneleri (kitap, bıçak, koli) karakterin önüne konumlanıyor, kol kemiğine bağlı değil.
- Test ortamında oyun zamanı yavaş aktığı için otobüs bekleme süresi test çarpanıyla (BUSK72) kısaltılarak doğrulandı.
- Lobideki posta kutuları/merdiven basit kutu geometrisi.
- Gerçek iPhone donanımında test yapılmadı (emülasyon: tmob ~275 çizim çağrısı).

## v71 — telefon uygulamaları düzeltmesi
- 🐛 Sarı Site, Banka, Yaşam, Sağlığım, Navigasyon filtrelerinde/düğmelerinde yazı ile zemin aynı (beyaz) renkteydi: telefonun genel `#phone button` beyaz yazı stili uygulama stilini eziyordu. Düğmeler artık yeşil zemin/beyaz yazı veya açık zemin/yeşil yazı.
- 🐛 Telefon ekranı aşağı kaydırılırken sağa sola da kayıyordu: telefon gövdesi yatay kaydırmaya kapatıldı, yalnızca dikey kaydırma; sekme satırları alt satıra sarılıyor; uzun satırlar kırılıyor. Pazarcık kategori şeridi kendi içinde yana kayan şerit olarak kaldı.
- Test (t76, iPhone yatay emülasyon): 23 telefon uygulamasının hepsi açıldı; yatay taşma 0, okunmayan düğme 0.
