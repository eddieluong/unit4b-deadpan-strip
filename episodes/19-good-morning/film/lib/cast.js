// Deadpan Strip — cast + drawing engine (Canvas 2D, works in the browser and in Node with @napi-rs/canvas).
// Series: UNIT 4B. Chibi proportions (head ≈ 2/3 of height), simple shapes, one signature per character. Local character units: x centred, y up from the feet. Adults are ~100 units tall. Line width is constant in px.

export const INK = '#2a2422';
export const PAPER = '#f4efe4';

export const CAST = {
  steve: {
    name: 'Sweaty Steve', short: 'Steve', role: 'The new tenant', color: '#e2b23c', skin: '#c98f68', hair: '#2b2220', kind: 'steve', defaultLid: 0,
  },
  nana: {
    name: 'Nana Knuckles', short: 'Nana', role: 'Sweet old lady, 2A', color: '#9b7bc4', skin: '#f0c8a8', hair: '#eeeae2', kind: 'nana', defaultLid: 0.35,
  },
  penny: {
    name: 'Penny Pincher', short: 'Penny', role: 'The landlord (age 8)', color: '#3d5a96', skin: '#e9b98f', hair: '#191616', kind: 'penny', defaultLid: 0.5,
  },
  ted: {
    name: 'Dead Ted', short: 'Ted', role: 'Previous tenant (deceased)', color: '#8aa37b', skin: '#dfe6ee', hair: '#c4ceda', kind: 'ted', defaultLid: 0.6,
  },
  snuggles: {
    name: 'Sgt. Snuggles', short: 'Snuggles', role: 'Building cat, noir narrator', color: '#4a4a54', hat: '#5b4a3f', kind: 'cat', defaultLid: 0.6,
  },
};

// ---------- noise + geometry ----------
function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(seed, t) {
  const i = Math.floor(t), f = t - i, u = f * f * (3 - 2 * f);
  return (hash(seed * 17.3 + i) * (1 - u) + hash(seed * 17.3 + i + 1) * u) * 2 - 1;
}
export function ellipsePts(cx, cy, rx, ry, n = 40, a0 = 0, a1 = Math.PI * 2) {
  const p = [];
  for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  return p;
}
export function rrectPts(cx, cy, w, h, r, k = 8) {
  const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, p = [];
  const corner = (ox, oy, a) => { for (let i = 0; i <= k; i++) { const t = a + Math.PI / 2 * i / k; p.push([ox + Math.cos(t) * r, oy + Math.sin(t) * r]); } };
  corner(x1 - r, y1 - r, 0); corner(x0 + r, y1 - r, Math.PI / 2); corner(x0 + r, y0 + r, Math.PI); corner(x1 - r, y0 + r, Math.PI * 1.5);
  return p;
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
// Maps local units to screen px (y flipped) and draws marker-wobbled, constant-width lines.
export class Pen {
  constructor(ctx, x, y, s, { seed = 1, frame = 0, lw = 3.5 } = {}) {
    Object.assign(this, { ctx, x, y, s, seed, lw });
    this.drawing = Math.floor(frame / 3) % 2; // 2 drawings at 8 fps on a 24 fps timeline
  }
  T([px, py]) { return [this.x + px * this.s, this.y - py * this.s]; }
  path(pts, closed) {
    const scr = resample(pts.map(p => this.T(p)), closed, 10), seed = this.seed + this.drawing * 101, c = this.ctx;
    c.beginPath();
    scr.forEach(([x, y], i) => {
      const a = scr[(i + 1) % scr.length], b = scr[(i - 1 + scr.length) % scr.length];
      let nx = -(a[1] - b[1]), ny = a[0] - b[0]; const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
      const o = vnoise(seed, i * 0.18) * 0.8;
      i ? c.lineTo(x + nx * o, y + ny * o) : c.moveTo(x + nx * o, y + ny * o);
    });
    if (closed) c.closePath();
  }
  shape(pts, fill, stroke = INK, lw = this.lw) {
    const c = this.ctx; this.path(pts, true);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.lineJoin = c.lineCap = 'round'; c.stroke(); }
    this.seed += 7;
  }
  line(pts, lw = this.lw, color = INK) {
    const c = this.ctx; this.path(pts, false);
    c.strokeStyle = color; c.lineWidth = lw; c.lineJoin = c.lineCap = 'round'; c.stroke(); this.seed += 7;
  }
  curve(a, ctrl, b, n = 14) { const p = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; p.push([u * u * a[0] + 2 * u * t * ctrl[0] + t * t * b[0], u * u * a[1] + 2 * u * t * ctrl[1] + t * t * b[1]]); } return p; }
  dot(cx, cy, rx, ry, fill = INK) { const c = this.ctx, [x, y] = this.T([cx, cy]); c.beginPath(); c.ellipse(x, y, rx * this.s, ry * this.s, 0, 0, Math.PI * 2); c.fillStyle = fill; c.fill(); }
}

