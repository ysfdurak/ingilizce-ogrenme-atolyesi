/* İngilizce tanıtım turu (?lang=en ile açılır, ?lang=tr ile kapanır).
 * Uygulama Türkçe konuşanlara İngilizce öğretmek için yazıldı ve Türkçe kalır. Tur, İngilizce okuyan bir ziyaretçiye
 * (ör. işveren) her bölümün ne işe yaradığını anlatan bir panel ve menü/başlıkların altında küçük İngilizce karşılıklar ekler.
 * İçerik CONFIG'tedir; altındaki motor bütün Kesit uygulamalarında ve İngilizce Atölyesi'nde aynıdır.
 * Ayrıntı: docs/INGILIZCE-TUR.md */
(function (root) {
  'use strict';
  const HUB = {
    kelimeler: ['Words', 'Vocabulary lessons by level, phrasal verbs and irregular verbs. New words enter spaced repetition automatically.'],
    kaliplar: ['Collocations', 'Word partnerships such as “make a decision” or “heavy rain”, taught as sets because Turkish speakers often translate them word by word.'],
    aileler: ['Word families', 'decide → decision → decisive: one root, several word forms, practised together.'],
    idioms: ['Idioms', '835 idioms and proverbs, each with a short story so the meaning sticks.'],
    grammar: ['Grammar', '193 grammar topics from A1 to C2, explained in Turkish with exercises and level tests. The explanations compare English with Turkish structures.'],
    hatalar: ['Common mistakes', 'The errors Turkish speakers make most often (for example “I am agree”), with the reason and the fix.'],
    konusma: ['Speaking', 'Functional language and speaking tasks: asking for help, disagreeing politely, giving opinions.'],
    strateji: ['Strategies', 'Reading and listening strategies: skimming, scanning, predicting.'],
    stories: ['Reading', '155 graded stories and reading passages with comprehension questions.'],
    dinle: ['Listening', 'Listen and answer, plus dictation, using the browser’s speech engine.'],
    diyaloglar: ['Dialogues', '175 real-life dialogues with role play: at the doctor, in a shop, at work.'],
    yazma: ['Writing', 'Guided writing practice: e-mails, essays and reports.'],
    telaffuz: ['Pronunciation', 'Sounds that are hard for Turkish speakers: th, w/v, ship/sheep, word stress.'],
    sinav: ['Exam centre', 'Original practice tests for YDS, e-YDS and YÖKDİL, the national English exams in Turkey used for academic posts and civil-service pay. Includes a 4,702-entry exam dictionary.'],
    ceviri: ['Translation (YDS)', 'English↔Turkish translation practice in the YDS format: multiple choice and written.'],
    ukus: ['UK / US', 'British and American differences in vocabulary and spelling.'],
    sayilar: ['Numbers and time', 'Telling the time, dates, prices and phone numbers.'],
    yolculuk: ['Map', 'The grammar journey as a map of steps.'],
    practice: ['Free practice', 'Mixed practice outside the units.'],
  };
  const CONFIG = {
    key: 'ia_lang',
    bg: '#23305a',
    accent: '#ffcf6b',
    intro:
      'İngilizce Atölyesi teaches English to Turkish speakers from A1 to C2 and prepares them for Turkey’s national English exams (YDS, e-YDS, YÖKDİL). Explanations are in Turkish on purpose — they contrast English with Turkish — so the interface stays Turkish. This guide explains each section.',
    glossSelector: 'nav.tb button, .hbt > b, .gal, main .big, .scard b, main .tabs button, main .seg button, main h2, main h3',
    blockGloss: '.hbt > b, main .big, .gal, main h2, main h3',
    gloss: {
      Bugün: 'Today',
      Üniteler: 'Units',
      Tekrar: 'Review',
      Keşfet: 'Explore',
      Profil: 'Profile',
      'Kelime bilgisi': 'Vocabulary',
      Dilbilgisi: 'Grammar',
      Beceriler: 'Skills',
      Ekstralar: 'Extras',
      'Seviye seç': 'Choose a level',
      Özet: 'Summary',
      Rozetler: 'Badges',
      Ayarlar: 'Settings',
      'İngilizce karnem': 'My English report card',
      'Bugünkü planın': 'Your plan for today',
      'Merhaba! Ben Mavi.': 'Hi! I’m Mavi (the guide character).',
      ...Object.fromEntries(
        Object.entries({
          kelimeler: 'Kelimeler', kaliplar: 'Kalıplar', aileler: 'Kelime aileleri', idioms: 'Deyimler',
          hatalar: 'Sık hatalar', konusma: 'Konuşma', strateji: 'Stratejiler', stories: 'Okuma', dinle: 'Dinleme',
          diyaloglar: 'Diyaloglar', yazma: 'Yazma', telaffuz: 'Telaffuz', sinav: 'Sınav merkezi', ceviri: 'Çeviri (YDS)',
          sayilar: 'Sayılar ve zaman', yolculuk: 'Harita', practice: 'Serbest pratik',
        }).map(([k, tr]) => [tr, HUB[k][0]])
      ),
    },
    clickRoute(el) {
      const m = el.closest('[data-m]');
      if (m) return m.dataset.m;
      const h = el.closest('[data-hb]');
      if (h && HUB[h.dataset.hb]) return h.dataset.hb;
      return null;
    },
    route: clicked => clicked,
    guide: {
      home: {
        t: 'Today',
        p: 'The daily screen: one “continue” button, today’s lesson and the review queue. Mavi, the guide character, suggests the next step. Progress is stored in the browser — no account needed.',
        try: 'Press “Derse başla” (Start the lesson) to see how a vocabulary lesson works, or open “Keşfet” (Explore) to see every section.',
      },
      uniteler: {
        t: 'Units',
        p: '75 themed units from A1 to C2 (“Hello!”, “My family and home”, “Daily life”…). Each unit has seven core steps and a unit test that needs 70% to pass. Every three units unlock a mixed review.',
      },
      tekrar: {
        t: 'Spaced repetition',
        p: 'Wrong answers and new words come back after 10 minutes, then 1, 3, 7 and 21 days. Each correct answer lengthens the interval; after the fifth correct answer the item leaves the list.',
      },
      dersler: {
        t: 'Explore',
        p: 'Every section outside the unit path, grouped as vocabulary, grammar, skills and extras. The numbers on each card show progress at the chosen level.',
        try: 'Open “Sık hatalar” (Common mistakes) or “Sınav merkezi” (Exam centre) — the two sections most specific to Turkish learners.',
      },
      stats: {
        t: 'Profile',
        p: 'XP, streaks, a weekly chart, the daily goal and the word-learning funnel (new → learning → consolidating → learned → permanent). The shareable “English report card” summarises the level. Backups are exported to a file from here.',
      },
      ...Object.fromEntries(Object.entries(HUB).map(([k, [t, p]]) => [k, { t, p }])),
    },
  };
  /* ---------- Tur motoru (bütün uygulamalarda aynı; içerik yukarıdaki CONFIG'tedir) ---------- */
  const C = CONFIG;
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en') localStorage.setItem(C.key, 'en');
    if (q === 'tr') localStorage.removeItem(C.key);
    if (localStorage.getItem(C.key) !== 'en') return;
  } catch {
    return;
  }
  root.EN_TOUR = true;
  let clicked = null; // URL'si değişmeyen uygulamalarda son tıklanan bölüm
  const norm = s => (s || '').replace(/\s+/g, ' ').trim();
  const strip = s => norm(s).replace(/^[^\p{L}\p{N}]+/u, '').replace(/\s*[›→↗»]$/, '');

  function glossAll() {
    document.querySelectorAll(C.glossSelector).forEach(el => {
      if (el.dataset.enGloss || el.closest('#en-tour')) return;
      const own = C.glossText ? C.glossText(el) : el.innerText;
      const en = C.gloss[norm(own)] || C.gloss[strip(own)];
      if (!en || en === strip(own)) return;
      el.dataset.enGloss = '1';
      const s = document.createElement('span');
      s.className = 'en-gloss';
      s.lang = 'en';
      s.textContent = en;
      if (C.blockGloss && el.matches(C.blockGloss)) s.classList.add('en-block');
      else if (C.navGloss && el.matches(C.navGloss)) el.classList.add('en-nav');
      el.appendChild(s);
    });
  }

  const CSS = `
  .en-gloss{display:inline-block;margin-left:6px;font-size:11px;font-weight:500;letter-spacing:0;text-transform:none;opacity:.7;font-style:italic}
  .en-nav{flex-wrap:wrap!important}
  .en-nav>.en-gloss{display:block;flex-basis:100%;margin:1px 0 0 ${C.navIndent || '28px'};font-size:10.5px;line-height:1.2}
  .en-gloss.en-block{display:block;margin:2px 0 0;font-size:12px;line-height:1.3}
  #en-tour{position:fixed;right:16px;bottom:16px;z-index:2147483000;width:min(360px,calc(100vw - 32px));max-height:calc(100vh - 32px);overflow:auto;background:${C.bg || '#1f2a44'};color:#f4f6fb;border-radius:14px;box-shadow:0 14px 40px rgba(0,0,0,.28);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;text-align:left}
  #en-tour header{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:11px 14px 0}
  #en-tour header b{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${C.accent || '#ffd479'}}
  #en-tour header button{all:unset;cursor:pointer;border:1px solid rgba(255,255,255,.35);border-radius:8px;padding:1px 8px;font-size:12px}
  #en-tour .en-body{padding:4px 14px 13px}
  #en-tour h3{margin:4px 0 6px;font-size:16px;color:#fff;font-weight:700}
  #en-tour p{margin:0 0 8px}
  #en-tour .en-try{background:rgba(255,255,255,.08);border-left:3px solid ${C.accent || '#ffd479'};padding:7px 10px;border-radius:6px}
  #en-tour a{color:${C.accent || '#ffd479'}}
  #en-tour .en-foot{font-size:12px;opacity:.75;margin:6px 0 0}
  #en-tour.en-min .en-body{display:none}
  #en-tour.en-min{width:auto}
  #en-tour.en-min header{padding:9px 12px}
  @media (max-width:640px){#en-tour{right:8px;left:8px;bottom:8px;width:auto;max-height:45vh}}
  @media print{#en-tour,.en-gloss{display:none!important}}
  ${C.css || ''}`;

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  let panel, btn, lastKey;
  function render(force) {
    const k = C.route(clicked) || 'home';
    if (k === lastKey && !force) return;
    lastKey = k;
    const g = C.guide[k] || C.guide.home;
    let first = false;
    try {
      first = !sessionStorage.getItem(C.key + '_seen');
      sessionStorage.setItem(C.key + '_seen', '1');
    } catch {}
    panel.querySelector('.en-body').innerHTML = `
      ${first ? `<p>${C.intro}</p>` : ''}
      <h3>${esc(g.t)}</h3>
      <p>${g.p}</p>
      ${g.try ? `<p class="en-try"><b>Try this:</b> ${g.try}</p>` : ''}
      <p class="en-foot">${C.foot || 'Small English labels under menus and headings are part of this guide.'} <a href="?lang=tr">Turn off</a></p>`;
  }
  function setMin(min, remember) {
    panel.classList.toggle('en-min', min);
    btn.textContent = min ? 'Show' : 'Hide';
    btn.setAttribute('aria-expanded', String(!min));
    if (remember)
      try {
        localStorage.setItem(C.key + '_min', min ? '1' : '');
      } catch {}
  }
  function mount() {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    panel = document.createElement('aside');
    panel.id = 'en-tour';
    panel.lang = 'en';
    panel.setAttribute('aria-label', 'English guide');
    panel.innerHTML = '<header><b>English guide</b><button type="button">Hide</button></header><div class="en-body"></div>';
    btn = panel.querySelector('button');
    btn.addEventListener('click', () => setMin(!panel.classList.contains('en-min'), true));
    document.body.appendChild(panel);
    let min = false;
    try {
      min = localStorage.getItem(C.key + '_min') === '1';
    } catch {}
    setMin(min);
    render(true);
    glossAll();
    // Kullanıcı yazmaya başlayınca panel küçülür, içeriği kapatmaz.
    document.addEventListener('focusin', e => {
      if (!panel.contains(e.target) && e.target.matches('input:not([type=checkbox]):not([type=radio]), textarea, select'))
        setMin(true);
    });
    document.addEventListener(
      'click',
      e => {
        if (panel.contains(e.target) || !C.clickRoute) return;
        const r = C.clickRoute(e.target);
        if (r) clicked = r;
      },
      true
    );
    let t;
    new MutationObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => {
        glossAll();
        render();
      }, 80);
    }).observe(document.body, { childList: true, subtree: true });
    addEventListener('hashchange', () => setTimeout(render, 60));
    addEventListener('popstate', () => setTimeout(render, 60));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})(window);
