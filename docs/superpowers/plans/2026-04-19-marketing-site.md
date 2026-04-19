# Snapmark Marketing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page marketing site for the Snapmark VS Code extension that funnels visitors to the VS Code Marketplace install.

**Architecture:** Next.js 15 (App Router) with TypeScript. Static export (`output: 'export'`) deployed to Netlify as plain HTML/CSS/JS — no server runtime. Tailwind CSS 4 (CSS-first config). One route (`/`) composed from six small section components. All copy inline; no CMS.

**Tech Stack:** Next.js 15 · React 19 · TypeScript 5 · Tailwind CSS 4 · Geist fonts · Netlify (static hosting).

**Spec:** [docs/superpowers/specs/2026-04-19-marketing-site-design.md](../specs/2026-04-19-marketing-site-design.md)

---

## Testing philosophy

This is a static marketing page with no business logic — there is nothing to unit-test. Verification happens at two points:

1. **Per task:** `npm run dev` renders without errors, `npm run build` succeeds, and a quick visual check in the dev server confirms the new section looks right.
2. **End of plan (Task 14):** a small Node script (`scripts/verify-site.mjs`) that greps the built HTML for the load-bearing contracts — correct `<title>`, meta description, Install CTA pointing at the Marketplace URL, JSON-LD present, all six section headings rendered. Zero test dependencies.

Each task below ends with a build check + commit.

---

## File structure (final state)

```
Snapmark-Website/
├── app/
│   ├── layout.tsx              # root <html>, fonts, metadata, JSON-LD
│   ├── page.tsx                # composes the six sections
│   ├── globals.css             # Tailwind + theme vars
│   ├── sitemap.ts              # /sitemap.xml
│   └── robots.ts               # /robots.txt
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── HowItWorks.tsx
│   ├── WorksWith.tsx
│   └── Footer.tsx
├── lib/
│   └── links.ts                # MARKETPLACE_URL, GITHUB_URL, SHORTCUT
├── public/
│   ├── logo.png                # copied from ../Snapmark/media/Logo.png
│   ├── favicon.ico
│   └── og.png                  # placeholder for now
├── scripts/
│   └── verify-site.mjs         # final smoke check on built HTML
├── netlify.toml
├── next.config.mjs
├── postcss.config.mjs
├── tsconfig.json
├── next-env.d.ts
├── package.json
├── .gitignore
└── README.md
```

---

## Task 1: Scaffold the Next.js project

**Files:**
- Create: `package.json`
- Create: `next.config.mjs`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `.gitignore`
- Create: `postcss.config.mjs`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "snapmark-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "verify": "node scripts/verify-site.mjs"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "geist": "^1.3.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.0"
  }
}
```

- [ ] **Step 2: Create `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "out", ".next"]
}
```

- [ ] **Step 4: Create `next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
```

- [ ] **Step 5: Create `.gitignore`**

```
node_modules/
.next/
out/
.env*.local
.DS_Store
*.log
.netlify/
```

- [ ] **Step 6: Create `postcss.config.mjs`**

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

- [ ] **Step 7: Install dependencies**

Run: `npm install`
Expected: completes without errors, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json next.config.mjs tsconfig.json next-env.d.ts .gitignore postcss.config.mjs
git commit -m "chore: scaffold Next.js 15 project with static export"
```

---

## Task 2: Tailwind CSS + theme + fonts + bare layout

**Files:**
- Create: `app/globals.css`
- Create: `app/layout.tsx` (temporary minimal version; expanded in Task 4)
- Create: `app/page.tsx` (placeholder)

- [ ] **Step 1: Create `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-bg: #0a0a0f;
  --color-bg-elevated: #111119;
  --color-fg: #f5f5f7;
  --color-fg-muted: #9a9aa8;
  --color-border: #1e1e2a;
  --color-accent: #0b4fb3;
  --color-accent-hover: #0d5bd0;

  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    background: var(--color-bg);
    color: var(--color-fg);
    font-family: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  ::selection {
    background: color-mix(in srgb, var(--color-accent) 50%, transparent);
    color: var(--color-fg);
  }

  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: 4px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

- [ ] **Step 2: Create a minimal `app/layout.tsx`**

This will be expanded in Task 4. For now, just enough to boot.

```tsx
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'Snapmark',
  description: 'Annotate screenshots before pasting them into AI chats.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Create a placeholder `app/page.tsx`**

