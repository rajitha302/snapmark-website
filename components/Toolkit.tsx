'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Toolkit() {
  return (
    <section id="toolkit" className="relative">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <div className="max-w-2xl">
          <p className="section-kicker">The toolkit</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Everything you reach for, one key away.</h2>
          <p className="mt-4 text-lg text-[var(--color-fg-muted)]">
            Go on, play with them. These are the real tools, just smaller.
          </p>
        </div>

        <div className="mt-14 grid auto-rows-[minmax(220px,auto)] gap-4 md:grid-cols-4">
          <Tile className="md:col-span-2 md:row-span-2" title="Compare" k="Upload → Compare" body="Put the design next to what shipped, labelled Actual and Expected, for “make it look like this”.">
            <CompareDemo />
          </Tile>
          <Tile className="md:col-span-2" title="Spotlight" k="S" body="Dim everything except the part that matters.">
            <SpotlightDemo />
          </Tile>
          <Tile title="Measure" k="U" body="Drag the box. Distances in real CSS pixels.">
            <MeasureDemo />
          </Tile>
          <Tile title="Color picker" k="I" body="Label any pixel’s exact hex.">
            <PickerDemo />
          </Tile>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {SMALL.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease }}
              className="tool-chip group"
            >
              <div className="flex items-center justify-between">
                <span className="tool-chip-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
                </span>
                <kbd className="kbd !text-[11px]">{t.k}</kbd>
              </div>
              <h3 className="mt-4 text-[15px] font-semibold">{t.title}</h3>
              <p className="mt-1 text-[13px] leading-snug text-[var(--color-fg-muted)]">{t.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SMALL = [
  { title: 'Comment bubbles', k: 'M', body: 'Figma-style notes that point at a spot.', icon: <path d="M5 19v-7a7 7 0 1 1 7 7z" /> },
  { title: 'Arrows', k: 'A · D', body: 'One-way or two-way, heads that scale.', icon: <><path d="M6 18 18 6" /><path d="M9 6h9v9" /></> },
  { title: 'Highlight', k: 'H', body: 'A translucent marker over anything.', icon: <><path d="M9 11l-5 5v3h3l5-5" /><path d="M20 11.5 16 15.5a2 2 0 0 1-2.8 0L9 11.2l5.3-5.3 5.7 5.7z" /></> },
  { title: 'Shapes & pen', k: 'R · E · P', body: 'Boxes, ellipses and freehand.', icon: <><rect x="3" y="5" width="11" height="9" rx="2" /><circle cx="16.5" cy="15.5" r="4.5" /></> },
  { title: 'Text', k: 'T', body: 'Type labels anywhere on the image.', icon: <><path d="M5 7V5h14v2" /><path d="M12 5v14" /><path d="M9 19h6" /></> },
  { title: 'Crop', k: 'C', body: 'Trim to just the part you mean.', icon: <><path d="M6 3v13a2 2 0 0 0 2 2h13" /><path d="M18 21V8a2 2 0 0 0-2-2H3" /></> },
  { title: 'Paste images in', k: '⌘V', body: 'Drop a second image onto the canvas.', icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><rect x="11" y="11" width="8" height="8" rx="1.5" /></> },
  { title: 'Your toolbar, your way', k: 'drag', body: 'Dock it on any edge, reorder the tools.', icon: <><circle cx="9" cy="6" r="1.4" /><circle cx="15" cy="6" r="1.4" /><circle cx="9" cy="12" r="1.4" /><circle cx="15" cy="12" r="1.4" /><circle cx="9" cy="18" r="1.4" /><circle cx="15" cy="18" r="1.4" /></> },
];

function Tile({ className = '', title, k, body, children }: { className?: string; title: string; k: string; body: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease }}
      className={`tool-tile ${className}`}
    >
      <div className="tool-tile-demo">{children}</div>
      <div className="flex items-start justify-between gap-3 p-5 pt-4">
        <div>
          <h3 className="text-[15px] font-semibold">{title}</h3>
          <p className="mt-1 text-[13px] leading-snug text-[var(--color-fg-muted)]">{body}</p>
        </div>
        <kbd className="kbd shrink-0 !text-[11px]">{k}</kbd>
      </div>
    </motion.div>
  );
}