// ---------- face: an expression system ----------
// A face is built from parts: eyes, lid, brows, mouth and comic symbols (fx). EXPRESSIONS names the useful
// combinations; pose = { expr: 'shocked' } picks one, and any part can still be overridden ({ expr: 'shocked', mouth: 'scream' }).
export const EXPRESSIONS = {
  neutral:     { eyes: 'dot', mouth: 'line' },
  deadpan:     { eyes: 'dot', lid: 0.65, mouth: 'line' },
  side_eye:    { eyes: 'dot', lid: 0.55, look: 0.9, mouth: 'line' },
  smug:        { eyes: 'dot', lid: 0.6, look: 0.3, brow: 'skeptic', mouth: 'smirk' },
  skeptical:   { eyes: 'dot', lid: 0.4, brow: 'skeptic', mouth: 'flat_down' },
  happy:       { eyes: 'happy', mouth: 'smile', fx: ['blush'] },
  grin:        { eyes: 'dot', lid: 0, brow: 'raised', mouth: 'grin' },
  laughing:    { eyes: 'squint', mouth: 'grin', fx: ['tears_small'], arm: 'hold' },
  proud:       { eyes: 'closed', brow: 'raised', mouth: 'smile', fx: ['sparkle'], arm: 'hips' },
  shocked:     { eyes: 'wide', brow: 'raised', mouth: 'O', arm: 'up' },
  horrified:   { eyes: 'pinpoint', brow: 'worried', mouth: 'scream', fx: ['gloom'], arm: 'up' },
  nervous:     { eyes: 'dot', lid: 0, brow: 'worried', mouth: 'teeth', fx: ['sweat'] },
  awkward:     { eyes: 'dot', lid: 0.2, look: -0.7, brow: 'worried', mouth: 'teeth', fx: ['sweat'] },
  embarrassed: { eyes: 'happy', brow: 'worried', mouth: 'wobble', fx: ['blush_heavy', 'sweat'] },
  confused:    { eyes: 'dot', lid: 0, look: 0.4, brow: 'skeptic', mouth: 'wobble', fx: ['question'], arm: 'shrug' },
  sad:         { eyes: 'sad', brow: 'worried', mouth: 'frown' },
  crying:      { eyes: 'closed', brow: 'worried', mouth: 'wavy_open', fx: ['tears'] },
  angry:       { eyes: 'angry', brow: 'angry', mouth: 'frown', fx: ['vein'] },
  furious:     { eyes: 'angry', brow: 'angry', mouth: 'teeth', fx: ['vein', 'steam'], arm: 'hips' },
  disgusted:   { eyes: 'dot', lid: 0.5, brow: 'skeptic', mouth: 'tongue' },
  evil:        { eyes: 'angry', brow: 'angry', mouth: 'evil' },
  dead_inside: { eyes: 'dot', lid: 0.8, mouth: 'line', fx: ['gloom'] },
  sleepy:      { eyes: 'closed', mouth: 'small', fx: ['zzz'] },
  cringe:      { eyes: 'squint', brow: 'worried', mouth: 'teeth', fx: ['sweat'] },
  dizzy:       { eyes: 'spiral', mouth: 'wobble' },
  knocked_out: { eyes: 'x', mouth: 'tongue' },
};
export const EXPRESSION_NAMES = Object.keys(EXPRESSIONS);