```tsx
export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center">
      <p className="text-fg-muted">Snapmark — building…</p>
    </main>
  );
}
```

- [ ] **Step 4: Run dev server and verify**

Run: `npm run dev`
Expected: server starts on `http://localhost:3000`, page shows "Snapmark — building…" in muted gray on a near-black background. No console errors.
Kill with `Ctrl+C` when verified.

- [ ] **Step 5: Run a production build**

Run: `npm run build`
Expected: build succeeds, `out/` directory is created containing `index.html`.

- [ ] **Step 6: Commit**

```bash
git add app/ package.json
git commit -m "feat: add Tailwind v4 theme, Geist fonts, and base layout"
```

---

## Task 3: Shared constants + copy assets

**Files:**
- Create: `lib/links.ts`
- Create: `public/logo.png` (copy from extension repo)
- Create: `public/favicon.ico` (copy logo as a fallback)

- [ ] **Step 1: Create `lib/links.ts`**

```ts
export const MARKETPLACE_URL =
  'https://marketplace.visualstudio.com/items?itemName=RajithaDisanayaka.snapmark';

export const GITHUB_URL = 'https://github.com/rajitha302/Snapmark';

export const SHORTCUT_MAC = '⌘⇧A';
export const SHORTCUT_WIN = 'Ctrl+Shift+A';

export const SITE_URL = 'https://snapmark.netlify.app'; // placeholder until custom domain
export const SITE_NAME = 'Snapmark';
```

- [ ] **Step 2: Copy the logo from the extension repo**

Run:
```bash
mkdir -p public
cp "../Snapmark/media/Logo.png" public/logo.png
cp "../Snapmark/media/Logo.png" public/favicon.ico
```
Expected: `public/logo.png` (256×256 PNG) and `public/favicon.ico` both exist. We re-use the PNG as a favicon — browsers accept PNG content served as `.ico`. If the engineer wants a proper multi-size ICO later they can drop one in.

- [ ] **Step 3: Verify the dev server still works**

Run: `npm run dev`, open `http://localhost:3000`, check devtools Network tab for `/logo.png` returns 200 when referenced. Kill with `Ctrl+C`.

(Logo is not yet referenced in markup — it will be in Task 5. This step just confirms the file is servable.)

- [ ] **Step 4: Commit**

```bash
git add lib/links.ts public/logo.png public/favicon.ico
git commit -m "chore: add link constants and copy logo from extension repo"
```

---

## Task 4: Root layout — metadata, Open Graph, JSON-LD

**Files:**
- Modify: `app/layout.tsx` (replace the minimal version from Task 2)

- [ ] **Step 1: Replace `app/layout.tsx` entirely**

```tsx
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { MARKETPLACE_URL, SITE_NAME, SITE_URL } from '@/lib/links';
import './globals.css';

const DESCRIPTION =
  'Annotate screenshots on your clipboard before pasting them into AI chats like Claude, Copilot, and Cursor. Blur sensitive parts, add numbered steps, and resize large images automatically.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Snapmark — Annotate screenshots before pasting them into AI chats',
    template: '%s · Snapmark',
  },
  description: DESCRIPTION,
  keywords: [
    'snapmark',
    'vscode extension',
    'screenshot annotation',
    'clipboard annotation',
    'ai chat',
    'claude code',
    'github copilot',
    'cursor',
    'codex',
    'gemini',
    'blur',
    'redact',
    'numbered callouts',
    'llm',
  ],
  authors: [{ name: 'Rajitha Disanayaka' }],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Snapmark — Annotate screenshots before pasting them into AI chats',
    description: DESCRIPTION,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Snapmark' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snapmark',
    description: DESCRIPTION,
    images: ['/og.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Snapmark',
  description: DESCRIPTION,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Windows, macOS, Linux',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  downloadUrl: MARKETPLACE_URL,
  installUrl: MARKETPLACE_URL,
  softwareVersion: '1.0.0',
  url: SITE_URL,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Run build and view the generated HTML**

Run: `npm run build && grep -c "SoftwareApplication" out/index.html`
Expected: prints `1` (JSON-LD is embedded).

Run: `grep -c 'property="og:title"' out/index.html`
Expected: prints `1`.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add site metadata, Open Graph, and SoftwareApplication JSON-LD"
```

