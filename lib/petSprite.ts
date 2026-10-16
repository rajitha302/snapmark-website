// @ts-nocheck
// Pixel-art pet, ported from the Snapmark extension (media/editor.js) so the
// site's cat and dog are the same ones users meet in the editor. Shapes are
// in design units on a 26×24 grid, 2 detail pixels each; see the extension's
// CLAUDE.md ("Pet") for how the drawing works. Keep the two copies in step.

const PET_F = 2; // detail pixels (CSS px) per design unit
const PET_W = 26 * PET_F, PET_H = 24 * PET_F;
const PET_COLORS = {
  cat: {
    fur: '#eba25b', hi: '#f9c88c', shade: '#c47334', dark: '#b8652b', far: '#c47235',
    light: '#fbe8ca', lightShade: '#e6c99c', nose: '#f08a9b', ear: '#f4a9b4', eye: '#24170d',
    mouth: '#8a5236', whisker: '#fff4e4', line: '#3e1f0c',
  },
  dog: {
    fur: '#c99460', hi: '#e6bb8a', shade: '#9c6a3a', dark: '#6f4424', far: '#a06c3c',
    light: '#f6eacf', lightShade: '#dcc6a0', nose: '#24170d', ear: '#6f4424', eye: '#24170d',
    mouth: '#5a3a26', tongueLine: '#c95a6a', collar: '#d9433f', tag: '#f2cf73', line: '#2a170b',
  },
};
const HOME_COLORS = {
  cushion: { base: '#5aa6a0', hi: '#8fd0c8', shade: '#3c7c77', tuft: '#2f6662', piping: '#e9cf8a', line: '#143534' },
  house: {
    wall: '#6f9dc6', wallHi: '#9cc3e4', wallShade: '#4f7ca4', plank: '#5a87b0',
    roof: '#d0533f', roofHi: '#ec7f66', roofShade: '#a23a2b', trim: '#f4e9d2', door: '#1d140c', line: '#191828',
  },
};
const PET_TONGUE = '#f07c8c', PET_ZZZ = '#d7dbe4', PET_HEART = '#ff6b8b';
const CUSHION_W = 44, CUSHION_H = 16, CUSHION_LIFT = 9; // the cat sits this far up on it
const HOUSE_W = 46, HOUSE_H = 42, HOUSE_GAP = 26; // the dog sits this far right of the house's left edge

function mixHex(a, b, t) {
  const n = (h, i) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  return '#' + [0, 1, 2].map((i) => Math.round(n(a, i) + (n(b, i) - n(a, i)) * t).toString(16).padStart(2, '0')).join('');
}

