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
