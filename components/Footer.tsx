import Image from 'next/image';
import { GITHUB_URL, MARKETPLACE_URL } from '@/lib/links';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 text-sm text-[var(--color-fg-muted)] sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <a href="/" className="flex items-center gap-2.5 text-[var(--color-fg)]" aria-label="Snapmark home">
            <Image src="/media/nav-logo.webp" alt="" width={24} height={24} className="rounded-md" unoptimized />
            <span className="font-semibold tracking-tight">Snapmark</span>
          </a>
          <p className="mt-3 max-w-xs leading-relaxed">
            Annotate screenshots in VS Code before pasting them into any AI chat. 100% local — no telemetry, no
            network.
          </p>
        </div>
        <div>
          <p className="font-medium text-[var(--color-fg)]">Product</p>
          <ul className="mt-3 space-y-2">
            <li><a href="/#how" className="transition hover:text-[var(--color-fg)]">How it works</a></li>
            <li><a href="/#toolkit" className="transition hover:text-[var(--color-fg)]">Toolkit</a></li>
            <li><a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer" className="transition hover:text-[var(--color-fg)]">Marketplace</a></li>
            <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="transition hover:text-[var(--color-fg)]">GitHub</a></li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-[var(--color-fg)]">Use it with</p>
          <ul className="mt-3 space-y-2">
            <li><a href="/for-claude-code" className="transition hover:text-[var(--color-fg)]">Claude Code</a></li>
            <li><a href="/for-copilot" className="transition hover:text-[var(--color-fg)]">GitHub Copilot</a></li>
            <li><a href="/blur-screenshots" className="transition hover:text-[var(--color-fg)]">Blurring screenshots</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.04]">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-6 py-6 text-xs text-[var(--color-fg-muted)]">
          <span>© {new Date().getFullYear()} Snapmark · MIT</span>
          <span>Made for people who paste screenshots into AI chats all day.</span>
        </div>
      </div>
    </footer>
  );
}
