import difflib,json,os,re,subprocess,sys,time,unicodedata
from PIL import Image,ImageDraw,ImageFilter,ImageFont
L=sys.argv[1];os.chdir("/home/user/anim");T0=time.time()
HF=os.environ["HF_WORKFLOWS"]+"/ugc-website-video/scripts/"
CAP,OUT=f"cap4/{L}",f"out/{L}";os.makedirs(OUT,exist_ok=True)
META=json.load(open(f"{CAP}/meta.json"))["shots"]
W,H,FPS=1920,1080,30
WX,WY,BH,CW,CH,RAD=200,40,42,1520,825,18
SW,SH=2880,1564
INTRO,OUTRO,TAIL,TR,LEAD=1.8,2.4,0.5,0.5,0.15
SCR={"en":"This is PodiumCall. It shows who is most likely to finish in the top three at the next big athletics championship, using real results from World Athletics. Start on the Dashboard. Each card is the athlete our model rates highest in one event. Open Track or Field to see the top 20 in any event. By points ranks them on their best performance this season. Model rating shows who the model thinks will reach the podium. When the two lists disagree, take a closer look. Choose a name to open that athlete's page. You'll see their best marks, their races this year, and their chance of a top-three finish. That's not a chance of winning. Press the little i next to any number to see what it means. Use search to find any ranked athlete, even if they're not competing. Results shows what we predicted before each championship, and what really happened. Spotted a mistake? Press Send feedback at the bottom of any page.",
"fr":"Voici PodiumCall. Le site montre qui a le plus de chances de finir dans le top trois du prochain grand championnat d'athlétisme, à partir des vrais résultats de World Athletics. Commencez par le Tableau de bord. Chaque carte montre l'athlète que notre modèle place en tête dans une épreuve. Ouvrez Piste ou Concours pour voir le top 20 de chaque épreuve. Avec Par points, les athlètes sont classés selon leur meilleure performance de la saison. Avec Évaluation du modèle, vous voyez qui, selon le modèle, montera sur le podium. Quand les deux classements ne sont pas d'accord, regardez de plus près. Choisissez un nom pour ouvrir la fiche de l'athlète : ses meilleures marques, ses courses de l'année et sa chance de finir dans le top trois. Pas sa chance de gagner. Appuyez sur le petit i à côté d'un chiffre pour savoir ce qu'il veut dire. La recherche trouve n'importe quel athlète classé, même ceux qui ne sont pas engagés. Résultats montre ce que nous avions prévu avant chaque championnat, et ce qui s'est vraiment passé. Une erreur ? Appuyez sur Envoyer un retour, en bas de chaque page."}
BEATS={"en":[0,2,4,6,8,11,12,13,14],"fr":[0,2,4,6,8,10,11,12,13]}
KW={"en":["model","little","search","send"],"fr":["evaluation","petit","recherche","envoyer"]}
SUB={"en":"How it works, in one minute","fr":"Comment ça marche, en une minute"}
ATH="/athlete/men_PV/Armand DUPLANTIS"
SC=[dict(s="01",p="/dashboard",e="rise",z=1.06,dy=120),dict(s="02",p="/dashboard",e="scroll",z=1.16,dy=380),
dict(s="03",p="/track",e="push",z=1.08,f="press"),dict(s="03",a="04",p="/track",e="none",k=0,za=1.24),
dict(s="05",p=ATH,e="push",z=1.1,f="stat"),dict(s="06b",a="06",p=ATH,e="scroll",k=1,za=1.75),
dict(s="12b",a="12",p="/dashboard",e="push",k=2,za=1.45),dict(s="13",p="/results",e="push",z=1.08),
dict(s="14b",a="14",p="/results",e="scroll",k=3,za=1.35)]
def norm(t):
    t=unicodedata.normalize("NFKD",t.lower());return re.sub(r"[^a-z0-9]","","".join(c for c in t if not unicodedata.combining(c)))
