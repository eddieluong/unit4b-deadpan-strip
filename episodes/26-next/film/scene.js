// UNIT 4B · 26 "Mosquito" (Tập 17) — FULL FILM, ~27.5 s. Worlds: hookWorld / punchWorld / peakWorld from stills.js (approved stills) + wide bedroom `room()`.
// Timings: voice/film_timeline.json (retime.py). Punch s8b at 22.7 (82.5 %). Beats are listed in build().
import { paper, panel, drawCharacter } from './lib/cast_stick.js';
import { roundPoly, ellipsePts } from './lib/cast_v2.js';
import { boilFrame, ease } from './lib/motion.js';
import { W, H, ctx, INK, spen, text, strokedText, glowBlob, armTube, steve, MUSTARD, SK, hash, roomWall, moonGlow, lampGlow, windowFrame, curtains, lamp, clock, moth, mosquito, bzz, swarm, darkCloud, slipper, blanket, pillow, poly } from './room.js';
import { hookWorld, punchWorld, title, TITLE } from './stills.js';

const PL_Y = 1500;
let TL = null, DUR = 27.5, LN = {};
const lerp = (a, b, k) => a + (b - a) * k;
const clamp01 = k => Math.max(0, Math.min(1, k)), seg = (t, a, b) => clamp01((t - a) / (b - a));
const eo = ease.out, eio = ease.inOut, eb = ease.outBack;
const kf = (t, ks, ez = eio) => { if (t <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) if (t < ks[i + 1][0]) return lerp(ks[i][1], ks[i + 1][1], ez(seg(t, ks[i][0], ks[i + 1][0]))); return ks[ks.length - 1][1]; };
function cam(zoom, fx, fy, fn, dx = 0, dy = 0) { ctx.save(); ctx.translate(540 + dx, 960 + dy); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore(); }
const shake = (t, amp, hz = 31) => [amp * Math.sin(t * hz * 1.3), amp * Math.cos(t * hz)];
const talking = (id, t) => { const l = LN[id]; return !!l && t >= l.start && t <= l.end; };
const chat = (t, hz = 10) => Math.floor(t * hz) % 2 === 0;
const mouthFor = (id, t, open = 'small') => talking(id, t) ? (chat(t, 9) ? open : 'line') : 'line';

// ---------- key times ----------
const LAMP_ON1 = 6.2, LAMP_OFF1 = 8.74, LAMP_ON2 = 10.6, LAMP_OFF2 = 24.9;
const SLAP = 9.4, WIN = 13.1, STABS = [18.42, 18.78, 19.12], PUNCH = 22.7, SWARM0 = 21.4, LOOP0 = 26.2;
const lampAt = t => (t >= LAMP_ON1 && t < LAMP_OFF1) || (t >= LAMP_ON2 && t < LAMP_OFF2);

// ---------- captions (stroked, y ~1500, never over a face, no name tabs) ----------
function capText(lines, stress) {
  ctx.save(); let size = lines.length > 1 ? 86 : 100; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.font = `600 ${size}px Fredoka`; const widest = Math.max(...lines.map(l => ctx.measureText(l).width)); if (widest > 960) size = Math.floor(size * 960 / widest);
  ctx.font = `600 ${size}px Fredoka`;
  lines.forEach((ln, li) => {
    const ws = ln.split(' '), gap = 22, wd = ws.map(w => ctx.measureText(w).width); let x = 540 - (wd.reduce((a, b) => a + b, 0) + gap * (ws.length - 1)) / 2;
    const y = PL_Y + 40 + (li - (lines.length - 1) / 2) * (size + 8);
    ws.forEach((w, i) => { ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(w, x, y); ctx.fillStyle = stress.some(s => w.startsWith(s)) ? '#ffd84a' : '#fff'; ctx.fillText(w, x, y); x += wd[i] + gap; });
  });
  ctx.restore();
}
const CAPS = {   // id: [lines, stress, hold after voice end]
  s1: [['I can HEAR you.'], ['HEAR'], 0.2], s2: [['One mosquito.', 'One grown MAN.'], ['MAN.'], 0.3],
  s3: [['…Where ARE you?'], ['ARE'], 0.2], s4: [['OW.'], ['OW.'], 0.35],
  s5: [['Okay. Out you GO.'], ['GO.'], 0.25], s7: [['GOT you!'], ['GOT'], 0.3],
  s8b: [['…We’re gonna need', 'a bigger SLIPPER.'], ['SLIPPER.'], 0.6],
};
function captions(t) {
  for (const l of TL.lines) {
    const c = CAPS[l.id]; if (!c) continue;
    if (t >= l.start - 0.03 && t <= l.end + c[2]) { capText(c[0], c[1]); return { id: l.id, text: c[0].join(' '), x0: 40, y0: PL_Y - 60, x1: 1040, y1: PL_Y + 130 }; }
  }
  return null;
}

