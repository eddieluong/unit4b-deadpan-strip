// UNIT 4B — stick cast: simple hand-drawn stick figures, one colour item and one silhouette signature each.
// Drop-in for cast.js / cast_v2.js: same drawCharacter(ctx, id, x, y, scale, pose, opt), EXPRESSIONS and pose parts.
// Built on the v2 pen in hand mode (pressure ink lines that boil with opt.frame). opt.style 'clean' gives crisp lines.
// Local units: x centred, y up from the feet, adults ~100 units tall. pose.sit = true seats a human on a ~22-unit seat. Heads are big (r 15) so faces read on a phone.

import { VPen, face, mix, roundPoly, nameTab, EXPRESSIONS, EXPRESSION_NAMES, ellipsePts, paper, panel, PAPER } from './cast_v2.js';
export { nameTab, EXPRESSIONS, EXPRESSION_NAMES, paper, panel, PAPER };

export const INK = '#2a2230';
const HEAD = '#fffdf8';
export { CAST } from './cast_v2.js';
import { CAST } from './cast_v2.js';

function resolvePose(C, pose) {
  const base = EXPRESSIONS[pose.expr] || {};
  const p = { eyes: 'dot', mouth: 'line', look: 0, arm: 'down', fx: [], ...base, ...pose };
  if (pose.lid === undefined && base.lid === undefined) p.lid = p.eyes === 'dot' ? C.defaultLid : 0;
  return p;
}

// ---------- stick limbs ----------
// Arms bend at an elbow so poses read clearly as silhouettes. sh = shoulder [x, y], k = length factor.
function armPts(sx, [x0, y0], pose = 'down', k = 1) {
  const P = (dx, dy) => [x0 + sx * dx * k, y0 + dy * k];
  switch (pose) {
    case 'point': return [P(0, 0), P(11, 1), P(23, 4)];
    case 'up': return [P(0, 0), P(10, 8), P(13, 22)];
    case 'hips': return [P(0, 0), P(10, -8), P(4, -17)];
    case 'shrug': return [P(0, 0), P(10, -6), P(17, 3)];
    case 'hold': return [P(0, 0), P(8, -11), P(-1, -10)];
    default: return [P(0, 0), P(8.5, -9), P(13, -20)];
  }
}
const smooth = pts => { // turn an elbow polyline into a soft curve through the middle point
  if (pts.length < 3) return pts;
  const [a, b, c] = pts, out = [];
  for (let i = 0; i <= 16; i++) { const t = i / 16, u = 1 - t; out.push([u * u * a[0] + 2 * u * t * (2 * b[0] - (a[0] + c[0]) / 2) + t * t * c[0], u * u * a[1] + 2 * u * t * (2 * b[1] - (a[1] + c[1]) / 2) + t * t * c[1]]); }
  return out;
};
function arms(pen, p, sh, k = 1) {
  for (const [sx, pose] of [[-1, p.armL || p.arm], [1, p.armR || p.arm]]) {
    const pts = smooth(armPts(sx, sh, pose, k)), e = pts[pts.length - 1];
    pen.line(pts, pen.lw);
    pen.dot(e[0], e[1], 1.5 * k, 1.5 * k, INK);
  }
}
function legs(pen, hip, gap = 7, k = 1) {
  if (pen.sit) { // sitting: the body is lowered by pen.sit units; knees push forward and out, shins drop to the real floor
    const f = pen.sit + 0.6;   // the body origin sits pen.sit units below the floor, so the floor is at local +pen.sit
    for (const sx of [-1, 1]) {
      pen.line([[0, hip], [sx * (gap + 4), hip - 3], [sx * (gap + 3), f]], pen.lw);
      pen.line([[sx * (gap + 3), f], [sx * (gap + 3 + 4.5 * k), f - 0.2]], pen.lw);
    }
    return;
  }
  for (const sx of [-1, 1]) {
    pen.line([[0, hip], [sx * gap * 0.5, hip * 0.5], [sx * gap, 0.6]], pen.lw);
    pen.line([[sx * gap, 0.6], [sx * (gap + 4.5 * k), 0.4]], pen.lw);
  }
}
function shadow(ctx, x, y, w, s) { ctx.fillStyle = 'rgba(42,34,48,0.12)'; ctx.beginPath(); ctx.ellipse(x, y, w * s, 2.2 * s, 0, 0, Math.PI * 2); ctx.fill(); }
function headFace(pen, p, hy, r, o = {}) {
  const hp = pen.part(ellipsePts(0, hy, r, r, 56), o.skin || HEAD, { shade: false });
  if (o.before) o.before(hp);
  face(pen, p, { cx: 0, ey: hy + 1, gap: r * 0.38, rx: 1.7 * (o.eyeK || 1), ry: 2.3 * (o.eyeK || 1), skin: o.skin || HEAD, my: hy - r * 0.42, ms: o.ms || 0.8, glasses: o.glasses || 0, nose: false, brow: o.brow, head: { x: 0, y: hy, w: r * 2, h: r * 2 } });
  return hp;
}
// spiky hair cap over the top of a head of radius r
function spikes(r, hy, n = 9, out = 5.5) {
  const pts = [];
  for (let i = 0; i <= n; i++) { const a = Math.PI * (0.08 + 0.84 * i / n), rr = i % 2 ? r + out : r + 0.6; pts.push([Math.cos(a) * rr, hy + Math.sin(a) * rr]); }
  for (let i = 0; i <= 10; i++) { const a = Math.PI * (0.92 - 0.84 * i / 10); pts.push([Math.cos(a) * (r - 4), hy + 2 + Math.sin(a) * (r - 4.5)]); }
  return pts;
}