// A w×h grid of detail pixels. Shapes take design units (× PET_F); dot()
// and hline() take detail pixels, for fine touches.
function pixelGrid(w, h) {
  const F = PET_F;
  const g = new Array(w * h).fill(null);
  const dot = (x, y, c) => {
    x = Math.round(x); y = Math.round(y);
    if (x >= 0 && y >= 0 && x < w && y < h) g[y * w + x] = c;
  };
  const ell = (cx, cy, rx, ry, c) => {
    cx *= F; cy *= F; rx *= F; ry *= F;
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
        if (dx * dx + dy * dy <= 1) dot(x, y, c);
      }
    }
  };
  return {
    g, dot, ell,
    set(x, y, c) {
      x = Math.round(x) * F; y = Math.round(y) * F;
      for (let j = 0; j < F; j++) for (let i = 0; i < F; i++) dot(x + i, y + j, c);
    },
    rect(x0, y0, x1, y1, c) { // design units, inclusive
      for (let y = Math.round(y0 * F); y < Math.round((y1 + 1) * F); y++) {
        for (let x = Math.round(x0 * F); x < Math.round((x1 + 1) * F); x++) dot(x, y, c);
      }
    },
    tri(a, b, d, c) {
      const [A, B, D] = [a, b, d].map(([x, y]) => [x * F, y * F]);
      const side = (p0, p1, q) => (p1[0] - p0[0]) * (q[1] - p0[1]) - (p1[1] - p0[1]) * (q[0] - p0[0]);
      for (let y = Math.floor(Math.min(A[1], B[1], D[1])); y <= Math.ceil(Math.max(A[1], B[1], D[1])); y++) {
        for (let x = Math.floor(Math.min(A[0], B[0], D[0])); x <= Math.ceil(Math.max(A[0], B[0], D[0])); x++) {
          const q = [x + 0.5, y + 0.5];
          const s0 = side(A, B, q), s1 = side(B, D, q), s2 = side(D, A, q);
          if ((s0 >= 0 && s1 >= 0 && s2 >= 0) || (s0 <= 0 && s1 <= 0 && s2 <= 0)) dot(x, y, c);
        }
      }
    },
    line(pts, r, c) { // a thick stroke through design-unit points
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * F * 2));
        for (let k = 0; k <= n; k++) ell(x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n, r, r, c);
      }
    },
    hline(x0, y0, x1, y1, c) { // a 1px line in detail pixels
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
      for (let k = 0; k <= n; k++) dot(x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n, c);
    },
    // Light from above: a two-pixel lit band along top edges and a
    // two-pixel shadow along undersides. tones: { colour: [lit, shadow] }.
    shade(tones) {
      const src = g.slice();
      const filled = (x, y) => x >= 0 && y >= 0 && x < w && y < h && src[y * w + x];
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const c = src[y * w + x], t = c && tones[c];
          if (!t) continue;
          const top = !filled(x, y - 1) ? 1 : !filled(x, y - 2) ? 2 : 0;
          const bot = !filled(x, y + 1) ? 1 : !filled(x, y + 2) ? 2 : 0;
          if (t[0] && top) g[y * w + x] = top === 1 ? t[0] : mixHex(c, t[0], 0.5);
          else if (bot) g[y * w + x] = bot === 1 ? t[1] : mixHex(c, t[1], 0.45);
        }
      }
    },
    outline(c) { // every empty pixel touching the shape, diagonals included
      const src = g.slice();
      const filled = (x, y) => x >= 0 && y >= 0 && x < w && y < h && src[y * w + x];
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (src[y * w + x]) continue;
          for (let j = -1; j <= 1 && !g[y * w + x]; j++) {
            for (let i = -1; i <= 1; i++) if ((i || j) && filled(x + i, y + j)) { g[y * w + x] = c; break; }
          }
        }
      }
    },
    pattern(x, y, rows, c) { // chunky design-unit pixels, e.g. z's and the heart
      rows.forEach((row, j) => { for (let i = 0; i < row.length; i++) if (row[i] === '#') this.set(x + i, y + j, c); });
    },
  };
}

