"""Boş soru paketi tarayıcı testi (denetim D10, Kasım 2026). Çalıştırma: python3 tests/bos_sinav_test.py [chrome-yolu]
Soru paketi eksik ya da boşken deneme sınavı, tam deneme ve tür pratiği başlamamalı; süre işlememeli, 0/0 puan yazılmamalı."""
import functools, http.server, socketserver, sys, threading, os
from playwright.sync_api import sync_playwright
REPO=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME=sys.argv[1] if len(sys.argv)>1 else None
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
socketserver.TCPServer.allow_reuse_address=True
srv=socketserver.TCPServer(('127.0.0.1',0),functools.partial(Q,directory=REPO)); threading.Thread(target=srv.serve_forever,daemon=True).start()
URL=f'http://localhost:{srv.server_address[1]}/'
sonuc=[]
def ok(ad,kosul): sonuc.append(bool(kosul)); print(('✓' if kosul else '✗'),ad)
with sync_playwright() as p:
    b=p.chromium.launch(**({'executable_path':CHROME} if CHROME else {})); pg=b.new_page(); hatalar=[]; pg.on('pageerror',lambda e:hatalar.append(str(e)))
    pg.route('**/exb.js', lambda r: r.fulfill(status=200, content_type='text/javascript', body='window.__EXB=[];'))
    pg.goto(URL+'?notour'); pg.wait_for_timeout(1500)
    for ad, kod in [('deneme sınavı', "exStart('d')"), ('tür pratiği', "exStart('p','kel')"), ('tam deneme', "exStartFull('Y1')")]:
        r=pg.evaluate("""async k=>{await exYukle();EXS=null;cur='sinav';const h0=EXD().h.length;eval(k);await new Promise(r=>setTimeout(r,1500));
          return {exs:EXS,cur,timer:EXI,h:EXD().h.length-h0,toast:document.body.innerText.includes('soru bulunamadı')}}""", kod)
        ok(f'{ad}: başlamadı, süre yok, kayıt yok, uyarı var', r['exs'] is None and r['cur']!='sinavq' and not r['timer'] and r['h']==0 and r['toast'])
    ok('sayfa hatası yok', not hatalar)
    if hatalar: print(hatalar[:3])
    b.close()
srv.shutdown()
print('SONUÇ:','hepsi geçti' if all(sonuc) else 'HATA'); sys.exit(0 if all(sonuc) else 1)
