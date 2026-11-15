/* Adres taşıma: uygulama ysfdurak.github.io/ingilizce-ogrenme-atolyesi/ adresinden
   ingilizce-atolyesi.ysfdurak.com adresine taşındı. Bu dosya her sayfanın <head> kısmında, uygulamadan önce çalışır.
   1) Eski adreste: ilerleme (tarayıcı kaydı) varsa adresin # kısmına koyup yeni adrese gönderir.
   2) Yeni adreste: # kısmında taşınan kayıt varsa ve burada henüz kayıt yoksa onu yazar, sonra adresi temizler.
   Kayıt çok büyükse otomatik taşımaz; eski adreste "Profil → Yedekle" ile taşımayı anlatan bir not gösterir. */
(function () {
  var YENI = 'https://ingilizce-atolyesi.ysfdurak.com/';
  var ESKI_KOK = '/ingilizce-ogrenme-atolyesi/';
  var ANAHTARLAR = ['kv1', 'kv1_prev', 'kvx', 'dk_fb'];
  var ETIKET = '#tasi=';
  var SINIR = 1500000; // adres uzunluğu sınırı (karakter)
  // Yeni adres son sürümü yayınlayana kadar eski adresten yönlendirme kapalı (true yapınca açılır).
  var YONLENDIR = true;

  function b64Yaz(metin) {
    var bayt = new TextEncoder().encode(metin), s = '';
    for (var i = 0; i < bayt.length; i += 0x8000) s += String.fromCharCode.apply(null, bayt.subarray(i, i + 0x8000));
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64Oku(kod) {
    var s = atob(kod.replace(/-/g, '+').replace(/_/g, '/')), bayt = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) bayt[i] = s.charCodeAt(i);
    return new TextDecoder().decode(bayt);
  }

  try {
    // ── 1) Eski adres ─────────────────────────────────────────────
    if (location.hostname === 'ysfdurak.github.io') {
      if (!YONLENDIR) return;
      var yol = location.pathname.indexOf(ESKI_KOK) === 0 ? location.pathname.slice(ESKI_KOK.length) : '';
      var hedef = YENI + yol + location.search;
      var kayit = {}, var_mi = false;
      ANAHTARLAR.forEach(function (k) {
        var v = localStorage.getItem(k);
        if (v !== null) { kayit[k] = v; var_mi = true; }
      });
      if (!var_mi) { location.replace(hedef + location.hash); return; }
      var paket = b64Yaz(JSON.stringify(kayit));
      if (paket.length <= SINIR) { location.replace(hedef + ETIKET + paket); return; }
      // Kayıt çok büyük: yönlendirme yok, not göster.
      document.addEventListener('DOMContentLoaded', function () {
        var d = document.createElement('div');
        d.setAttribute('role', 'status');
        d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;background:#1f2a44;color:#fff;padding:14px 16px;border-radius:12px;font:15px/1.45 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.25)';
        d.innerHTML = 'Uygulama yeni adresine taşındı: <a style="color:#ffd27a" href="' + hedef + '">ingilizce-atolyesi.ysfdurak.com</a>. ' +
          'İlerlemeni taşımak için önce burada <b>Profil → Yedekle</b> ile dosyaya kaydet, sonra yeni adreste aynı yerden yükle.';
        document.body.appendChild(d);
      });
      return;
    }

    // ── 2) Yeni adres ─────────────────────────────────────────────
    if (location.hash.indexOf(ETIKET) === 0) {
      var gelen = JSON.parse(b64Oku(location.hash.slice(ETIKET.length)));
      if (localStorage.getItem('kv1') === null) {
        ANAHTARLAR.forEach(function (k) { if (typeof gelen[k] === 'string') localStorage.setItem(k, gelen[k]); });
      }
      history.replaceState(null, '', location.pathname + location.search);
    }
  } catch (e) { /* taşıma başarısız olursa uygulama normal açılır */ }
})();
