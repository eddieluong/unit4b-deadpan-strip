// UNIT 4B — cast engine v2: "sticker vector" look for YouTube shorts (Canvas 2D, browser or Node with @napi-rs/canvas).
// Drop-in for cast.js: same drawCharacter(ctx, id, x, y, scale, pose, opt), same EXPRESSIONS and pose parts.
// opt.style: 'hand' (default; pressure ink lines that boil with opt.frame, hatched shadows, grain) or 'clean' (crisp vector).
// What changes: clean vector lines (no wobble), bold outer outline, one flat cel-shade tone + one highlight per part,
// glossy eyes with catchlights, filled sleeves with round hands, shoes, ears, a tiny nose, always-on blush.
// Local character units: x centred, y up from the feet, adults ~100 units tall.

import { PAPER, EXPRESSIONS, EXPRESSION_NAMES, ellipsePts, rrectPts, paper, panel } from './cast.js';
export { PAPER, EXPRESSIONS, EXPRESSION_NAMES, ellipsePts, rrectPts, paper, panel };

export const INK = '#2a2230';
const EYE = '#2a2230', WHITE = '#ffffff', MOUTH = '#5b2633', TONGUE = '#f08a92', GOLD = '#f2c14e';

export const CAST = {
  steve: {
    name: 'Sweaty Steve', short: 'Steve', role: 'The new tenant', color: '#f2b632', skin: '#c98f68', hair: '#2b2220',
    pants: '#3e4f7c', shoe: '#f6f2ea', kind: 'steve', defaultLid: 0,
  },
  nana: {
    name: 'Nana Knuckles', short: 'Nana', role: 'Sweet old lady, 2A', color: '#a07ed6', skin: '#f2caa9', hair: '#f3f0f7',
    pants: '#e9d4c6', shoe: '#4a3a52', kind: 'nana', defaultLid: 0.35,
  },
  penny: {
    name: 'Penny Pincher', short: 'Penny', role: 'The landlord (age 8)', color: '#3f63b8', skin: '#eebd92', hair: '#1d1a22',
    pants: '#eebd92', shoe: '#2a2230', kind: 'penny', defaultLid: 0.5,
  },
  ted: {
    name: 'Dead Ted', short: 'Ted', role: 'Previous tenant (deceased)', color: '#8fb47f', skin: '#dbe7f2', hair: '#b9c6d6',
    shoe: '#f4a9bb', kind: 'ted', defaultLid: 0.6,
  },
  snuggles: {
    name: 'Sgt. Snuggles', short: 'Snuggles', role: 'Building cat, noir narrator', color: '#4a4c60', hat: '#6b5242',
    kind: 'cat', defaultLid: 0.6,
  },
};

// ---------- colour ----------
const hex = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const toHex = a => '#' + a.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
export const mix = (a, b, t) => { const A = hex(a), B = hex(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
export const shadeOf = c => mix(c, '#3a2758', 0.26); // cool, slightly purple shadow keeps colours clean
export const lightOf = c => mix(c, '#ffffff', 0.4);
const isDark = c => { const [r, g, b] = hex(c); return 0.299 * r + 0.587 * g + 0.114 * b < 110; };

// ---------- geometry ----------
function bbox(pts) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}
// Rounds every corner of a polygon with a small quadratic fillet: the single biggest step from "drawn" to "vector".
export function roundPoly(pts, r = 2, k = 5) {
  const n = pts.length, out = [];
  for (let i = 0; i < n; i++) {
    const p = pts[i], a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
    const da = Math.hypot(a[0] - p[0], a[1] - p[1]) || 1, db = Math.hypot(b[0] - p[0], b[1] - p[1]) || 1;
    const ra = Math.min(r, da / 2), rb = Math.min(r, db / 2);
    const s = [p[0] + (a[0] - p[0]) / da * ra, p[1] + (a[1] - p[1]) / da * ra], e = [p[0] + (b[0] - p[0]) / db * rb, p[1] + (b[1] - p[1]) / db * rb];
    for (let j = 0; j <= k; j++) { const t = j / k, u = 1 - t; out.push([u * u * s[0] + 2 * u * t * p[0] + t * t * e[0], u * u * s[1] + 2 * u * t * p[1] + t * t * e[1]]); }
  }
  return out;
}
const curve = (a, c, b, n = 14) => { const p = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; p.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]); } return p; };

// ---------- hand-drawn helpers ----------
function hash(n) { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); }
function vnoise(seed, t) {
  const i = Math.floor(t), f = t - i, u = f * f * (3 - 2 * f);
  return (hash(seed * 17.3 + i) * (1 - u) + hash(seed * 17.3 + i + 1) * u) * 2 - 1;
}
function resample(pts, closed, step) {
  const src = closed ? [...pts, pts[0]] : pts, out = [];
  for (let i = 0; i < src.length - 1; i++) {
    const [ax, ay] = src[i], [bx, by] = src[i + 1], d = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.ceil(d / step));
    for (let j = 0; j < n; j++) out.push([ax + (bx - ax) * j / n, ay + (by - ay) * j / n]);
  }
  if (!closed) out.push(src[src.length - 1]);
  return out;
}