def run(c):
    p=subprocess.run(c,capture_output=True,text=True)
    if p.returncode:print("FAIL"," ".join(c)[:160],p.stderr[-700:]);sys.exit(1)
    return p
def ease(x):
    if x<=0:return 0.0
    if x>=1:return 1.0
    return 4*x*x*x if x<.5 else 1-(-2*x+2)**3/2
def lerp(a,b,p):return a+(b-a)*p
def font(sz,bold=True):return ImageFont.truetype(run(["fc-match","-f","%{file}","Metropolis:bold" if bold else "Metropolis"]).stdout.strip(),sz)
script=SCR[L];sents=[s for s in re.split(r"(?<=[.?!])\s+",script) if s]
assert len(sents)==BEATS[L][-1]+2,len(sents)
tok,tsn,disp=[],[],[]
for si,s in enumerate(sents):
    for w in s.split():
        if norm(w):tok.append(norm(w));tsn.append(si);disp.append(w)
        elif disp:disp[-1]+=(" " if L=="fr" else "")+w
wp=f"{OUT}/words.json"
if not os.path.exists(wp):run(["python3",HF+"transcribe_words.py",f"{L}.mp3","--lang",L,"-o",wp])
words=json.load(open(wp));wn=[norm(w[2]) for w in words]
st,en=[None]*len(tok),[None]*len(tok)
for tag,i1,i2,j1,j2 in difflib.SequenceMatcher(a=tok,b=wn,autojunk=False).get_opcodes():
    if tag in("equal","replace") and j2>j1:
        n=i2-i1
        for q in range(n):
            a=j1+q*(j2-j1)//n;b=max(a,min(j1+(q+1)*(j2-j1)//n-1,j2-1));st[i1+q],en[i1+q]=words[a][0],words[b][1]
for i in range(len(tok)):
    if st[i] is None:st[i]=en[i-1] if i else 0.0
    if en[i] is None:en[i]=st[i]+.25
dur=float(run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f"{L}.mp3"]).stdout)
ENDN=dur+TAIL;B=BEATS[L]
bounds=[0.0]+[max(0,st[tsn.index(b)]-LEAD) for b in B[1:]]+[ENDN]
def ctr(r,dy=0):return (r[0]+r[2]/2,r[1]+r[3]/2+dy) if r else (SW/2,SH/2)
keys,prev=[],(1.0,SW/2,SH/2)
for i,s in enumerate(SC):
    D=bounds[i+1]-bounds[i];m=META[s["s"]];s0=prev if s["e"]=="none" else (1.0,SW/2,SH/2)
    if "a" not in s:
        kk=[(0,)+s0,(D,s["z"])+ctr(m.get(s.get("f","focus")) or m.get("focus"),s.get("dy",0))]
    else:
        lo,hi=B[i],(B[i+1] if i+1<len(B) else 99)
        kt=next((st[j] for j in range(len(tok)) if lo<=tsn[j]<hi and tok[j].startswith(KW[L][s["k"]])),bounds[i]+1)
        tp=max(kt-bounds[i],0.15 if s["e"]=="none" else TR/2+0.95);tp=min(tp,D-0.6);s["tp"]=tp
        pc=ctr(m.get("press"));ac=ctr(META[s["a"]].get("focus"))
        kk=[(0,)+s0,(max(tp-.15,.05),1.12)+pc,(max(min(tp+1.3,D-.1),tp),s["za"])+ac,(D,s["za"]*1.03)+ac]
    keys.append(kk);prev=kk[-1][1:]
def cam(i,t):
    kk=keys[i];t=min(max(t,0),kk[-1][0])
    for a,b in zip(kk,kk[1:]):
        if t<=b[0]:
            p=ease((t-a[0])/max(b[0]-a[0],1e-6));return tuple(lerp(a[j],b[j],p) for j in (1,2,3))
    return kk[-1][1:]
def box(c):
    z,cx,cy=c;w=SW/z;h=w*CH/CW;cx=min(max(cx,w/2),SW-w/2);cy=min(max(cy,h/2),SH-h/2);return (cx-w/2,cy-h/2,cx+w/2,cy+h/2)
