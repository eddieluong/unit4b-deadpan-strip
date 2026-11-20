import sys, glob
from PIL import Image, ImageDraw
fs = sorted(glob.glob('out/tmp/f_*.png')); w, h = 300, 533; cols = min(len(fs), 8); rows = -(-len(fs)//cols)
sh = Image.new('RGB', (cols*(w+4), rows*(h+22)), '#222'); d = ImageDraw.Draw(sh)
for i, p in enumerate(fs):
    x, y = (i % cols)*(w+4), (i//cols)*(h+22); d.text((x+3, y+3), p.split('f_')[1][:-4], fill='white'); sh.paste(Image.open(p).convert('RGB').resize((w, h)), (x, y+20))
sh.save('out/tmp/fsheet.png')
