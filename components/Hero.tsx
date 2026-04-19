import { GITHUB_URL, MARKETPLACE_URL, SHORTCUT_MAC } from '@/lib/links';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(11,79,179,0.25),_transparent_60%)]"
      />
      <div className="mx-auto max-w-4xl px-6 py-28 text-center sm:py-36">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1 text-xs text-[var(--color-fg-muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          VS Code extension · v1.0
        </div>

        <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
          Annotate screenshots before pasting them into any AI chat.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-[var(--color-fg-muted)]">
          Snapmark sits in your clipboard. Copy a screenshot, hit{' '}
          <kbd
            className="inline-block rounded border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-1.5 py-0.5 font-[var(--font-mono)] text-sm text-[var(--color-fg)]"
            aria-label="Command Shift A"
          >
            {SHORTCUT_MAC}
          </kbd>
          , draw on it, and paste into Claude, Copilot, Cursor — anything.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={MARKETPLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)]"
          >
            Install from Marketplace
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition hover:bg-[var(--color-bg-elevated)]"
          >
            View on GitHub
          </a>
        </div>

        <div className="mt-16 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 shadow-2xl shadow-black/40">
          <div className="flex aspect-[16/9] items-center justify-center rounded-lg bg-[var(--color-bg)] text-sm text-[var(--color-fg-muted)]">
            Screenshot of the Snapmark annotator goes here
          </div>
        </div>
      </div>
    </section>
  );
}