IM={}
def img(n):
    if n not in IM:IM[n]=Image.open(f"{CAP}/{n}.png").convert("RGB")
    return IM[n]
def content(i,t):
    s=SC[i];bx=box(cam(i,t));fr=img(s["s"]).resize((CW,CH),Image.BILINEAR,box=bx)
    if "a" in s:
        a=ease((t-s["tp"]-.1)/.16)
        if a>0:fr=Image.blend(fr,img(s["a"]).resize((CW,CH),Image.BILINEAR,box=bx),a)
    return fr,bx
import numpy as np
def rows(im):return np.asarray(im.convert("L").resize((180,SH),Image.BILINEAR),dtype=np.float32)
SCROLL={}
for j in range(1,len(SC)):
    if SC[j]["e"]!="scroll":continue
    A,Bi=img(SC[j-1]["s"]),img(SC[j]["s"]);ra,rb=rows(A),rows(Bi);sc,d=1e9,0
    for dd in range(40,SH-350):
        v=float(np.abs(ra[dd+200:]-rb[200:SH-dd]).mean())
        if v<sc:sc,d=v,dd
    hh=0
    if sc<2.5:
        hh=next((y for y in range(0,min(400,SH-d-30)) if float(np.abs(rb[y:y+30]-ra[y+d:y+d+30]).mean())<3),0);hh=hh+4 if hh else 0
        tall=Image.new("RGB",(SW,SH+d));tall.paste(A,(0,0));tall.paste(Bi.crop((0,hh,SW,SH)),(0,d+hh))
        SCROLL[j]=(d,hh,tall,A.crop((0,0,SW,hh)) if hh else None,Bi.crop((0,0,SW,hh)) if hh else None)
    print("scroll",SC[j-1]["s"],"->",SC[j]["s"],"offset",d,"match",round(sc,2),"header",hh,"REAL SCROLL" if j in SCROLL else "fallback dissolve")
def content_at(tn):
    for j in range(1,len(SC)):
        if SC[j]["e"] in("push","scroll") and abs(tn-bounds[j])<TR/2:
            p=ease((tn-bounds[j]+TR/2)/TR);old,_=content(j-1,tn-bounds[j-1]);new,bx=content(j,max(0,tn-bounds[j]))
            c=Image.new("RGB",(CW,CH))
            if j in SCROLL:
                d,hh,tall,hA,hB=SCROLL[j];bA=box(cam(j-1,tn-bounds[j-1]));s=p*d;bx=tuple(lerp(u,v,p) for u,v in zip(bA,bx))
                c=tall.resize((CW,CH),Image.BILINEAR,box=(bx[0],bx[1]+s,bx[2],bx[3]+s))
                if hh and bx[1]<hh:
                    h1=min(hh,bx[3]);c.paste(Image.blend(hA,hB,p).resize((CW,max(1,round((h1-bx[1])*CW/(bx[2]-bx[0])))),Image.BILINEAR,box=(bx[0],bx[1],bx[2],h1)),(0,0))
            elif SC[j]["e"]=="push":c.paste(old,(round(-p*CW),0));c.paste(new,(round((1-p)*CW),0))
            else:
                d=round(CH*.14);oy,ny=round(-p*d),round((1-p)*d)
                o2=Image.new("RGB",(CW,CH));o2.paste(old,(0,oy))
                if oy<0:o2.paste(old.crop((0,CH-1,CW,CH)).resize((CW,-oy)),(0,CH+oy))
                n2=Image.new("RGB",(CW,CH));n2.paste(new,(0,ny))
                if ny>0:n2.paste(new.crop((0,0,CW,1)).resize((CW,ny)),(0,0))
                c=Image.blend(o2,n2,ease((p-.15)/.7))
            return c,j,bx
    i=max(k for k in range(len(SC)) if bounds[k]<=max(tn,0));fr,bx=content(i,tn-bounds[i]);return fr,i,bx
