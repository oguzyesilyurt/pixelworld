# PixelWorld 7.0 — Dünya denetimi

Araç: kuşbakışı render + boş hücre ölçümü (audit55.js), oyunda en uzak zoom ekran görüntüleri (zoom55.js).

## Bulgular (v54)
- Çekirdek (x −24..74, z −62..54) büyük ölçüde dolu; asıl boşluk çekirdek dışındaki çıplak zemin (min zoom'da görünen).
- Çekirdekteki kalan boşlukların çoğu bilinçli `noInfill` bölgeleri: müze/fuar/stadyum gibi yapıların önü (kamera görüşü için açık).

## Yapılanlar (v55)
- Dış halka: 15×15 parseller, sokak asfaltı, kaldırım; yollar, deniz, mevcut yapılar ve etkileşim noktalarına mesafe kontrolü; kameraya bakan güney/batı bandında en çok 3 kat (çekirdeği kapatmasın). Kenar tepeleri/ağaçları parsel üstüne düşerse kaldırılıyor.
- Çekirdek: 9×9 küçük parseller yalnızca `area38` + `occl38` (giriş görüşü) + etkileşim noktasına 8 birim mesafe sağlanırsa.
- `noInfill` bölgeleri: yürüme hattını (giriş noktasının önü) boş bırakan alçak çim+çiçek.
- Aksaz ve Bozdağ hariç tutuldu.

## Bilinen
- Dış halka binaları girilebilir değil (dekor + çarpışma kutusu).
- Havalimanı çevresindeki çim alan bilerek açık bırakıldı (pist çevresi).