// ---------- the pen ----------
// style 'hand' (default): marker lines that drift and boil (2 drawings at 8 fps), fills that slip off the line,
// hatched shadows and paper grain. style 'clean': crisp sticker vector.
export class VPen {
  constructor(ctx, x, y, s, { lw = 4, ink = INK, hand = true, frame = 0, seed = 1 } = {}) {
    Object.assign(this, { ctx, x, y, s, lw, ink, hand });
    this.seed = seed + (Math.floor(frame / 3) % 2) * 101;
  }
  T([px, py]) { return [this.x + px * this.s, this.y - py * this.s]; }
  // Screen-space points, wobbled along the normal when drawing by hand. Closed shapes use periodic noise (no seam).
  pts(pts, closed, seed) {
    const scr = pts.map(p => this.T(p));
    if (!this.hand || seed === null) return scr;
    const bb = bbox(scr), amp = Math.min(this.s * 0.5, Math.min(bb.w, bb.h) * 0.08 + this.s * 0.08);
    const r = resample(scr, closed, 5), n = r.length, ph = [hash(seed) * 6.3, hash(seed + 1) * 6.3, hash(seed + 2) * 6.3];
    return r.map(([x, y], i) => {
      const a = r[closed ? (i + 1) % n : Math.min(n - 1, i + 1)], b = r[closed ? (i - 1 + n) % n : Math.max(0, i - 1)];
      let nx = -(a[1] - b[1]), ny = a[0] - b[0]; const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
      const t = i / n * Math.PI * 2;
      const o = closed ? amp * (0.55 * Math.sin(2 * t + ph[0]) + 0.3 * Math.sin(3 * t + ph[1]) + 0.15 * Math.sin(9 * t + ph[2]))
                       : amp * (0.75 * vnoise(seed, i * 0.05) + 0.25 * vnoise(seed + 5, i * 0.3));
      return [x + nx * o, y + ny * o];
    });
  }
  P(pts, closed, seed = this.hand ? this.seed++ : null, target = new Path2D()) {
    this.pts(pts, closed, seed).forEach(([x, y], i) => i ? target.lineTo(x, y) : target.moveTo(x, y));
    if (closed) target.closePath();
    return target;
  }
  stroke(path, lw = this.lw, color = this.ink) {
    const c = this.ctx; c.strokeStyle = color; c.lineWidth = lw; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(path);
  }
  // A filled part with one shade tone (light from top-left) and an optional highlight, then the outline.
  // Clean: hard cel tone. Hand: lighter tone covered in diagonal hatching, specks of grain, fill slightly off the line.
  // o: { shade: 0..1 depth (false = flat), hi: true | pts, shadeColor, hiColor, stroke: colour | null, lw }
  part(pts, fill, o = {}) {
    const c = this.ctx, k = this.seed++, path = this.P(pts, true, this.hand ? k : null);
    if (fill) {
      c.save();
      if (this.hand) c.translate(this.s * 0.55, this.s * 0.35); // misregistration: colour slips off the ink
      const bb = bbox(pts), shade = o.shadeColor || shadeOf(fill);
      if (o.shade === false) { c.fillStyle = fill; c.fill(path); }
      else {
        const d = Math.min(bb.w, bb.h) * (o.shade ?? 0.14), moved = pts.map(([x, y]) => [x - 0.75 * d, y + 0.65 * d]);
        c.save(); c.clip(path);
        if (!this.hand) { c.fillStyle = shade; c.fill(path); c.fillStyle = fill; c.fill(this.P(moved, true)); }
        else {
          c.fillStyle = fill; c.fill(path);
          const both = this.P(moved, true, k, this.P(pts, true, k));
          c.save(); c.clip(both, 'evenodd');
          c.fillStyle = mix(fill, shade, 0.45); c.fill(path);
          const [X0, Y0] = this.T([bb.x0, bb.y1]), [X1, Y1] = this.T([bb.x1, bb.y0]), H = Y1 - Y0, step = Math.max(4, this.s * 1.7);
          c.strokeStyle = mix(shade, INK, 0.12); c.lineCap = 'round'; c.lineWidth = Math.max(1.2, this.s * 0.42);
          c.beginPath();
          for (let t = X0 - H, j = 0; t < X1; t += step, j++) { const w = (hash(k + j) - 0.5) * step * 0.6; c.moveTo(t + w, Y1); c.lineTo(t + H + w, Y0); }
          c.stroke(); c.restore();
        }
        if (o.hi && !this.hand) {
          c.fillStyle = o.hiColor || lightOf(fill);
          c.fill(this.P(o.hi === true ? ellipsePts(bb.x0 + bb.w * 0.3, bb.y1 - bb.h * 0.2, bb.w * 0.12, bb.h * 0.07, 20) : o.hi, true));
        }
        c.restore();
      }
      if (this.hand && bb.w * bb.h * this.s * this.s > 400) this.grain(path, bb, k);
      c.restore();
    }
    if (o.stroke !== null) this.outline(pts, true, o.lw ?? this.lw, o.stroke || this.ink, k);
    return path;
  }
  // Ink outline. Clean: an even stroke. Hand: a filled ribbon whose width swells and thins like pen pressure,
  // tapering at the ends of open lines.
  outline(pts, closed, lw, color, k = this.seed++) {
    if (!this.hand) return this.stroke(this.P(pts, closed, null), lw, color);
    this.ribbon(this.pts(pts, closed, k + 50), closed, lw, color, k);
  }
  ribbon(sp, closed, lw, color, k) {
    const n = sp.length, c = this.ctx;
    if (n < 3) { const p = new Path2D(); sp.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); return this.stroke(p, lw, color); }
    const L = [], R = [], tap = Math.min(5, n / 3);
    for (let i = 0; i < n; i++) {
      const a = sp[closed ? (i + 1) % n : Math.min(n - 1, i + 1)], b = sp[closed ? (i - 1 + n) % n : Math.max(0, i - 1)];
      let nx = -(a[1] - b[1]), ny = a[0] - b[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      let w = lw * (0.55 + 0.75 * (vnoise(k + 11, i * 0.07) * 0.5 + 0.5));
      if (!closed) w *= 0.35 + 0.65 * Math.min(1, i / tap, (n - 1 - i) / tap);
      L.push([sp[i][0] + nx * w / 2, sp[i][1] + ny * w / 2]); R.push([sp[i][0] - nx * w / 2, sp[i][1] - ny * w / 2]);
    }
    const p = new Path2D();
    if (closed) { L.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); p.closePath(); R.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); p.closePath(); }
    else { [...L, ...R.reverse()].forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); p.closePath(); }
    c.fillStyle = color; c.fill(p, closed ? 'evenodd' : 'nonzero');
    if (!closed) { for (const q of [sp[0], sp[n - 1]]) { c.beginPath(); c.arc(q[0], q[1], lw * 0.28, 0, Math.PI * 2); c.fill(); } }
  }
  grain(path, bb, k) { // crayon tooth: light and dark specks inside the fill
    const c = this.ctx, [X0, Y0] = this.T([bb.x0, bb.y1]), w = bb.w * this.s, h = bb.h * this.s, n = Math.min(1500, w * h / 45);
    c.save(); c.clip(path);
    for (let i = 0; i < n; i++) {
      const x = X0 + hash(k * 3.1 + i * 1.7) * w, y = Y0 + hash(k * 5.3 + i * 2.9) * h, a = hash(i * 7.7 + k);
      c.fillStyle = a > 0.5 ? 'rgba(255,255,255,0.16)' : 'rgba(40,20,40,0.07)'; c.fillRect(x, y, 1.6, 1.6);
    }
    c.restore();
  }
  fill(pts, color) { const c = this.ctx; c.fillStyle = color; c.fill(this.P(pts, true)); }
  line(pts, lw = this.lw * 0.7, color = this.ink) { this.hand ? this.ribbon(this.pts(pts, false, this.seed++), false, lw * 1.1, color, this.seed) : this.stroke(this.P(pts, false), lw, color); }
  // Thick limb: an ink border stroke under a coloured core stroke. w is in local units.
  tube(pts, w, fill) {
    const path = this.P(pts, false);
    this.stroke(path, w * this.s + this.lw * 2, this.ink);
    this.stroke(path, w * this.s, fill);
  }
  dot(cx, cy, rx, ry, fill) {
    if (this.hand && rx * this.s > 2.5) return this.fill(ellipsePts(cx, cy, rx, ry, 20), fill);
    const c = this.ctx, [x, y] = this.T([cx, cy]); c.beginPath(); c.ellipse(x, y, Math.max(0.1, rx * this.s), Math.max(0.1, ry * this.s), 0, 0, Math.PI * 2); c.fillStyle = fill; c.fill();
  }
  curve(a, c, b, n) { return curve(a, c, b, n); }
  clipTo(path, fn) { const c = this.ctx; c.save(); c.clip(path); fn(); c.restore(); }
}