GOLD=(240,196,120);CUR=[(0,0),(0,36),(9,28),(16,43),(23,40),(16,25),(28,25)]
def overlay(fr,tn,bx):
    d=ImageDraw.Draw(fr,"RGBA");sx=CW/(bx[2]-bx[0])
    for i,s in enumerate(SC):
        r=META[s["s"]].get("press")
        if "tp" not in s or not r:continue
        u=tn-(bounds[i]+s["tp"])
        if not(-.85<u<1.0):continue
        x0=WX+(r[0]-bx[0])*sx;y0=WY+BH+(r[1]-bx[1])*sx;x1=x0+r[2]*sx;y1=y0+r[3]*sx;X,Y=(x0+x1)/2,(y0+y1)/2
        ah=ease((u+.1)/.2)*(1-ease((u-.5)/.5))
        if ah>0:d.rounded_rectangle([x0-7,y0-7,x1+7,y1+7],radius=12,outline=GOLD+(int(255*ah),),width=4)
        if 0<=u<.6:
            rr=14+u/.6*64;d.ellipse([X-rr,Y-rr,X+rr,Y+rr],outline=GOLD+(int(235*(1-u/.6)),),width=6)
        pa=1-ease((u-.45)/.4)
        if pa>0:
            q=ease((u+.85)/.75);px,py=lerp(X+190,X+2,q),lerp(Y+140,Y+2,q);k=1.15*(.86 if -.06<u<.14 else 1)
            d.polygon([(px+a*k,py+b*k) for a,b in CUR],fill=(255,255,255,int(255*pa)),outline=(35,22,16,int(255*pa)),width=2)
g=Image.new("RGB",(1,H))
for y in range(H):g.putpixel((0,y),tuple(int(lerp(a,b,y/(H-1))) for a,b in zip((78,34,21),(40,17,10))))
BASE=g.resize((W,H));lanes=Image.new("L",(W+120,H+120),0);ld=ImageDraw.Draw(lanes)
for x in range(-H-120,W+120,60):ld.line([(x,0),(x+H+120,H+120)],fill=14,width=2)
SHD=BASE.copy();sm=Image.new("L",(W,H),0);ImageDraw.Draw(sm).rounded_rectangle([WX,WY+22,WX+CW,WY+BH+CH+22],radius=RAD,fill=150)
SHD.paste((0,0,0),(0,0),sm.filter(ImageFilter.GaussianBlur(28)))
WMASK=Image.new("L",(CW,BH+CH),0);ImageDraw.Draw(WMASK).rounded_rectangle([0,0,CW-1,BH+CH-1],radius=RAD,fill=255)
FB,FR,FT,FS,FU=font(22),font(22,False),font(124),font(46),font(40);BARS={}
def bar(path):
    if path not in BARS:
        b=Image.new("RGB",(CW,BH),(248,241,234));d=ImageDraw.Draw(b)
        d.rounded_rectangle([CW/2-360,7,CW/2+360,BH-7],radius=14,fill=(236,226,216));d.ellipse([CW/2-340,15,CW/2-328,27],fill=(122,160,110))
        host="podiumcall.vercel.app";x=CW/2-318
        d.text((x,BH/2),host,font=FB,fill=(70,48,38),anchor="lm");d.text((x+FB.getlength(host),BH/2),path,font=FR,fill=(150,118,100),anchor="lm");BARS[path]=b
    return BARS[path]
def bgf(tn,shadow):
    fr=(SHD if shadow else BASE).copy();o=int(tn*18)%60;fr.paste((255,236,214),(0,0),lanes.crop((o,o,o+W,o+H)));return fr
def main(tn):
    fr=bgf(tn,True);c,i,bx=content_at(tn);win=Image.new("RGB",(CW,BH+CH));win.paste(bar(SC[i]["p"]),(0,0));win.paste(c,(0,BH))
    fr.paste(win,(WX,WY),WMASK);overlay(fr,tn,bx);return fr
