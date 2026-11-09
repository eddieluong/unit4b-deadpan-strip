from PIL import Image, ImageDraw, ImageFont
n=[('1 HOOK','still_1_hook'),('2 CLIMAX','still_2_climax'),('3 PUNCH','still_3_punch')]
w,h=540,960;pad=10;lab=50
sh=Image.new('RGB',(3*(w+pad)+pad,h+lab+pad),'#222');d=ImageDraw.Draw(sh)
f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',26)
for i,(l,x) in enumerate(n):
    sh.paste(Image.open(f'stills/{x}.png').convert('RGB').resize((w,h)),(pad+i*(w+pad),lab));d.text((pad+i*(w+pad),10),l,fill='white',font=f)
sh.save('stills/sheet.png')
