import { SHORTCUT_MAC, SHORTCUT_WIN } from '@/lib/links';

const steps = [
  {
    n: '1',
    title: 'Copy a screenshot',
    body: 'Use your OS screenshot tool — ⌃⇧⌘4 on macOS, Win+Shift+S on Windows, or any Linux snipper.',
  },
  {
    n: '2',
    title: 'Annotate in VS Code',
    body: `Snapmark notices the clipboard image and arms its status-bar button. Hit ${SHORTCUT_MAC} (${SHORTCUT_WIN}) to open the annotator.`,
  },
  {
    n: '3',
    title: 'Paste into any AI chat',
    body: 'Click Copy and paste the annotated image into Claude Code, Copilot Chat, Cursor — anything that accepts pasted images.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How Snapmark works
          </h2>
          <p className="mt-4 text-[var(--color-fg-muted)]">
            Snapmark never touches any agent&rsquo;s window. It lives in your clipboard.
          </p>
        </div>

        <ol className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="flex flex-col items-start">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-accent)] font-[var(--font-mono)] text-sm text-[var(--color-accent)]">
                {s.n}
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
