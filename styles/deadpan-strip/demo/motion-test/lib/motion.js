// UNIT 4B — motion layer: keeps characters alive between poses (fix for "stiff" Tập 1–2, see QA.md row 9).
//   track(keys, t)  → pose tweened from the previous key: numbers ease with overshoot, arms blend, faces switch
//   idle(t, seed)   → breathing + small head/body drift, always on
//   speech(words, t0, t) → head nods on word onsets (bigger on CAPS words) while a line plays
//   pop(age)        → squash/stretch scale for the first ~0.35 s after a key (anticipation → overshoot → settle)
//   drawLive(ctx, draw, x, y, sq) → draw a character with squash/stretch around its feet
// Numbers are in the cast's local units / degrees, so they work at any scale.

export const ease = {
  outBack: k => { const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); },
  inOut: k => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2),
  out: k => 1 - Math.pow(1 - k, 3),
};
const clamp01 = k => Math.max(0, Math.min(1, k));
const NUM = ['x', 'y', 'lean', 'tilt', 'headDy', 'look', 'lid', 'tail', 'scale'];

// keys: [{ t, dur?, ...pose }] sorted by t. Discrete fields (expr, eyes, mouth, fx) switch at the key;
// numeric fields and arms tween from the previous key over `dur` (default 0.28 s) with a little overshoot.
export const onTwos = t => Math.floor(t * 12) / 12;      // characters move at 12 fps (classic 2D), camera stays at 24
export const boilFrame = t => Math.floor(t * 8);        // line boil at 8 fps, steady, never every frame

export function track(keys, t, defDur = 0.25) {
  let i = 0;
  while (i + 1 < keys.length && keys[i + 1].t <= t) i++;
  const cur = keys[i], prev = keys[Math.max(0, i - 1)];
  const age = Math.max(0, t - cur.t), dur = cur.dur ?? defDur, k = i === 0 ? 1 : ease.inOut(clamp01(age / dur));
  const out = { ...cur, age };
  delete out.t; delete out.dur;
  for (const f of NUM) {
    const a = prev[f], b = cur[f];
    if (typeof a === 'number' && typeof b === 'number') out[f] = a + (b - a) * k;
  }
  for (const f of ['arm', 'armL', 'armR']) {
    const a = armOf(prev, f), b = armOf(cur, f);
    if (a && b && a !== b && k < 1) out[f] = { a, b, k };
  }
  return out;
}
const armOf = (p, f) => p[f] ?? (f !== 'arm' ? p.arm : undefined) ?? 'down';

export function idle(t, seed = 0) {
  const s = seed * 1.7;
  return {
    headDy: 0.35 * Math.sin(2 * Math.PI * t / 3.6 + s),          // breathing only — no automatic head wobble
    tail: 0.6 * Math.sin(2 * Math.PI * t / 2.8 + s),
  };
}

// words: [[word, start, end], ...] relative to the line start (from asr_check words.json). Returns extra headDy/tilt.
export function speech(words, t0, t, text = '') {
  if (!words) return { headDy: 0, tilt: 0 };
  const stressed = new Set(text.split(/\s+/).filter(x => /[A-Z]{2,}/.test(x)).map(x => x.replace(/[^A-Za-z']/g, '').toLowerCase()));
  let dy = 0, tl = 0;
  words.forEach(([w, a], j) => {
    const age = t - (t0 + Math.max(0, a));
    if (age < 0 || age > 0.3) return;
    if (!stressed.has(w.replace(/[^A-Za-z']/g, '').toLowerCase())) return;   // a nod only on the stressed word
    dy -= 1.6 * Math.sin(Math.PI * age / 0.3);
  });
  return { headDy: dy, tilt: tl };
}

export function pop(age, amt = 1) {
  if (age < 0.07) return 1 - 0.07 * amt;                       // anticipation
  if (age < 0.18) return 1 + 0.08 * amt;                       // stretch
  if (age < 0.6) return 1 + 0.035 * amt * Math.exp(-(age - 0.18) * 9) * Math.cos((age - 0.18) * 30);
  return 1;
}

export function drawLive(ctx, draw, x, y, sq = 1) {
  if (Math.abs(sq - 1) < 1e-3) return draw();
  ctx.save(); ctx.translate(x, y); ctx.scale(1 / Math.sqrt(sq), sq); ctx.translate(-x, -y); draw(); ctx.restore();
}

export function sum(...ps) {   // add numeric motion fields together (pose + idle + speech)
  const out = { ...ps[0] };
  for (const p of ps.slice(1)) for (const [k, v] of Object.entries(p)) if (typeof v === 'number') out[k] = (typeof out[k] === 'number' ? out[k] : 0) + v;
  return out;
}

// Kinetic captions (the reference shorts show 1–3 words at a time, big, centred, on the picture).
// lines: [{ id, char, t, text }], words: { id: [[w, a, b], ...] }. Returns the chunk to show at t or null.
export function wordChunk(lines, words, t, maxChars = 16) {
  for (const L of lines) {
    const W = words[L.id]; if (!W) continue;
    const end = L.t + W[W.length - 1][2] + 0.25;
    if (t < L.t || t > end) continue;
    const stress = new Set(L.text.split(/\s+/).filter(w => /[A-Z]{2,}/.test(w)).map(w => w.replace(/[^A-Za-z']/g, '').toLowerCase()));
    const chunks = []; let cur = [];
    for (const w of W) {
      const txt = cur.map(c => c[0]).join(' ');
      if (cur.length && (txt.length + w[0].length + 1 > maxChars || /[.,!?]$/.test(cur[cur.length - 1][0]))) { chunks.push(cur); cur = []; }
      cur.push(w);
    }
    if (cur.length) chunks.push(cur);
    let pick = null;
    for (const c of chunks) if (t >= L.t + Math.max(0, c[0][1]) - 0.05) pick = c;
    if (!pick) pick = chunks[0];
    return { char: L.char, id: L.id, words: pick.map(([w]) => ({ w: w.replace(/[.,]$/, ''), stress: stress.has(w.replace(/[^A-Za-z']/g, '').toLowerCase()) })), start: L.t + Math.max(0, pick[0][1]) };
  }
  return null;
}
