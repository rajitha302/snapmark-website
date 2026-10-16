'use client';

import { motion, useReducedMotion } from 'motion/react';
import { MARKETPLACE_URL, SHORTCUT_MAC } from '@/lib/links';

// `mark` is the particle logo (ParticleMark), passed in from the page.
export default function FinalCTA({ mark }: { mark?: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <section id="install" className="relative overflow-hidden">
      <div aria-hidden className="cta-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto max-w-4xl px-6 pt-16 pb-32 text-center">
        {mark}
        <h2 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-7xl">
          Stop describing your screen.{' '}
          <span className="relative inline-block">
            Show it.
            <svg aria-hidden className="cta-underline" viewBox="0 0 300 30" preserveAspectRatio="none" fill="none">
              <motion.path
                d="M6 20 C 70 8, 160 6, 294 14"
                stroke="#ecdcb2"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: reduced ? 1 : 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
              />
            </svg>
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--color-fg-muted)]">
          Free and open source. Install it, copy a screenshot, press <kbd className="kbd">{SHORTCUT_MAC}</kbd>.
        </p>
        <div className="relative mt-10 inline-block">
          <a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer" className="btn-primary rounded-full px-8 py-4 text-base font-semibold tracking-tight">
            Install from Marketplace
          </a>
          <motion.span
            aria-hidden
            className="demo-marker cta-marker absolute"
            initial={{ scale: reduced ? 1 : 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 500, damping: 15 }}
          >
            1
          </motion.span>
        </div>
      </div>
    </section>
  );
}
