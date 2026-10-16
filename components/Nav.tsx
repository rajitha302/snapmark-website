'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { GITHUB_URL, MARKETPLACE_URL } from '@/lib/links';

// A floating glass pill, like the editor's own toolbars. It tightens a little
// once the page scrolls.
export default function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`nav-pill pointer-events-auto flex w-full max-w-3xl items-center justify-between rounded-full py-2 pr-2 pl-4 transition-[background,box-shadow,padding] duration-300 ${scrolled ? 'is-scrolled' : ''}`}
      >
        <a href="/" className="flex items-center gap-2.5" aria-label="Snapmark home">
          <Image src="/media/nav-logo.webp" alt="" width={26} height={26} className="rounded-md" priority unoptimized />
          <span className="text-[15px] font-semibold tracking-tight">Snapmark</span>
        </a>

        <div className="hidden items-center gap-6 text-sm text-[var(--color-fg-muted)] md:flex">
          <a href="/#how" className="transition hover:text-[var(--color-fg)]">How it works</a>
          <a href="/#toolkit" className="transition hover:text-[var(--color-fg)]">Toolkit</a>
          <a href="/#pet" className="transition hover:text-[var(--color-fg)]">The pet</a>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full px-3 py-1.5 text-sm text-[var(--color-fg-muted)] transition hover:text-[var(--color-fg)] sm:inline"
          >
            GitHub
          </a>
          <a
            href={MARKETPLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary rounded-full px-4 py-1.5 text-sm font-semibold tracking-tight"
          >
            Install
          </a>
        </div>
      </motion.nav>
    </header>
  );
}
