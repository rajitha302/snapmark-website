import { GITHUB_URL, MARKETPLACE_URL, SHORTCUT_MAC } from '@/lib/links';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(236,220,178,0.18),_transparent_60%)]"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-24 pb-10 sm:pt-32 sm:pb-12 lg:grid-cols-2 lg:gap-16">
        <div className="text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1 text-xs text-[var(--color-fg-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            VS Code extension · v1.0
          </div>

          <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Annotate screenshots before pasting them into any AI chat.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-[var(--color-fg-muted)] lg:mx-0">
            Snapmark sits in your clipboard. Copy a screenshot, hit{' '}
            <kbd
              className="inline-block rounded border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-1.5 py-0.5 font-[var(--font-mono)] text-sm text-[var(--color-fg)]"
              aria-label="Command Shift A"
            >
              {SHORTCUT_MAC}
            </kbd>
            , draw on it, and paste into Claude, Copilot, Cursor — anything.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href={MARKETPLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary rounded-md px-5 py-2.5 text-sm font-semibold tracking-tight"
            >
              Install from Marketplace
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary rounded-md px-5 py-2.5 text-sm font-medium"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 shadow-2xl shadow-black/40 lg:mx-0">
          <video
            src="/media/hero.mp4"
            poster="/media/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Snapmark annotating a screenshot with numbered callouts, arrows, and a blurred region"
            className="aspect-[724/806] w-full rounded-lg bg-[var(--color-bg)] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