function resolvePose(C, pose) {
  const base = EXPRESSIONS[pose.expr] || {};
  const p = { eyes: 'dot', mouth: 'line', look: 0, arm: 'down', fx: [], ...base, ...pose };
  if (pose.lid === undefined && base.lid === undefined) p.lid = p.eyes === 'dot' ? C.defaultLid : 0;
  return p;
}

// F = { cx, ey, gap, rx, ry, skin, my (mouth y), head: { x, y, w, h }, glasses (ring radius or 0), ink, eye, ms (mouth scale), cat }
export function face(pen, p, F) {
  const ink = F.ink || INK, eyeFill = F.eye || ink, lw = pen.lw, look = (p.look || 0) * 2.2;
  const L = (pts, w = lw * 0.9, col = ink) => pen.line(pts, w, col);
  for (const sx of [-1, 1]) {
    const ex = F.cx + sx * F.gap, rx = F.rx, ry = F.ry, ey = F.ey;
    const inner = ex - sx * (rx + 1.4), outer = ex + sx * (rx + 1.4), top = ey + ry;
    const cover = (yInner, yOuter) => { // skin over the top of the eye, cut by a (possibly slanted) lid line
      const c = pen.ctx, P = [[outer, top + 1], [inner, top + 1], [inner, yInner], [outer, yOuter]].map(q => pen.T(q));
      c.beginPath(); P.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fillStyle = F.skin; c.fill();
      L([[outer + sx * 0.4, yOuter], [inner - sx * 0.4, yInner]]);
    };
    switch (p.eyes) {
      case 'wide': case 'pinpoint': {
        pen.shape(ellipsePts(ex, ey, rx * 1.9, ry * 1.6, 26), '#fbfaf6', ink, lw * 0.8);
        const pr = p.eyes === 'wide' ? 1.3 : 0.65;
        pen.dot(ex + look * 0.6, ey, pr, pr * 1.15, INK); break;
      }
      case 'happy': L(pen.curve([ex - 3, ey - 1], [ex, ey + 3.6], [ex + 3, ey - 1])); break;
      case 'closed': L(pen.curve([ex - 3, ey + 0.6], [ex, ey - 1.6], [ex + 3, ey + 0.6])); break;
      case 'squint': L([[ex + sx * 2.6, ey + 2.3], [ex - sx * 2, ey], [ex + sx * 2.6, ey - 2.3]]); break;
      case 'x': L([[ex - 2.4, ey + 2.4], [ex + 2.4, ey - 2.4]]); L([[ex - 2.4, ey - 2.4], [ex + 2.4, ey + 2.4]]); break;
      case 'spiral': { const pts = []; for (let t = 0; t < 14; t++) { const a = t * 0.9 * sx, r = 0.25 * t; pts.push([ex + Math.cos(a) * r, ey + Math.sin(a) * r]); } L(pts, lw * 0.7); break; }
      case 'angry': pen.dot(ex + look, ey, rx, ry, eyeFill); cover(top - ry * 1.15, top - ry * 0.25); break;
      case 'sad': pen.dot(ex + look, ey, rx, ry, eyeFill); cover(top - ry * 0.2, top - ry * 1.0); break;
      default: { // dot with a straight lid
        pen.dot(ex + look, ey, rx, ry, eyeFill);
        const lid = Math.max(0, Math.min(1, p.lid || 0));
        if (lid > 0.02) { const cut = top - lid * ry * 2; cover(cut, cut); }
      }
    }
    if (p.brow) { // brows float above the eye (and above glasses) with a clear gap
      const by = ey + Math.max(ry * (p.eyes === 'wide' || p.eyes === 'pinpoint' ? 1.6 : 1), F.glasses || 0) + 2.6;
      const bi = ex - sx * 3, bo = ex + sx * 3;
      if (p.brow === 'raised') L(pen.curve([bo, by + 0.8], [ex, by + 2.8], [bi, by + 0.8]), lw * 0.8);
      else if (p.brow === 'worried') L([[bo, by], [bi, by + 1.8]], lw * 0.8);
      else if (p.brow === 'angry') L([[bo, by + 1.4], [bi, by - 1]], lw * 0.8);
      else if (p.brow === 'skeptic') sx < 0 ? L(pen.curve([bo, by + 1], [ex, by + 3.4], [bi, by + 1.4]), lw * 0.8) : L([[bi, by - 0.4], [bo, by - 0.4]], lw * 0.8);
      else L([[bo, by], [bi, by]], lw * 0.8);
    }
  }
  if (F.glasses) {
    for (const sx of [-1, 1]) pen.shape(ellipsePts(F.cx + sx * F.gap, F.ey - 0.3, F.glasses, F.glasses * 0.96, 24), null, ink, lw * 0.9);
    L([[F.cx - F.gap + F.glasses, F.ey + 0.2], [F.cx + F.gap - F.glasses, F.ey + 0.2]], lw * 0.8);
  }
  mouth(pen, F.cx, F.my, F.cat && ['line', 'smile'].includes(p.mouth) ? 'cat' : p.mouth, F.ms || 1, ink);
  for (const fx of p.fx || []) symbol(pen, fx, F, ink);
}

