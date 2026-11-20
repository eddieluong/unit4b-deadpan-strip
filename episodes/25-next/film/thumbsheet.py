from PIL import Image, ImageDraw, ImageFont
import glob
p=glob.glob('/usr/share/fonts/**/DejaVuSans-Bold.ttf',recursive=True)[0]
fb=ImageFont.truetype(p,150); f=ImageFont.truetype(p,38)
OUT='../release/'; TXT={'A':'ONE BULB','B':'ONE BULB','C':None}
ims={}
for k in 'ABC':
    im=Image.open(f'out/tmp/raw_{k}.png').convert('RGB'); d=ImageDraw.Draw(im)
    if TXT[k]:
        w=d.textlength(TXT[k],font=fb); y=1000 if k=='A' else 1300
        d.text((540-w/2,y),TXT[k],font=fb,fill='#ffd84a',stroke_width=14,stroke_fill='#2a2230')
    im.save(f'{OUT}thumb_{k}.png'); ims[k]=im
bw=480;bh=853;pad=30;sh=Image.new('RGB',(pad+3*(bw+pad),bh+110),(245,245,245));d=ImageDraw.Draw(sh)
for i,k in enumerate('ABC'):
    x=pad+i*(bw+pad); d.text((x,10),k,fill=(0,0,0),font=f); sh.paste(ims[k].resize((bw,bh)),(x,60))
sh.save(OUT+'thumbsheet.png')
