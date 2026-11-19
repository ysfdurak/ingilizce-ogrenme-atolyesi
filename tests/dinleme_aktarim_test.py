"""Dinleme aktarımı tarayıcı testi (dış inceleme, Kasım 2026). Çalıştırma: python3 tests/dinleme_aktarim_test.py [chrome-yolu]
Kaçırılan kelime ertesi gün yeni bir cümlede ve başka bir sesle sorulur; başarı yalnız ilk kez duyulan cümlede sayılır."""
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
    pg.goto(URL+'?notour'); pg.wait_for_timeout(1500)
    r=pg.evaluate("""()=>{const w=words.find(x=>x.w==='breakfast')||words.find(x=>altSent(x)&&altSent(x)!==x.ex);const k=key(w),dun=new Date(Date.now()-864e5).toDateString();
      S.km={[k]:{d:dun}};S.hs={};S.tr={n:0,ok:0};S.f={l:w.l};S.nd={d:new Date().toDateString(),n:99};save();
      const plan=lessonPlan(),adim=plan.find(s=>s.k==='lnew'&&s.w===w);return {w:w.w,ex:w.ex,adim:adim?adim.sent:null}}""")
    ok('dünkü kaçırılan kelime bugünkü planda yeni cümleyle: '+str(r['adim']), r['adim'] and r['adim']!=r['ex'])
    def sor(dogru):
        pg.evaluate("""s=>{const w=words.find(x=>x.w===s.w);cur='lesson';lnew({w,sent:s.sent})}""", {'w':r['w'],'sent':r['adim']})
        pg.wait_for_timeout(200)
        btn=[x for x in pg.locator('.opt').all() if (x.inner_text().strip()==r['w'])==dogru][0]; btn.click(); pg.wait_for_timeout(200)
        return pg.evaluate("()=>({tr:S.tr,km:S.km})")
    s1=sor(True)
    ok('ilk kez duyulan cümlede doğru cevap sayıldı (1/1)', s1['tr']=={'n':1,'ok':1})
    ok('kelime aktarım için denendi olarak işaretlendi', all(v.get('t')==1 for v in s1['km'].values()))
    s2=sor(True)
    ok('aynı cümle ikinci kez sayılmadı (yine 1/1)', s2['tr']=={'n':1,'ok':1})
    ok('ekranda "ölçüme sayılmaz" notu', 'ölçüme sayılmaz' in pg.locator('#main').inner_text())
    pg.evaluate("()=>{S.km={};save()}")
    plan=pg.evaluate("()=>lessonPlan().filter(s=>s.k==='lnew').length")
    ok('denenmiş kelime planda tekrar çıkmıyor', plan==0)
    ok('sayfa hatası yok', not hatalar)
    if hatalar: print(hatalar[:3])
    b.close()
srv.shutdown()
print('SONUÇ:','hepsi geçti' if all(sonuc) else 'HATA'); sys.exit(0 if all(sonuc) else 1)
