from PIL import Image, ImageDraw, ImageFont
import glob, shutil
F='/usr/share/fonts/**/DejaVuSans-Bold.ttf'; p=glob.glob(F,recursive=True)[0]
f=ImageFont.truetype(p,40); f2=ImageFont.truetype(p,24)
OUT='../release/'
big_w=480; big_h=int(big_w*1920/1080); sm_w=150; sm_h=int(sm_w*1920/1080)
pad=30; lab=60; W=pad+3*(big_w+pad); H=lab+big_h+pad+sm_h+pad+40
sh=Image.new('RGB',(W,H),(245,245,245)); d=ImageDraw.Draw(sh)
for i,k in enumerate('ABC'):
    im=Image.open(f'thumbs/thumb_{k}.png').convert('RGB'); im.save(f'{OUT}thumb_{k}.png'); x=pad+i*(big_w+pad)
    d.text((x,10),f'Option {k}',fill=(0,0,0),font=f)
    sh.paste(im.resize((big_w,big_h),Image.LANCZOS),(x,lab))
    sh.paste(im.resize((sm_w,sm_h),Image.LANCZOS),(x,lab+big_h+pad))
    d.text((x+sm_w+15,lab+big_h+pad+sm_h//2-15),'phone size',fill=(90,90,90),font=f2)
sh.save(OUT+'thumbsheet.png')