def card(tn,title,sub,sf,ta,sa):
    fr=bgf(tn,False).convert("RGBA");o=Image.new("RGBA",(W,H),(0,0,0,0));d=ImageDraw.Draw(o)
    d.text((W/2,470-(1-ta)*24),title,font=FT,fill=(251,240,226,int(255*ta)),anchor="mm");d.text((W/2,590-(1-sa)*14),sub,font=sf,fill=(236,196,132,int(255*sa)),anchor="mm")
    return Image.alpha_composite(fr,o).convert("RGB")
TOTAL=INTRO+ENDN+OUTRO
def frame(t):
    tn=t-INTRO
    if tn<0:
        c=card(tn,"PodiumCall",SUB[L],FS,ease(t/.5),ease((t-.25)/.5));w=ease((t-(INTRO-.6))/.6)
        return Image.blend(c,main(0.0),w) if w>0 else c
    if tn<=ENDN:return main(tn)
    u=tn-ENDN;return Image.blend(main(ENDN),card(tn,"PodiumCall","podiumcall.vercel.app",FU,1,ease((u-.3)/.5)),ease(u/.6))
WEAK={"the","a","an","our","to","of","in","at","and","or","is","are","their","if","not","each","its","any","who","that","on","for","by","with","what","we","will","you","le","la","les","de","du","des","et","ou","un","une","sa","ses","son","qui","que","pour","dans","sur","par","au","aux","ce","se","vous","notre","d","l","n","qu"}
def weak(w):return norm(w.replace("’","'").split("'")[-1]) in WEAK
CF=font(44);MAXW=1440
START={"en":{"at","using","to","for","with","and","but","or","before","after","from","even","when","while","who","what","which","that","if","so","because","in","on","by","than"},"fr":{"à","avant","après","avec","selon","pour","et","en","dans","depuis","qui","que","quand","même","mais","ou","sur","par"}}[L]
def wid(i,j):return CF.getlength(" ".join(disp[i:j]))
chunks,c0=[],0
for i,w in enumerate(disp):
    if re.search(r"[.?!]$",w) or i==len(disp)-1 or st[i+1]-en[i]>.6:chunks.append((c0,i+1));c0=i+1
