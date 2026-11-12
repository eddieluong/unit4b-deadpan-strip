"""2 s contact sheet of out/good_morning_v1.mp4 -> out/sheet_v1.png. Run: python mksheet.py [mp4] [out.png]"""
import subprocess, sys, os, glob
from PIL import Image, ImageDraw, ImageFont
mp4 = sys.argv[1] if len(sys.argv) > 1 else 'out/good_morning_v1.mp4'; out = sys.argv[2] if len(sys.argv) > 2 else 'out/sheet_v1.png'
os.makedirs('out/tmp/sheet', exist_ok=True)
for f in glob.glob('out/tmp/sheet/*.png'): os.remove(f)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp4, '-vf', 'fps=0.5,scale=270:480', 'out/tmp/sheet/f_%02d.png'], check=True)
fs = sorted(glob.glob('out/tmp/sheet/f_*.png')); cols = 7; rows = -(-len(fs) // cols); w, h, pad = 270, 480, 6
sh = Image.new('RGB', (cols * (w + pad) + pad, rows * (h + 30 + pad) + pad), '#222'); d = ImageDraw.Draw(sh); f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 20)
for i, p in enumerate(fs):
    x, y = pad + (i % cols) * (w + pad), pad + (i // cols) * (h + 30 + pad); d.text((x, y + 3), f'{i * 2} s', fill='white', font=f); sh.paste(Image.open(p).convert('RGB'), (x, y + 30))
sh.save(out)