function mouth(pen, cx, cy, kind = 'line', k = 1, ink = INK) {
  const lw = pen.lw * 0.9, D = '#4a2b2a', W = '#fbfaf6';
  const P = pts => pts.map(([x, y]) => [cx + x * k, cy + y * k]);
  const L = (pts, w = lw) => pen.line(P(pts), w, ink);
  const S = (pts, fill) => pen.shape(P(pts), fill, ink, lw);
  switch (kind) {
    case 'line': L([[-3.6, 0], [3.6, 0]]); break;
    case 'flat_down': L([[-3.4, 0.3], [0, 0], [3.4, -0.8]]); break;
    case 'smirk': L([[-3.6, 0], [2, 0], [4.2, 1.6]]); break;
    case 'smile': L(pen.curve([-4, 1], [0, -2.4], [4, 1])); break;
    case 'frown': L(pen.curve([-4, -1.2], [0, 1.8], [4, -1.2])); break;
    case 'wobble': L([[-4.5, 0], [-2.2, 1], [0, -0.6], [2.2, 1], [4.5, 0]]); break;
    case 'small': S(ellipsePts(0, 0, 2.2, 1.6, 18), D); break;
    case 'O': S(ellipsePts(0, -0.4, 2.3, 3.2, 20), D); break;
    case 'wide': S(ellipsePts(0, -0.6, 4.4, 3.6, 24), D); pen.dot(cx, cy - 2.6 * k, 2.4 * k, 1 * k, '#d9706a'); break;
    case 'scream': S(ellipsePts(0, -2.4, 4.2, 5.6, 26), D); pen.dot(cx, cy - 6.2 * k, 2.6 * k, 1.3 * k, '#d9706a'); break;
    case 'grin': {
      S([[-5, 1], [5, 1], ...pen.curve([5, 1], [5, -6], [0, -5.6]).slice(1), ...pen.curve([0, -5.6], [-5, -6], [-5, 1]).slice(1)], D);
      S([[-4.5, 0.6], [4.5, 0.6], [4.2, -1.1], [-4.2, -1.1]], W); break;
    }
    case 'teeth': {
      S(rrectPts(0, 0, 11, 4.6, 1.6, 4), W);
      L([[-5, 0], [5, 0]], lw * 0.6); for (const x of [-2.6, 0, 2.6]) L([[x, 2], [x, -2]], lw * 0.6); break;
    }
    case 'tongue': L(pen.curve([-4, 0.6], [0, -1.6], [4, 0.6])); S([[0.6, -0.4], [3.4, -0.2], ...pen.curve([3.4, -0.2], [3.4, -4.4], [2, -4.2]).slice(1), ...pen.curve([2, -4.2], [0.6, -4], [0.6, -0.4]).slice(1)], '#e07a74'); break;
    case 'evil': {
      S([...pen.curve([-6, 1.8], [0, -0.6], [6, 1.8]), ...pen.curve([6, 1.8], [0, -7], [-6, 1.8]).slice(1)], W);
      for (const x of [-3, -1, 1, 3]) L([[x, 1.1 - Math.abs(x) * 0.1], [x, -2.6 + Math.abs(x) * 0.5]], lw * 0.5); break;
    }
    case 'wavy_open': S([[-4.4, 0.6], [-2.2, 1.6], [0, 0.6], [2.2, 1.6], [4.4, 0.6], [3.4, -3], [0, -3.8], [-3.4, -3]], D); break;
    case 'cat': L(pen.curve([-3, 0.6], [-1.5, -1.4], [0, 0.4])); L(pen.curve([0, 0.4], [1.5, -1.4], [3, 0.6])); break;
    default: L([[-3.6, 0], [3.6, 0]]);
  }
}

