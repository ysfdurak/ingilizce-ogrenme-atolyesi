// app.js'teki sabit EXFULL listesi (tam deneme kimlikleri) exb.js'teki soru bankasıyla uyumlu mu?
// Soru bankası tembel yüklendiği için liste app.js'te sabit tutulur; bu betik ikisinin ayrışmasını CI'da yakalar.
// Kullanım: node tools/exb-kontrol.mjs
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const ctx = { window: {} };
vm.runInNewContext(readFileSync('exb.js', 'utf8'), ctx);
const exb = ctx.window.__EXB;
if (!Array.isArray(exb) || !exb.length) { console.error('exb.js içinde soru bankası yok.'); process.exit(1); }
const beklenen = [...new Set(exb.filter(x => x.ex).map(x => x.ex))].sort((a, b) => a.replace(/\d+/, '').localeCompare(b.replace(/\d+/, '')) || (+a.match(/\d+/)[0]) - (+b.match(/\d+/)[0]));
const m = readFileSync('app.js', 'utf8').match(/const EXFULL=(\[[^\]]*\]);/);
if (!m) { console.error("app.js içinde 'const EXFULL=[...]' bulunamadı."); process.exit(1); }
const sabit = JSON.parse(m[1]);
if (JSON.stringify(sabit) !== JSON.stringify(beklenen)) {
  console.error('EXFULL exb.js ile uyuşmuyor.\n  app.js : ' + JSON.stringify(sabit) + '\n  exb.js : ' + JSON.stringify(beklenen));
  console.error("app.js'teki EXFULL satırını exb.js'e göre güncelle.");
  process.exit(1);
}
if (/var EXB=\[/.test(readFileSync('app.js', 'utf8'))) { console.error('app.js içinde soru bankası yeniden gömülmüş; exb.js kullanılmalı.'); process.exit(1); }
console.log(`EXFULL uyumlu: ${sabit.length} tam deneme, ${exb.length} soru.`);
