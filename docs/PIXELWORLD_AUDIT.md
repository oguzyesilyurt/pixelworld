# PixelWorld · Harita denetimi (v107)

Araç: `auditOverlaps(mahalle)` · Ayarlar → 🧪 Test → **🗺️ Harita denetimi (test)** (tüm mahalleleri kurar, sonucu konsola mahalle + koordinatla yazar). Her mahalle kurulduktan sonra (`endD`) ve ilk girişten ~1.6 sn sonra `fixOverlaps107` otomatik çalışır.

## Denetlenenler
- **Bina örtüşmesi:** `C.boxes` içinde küçük kutunun %30'undan fazlası örtüşen bina çiftleri
- **Yola taşma:** `roadSamples` (yol şeridi + kaldırım) üstüne giren bina/kutu
- **Tabela:** bina gövdesine gömülü tabela düzlemi ya da başka tabelayla çakışma
- **Z-fighting:** aynı yükseklikteki (Δy < 0.005) yatay zemin düzlemlerinin üst üste binmesi
- **Çift kutu:** aynı çarpışma kutusunun iki kez eklenmesi

## Düzeltme kuralları
- Örtüşen binalarda girişi (E: noktası) olmayan **küçük dolgu** kaldırılır; yalnız o kutuya oturan nesne silinir (komşu dükkân korunur). İkisinin de girişi varsa dokunulmaz.
- Yola ≥1.2 birim taşan girişsiz yapı kaldırılır; kaldırım kenarındaki hafif taşma bırakılır.
- Gömülü tabela en yakın cepheden normal yönünde **+0.025** öne alınır; çakışan ikinci tabela **+0.03** öne.
- Z-fighting: çakışan düzlem **+0.003** yukarı; çakışma kalmayana kadar tekrarlanır (küme içinde her düzlem ayrı katman).
- 300 m² üstü kutular (meydan, site, stad alanı) bina sayılmaz.

## Elle düzeltilenler
- **Karşıyaka · stadyum (stadiumExt "yk"):** stad 46,-50'ye çekildi; yanındaki çift asfalt şeridi (ground 52,-27.5) kaldırıldı; ana yola orta şerit + kavşakta `ROADSKIP` ile şerit kesimi; stad girişine yaya geçidi; reklam balonu (tubeMan) yoldan çekildi.

## Sonuç (düzeltme sonrası kalan)

| Mahalle | Bina | Yol | Tabela gömülü | Tabela çakışma | Z-fighting | Çift kutu | Düzeltilen |
|---|---|---|---|---|---|---|---|
| merkez | 0 | 0 | 0 | 0 | 0 | 0 | 613 |
| karsiyaka | 0 | 0 | 0 | 0 | 0 | 4 | 53 |
| alsancak | 0 | 0 | 0 | 0 | 0 | 4 | 80 |
| bostanli | 0 | 0 | 0 | 0 | 0 | 3 | 65 |
| cigli | 0 | 0 | 0 | 0 | 0 | 0 | 341 |
| karabaglar | 0 | 0 | 1 | 0 | 0 | 4 | 54 |
| kocaeli | 0 | 0 | 0 | 0 | 0 | 4 | 41 |
| mall_forum | 0 | 0 | 0 | 0 | 0 | 0 | 30 |
| mall_mavibahce | 0 | 0 | 0 | 0 | 0 | 0 | 30 |
| mall_hilltown | 0 | 0 | 0 | 0 | 0 | 0 | 36 |
| aksaz | 0 | 0 | 0 | 0 | 0 | 0 | 20 |
| marmaris | 0 | 0 | 0 | 0 | 0 | 7 | 163 |
| bozdag | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

> Karabağlar'daki 1 gömülü tabela ilk girişteki ikinci geçişte düzeliyor (sonraki denetimde 0). Kalan "çift kutu"lar kurulumdan sonra eklenen (NPC/etkileşim) çarpışma kutuları; görsel etkisi yok.

## Mahalle bazında yapılan düzeltmeler

| Mahalle | Çift kutu silindi | Tabela öne alındı (gömülü / çakışma) | Z-fighting katmanlandı | Kaldırılan bina |
|---|---|---|---|---|
| merkez | 0 | 2 / 0 | 622 | 0 |
| karsiyaka | 30 | 0 / 2 | 21 | 0 |
| alsancak | 27 | 0 / 0 | 51 | 4 |
| bostanli | 25 | 0 / 0 | 40 | 0 |
| cigli | 17 | 0 / 0 | 324 | 0 |
| karabaglar | 19 | 2 / 1 | 32 | 0 |
| kocaeli | 22 | 0 / 0 | 21 | 0 |
| mall_forum | 0 | 0 / 0 | 30 | 0 |
| mall_mavibahce | 0 | 0 / 0 | 30 | 0 |
| mall_hilltown | 0 | 0 / 0 | 38 | 0 |
| aksaz | 0 | 1 / 0 | 19 | 0 |
| marmaris | 38 | 2 / 0 | 123 | 0 |
| bozdag | 0 | 0 / 0 | 0 | 0 |

### Kaldırılan binalar
- **alsancak** · 70, -42 (4.8×4.4) — kalan 73, -42 ile %77 örtüşüyordu
- **alsancak** · 73, -42 (8.6×10.6) — kalan 70, -36 ile %32 örtüşüyordu
- **alsancak** · 70, -24 (4.8×4.4) — kalan 72, -24 ile %98 örtüşüyordu
- **alsancak** · 72, -24 (8.6×12.6) — kalan 70, -18 ile %55 örtüşüyordu