// ---------- face ----------
function resolvePose(C, pose) {
  const base = EXPRESSIONS[pose.expr] || {};
  const p = { eyes: 'dot', mouth: 'line', look: 0, arm: 'down', fx: [], ...base, ...pose };
  if (pose.lid === undefined && base.lid === undefined) p.lid = p.eyes === 'dot' ? C.defaultLid : 0;
  return p;
}

// F = { cx, ey, gap, rx, ry, skin, my, ms, glasses, head:{x,y,w,h}, ink, eye (cat iris), cat, blush, nose }
export function face(pen, p, F) {
  const ink = F.ink || INK, lw = pen.lw, look = (p.look || 0) * F.rx * 0.75;
  const L = (pts, w = lw * 0.85, col = ink) => pen.line(pts, w, col);
  if (F.blush !== false) {
    const heavy = (p.fx || []).includes('blush') || (p.fx || []).includes('blush_heavy');
    for (const sx of [-1, 1]) pen.dot(F.cx + sx * (F.gap + 1.8), F.ey - F.ry - 2.2, 3.6, 1.9, `rgba(255,112,128,${heavy ? 0.5 : 0.26})`);
  }
  for (const sx of [-1, 1]) {
    const ex = F.cx + sx * F.gap, rx = F.rx, ry = F.ry, ey = F.ey, lx = ex + look;
    const inner = lx - sx * (rx + 1.6), outer = lx + sx * (rx + 1.6), top = ey + ry + 0.5;
    const cover = (yIn, yOut) => { // skin over the top of the eye, cut by a (possibly slanted) lid line
      pen.fill([[outer, top + 1.5], [inner, top + 1.5], [inner, yIn], [outer, yOut]], F.skin);
      L([[outer + sx * 0.5, yOut], [inner - sx * 0.5, yIn]], lw * 0.95);
    };
    const pupil = () => { // the signature eye: a dark glossy oval with two catchlights
      if (F.cat) { pen.part(ellipsePts(lx, ey, rx, ry, 28), F.eye, { shade: 0.15, stroke: INK, lw: lw * 0.7 }); pen.dot(lx + look * 0.2, ey, rx * 0.3, ry * 0.8, INK); }
      else pen.dot(lx, ey, rx, ry, EYE);
      pen.dot(lx + rx * 0.32, ey + ry * 0.36, rx * 0.36, rx * 0.36, WHITE);
      pen.dot(lx - rx * 0.32, ey - ry * 0.42, rx * 0.16, rx * 0.16, WHITE);
    };
    switch (p.eyes) {
      case 'wide': case 'pinpoint': {
        pen.part(ellipsePts(ex, ey, rx * 1.75, ry * 1.4, 28), WHITE, { shade: 0.1, lw: lw * 0.75 });
        const pr = p.eyes === 'wide' ? rx * 0.62 : rx * 0.3, px = ex + look * 0.6;
        pen.dot(px, ey, pr, pr * 1.15, EYE);
        if (p.eyes === 'wide') pen.dot(px + pr * 0.35, ey + pr * 0.45, pr * 0.35, pr * 0.35, WHITE);
        break;
      }
      case 'happy': L(curve([ex - 3.2, ey - 1], [ex, ey + 4.4], [ex + 3.2, ey - 1]), lw * 1.05); break;
      case 'closed': L(curve([ex - 3.2, ey + 0.8], [ex, ey - 1.8], [ex + 3.2, ey + 0.8]), lw * 1.05); break;
      case 'squint': L([[ex + sx * 2.8, ey + 2.6], [ex - sx * 2.2, ey], [ex + sx * 2.8, ey - 2.6]], lw * 1.05); break;
      case 'x': L([[ex - 2.6, ey + 2.6], [ex + 2.6, ey - 2.6]], lw); L([[ex - 2.6, ey - 2.6], [ex + 2.6, ey + 2.6]], lw); break;
      case 'spiral': { const pts = []; for (let t = 0; t < 16; t++) { const a = t * 0.9 * sx, r = 0.24 * t; pts.push([ex + Math.cos(a) * r, ey + Math.sin(a) * r]); } L(pts, lw * 0.75); break; }
      case 'angry': pupil(); cover(top - ry * 1.15, top - ry * 0.25); break;
      case 'sad': pupil(); cover(top - ry * 0.2, top - ry * 1.0); break;
      default: {
        pupil();
        const lid = Math.max(0, Math.min(1, p.lid || 0));
        if (lid > 0.02) { const cut = top - lid * (ry * 2 + 0.5); cover(cut, cut); }
      }
    }
    if (p.brow) { // brows float above the eye (and above glasses) with a clear gap
      const by = ey + Math.max(ry * (p.eyes === 'wide' || p.eyes === 'pinpoint' ? 1.4 : 1), F.glasses || 0) + 2.4;
      const bi = ex - sx * 3.2, bo = ex + sx * 3.2, bw = lw * 1.05, bc = F.brow || ink;
      if (p.brow === 'raised') L(curve([bo, by + 0.8], [ex, by + 3], [bi, by + 0.8]), bw, bc);
      else if (p.brow === 'worried') L([[bo, by], [bi, by + 2]], bw, bc);
      else if (p.brow === 'angry') L([[bo, by + 1.6], [bi, by - 1]], bw, bc);
      else if (p.brow === 'skeptic') sx < 0 ? L(curve([bo, by + 1], [ex, by + 3.6], [bi, by + 1.4]), bw, bc) : L([[bi, by - 0.4], [bo, by - 0.4]], bw, bc);
      else L([[bo, by], [bi, by]], bw, bc);
    }
  }
  if (F.glasses) {
    for (const sx of [-1, 1]) {
      const gx = F.cx + sx * F.gap, gy = F.ey - 0.3, r = F.glasses;
      pen.fill(ellipsePts(gx, gy, r, r * 0.96, 30), 'rgba(190,220,255,0.18)');
      pen.line([[gx - r * 0.55, gy + r * 0.15], [gx - r * 0.15, gy + r * 0.6]], lw * 0.6, 'rgba(255,255,255,0.9)');
      pen.line([[gx - r * 0.6, gy - r * 0.25], [gx - r * 0.45, gy - r * 0.05]], lw * 0.6, 'rgba(255,255,255,0.9)');
      pen.part(ellipsePts(gx, gy, r, r * 0.96, 30), null, { lw: lw * 0.9 });
    }
    L([[F.cx - F.gap + F.glasses, F.ey + 0.2], [F.cx + F.gap - F.glasses, F.ey + 0.2]], lw * 0.85);
  }
  if (!F.cat && F.nose !== false) pen.dot(F.cx, (F.ey - F.ry + F.my) / 2 + 0.4, 1.2, 0.85, mix(F.skin, '#a8484a', 0.35));
  mouth(pen, F.cx, F.my, F.cat && ['line', 'smile'].includes(p.mouth) ? 'cat' : p.mouth, F.ms || 1, ink);
  for (const fx of p.fx || []) symbol(pen, fx, F);
}

