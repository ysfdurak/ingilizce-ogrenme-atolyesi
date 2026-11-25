/* İngilizce Öğrenme Atölyesi ölçümü ve geri bildirim düğmesi: ortak servis (olcum.ysfdurak.com; kaynak: ysfdurak.com → sunucu/olcum).
   Yalnız resmî adreste (ingilizce-atolyesi.ysfdurak.com) yüklenir; kopyalar dışarıya istek atmaz.
   Gönderilen: açılan bölümün adı (ör. "kelimeler", "ydstest"), o bölümde etkin geçen süre, cihaz türü, dil.
   Ad, cevap, kelime, yazdıkların, ilerleme gönderilmez. Çerez yok; tarayıcıda DNT/GPC açıksa hiçbir şey gönderilmez.
   Kapatmak için adrese ?olcum=kapat ekle ya da Hakkında sayfasındaki düğmeyi kullan. */
(function(){
  var ACIK=location.hostname==='ingilizce-atolyesi.ysfdurak.com';
  function it(t,a){if(!ACIK)return;if(window.olcum&&window.olcum[t])window.olcum[t](a);else(window.olcumKuyruk=window.olcumKuyruk||[]).push([t,a])}
  // Uygulama her bölüm değişiminde çağırır. Yalnız bölüm adı gider; ayrıntı (ünite kimliği vb.) gönderilmez.
  window.dkScreen=function(m){if(m&&/^[a-z0-9_-]{1,40}$/.test(m))it('ekran',m)};
  window.dkOlcumSifirla=function(){if(window.olcum&&window.olcum.kapat)window.olcum.kapat();else location.search='?olcum=kapat'};
  if(!ACIK)return;
  var s=document.createElement('script');s.src='https://olcum.ysfdurak.com/olcum.js';s.defer=true;
  s.dataset.proje='ingilizce';s.dataset.renk='#2f6bff';document.head.appendChild(s);
  try{if(typeof cur==='string')window.dkScreen(cur)}catch(e){}
})();