def split(a,b):
    tot=wid(a,b);INF=float("inf")
    best=None;k0=max(1,int(-(-tot//MAXW)))
    for k in range(k0,min(k0+(2 if k0>1 else 1),b-a+1)):
        tgt=tot/k;dp=[[INF]*(b+1) for _ in range(k+1)];bk=[[0]*(b+1) for _ in range(k+1)];dp[0][a]=0.0
        for m in range(1,k+1):
            for j in range(a+1,b+1):
                for i in range(a,j):
                    if dp[m-1][i]==INF or wid(i,j)>MAXW:continue
                    c=dp[m-1][i]+((wid(i,j)-tgt)/200)**2+(25 if j-i==1 else 0)
                    if j<b:c+=(-8 if re.search(r"[,:;]$",disp[j-1]) else (40 if weak(disp[j-1]) else 0))-(4 if re.sub(r"[^\w'’-]","",disp[j].lower()) in START else 0)
                    if c<dp[m][j]:dp[m][j],bk[m][j]=c,i
        if dp[k][b]<INF and(best is None or dp[k][b]+12*k<best[0]):
            out,j=[],b
            for m in range(k,0,-1):out.insert(0,list(range(bk[m][j],j)));j=bk[m][j]
            best=(dp[k][b]+12*k,out)
    return best[1] if best else [list(range(a,b))]
groups=[g for a,b in chunks for g in split(a,b)]
segs=[[st[g[0]]+INTRO,en[g[-1]]+INTRO+.2," ".join(disp[j] for j in g)] for g in groups]
for k in range(len(segs)-1):segs[k][1]=min(max(segs[k][1],segs[k][0]+.7),segs[k+1][0]-.02)
def tsf(t):return f"{int(t//3600)}:{int(t%3600//60):02d}:{t%60:05.2f}"
with open(f"{OUT}/cap_dry.ass" if os.environ.get("DRY") else f"{OUT}/cap.ass","w",encoding="utf-8") as f:
    f.write(f"[Script Info]\nScriptType: v4.00+\nPlayResX: {W}\nPlayResY: {H}\nWrapStyle: 0\nScaledBorderAndShadow: yes\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Cap,Metropolis,44,&H00FFFFFF,&H00FFFFFF,&H00140A06,&H80000000,-1,0,0,0,100,100,0,0,1,3,1,2,200,200,44,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n")
    for a,b,x in segs:f.write("Dialogue: 0,"+tsf(a)+","+tsf(b)+",Cap,,0,0,0,,{\\fad(160,120)}"+x+"\n")
if os.environ.get("DRY"):
    for a,b,x in segs:print(f"{a:6.2f}-{b:6.2f} {CF.getlength(x):5.0f}px | {x}")
    print(len(segs),"captions");sys.exit(0)
if os.environ.get("FRAMES"):
    ts=[INTRO+bounds[j]+o for j in range(1,len(SC)) if SC[j]["e"]=="scroll" for o in (-.16,0,.16)]
    sheet=Image.new("RGB",(1920,360*((len(ts)+2)//3)))
    for q,t in enumerate(ts):sheet.paste(frame(t).resize((640,360)),((q%3)*640,(q//3)*360))
    sheet.save(f"{OUT}/frames.jpg",quality=88);print("frames at",[round(t,2) for t in ts]);sys.exit(0)
base=f"{OUT}/base.mp4";ms=int(INTRO*1000)
if os.environ.get("REBURN"):print("reburn: reusing",base)
else:
  enc=subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","-","-i",f"{L}.mp3","-filter_complex",f"[1:a]adelay={ms}:all=1,apad[a]","-map","0:v","-map","[a]","-t",f"{TOTAL:.3f}","-c:v","libx264","-preset","veryfast","-crf","16","-pix_fmt","yuv420p","-c:a","aac","-b:a","160k",base],stdin=subprocess.PIPE)
  for n in range(int(round(TOTAL*FPS))):enc.stdin.write(frame(n/FPS).tobytes())
  enc.stdin.close();enc.wait()
  if enc.returncode:print("encode failed");sys.exit(1)
final=f"{OUT}/final.mp4"
run(["ffmpeg","-v","error","-y","-i",base,"-vf",f"ass={OUT}/cap.ass"+(",scale="+os.environ["SCALE"]+":-2:flags=lanczos" if os.environ.get("SCALE") else ""),"-c:v","libx264","-preset","slow","-tune","animation","-crf",os.environ.get("CRF","27"),"-pix_fmt","yuv420p","-c:a","aac","-b:a","128k","-movflags","+faststart",final])
run(["ffmpeg","-v","error","-y","-ss",f"{INTRO+2.4:.2f}","-i",base,"-frames:v","1","-vf","scale=1280:-2:flags=lanczos","-q:v","4",f"{OUT}/poster.jpg"])
tp=lambda i:INTRO+bounds[i]+SC[i]["tp"]
times=[INTRO+bounds[8],INTRO+bounds[5],INTRO+bounds[1],INTRO+bounds[2]+.05,tp(3)-.35,tp(3)+.3,tp(5)-.3,tp(5)+1.4,tp(6)+1.4,tp(8)-.2,tp(8)+1.4,TOTAL-.6]
sheet=Image.new("RGB",(1920,1440))
for q,t in enumerate(times):
    p=f"/tmp/{L}{q}.jpg";run(["ffmpeg","-v","error","-y","-ss",f"{t:.2f}","-i",final,"-frames:v","1",p]);sheet.paste(Image.open(p).resize((640,360)),((q%3)*640,(q//3)*360))
sheet.save(f"{OUT}/qa.jpg",quality=85)
print(f"RENDERED {final} {TOTAL:.2f}s {os.path.getsize(final)//1024} KB in {time.time()-T0:.0f}s | screens {[round(b,2) for b in bounds]} | presses {[round(s.get('tp',0),2) for s in SC]} | {len(segs)} captions | qa at {[round(t,1) for t in times]}")