function mouth(pen, cx, cy, kind = 'line', k = 1, ink = INK) {
  const lw = pen.lw * 0.95;
  const P = pts => pts.map(([x, y]) => [cx + x * k, cy + y * k]);
  const L = (pts, w = lw) => pen.line(P(pts), w, ink);
  const S = (pts, fill, o = {}) => pen.part(P(pts), fill, { shade: false, lw: lw * 0.85, stroke: ink, ...o });
  const tongue = (y, w = 2.4) => pen.dot(cx, cy + y * k, w * k, 1.2 * k, TONGUE);
  switch (kind) {
    case 'line': L([[-3.4, 0], [3.4, 0]]); break;
    case 'flat_down': L([[-3.4, 0.3], [0, 0], [3.4, -0.9]]); break;
    case 'smirk': L(curve([-3.6, 0], [1, -0.6], [4.4, 1.8])); break;
    case 'smile': L(curve([-4, 1.2], [0, -2.8], [4, 1.2])); break;
    case 'frown': L(curve([-4, -1.2], [0, 2], [4, -1.2])); break;
    case 'wobble': L([[-4.5, 0], [-2.2, 1], [0, -0.6], [2.2, 1], [4.5, 0]]); break;
    case 'small': S(ellipsePts(0, 0, 2.2, 1.7, 18), MOUTH); break;
    case 'O': S(ellipsePts(0, -0.4, 2.4, 3.2, 22), MOUTH); tongue(-2.6, 1.4); break;
    case 'wide': S(ellipsePts(0, -0.6, 4.4, 3.6, 24), MOUTH); tongue(-2.8); break;
    case 'scream': S(ellipsePts(0, -2.4, 4.2, 5.6, 26), MOUTH); tongue(-6.2, 2.6); break;
    case 'grin': {
      const g = P([[-5, 1], [5, 1], ...curve([5, 1], [5, -6.4], [0, -6]).slice(1), ...curve([0, -6], [-5, -6.4], [-5, 1]).slice(1)]);
      const path = pen.part(g, MOUTH, { shade: false, stroke: null });
      pen.clipTo(path, () => { pen.fill(P(rrectPts(0, 0.2, 11, 2.6, 0.6, 3)), WHITE); pen.dot(cx, cy - 5 * k, 3 * k, 1.8 * k, TONGUE); });
      pen.stroke(path, lw * 0.85, ink); break;
    }
    case 'teeth': S(rrectPts(0, 0, 11, 4.8, 2, 4), WHITE); L([[-5, 0], [5, 0]], lw * 0.5); for (const x of [-2.6, 0, 2.6]) L([[x, 2], [x, -2]], lw * 0.5); break;
    case 'tongue': L(curve([-4, 0.6], [0, -1.6], [4, 0.6])); S([[0.6, -0.4], [3.4, -0.2], ...curve([3.4, -0.2], [3.4, -4.6], [2, -4.4]).slice(1), ...curve([2, -4.4], [0.6, -4.2], [0.6, -0.4]).slice(1)], TONGUE); break;
    case 'evil': {
      S([...curve([-6, 1.8], [0, -0.6], [6, 1.8]), ...curve([6, 1.8], [0, -7.4], [-6, 1.8]).slice(1)], WHITE);
      for (const x of [-3, -1, 1, 3]) L([[x, 1.1 - Math.abs(x) * 0.1], [x, -2.8 + Math.abs(x) * 0.5]], lw * 0.45); break;
    }
    case 'wavy_open': S([[-4.4, 0.6], [-2.2, 1.6], [0, 0.6], [2.2, 1.6], [4.4, 0.6], [3.4, -3], [0, -3.8], [-3.4, -3]], MOUTH); break;
    case 'cat': L(curve([-3, 0.6], [-1.5, -1.6], [0, 0.4])); L(curve([0, 0.4], [1.5, -1.6], [3, 0.6])); break;
    default: L([[-3.4, 0], [3.4, 0]]);
  }
}

