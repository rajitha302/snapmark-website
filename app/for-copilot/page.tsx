import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { MARKETPLACE_URL, SHORTCUT_MAC, SHORTCUT_WIN } from '@/lib/links';

export const metadata: Metadata = {
  title: 'Annotate screenshots for GitHub Copilot Chat',
  description:
    'Draw on clipboard screenshots — numbered callouts, arrows, blurred secrets — before pasting into GitHub Copilot Chat. A VS Code extension that works with Copilot and every other agent that takes pasted images.',
  alternates: { canonical: '/for-copilot' },
};

export default function ForCopilot() {
  return (
    <>
      <Nav />
      <main>
        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-3xl px-6 pt-24 pb-16 sm:pt-32">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[var(--color-fg-muted)]">
              Snapmark · for GitHub Copilot Chat users
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Annotate screenshots for GitHub Copilot Chat.
            </h1>
            <p className="mt-6 text-lg text-[var(--color-fg-muted)]">
              Copilot Chat accepts pasted images. Snapmark is a VS Code extension that sits in your
              clipboard: copy a screenshot, draw on it, paste. No Copilot Chat plugin, no extra window — just
              a cleaner image going into the same textbox you already use.
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
            <h2 className="text-3xl font-semibold tracking-tight">
              What Snapmark adds to the Copilot Chat workflow
            </h2>
            <div className="mt-8 space-y-8 text-[var(--color-fg-muted)]">
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-fg)]">Arrows and circles</h3>
                <p className="mt-2">
                  Copilot Chat reads your image end-to-end. A red arrow pointing at the menu item you mean is
                  cheaper and clearer than a three-sentence description of where it lives on the page.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-fg)]">Numbered steps for multi-stage bugs</h3>
                <p className="mt-2">
                  Reproducing a regression in Copilot Chat is much easier when the screenshot itself carries
                  1 · 2 · 3 markers on the elements involved. One image, ordered actions, zero prose
                  ambiguity.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-fg)]">Blur sensitive regions first</h3>
                <p className="mt-2">
                  GitHub&rsquo;s privacy posture around Copilot Chat is better than most, but you still shouldn&rsquo;t
                  send secrets you can avoid sending. Snapmark pixelates the region on the clipboard image
                  before paste — the unredacted pixels never leave the extension.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <h2 className="text-3xl font-semibold tracking-tight">The keystroke path</h2>
            <ol className="mt-8 space-y-6 text-[var(--color-fg-muted)]">
              <li>
                <span className="font-semibold text-[var(--color-fg)]">1. Copy a screenshot</span> with your
                OS shortcut.
              </li>
              <li>
                <span className="font-semibold text-[var(--color-fg)]">2. {SHORTCUT_MAC} ({SHORTCUT_WIN})</span> opens the annotator inside VS Code.
              </li>
              <li>
                <span className="font-semibold text-[var(--color-fg)]">3. Draw, click Copy.</span> Snapmark
                writes the annotated PNG back to the clipboard, downscaled to the vision-model sweet spot.
              </li>
              <li>
                <span className="font-semibold text-[var(--color-fg)]">4. Cmd+V into the Copilot Chat input.</span>{' '}
                Copilot takes the image exactly the way it takes any other paste.
              </li>
            </ol>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Give Copilot Chat a clearer picture.
            </h2>
            <p className="mt-4 text-[var(--color-fg-muted)]">Free, open source, no telemetry.</p>
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
