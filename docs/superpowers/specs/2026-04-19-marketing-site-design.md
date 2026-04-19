# Snapmark Marketing Site — Design

**Date:** 2026-04-19
**Status:** Approved
**Scope:** v1 marketing website for the Snapmark VS Code extension

## Goal

A simple, fast marketing page that funnels visitors to the VS Code Marketplace install. Assume visitors scan for ~10 seconds and either install or leave. Optimize for clarity, page speed, and SEO.

Canonical docs live in the extension's README and VS Code Marketplace listing. This site is not documentation — it is a conversion surface.

## Non-goals

- Docs site, blog, changelog, or pricing page.
- User accounts, analytics, or any network calls beyond static asset delivery.
- Marketing copy for features that aren't shipped in the extension (no roadmap teasing).
- A design system. One page, one theme, inline Tailwind utilities.

## Tech stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS 4 (CSS-first config via `@theme`)
- **Output:** Static export (`output: 'export'`) — no server runtime needed
- **Host:** Netlify (auto-detected Next.js, official `@netlify/plugin-nextjs` via `netlify.toml`)
- **Node:** 20

Static export is the right call because every section is content-only. No SSR, no API routes, no ISR — just HTML+CSS+a trivial amount of JS. Netlify still handles the deploy via its Next.js plugin for CDN and edge redirects.

## Information architecture

Single page at `/`. Nav anchors jump within the page. No other routes except `/sitemap.xml` and `/robots.txt`.

### Sections (in order)

1. **Nav bar** — sticky, transparent on scroll-top, solid on scroll.
   - Left: Snapmark logo + wordmark.
   - Right: "GitHub" text link, "Install" primary button → VS Code Marketplace URL.

2. **Hero**
   - H1: _"Annotate screenshots before pasting them into any AI chat."_
   - Sub: one sentence explaining clipboard-based workflow and agent-agnostic positioning.
   - Keyboard chip: `⌘⇧A` (shown as a styled `<kbd>`).
   - CTAs: Install (primary) · View on GitHub (secondary).
   - Visual: placeholder box sized for an eventual product screenshot (`/public/hero.png`). Ships with a styled empty state so the page looks intentional without it.

3. **Three features (the wedge)** — one row on desktop, stacked on mobile.
   - **Blur sensitive regions** — hide API keys, tokens, and PII before the image leaves your machine.
   - **Numbered step callouts** — walk the model through a UI flow in order.
   - **Auto-compress on copy** — retina screenshots are resized to 1920px max so vision models don't choke on tokens.

   Note: internally the extension calls the first feature "redact" (pixelation). The marketing site says **Blur** everywhere — more intuitive for non-technical readers.

4. **How it works** — 3 steps with icons, no animations.
   1. Copy a screenshot with your OS tool (`⌃⇧⌘4`, `Win+Shift+S`, etc.).
   2. Hit `⌘⇧A` in VS Code to open the annotator.
   3. Copy → paste into any AI chat. The PNG round-trips through the clipboard.

5. **Works with** — text strip, no logos.
   - "Works with Claude Code · Copilot Chat · Cursor · Codex · Gemini Code Assist · Continue · Cline · anything that accepts pasted images."

6. **Footer**
   - Left: © Snapmark · MIT.
   - Right: GitHub · Marketplace · "100% local — no telemetry, no network."

## Brand & visual design