// A two-up of the design and what shipped, split by a draggable divider. It
// sweeps on its own until someone grabs it.
function CompareDemo() {
  const reduced = useReducedMotion();
  const pos = useMotionValue(50);
  const clip = useTransform(pos, (p) => `inset(0 ${100 - p}% 0 0)`);
  const left = useTransform(pos, (p) => `${p}%`);
  const box = useRef<HTMLDivElement>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched || reduced) return;
    const a = animate(pos, [50, 72, 30, 50], { duration: 7, repeat: Infinity, ease: 'easeInOut' });
    return () => a.stop();
  }, [touched, reduced, pos]);

  const setFrom = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    pos.set(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={box}
      className="compare relative h-full min-h-[300px] w-full cursor-ew-resize touch-none select-none"
      onPointerDown={(e) => { setTouched(true); e.currentTarget.setPointerCapture(e.pointerId); setFrom(e.clientX); }}
      onPointerMove={(e) => { if (e.buttons) setFrom(e.clientX); }}
      role="slider"
      aria-label="Compare actual and expected"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={50}
      tabIndex={0}
      onKeyDown={(e) => {
        const step = e.key === 'ArrowLeft' ? -5 : e.key === 'ArrowRight' ? 5 : 0;
        if (step) { setTouched(true); pos.set(Math.min(96, Math.max(4, pos.get() + step))); }
      }}
    >
      <MiniUI variant="expected" />
      <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
        <MiniUI variant="actual" />
      </motion.div>
      <span className="compare-tag left-4">Actual</span>
      <span className="compare-tag right-4">Expected</span>
      <motion.div className="compare-handle" style={{ left }}>
        <span>‹ ›</span>
      </motion.div>
    </div>
  );
}

// The same settings screen twice: the design (Expected) and what shipped
// (Actual), with the usual small differences in radius, spacing and colour.
function MiniUI({ variant }: { variant: 'actual' | 'expected' }) {
  const exp = variant === 'expected';
  const r = exp ? 16 : 6;
  return (
    <div className={`absolute inset-0 flex flex-col gap-4 p-6 pt-16 ${exp ? 'bg-[#f7f7fb]' : 'bg-[#eceef2]'}`}>
      <div className="bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,.08)]" style={{ borderRadius: r }}>
        <div className="h-3 w-28 rounded bg-[#111827]/80" />
        <div className="mt-2 h-2 w-44 rounded bg-[#111827]/25" />
        <div className="mt-5 flex items-center justify-between" style={{ gap: exp ? 24 : 6 }}>
          <div className="h-9 flex-1 border border-black/10" style={{ borderRadius: exp ? 10 : 4 }} />
          <div
            className="grid h-9 place-items-center px-4 text-[11px] font-semibold text-white"
            style={{ background: exp ? '#4f46e5' : '#6b7280', borderRadius: exp ? 999 : 4 }}
          >
            Save
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,.08)]" style={{ borderRadius: r }}>
        {['#f59e0b', '#10b981', '#6366f1', '#ec4899'].map((c, i) => (
          <div key={c} className="flex items-center border-b border-black/[0.05] last:border-0" style={{ gap: exp ? 12 : 6, padding: exp ? '10px 4px' : '6px 2px' }}>
            <span className="shrink-0 rounded-full" style={{ width: exp ? 26 : 22, height: exp ? 26 : 22, background: c }} />
            <span className="h-2 rounded bg-[#111827]/55" style={{ width: [90, 120, 80, 104][i] }} />
            <span className="ml-auto h-2 w-10 rounded bg-[#111827]/15" />
          </div>
        ))}
      </div>
    </div>
  );
}

