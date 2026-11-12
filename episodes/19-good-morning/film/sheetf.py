"""Contact sheet of snapped frames: python sheetf.py out.png f1.png f2.png ..."""
import sys
from PIL import Image, ImageDraw
o=sys.argv[1]; fs=sys.argv[2:]; w,h=360,640; sh=Image.new('RGB',(len(fs)*(w+6),h+24),'#222'); d=ImageDraw.Draw(sh)
for i,f in enumerate(fs): sh.paste(Image.open(f).convert('RGB').resize((w,h)),(i*(w+6),24)); d.text((i*(w+6)+4,4),f.split('f_')[-1],fill='white')
sh.save(o)
