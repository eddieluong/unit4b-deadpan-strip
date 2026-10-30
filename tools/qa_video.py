"""Automatic part of the QA checklist (styles/deadpan-strip/QA.md) for a rendered short.

    python tools/qa_video.py episodes/10-we-missed-you/film/out/Tap01-we-missed-you.mp4 [--punch 30.4]

Reports:
  - duration (information only — length is free; pacing matters, see PREPRODUCTION.md §1 #16) and, with --punch, where the punchline falls (target 70–85 %)
  - static stretches >= 3 s in the art area. Frames 1 s apart are compared after a 5x5 block blur, because the
    hand-drawn line boil changes every frame and would otherwise count as motion.
  - mean level of the first 1.8 s (a near-silent opening loses autoplay viewers; aim above about -30 dBFS)
  - integrated loudness and true peak (target -14 LUFS, true peak <= -1.2 dB)
Needs ffmpeg and numpy. Exit code 1 if a hard target fails.
"""
import argparse, json, subprocess, sys
import numpy as np


def run(cmd):
    return subprocess.run(cmd, capture_output=True, check=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('video'); ap.add_argument('--punch', type=float, help='punchline time in seconds')
    ap.add_argument('--still-threshold', type=float, default=2.0)
    a = ap.parse_args()
    fails = []

    dur = float(json.loads(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', a.video]).stdout)['format']['duration'])
    print(f'duration      {dur:5.1f} s   (info; length is free)')
    if a.punch:
        pos = a.punch / dur * 100
        print(f'punchline     {pos:5.1f} %   (target 70–85)'); fails += ['punch position'] if not 70 <= pos <= 85 else []

    # static stretches: 4 fps grey 135x240, art area only (skip the title band and the caption band)
    raw = run(['ffmpeg', '-v', 'error', '-i', a.video, '-vf', 'fps=4,scale=135:240,format=gray', '-f', 'rawvideo', '-']).stdout
    f = np.frombuffer(raw, np.uint8).reshape(-1, 240, 135).astype(float)[:, 25:190, 5:130]
    b = f[:, :165, :125].reshape(len(f), 33, 5, 25, 5).mean(axis=(2, 4))
    still = np.abs(b[4:] - b[:-4]).mean(axis=(1, 2)) < a.still_threshold
    runs, s = [], None
    for i, v in enumerate(list(still) + [False]):
        if v and s is None: s = i
        if not v and s is not None:
            if (i - s) / 4 + 1 >= 3: runs.append((s / 4, i / 4 + 1))
            s = None
    print('static >= 3 s', ', '.join(f'{x:.1f}–{y:.1f}' for x, y in runs) or 'none')
    fails += ['static stretch'] if runs else []

    # first 1.8 s level
    pcm = np.frombuffer(run(['ffmpeg', '-v', 'error', '-i', a.video, '-t', '1.8', '-ac', '1', '-ar', '16000', '-f', 's16le', '-']).stdout, np.int16) / 32768
    lvl = 20 * np.log10(np.sqrt(np.mean(pcm ** 2)) + 1e-9)
    print(f'first 1.8 s   {lvl:5.1f} dBFS (aim above about -30)')

    # loudness
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', a.video, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    j = json.loads(out[out.rindex('{'):out.rindex('}') + 1])
    i_lufs, tp = float(j['input_i']), float(j['input_tp'])
    print(f'loudness      {i_lufs:5.1f} LUFS, true peak {tp:.1f} dB (target -14 ±0.5, <= -1.2)')
    fails += ['loudness'] if abs(i_lufs + 14) > 0.5 or tp > -1.2 else []

    print('RESULT', 'PASS' if not fails else 'FAIL: ' + ', '.join(fails))
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
