import { GITHUB_URL, MARKETPLACE_URL } from '@/lib/links';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-10 text-sm text-[var(--color-fg-muted)]">
        <a
          href="https://www.producthunt.com/products/snapmark-3/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-snapmark-3"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Leave a review for Snapmark on Product Hunt"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1207929&theme=dark"
            alt="Snapmark — review on Product Hunt"
            width={250}
            height={54}
            style={{ width: 250, height: 54 }}
          />
        </a>

        <div className="flex flex-col items-start justify-between gap-6 w-full sm:flex-row sm:items-center">
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
      </div>
    </footer>
  );
}
