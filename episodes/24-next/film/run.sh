#!/bin/sh
cd "$(dirname "$0")"; mkdir -p out/tmp stills; node shoot.mjs > out/tmp/shoot.log 2>&1; echo exit=$?; tail -n 8 out/tmp/shoot.log