// The spotlight follows the pointer; idle, it drifts between the bits that matter.
function SpotlightDemo() {
  const reduced = useReducedMotion();
  const x = useMotionValue(30);
  const y = useMotionValue(50);
  const mask = useTransform(() => `radial-gradient(ellipse 22% 34% at ${x.get()}% ${y.get()}%, transparent 96%, black 100%)`);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (hover || reduced) return;
    const a = animate(x, [30, 72, 52, 30], { duration: 8, repeat: Infinity, ease: 'easeInOut' });
    const b = animate(y, [50, 38, 66, 50], { duration: 8, repeat: Infinity, ease: 'easeInOut' });
    return () => { a.stop(); b.stop(); };
  }, [hover, reduced, x, y]);

  return (
    <div
      className="relative h-full min-h-[200px] w-full overflow-hidden"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        animate(x, ((e.clientX - r.left) / r.width) * 100, { duration: 0.25, ease: 'easeOut' });
        animate(y, ((e.clientY - r.top) / r.height) * 100, { duration: 0.25, ease: 'easeOut' });
      }}
    >
      <div className="absolute inset-0 grid grid-cols-3 gap-3 bg-[#f4f5f8] p-5">
        {['Revenue', 'Signups', 'Churn'].map((n, i) => (
          <div key={n} className="rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,.06)]">
            <div className="text-[10px] font-medium text-[#6b7280]">{n}</div>
            <div className="mt-1 text-lg font-semibold text-[#111827]">{['$48.2k', '1,284', '2.1%'][i]}</div>
            <div className="mt-3 flex h-10 items-end gap-1">
              {[40, 64, 52, 80, 70, 92].map((hgt, j) => (
                <span key={j} className="flex-1 rounded-sm" style={{ height: `${(hgt * (i + 2)) % 100 || 30}%`, background: i === 1 ? '#4f46e5' : '#c7d2fe' }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <motion.div className="absolute inset-0 bg-black/60" style={{ maskImage: mask, WebkitMaskImage: mask }} />
    </div>
  );
}

// Drag the right box; the measurement updates live.
function MeasureDemo() {
  const track = useRef<HTMLDivElement>(null);
  const dx = useMotionValue(0);
  const [gap, setGap] = useState(24);
  useMotionValueEvent(dx, 'change', (v) => setGap(Math.max(0, Math.round(24 + v / 2))));
  const lineW = useTransform(dx, (v) => 48 + v);

  return (
    <div ref={track} className="relative flex h-full min-h-[160px] w-full items-center bg-[#f4f5f8] px-6">
      <div className="h-16 w-16 rounded-lg border border-black/10 bg-white shadow-[0_2px_6px_rgba(0,0,0,.12)]" />
      <div className="relative" style={{ width: 0 }}>
        <motion.div className="measure-line" style={{ width: lineW }}>
          <span className="measure-pill">{gap} px</span>
        </motion.div>
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: -40, right: 90 }}
        dragElastic={0.08}
        dragMomentum={false}
        style={{ x: dx, marginLeft: 48 }}
        className="grid h-16 w-16 cursor-grab place-items-center rounded-lg bg-[#4f46e5] text-[10px] font-semibold text-white shadow-[0_6px_14px_rgba(79,70,229,.35)] active:cursor-grabbing"
      >
        drag
      </motion.div>
    </div>
  );
}

// A loupe that reads the colour under the pointer.
function PickerDemo() {
  const [p, setP] = useState({ x: 62, y: 40, on: false });
  const hex = colorAt(p.x / 100, p.y / 100);
  const cv = useRef<HTMLCanvasElement>(null);
  // Paint the field from colorAt() itself, so the hex always matches.
  useEffect(() => {
    const c = cv.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        ctx.fillStyle = colorAt(x / (c.width - 1), y / (c.height - 1));
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, []);
  return (
    <div
      className="picker relative h-full min-h-[160px] w-full cursor-crosshair overflow-hidden"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setP({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, on: true });
      }}
      onPointerLeave={() => setP((q) => ({ ...q, on: false }))}
    >
      <canvas ref={cv} width={90} height={40} className="absolute inset-0 h-full w-full" aria-hidden />
      <div className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
        <span className="picker-ring" style={{ background: hex }} />
        <span className="picker-pill">
          <span className="h-3 w-3 rounded-[3px] ring-1 ring-white/50" style={{ background: hex }} />
          {hex}
        </span>
      </div>
      {!p.on && <span className="absolute bottom-2 right-3 text-[10px] text-black/50">hover me</span>}
    </div>
  );
}

// Hue across, lightness down.
function colorAt(x: number, y: number) {
  const hue = x * 360;
  const light = 0.72 - y * 0.42;
  const s = 0.82;
  const a = s * Math.min(light, 1 - light);
  const f = (n: number) => {
    const k = (n + hue / 30) % 12;
    const c = light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}
