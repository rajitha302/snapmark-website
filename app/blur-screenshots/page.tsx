import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { MARKETPLACE_URL, SHORTCUT_MAC, SHORTCUT_WIN } from '@/lib/links';

export const metadata: Metadata = {
  title: 'Blur screenshots before sharing them with an AI chat',
  description:
    'Blur API keys, bearer tokens, and customer data out of screenshots before pasting them into Claude, Copilot, or Cursor. Snapmark is a VS Code extension that blurs sensitive regions on the clipboard, so the original pixels never leave your machine.',
  alternates: { canonical: '/blur-screenshots' },
};

export default function BlurScreenshots() {
  return (
    <>
      <Nav />
      <main>
        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-3xl px-6 pt-24 pb-16 sm:pt-32">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[var(--color-fg-muted)]">
              Snapmark · blur workflow
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Blur screenshots before you share them with an AI chat.
            </h1>
            <p className="mt-6 text-lg text-[var(--color-fg-muted)]">
              API keys, bearer tokens, customer emails, internal URLs — every screenshot you paste into an AI
              chat is a chance to leak one. Snapmark is a VS Code extension that blurs the regions you pick
              on the clipboard image itself, before the paste target ever sees it.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={MARKETPLACE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary rounded-md px-5 py-2.5 text-sm font-semibold tracking-tight"
              >
                Install from Marketplace
              </a>
              <a
                href="/"
                className="btn-secondary rounded-md px-5 py-2.5 text-sm font-medium"
              >
                See the full feature list
              </a>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <h2 className="text-3xl font-semibold tracking-tight">What gets blurred, and where</h2>
            <div className="mt-8 space-y-8 text-[var(--color-fg-muted)]">
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-fg)]">On your machine, on the clipboard</h3>
                <p className="mt-2">
                  Snapmark reads the clipboard image, you draw a blur rectangle, and it writes the pixelated
                  PNG back to the clipboard. The original bytes never hit a file, never hit a network. When
                  you Cmd+V, the receiving tool sees the sanitised image — there is no original left to leak.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-fg)]">Pixelate, not black-box</h3>
                <p className="mt-2">
                  The blur tool downscales and upscales the chosen region so the content is unreadable but
                  the surrounding layout is intact. Vision models still understand the rest of the screen,
                  which matters when you&rsquo;re asking about the UI around the secret, not the secret itself.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-fg)]">Nothing leaves VS Code</h3>
                <p className="mt-2">
                  The editor runs inside a VS Code webview. No backend, no telemetry, no auth. The only
                  network call involved is whatever the downstream AI chat makes when you paste — and by
                  then the pixels are already pixelated.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <h2 className="text-3xl font-semibold tracking-tight">Typical use cases</h2>
            <ul className="mt-8 space-y-4 text-[var(--color-fg-muted)]">
              <li>
                <span className="font-semibold text-[var(--color-fg)]">Debugging auth flows.</span> You need
                the model to see the request/response dance, not the bearer token in the header.
              </li>
              <li>
                <span className="font-semibold text-[var(--color-fg)]">Sharing a customer bug report.</span>{' '}
                Blur the customer&rsquo;s name and email; leave the stack trace and UI state intact.
              </li>
              <li>
                <span className="font-semibold text-[var(--color-fg)]">Asking about a .env or config file.</span>{' '}
                Blur the values, keep the keys. The model has enough to help; you haven&rsquo;t handed over the
                secrets.
              </li>
              <li>
                <span className="font-semibold text-[var(--color-fg)]">Screenshot of an internal dashboard.</span>{' '}
                Blur the customer IDs and revenue numbers; keep the chart shape and axis labels.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Blur once. Paste anywhere.
            </h2>
            <p className="mt-4 text-[var(--color-fg-muted)]">
              {SHORTCUT_MAC} ({SHORTCUT_WIN}) to open. Free, open source, no telemetry.
            </p>
            <div className="mt-8">
              <a
                href={MARKETPLACE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary rounded-md px-6 py-3 text-base font-semibold tracking-tight"
              >
                Install Snapmark
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
