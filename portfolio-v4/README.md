# luiscedillo.com — Portfolio V4 (base)

Astro 7 · static · Cloudflare Pages. **This is the engine with a neutral, undesigned skin.**
Three visual directions were built and rejected (see git history: `e396a92` React Bits brutalist,
`e27055c` blueprint bench, `d9c26ae` cinematic workshop, `0f3b08e` three quiet /lab variants);
the design layer was reset on 2026-09-15 to start clean. Everything below is what survives.

## Run

```bash
pnpm install
pnpm dev          # http://localhost:4321  (Astro 7 runs dev as a daemon: `pnpm exec astro dev stop`)
pnpm build        # astro build → postbuild (404 mirrors) → check-i18n → check-assets
pnpm check        # astro check (strict TS)
```

`pnpm build` fails on: a content entry missing a locale, a UI key missing in `en`/`es`,
a raw px/em media query, a raster over 200 KB (OG over 80 KB), landing JS over the gate
(`scripts/check-assets.mjs`, currently 60 KB gz), or more than 4 font files.

## What is here (keep)

- `src/content/` — projects (`{slug}.{en|es}.mdx`), experience (YAML), notes, `profile/profile.yaml`.
  Schemas in `src/content.config.ts`. Real content for 5 projects, 5 roles, 2 notes, both locales.
- `src/i18n/` — every UI string (`ui.ts`) and helpers (`utils.ts`: `t()`, `localizePath`, queries).
- `src/layouts/Base.astro` — head (canonical, hreflang, OG/Twitter, JSON-LD via `src/lib/seo.ts`),
  no-flash theme, skip link, nav, footer. `src/pages/og/` generates OG PNGs (satori + resvg; Azeret Mono
  is kept only for that).
- `src/pages/[...lang]/` — `/`, `/es/`, work, notes, 404, RSS. All routes exist in both locales.
- `src/components/sections/*` and `src/components/{Nav,Footer}.astro` — semantic, content-only markup.
  **Restyle or replace these; do not put content in them.**
- `src/styles/tokens.css` + `base.css` — neutral tokens (system fonts, two themes) and readable defaults.
  Breakpoints only via `postcss.config.mjs` (`@media (--sm|--md|--lg|--xl)`).
- `src/scripts/theme.ts` (toggle + Alt+T), `src/scripts/contact.ts` (progressive form).
- `functions/api/contact.ts` — Pages Function: honeypot → Turnstile → Resend. Works without JS.
- `scripts/` — `check-assets.mjs`, `check-i18n.mjs`, `postbuild.mjs`, `font-fallbacks.mjs`
  (configure fonts, `pnpm add -D fontkit`, run once to generate metric-matched fallbacks).
- `lighthouserc.json` + `.github/workflows/quality.yml` — LHCI gates on every push.

## Deploy (Cloudflare Pages)

Build `pnpm build`, output `dist`. `wrangler.toml` holds `CONTACT_TO` / `CONTACT_FROM`.
Secrets: `RESEND_API_KEY`, `TURNSTILE_SECRET`. Build env: `PUBLIC_TURNSTILE_SITE_KEY`.
Local Functions: copy `.dev.vars.example` → `.dev.vars`, `wrangler pages dev dist`.
