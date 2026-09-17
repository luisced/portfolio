# luiscedillo.com — Portfolio V4

A graphic, reference-led developer portfolio built with Astro 7, static HTML and native scrolling. Oversized Archivo typography, monochrome framing, a pink narrative section and an original wireframe sculpture draw on PortalOne and TypeSafe AI without copying their assets. English and Spanish routes share a light/dark design system.

## Run

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm check
```

`pnpm build` generates static pages, responsive AVIF/WebP images, social images, localized 404 fallbacks, sitemap and RSS feeds. For an Astro background dev server, `pnpm exec astro dev stop` stops it. If a long-running dev server mixes stale content or styles with new markup, restart with `pnpm dev --force` to rebuild the content cache; compare against a clean production preview.

## Design and content

- `src/content/`: localized project case studies, notes, profile and professional experience. The September 2026 profile refresh uses the owner's signed-in LinkedIn profile for iLuk and Vyvo roles; older project details remain from the repository. The existing downloadable CV is retained, not regenerated.
- `src/i18n/ui.ts`: bilingual interface copy. `utils.ts` localizes page and feed URLs.
- `src/components/sections/`: graphic hero and three-part approach, framed project showcases, experience, portrait and background, writing and contact. Project images show actual product captures rather than promotional covers.
- `src/styles/`: shared design tokens, typography, focus states and article styling. Use the custom breakpoints in `postcss.config.mjs`.
- `Hero.astro`: an original torus wireframe is generated as SVG at build time. Native CSS ties the sculpture and section marker to scroll where supported; no WebGL, video, animation runtime, client framework or loading screen is required.
- `src/scripts/story.ts`: IntersectionObserver updates the active project and triggers short positional reveals. Content is never hidden while waiting for an animation. Native CSS adds reading progress and a scroll-linked workflow line; scrolling is never intercepted.
- Content and navigation remain usable without JavaScript. Reduced motion disables scroll-linked and entrance animations.

## SEO and performance

`Base.astro` emits localized titles, descriptions, canonicals, hreflang, social metadata and linked Person/WebSite structured data. Case studies and notes add their own entities and breadcrumbs. Fonts are self-hosted; project images load lazily.

The build checks translation parity, custom media tokens, raster size (200 KB, social images 80 KB), landing JavaScript (60 KB gzip ceiling, including inline scripts) and font count (four-file ceiling). This design currently uses two font files and approximately 1.7 KB gzip of executable JavaScript.

`postbuild.mjs` adds exact SHA-256 hashes for emitted inline scripts to `dist/_headers`. Keep the source policy strict: do not add `unsafe-inline` to `script-src`.

## Contact and deployment

Build with `pnpm build`; publish `dist` on Cloudflare Pages. The form always renders, alongside direct email, WhatsApp and profile links. Delivery requires `RESEND_API_KEY` and the sender/recipient values in `wrangler.toml`. Turnstile is optional: configure both `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET` to enable it, or leave both unset for the honeypot-only flow. Without Turnstile, the form also submits through native HTML when JavaScript is disabled.

For local Functions, copy `.dev.vars.example` to `.dev.vars` and use `wrangler pages dev dist`. The static Astro preview does not run Pages Functions. No messages are sent during visual verification.
