import Image from 'next/image';

type Agent = {
  name: string;
  logo: string;
  /** Force a dark-colored logo to render as white on dark backgrounds. */
  whiten?: boolean;
};

const agents: Agent[] = [
  { name: 'Claude Code', logo: '/logos/claude.svg' },
  { name: 'GitHub Copilot', logo: '/logos/githubcopilot.svg' },
  { name: 'Cursor', logo: '/logos/cursor.svg' },
  { name: 'OpenAI Codex', logo: '/logos/openai.svg' },
  { name: 'Gemini Code Assist', logo: '/logos/googlegemini.svg' },
  { name: 'Cline', logo: '/logos/cline.svg' },
];

function LogoRow() {
  return (
    <>
      {agents.map((a) => (
        <span key={a.name} className="logo-item">
          <Image
            src={a.logo}
            alt=""
            width={96}
            height={24}
            aria-hidden
            unoptimized
            style={
              a.whiten ? { filter: 'brightness(0) invert(1)' } : undefined
            }
          />
          <span>{a.name}</span>
        </span>
      ))}
    </>
  );
}

export default function WorksWith() {
  return (
    <section id="works-with" className="border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 pt-6 pb-20 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-fg-muted)]">
          Works with
        </p>

        <div
          className="logo-marquee mt-8"
          role="group"
          aria-label="Compatible AI coding agents"
        >
          <div className="logo-track">
            <LogoRow />
            <div aria-hidden="true" className="contents">
              <LogoRow />
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-[var(--color-fg-muted)]">
          …and anything else that accepts pasted images.
        </p>
      </div>
    </section>
  );
}
