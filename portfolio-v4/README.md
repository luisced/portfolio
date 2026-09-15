# luiscedillo.com — Portfolio V4

Astro 7 · static · Cloudflare Pages. Concept and budgets: `../PLAN.md`.

## Run

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # astro build → postbuild (404.html mirrors) → check-i18n → check-assets
pnpm preview
pnpm check        # astro check (strict TS)
```

`pnpm build` fails on: a content entry missing a locale, a UI key missing in `en` or `es`,
a raw px/em media query, or any raster over 200 KB (OG images over 80 KB).

## Where things live

- `src/content/` — projects (`{slug}.{en|es}.mdx`), experience (YAML, both locales inline),
  notes (`{slug}.{en|es}.mdx`), `profile/profile.yaml`. Schemas: `src/content.config.ts`.
- `src/i18n/ui.ts` — every UI string, both locales. `src/i18n/utils.ts` — `t()`, paths, queries.
- `src/styles/tokens.css` — the only place colors/type/spacing/motion are defined.
  Breakpoints: `postcss.config.mjs` (`@media (--sm|--md|--lg|--xl)`).
- `src/scripts/motion.ts` — the single GSAP entry (loaded after idle, never under reduced motion).
  Sections opt in with `data-reveal`, `data-reveal-group`, `data-parallax`.
- `functions/api/contact.ts` — Pages Function: honeypot → Turnstile → Resend. Works without JS.
- `src/pages/og/` — build-time OG images (satori + resvg).

## Deploy (Cloudflare Pages)

Build command `pnpm build`, output `dist`. `wrangler.toml` holds `CONTACT_TO` / `CONTACT_FROM`.

Secrets (`wrangler pages secret put …`): `RESEND_API_KEY`, `TURNSTILE_SECRET`.
Build-time env: `PUBLIC_TURNSTILE_SITE_KEY` (when absent, Turnstile is skipped — dev only).
Local Functions dev: copy `.dev.vars.example` → `.dev.vars`, then `wrangler pages dev dist`.
