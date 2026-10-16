'use client';

import { motion, useReducedMotion, useSpring } from 'motion/react';
import { GITHUB_URL, MARKETPLACE_URL, SHORTCUT_MAC } from '@/lib/links';

const ease = [0.22, 1, 0.36, 1] as const;

// `demo` is the live editor (EditorDemo) and `backdrop` the WebGL silk
// (HeroShader), passed in from the page so each is its own client boundary.
export default function Hero({ demo, backdrop }: { demo: React.ReactNode; backdrop?: React.ReactNode }) {
  const reduced = useReducedMotion();
  // The demo window leans gently toward the pointer.
  const rx = useSpring(0, { stiffness: 120, damping: 18 });
  const ry = useSpring(0, { stiffness: 120, damping: 18 });
  const lean = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 5);
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7);
  };
  // Annotations land one after another, like someone marking up the headline.
  const at = (delay: number) => (reduced ? { duration: 0 } : { delay, duration: 0.7, ease });

  return (
    <section className="relative overflow-hidden">
      {backdrop}
      <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto max-w-6xl px-6 pt-36 pb-16 text-center sm:pt-44">
        <motion.a
          href="#toolkit"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={at(0)}
          className="eyebrow-chip mb-9 inline-flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-xs"
        >
          <span className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 font-semibold text-[var(--color-accent-fg)]">New</span>
          <span className="text-[var(--color-fg-muted)]">1.0.1 · Measure, Compare, Spotlight and a pet</span>
          <span aria-hidden className="text-[var(--color-fg-muted)]">→</span>
        </motion.a>

        <h1 className="relative mx-auto max-w-5xl text-balance text-[2.1rem] font-semibold leading-[1.06] min-[400px]:text-[2.4rem] tracking-[-0.035em] sm:text-6xl lg:text-[5.4rem]">
          <span aria-hidden className="relative inline-block w-0 align-top">
          <motion.span
            aria-hidden
            className="hero-marker"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={reduced ? { duration: 0 } : { delay: 0.55, type: 'spring', stiffness: 500, damping: 16 }}
          >
            1
          </motion.span>
          </span>
          Annotate screenshots{' '}
          <span className="relative inline-block whitespace-nowrap">
            <motion.span
              aria-hidden
              className="hero-highlight"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={at(0.9)}
            />
            <span className="relative">before pasting them</span>
          </span>{' '}
          into{' '}
          <span className="relative inline-block whitespace-nowrap">
            any AI chat.
            <svg aria-hidden className="hero-ring" viewBox="0 0 400 120" preserveAspectRatio="none" fill="none">
              <motion.path
                d="M24 70 C 18 30, 120 8, 210 12 C 300 15, 392 30, 384 70 C 377 104, 260 116, 180 113 C 90 110, 10 100, 22 62 C 30 40, 70 30, 98 26"
                stroke="url(#ring)"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={reduced ? { duration: 0 } : { delay: 1.3, duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
              />
              <defs>
                <linearGradient id="ring" x1="0" x2="1">
                  <stop offset="0" stopColor="#f3e2b3" />
                  <stop offset="1" stopColor="#d9b25c" />
                </linearGradient>
              </defs>
            </svg>
            <motion.span
              aria-hidden
              className="hero-bubble"
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { delay: 2.2, type: 'spring', stiffness: 380, damping: 20 }}
            >
              Claude, Copilot, Cursor…
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={at(0.25)}
          className="mx-auto mt-16 max-w-2xl text-pretty text-lg leading-relaxed text-[var(--color-fg-muted)] sm:text-xl"
        >
          Copy a screenshot, press{' '}
          <kbd className="kbd" aria-label="Command Shift A">{SHORTCUT_MAC}</kbd> in VS Code, mark it up, and paste it
          straight into your agent. Snapmark lives on your clipboard, so it works with every AI chat that takes an image.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={at(0.4)}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer" className="btn-primary rounded-full px-6 py-3 text-sm font-semibold tracking-tight">
            Install for VS Code — free
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary rounded-full px-6 py-3 text-sm font-medium">
            View on GitHub
          </a>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={at(0.6)}
          className="mt-5 text-xs tracking-wide text-[var(--color-fg-muted)]"
        >
          Open source · MIT · Nothing leaves your machine
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 12 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={reduced ? { duration: 0 } : { delay: 0.5, duration: 1.1, ease }}
        style={{ transformPerspective: 1400 }}
        className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6"
      >
        <div aria-hidden className="demo-halo" />
        <motion.div
          className="demo-frame"
          style={{ rotateX: rx, rotateY: ry, transformPerspective: 1600 }}
          onPointerMove={lean}
          onPointerLeave={() => { rx.set(0); ry.set(0); }}
        >
          <div className="demo-titlebar">
            <span /><span /><span />
            <em>Snapmark — Annotate</em>
          </div>
          {demo}
        </motion.div>
      </motion.div>
    </section>
  );
}