function symbol(pen, kind, F) {
  const H = F.head, right = H.x + H.w / 2, topY = H.y + H.h / 2, c = pen.ctx, lw = pen.lw;
  const text = (t, x, y, size) => { const [sx, sy] = pen.T([x, y]); c.font = `bold ${size * pen.s}px "Fredoka", "Patrick Hand", sans-serif`; c.lineWidth = lw * 1.4; c.strokeStyle = WHITE; c.lineJoin = 'round'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.strokeText(t, sx, sy); c.fillStyle = INK; c.fillText(t, sx, sy); c.textAlign = 'start'; };
  switch (kind) {
    case 'sweat': {
      const x = right + 1.2, y = H.y + H.h * 0.24;
      pen.part([[x, y + 5.2], ...curve([x, y + 5.2], [x + 3, y + 0.6], [x + 2.6, y - 1]).slice(1), ...curve([x + 2.6, y - 1], [x, y - 4.6], [x - 2.6, y - 1]).slice(1), ...curve([x - 2.6, y - 1], [x - 3, y + 0.6], [x, y + 5.2]).slice(1)], '#8fd3f4', { shade: 0.2, lw: lw * 0.75 });
      pen.dot(x - 1, y - 0.4, 0.8, 1.1, WHITE); break;
    }
    case 'blush_heavy': for (const sx of [-1, 1]) for (const d of [-1.4, 0, 1.4]) pen.line([[F.cx + sx * (F.gap + 1.8) + d - 0.6, F.ey - F.ry - 1.2], [F.cx + sx * (F.gap + 1.8) + d + 0.6, F.ey - F.ry - 3.2]], lw * 0.45, 'rgba(200,60,80,0.7)'); break;
    case 'tears': for (const sx of [-1, 1]) { const x = F.cx + sx * F.gap; pen.tube([[x, F.ey - 1.6], [x + sx * 0.5, F.ey - 6], [x, F.ey - 11]], 1.6, '#8fd3f4'); } break;
    case 'tears_small': for (const sx of [-1, 1]) pen.part(ellipsePts(F.cx + sx * (F.gap + 3.6), F.ey + 1.4, 1.2, 1.6, 14), '#8fd3f4', { shade: false, lw: lw * 0.5 }); break;
    case 'vein': { const x = right + 2.6, y = topY - 3; for (const [dx, dy] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) pen.line(curve([x + dx * 0.7, y + dy * 2.8], [x + dx * 0.6, y + dy * 0.6], [x + dx * 2.8, y + dy * 0.7]), lw * 0.9, '#e0475a'); break; }
    case 'gloom': {
      const y0 = F.ey + Math.max(F.ry, F.glasses || 0) + 1.2;
      for (let i = 0; i < 5; i++) { const x = F.cx - F.gap * 1.1 + i * F.gap * 0.55; pen.line([[x, y0], [x, y0 + 4.5 + (i % 2) * 1.2]], lw * 0.55, 'rgba(70,60,110,0.75)'); }
      break;
    }
    case 'sparkle': { const x = right + 3, y = topY + 1; pen.part(roundPoly([[x, y + 4], [x + 1, y + 1], [x + 4, y], [x + 1, y - 1], [x, y - 4], [x - 1, y - 1], [x - 4, y], [x - 1, y + 1]], 0.4, 2), GOLD, { shade: false, lw: lw * 0.6 }); break; }
    case 'question': text('?', right + 3.5, topY + 2, 11); break;
    case 'zzz': text('z', right + 2, topY - 1, 6); text('Z', right + 5.5, topY + 4, 8.5); break;
    case 'steam': for (const sx of [-1, 1]) { const x = H.x + sx * (H.w / 2 + 3), y = topY - 1; pen.part(ellipsePts(x, y, 2.8, 2.1, 16), WHITE, { shade: 0.2, lw: lw * 0.6 }); pen.part(ellipsePts(x + sx * 2.8, y + 3, 2.1, 1.7, 14), WHITE, { shade: 0.2, lw: lw * 0.6 }); } break;
  }
}

