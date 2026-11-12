#!/bin/sh
# render v1: sh render.sh  (run in film/; logs to out/tmp)
set -e; mkdir -p out/tmp
node ~/lemo-opuscar/core/render/video.mjs . --fps 30 --workers 4 --size 1080x1920 --out out/silent.mp4 > out/tmp/render.log 2>&1
HF_HUB_OFFLINE=1 ~/lemo-opuscar/.venv/bin/python mix.py > out/tmp/mix.log 2>&1
sh ~/lemo-opuscar/core/render/mux.sh out/silent.mp4 out/mix.wav out/good_morning_v1.mp4 30 > out/tmp/mux.log 2>&1
~/lemo-opuscar/.venv/bin/python mksheet.py
