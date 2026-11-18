from PIL import Image
im=[Image.open(f'stills/{n}.png').convert('RGB') for n in ('still_1_hook','still_2_climax','still_3_punch')]
w,h=540,960; tw,th=216,384
S=Image.new('RGB',(w*3+40,h+20+th),'white')
for i,m in enumerate(im): S.paste(m.resize((w,h)),(i*(w+20),0))
for i,m in enumerate(im): S.paste(m.resize((tw,th)),(i*(tw+20),h+20))   # phone-size copies
S.save('out/stills_sheet.png')
