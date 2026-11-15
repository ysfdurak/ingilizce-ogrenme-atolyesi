# İngilizce tanıtım turu

Bu uygulama Türkçe konuşanlar için yazıldı ve **çevrilmedi**. İngilizce okuyan bir ziyaretçi (ör. ysfdurak.com'un İngilizce sürümünden gelen bir işveren) uygulamayı yine de anlayabilsin diye üstüne ince bir tanıtım katmanı eklendi.

## Ziyaretçi ne görür?

| Adres | Sonuç |
| --- | --- |
| `https://ingilizce-atolyesi.ysfdurak.com/?lang=en` | Tur açılır ve bu tarayıcıda hatırlanır (`localStorage` anahtarı `ia_lang`). |
| `https://ingilizce-atolyesi.ysfdurak.com/?lang=tr` | Tur kapanır. Paneldeki **Turn off** bağlantısı da aynı işi yapar. |

Tur açıkken sağ altta **English guide** paneli bulunulan bölümün ne işe yaradığını anlatır; menü, kart ve başlıkların altında küçük İngilizce karşılıklar görünür. Türkçe metin yerinde kalır. Kullanıcı bir alana yazmaya başlayınca panel küçülür; yazdırırken görünmez. Tur kapalıyken uygulamada hiçbir şey değişmez.

## Dosya

Her şey `en-tour.js` içindedir. Dosya iki parçadır:

1. **`CONFIG` (üst kısım, bu uygulamaya özel):**
   - `intro`: ilk açılışta gösterilen tanıtım paragrafı.
   - `gloss`: Türkçe metin → İngilizce karşılık sözlüğü. Anahtar ekranda görünen metindir (baştaki simge ve sondaki ok atılır).
   - `glossSelector`: karşılık eklenecek öğeleri seçen CSS seçicisi.
   - `guide`: bölüm anahtarı → `{ t: başlık, p: açıklama, try: denenecek adım }`.
   - `route` / `clickRoute`: hangi bölümde olunduğunu bulan fonksiyonlar.
2. **Motor (alt kısım, “Tur motoru” yorumundan sonrası):** İngilizce Atölyesi ve dört Kesit uygulamasında birebir aynıdır. Bir hata düzeltilirse beş depoda da aynı değişiklik yapılır.

## Nasıl çalışır? (kod rehberi)

- **Açma/kapama:** Dosyanın ilk satırları adresteki `?lang=` değerine bakar. Tur açılmamışsa hiçbir şey yapmadan çıkar.
- **Karşılıklar:** `MutationObserver` sayfadaki değişiklikleri izler. `glossSelector` ile seçilen bir öğenin metni `gloss` sözlüğünde varsa altına `<span class="en-gloss">` eklenir; öğe `data-en-gloss` ile işaretlenir ki iki kez eklenmesin.
- **Bölüm tespiti:** Uygulama adres çubuğunu değiştirmeden çalışır. Bu yüzden tur, menüdeki (`data-m`) ve Keşfet kartlarındaki (`data-hb`) son tıklamayı izler ve paneli ona göre günceller.
- **Yeni bir karşılık eklemek:** `gloss` içine `'Türkçe metin': 'English text'` satırı ekle.
- **Yeni bir bölüm açıklamak:** `guide` içine bölüm anahtarıyla `{ t, p, try }` ekle.

## Service worker

`en-tour.js` service worker'ın önbellek listesine eklendi ve önbellek sürümü artırıldı; uygulama internetsiz de turu gösterir.