function symbol(pen, kind, F, ink) {
  const outInk = INK; // symbols drawn outside the head always use the dark ink, so they read on paper
  const H = F.head, right = H.x + H.w / 2, topY = H.y + H.h / 2, c = pen.ctx, lw = pen.lw;
  const text = (t, x, y, size) => { const [sx, sy] = pen.T([x, y]); c.font = `${size * pen.s}px "Patrick Hand", "Comic Sans MS", sans-serif`; c.fillStyle = INK; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, sx, sy); c.textAlign = 'start'; };
  switch (kind) {
    case 'sweat': { const x = right + 1.5, y = H.y + H.h * 0.22; pen.shape([[x, y + 4.4], [x + 2.2, y + 0.4], ...pen.curve([x + 2.2, y + 0.4], [x, y - 3.6], [x - 2.2, y + 0.4]).slice(1)], '#a9d8ea', outInk, lw * 0.7); break; }
    case 'blush': case 'blush_heavy': {
      const a = kind === 'blush' ? 0.35 : 0.6, rx = kind === 'blush' ? 3.2 : 4.2;
      for (const sx of [-1, 1]) pen.dot(F.cx + sx * (F.gap + 1), F.ey - 4.6, rx, 1.6, `rgba(232,110,105,${a})`);
      if (kind === 'blush_heavy') for (const sx of [-1, 1]) for (const d of [-1.4, 0, 1.4]) pen.line([[F.cx + sx * (F.gap + 1) + d - 0.6, F.ey - 3.6], [F.cx + sx * (F.gap + 1) + d + 0.6, F.ey - 5.6]], lw * 0.45, 'rgba(200,70,70,0.7)');
      break;
    }
    case 'tears': for (const sx of [-1, 1]) { const x = F.cx + sx * F.gap; pen.line([[x, F.ey - 1.6], [x + sx * 0.4, F.ey - 6], [x, F.ey - 11]], lw * 1.3, '#7fc2df'); } break;
    case 'tears_small': for (const sx of [-1, 1]) pen.dot(F.cx + sx * (F.gap + 3.4), F.ey + 1.4, 1, 1.4, '#7fc2df'); break;
    case 'vein': { const x = right + 2.6, y = topY - 3; for (const [dx, dy] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) pen.line(pen.curve([x + dx * 0.7, y + dy * 2.6], [x + dx * 0.6, y + dy * 0.6], [x + dx * 2.6, y + dy * 0.7]), lw * 0.75, outInk); break; }
    case 'gloom': { // vertical dread lines across the forehead, between the brows and the hairline
      const y0 = F.ey + Math.max(F.ry, F.glasses || 0) + 1.2;
      for (let i = 0; i < 5; i++) { const x = F.cx - F.gap * 1.1 + i * F.gap * 0.55; pen.line([[x, y0], [x, y0 + 4.5 + (i % 2) * 1.2]], lw * 0.5, ink); }
      break;
    }
    case 'sparkle': { const x = right + 3, y = topY + 1; pen.shape([[x, y + 3.6], [x + 0.9, y + 0.9], [x + 3.6, y], [x + 0.9, y - 0.9], [x, y - 3.6], [x - 0.9, y - 0.9], [x - 3.6, y], [x - 0.9, y + 0.9]], '#f2d16b', outInk, lw * 0.6); break; }
    case 'question': text('?', right + 3.5, topY + 2, 11); break;
    case 'zzz': text('z', right + 2, topY - 1, 6); text('Z', right + 5.5, topY + 4, 8.5); break;
    case 'steam': for (const sx of [-1, 1]) { const x = H.x + sx * (H.w / 2 + 3), y = topY - 1; pen.shape(ellipsePts(x, y, 2.6, 2, 14), '#fbfaf6', outInk, lw * 0.6); pen.shape(ellipsePts(x + sx * 2.6, y + 3, 2, 1.6, 12), '#fbfaf6', outInk, lw * 0.6); } break;
  }
}

