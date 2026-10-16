'use client';

import { motion, useReducedMotion } from 'motion/react';
import { GITHUB_URL } from '@/lib/links';

const facts = [
  ['No network calls', 'Snapmark never sends anything anywhere.'],
  ['No telemetry', 'No analytics, no usage pings, no crash uploads.'],
  ['No account', 'Install it and go. Nothing to sign in to.'],
  ['Open source', 'MIT licensed. Read every line on GitHub.'],
];

export default function Privacy() {
  const reduced = useReducedMotion();
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <div className="privacy-card grid gap-12 overflow-hidden p-8 sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="section-kicker">Private by design</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Your screenshots never leave your machine.</h2>
            <p className="mt-4 text-lg text-[var(--color-fg-muted)]">
              The image goes from your clipboard, through Snapmark, and back to your clipboard. That&rsquo;s the whole
              trip. You decide where it goes after that.
            </p>
            <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {facts.map(([t, d]) => (
                <div key={t}>
                  <dt className="flex items-center gap-2 text-sm font-semibold">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--color-accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    {t === 'Open source' ? <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="underline decoration-white/20 underline-offset-4 hover:decoration-[var(--color-accent)]">{t}</a> : t}
                  </dt>
                  <dd className="mt-1 pl-6 text-sm text-[var(--color-fg-muted)]">{d}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto aspect-[5/4] w-full max-w-md" aria-hidden>
            <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full" fill="none">
              {/* The loop: clipboard → Snapmark → clipboard */}
              <path id="trip" d="M80 210 C 140 120, 260 120, 320 210" stroke="rgba(236,220,178,.35)" strokeWidth="2" strokeDasharray="5 6" />
              <path d="M320 210 C 260 290, 140 290, 80 210" stroke="rgba(236,220,178,.35)" strokeWidth="2" strokeDasharray="5 6" />
              {!reduced && (
                <motion.circle
                  r="5"
                  fill="#ecdcb2"
                  style={{ offsetPath: "path('M80 210 C 140 120, 260 120, 320 210 C 260 290, 140 290, 80 210')" }}
                  animate={{ offsetDistance: ['0%', '100%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
              )}
              {/* The way out, closed */}
              <path d="M200 132 L200 52" stroke="rgba(255,255,255,.16)" strokeWidth="2" strokeDasharray="4 6" />
              <g transform="translate(200 40)">
                <path d="M-34 8a16 16 0 0 1 4-31 22 22 0 0 1 41-6 18 18 0 0 1 21 21 14 14 0 0 1-4 16z" stroke="rgba(255,255,255,.28)" strokeWidth="2" fill="rgba(255,255,255,.03)" />
                <motion.g
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 14 }}
                >
                  <circle cx="0" cy="-6" r="13" fill="#0a0a0f" stroke="#ecdcb2" strokeWidth="2" />
                  <path d="M-5 -11 L5 -1 M5 -11 L-5 -1" stroke="#ecdcb2" strokeWidth="2.4" strokeLinecap="round" />
                </motion.g>
              </g>
            </svg>
            <Node className="left-[6%] top-[56%]" label="Clipboard" icon={<><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M16 5h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" /></>} />
            <Node className="right-[6%] top-[56%]" label="Snapmark" gold icon={<><path d="M16 4a2.6 2.6 0 1 1 3.7 3.7L8 19.4 3 21l1.6-5z" /></>} />
            <span className="absolute left-1/2 top-[88%] -translate-x-1/2 whitespace-nowrap text-xs text-[var(--color-fg-muted)]">all on your computer</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Node({ className, label, icon, gold }: { className: string; label: string; icon: React.ReactNode; gold?: boolean }) {
  return (
    <div className={`absolute flex -translate-y-1/2 flex-col items-center gap-2 ${className}`}>
      <span className={`grid h-14 w-14 place-items-center rounded-2xl ${gold ? 'bg-[linear-gradient(#f3e2b3,#e2c47e)] text-[#1a1405]' : 'bg-white/[0.06] text-[var(--color-fg)] ring-1 ring-white/10'}`}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
      </span>
      <span className="text-xs font-medium text-[var(--color-fg-muted)]">{label}</span>
    </div>
  );
}
