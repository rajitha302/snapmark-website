import { GITHUB_URL, MARKETPLACE_URL } from '@/lib/links';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 text-sm text-[var(--color-fg-muted)] sm:flex-row sm:items-center">
        <div>
          © {new Date().getFullYear()} Snapmark · MIT ·{' '}
          <span className="text-[var(--color-fg)]/80">100% local — no telemetry, no network.</span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[var(--color-fg)]"
          >
            GitHub
          </a>
          <a
            href={MARKETPLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[var(--color-fg)]"
          >
            Marketplace
          </a>
        </div>
      </div>
    </footer>
  );
}
