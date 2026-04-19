type Feature = {
  title: string;
  body: string;
  icon: React.ReactNode;
};

const features: Feature[] = [
  {
    title: 'Blur sensitive regions',
    body: 'Hide API keys, tokens, and PII before the image leaves your machine. No key survives the paste.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    title: 'Numbered step callouts',
    body: 'Drop 1 · 2 · 3 markers to walk the model through a UI flow in order. No more "what am I looking at" back-and-forth.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <circle cx="12" cy="12" r="9" />
        <path d="M10 9l2-2v10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Auto-compress on copy',
    body: 'Retina screenshots get resized to 1920px on the long edge so vision models don\'t burn tokens on pixels they can\'t use.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M4 14v6h6M20 10V4h-6M4 14L10 8M20 10l-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Three things the marketplace doesn&rsquo;t ship.
          </h2>
          <p className="mt-4 text-[var(--color-fg-muted)]">
            Snapmark is built for one workflow: annotating screenshots for AI agents. That&rsquo;s it.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 transition hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-border))]"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
