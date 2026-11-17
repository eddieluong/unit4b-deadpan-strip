from PIL import Image
im=[Image.open(f'stills/{n}.png').convert('RGB') for n in ('still_1_hook','still_2_climax','still_3_punch')]
w,h=540,960; S=Image.new('RGB',(w*3+40,h+30+384),'white')
for i,m in enumerate(im): S.paste(m.resize((w,h)),(i*(w+20),0))
S.paste(im[0].resize((216,384)),(0,h+20)) if False else None
t=im[0].resize((216,384)); S.paste(t,(0,h+20))
S.save('out/stills_sheet.png')
