const agents = [
  'Claude Code',
  'GitHub Copilot Chat',
  'Cursor',
  'OpenAI Codex',
  'Gemini Code Assist',
  'Continue',
  'Cline',
];

export default function WorksWith() {
  return (
    <section id="works-with" className="border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-fg-muted)]">
          Works with
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base text-[var(--color-fg)]/90">
          {agents.map((a, i) => (
            <span key={a} className="flex items-center gap-x-8">
              {a}
              {i < agents.length - 1 && (
                <span aria-hidden className="text-[var(--color-fg-muted)]">
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
        <p className="mt-6 text-sm text-[var(--color-fg-muted)]">
          …and anything else that accepts pasted images.
        </p>
      </div>
    </section>
  );
}
