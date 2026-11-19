from PIL import Image, ImageDraw, ImageFont
import glob
p=glob.glob('/usr/share/fonts/**/DejaVuSans-Bold.ttf',recursive=True)[0]
f=ImageFont.truetype(p,38); f2=ImageFont.truetype(p,22)
OUT='../release/'
SC={'A':'9.0','B':'8.0','C':'8.5'}
big_w=480; big_h=int(big_w*1920/1080); sm_w=150; sm_h=int(sm_w*1920/1080); sq=220
pad=30; lab=60; W=pad+3*(big_w+pad); H=lab+big_h+pad+sm_h+pad+sq+pad
sh=Image.new('RGB',(W,H),(245,245,245)); d=ImageDraw.Draw(sh)
for i,k in enumerate('ABC'):
    im=Image.open(f'thumbs/thumb_{k}.png').convert('RGB'); im.save(f'{OUT}thumb_{k}.png'); x=pad+i*(big_w+pad)
    d.text((x,10),f'{k}  score {SC[k]}/10',fill=(0,0,0),font=f)
    sh.paste(im.resize((big_w,big_h),Image.LANCZOS),(x,lab))
    y=lab+big_h+pad
    sh.paste(im.resize((sm_w,sm_h),Image.LANCZOS),(x,y)); d.text((x+sm_w+15,y+sm_h//2-12),'phone size',fill=(90,90,90),font=f2)
    cy=y+sm_h+pad; c=im.crop((0,420,1080,1500)).resize((sq,sq),Image.LANCZOS)   # 1:1 centre crop (grid/profile view)
    sh.paste(c,(x,cy)); d.text((x+sq+15,cy+sq//2-12),'centre square',fill=(90,90,90),font=f2)
sh.save('thumbs/thumbs_sheet.png'); sh.save(OUT+'thumbsheet.png')
