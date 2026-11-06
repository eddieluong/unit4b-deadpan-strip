import json, os, subprocess
import numpy as np, soundfile as sf
H = os.path.dirname(os.path.abspath(__file__)); SR = 24000
def w(i): return sf.read(f'{H}/voice/{i}.wav')[0]
bleep = (0.35*np.sin(2*np.pi*1000*np.arange(int(.6*SR))/SR)).astype(np.float32)
# (kind, id/dur, gap after) ; silent rows = their own duration
seq = [('v','16_s01',.45),('v','16_s02',.3),('v','16_s03',.6),('s',.8),('v','16_s04',.6),('v','16_s05',.35),('v','16_s06',.35),
 ('v','16_s07',.45),('v','16_s08',0),('b',),('s',1.5),('v','16_s10',.35),('v','16_s11',.45),('v','16_s12',.8),('s',1.2),
 ('v','16_s13',.7),('v','16_p14',0)]
parts, t, marks = [], 0, {}
for it in seq:
    if it[0] == 'v':
        y = w(it[1]); marks[it[1]] = (round(t,2), round(len(y)/SR,2)); parts += [y, np.zeros(int(it[2]*SR))]; t += len(y)/SR + it[2]
    elif it[0] == 'b': parts.append(bleep); t += .6
    else: parts.append(np.zeros(int(it[1]*SR))); t += it[1]
x = np.concatenate(parts); sf.write(f'{H}/out/preview_raw.wav', x, SR)
json.dump({'total': round(len(x)/SR,2), 'marks': marks}, open(f'{H}/out/preview_marks.json','w'), indent=1)
print(len(x)/SR, marks)
