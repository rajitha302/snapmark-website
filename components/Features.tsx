'use client';

import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Features() {
  return (
    <section id="features" className="relative">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-kicker">Made for AI chats</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Three things the marketplace doesn&rsquo;t ship.
          </h2>
          <p className="mt-4 text-lg text-[var(--color-fg-muted)]">
            Plenty of extensions edit images. Snapmark is built for one job: getting a screenshot into a model&rsquo;s
            head exactly the way you see it.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          <Card
            title="Blur sensitive regions"
            body="Hide API keys, tokens and personal details before the image leaves your machine. Snapmark covers them with a solid block, so there’s nothing to un-blur."
            demo={<HideDemo />}
          />
          <Card
            title="Numbered step callouts"
            body="Drop 1 · 2 · 3 markers to walk the model through a UI flow in order. No more “what am I looking at?” back-and-forth."
            demo={<StepsDemo />}
          />
          <Card
            title="Auto-compress on copy"
            body="Retina screenshots are resized to 1920px on the long edge when you copy, so vision models don’t spend tokens on pixels they can’t use."
            demo={<CompressDemo />}
          />
        </div>
      </div>
    </section>
  );
}

function Card({ title, body, demo }: { title: string; body: string; demo: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease }}
      className="feature-card group"
    >
      <div className="feature-demo">{demo}</div>
      <div className="p-6 pt-5">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">{body}</p>
      </div>
    </motion.div>
  );
}

// Shown on a light, screenshot-like panel so the solid block reads the way it
// does in a real screenshot.
function HideDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const reduced = useReducedMotion();
  const on = inView || reduced;
  return (
    <div ref={ref} className="w-full max-w-[290px] rounded-xl bg-[#fafafa] p-4 font-mono text-[12px] shadow-[0_12px_30px_rgba(0,0,0,.45)]">
      <div className="mb-3 flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-black/15" /><span className="h-2 w-2 rounded-full bg-black/15" /><span className="h-2 w-2 rounded-full bg-black/15" />
      </div>
      <div className="space-y-2.5">
        {[
          ['OPENAI_API_KEY', 'demo-key-7Gx2…Qe9L'],
          ['OWNER_EMAIL', 'priya@acme.dev'],
        ].map(([k, v], i) => (
          <div key={k} className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[#0451a5]">{k}</span>
            <span className="text-black/40">=</span>
            <span className="relative">
              <span className="text-[#a31515]">{v}</span>
              <motion.span
                className="absolute -inset-x-1 -inset-y-0.5 origin-left rounded-[2px] bg-[#111]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: on ? 1 : 0 }}
                transition={reduced ? { duration: 0 } : { delay: 0.3 + i * 0.35, duration: 0.55, ease }}
              />
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1.5"><span className="text-[#0451a5]">REGION</span><span className="text-black/40">=</span><span className="text-[#a31515]">us-east-1</span></div>
      </div>
    </div>
  );
}

function StepsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const reduced = useReducedMotion();
  const on = inView || reduced;
  const spots = [
    { x: 16, y: 26 },
    { x: 58, y: 54 },
    { x: 84, y: 22 },
  ];
  return (
    <div ref={ref} className="relative h-full w-full">
      <div className="absolute left-[8%] top-[18%] h-6 w-[22%] rounded-md bg-white/10" />
      <div className="absolute left-[44%] top-[46%] h-7 w-[28%] rounded-md bg-white/10" />
      <div className="absolute left-[74%] top-[14%] h-6 w-[18%] rounded-md bg-[#4f46e5]/70" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
        <motion.path
          d={`M${spots[0].x} ${spots[0].y} Q 36 70 ${spots[1].x} ${spots[1].y} T ${spots[2].x} ${spots[2].y}`}
          stroke="rgba(0,122,255,.55)"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: on ? 1 : 0 }}
          transition={reduced ? { duration: 0 } : { delay: 0.4, duration: 1.2, ease }}
        />
      </svg>
      {spots.map((s, i) => (
        <motion.span
          key={i}
          className="demo-marker absolute !h-7 !w-7 !text-[13px]"
          style={{ left: `calc(${s.x}% - 14px)`, top: `calc(${s.y}% - 14px)` }}
          initial={{ scale: 0 }}
          animate={{ scale: on ? 1 : 0 }}
          transition={reduced ? { duration: 0 } : { delay: 0.3 + i * 0.45, type: 'spring', stiffness: 520, damping: 16 }}
        >
          {i + 1}
        </motion.span>
      ))}
    </div>
  );
}

function CompressDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const reduced = useReducedMotion();
  const w = useMotionValue(5120);
  const h = useMotionValue(2880);
  const label = useTransform(() => `${Math.round(w.get())} × ${Math.round(h.get())}`);
  const k = useTransform(w, [5120, 1920], [1, 0.375]);
  const shrink = useTransform(k, (v) => `scale(${v})`);

  useEffect(() => {
    if (!inView && !reduced) return;
    const opts = reduced ? { duration: 0 } : { delay: 0.4, duration: 1.6, ease };
    const a = animate(w, 1920, opts);
    const b = animate(h, 1080, opts);
    return () => { a.stop(); b.stop(); };
  }, [inView, reduced, w, h]);

  return (
    <div ref={ref} className="relative grid h-full w-full place-items-center">
      <motion.div className="compress-frame" style={{ transform: shrink }}>
        <div className="compress-sky" />
      </motion.div>
      <motion.span className="absolute bottom-0 rounded-full bg-black/50 px-3 py-1 font-mono text-[12px] text-[var(--color-accent)] ring-1 ring-white/10">
        {label}
      </motion.span>
    </div>
  );
}