// ---------- limbs: filled sleeves with round hands, short legs with shoes ----------
export function limbPath(sx, [x0, y0], pose = 'down', len = 18) {
  const ax = x0 * sx;
  let end, ctrl;
  switch (pose) {
    case 'point': end = [ax + sx * (len + 3), y0 + 3]; ctrl = [ax + sx * len * 0.5, y0 + 1]; break;
    case 'up': end = [ax + sx * 6, y0 + len]; ctrl = [ax + sx * 9, y0 + len * 0.4]; break;
    case 'hips': end = [ax + sx * 1, y0 - 12]; ctrl = [ax + sx * 9, y0 - 5]; break;
    case 'shrug': end = [ax + sx * 11, y0 + 4]; ctrl = [ax + sx * 9, y0 - 7]; break;
    case 'hold': end = [ax - sx * 5, y0 - len * 0.6]; ctrl = [ax + sx * 5, y0 - len * 0.5]; break;
    default: end = [ax + sx * 3, y0 - len]; ctrl = [ax + sx * 6, y0 - len * 0.45];
  }
  return curve([ax, y0], ctrl, end, 12);
}
function arms(pen, p, C, shoulder, len, w = 4.4, sleeve = C.color, hand = C.skin) {
  for (const [sx, pose] of [[-1, p.armL || p.arm], [1, p.armR || p.arm]]) {
    const pts = limbPath(sx, shoulder, pose, len), end = pts[pts.length - 1];
    pen.tube(pts.slice(0, -2), w, sleeve);
    pen.part(ellipsePts(end[0], end[1], w * 0.62, w * 0.62, 18), hand, { shade: 0.25, lw: pen.lw * 0.85 });
  }
}
function legs(pen, C, gap, top, w = 4.4) {
  for (const sx of [-1, 1]) {
    pen.tube([[sx * gap, top], [sx * gap, 3]], w, C.pants);
    const g = sx * gap; // heel inward, toe outward, mirrored per side
    pen.part(roundPoly([[g - sx * 3, 0.2], [g + sx * 4.6, 0.2], [g + sx * 4.2, 3.6], [g - sx * 2.6, 4.2]], 1.6), C.shoe, { shade: 0.3 });
  }
}
function shadow(ctx, x, y, w, s) { ctx.fillStyle = 'rgba(42,34,48,0.14)'; ctx.beginPath(); ctx.ellipse(x, y, w * s, 2.8 * s, 0, 0, Math.PI * 2); ctx.fill(); }

// ---------- characters ----------
export function drawCharacter(ctx, id, x, y, scale, pose = {}, opt = {}) {
  const C = CAST[id], p = resolvePose(C, pose);
  const hand = (opt.style ?? 'hand') === 'hand';
  const pen = new VPen(ctx, x, y, scale, { lw: opt.lw ?? Math.max(2.2, scale * (hand ? 0.72 : 0.8)), hand, frame: opt.frame ?? 0, seed: opt.seed ?? id.length * 13 });
  shadow(ctx, x, y, { cat: 22, ted: 14, nana: 14, penny: 15, steve: 16 }[C.kind], scale);
  ({ steve: drawSteve, nana: drawNana, penny: drawPenny, ted: drawTed, cat: drawCat })[C.kind](pen, C, p, opt.frame ?? 0);
}

function head(pen, o) { return pen.part(ellipsePts(0, o.hy, o.w / 2, o.h / 2, 64), o.skin, { shade: 0.1 }); }
function ears(pen, o) { for (const sx of [-1, 1]) pen.part(ellipsePts(sx * (o.w / 2 - 0.4), o.hy - 1, 3.2, 4.4, 20), o.skin, { shade: 0.3 }); }
function chibiFace(pen, p, o) {
  face(pen, p, { cx: 0, ey: o.hy + o.h * 0.03, gap: o.w * 0.21, rx: 2.5 * o.eyeK, ry: 3.3 * o.eyeK, skin: o.skin, my: o.hy - o.h * 0.27, ms: o.ms, glasses: o.glasses || 0, brow: o.brow, head: { x: 0, y: o.hy, w: o.w, h: o.h } });
}

// Sweaty Steve — chunky spiky hair, mustard hoodie with strings and a pocket, jeans, white sneakers.
function drawSteve(pen, C, p) {
  legs(pen, C, 4.2, 12);
  pen.part(roundPoly([[-11, 9], [11, 9], [9.6, 27], [-9.6, 27]], 3.5), C.color, { shade: 0.16 });
  pen.line([[-7, 9.6], ...curve([-5.6, 15], [-5, 16.4], [-3.6, 16.4], 4), ...curve([3.6, 16.4], [5, 16.4], [5.6, 15], 4), [7, 9.6]], pen.lw * 0.55, shadeOf(C.color)); // kangaroo pocket
  arms(pen, p, C, [9, 23], 12);
  pen.part(rrectPts(0, 27, 26, 8, 4, 6), C.color, { shade: 0.3 });
  for (const sx of [-1, 1]) { pen.line([[sx * 2.6, 25], [sx * 2.9, 18.5]], pen.lw * 0.55); pen.dot(sx * 2.9, 18.2, 0.9, 0.9, WHITE); }
  const o = { hy: 48, w: 46, h: 42, skin: C.skin, eyeK: 1.3, ms: 1.3 };
  ears(pen, o); const hp = head(pen, o);
  const { hy, w, h } = o;
  const hair = [[-w / 2 - 1, hy + 1], [-w / 2 + 0.5, hy + h * 0.32], [-w * 0.36, hy + h * 0.56], [-w * 0.32, hy + h * 0.72], [-w * 0.15, hy + h * 0.57], [-w * 0.05, hy + h * 0.78], [w * 0.07, hy + h * 0.58], [w * 0.22, hy + h * 0.72], [w * 0.27, hy + h * 0.52], [w * 0.46, hy + h * 0.42], [w / 2 + 1, hy + 1], [w * 0.36, hy + h * 0.2], [w * 0.2, hy + h * 0.3], [w * 0.02, hy + h * 0.22], [-w * 0.2, hy + h * 0.3], [-w * 0.38, hy + h * 0.2]];
  pen.part(roundPoly(hair, 1.2, 3), C.hair, { shade: 0.12, hi: roundPoly([[-w * 0.3, hy + h * 0.42], [-w * 0.12, hy + h * 0.5], [-w * 0.05, hy + h * 0.45], [-w * 0.26, hy + h * 0.38]], 0.8, 3), hiColor: '#5a4a52' });
  chibiFace(pen, p, o);
  void hp;
}

