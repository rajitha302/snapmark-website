import Image from 'next/image';
import { GITHUB_URL, MARKETPLACE_URL } from '@/lib/links';

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2.5" aria-label="Snapmark home">
          <Image
            src="/media/nav-logo.webp"
            alt=""
            width={28}
            height={28}
            className="rounded-md"
            priority
            unoptimized
          />
          <span className="text-base font-semibold tracking-tight">Snapmark</span>
        </a>

        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm text-[var(--color-fg-muted)] transition hover:text-[var(--color-fg)] sm:inline"
          >
            GitHub
          </a>
          <a
            href={MARKETPLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary rounded-md px-3.5 py-1.5 text-sm font-semibold tracking-tight"
          >
            Install
          </a>
        </div>
      </nav>
    </header>
  );
}
