# Mülakatta sorulabilecek sorular · İngilizce Öğrenme Atölyesi

Bu kart, projeyi kendi ağzınla anlatabilmen için. Cevaplar kısa tutuldu; ayrıntısı belirtilen belgede. Kod yapay zekâ (Claude) ile yazıldı; kapsam, öncelik ve aşağıdaki kararlar senin. Bunu saklama, açıkça söyle: "Ürünü ve kararları ben belirledim, kodu yapay zekâyla yazdım, her kararın nedenini anlatabilirim."

**1. Bu proje ne yapıyor?**
A1–C2 İngilizce öğrenme ve YDS, e-YDS, YÖKDİL hazırlığı. Hesap açmadan tarayıcıda çalışıyor.

**2. İçerik ne kadar?**
75 tema ünitesi, 193 dilbilgisi konusu, 15.000'den fazla kelime ve kalıp, 155 hikâye, 175 diyalog, özgün sınav denemeleri.

**3. Öğrenme yöntemi?**
Aralıklı tekrar ve bağlam: kelime tek başına değil cümle içinde öğretiliyor. Dinlemede kaçırılan kelime yavaş okunuyor ve sonra farklı bir cümlede yeniden soruluyor.

**4. Farklı cümleyi nasıl seçiyorsun?**
Aynı yazımı içeren ve seviyesi en fazla bir üst olan cümle; uygun yoksa kendi örnek cümlesi. İlk denemede anlamı farklı ve zor bir cümle seçiliyordu, filtreyle düzelttim.

**5. İlerleme nerede?**
Yalnız tarayıcıda; dosyaya yedeklenip başka cihazda yüklenebiliyor. Kişisel veri toplanmıyor.

**6. Çevrimdışı?**
Bir kez açıldıktan sonra internet yokken çalışıyor. Önbellek adı unutulursa kullanıcılar eski sürümde kalır; CI bunu artık yakalıyor.

**7. Teknik yapı?**
Sade JavaScript, statik site, Cloudflare üzerinden yayın.

**8. Neyi ölçüyorsun?**
Kullanıcının ilerlemesi cihazda kalıyor; ürün olarak hangi bölümün işe yaradığını henüz ölçmüyorum.

**9. Sınav içeriği telifli mi?**
Hayır, denemeler özgün.

**10. Neyi farklı yapardın?**
Testleri ve CI'ı baştan kurardım; bu depoda yakın zamana kadar CI yoktu.


## Bu projede verdiğim kararlar (sorun → karar → bedel)

- **Seviye filtresi:** Zor ve anlamı farklı cümle çıkıyordu → aynı yazım ve en fazla bir üst seviye → bazı kelimede örnek cümleye dönülüyor.
- **İlerleme cihazda:** Hesap yok, gizlilik yüksek → cihaz değişince yedek dosyası gerekiyor.

---
Son güncelleme: 19 Kasım 2026.