// ---------- limbs: single ink lines, no hands ----------
export function limb(pen, sx, [x0, y0], pose = 'down', len = 18) {
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
  pen.line(pen.curve([ax, y0], ctrl, end), pen.lw);
  return end;
}
export function legs(pen, gap, top) { // two short lines and two small ink feet
  for (const sx of [-1, 1]) { pen.line([[sx * gap, top], [sx * gap, 2.2]], pen.lw); pen.dot(sx * (gap + 1.6), 1.6, 3.4, 1.8); }
}
export function arms(pen, p, shoulder, len) {
  limb(pen, -1, shoulder, p.armL || p.arm, len); limb(pen, 1, shoulder, p.armR || p.arm, len);
}

// ---------- characters ----------
// Simplicity rule: one body shape, one head shape, one or two signature features. Nothing else.
export function drawCharacter(ctx, id, x, y, scale, pose = {}, opt = {}) {
  const C = CAST[id], p = resolvePose(C, pose);
  const pen = new Pen(ctx, x, y, scale, { seed: opt.seed ?? id.length * 13, frame: opt.frame ?? 0, lw: opt.lw ?? 3 });
  const shadowW = { cat: 22, ted: 13, nana: 13, penny: 15, steve: 15 }[C.kind];
  ctx.fillStyle = 'rgba(42,36,34,0.10)';
  ctx.beginPath(); ctx.ellipse(x, y, shadowW * scale, 2.6 * scale, 0, 0, Math.PI * 2); ctx.fill();
  ({ steve: drawSteve, nana: drawNana, penny: drawPenny, ted: drawTed, cat: drawCat })[C.kind](pen, C, p, opt.frame ?? 0);
}

// Chibi rule: the head is about 2/3 of the character's height, the body is a small simple shape with stick limbs.
// Each lead keeps one signature that reads in silhouette. Faces are huge, so all 26 expressions read on a phone.

// head + face helper shared by the human cast. o: { hy, w, h, skin, eyeK, ms, glasses }
function chibiHead(pen, p, o) {
  pen.shape(ellipsePts(0, o.hy, o.w / 2, o.h / 2, 44), o.skin);
}
function chibiFace(pen, p, o) {
  face(pen, p, { cx: 0, ey: o.hy + o.h * 0.03, gap: o.w * 0.2, rx: 2.2 * o.eyeK, ry: 3 * o.eyeK, skin: o.skin, my: o.hy - o.h * 0.25, ms: o.ms, glasses: o.glasses || 0, head: { x: 0, y: o.hy, w: o.w, h: o.h } });
}

// Sweaty Steve — the only normal person in the building: spiky black hair, mustard hoodie, perpetually alarmed.
function drawSteve(pen, C, p) {
  legs(pen, 4, 11);
  arms(pen, p, [9, 24], 12);
  pen.shape(rrectPts(0, 27, 24, 9, 4.5), C.color);                       // hood behind the neck
  pen.shape([[-10, 10], [10, 10], [9, 27], [-9, 27]], C.color);
  pen.line([[-2.4, 26], [-2.8, 19]], pen.lw * 0.6); pen.line([[2.4, 26], [2.8, 19]], pen.lw * 0.6);
  const o = { hy: 47, w: 44, h: 42, skin: C.skin, eyeK: 1.35, ms: 1.3 };
  chibiHead(pen, p, o);
  const hy = o.hy, w = o.w, h = o.h;
  pen.shape([[-w / 2, hy + 2], [-w / 2 + 1, hy + h * 0.3], [-w * 0.34, hy + h * 0.5], [-w * 0.3, hy + h * 0.66], [-w * 0.14, hy + h * 0.52], [-w * 0.06, hy + h * 0.72], [w * 0.06, hy + h * 0.53], [w * 0.2, hy + h * 0.68], [w * 0.26, hy + h * 0.5], [w * 0.44, hy + h * 0.4], [w / 2, hy + 2], [w * 0.22, hy + h * 0.24], [-w * 0.22, hy + h * 0.24]], C.hair);
  chibiFace(pen, p, o);
}

