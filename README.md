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