// Nana Knuckles — lavender dress with a lace collar and pearls, a giant white beehive with a knitting needle, big glasses.
function drawNana(pen, C, p) {
  legs(pen, C, 3.4, 7, 3.6);
  pen.part(roundPoly([[-12, 5], [12, 5], [8, 21], [-8, 21]], 3), C.color, { shade: 0.16 });
  arms(pen, p, C, [8, 19], 10, 3.8);
  for (const sx of [-1, 1]) pen.part(roundPoly([[0, 19.5], [sx * 7.5, 21.5], [sx * 5, 16.5]], 1.2), WHITE, { shade: 0.2, lw: pen.lw * 0.8 });
  for (let i = -2; i <= 2; i++) pen.dot(i * 1.9, 17.4 - Math.abs(i) * 0.35 * Math.abs(i), 0.95, 0.95, '#fdf9f2');
  const o = { hy: 39, w: 40, h: 36, skin: C.skin, eyeK: 1.55, ms: 1.2, glasses: 8 };
  pen.line([[7, o.hy + 34], [16, o.hy + 45]], pen.lw * 1.1, '#c98f4f'); pen.part(ellipsePts(16.4, o.hy + 45.6, 1.7, 1.7, 14), GOLD, { shade: 0.3, lw: pen.lw * 0.7 });
  pen.part(ellipsePts(0, o.hy + 30, 14, 21.5, 48), C.hair, { shade: 0.16, shadeColor: '#d6cfe4', hi: ellipsePts(-5, o.hy + 40, 3, 6, 18), hiColor: WHITE });
  pen.line(curve([-6, o.hy + 14], [4, o.hy + 30], [-2, o.hy + 49]), pen.lw * 0.6, '#b9aecd');
  pen.line(curve([5, o.hy + 18], [10, o.hy + 30], [4, o.hy + 42]), pen.lw * 0.6, '#b9aecd');
  ears(pen, o); const hp = head(pen, o);
  pen.clipTo(hp, () => pen.fill([...curve([-o.w / 2 - 1, o.hy + 6], [0, o.hy + 21], [o.w / 2 + 1, o.hy + 6]), [o.w / 2 + 2, o.hy + 30], [-o.w / 2 - 2, o.hy + 30]], C.hair));
  pen.line(curve([-o.w / 2 + 1, o.hy + 6.4], [0, o.hy + 21], [o.w / 2 - 1, o.hy + 6.4]), pen.lw * 0.8);
  pen.stroke(hp);
  chibiFace(pen, p, o);
}

// Penny Pincher — glossy black box bob with a gold-coin hair clip, navy blazer, white collar, tiny tie, gold buttons.
function drawPenny(pen, C, p) {
  legs(pen, C, 3, 6, 3.6);
  const o = { hy: 39, w: 44, h: 42, skin: C.skin, eyeK: 1.35, ms: 1.3, brow: '#5a4f60' };
  pen.part(roundPoly([[-o.w / 2 - 5, o.hy - 13], [o.w / 2 + 5, o.hy - 13], [o.w / 2 + 5, o.hy + 18], [-o.w / 2 - 5, o.hy + 18]], 9, 6), C.hair, { shade: 0.08 });
  pen.part(roundPoly([[-9, 5], [9, 5], [10, 15], [12.5, 18], [-12.5, 18], [-10, 15]], 2.2), C.color, { shade: 0.16 });
  pen.part([[-3, 18], [3, 18], [0, 12.6]], WHITE, { shade: false, lw: pen.lw * 0.7 });
  pen.part(roundPoly([[-1, 17.2], [1, 17.2], [1.5, 11.5], [0, 9.8], [-1.5, 11.5]], 0.4, 2), INK, { shade: false, lw: pen.lw * 0.5 });
  for (const yb of [9, 6.6]) pen.dot(3.6, yb, 0.75, 0.75, GOLD);
  arms(pen, p, C, [10, 16], 9, 3.8);
  head(pen, o);
  const bang = [...ellipsePts(0, o.hy + 1, o.w / 2 + 3.5, o.h / 2 + 3.5, 40, 0, Math.PI), [-o.w / 2 - 3.5, o.hy + 1], [-o.w / 2 - 3.5, o.hy + o.h * 0.25], [o.w / 2 + 3.5, o.hy + o.h * 0.25]];
  pen.part(bang, C.hair, { shade: 0.08 });
  pen.line(ellipsePts(0, o.hy + 1, o.w / 2 - 1, o.h / 2 - 1, 14, Math.PI * 0.58, Math.PI * 0.82), pen.lw * 1.3, '#57525f');
  pen.line(ellipsePts(0, o.hy + 1, o.w / 2 - 1, o.h / 2 - 1, 6, Math.PI * 0.3, Math.PI * 0.4), pen.lw * 1.3, '#57525f');
  const cx = o.w / 2 - 3.5, cy = o.hy + o.h * 0.3;
  pen.part(ellipsePts(cx, cy, 3.4, 3.4, 22), GOLD, { shade: 0.22, lw: pen.lw * 0.75 });
  const c = pen.ctx, [tx, ty] = pen.T([cx, cy - 0.2]);
  c.font = `bold ${4.6 * pen.s}px "Fredoka", sans-serif`; c.fillStyle = '#9a6a12'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('¢', tx, ty); c.textAlign = 'start';
  chibiFace(pen, p, o);
}