// Nana Knuckles — tiny, a white beehive taller than her head with a knitting needle in it, magnifying glasses.
function drawNana(pen, C, p) {
  legs(pen, 3.4, 7);
  arms(pen, p, [8, 19], 10);
  pen.shape([[-10, 6], [10, 6], [8, 21], [-8, 21]], C.color);
  const o = { hy: 39, w: 40, h: 36, skin: C.skin, eyeK: 1.55, ms: 1.2, glasses: 7.8 };
  pen.line([[7, o.hy + 34], [15, o.hy + 44]], pen.lw * 0.9, '#b8895a'); pen.dot(15.4, o.hy + 44.6, 1.3, 1.3, '#b8895a');
  pen.shape(ellipsePts(0, o.hy + 30, 13, 21, 36), C.hair);
  pen.line(pen.curve([-6, o.hy + 14], [3, o.hy + 30], [-2, o.hy + 48]), pen.lw * 0.6);
  chibiHead(pen, p, o);
  pen.line(pen.curve([-o.w / 2 + 1.5, o.hy + 7], [0, o.hy + 20], [o.w / 2 - 1.5, o.hy + 7]), pen.lw);
  chibiFace(pen, p, o);
}

// Penny Pincher — eight years old, owns the building: square black bob, navy blazer with a tie.
function drawPenny(pen, C, p) {
  legs(pen, 3, 6);
  arms(pen, p, [10, 17], 9);
  pen.shape([[-9, 5], [9, 5], [10, 15], [12.5, 18], [-12.5, 18], [-10, 15]], C.color);
  pen.shape([[-2.6, 18], [2.6, 18], [0, 13]], '#f7f4ee');
  pen.shape([[-1, 17], [1, 17], [1.4, 11.5], [0, 10], [-1.4, 11.5]], INK, INK, pen.lw * 0.5);
  const o = { hy: 39, w: 44, h: 42, skin: C.skin, eyeK: 1.35, ms: 1.3 };
  pen.shape(rrectPts(0, o.hy - 1, o.w + 8, o.h + 4, 9), C.hair);
  chibiHead(pen, p, o);
  pen.shape([[-o.w / 2 - 4, o.hy + o.h * 0.48], [o.w / 2 + 4, o.hy + o.h * 0.48], [o.w / 2 + 4, o.hy + o.h * 0.22], [-o.w / 2 - 4, o.hy + o.h * 0.22]], C.hair);
  chibiFace(pen, p, o);
}

// Dead Ted — the ghost of the previous tenant: pale, see-through, bald with grey tufts, reading glasses,
// sage cardigan, a wisp instead of legs, and fluffy pink slippers floating underneath. Holds a mug.
function drawTed(pen, C, p, frame) {
  const c = pen.ctx, bob = Math.sin(frame / 24 * Math.PI) * 0.8;
  for (const sx of [-1, 1]) pen.shape(ellipsePts(sx * 5, 2.2, 4.4, 2.2, 16), '#eeb3bd');
  c.save(); c.globalAlpha = 0.72; pen.y -= bob * pen.s;
  pen.shape([[-9, 13], ...pen.curve([-5, 6], [0, 7], [5, 9]), ...pen.curve([5, 9], [2, 11], [9, 13]).slice(1)], C.skin);
  const armR = p.armR || p.arm;
  arms(pen, { ...p, armR: armR === 'down' ? 'hold' : armR }, [9, 25], 11);
  pen.shape([[-10, 12], [10, 12], [9, 27], [-9, 27]], C.color);
  pen.line([[0, 27], [0, 13]], pen.lw * 0.6); [16, 20, 24].forEach(y => pen.dot(-1.8, y, 0.8, 0.8, '#f4efe4'));
  const o = { hy: 48, w: 42, h: 42, skin: C.skin, eyeK: 1.3, ms: 1.25, glasses: 7.2 };
  chibiHead(pen, p, o);
  for (const sx of [-1, 1]) pen.shape(ellipsePts(sx * 20, o.hy + 3, 3, 5, 14), C.hair);
  chibiFace(pen, p, o);
  if (armR === 'down') { pen.shape(rrectPts(5, 16.5, 6, 7, 1.2), '#fbfaf6'); pen.line(pen.curve([8, 18.5], [11, 17], [8, 15]), pen.lw * 0.6); }
  pen.y += bob * pen.s; c.restore();
}