// ---------- characters ----------
export function drawCharacter(ctx, id, x, y, scale, pose = {}, opt = {}) {
  const C = CAST[id], p = resolvePose(C, pose), hand = (opt.style ?? 'hand') === 'hand';
  const pen = new VPen(ctx, x, y, scale, { lw: opt.lw ?? Math.max(2.4, scale * 0.95), hand, frame: opt.frame ?? 0, seed: opt.seed ?? id.length * 13 });
  shadow(ctx, x, y, C.kind === 'cat' ? 18 : 12, scale);
  if (p.sit && C.kind !== 'cat') { pen.sit = 15; pen.y += pen.sit * scale; }   // pose.sit: seated on something ~22 units high
  ({ steve: drawSteve, nana: drawNana, penny: drawPenny, ted: drawTed, cat: drawCat })[C.kind](pen, C, p, opt.frame ?? 0);
}

// Sweaty Steve — spiky black hair, a mustard hoodie on a stick body. The sweat drop is his whole personality.
function drawSteve(pen, C, p) {
  const hy = 80, r = 15;
  legs(pen, 38);
  pen.part(roundPoly([[-6.5, 62], [6.5, 62], [8, 37], [-8, 37]], 2.5), C.color, { shade: 0.18 });
  pen.part(roundPoly([[-8, 65], [8, 65], [6, 61], [-6, 61]], 2), C.color, { shade: 0.3 });
  pen.line([[-1.6, 61], [-1.8, 55]], pen.lw * 0.5); pen.line([[1.6, 61], [1.8, 55]], pen.lw * 0.5);
  arms(pen, p, [0, 60]);
  headFace(pen, p, hy, r, { before: () => pen.part(spikes(r, hy), C.hair, { shade: false }) });
}

// Nana Knuckles — a towering white beehive with a knitting needle, round glasses, a lavender dress.
function drawNana(pen, C, p) {
  const hy = 70, r = 14;
  legs(pen, 30, 5);
  arms(pen, p, [0, 52], 0.9);
  pen.part(roundPoly([[-3, 56], [3, 56], [12, 28], [-12, 28]], 2.5), C.color, { shade: 0.18 });
  for (let i = -2; i <= 2; i++) pen.dot(i * 1.6, 53.6 - Math.abs(i) * 0.4, 0.8, 0.8, '#fdf9f2');
  pen.line([[5, hy + 30], [12, hy + 39]], pen.lw * 0.8, '#c98f4f'); pen.dot(12.4, hy + 39.6, 1.4, 1.4, '#f2c14e');
  pen.part(ellipsePts(0, hy + 25, 9.5, 15.5, 40), C.hair, { shade: 0.16, shadeColor: '#d6cfe4' });
  pen.line(pen.curve([-3, hy + 14], [3, hy + 25], [-1, hy + 38]), pen.lw * 0.5, '#b9aecd');
  headFace(pen, p, hy, r, { eyeK: 1.25, glasses: 4.6, ms: 0.75 });
}

// Penny Pincher — eight, so a short stick body under a big head; glossy black bob, gold-coin clip, navy blazer, tie.
function drawPenny(pen, C, p) {
  const hy = 58, r = 15;
  legs(pen, 24, 5, 0.8);
  pen.part(roundPoly([[-19, hy - 11], [19, hy - 11], [19, hy + 10], [-19, hy + 10]], 7), C.hair, { shade: false });
  pen.part(roundPoly([[-5.5, 43], [5.5, 43], [7, 24], [-7, 24]], 2), C.color, { shade: 0.18 });
  pen.part([[-2, 43], [2, 43], [0, 38]], '#ffffff', { shade: false, lw: pen.lw * 0.6 });
  pen.part(roundPoly([[-0.9, 42], [0.9, 42], [1.3, 35], [0, 33], [-1.3, 35]], 0.3, 2), INK, { shade: false, lw: pen.lw * 0.4 });
  arms(pen, p, [0, 41], 0.75);
  headFace(pen, p, hy, r, {
    brow: '#5a4f60',
    before: hp => {
      pen.clipTo(hp, () => pen.fill([[-20, hy + 9.5], [20, hy + 9.5], [20, hy + 20], [-20, hy + 20]], C.hair));
      pen.part(ellipsePts(0, hy, r, r, 56), null, { shade: false });
      pen.part(ellipsePts(r - 3.5, hy + 10.5, 2.6, 2.6, 18), '#f2c14e', { shade: 0.25, lw: pen.lw * 0.6 });
    },
  });
}

