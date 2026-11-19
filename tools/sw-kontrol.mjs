// Service worker önbellek adı unutulmasın (CI kapısı).
//
// Neden: Tarayıcı yeni sürümü yalnız sw.js değişince fark eder. sw.js'in önbelleğe aldığı dosyalardan biri
// değişip CACHE adı aynı kalırsa, kurulu kullanıcılar çevrimdışıyken eski kopyayla kalır.
// Bu betik iki commit arasında değişen dosyalara bakar: önbellek listesindeki bir dosya değiştiyse
// sw.js'teki CACHE adı da değişmiş olmalı. Değişmemişse hata verir.
//
// Kullanım: node tools/sw-kontrol.mjs [taban-commit]   (varsayılan: HEAD~1)
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const base = process.argv[2] || 'HEAD~1';
if (/^0+$/.test(base)) { console.log('Taban commit yok (yeni dal); denetim atlandı.'); process.exit(0); }
const git = (...a) => execFileSync('git', a, { encoding: 'utf8' });
let changed;
try { changed = git('diff', '--name-only', base, 'HEAD').split('\n').filter(Boolean); }
catch { console.log(`Taban commit (${base}) bulunamadı; denetim atlandı.`); process.exit(0); }

const sw = readFileSync('sw.js', 'utf8');
const list = sw.match(/const\s+(?:CORE|FILES|core)\s*=\s*\[([\s\S]*?)\]/);
if (!list) { console.error('sw.js içinde önbellek listesi (CORE/FILES) bulunamadı.'); process.exit(1); }
const files = new Set([...list[1].matchAll(/['"]([^'"]+)['"]/g)].map(m => {
  let f = m[1].replace(/^\.\//, '').replace(/^\//, '');
  if (f === '' || f.endsWith('/')) f += 'index.html';
  return f;
}));
const hit = changed.filter(f => files.has(f));
if (!hit.length) { console.log('Önbelleğe alınan dosyalarda değişiklik yok.'); process.exit(0); }
const cacheLine = s => (s.match(/const\s+CACHE\s*=\s*['"][^'"]+['"]/) || [''])[0];
let before = '';
try { before = git('show', `${base}:sw.js`); } catch { /* sw.js yeni eklenmiş */ }
if (before && cacheLine(before) === cacheLine(sw)) {
  console.error(`Önbelleğe alınan dosyalar değişti (${hit.join(', ')}) ama sw.js'teki CACHE adı aynı kaldı.`);
  console.error('sw.js içinde CACHE adını değiştir (ör. tarih ya da sürüm ekle), sonra yeniden gönder.');
  process.exit(1);
}
console.log(`Değişen önbellek dosyaları: ${hit.join(', ')} · CACHE adı güncellenmiş.`);