// p: { pose: 'sit' | 'stand' | 'lie', swing (tail, -1..1), eyes: 'open' |
// 'shut', mouth: 'shut' | 'open' | 'tongue', paw (cat grooming), headDown,
// leg (walk frame 0-3), z (0-3 sleep z's), heart }. Faces right.
function petSprite(kind, p) {
  const C = PET_COLORS[kind];
  const cat = kind === 'cat';
  const F = PET_F;
  const G = pixelGrid(PET_W, PET_H);
  const { set, ell, rect, tri, line, dot, hline } = G;
  const sw = p.swing || 0;
  const after = []; // details drawn over the outline
  // Eye whose lower-right design unit is (x, y): round, with a catch-light;
  // shut, a sleepy curve.
  const eyes = (x, y) => {
    const ex = (x - 1) * F, ey = (y - 1) * F;
    if (p.eyes === 'shut') { [[0, 2], [1, 3], [2, 3], [3, 2]].forEach(([i, j]) => dot(ex + i, ey + j, C.eye)); return; }
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) if (!((i === 0 || i === 3) && (j === 0 || j === 3))) dot(ex + i, ey + j, C.eye);
    }
    dot(ex + 2, ey + 1, '#ffffff');
  };
  const stripe = (x, y) => { dot(x * F + 1, y * F, C.dark); dot(x * F, y * F + 1, C.dark); dot(x * F, y * F + 2, C.dark); };
  const blush = (x, y) => { dot(x * F, y * F + 1, C.ear); dot(x * F + 1, y * F + 1, C.ear); };
  const whiskers = (x, y) => after.push(() => {
    hline(x * F + 3, y * F + 2, x * F + 6, y * F + 1, C.whisker);
    hline(x * F + 3, y * F + 4, x * F + 6, y * F + 5, C.whisker);
  });
  const collar = (pts, tx, ty) => {
    line(pts, 0.55, C.collar);
    dot(tx * F, ty * F, C.tag); dot(tx * F + 1, ty * F, C.tag); dot(tx * F, ty * F + 1, C.tag); dot(tx * F + 1, ty * F + 1, '#b8902f');
  };
  // The cat looks at you: a round face centred on design (cx, cy) with two
  // big eyes, a pink nose and a "ω" mouth, whiskers both sides, pink inner
  // ears and tabby forehead marks. Details are mirrored about the centre.
  const catFace = (cx, cy) => {
    ell(cx, cy + 0.3, 4.6, 3.8, C.fur);
    ell(cx, cy + 1.4, 5, 2.4, C.fur); // cheek fluff
    tri([cx - 4.1, cy - 1], [cx - 3.3, cy - 5.6], [cx - 0.6, cy - 2.6], C.fur);
    tri([cx + 0.6, cy - 2.6], [cx + 3.3, cy - 5.6], [cx + 4.1, cy - 1], C.fur);
    ell(cx, cy + 1.7, 2.4, 1.4, C.light); // muzzle
    const X = Math.round(cx * F), Y = Math.round(cy * F);
    const both = (x, y, c) => { dot(x, y, c); dot(2 * X - 1 - x, y, c); };
    [[X - 6, Y - 8], [X - 6, Y - 7], [X - 5, Y - 7]].forEach(([x, y]) => both(x, y, C.ear));
    [[X - 3, Y - 6], [X - 3, Y - 5], [X - 1, Y - 7], [X - 1, Y - 6]].forEach(([x, y]) => both(x, y, C.dark));
    if (p.eyes === 'shut') {
      [[X - 6, Y], [X - 5, Y + 1], [X - 4, Y + 1], [X - 3, Y]].forEach(([x, y]) => both(x, y, C.eye));
    } else {
      [[X - 5, Y - 2], [X - 4, Y - 2], [X - 6, Y - 1], [X - 5, Y - 1], [X - 4, Y - 1], [X - 3, Y - 1],
        [X - 6, Y], [X - 5, Y], [X - 4, Y], [X - 3, Y], [X - 5, Y + 1], [X - 4, Y + 1]].forEach(([x, y]) => both(x, y, C.eye));
      both(X - 4, Y - 1, '#ffffff');
    }
    both(X - 8, Y + 2, C.ear); both(X - 7, Y + 2, C.ear); // blush
    both(X - 1, Y + 2, C.nose);
    if (p.mouth === 'open') {
      for (let y = Y + 3; y <= Y + 5; y++) { both(X - 2, y, C.eye); both(X - 1, y, C.eye); }
      both(X - 1, Y + 5, C.nose);
    } else {
      [[X - 1, Y + 3], [X - 2, Y + 4], [X - 3, Y + 3]].forEach(([x, y]) => both(x, y, C.mouth));
    }
    if (p.paw) line([[14, 19], [15, 15.5], [cx - 0.4, cy + 2.4]], 1.1, C.light);
    after.push(() => {
      hline(X - 9, Y + 2, X - 14, Y + 1, C.whisker); hline(X - 9, Y + 4, X - 14, Y + 5, C.whisker);
      hline(X + 8, Y + 2, X + 13, Y + 1, C.whisker); hline(X + 8, Y + 4, X + 13, Y + 5, C.whisker);
    });
  };
  // The dog looks at you too: a round head centred on design (cx, cy) with
  // floppy ears, a cream blaze and muzzle, big eyes, a shiny black nose and
  // a tongue when it pants. Details are mirrored about the centre.
  const dogFace = (cx, cy) => {
    ell(cx, cy, 4.2, 3.9, C.fur);
    ell(cx, cy - 1.6, 0.9, 2.3, C.light); // blaze
    ell(cx, cy + 2, 2.7, 1.9, C.light); // muzzle
    ell(cx - 4, cy + 0.9, 1.5, 3.1, C.ear);
    ell(cx + 4, cy + 0.9, 1.5, 3.1, C.ear);
    const X = Math.round(cx * F), Y = Math.round(cy * F);
    const both = (x, y, c) => { dot(x, y, c); dot(2 * X - 1 - x, y, c); };
    if (p.eyes === 'shut') {
      [[X - 6, Y - 1], [X - 5, Y], [X - 4, Y], [X - 3, Y - 1]].forEach(([x, y]) => both(x, y, C.eye));
    } else {
      [[X - 5, Y - 3], [X - 4, Y - 3], [X - 6, Y - 2], [X - 5, Y - 2], [X - 4, Y - 2], [X - 3, Y - 2],
        [X - 6, Y - 1], [X - 5, Y - 1], [X - 4, Y - 1], [X - 3, Y - 1], [X - 5, Y], [X - 4, Y]].forEach(([x, y]) => both(x, y, C.eye));
      both(X - 4, Y - 2, '#ffffff');
    }
    [[X - 2, Y + 1], [X - 1, Y + 1], [X - 3, Y + 2], [X - 2, Y + 2], [X - 1, Y + 2], [X - 2, Y + 3], [X - 1, Y + 3]]
      .forEach(([x, y]) => both(x, y, C.nose));
    dot(X - 2, Y + 1, '#8a7a72'); // shine
    if (p.mouth === 'open') {
      for (let y = Y + 4; y <= Y + 6; y++) { both(X - 2, y, C.eye); both(X - 1, y, C.eye); }
      both(X - 1, Y + 6, PET_TONGUE);
    } else {
      [[X - 1, Y + 4], [X - 2, Y + 5], [X - 3, Y + 5]].forEach(([x, y]) => both(x, y, C.mouth));
      if (p.mouth === 'tongue') {
        for (let y = Y + 5; y <= Y + 8; y++) { both(X - 2, y, PET_TONGUE); both(X - 1, y, PET_TONGUE); }
        both(X - 1, Y + 6, C.tongueLine); both(X - 1, Y + 7, C.tongueLine);
      }
    }
  };
  // A rounded paw centred on design x with its sole on design row y (the
  // bottom of the row), with two toe lines.
  const paw = (cx, y, c) => {
    ell(cx, y - 0.4, 1.5, 0.9, c);
    const X = Math.round(cx * F), Y = Math.round((y + 1) * F) - 1;
    [X - 2, X + 1].forEach((x) => { dot(x, Y, C.lightShade); dot(x, Y - 1, C.lightShade); });
  };
  let heartAt = [9, 0];

  if (p.pose === 'lie') {
    if (cat) line([[5, 20], [2, 21], [4, 22], [9, 22]], 1.1, C.fur);
    else line([[5, 19], [2, 17 + sw]], 1.2, C.fur);
    ell(11, 19 - (p.breath ? 0.25 : 0), 7.5, 3.3 + (p.breath ? 0.3 : 0), C.fur);
    if (cat) [[8, 16], [10, 16], [12, 16]].forEach(([x, y]) => stripe(x, y));
    else ell(9, 18, 2, 1.3, C.dark);
    paw(18.3, 22, C.light); paw(21.3, 22, C.light);
    if (cat) {
      catFace(18.5, 17.2);
    } else {
      dogFace(18.5, 17.2);
    }
    heartAt = [12, 8];
  } else if (p.pose === 'stand') {
    // Walk cycle: 8 frames of a diagonal gait (far back with near front,
    // near back with far front). Each leg swings forward lifted and pushes
    // back planted; the body bobs up as the legs pass under it.
    const phase = ((p.leg || 0) / 8) * Math.PI * 2;
    const by = -0.5 * Math.round(Math.abs(Math.cos(phase)));
    // Each leg pivots at a fixed hip or shoulder joint inside the body and
    // only the foot swings, so a leg is never pulled away from the body.
    const legs = [[6, C.far, 0], [8.8, C.fur, Math.PI], [15.2, C.far, Math.PI], [17.6, C.fur, 0]].map(([jx, c, off], i) => ({
      jx, c, near: i % 2 === 1,
      dx: Math.round(Math.sin(phase + off) * 2.2) / 2,
      lift: Math.round(Math.max(0, Math.cos(phase + off)) * 2) / 2,
    }));
    const leg = (l) => {
      const fx = l.jx + l.dx;
      ell(l.jx, 17.4 + by, 1.8, 1.9, l.c);
      line([[l.jx, 17.6 + by], [(l.jx + fx) / 2, 19.6 - l.lift / 2], [fx, 21.2 - l.lift]], 1.05, l.c);
      paw(fx, 22 - l.lift, l.near ? C.light : C.lightShade);
    };
    legs.filter((l) => !l.near).forEach(leg);
    if (cat) line([[5, 15 + by], [2, 12 + sw + by], [2.5, 8 + sw * 1.5 + by]], 1.1, C.fur);
    else line([[5, 15 + by], [2.5 + sw * 1.5, 11 + by]], 1.2, C.fur);
    ell(11.5, 16 + by, 7, 3.4, C.fur);
    ell(12, 18.2 + by, 4, 1.1, C.light);
    ell(7, 16.6 + by, 2.9, 2.5, C.fur); // haunch
    ell(17, 15.8 + by, 2.9, 2.8, C.fur); // chest and shoulder, up to the neck
    legs.filter((l) => l.near).forEach(leg);
    if (cat) {
      [[9, 13], [11, 13], [13, 13]].forEach(([x, y]) => stripe(x, y + by));
      ell(19, 11 + by, 4, 3.6, C.fur);
      tri([15.8, 9 + by], [16.6, 4.8 + by], [18.6, 8 + by], C.fur);
      tri([19.6, 8 + by], [21.6, 4.8 + by], [22.4, 9.4 + by], C.fur);
      set(17, 7 + by, C.ear); set(21, 7 + by, C.ear);
      ell(21.4, 12.4 + by, 1.6, 1.2, C.light);
      set(23, 11 + by, C.nose);
      eyes(20, 11 + by);
      blush(19, 12 + by);
      whiskers(23, 11 + by);
    } else {
      ell(10, 14.5 + by, 2, 1.3, C.dark);
      ell(18.5, 11 + by, 3.8, 3.5, C.fur);
      ell(22.2, 12.4 + by, 2, 1.6, C.light);
      set(23, 11 + by, C.nose); set(24, 11 + by, C.nose);
      ell(16.5, 12 + by, 1.4, 2.8, C.ear);
      eyes(19, 11 + by);
      collar([[15.3, 12.2 + by], [16.4, 14.6 + by]], 16.6, 15 + by);
      if (p.mouth === 'tongue') { set(21, 14 + by, C.eye); rect(22, 14 + by, 22, 15 + by, PET_TONGUE); }
    }
    heartAt = [10, 1];
  } else {
    // Sitting.
    if (cat) line([[6, 21], [2.5, 21], [1.5 + sw * 0.8, 17], [2.5 + sw * 1.5, 13.5]], 1.1, C.fur);
    else line([[6, 18], [3 + sw * 1.8, 13.5]], 1.2, C.fur);
    ell(9, 19, 5, 3.6, C.fur);
    ell(11.5, 16 - (p.breath ? 0.25 : 0), 4.3, 5.2 + (p.breath ? 0.25 : 0), C.fur);
    ell(14, 17, 2, 3.8, C.light);
    paw(10.8, 22, C.light);
    if (!p.paw) { rect(13, 18, 15, 21.4, C.light); paw(14.5, 22, C.light); }
    else if (!cat) line([[14, 19], [16, 15], [18.5, 13]], 1.2, C.light);
    const hy = 9.5 + (p.headDown ? 1 : 0) - (p.breath ? 0.5 : 0);
    if (cat) {
      [[7, 17], [8, 15], [10, 12]].forEach(([x, y]) => stripe(x, y));
      catFace(15.5, hy);
    } else {
      ell(9, 17, 1.8, 1.5, C.dark);
      collar([[12.6, hy + 3.4], [18.2, hy + 3.6]], 15.2, hy + 4.1);
      dogFace(15.5, hy - 0.4);
    }
  }

  G.shade({ [C.fur]: [C.hi, C.shade], [C.light]: [null, C.lightShade] });
  G.outline(C.line);
  after.forEach((draw) => draw());
  if (p.pose === 'lie' && p.z) {
    [[12, 9, ['###', '..#', '.#.', '###']], [7, 5, ['####', '..#.', '.#..', '####']], [2, 0, ['####', '..#.', '.#..', '####']]]
      .slice(0, p.z).forEach(([x, y, rows]) => G.pattern(x, y, rows, PET_ZZZ));
  }
  if (p.heart) G.pattern(heartAt[0], heartAt[1], ['.#.#.', '#####', '#####', '.###.', '..#..'], PET_HEART);
  return G.g;
}