- **Theme:** dark only. No light-mode toggle in v1.
- **Background:** near-black (`#0a0a0f`).
- **Accent:** `#0b4fb3` (matches the extension's Marketplace `galleryBanner.color`).
- **Text:** high-contrast off-white for body, muted gray for sub-copy.
- **Typography:** Next's built-in `next/font` with Geist (sans) for body and Geist Mono for code/shortcut chips. No web font network requests — self-hosted by `next/font`.
- **Logo:** copied from `../Snapmark/media/Logo.png` into `public/logo.png`.
- **Spacing:** generous. Sections are `py-24` on desktop. One accent color, one radius scale. No gradients on text.

## SEO

- **Metadata (Next `metadata` API in `app/layout.tsx`):**
  - `title`: "Snapmark — Annotate screenshots before pasting them into AI chats"
  - `description`: reused verbatim from the extension's `package.json` description.
  - `keywords`: reused from the extension's `package.json` keywords array.
  - `openGraph` + `twitter` card with `images: ['/og.png']`.
  - `metadataBase` set to production URL (placeholder until a domain is chosen — use the Netlify site URL).
- **Structured data:** inline JSON-LD `SoftwareApplication` schema in `<head>` with `applicationCategory: "DeveloperApplication"`, `operatingSystem: "Windows, macOS, Linux"`, `offers: { price: "0" }`, `installUrl` pointing at Marketplace.
- **Crawling:** `app/sitemap.ts` emitting `/` only, `app/robots.ts` allowing all.
- **Semantics:** one `<h1>`, section-level `<h2>`s, `<main>` wrapping the page body, `<nav>`/`<footer>` landmarks, `alt` on all images.
- **Perf targets:** Lighthouse ≥ 95 in all four categories on desktop. First contentful paint under 1s on a cold cache.

## UX details

- **Responsive:** mobile-first. Hero stacks, features become a 1-column grid, nav collapses to logo + Install (no hamburger — only two links, no point).
- **Focus states:** visible focus ring on all interactive elements (Tailwind `focus-visible:ring-2`).
- **Motion:** no scroll-jacking, no autoplay video. A single `prefers-reduced-motion` check wraps any subtle transitions.
- **Buttons:** Install is a `<a>` with `target="_blank" rel="noopener"` to the Marketplace URL. Not a form, not a button with JS.
- **Accessibility:** color contrast ≥ 4.5:1 on all text. Keyboard shortcut chip uses `<kbd>` with an `aria-label` explaining it.

## File layout

```
Snapmark-Website/
├── app/
│   ├── layout.tsx           # <html>, fonts, metadata, JSON-LD
│   ├── page.tsx             # composes the section components
│   ├── globals.css          # Tailwind directives + CSS vars (theme)
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── HowItWorks.tsx
│   ├── WorksWith.tsx
│   └── Footer.tsx
├── lib/
│   └── links.ts             # MARKETPLACE_URL, GITHUB_URL constants
├── public/
│   ├── logo.png             # copied from ../Snapmark/media/Logo.png
│   ├── favicon.ico
│   └── og.png               # TBD — ship with a simple static image
├── netlify.toml
├── next.config.mjs          # output: 'export', images unoptimized (static)
├── tsconfig.json
├── package.json
├── postcss.config.mjs
└── README.md                # dev + deploy instructions
```

One component per section keeps each file small and focused. Shared URL constants in `lib/links.ts` so the Marketplace URL lives in one place.

## Deploy

- `netlify.toml`:
  - `[build] command = "npm run build"`, `publish = "out"` (static export dir)
  - Node 20 pinned in `[build.environment] NODE_VERSION = "20"`
  - No plugins needed for static export (if we keep `output: 'export'`). If we ever add dynamic routing, switch to `@netlify/plugin-nextjs`.
- First deploy: `netlify deploy --prod` from the repo root after `npm run build`, or link the GitHub repo for auto-deploy on push.

## Known gaps (not blocking v1)

- **Hero product screenshot** — a real PNG of the annotator in action. Shipping with a styled placeholder; can be dropped into `public/hero.png` later without code changes.
- **Custom OG image** — shipping with a text-based static `og.png` that reuses the hero headline.
- **Custom domain** — `metadataBase` placeholder until a domain is picked.

## Out of scope (explicit)

- Dark/light mode toggle.
- Animation libraries (framer-motion, gsap).
- CMS or MDX. All copy is inline in the components.
- A "features" detail page. The extension README is canonical.
- Analytics. Netlify's server logs are enough.
- Contact form / newsletter. GitHub issues is the support channel.
