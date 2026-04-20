import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { MARKETPLACE_URL, SHORTCUT_MAC, SHORTCUT_WIN } from '@/lib/links';

export const metadata: Metadata = {
  title: 'Annotate screenshots for Claude Code',
  description:
    'Paste annotated screenshots into Claude Code with numbered steps, arrows, and blurred regions. A VS Code extension that sits in your clipboard — no Claude Code integration required.',
  alternates: { canonical: '/for-claude-code' },
};

export default function ForClaudeCode() {
  return (
    <>
      <Nav />
      <main>
        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-3xl px-6 pt-24 pb-16 sm:pt-32">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[var(--color-fg-muted)]">
              Snapmark · for Claude Code users
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Annotate screenshots for Claude Code.
            </h1>
            <p className="mt-6 text-lg text-[var(--color-fg-muted)]">
              Claude Code accepts pasted images in its chat input. Snapmark is a VS Code extension that lets
              you draw on clipboard screenshots — numbered steps, arrows, blurred regions — before you hit
              paste. No Claude Code integration, no network round-trip, no file on disk.
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
              Why annotate before pasting into Claude Code
            </h2>
            <div className="mt-8 space-y-8 text-[var(--color-fg-muted)]">
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-fg)]">Point at the thing you mean</h3>
                <p className="mt-2">
                  Dropping a raw screenshot into Claude Code and typing &ldquo;the button in the top right doesn&rsquo;t
                  work&rdquo; makes the model guess which button. A red arrow and a circle eliminate that guess in
                  one token.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-fg)]">Walk it through a flow in order</h3>
                <p className="mt-2">
                  Snapmark&rsquo;s numbered step markers (1 · 2 · 3) let you sequence a multi-step UI bug on a
                  single image. Claude Code reads the order from the numerals instead of from your prose
                  description.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-fg)]">Blur it before it leaves your machine</h3>
                <p className="mt-2">
                  If the screenshot has an API key, a bearer token, or a customer email, Snapmark&rsquo;s blur tool
                  pixelates the region on the clipboard image itself. Claude Code sees the sanitised PNG; the
                  original bits never touch the wire.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <h2 className="text-3xl font-semibold tracking-tight">
              How the workflow looks
            </h2>
            <ol className="mt-8 space-y-6 text-[var(--color-fg-muted)]">
              <li>
                <span className="font-semibold text-[var(--color-fg)]">1. Copy a screenshot.</span> Use your OS
                tool — ⌃⇧⌘4 on macOS, Win+Shift+S on Windows.
              </li>
              <li>
                <span className="font-semibold text-[var(--color-fg)]">2. Hit {SHORTCUT_MAC} ({SHORTCUT_WIN}) in VS Code.</span>{' '}
                Snapmark opens an annotator with the clipboard image already loaded.
              </li>
              <li>
                <span className="font-semibold text-[var(--color-fg)]">3. Draw, click Copy.</span> The
                annotated PNG replaces the clipboard, auto-resized so Claude Code&rsquo;s vision tokens aren&rsquo;t
                wasted on Retina pixels.
              </li>
              <li>
                <span className="font-semibold text-[var(--color-fg)]">4. Cmd+V into Claude Code.</span> The
                Claude Code composer accepts the image like any other paste. You never leave VS Code.
              </li>
            </ol>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Stop describing your screen to Claude Code. Show it.
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