---

## Task 5: Nav component

**Files:**
- Create: `components/Nav.tsx`

- [ ] **Step 1: Create `components/Nav.tsx`**

```tsx
import Image from 'next/image';
import { GITHUB_URL, MARKETPLACE_URL } from '@/lib/links';

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2.5" aria-label="Snapmark home">
          <Image
            src="/logo.png"
            alt=""
            width={28}
            height={28}
            className="rounded-md"
            priority
          />
          <span className="text-base font-semibold tracking-tight">Snapmark</span>
        </a>

        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm text-[var(--color-fg-muted)] transition hover:text-[var(--color-fg)] sm:inline"
          >
            GitHub
          </a>
          <a
            href={MARKETPLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-[var(--color-accent)] px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)]"
          >
            Install
          </a>
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Wire it into `app/page.tsx` temporarily so we can see it**

Replace `app/page.tsx` contents:

```tsx
import Nav from '@/components/Nav';

export default function Home() {
  return (
    <>
      <Nav />
      <main className="min-h-screen">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-[var(--color-fg-muted)]">Sections in progress…</p>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify in the dev server**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: sticky nav bar at top with logo, "Snapmark" wordmark, "GitHub" text link (hidden on < 640px), and a blue "Install" pill button. Hovering GitHub changes its color. Focus ring appears on Tab.
Kill with `Ctrl+C`.

- [ ] **Step 4: Commit**

```bash
git add components/Nav.tsx app/page.tsx
git commit -m "feat: add sticky nav with logo and Install CTA"
```

---

## Task 6: Hero component

**Files:**
- Create: `components/Hero.tsx`
- Modify: `app/page.tsx` (add Hero below Nav)

- [ ] **Step 1: Create `components/Hero.tsx`**

```tsx
import { GITHUB_URL, MARKETPLACE_URL, SHORTCUT_MAC } from '@/lib/links';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(11,79,179,0.25),_transparent_60%)]"
      />
      <div className="mx-auto max-w-4xl px-6 py-28 text-center sm:py-36">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1 text-xs text-[var(--color-fg-muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          VS Code extension · v1.0
        </div>

        <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
          Annotate screenshots before pasting them into any AI chat.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-[var(--color-fg-muted)]">
          Snapmark sits in your clipboard. Copy a screenshot, hit{' '}
          <kbd
            className="inline-block rounded border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-1.5 py-0.5 font-[var(--font-mono)] text-sm text-[var(--color-fg)]"
            aria-label="Command Shift A"
          >
            {SHORTCUT_MAC}
          </kbd>
          , draw on it, and paste into Claude, Copilot, Cursor — anything.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={MARKETPLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)]"
          >
            Install from Marketplace
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition hover:bg-[var(--color-bg-elevated)]"
          >
            View on GitHub
          </a>
        </div>

        <div className="mt-16 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 shadow-2xl shadow-black/40">
          <div className="flex aspect-[16/9] items-center justify-center rounded-lg bg-[var(--color-bg)] text-sm text-[var(--color-fg-muted)]">
            Screenshot of the Snapmark annotator goes here
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update `app/page.tsx`**

```tsx
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify in the dev server**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: hero shows a small "VS Code extension · v1.0" chip, a large balanced H1, a paragraph with an inline `⌘⇧A` kbd chip, two CTAs (blue Install + outlined GitHub), and a bordered placeholder box for the screenshot. Radial blue glow sits behind the headline.
Kill with `Ctrl+C`.

- [ ] **Step 4: Commit**

```bash
git add components/Hero.tsx app/page.tsx
git commit -m "feat: add hero with pitch, shortcut chip, and install CTAs"
```

---

## Task 7: Features component (three-capability wedge — uses "Blur")

**Files:**
- Create: `components/Features.tsx`
- Modify: `app/page.tsx` (add Features after Hero)

**Note:** The spec explicitly requires the first feature to be labeled **"Blur"** in the marketing copy even though the extension internally calls it "redact". Do not write "redact" or "pixelate" in the user-facing copy.

- [ ] **Step 1: Create `components/Features.tsx`**

```tsx
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
```

- [ ] **Step 2: Update `app/page.tsx`**

```tsx
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Features from '@/components/Features';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify in the dev server**

Run: `npm run dev`, open `http://localhost:3000`, scroll down.
Expected: three feature cards in a row (desktop) or stacked (mobile), each with a tinted accent icon tile, bold title, and muted body copy. First card title reads **"Blur sensitive regions"** — not "Redact". Hovering a card brightens the border.
Kill with `Ctrl+C`.

- [ ] **Step 4: Commit**

```bash
git add components/Features.tsx app/page.tsx
git commit -m "feat: add three-feature section (blur, numbered callouts, auto-compress)"
```

---

## Task 8: HowItWorks component

**Files:**
- Create: `components/HowItWorks.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/HowItWorks.tsx`**

```tsx
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
            How it works
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
```

- [ ] **Step 2: Update `app/page.tsx`**

```tsx
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify in the dev server**

Run: `npm run dev`, scroll to the How-it-works section.
Expected: three numbered steps (1/2/3) in circled accent-colored badges, each with a bold title and muted description. Section uses `<ol>` for semantics. The shortcut appears inline in step 2.
Kill with `Ctrl+C`.

- [ ] **Step 4: Commit**

```bash
git add components/HowItWorks.tsx app/page.tsx
git commit -m "feat: add how-it-works 3-step section"
```

---

## Task 9: WorksWith strip

**Files:**
- Create: `components/WorksWith.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/WorksWith.tsx`**

```tsx
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
```

- [ ] **Step 2: Update `app/page.tsx`**

```tsx
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import WorksWith from '@/components/WorksWith';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <WorksWith />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify in the dev server**

Run: `npm run dev`, scroll to Works-with.
Expected: small uppercase "Works with" eyebrow label, then the seven agent names separated by middle-dots on one row (wrapping on narrow viewports), followed by the "…and anything else" line.
Kill with `Ctrl+C`.

- [ ] **Step 4: Commit**

```bash
git add components/WorksWith.tsx app/page.tsx
git commit -m "feat: add works-with agent strip"
```

---

## Task 10: Footer component

**Files:**
- Create: `components/Footer.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/Footer.tsx`**

```tsx
import { GITHUB_URL, MARKETPLACE_URL } from '@/lib/links';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 text-sm text-[var(--color-fg-muted)] sm:flex-row sm:items-center">
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
    </footer>
  );
}
```

- [ ] **Step 2: Update `app/page.tsx`**

```tsx
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import WorksWith from '@/components/WorksWith';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <WorksWith />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify in the dev server**

Run: `npm run dev`, scroll to bottom.
Expected: footer has copyright + MIT + "100% local" line on the left, GitHub and Marketplace links on the right. Stacks vertically on mobile.
Kill with `Ctrl+C`.

- [ ] **Step 4: Commit**

```bash
git add components/Footer.tsx app/page.tsx
git commit -m "feat: add footer with attribution and links"
```

---

## Task 11: `sitemap.ts` and `robots.ts`

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Create `app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/links';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
```

- [ ] **Step 2: Create `app/robots.ts`**

```ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/links';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Build and confirm both files are emitted**

Run: `npm run build && ls out/ | grep -E '^(sitemap\.xml|robots\.txt)$'`
Expected: prints both `robots.txt` and `sitemap.xml`.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: add sitemap.xml and robots.txt"
```

---

## Task 12: Netlify config + README

**Files:**
- Create: `netlify.toml`
- Create: `README.md`

- [ ] **Step 1: Create `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--prefer-offline --no-audit"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/logo.png"
  [headers.values]
    Cache-Control = "public, max-age=86400"
```

- [ ] **Step 2: Create `README.md`**

````markdown
# Snapmark — marketing site

Marketing site for [Snapmark](https://github.com/rajitha302/Snapmark), the VS Code extension for annotating clipboard screenshots before pasting them into AI agent chats.

**Live:** _deployed to Netlify_

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4
- Static export (`output: 'export'`) → deployed to Netlify as plain HTML/CSS/JS
- No server, no database, no analytics

## Develop

```bash
npm install
npm run dev       # http://localhost:3000
```

## Build

```bash
npm run build     # emits static site to ./out
npm run verify    # sanity-checks the built HTML (SEO + CTAs)
```

## Deploy

The repo is configured for Netlify auto-deploy via [`netlify.toml`](./netlify.toml).

For manual deploys:

```bash
npm run build
npx netlify deploy --prod --dir=out
```

## Structure

- `app/` — routes, root layout, sitemap, robots
- `components/` — one file per landing-page section
- `lib/links.ts` — shared URL and shortcut constants
- `public/` — logo, favicon, future screenshots and OG image
- `scripts/verify-site.mjs` — post-build smoke check

## Content ownership

Product positioning, feature copy, and everything else about _what Snapmark is_ lives in the [extension repo's CLAUDE.md](../Snapmark/CLAUDE.md). This site is the conversion surface — it should not duplicate documentation that belongs in the extension README or Marketplace listing.
````

- [ ] **Step 3: Commit**

```bash
git add netlify.toml README.md
git commit -m "chore: add Netlify config and README"
```

---

## Task 13: Add a placeholder OG image

**Files:**
- Create: `public/og.png` (1200×630 placeholder)

- [ ] **Step 1: Create a simple placeholder OG image**

For v1 we ship a tiny static PNG so social previews have _something_ rather than nothing. Use ImageMagick (available on macOS by default if installed) or re-use the logo at 1200×630 with padding.

Option A (fallback — simplest): copy the 256×256 logo as `og.png`. Social platforms will letterbox it, but it's valid.

```bash
cp public/logo.png public/og.png
```

Option B (recommended if `magick`/`convert` is installed): generate a 1200×630 canvas with the logo centered on the brand background.

```bash
magick -size 1200x630 xc:'#0a0a0f' \
  \( public/logo.png -resize 200x200 \) -gravity center -composite \
  -fill '#f5f5f7' -font Helvetica -pointsize 56 \
  -gravity south -annotate +0+100 'Snapmark' \
  public/og.png
```

Pick one. If `magick` is not installed, use Option A.

- [ ] **Step 2: Verify it exists and is non-empty**

Run: `ls -l public/og.png`
Expected: non-zero file size.

- [ ] **Step 3: Commit**

```bash
git add public/og.png
git commit -m "chore: add placeholder og.png"
```

---

## Task 14: Final verification — build + smoke-check script

**Files:**
- Create: `scripts/verify-site.mjs`

This is the one "test" in the project. It runs after `npm run build` and asserts that the things the spec says must be in the final HTML are in fact in the final HTML.

- [ ] **Step 1: Create `scripts/verify-site.mjs`**

```js
// Post-build smoke check. Reads out/index.html and asserts the
// load-bearing contracts from the spec are present.
// Usage: node scripts/verify-site.mjs  (or: npm run verify)

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const outDir = resolve(ROOT, 'out');
const indexPath = resolve(outDir, 'index.html');

const failures = [];
function check(label, cond) {
  if (!cond) failures.push(label);
  else console.log(`  ✓ ${label}`);
}

if (!existsSync(indexPath)) {
  console.error(`✗ out/index.html not found. Run 'npm run build' first.`);
  process.exit(1);
}

const html = readFileSync(indexPath, 'utf8');

console.log('Checking out/index.html…');

check('title tag present', /<title[^>]*>Snapmark/i.test(html));
check(
  'meta description mentions AI chats',
  /<meta[^>]+name="description"[^>]+ai chats?/i.test(html),
);
check('open graph title present', /property="og:title"/.test(html));
check('twitter card present', /name="twitter:card"/.test(html));
check('SoftwareApplication JSON-LD present', /"SoftwareApplication"/.test(html));
check(
  'Install CTA links to VS Code Marketplace',
  /href="https:\/\/marketplace\.visualstudio\.com\/items\?itemName=RajithaDisanayaka\.snapmark"/.test(
    html,
  ),
);
check('GitHub link present', /href="https:\/\/github\.com\/rajitha302\/Snapmark"/.test(html));
check('H1 present', /<h1[^>]*>.*Annotate screenshots/i.test(html));
check('features section heading present', /Three things the marketplace/i.test(html));
check('"Blur sensitive regions" wording used (not "Redact")', /Blur sensitive regions/.test(html));
check('"Redact" NOT used in marketing copy', !/redact/i.test(html));
check('how-it-works heading present', /How it works/i.test(html));
check('works-with strip present', /Claude Code/.test(html) && /Cursor/.test(html));
check('keyboard shortcut kbd rendered', /<kbd[^>]*>.*⌘⇧A.*<\/kbd>/.test(html));

if (!existsSync(resolve(outDir, 'sitemap.xml'))) failures.push('sitemap.xml emitted');
else console.log('  ✓ sitemap.xml emitted');

if (!existsSync(resolve(outDir, 'robots.txt'))) failures.push('robots.txt emitted');
else console.log('  ✓ robots.txt emitted');

if (failures.length) {
  console.error(`\n✗ ${failures.length} check(s) failed:`);
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log('\n✓ All checks passed.');
```

- [ ] **Step 2: Run a clean build**

Run: `rm -rf out .next && npm run build`
Expected: build succeeds, creates `out/index.html`, `out/sitemap.xml`, `out/robots.txt`.

- [ ] **Step 3: Run the verify script**

Run: `npm run verify`
Expected: all checks print `✓` and the script exits `0`. If anything fails, fix the offending component/file and re-run `npm run build && npm run verify`.

- [ ] **Step 4: Manual visual check**

Run: `npx serve out -l 4000` (or `npm run dev` if preferred)
Open `http://localhost:4000` and confirm in the browser:
- Nav sticks when you scroll.
- Hero CTA opens the Marketplace URL in a new tab.
- Three feature cards render, first one titled **Blur sensitive regions** (not Redact).
- Numbered steps 1/2/3 visible in How it works.
- Footer has GitHub + Marketplace links.
- Page is readable at 360px viewport (devtools responsive mode).
- View page source → `<script type="application/ld+json">` contains the SoftwareApplication schema.

Kill with `Ctrl+C`.

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-site.mjs
git commit -m "chore: add post-build smoke check script"
```

---

## Task 15 (optional): Deploy to Netlify

Only run this when the user says "deploy it." Do not do this automatically.

- [ ] **Step 1: Ensure Netlify CLI is available**

Run: `npx netlify --version`
Expected: prints a version. If not installed, `npm i -g netlify-cli` or use `npx`.

- [ ] **Step 2: Link and deploy**

Run, from the repo root:
```bash
npm run build
npx netlify deploy --dir=out
```
Expected: netlify-cli prompts to link a site (choose "Create & configure a new site" on first run), uploads `out/`, prints a draft URL.

Visually verify the draft URL in a browser.

- [ ] **Step 3: Promote to production**

Run: `npx netlify deploy --prod --dir=out`
Expected: prints the production URL. Open it and re-run the visual checks from Task 14 Step 4.

- [ ] **Step 4: (Optional) Update `SITE_URL` in `lib/links.ts`**

If Netlify assigned a different subdomain than the placeholder (`snapmark.netlify.app`), update `lib/links.ts`, rebuild, and redeploy so canonical URLs, JSON-LD, and OG tags match the real site URL.

---

## Self-review

Spec coverage:

- [x] Tech stack (Next 15, TS, Tailwind 4, static export, Netlify) — Task 1, 2, 12
- [x] Dark theme with `#0b4fb3` accent + Geist fonts — Task 2
- [x] Six sections: Nav, Hero, Features (Blur/Numbered/Compress), HowItWorks, WorksWith, Footer — Tasks 5–10
- [x] "Blur" replaces "Redact" in all marketing copy — Task 7 + verification in Task 14
- [x] SEO: metadata API, Open Graph, Twitter card, JSON-LD SoftwareApplication, sitemap.ts, robots.ts — Tasks 4, 11
- [x] Logo copied from `../Snapmark/media/Logo.png` — Task 3
- [x] Netlify config — Task 12
- [x] Accessibility: semantic landmarks, focus rings, `<kbd>` with aria-label, reduced-motion — Tasks 2, 5, 6
- [x] Mobile-first responsive — every section uses `sm:` breakpoints
- [x] Known gap: OG image ships as placeholder — Task 13
- [x] Known gap: hero screenshot ships as placeholder — Task 6
- [x] Verification of load-bearing content (Install URL, Blur wording, JSON-LD) — Task 14

Placeholder scan: no "TBD" / "implement later" / "handle edge cases" steps remain. All code blocks are complete and runnable.

Type consistency: the `Feature` type in Task 7 is local to that file; all other cross-task references are string constants in `lib/links.ts` used the same way everywhere. Component imports use the `@/` alias consistently with the `paths` config in Task 1's `tsconfig.json`.