// Dead Ted — a pale ghost: no legs, his body trails off into a wisp; glasses, grey tufts, sage cardigan, a mug,
// and fluffy pink slippers waiting on the floor underneath.
function drawTed(pen, C, p, frame) {
  const hy = 80, r = 15, bob = Math.sin(frame / 24 * Math.PI) * 0.8;
  for (const sx of [-1, 1]) pen.part(ellipsePts(sx * 5, 2, 4.2, 2.2, 18), C.shoe, { shade: 0.25 });
  pen.y -= bob * pen.s;
  pen.line(pen.curve([0, 40], [-7, 24], [3, 16]), pen.lw, mix(INK, C.skin, 0.35));
  pen.line(pen.curve([3, 16], [8, 11], [2, 9]), pen.lw * 0.8, mix(INK, C.skin, 0.6));
  pen.part(roundPoly([[-6.5, 64], [6.5, 64], [8, 39], [-8, 39]], 2.5), C.color, { shade: 0.18 });
  pen.line([[0, 63], [0, 40]], pen.lw * 0.5); [57, 51, 45].forEach(y => pen.dot(-1.6, y, 0.7, 0.7, '#f4efe4'));
  const armR = p.armR || p.arm, holding = armR === 'down';
  arms(pen, { ...p, armR: holding ? 'hold' : armR }, [0, 61]);
  if (holding) {
    pen.part(roundPoly([[-5.5, 47], [0.5, 47], [0.5, 54], [-5.5, 54]], 1), '#ffffff', { shade: 0.2 });
    pen.line(pen.curve([0.5, 52.6], [3.6, 51], [0.5, 48.6]), pen.lw * 0.6);
  }
  headFace(pen, p, hy, r, {
    skin: C.skin, glasses: 4.8, eyeK: 1.05,
    before: () => { for (const sx of [-1, 1]) for (const [dx, dy, rr] of [[14.5, 3, 2.4], [16, -0.5, 2.4]]) pen.part(ellipsePts(sx * dx, hy + dy, rr, rr, 14), C.hair, { shade: false, lw: pen.lw * 0.7 }); },
  });
  pen.y += bob * pen.s;
}

// Sgt. Snuggles — a stick cat: round charcoal head with ears, a bean body, a curly tail, a fedora and a toothpick.
function drawCat(pen, C, p) {
  const hy = 34, r = 15;
  pen.line(pen.curve([9, 6], [24, 4], [20, 20]), pen.lw);
  pen.part(ellipsePts(0, 11, 11, 11, 36), C.color, { shade: 0.12 });
  for (const sx of [-1, 1]) pen.line([[sx * 4, 4], [sx * 4.5, 0.6], [sx * 7.5, 0.6]], pen.lw * 0.9);
  for (const sx of [-1, 1]) pen.part(roundPoly([[sx * 14.5, hy + 4], [sx * 12, hy + 19], [sx * 4.5, hy + 12]], 1.6), C.color, { shade: false });
  pen.part(ellipsePts(0, hy, r + 1, r, 56), C.color, { shade: 0.1 });
  pen.part(roundPoly([[-10, hy + 12.2], [10.5, hy + 13.4], [9, hy + 15.2], [-9, hy + 14.4]], 1.2), C.hat, { shade: 0.3 });
  pen.part(roundPoly([[-5.8, hy + 14.4], [6, hy + 14.9], [5, hy + 21], [1, hy + 20], [-4.6, hy + 20.8]], 1.4), C.hat, { shade: 0.15 });
  pen.fill([[-5.7, hy + 14.6], [5.9, hy + 15.1], [5.6, hy + 16.6], [-5.5, hy + 16.1]], '#3a2c25');
  for (const sx of [-1, 1]) for (const dy of [0, 2]) pen.line([[sx * 7, hy - 3.5 + dy * 0.3], [sx * 17, hy - 3.2 + dy]], pen.lw * 0.4, '#efe9df');
  pen.dot(0, hy - 2, 1.2, 0.9, '#e89aac');
  face(pen, p, { cx: 0, ey: hy + 2.6, gap: 6.2, rx: 2.2, ry: 2.8, skin: C.color, my: hy - 6, ms: 0.85, cat: true, ink: '#efe9df', eye: '#f6d54a', blush: false, head: { x: 0, y: hy, w: r * 2, h: r * 2 } });
  if (!['O', 'scream', 'grin', 'wide', 'evil', 'wavy_open', 'teeth', 'tongue'].includes(p.mouth)) pen.line([[2, hy - 6.2], [9.5, hy - 8]], pen.lw * 0.6, '#e2c48f');
}
