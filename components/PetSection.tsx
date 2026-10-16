'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { CUSHION_H, CUSHION_LIFT, CUSHION_W, HOUSE_GAP, HOUSE_H, HOUSE_W, PET_H, PET_W, homeSprite, paint, petSprite } from '@/lib/petSprite';

const S = 2; // CSS px per pet detail pixel (the editor draws them at 1)

export default function PetSection() {
  return (
    <section id="pet" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-kicker">One more thing</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">And yes, it comes with a pet.</h2>
          <p className="mt-4 text-lg text-[var(--color-fg-muted)]">
            A tiny pixel cat lives in the corner of the editor. It naps, grooms, wanders off now and then, and never
            ends up in your screenshots. Prefer a dog? Right-click to swap. Prefer neither? One setting.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="pet-stage relative mx-auto mt-14 h-[280px] max-w-4xl"
        >
          <Pet kind="cat" side="left" />
          <Pet kind="dog" side="right" />
          <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-xs text-[var(--color-fg-muted)]">
            Go on, click them.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

type Kind = 'cat' | 'dog';
const TRICKS: Record<Kind, string[]> = { cat: ['groom', 'groom', 'yawn', 'look'], dog: ['pant', 'pant', 'wag', 'look'] };
const ACT_MS: Record<string, number> = { groom: 2600, pant: 3200, wag: 2000, yawn: 1300, look: 1300 };
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(l: T[]) => l[Math.floor(Math.random() * l.length)];

// A smaller cousin of the editor's pet loop: sit, a trick, a nap, or a short
// wander and back, plus click to pet.
function Pet({ kind, side }: { kind: Kind; side: 'left' | 'right' }) {
  const wrap = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const homeCv = useRef<HTMLCanvasElement>(null);
  const inView = useInView(wrap, { amount: 0.2 });
  const inViewRef = useRef(false);
  inViewRef.current = inView;
  const reduced = useReducedMotion();
  const st = useRef({
    act: 'sit', until: 0, x: 0, target: 0, speed: 60, facing: side === 'left' ? 1 : -1,
    walked: 0, blinkAt: -1e9, heartUntil: 0, queue: [] as Record<string, unknown>[], drawn: '',
  });

  const homeW = (kind === 'cat' ? CUSHION_W : HOUSE_W) * S;
  const homeH = (kind === 'cat' ? CUSHION_H : HOUSE_H) * S;
  // The cat sits on its cushion; the dog sits beside its house, on the side
  // facing the middle of the room.
  const petOffset = kind === 'cat' ? 2 * S : side === 'left' ? HOUSE_GAP * S : (HOUSE_W - HOUSE_GAP) * S - PET_W * S;

  useEffect(() => {
    const dpr = Math.max(1, Math.round(window.devicePixelRatio || 1));
    const home = homeSprite(kind);
    const hc = homeCv.current!;
    hc.width = home.w * S * dpr;
    hc.height = home.h * S * dpr;
    paint(hc, home.px, home.w);
    const c = cv.current!;
    c.width = PET_W * S * dpr;
    c.height = PET_H * S * dpr;

    const s = st.current;
    let raf = 0;
    let last = performance.now();
    const plan = () => {
      const r = Math.random();
      const dir = side === 'left' ? 1 : -1;
      if (!reduced && r < 0.22) {
        const far = dir * rand(70, 190);
        return [{ walk: far }, { act: 'sit', ms: rand(1200, 3000) }, { act: pick(TRICKS[kind]) }, { walk: 0 }];
      }
      if (r < 0.4) return [{ act: 'sleep', ms: rand(6000, 12000) }, { act: 'yawn' }];
      return [{ act: 'sit', ms: rand(2500, 6000) }, { act: pick(TRICKS[kind]) }];
    };
    const next = (now: number) => {
      if (!s.queue.length) s.queue = plan();
      const step = s.queue.shift()!;
      if (step.walk !== undefined) {
        s.act = 'walk';
        s.target = step.walk as number;
        s.speed = rand(45, 70);
        if (s.target !== s.x) s.facing = s.target > s.x ? 1 : -1;
      } else {
        s.act = step.act as string;
        s.until = now + ((step.ms as number) || ACT_MS[s.act] || 3000);
        if (s.act === 'look') s.facing = -s.facing;
        if (s.act !== 'look' && s.x === 0) s.facing = side === 'left' ? 1 : -1;
      }
    };
    next(last);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(100, now - last);
      last = now;
      if (!inViewRef.current) return;
      if (s.act === 'walk') {
        const d = s.target - s.x;
        const step = (s.speed * dt) / 1000;
        if (Math.abs(d) <= step) { s.x = s.target; next(now); } else { s.x += Math.sign(d) * step; s.walked += step / S; }
      } else if (now >= s.until) next(now);
      if (s.act === 'sit' && now - s.blinkAt > 2000 && Math.random() < (dt / 1000) * 0.35) s.blinkAt = now;

      const lift = kind === 'cat' ? CUSHION_LIFT * S * Math.max(0, 1 - Math.abs(s.x) / 30) : 0;
      body.current!.style.transform = `translate3d(${s.x}px, ${-lift}px, 0)`;

      const t = now / 125;
      const q = (v: number) => Math.round(v * 4) / 4;
      const p: Record<string, unknown> = {
        pose: 'sit', swing: q(Math.sin(t * (kind === 'dog' ? 0.9 : 0.35)) * 0.7),
        eyes: now - s.blinkAt < 180 ? 'shut' : 'open', mouth: 'shut', heart: now < s.heartUntil,
      };
      if (s.act === 'groom') Object.assign(p, { paw: Math.floor(t / 2) % 2 === 0, headDown: true, eyes: 'shut' });
      if (s.act === 'yawn') Object.assign(p, { mouth: 'open', eyes: 'shut' });
      if (s.act === 'pant') Object.assign(p, { mouth: 'tongue', swing: q(Math.sin(t * 1.6)) });
      if (s.act === 'wag') p.swing = Math.floor(t) % 2 ? 1 : -1;
      if (s.act === 'walk') {
        const leg = Math.floor(s.walked / 2.5) % 8;
        Object.assign(p, { pose: 'stand', leg, swing: q(Math.sin((leg / 8) * Math.PI * 2) * 0.5), mouth: kind === 'dog' ? 'tongue' : 'shut' });
      }
      if (s.act === 'sleep') Object.assign(p, { pose: 'lie', eyes: 'shut', z: Math.floor(t / 5) % 4, swing: 0 });
      if (s.act !== 'walk' && !reduced) p.breath = Math.sin(now / (s.act === 'sleep' ? 700 : 520)) > 0.3;
      if (reduced) p.swing = 0;
      const key = JSON.stringify(p) + s.facing;
      if (key === s.drawn) return;
      s.drawn = key;
      paint(c, petSprite(kind, p), PET_W);
      c.style.transform = s.facing < 0 ? 'scaleX(-1)' : '';
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [kind, side, reduced]);

  const onClick = () => {
    const s = st.current;
    const now = performance.now();
    if (s.act === 'sleep') { s.queue.unshift({ act: 'yawn' }); s.until = 0; return; }
    s.heartUntil = now + 1200;
    if (!reduced && s.act !== 'walk' && Math.random() < 0.3) {
      s.queue = [{ walk: (side === 'left' ? 1 : -1) * rand(80, 170) }, { act: 'sit', ms: 1800 }, { walk: 0 }];
      s.until = 0;
    } else if (kind === 'dog' && s.act === 'sit') {
      s.queue.unshift({ act: 'wag' });
      s.until = 0;
    }
    if (reduced) return;
    const el = cv.current!;
    el.classList.remove('pet-hop');
    void el.offsetWidth;
    el.classList.add('pet-hop');
  };

  // Near the edges on narrow screens, about a sixth of the way in on wide ones.
  const inset = 'max(4%, calc(50% - 300px))';
  const anchor = side === 'left' ? { left: inset } : { right: inset };
  return (
    <div ref={wrap} className="absolute bottom-[54px]" style={{ ...anchor, width: homeW, height: homeH }}>
      <canvas ref={homeCv} aria-hidden className="pet-home absolute bottom-0 left-0" style={{ width: homeW, height: homeH }} />
      <div ref={body} className="absolute bottom-[-2px]" style={{ left: petOffset, width: PET_W * S, height: PET_H * S }}>
        <button
          type="button"
          onClick={onClick}
          aria-label={`Pet the ${kind}`}
          className="pet-btn block h-full w-full"
        >
          <canvas ref={cv} aria-hidden className="block h-full w-full [image-rendering:pixelated]" />
        </button>
      </div>
    </div>
  );
}
