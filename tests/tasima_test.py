"""Adres taşıma (tasima.js) tarayıcı testi. Çalıştırma: python3 tests/tasima_test.py [chrome-yolu]
Gerekenler: pip install playwright; Chrome. Senaryolar: boş cihaz, ilk açılıştaki boş kayıt, iki farklı kayıt
(indir / bu cihazda kullan), aynı kayıt, eski adreste büyük kayıt notu."""
import base64, functools, http.server, json, os, shutil, socketserver, sys, threading, tempfile
from playwright.sync_api import sync_playwright
REPO=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME=sys.argv[1] if len(sys.argv)>1 else '/usr/bin/google-chrome'
root=tempfile.mkdtemp(); os.symlink(REPO, f'{root}/ingilizce-ogrenme-atolyesi'); open(f'{root}/bos.html','w').write('<!doctype html><title>bos</title>')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
socketserver.TCPServer.allow_reuse_address=True
srv=socketserver.TCPServer(('127.0.0.1',0),functools.partial(Q,directory=REPO)); threading.Thread(target=srv.serve_forever,daemon=True).start()
srv2=socketserver.TCPServer(('127.0.0.1',0),functools.partial(Q,directory=root)); threading.Thread(target=srv2.serve_forever,daemon=True).start()
P=srv.server_address[1]; P2=srv2.server_address[1]
URL=f'http://localhost:{P}/'
def paket(d): return base64.urlsafe_b64encode(json.dumps(d).encode()).decode().rstrip('=')
ESKI={'kv1':json.dumps({'xp':777,'sr':{'a':{'b':5},'b':{'b':4},'c':{'b':1}}}),'kvx':'[]'}
YENI_KV1=json.dumps({'xp':10,'sr':{}})
sonuc=[]
def ok(ad,kosul): sonuc.append((ad,bool(kosul))); print(('✓' if kosul else '✗'),ad)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=CHROME,args=['--no-sandbox',f'--host-resolver-rules=MAP ysfdurak.github.io 127.0.0.1:{P2}'])
    def yeni_sayfa():
        c=b.new_context(accept_downloads=True); pg=c.new_page()
        pg.on('pageerror',lambda e:print('  pageerror',str(e)[:150])); return c,pg
    # A) boş cihaz
    c,pg=yeni_sayfa(); pg.goto(URL+'#tasi='+paket(ESKI)); pg.wait_for_timeout(1500)
    ok('A: boş cihazda kayıt yazıldı', json.loads(pg.evaluate("localStorage.getItem('kv1')"))['xp']==777)
    ok('A: not gösterilmedi', pg.locator('#tasimaNotu').count()==0)
    ok('A: adres temizlendi', '#' not in pg.url); c.close()
    # F) yeni adres bir kez açılmış (uygulamanın oluşturduğu boş kayıt) → soru sormadan yaz
    c,pg=yeni_sayfa(); pg.goto(URL); pg.wait_for_timeout(2000)
    bos=pg.evaluate("localStorage.getItem('kv1')")
    pg.goto('about:blank'); pg.goto(URL+'#tasi='+paket(ESKI)); pg.wait_for_timeout(1500)
    ok('F: boş kayıt varken eski kayıt yazıldı', json.loads(pg.evaluate("localStorage.getItem('kv1')"))['xp']==777)
    ok('F: soru gösterilmedi', pg.locator('#tasimaNotu').count()==0)
    ok('F: boş kayıt kv1_prev olarak saklandı', pg.evaluate("localStorage.getItem('kv1_prev')")==bos); c.close()
    # B) farklı kayıt → indir
    c,pg=yeni_sayfa(); pg.goto(URL); pg.evaluate("v=>localStorage.setItem('kv1',v)",YENI_KV1)
    pg.goto('about:blank'); pg.goto(URL+'#tasi='+paket(ESKI)); pg.wait_for_selector('#tasimaNotu',timeout=5000)
    ok('B: mevcut kayıt korunuyor (eski yazılmadı)', json.loads(pg.evaluate("localStorage.getItem('kv1')")).get('xp')!=777)
    ok('B: gelen kayıt bekletiliyor', json.loads(pg.evaluate("localStorage.getItem('kv_tasinan')"))['kv1']==ESKI['kv1'])
    ok('B: not metninde XP var', '777 XP' in pg.inner_text('#tasimaNotu'))
    ok('B: adres temizlendi', '#' not in pg.url)
    pg.reload(); pg.wait_for_timeout(1500)
    ok('B: sayfa yenilenince not yine çıkıyor', pg.locator('#tasimaNotu').count()==1)
    with pg.expect_download() as d: pg.click('#tasimaNotu button:has-text("indir")')
    yol=d.value.path(); y=json.load(open(yol))
    ok('B: yedek dosyası uygulamanın biçiminde', y['app']=='kelime-atolyesi' and json.loads(y['ls']['kv1'])['xp']==777 and y['sum']=={'xp':777,'lw':2})
    # uygulamanın kendi yükleme doğrulamasından geçiyor mu
    ok('B: Profil → Yedekten yükle kabul eder', pg.evaluate("p=>{try{if(!p||p.app!=='kelime-atolyesi'||!p.ls||!p.ls.kv1)return false;JSON.parse(p.ls.kv1);return true}catch(e){return false}}",y))
    ok('B: indirince bekleyen temizlendi', pg.evaluate("localStorage.getItem('kv_tasinan')") is None)
    pg.reload(); pg.wait_for_timeout(1000); ok('B: sonra not çıkmıyor', pg.locator('#tasimaNotu').count()==0); c.close()
    # C) farklı kayıt → bu cihazda kullan
    c,pg=yeni_sayfa(); pg.goto(URL); pg.evaluate("v=>localStorage.setItem('kv1',v)",YENI_KV1)
    pg.goto('about:blank'); pg.goto(URL+'#tasi='+paket(ESKI)); pg.wait_for_selector('#tasimaNotu',timeout=5000)
    pg.on('dialog',lambda dlg: dlg.accept())
    with pg.expect_navigation(): pg.click('#tasimaNotu button:has-text("kullan")')
    pg.wait_for_timeout(1500)
    ok('C: eski kayıt etkin', json.loads(pg.evaluate("localStorage.getItem('kv1')"))['xp']==777)
    ok('C: önceki kayıt geri alınabilir (kv1_prev)', json.loads(pg.evaluate("localStorage.getItem('kv1_prev')")).get('xp')==10)
    ok('C: bekleyen temizlendi', pg.evaluate("localStorage.getItem('kv_tasinan')") is None); c.close()
    # D) aynı kayıt
    c,pg=yeni_sayfa(); pg.goto(URL); pg.evaluate("e=>{localStorage.setItem('kv1',e.kv1);localStorage.setItem('kvx',e.kvx)}",ESKI)
    pg.goto('about:blank'); pg.goto(URL+'#tasi='+paket(ESKI)); pg.wait_for_timeout(1500)
    ok('D: aynı kayıtta not yok', pg.locator('#tasimaNotu').count()==0); c.close()
    # E) eski adreste büyük kayıt: DOM ile not
    c,pg=yeni_sayfa(); E='http://ysfdurak.github.io/ingilizce-ogrenme-atolyesi/'
    pg.goto('http://ysfdurak.github.io/bos.html')
    pg.evaluate("()=>localStorage.setItem('kv1',JSON.stringify({xp:1,pad:'x'.repeat(1200000)}))")
    pg.goto(E+'hakkinda.html'); pg.wait_for_timeout(1500)
    not_=pg.locator('div[role=status]:has-text("yeni adresine taşındı")')
    ok('E: büyük kayıtta yönlendirme yok, not var', 'ysfdurak.github.io' in pg.url and not_.count()==1)
    ok('E: bağlantı doğru', not_.locator('a').get_attribute('href')=='https://ingilizce-atolyesi.ysfdurak.com/hakkinda.html'); c.close()
    b.close()
srv.shutdown(); srv2.shutdown()
bad=[a for a,k in sonuc if not k]
print('SONUÇ:', 'hepsi geçti' if not bad else 'BAŞARISIZ: '+', '.join(bad)); sys.exit(1 if bad else 0)
