from PIL import Image, ImageDraw, ImageFont
import subprocess,os
os.makedirs('stills',exist_ok=True)
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','/home/honglv/Documents/Code/unit4b-deadpan-strip/channel/release/tap07/Tap07-last-day-on-earth.mp4','-frames:v','1','stills/tap07_frame0.png'],check=True)
items=[('Tập 7 (old)','tap07_frame0'),('1 frame 1 (day)','still1'),('2 peak','still2'),('3 punch','still3')]
w=470;h=836;pad=10;lab=46
sheet=Image.new('RGB',(len(items)*(w+pad)+pad,h+lab+pad),'#222')
d=ImageDraw.Draw(sheet)
try: f=ImageFont.truetype('fonts/../../16-last-day-on-earth/film/fonts/x',24)
except: 
    import glob
    c=glob.glob('/usr/share/fonts/**/DejaVuSans.ttf',recursive=True); f=ImageFont.truetype(c[0],24)
for i,(l,n) in enumerate(items):
    im=Image.open(f'stills/{n}.png').convert('RGB').resize((w,h)); x=pad+i*(w+pad)
    sheet.paste(im,(x,lab)); d.text((x,8),l,fill='white',font=f)
sheet.save('stills/keysheet_v2.png'); print(sheet.size)