// Sgt. Snuggles — a round charcoal cat with a big head, a fedora two sizes too small and a toothpick. Narrates like film noir.
function drawCat(pen, C, p) {
  pen.line(pen.curve([10, 4], [24, 4], [20, 18]), pen.lw);
  pen.shape(ellipsePts(0, 11, 14, 11, 30), C.color);
  for (const sx of [-1, 1]) pen.dot(sx * 5, 1.4, 3.4, 1.6, '#8b8b96');
  const hy = 34, hw = 42, hh = 36;
  pen.shape([[-19, hy + 6], [-16, hy + 22], [-7, hy + 15]], C.color);
  pen.shape([[7, hy + 15], [16, hy + 22], [19, hy + 6]], C.color);
  pen.shape(ellipsePts(0, hy, hw / 2, hh / 2, 44), C.color);
  pen.shape([[-10, hy + 16.4], [11, hy + 18], [9.4, hy + 20], [5, hy + 20.2], [5, hy + 26], [0, hy + 24.4], [-5, hy + 26], [-5.6, hy + 19.6], [-9.2, hy + 18.6]], C.hat);
  for (const sx of [-1, 1]) for (const dy of [0, 2.4]) pen.line([[sx * 10, hy - 5 + dy * 0.3], [sx * 23, hy - 4.6 + dy]], pen.lw * 0.55, '#efe9df');
  pen.dot(0, hy - 3.2, 1.8, 1.3, '#efe9df');
  face(pen, p, { cx: 0, ey: hy + 2.4, gap: 8.4, rx: 2.8, ry: 3.6, skin: C.color, my: hy - 8, ms: 1.15, cat: true, ink: '#efe9df', eye: '#f0d264', head: { x: 0, y: hy, w: hw, h: hh } });
  if (!['O', 'scream', 'grin', 'wide', 'evil', 'wavy_open', 'teeth', 'tongue'].includes(p.mouth)) pen.line([[2.6, hy - 8.2], [12, hy - 10.4]], pen.lw * 0.7, '#d9c49a');
}

// ---------- paper + panel ----------
export function paper(ctx, w, h, seed = 1) {
  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < (w * h) / 900; i++) {
    const x = hash(seed + i * 1.7) * w, y = hash(seed * 3 + i * 2.3) * h, a = 0.03 + hash(i * 5.1) * 0.05;
    ctx.fillStyle = `rgba(80,60,40,${a.toFixed(3)})`; ctx.fillRect(x, y, 1.4, 1.4);
  }
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(60,40,20,0.06)'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
}
export function panel(ctx, x, y, w, h, seed = 1, fill = null, frame = 0) {
  const pen = new Pen(ctx, 0, 0, 1, { seed, frame, lw: 4.5 });
  pen.T = ([px, py]) => [px, py];
  pen.shape(rrectPts(x + w / 2, y + h / 2, w, h, 14, 6), fill);
}
export function nameTab(ctx, x, y, id, size = 30) {
  const C = CAST[id]; ctx.font = `${size}px "Patrick Hand", "Comic Sans MS", sans-serif`;
  const tw = ctx.measureText(C.name).width, pw = tw + size * 0.9, ph = size * 1.35;
  ctx.fillStyle = C.color; ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x, y, pw, ph, ph / 2); ctx.fill(); ctx.stroke();
  const dark = ['#3d5a96', '#4a4a54'].includes(C.color);
  ctx.fillStyle = dark ? '#f4efe4' : INK; ctx.textBaseline = 'middle'; ctx.fillText(C.name, x + size * 0.45, y + ph / 2 + 1);
  return pw;
}
