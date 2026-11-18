/* Adres taşıma: uygulama ysfdurak.github.io/ingilizce-ogrenme-atolyesi/ adresinden
   ingilizce-atolyesi.ysfdurak.com adresine taşındı. Bu dosya her sayfanın <head> kısmında, uygulamadan önce çalışır.
   1) Eski adreste: ilerleme (tarayıcı kaydı) varsa adresin # kısmına koyup yeni adrese gönderir.
   2) Yeni adreste: # kısmında taşınan kayıt varsa ve burada henüz kayıt yoksa (ya da yalnızca ilk açılışta
      oluşan boş kayıt varsa) onu yazar, sonra adresi temizler.
      Burada zaten farklı bir kayıt varsa hiçbirini silmez: gelen kaydı bekletir ve kullanıcıya iki kayıt
      bulunduğunu söyler; eski kaydı yedek dosyası olarak indirebilir ya da bu cihazda kullanabilir.
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

  var BEKLEYEN = 'kv_tasinan'; // yeni adreste, mevcut kayıtla çakışan eski kayıt
  var KUTU = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;background:#1f2a44;color:#fff;padding:14px 16px;border-radius:12px;font:15px/1.45 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.25)';
  var DUGME = 'margin:10px 8px 0 0;padding:8px 12px;border:0;border-radius:8px;font:inherit;cursor:pointer';

  function el(etiket, metin, stil) {
    var d = document.createElement(etiket);
    if (metin) d.textContent = metin;
    if (stil) d.style.cssText = stil;
    return d;
  }
  function govdeHazir(fn) {
    if (document.body) fn(); else document.addEventListener('DOMContentLoaded', fn);
  }

  // Uygulamanın "Profil → Yedek dosyasından yükle" ile açabildiği biçimde yedek dosyası üretir.
  function yedekPaketi(kayit) {
    var ls = {}, xp = 0, lw = 0;
    if (typeof kayit.kv1 === 'string') ls.kv1 = kayit.kv1;
    if (typeof kayit.kvx === 'string') ls.kvx = kayit.kvx;
    try {
      var d = JSON.parse(kayit.kv1);
      xp = d.xp || 0;
      Object.keys(d.sr || {}).forEach(function (k) { if ((d.sr[k] || {}).b >= 4) lw++; });
    } catch (e) {}
    return { app: 'kelime-atolyesi', v: 1, at: new Date().toISOString(), dev: 'tasima', sum: { xp: xp, lw: lw }, ls: ls };
  }
  function indir(kayit) {
    var p = yedekPaketi(kayit);
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(p)], { type: 'application/json' }));
    a.download = 'ingilizce-ogrenme-atolyesi-eski-adres-yedek-' + p.at.slice(0, 10) + '.json';
    document.body.appendChild(a); a.click(); a.remove();
  }
  // Uygulama ilk açılışta 0 XP'lik boş bir kayıt oluşturur; bu, "burada kayıt var" sayılmamalı.
  function bosKayit(kv1, kvx) {
    try {
      var d = JSON.parse(kv1);
      return !(d.xp > 0) && !Object.keys(d.sr || {}).length && !(d.my && d.my.length) && !d.started &&
        (kvx === null || kvx === '[]');
    } catch (e) { return false; }
  }
  function bekleyeniSil() { try { localStorage.removeItem(BEKLEYEN); } catch (e) {} }

  // İki kayıt bulunduğunda gösterilen not. Hiçbir kayıt kullanıcı seçmeden silinmez.
  function cakismaNotu(gelen) {
    govdeHazir(function () {
      if (document.getElementById('tasimaNotu')) return;
      var xp = '?';
      try { xp = String(JSON.parse(gelen.kv1).xp || 0); } catch (e) {}
      var kutu = el('div', '', KUTU);
      kutu.id = 'tasimaNotu';
      kutu.setAttribute('role', 'alertdialog');
      kutu.appendChild(el('b', 'Eski adresten ikinci bir ilerleme kaydı geldi'));
      kutu.appendChild(el('p', 'Bu cihazda yeni adreste zaten bir kaydın var, o yüzden eski adresteki kayıt (' + xp +
        ' XP) otomatik yazılmadı. İkisi de duruyor; ne yapacağını sen seç.', 'margin:6px 0 0'));
      var bilgi = el('p', '', 'margin:8px 0 0;color:#ffd27a');
      var indirB = el('button', '⬇️ Eski kaydı yedek dosyası olarak indir', DUGME + ';background:#ffd27a;color:#1f2a44');
      var kullanB = el('button', 'Eski kaydı bu cihazda kullan', DUGME);
      var sonraB = el('button', 'Daha sonra', DUGME + ';background:transparent;color:#fff;text-decoration:underline');
      indirB.onclick = function () {
        try {
          indir(gelen);
          bekleyeniSil();
          bilgi.textContent = 'İndirildi. İstediğin zaman Profil → Yedekleme → Yedek dosyasından yükle ile açabilirsin.';
          sonraB.textContent = 'Kapat';
        } catch (e) { bilgi.textContent = 'Bu görünümde dosya indirilemiyor. Başka bir tarayıcıda dene.'; }
      };
      kullanB.onclick = function () {
        if (!confirm('Eski adresteki kayıt bu cihazdakinin yerini alacak. Şu anki kaydın bir kez geri alınabilir şekilde saklanır (Profil → Yedekleme → Son geri yüklemeyi geri al). Devam edilsin mi?')) return;
        try {
          var cur = localStorage.getItem('kv1');
          if (cur) localStorage.setItem('kv1_prev', cur);
          ['kv1', 'kvx'].forEach(function (k) {
            if (typeof gelen[k] === 'string') localStorage.setItem(k, gelen[k]); else localStorage.removeItem(k);
          });
          bekleyeniSil();
          try { sessionStorage.setItem('kvrest', '1'); } catch (e) {}
          location.reload();
        } catch (e) { bilgi.textContent = 'Kayıt yazılamadı (tarayıcı depolaması dolu olabilir). Önce yedek dosyasını indir.'; }
      };
      sonraB.onclick = function () { kutu.remove(); };
      kutu.appendChild(indirB); kutu.appendChild(kullanB); kutu.appendChild(sonraB); kutu.appendChild(bilgi);
      document.body.appendChild(kutu);
    });
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
      govdeHazir(function () {
        var d = el('div', '', KUTU);
        d.setAttribute('role', 'status');
        var a = el('a', 'ingilizce-atolyesi.ysfdurak.com', 'color:#ffd27a');
        a.href = hedef;
        d.appendChild(document.createTextNode('Uygulama yeni adresine taşındı: '));
        d.appendChild(a);
        d.appendChild(document.createTextNode('. İlerlemeni taşımak için önce burada '));
        d.appendChild(el('b', 'Profil → Yedekle'));
        d.appendChild(document.createTextNode(' ile dosyaya kaydet, sonra yeni adreste aynı yerden yükle.'));
        document.body.appendChild(d);
      });
      return;
    }

    // ── 2) Yeni adres ─────────────────────────────────────────────
    var bekleyen = null;
    if (location.hash.indexOf(ETIKET) === 0) {
      var gelen = JSON.parse(b64Oku(location.hash.slice(ETIKET.length)));
      var mevcut = localStorage.getItem('kv1');
      if (mevcut === null || bosKayit(mevcut, localStorage.getItem('kvx'))) {
        if (mevcut !== null) localStorage.setItem('kv1_prev', mevcut);
        ANAHTARLAR.forEach(function (k) {
          if (k === 'kv1_prev' && mevcut !== null) return; // boş kaydın yedeği zaten yazıldı
          if (typeof gelen[k] === 'string') localStorage.setItem(k, gelen[k]);
        });
      } else if (typeof gelen.kv1 === 'string' &&
                 (gelen.kv1 !== mevcut || (gelen.kvx || null) !== localStorage.getItem('kvx'))) {
        // İki farklı kayıt: hiçbirini silme. Gelen kaydı beklet (sayfa kapanırsa da kaybolmasın).
        bekleyen = gelen;
        try { localStorage.setItem(BEKLEYEN, JSON.stringify({ kv1: gelen.kv1, kvx: gelen.kvx })); } catch (e) {}
      }
      history.replaceState(null, '', location.pathname + location.search);
    }
    if (!bekleyen) {
      try { bekleyen = JSON.parse(localStorage.getItem(BEKLEYEN)); } catch (e) { bekleyen = null; }
    }
    if (bekleyen && typeof bekleyen.kv1 === 'string') cakismaNotu(bekleyen);
  } catch (e) { /* taşıma başarısız olursa uygulama normal açılır */ }
})();
