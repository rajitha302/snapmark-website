'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SHORTCUT_MAC, SHORTCUT_WIN } from '@/lib/links';

const steps = [
  {
    title: 'Copy a screenshot',
    body: 'Use the screenshot tool you already have: ⌃⇧⌘4 on macOS, Win+Shift+S on Windows, any snipper on Linux. A pencil lights up in VS Code’s status bar.',
  },
  {
    title: 'Annotate in VS Code',
    body: `Press ${SHORTCUT_MAC} (${SHORTCUT_WIN}). The editor opens on your screenshot: hide what’s private, number the steps, point, comment, measure.`,
  },
  {
    title: 'Paste into any AI chat',
    body: 'Hit Copy, then paste into Claude Code, Copilot Chat, Cursor, Codex — anything that takes a pasted image. Big Retina shots are shrunk on the way so they don’t eat tokens.',
  },
];

const loop = (duration: number, times: number[]) => ({ duration, times, repeat: Infinity, ease: 'easeInOut' as const });

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section id="how" className="relative">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <div className="max-w-2xl">
          <p className="section-kicker">The whole workflow</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">How Snapmark works</h2>
          <p className="mt-4 text-lg text-[var(--color-fg-muted)]">
            Three moves, and no new app to learn. Snapmark never touches your agent’s window: it works through the
            clipboard, so it fits every tool you use.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <ol className="space-y-6 lg:space-y-0">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                onViewportEnter={() => setActive(i)}
                viewport={{ amount: 0.6 }}
                className={`story-step lg:flex lg:min-h-[70vh] lg:items-center ${active === i ? 'is-active' : ''}`}
              >
                <div>
                  <div className="story-num">{i + 1}</div>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">{s.title}</h3>
                  <p className="mt-3 max-w-md text-[var(--color-fg-muted)] leading-relaxed">{s.body}</p>
                  <div className="mt-8 lg:hidden">
                    <Stage step={i} />
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>

          <div className="hidden lg:block">
            <div className="sticky top-[18vh]">
              <Stage step={active} />
              <div className="mt-5 flex justify-center gap-2" aria-hidden>
                {steps.map((s, i) => (
                  <span key={s.title} className={`story-dot ${active === i ? 'is-on' : ''}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stage({ step }: { step: number }) {
  return (
    <div className="story-stage">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {step === 0 ? <SceneCopy /> : step === 1 ? <SceneAnnotate /> : <ScenePaste />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// 1 · A crosshair drags out a region, the shutter flashes, and it lands on
// the clipboard.
function SceneCopy() {
  const reduced = useReducedMotion();
  const t = loop(4.2, [0, 0.12, 0.45, 0.52, 0.58, 0.9, 1]);
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="scene-window relative h-[62%] w-[78%]">
        <div className="scene-bar"><span /><span /><span /></div>
        <div className="grid grid-cols-3 gap-3 p-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-white/[0.06]" />
          ))}
        </div>
        <motion.div
          className="absolute rounded-[3px] border-[1.5px] border-dashed border-white/80 bg-white/[0.06]"
          style={{ left: '14%', top: '30%' }}
          animate={reduced ? { width: '58%', height: '46%' } : { width: ['0%', '0%', '58%', '58%', '58%', '58%', '0%'], height: ['0%', '0%', '46%', '46%', '46%', '46%', '0%'], opacity: [1, 1, 1, 1, 0, 0, 0] }}
          transition={t}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-white"
          animate={reduced ? { opacity: 0 } : { opacity: [0, 0, 0, 0.7, 0, 0, 0] }}
          transition={t}
        />
      </div>
      <motion.div
        className="scene-chip absolute bottom-[9%]"
        animate={reduced ? { opacity: 1, y: 0 } : { opacity: [0, 0, 0, 0, 1, 1, 0], y: [16, 16, 16, 16, 0, 0, 8] }}
        transition={t}
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M16 5h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" /></svg>
        Screenshot copied to clipboard
      </motion.div>
      <div className="absolute top-[8%] flex gap-1.5">
        {['⌃', '⇧', '⌘', '4'].map((k) => <kbd key={k} className="kbd">{k}</kbd>)}
      </div>
    </div>
  );
}

// 2 · VS Code's status bar lights the pencil; the shortcut opens the editor.
function SceneAnnotate() {
  const reduced = useReducedMotion();
  const t = loop(4.6, [0, 0.2, 0.35, 0.5, 0.85, 1]);
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="scene-window relative h-[78%] w-[86%] overflow-hidden">
        <div className="scene-bar"><span /><span /><span /><em>app.tsx — my-project</em></div>
        <div className="flex h-[calc(100%-62px)]">
          <div className="w-10 border-r border-white/5 bg-black/20" />
          <div className="flex-1 space-y-2.5 p-5">
            {[62, 80, 44, 70, 52, 88, 38].map((w, i) => (
              <div key={i} className="flex gap-2">
                <span className="h-2 w-5 rounded bg-white/10" />
                <span className="h-2 rounded" style={{ width: `${w}%`, background: i % 3 === 0 ? 'rgba(173,140,255,.35)' : i % 3 === 1 ? 'rgba(110,190,255,.3)' : 'rgba(255,255,255,.14)' }} />
              </div>
            ))}
          </div>
        </div>
        <div className="scene-status">
          <span>main</span>
          <span className="ml-auto" />
          <motion.span
            className="scene-armed"
            animate={reduced ? {} : { boxShadow: ['0 0 0 0 rgba(236,220,178,0)', '0 0 0 6px rgba(236,220,178,.18)', '0 0 0 0 rgba(236,220,178,0)'] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            ✎ Annotate
          </motion.span>
        </div>
        <motion.div
          className="scene-mini-editor absolute"
          style={{ right: '6%', bottom: '14%', transformOrigin: '90% 100%' }}
          animate={reduced ? { scale: 1, opacity: 1 } : { scale: [0.2, 0.2, 0.2, 1, 1, 0.2], opacity: [0, 0, 0, 1, 1, 0] }}
          transition={t}
        >
          <div className="scene-mini-pill" />
          <div className="scene-mini-shot">
            <span className="scene-mini-hide" />
            <span className="scene-mini-marker">1</span>
            <span className="scene-mini-marker !left-[68%] !top-[58%]">2</span>
          </div>
          <span className="scene-mini-copy">Copy</span>
        </motion.div>
      </div>
      <motion.div
        className="absolute top-[3%] flex gap-1.5"
        animate={reduced ? {} : { y: [0, 0, 3, 0, 0, 0] }}
        transition={t}
      >
        {['⌘', '⇧', 'A'].map((k) => <kbd key={k} className="kbd">{k}</kbd>)}
      </motion.div>
    </div>
  );
}

// 3 · The marked-up image drops into the chat, and the agent knows exactly
// which part you mean.
function ScenePaste() {
  const reduced = useReducedMotion();
  const t = loop(5.4, [0, 0.16, 0.3, 0.42, 0.88, 1]);
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="scene-window relative flex h-[82%] w-[80%] flex-col">
        <div className="scene-bar"><span /><span /><span /><em>AI chat</em></div>
        <div className="flex flex-1 flex-col justify-end gap-3 p-5">
          <motion.div
            className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-white/[0.07] p-2.5"
            animate={reduced ? { opacity: 1 } : { opacity: [0, 0, 1, 1, 1, 0], y: [10, 10, 0, 0, 0, 0] }}
            transition={t}
          >
            <div className="scene-thumb" />
            <p className="mt-2 px-1 text-[13px]">Why does this reset after Save?</p>
          </motion.div>
          <motion.div
            className="max-w-[85%] text-[13px] leading-relaxed text-[var(--color-fg-muted)]"
            animate={reduced ? { opacity: 1 } : { opacity: [0, 0, 0, 1, 1, 0] }}
            transition={t}
          >
            <span className="font-semibold text-[var(--color-fg)]">Agent</span> · Looking at step 2: the Save handler
            re-reads the form before the toggle&rsquo;s state is committed…
          </motion.div>
        </div>
        <div className="m-4 mt-0 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 p-2">
          <motion.div
            className="scene-thumb !h-9 !w-14 shrink-0"
            animate={reduced ? { opacity: 0 } : { opacity: [0, 1, 0, 0, 0, 0], scale: [0.6, 1, 1, 1, 1, 1], y: [-30, 0, 0, 0, 0, 0] }}
            transition={t}
          />
          <span className="text-[13px] text-[var(--color-fg-muted)]">Message your agent…</span>
          <kbd className="kbd ml-auto">⌘V</kbd>
        </div>
      </div>
    </div>
  );
}