// =====================================================================================
// WORLD R · the bedroom, wide. Bed at left (Steve), window upper right, bedside table with lamp + clock at right.
// o: lamp (bool), win (0..1 sash), bil, steve {mode:'lie'|'sit'|'stand'|'none', x, pose, hand:[x,y] (raised hand), slip:{rot}, look, blink, ...}, cat (0 closed | 1 open), mos [[x,y,sz,rot,flip]], moths, clock
// =====================================================================================
const BED_X = 330;
function table(t) {
  const p = spen(t, 210, 8);
  p.part(roundPoly([[790, 1215], [1110, 1215], [1110, 1780], [790, 1780]], 16), '#8a6a4a', { shade: 0.2, lw: 8 });
  p.line([[800, 1360], [1100, 1360]], 6, '#5a432e'); ctx.fillStyle = '#d6b58a'; ctx.beginPath(); ctx.arc(945, 1290, 12, 0, 7); ctx.fill();
}
function room(t, o = {}) {
  const on = o.lamp ?? lampAt(t);
  roomWall(t, on ? 1 : 0, -200, 2200);
  if (!on) { moonGlow(840, 520, 800, 0.4); }
  windowFrame(640, 240, 1040, 780, o.win ?? 0, t, { under: () => { if (o.swarmIn) darkCloud(850, 520, 200, 0.8); } });
  curtains(640, 240, 1040, 780, t, o.bil ?? 8);
  table(t); lamp(985, 960, on, t); clock(860, 1160, 0.55, t, o.clock ?? '3:07');
  if (on) { moth(930, 900, t, 22, 1); moth(1040, 1010, t, 20, 2); moth(940, 1060, t, 18, 3); }
  // bed
  const S = o.steve || { mode: 'lie' }, s = 10, X = S.x ?? BED_X, pose = S.pose || {};
  const bed = () => blanket(-60, S.mode === 'lie' ? 1110 : 1180, 800, 1960, t);
  if (S.mode !== 'stand') pillow(BED_X, S.mode === 'lie' ? 1050 : 1020, 600, 300, t);
  if (S.mode === 'stand') bed();
  if (S.mode === 'lie') {
    const hcY = 1010; steve(X + (S.sw ?? 0), hcY + 80 * s, s, { eyes: 'wide', brow: 'worried', mouth: 'line', look: S.look ?? 0.5, fx: ['sweat'], ...pose }, 0, 0, false);
    bed();
    for (const dx of [-150, 150]) { const f = ellipsePts(X + dx, 1135, 36, 33, 20); ctx.fillStyle = SK; ctx.beginPath(); f.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.fill(); spen(t, 68, 6).outline(f, true, 6); }
  } else if (S.mode === 'sit') {
    const hcY = S.hcY ?? 880, Y = hcY + 80 * s, sh = [X - 80, Y - 60 * s], shR = [X + 80, Y - 60 * s];
    steve(X + (S.sw ?? 0), Y, s, { eyes: 'dot', lid: 0.25, brow: 'worried', mouth: 'line', look: S.look ?? 0, fx: ['sweat'], ...pose }, 0, 0, false);
    armTube([sh, [X - 190, Y - 60 * s + 110], [X - 190, 1170]], 54, MUSTARD, 33);
    if (S.hand) { armTube([shR, [(shR[0] + S.hand[0]) / 2 + 60, (shR[1] + S.hand[1]) / 2], S.hand], 54, MUSTARD, 34); }
    else armTube([shR, [X + 190, Y - 60 * s + 110], [X + 190, 1170]], 54, MUSTARD, 34);
    if (S.slap) { const k = S.slap; armTube([sh, [lerp(X - 330, X - 200, k), lerp(900, 1010, k)], [lerp(X - 330, X - 100, k), lerp(900, 880, k)]], 54, MUSTARD, 33); const f = ellipsePts(lerp(X - 330, X - 100, k), lerp(900, 880, k), 46, 42, 20); ctx.fillStyle = SK; ctx.beginPath(); f.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.fill(); spen(t, 68, 6).outline(f, true, 6); }
    bed();
    if (S.slip && S.hand) slipper(S.hand[0] + 20, S.hand[1] - 70, S.slip.rot ?? -0.3, 0.7, t);
  } else if (S.mode === 'stand') {
    const hcY = 430 + (S.dy ?? 0), Y = hcY + 80 * s, sh = [X - 80, Y - 60 * s], shR = [X + 80, Y - 60 * s];
    const wob = S.wob ?? 0;
    steve(X + wob, Y, s, { eyes: 'dot', lid: 0.2, brow: 'angry', mouth: 'line', look: S.look ?? -0.8, fx: ['sweat'], tilt: -4, ...pose }, 0, 0, false);
    armTube([sh, [X - 190, Y - 60 * s + 90], [X - 220, Y - 60 * s + 190]], 54, MUSTARD, 33);
    const hand = S.hand || [X + 180, 300];
    armTube([shR, [(shR[0] + hand[0]) / 2 + 50, (shR[1] + hand[1]) / 2], hand], 54, MUSTARD, 34);
    slipper(hand[0] + 10, hand[1] - 60, S.slipRot ?? -0.9, 0.7, t);
  }
  if (S.mode !== 'none') {
    // Snuggles at the foot of the bed
    const ce = o.cat ?? 0; window.STEVE_SKIN = SK;
    drawCharacter(ctx, 'snuggles', 640, 1600, 7, { eyes: ce > 0.5 ? 'dot' : 'closed', lid: ce > 0.5 ? 0.35 : 0, expr: 'deadpan', fx: [], noShadow: true }, { frame: boilFrame(t) });
  }
  if (o.over) o.over();
}
const mosPath = t => [540 + 360 * Math.sin(t * 1.9), 620 + 230 * Math.sin(t * 2.9 + 1) + 40 * Math.sin(t * 13)];