// The cat's cushion (CUSHION_W×CUSHION_H) or the dog's house (HOUSE_W×HOUSE_H).
function homeSprite(kind) {
  if (kind === 'cat') {
    const K = HOME_COLORS.cushion;
    const G = pixelGrid(CUSHION_W, CUSHION_H);
    G.ell(11, 4, 10, 3, K.base);
    G.rect(1.5, 4, 20, 5.5, K.base);
    G.ell(11, 5.8, 10.2, 1.4, K.base);
    G.shade({ [K.base]: [K.hi, K.shade] });
    // Button tufts pulling the fabric in.
    [[11, 7], [22, 6], [33, 7]].forEach(([x, y]) => {
      G.dot(x - 1, y, K.tuft); G.dot(x, y + 1, K.tuft); G.dot(x + 1, y, K.tuft); G.dot(x, y + 2, K.hi);
    });
    G.hline(4, 11, 39, 11, K.piping);
    G.outline(K.line);
    return { px: G.g, w: CUSHION_W, h: CUSHION_H };
  }
  const K = HOME_COLORS.house;
  const G = pixelGrid(HOUSE_W, HOUSE_H);
  G.rect(2.5, 9, 19.5, 19, K.wall);
  G.rect(8, 15, 14, 19, K.door);
  G.ell(11.5, 15, 3.5, 2.6, K.door);
  G.shade({ [K.wall]: [K.wallHi, K.wallShade] });
  [26, 33].forEach((y) => { G.hline(6, y, 15, y, K.plank); G.hline(30, y, 39, y, K.plank); });
  G.tri([0.6, 10.8], [11.5, 0.8], [22.4, 10.8], K.roof);
  G.shade({ [K.roof]: [K.roofHi, K.roofShade] });
  G.hline(2, 21, 43, 21, K.trim);
  G.outline(K.line);
  return { px: G.g, w: HOUSE_W, h: HOUSE_H };
}

function paint(canvas, px, w) {
  const ctx = canvas.getContext('2d');
  const s = canvas.width / w;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < px.length; i++) {
    if (!px[i]) continue;
    ctx.fillStyle = px[i];
    ctx.fillRect((i % w) * s, Math.floor(i / w) * s, s, s);
  }
}


export { PET_W, PET_H, PET_F, petSprite, homeSprite, paint, CUSHION_W, CUSHION_H, CUSHION_LIFT, HOUSE_W, HOUSE_H, HOUSE_GAP };
