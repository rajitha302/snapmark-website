import { MARKETPLACE_URL } from '@/lib/links';

export default function FinalCTA() {
  return (
    <section id="install" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(236,220,178,0.12),_transparent_65%)]"
      />
      <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
          Stop describing your screen. Show it.
        </h2>
        <p className="mt-4 text-[var(--color-fg-muted)]">
          Free, open source, no telemetry.
        </p>
        <div className="mt-8">
          <a
            href={MARKETPLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary rounded-md px-6 py-3 text-base font-semibold tracking-tight"
          >
            Install from Marketplace
          </a>
        </div>
      </div>
    </section>
  );
}
