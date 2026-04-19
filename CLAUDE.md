# CLAUDE.md — Snapmark Website

## What this is

Marketing website for **Snapmark** — a VS Code extension that lets users annotate clipboard images (screenshots) before pasting them into AI agent chat inputs.

This repo holds **only** the marketing site. The extension source, architecture notes, clipboard internals, and release process live in the extension repo.

## Related project — the extension itself

**Path:** [`/Users/rajithad/My Files/Dev/Personal/Snapmark`](../Snapmark/)

**Primary reference:** [`../Snapmark/CLAUDE.md`](../Snapmark/CLAUDE.md)

That file is the source of truth for:

- Product positioning and the three-capability wedge (redact / numbered callouts / auto-compression).
- Why the design is clipboard-based (VS Code webview sandboxing + in-memory paste blobs).
- Architecture, runtime flow, per-platform clipboard helpers (macOS osascript, Windows PowerShell, Linux xclip/wl-clipboard).
- Settings, known gotchas, coding conventions, release process.
- What is explicitly out of scope.

**Before writing any marketing copy, feature list, or screenshot caption, read `../Snapmark/CLAUDE.md` first** so the site stays consistent with the product's actual positioning and capabilities. Do not restate product internals here — link to the extension repo instead.

## Scope of this repo

- Landing page, feature pages, install/usage docs aimed at end users.
- Assets (screenshots, demo GIFs, logos).
- Deploy config for whatever host this ends up on.

Out of scope: anything about the extension's implementation, clipboard I/O details, or VS Code API quirks — those belong in the extension repo.