// ---------- peak ----------
function smackFx(t, ts, x, y, big = 1) {   // impact burst + SMACK text for 0.28 s after ts
  const k = (t - ts) / 0.28; if (k < 0 || k > 1) return;
  const q = spen(t, 71, 9); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; q.line([[x + Math.cos(a) * 110 * big, y + Math.sin(a) * 110 * big], [x + Math.cos(a) * (190 + 40 * (i % 2)) * big, y + Math.sin(a) * (190 + 40 * (i % 2)) * big]], 9, '#ff9a1f'); }
  strokedText('SMACK', x + 40 * big, y - 250 * big, 100 * big, '#fff6dc', 16);
}
const stabK = t => Math.max(...STABS.map(ts => (t >= ts && t < ts + 0.1) ? 1 : 0));

// ---------- shot list ----------
let SHOTS = [];
function build() {
  const hookMouth = t => (talking('s1', t) && chat(t, 10)) ? 'line' : 'line';
  SHOTS = [
    // 1 · HOOK 0–1.4 (frame 1): giant mosquito beside Steve's wide eyes; eyes track it
    [0, t => { cam(kf(t, [[0, 1.0], [1.4, 1.06]], t2 => t2), 540, 1000, () => hookWorld(t, { look: 0.9 - 1.6 * seg(t, 0.5, 1.2), sw: 2 * Math.sin(t * 40) }), ...shake(t, 2.2, 33)); }],
    // 2 · pull-back into the wide room (closed window, clock, alarm)
    [1.4, t => { const k = eio(seg(t, 1.4, 2.4)); const mp = mosPath(t); cam(lerp(1.9, 1.0, k), lerp(380, 540, k), lerp(1000, 960, k), () => room(t, { steve: { mode: 'lie', look: 0.5 - k, sw: 1.5 * Math.sin(t * 40) }, over: () => mosquito(mp[0], mp[1], 60, 0.3, t, { flip: Math.cos(t * 1.9) > 0 ? -1 : 1, k: 3 }) })); }],
    // 3 · s2 Snuggles: one eye opens, the bzz squiggle passes over
    [2.4, t => { const eye = seg(t, 2.9, 3.05) * (1 - seg(t, 3.5, 3.65)); const bx = lerp(-500, 1300, seg(t, 3.0, 3.8));
      cam(kf(t, [[2.4, 1.9], [3.9, 2.2]], t2 => t2), 640, 1560, () => room(t, { steve: { mode: 'lie' }, cat: eye, over: () => { bzz(bx - 200, 1380 + 20 * Math.sin(t * 6), t, 70); mosquito(bx + 300, 1380 + 20 * Math.sin(t * 6), 90, 0.1, t, { flip: -1, k: 5 }); } })); }],
    // 4 · wide, Steve's eyes track the mosquito flying a loop round the room
    [3.9, t => { const mp = mosPath(t), vx = Math.cos(t * 1.9); cam(kf(t, [[3.9, 1.05], [5.3, 1.2]], t2 => t2), 540, 1020, () => room(t, { steve: { mode: 'lie', look: vx > 0 ? 0.9 : -0.9, sw: 1.2 * Math.sin(t * 36) }, over: () => { bzz(mp[0] - 330 * (vx > 0 ? 1 : 0.2), mp[1] + 40, t, 50); mosquito(mp[0], mp[1], 110, 0.2, t, { flip: vx > 0 ? -1 : 1, k: 3 }); } })); }],
    // 5 · his hand reaches the lamp switch, CLICK, light ON at 6.2
    [5.3, t => { const k = eio(seg(t, 5.35, 6.05)), on = t >= LAMP_ON1; cam(kf(t, [[5.3, 1.6], [6.3, 1.9]], t2 => t2), 920, 1060, () => room(t, { steve: { mode: 'none' }, over: () => { const hx = lerp(560, 905, k), hy = lerp(1130, 1190, k); armTube([[-100, 1090], [300, 1110], [hx, hy]], 54, MUSTARD, 35); const f = ellipsePts(hx + 16, hy, 46, 42, 20); ctx.fillStyle = SK; ctx.beginPath(); f.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.fill(); spen(t, 68, 6).outline(f, true, 6); if (on && t < LAMP_ON1 + 0.35) strokedText('CLICK', 760, 880, 70, '#fff6dc', 12); } }), ...shake(t, on && t < LAMP_ON1 + 0.12 ? 6 : 0, 44)); }],
    // 6 · s3 start: lamp ON, the room is empty; Steve sits up, slipper raised, looks left-right
    [6.2, t => { const lk = -0.9 + 1.8 * eio(seg(t, 6.6, 7.1)); cam(kf(t, [[6.2, 1.0], [7.4, 1.18]], t2 => t2), 480, 960, () => room(t, { steve: { mode: 'sit', look: lk, hand: [BED_X + 240, 600], slip: { rot: -0.3 }, pose: { eyes: 'wide', lid: 0, mouth: mouthFor('s3', t), tilt: 5 * lk } }, over: () => { if (t > 7.0) text('?', 640, 640, 150, '#fff6dc', 'Fredoka', 0.2); } })); }],
    // 7 · close-up: his head turns left, right, left (nothing there)
    [7.4, t => { const lk = kf(t, [[7.4, 0.9], [7.75, -0.9], [8.1, 0.9], [8.45, -0.7]], t2 => t2); cam(kf(t, [[7.4, 1.8], [8.6, 2.0]], t2 => t2), BED_X, 880, () => room(t, { steve: { mode: 'sit', look: lk, hand: [BED_X + 240, 600], slip: { rot: -0.3 }, pose: { eyes: 'wide', lid: 0, mouth: mouthFor('s3', t), tilt: 6 * lk, fx: ['sweat'] } } })); }],
    // 8a · LAMP OFF (8.74): his hand slams the switch, CLICK, light flips to night blue
    [8.6, t => { const k = eio(seg(t, 8.6, 8.72)), off = t >= LAMP_OFF1; cam(kf(t, [[8.6, 1.9], [9.0, 2.05]], t2 => t2), 920, 1060, () => room(t, { steve: { mode: 'none' }, over: () => { const hx = lerp(700, 905, k), hy = lerp(1160, 1190, k); armTube([[-100, 1090], [300, 1110], [hx, hy]], 54, MUSTARD, 35); const f = ellipsePts(hx + 16, hy, 46, 42, 20); ctx.fillStyle = SK; ctx.beginPath(); f.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.fill(); spen(t, 68, 6).outline(f, true, 6); if (off && t < LAMP_OFF1 + 0.3) strokedText('CLICK', 760, 880, 70, '#fff6dc', 12); } }), ...shake(t, off && t < LAMP_OFF1 + 0.12 ? 7 : 0, 44)); }],
    // 8b · DARK: bzzz squiggle at his ear, the mosquito dives in close and circles
    [9.0, t => { const k = seg(t, 9.0, 9.4), mx = BED_X - 190 + 60 * k + 30 * Math.sin(t * 24), my = 800 + 60 * Math.sin(t * 17);
      cam(kf(t, [[9.0, 2.0], [9.4, 2.5]], t2 => t2), BED_X, 890, () => room(t, { steve: { mode: 'sit', look: 0.9, hand: [BED_X + 240, 600], slip: { rot: -0.3 }, pose: { eyes: 'wide', lid: 0, mouth: 'teeth', tilt: 6 } }, over: () => { bzz(mx - 90, my + 40, t, 60); mosquito(mx, my, 70 + 90 * k, -0.1, t, { flip: -1, k: 3 }); } }), ...shake(t, 1.5, 40)); }],
    // 9 · SLAP (9.4): he hits his own cheek, star, red handprint, "OW"
    [SLAP, t => { const sl = seg(t, 9.3, 9.42) * (1 - seg(t, 9.8, 10.1)), hp = seg(t, 9.55, 9.75) * (1 - seg(t, 10.4, 10.9)); const lk = 0.0;
      cam(2.2, BED_X - 60, 920, () => room(t, { steve: { mode: 'sit', look: lk, slap: sl, pose: { eyes: t > 9.42 && t < 9.9 ? 'closed' : 'wide', mouth: talking('s4', t) ? 'O' : 'line', brow: 'worried', tilt: 0 } }, over: () => {
        if (hp > 0) { glowBlob(BED_X - 105, 940, 200, `rgba(255,70,50,${0.55 * hp})`); ctx.save(); ctx.globalAlpha = 0.7 * hp; ctx.fillStyle = '#d83a2e'; ctx.beginPath(); ctx.ellipse(BED_X - 105, 960, 52, 60, 0.2, 0, 7); ctx.fill(); for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(BED_X - 150 + i * 28, 895 - (i % 2 ? 0 : 10), 12, 34, -0.3 + i * 0.2, 0, 7); ctx.fill(); } ctx.restore(); }
        const st = seg(t, 9.42, 9.95); if (st > 0 && st < 1) for (let i = 0; i < 3; i++) { const a = i * 2.1 + st * 4, r = 140 + 60 * st; strokedText('★', BED_X - 30 + Math.cos(a) * r, 770 + Math.sin(a) * r * 0.6, 60, '#ffd84a', 8); }
        if (t > 10.1) { const mp = lerp(0, 1, seg(t, 10.1, 10.8)); mosquito(BED_X + 300 + 500 * mp, 700 - 250 * mp, 70, 0.2, t, { flip: -1, k: 3 }); }
      } }), ...shake(t, t > SLAP && t < SLAP + 0.15 ? 14 : 0, 47)); }],
    // 10 · sly: he clicks the lamp back ON (10.6), rubs the cheek, an idea
    [10.9, t => { cam(kf(t, [[10.9, 1.7], [11.9, 1.95]], t2 => t2), BED_X, 900, () => room(t, { steve: { mode: 'sit', look: 0.5, hand: [BED_X - 100, 960], pose: { eyes: 'dot', lid: 0.55, brow: 'skeptic', mouth: 'smirk', fx: ['sweat'], tilt: 3 } } })); }],
    // 11 · s5 "Okay. Out you GO.": he stands on the bed and heads for the window
    [11.9, t => { const k = eio(seg(t, 11.9, 12.9)); cam(kf(t, [[11.9, 1.0], [13.1, 1.35]], t2 => t2), lerp(460, 640, k), lerp(900, 640, k), () => room(t, { steve: { mode: 'stand', x: lerp(330, 470, k), look: 0.9, hand: [lerp(330, 470, k) + 200, lerp(700, 560, k)], slipRot: -1.4, wob: 3 * Math.sin(t * 14), pose: { lid: 0.2, mouth: mouthFor('s5', t), brow: 'skeptic' } } })); }],
    // 12 · WINDOW BANG: sash flung wide, curtains billow, moths at the lamp (plant, wide and clear)
    [WIN, t => { const op = eb(seg(t, WIN, WIN + 0.18)), bil = 170 * seg(t, WIN, WIN + 0.5);
      cam(kf(t, [[WIN, 1.5], [14.5, 1.3]], t2 => t2), 830, 560, () => room(t, { win: op, bil, steve: { mode: 'none' }, over: () => { if (t < WIN + 0.5) strokedText('BANG', 700, 430, 100, '#fff6dc', 16); const hx = 600, hy = 520; armTube([[300, 640], [480, 600], [hx, hy]], 54, MUSTARD, 35); const f = ellipsePts(hx + 20, hy - 6, 44, 40, 20); ctx.fillStyle = SK; ctx.beginPath(); f.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.fill(); spen(t, 68, 6).outline(f, true, 6); } }), ...shake(t, t < WIN + 0.25 ? 9 : 0, 46)); }],
    // 13 · AMBUSH (silent): he stands on the bed, slipper raised, tiny wobble, sweat; the mosquito lands on the wall
    [14.5, t => { cam(kf(t, [[14.5, 1.05], [15.9, 1.25]], t2 => t2), 360, 620, () => room(t, { win: 1, bil: 120 + 40 * Math.sin(t * 5), steve: { mode: 'stand', x: 470, look: -0.9, hand: [470 + 120, 300 + 8 * Math.sin(t * 20)], slipRot: -1.5, wob: 2.5 * Math.sin(t * 17), dy: 6 * Math.abs(Math.sin(t * 6)), pose: { lid: 0.3, brow: 'angry', mouth: 'line' } }, over: () => { const k = seg(t, 14.8, 15.9); const mx = lerp(900, 130, eio(k)) + 25 * Math.sin(t * 15) * (1 - k), my = lerp(430, 620, k) + 60 * Math.sin(t * 9) * (1 - k); mosquito(mx, my, 60, 0.2, t, { flip: 1, k: 3, land: k > 0.97, flap: k > 0.97 ? 0 : 1 }); } })); }],
    // 14 · close-up on the wall: the mosquito lands, rubs its legs; slow push-in
    [15.9, t => { cam(kf(t, [[15.9, 2.0], [17.2, 2.7]], t2 => t2), 170, 640, () => room(t, { win: 1, steve: { mode: 'none' }, over: () => { mosquito(130, 625 + 3 * Math.sin(t * 22), 130, 0.15, t, { flip: 1, k: 3, land: true, flap: 0.25 + 0.0 }); if (t > 16.4) { const q = spen(t, 9, 5); const k = 12 * Math.sin(t * 26); q.line([[110, 690], [95 + k, 740]], 7, INK); } } })); }],
    // 15 · extreme close-up: his eye twitches, sweat drops, the slipper trembles overhead
    [17.2, t => { const tw = (Math.floor(t * 12) % 3 === 0) ? 0.7 : 0.25; cam(kf(t, [[17.2, 2.0], [18.2, 2.5]], t2 => t2), 470, 440, () => room(t, { win: 1, steve: { mode: 'stand', x: 470, look: -0.9, hand: [470 + 120 + 4 * Math.sin(t * 40), 300], slipRot: -1.5, pose: { lid: tw, brow: tw > 0.5 ? 'angry' : 'worried', mouth: 'line', fx: ['sweat'] } } }), ...shake(t, 1.5, 50)); }],
    // 16a · PEAK s7 "GOT you!" smack 1: full-face rage grin, slipper comes down, camera shakes
    [18.2, t => { const k = stabK(t), swing = seg(t, STABS[0] - 0.12, STABS[0]) ; cam(1.5 + 0.06 * k, 440, 480, () => room(t, { win: 1, steve: { mode: 'stand', x: 470, look: -0.9, hand: [lerp(590, 300, swing), lerp(300, 640, swing)], slipRot: lerp(-1.5, 0.3, swing), dy: 12 * swing, pose: { expr: 'furious', eyes: 'angry', brow: 'angry', mouth: 'grin', fx: ['vein', 'sweat'], tilt: -8 } } }), ...shake(t, 16 * k, 47)); }],
    // 16b · wall: smack 2
    [18.6, t => { const k = stabK(t), d = seg(t, STABS[1] - 0.1, STABS[1]); cam(1.9, 220, 650, () => room(t, { win: 1, steve: { mode: 'none' }, over: () => { slipper(lerp(560, 150, d), lerp(500, 640, d), lerp(-0.5, -1.45, d), 0.9, t); smackFx(t, STABS[1], 135, 640, 0.8); } }), ...shake(t, 18 * k, 53)); }],
    // 16c · smack 3, face again, wider
    [18.98, t => { const k = stabK(t), swing = seg(t, STABS[2] - 0.1, STABS[2]); cam(1.35 + 0.05 * k, 420, 560, () => room(t, { win: 1, steve: { mode: 'stand', x: 470, look: -0.9, hand: [lerp(590, 300, swing), lerp(300, 640, swing)], slipRot: lerp(-1.5, 0.3, swing), dy: 12 * swing, pose: { expr: 'furious', eyes: 'angry', brow: 'angry', mouth: 'scream', fx: ['vein', 'sweat'], tilt: -8 } }, over: () => smackFx(t, STABS[2], 150, 640, 0.8) }), ...shake(t, 18 * k, 47)); }],
    // 17 · he peels the slipper off the wall: one squashed dot
    [19.5, t => { const d = eio(seg(t, 19.7, 20.3)); cam(kf(t, [[19.5, 2.4], [20.6, 2.0]], t2 => t2), 220, 650, () => room(t, { win: 1, steve: { mode: 'none' }, over: () => { ctx.fillStyle = '#2f2f3a'; ctx.beginPath(); ctx.arc(130, 640, 12, 0, 7); ctx.fill(); slipper(lerp(150, 520, d), lerp(640, 560, d), lerp(-1.45, -0.5, d), 0.9, t); } })); }],
    // 18 · kisses the slipper, then raises it like a trophy
    [20.6, t => { const kiss = seg(t, 20.7, 20.95) * (1 - seg(t, 21.15, 21.3)), up = eio(seg(t, 21.15, 21.4)); cam(1.5, 470, 420, () => room(t, { win: 1, steve: { mode: 'stand', x: 470, look: 0, hand: [lerp(470 + 40, 470 + 190, up), lerp(lerp(560, 230, kiss), 150, up)], slipRot: lerp(-1.9, -0.6, up), pose: { expr: 'proud', eyes: kiss > 0.3 ? 'closed' : (up > 0.5 ? 'happy' : 'dot'), brow: 'raised', mouth: kiss > 0.3 ? 'small' : 'grin', fx: up > 0.5 ? ['sparkle'] : [] } } })); }],
    // 19 · DREAD: he turns; through the open window the swarm streams in towards the lamp; the room tilts into the cloud
    [SWARM0, t => { const pr = seg(t, SWARM0, 22.5); cam(kf(t, [[SWARM0, 1.0], [PUNCH, 1.35]], t2 => t2), 640, 560, () => room(t, { win: 1, bil: 170 + 30 * Math.sin(t * 9), lamp: lampAt(t) && (Math.floor(t * 14) % 5 !== 0), swarmIn: true, steve: { mode: 'stand', x: 470, look: 0.9, hand: [590, 300], slipRot: -1.4, pose: { eyes: 'dot', lid: 0.1, brow: 'worried', mouth: 'line', fx: ['sweat'], tilt: 6 } }, over: () => { swarm(t, [850, 540], [985, 960], 70, { prog: pr, size: 52, spread: 240, speed: 0.4 }); strokedText('BZZZZZZ', 760, 420, 120, '#fff6dc', 18); } }), ...shake(t, 3, 40)); }],
    // 20 · PUNCH s8b: close-up, swarm shadow over his face, one blink, the slipper droops, hold
    [PUNCH, t => { const bl = (t > 23.75 && t < 23.9), dr = 60 * eio(seg(t, 23.4, 24.2)); cam(kf(t, [[PUNCH, 1.0], [LAMP_OFF2, 1.06]], t2 => t2), 540, 960, () => punchWorld(t, { blink: bl, droop: dr, n: 70, talk: talking('s8b', t) && chat(t, 8) })); }],
    // 21 · BUTTON a: lamp OFF, dark, the swarm hums around his wide eyes
    [LAMP_OFF2, t => { const pr = 1; cam(kf(t, [[LAMP_OFF2, 1.3], [LOOP0, 1.0]], eo), 640, 900, () => room(t, { lamp: false, win: 1, bil: 150 + 30 * Math.sin(t * 9), swarmIn: true, steve: { mode: 'lie', look: 0.9 * Math.sin(t * 6), sw: 2 * Math.sin(t * 40) }, over: () => { swarm(t, [850, 540], [330, 1000], 60, { prog: pr, size: 60, spread: 360, speed: 0.5 }); if (t < LAMP_OFF2 + 0.3) strokedText('CLICK', 760, 880, 70, '#fff6dc', 12); } }), ...shake(t, 2, 40)); }],
    // 22 · LOOP: push-in lands on frame 1 (the one giant mosquito, wide eyes)
    [LOOP0, t => { cam(kf(t, [[LOOP0, 0.9], [DUR, 1.0]], eo), 540, 1000, () => hookWorld(t, { look: 0.9, sw: 2 * Math.sin(t * 40) }), ...shake(t, 2.2, 33)); }],
  ];
}

function render(t) {
  window.T_NOW = t;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none'; ctx.globalAlpha = 1;
  paper(ctx, W, H, 11);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  let k = 0; while (k + 1 < SHOTS.length && SHOTS[k + 1][0] <= t) k++;
  SHOTS[k][1](t);
  ctx.restore();
  if (t < 1.4 || t >= LOOP0) title(TITLE);
  panel(ctx, 6, 6, W - 12, H - 12, 5, null, boilFrame(t));
  const cap = captions(t); window.__texts = cap ? [cap] : [];
}
window.render = render; window.TEXTS = t => { render(t); return window.__texts; };
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) {
    const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f);
  }
  TL = await (await fetch('voice/film_timeline.json')).json();
  LN = Object.fromEntries(TL.lines.map(l => [l.id, l]));
  window.DUR = DUR = TL.total;
  build(); render(0); window.READY = true;
})();