// Dead Ted — pale ghost with a soft glow, grey tufts, glasses, sage cardigan, a tea mug, fluffy pink slippers floating below.
function drawTed(pen, C, p, frame) {
  const c = pen.ctx, bob = Math.sin(frame / 24 * Math.PI) * 0.8;
  const [gx, gy] = pen.T([0, 42]), g = c.createRadialGradient(gx, gy, 0, gx, gy, 46 * pen.s);
  g.addColorStop(0, 'rgba(170,220,255,0.35)'); g.addColorStop(1, 'rgba(170,220,255,0)'); c.fillStyle = g; c.fillRect(gx - 46 * pen.s, gy - 46 * pen.s, 92 * pen.s, 92 * pen.s);
  for (const sx of [-1, 1]) {
    pen.part(ellipsePts(sx * 5.2, 2.4, 4.8, 2.4, 20), C.shoe, { shade: 0.25 });
    for (const d of [-2.4, 0, 2.4]) pen.dot(sx * 5.2 + d, 4.2, 1.3, 1, '#fde3ea');
  }
  pen.y -= bob * pen.s;
  pen.part([[-9.5, 13], ...curve([-6, 5], [0, 6], [6, 8]), ...curve([6, 8], [2, 11], [9.5, 13]).slice(1)], C.skin, { shade: 0.2 });
  pen.part(roundPoly([[-10.5, 12], [10.5, 12], [9.4, 27], [-9.4, 27]], 3), C.color, { shade: 0.16 });
  pen.part([[-3.4, 27], [3.4, 27], [0, 19]], '#f1f5f9', { shade: false, lw: pen.lw * 0.7 });
  pen.line([[0, 19], [0, 12.4]], pen.lw * 0.6);
  [17, 14.4].forEach(y => pen.dot(-1.6, y, 0.75, 0.75, '#f4efe4'));
  const armR = p.armR || p.arm;
  arms(pen, { ...p, armR: armR === 'down' ? 'hold' : armR }, C, [9, 25], 11, 4);
  const o = { hy: 48, w: 42, h: 42, skin: C.skin, eyeK: 1.3, ms: 1.25, glasses: 7.4 };
  ears(pen, o); head(pen, o);
  pen.part(ellipsePts(-8, o.hy + 15, 4, 2, 16), WHITE, { shade: false, stroke: null });
  for (const sx of [-1, 1]) for (const [dx, dy, r] of [[18.5, 5, 3], [20.5, 1, 3.2], [18.5, -3, 2.6]]) pen.part(ellipsePts(sx * dx, o.hy + dy, r, r, 16), C.hair, { shade: 0.25 });
  chibiFace(pen, p, o);
  if (armR === 'down') {
    pen.part(roundPoly([[2.6, 13], [8.4, 13], [8.4, 20], [2.6, 20]], 1), WHITE, { shade: 0.2 });
    pen.line(curve([8.4, 18.6], [11.6, 17], [8.4, 14.6]), pen.lw * 0.8);
    pen.fill([[2.6, 16], [8.4, 16], [8.4, 17.4], [2.6, 17.4]], C.color);
    for (const sx of [-1, 1]) pen.line(curve([5.5 + sx, 21.5], [5.5 + sx * 2.4, 24], [5.5 + sx, 26.5]), pen.lw * 0.55, 'rgba(120,140,170,0.7)');
  }
  pen.y += bob * pen.s;
}

// Sgt. Snuggles — round charcoal cat, light muzzle and belly, pink inner ears, a too-small fedora and a toothpick.
function drawCat(pen, C, p) {
  pen.tube(curve([10, 5], [26, 5], [21, 20]), 4, C.color);
  pen.part(ellipsePts(0, 11, 14.5, 11, 40), C.color, { shade: 0.12 });
  pen.part(ellipsePts(0, 10, 7.5, 7, 28), '#6e7188', { shade: false, stroke: null });
  for (const sx of [-1, 1]) pen.part(ellipsePts(sx * 5.4, 1.8, 3.8, 2, 16), '#9b9db0', { shade: 0.25, lw: pen.lw * 0.85 });
  const hy = 34, hw = 44, hh = 36;
  for (const sx of [-1, 1]) {
    pen.part(roundPoly([[sx * 20, hy + 5], [sx * 17, hy + 23], [sx * 6, hy + 15]], 2), C.color, { shade: 0.12 });
    pen.fill(roundPoly([[sx * 17, hy + 8], [sx * 16, hy + 18.5], [sx * 9.5, hy + 14]], 1.4), '#c58ea0');
  }
  pen.part(ellipsePts(0, hy, hw / 2, hh / 2, 64), C.color, { shade: 0.1 });
  for (const sx of [-1, 1]) pen.dot(sx * 3.6, hy - 6.6, 4.4, 3.4, '#6e7188');
  // fedora: brim, crown, band — tilted a little, two sizes too small
  pen.part(roundPoly([[-12, hy + 16.2], [12.5, hy + 17.6], [10.5, hy + 19.6], [-10.5, hy + 18.6]], 1.4), C.hat, { shade: 0.3 });
  pen.part(roundPoly([[-7, hy + 18.6], [7.2, hy + 19.2], [6, hy + 26.4], [1, hy + 25.2], [-5.6, hy + 26.2]], 1.6), C.hat, { shade: 0.15, hi: true });
  pen.fill([[-6.9, hy + 18.8], [7.1, hy + 19.4], [6.8, hy + 21.2], [-6.6, hy + 20.6]], '#3a2c25');
  for (const sx of [-1, 1]) for (const dy of [0, 2.4]) pen.line([[sx * 10, hy - 5 + dy * 0.3], [sx * 23, hy - 4.6 + dy]], pen.lw * 0.5, '#efe9df');
  pen.part(roundPoly([[-1.8, hy - 2.2], [1.8, hy - 2.2], [0, hy - 4.2]], 0.6, 2), '#e89aac', { shade: false, lw: pen.lw * 0.5 });
  face(pen, p, { cx: 0, ey: hy + 2.6, gap: 8.6, rx: 3, ry: 3.8, skin: C.color, my: hy - 8, ms: 1.15, cat: true, ink: '#efe9df', eye: '#f6d54a', blush: false, head: { x: 0, y: hy, w: hw, h: hh } });
  if (!['O', 'scream', 'grin', 'wide', 'evil', 'wavy_open', 'teeth', 'tongue'].includes(p.mouth)) pen.line([[2.6, hy - 8.2], [12.5, hy - 10.6]], pen.lw * 0.8, '#e2c48f');
}

// ---------- labels ----------
export function nameTab(ctx, x, y, id, size = 30) {
  const C = CAST[id]; ctx.font = `600 ${size}px "Fredoka", "Patrick Hand", sans-serif`;
  const tw = ctx.measureText(C.name).width, pw = tw + size * 1.0, ph = size * 1.45;
  ctx.fillStyle = C.color; ctx.strokeStyle = INK; ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.roundRect(x, y, pw, ph, ph / 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = isDark(C.color) ? '#ffffff' : INK; ctx.textBaseline = 'middle'; ctx.fillText(C.name, x + size * 0.5, y + ph / 2 + 1);
  return pw;
}
