# Luis Cedillo — Portfolio History

This repository preserves the four major iterations of [luiscedillo.com](https://luiscedillo.com). Each version is self-contained so the design and technical evolution can be explored without rewriting its original stack.

## Version history

| Version | Directory | Stack | Status |
|---|---|---|---|
| V1 | `portfolio-v1/` | Create React App, React 18, React Router, Spline | Archived first iteration, restored from the former `dev` branch |
| V2 | `portfolio-v2/` | React 19, TypeScript, Vite, i18next, Three.js | Archived second iteration |
| V3 | `portfolio-v3/` | Next.js 16, React 19, next-intl, GSAP, Tailwind CSS | Archived third iteration, restored from `portfolio-v3` |
| V4 | `portfolio-v4/` | Astro 7, TypeScript, MDX, Satori, Cloudflare Pages | **Current production version** |

V1 introduced the original interactive portfolio and 3D presentation. V2 reorganized the application around TypeScript, feature modules, localization and richer WebGL effects. V3 explored a Next.js application architecture and a more expressive motion system. V4 returns to a static-first architecture, keeps bilingual content, adds case studies and writing, and enforces accessibility, performance and asset budgets during every build.

Legacy infrastructure credentials from V1 are intentionally not included. Its archived production configuration reads secrets from environment variables instead.

## Requirements

- A current Node.js LTS release
- `npm` for V1–V3
- `pnpm` 10 for V4

Clone the repository once, then enter the directory for the version you want to run.

## V1 — Create React App

```bash
cd portfolio-v1
npm install
npm start
```

Production build:

```bash
npm run build
```

Build output: `portfolio-v1/build/`

## V2 — React and Vite

```bash
cd portfolio-v2
npm install
npm run dev
```

Production build and local preview:

```bash
npm run build
npm run preview
```

Build output: `portfolio-v2/dist/`

## V3 — Next.js

```bash
cd portfolio-v3
npm install
npm run dev
```

Production build and server:

```bash
npm run build
npm start
```

Build output: `portfolio-v3/.next/`

## V4 — Astro and Cloudflare Pages

```bash
cd portfolio-v4
pnpm install
pnpm dev
```

Validation, production build and local preview:

```bash
pnpm check
pnpm build
pnpm preview
```

Build output: `portfolio-v4/dist/`

The V4 build generates static pages, localized routes and 404 pages, responsive images, Open Graph cards, RSS feeds, a sitemap and exact CSP hashes. It also checks translation parity, style conventions, JavaScript and asset budgets.

### Root shortcuts for V4

From the repository root:

```bash
pnpm install:v4
pnpm dev
pnpm check:v4
pnpm build:v4
```

### Cloudflare Pages configuration

| Setting | Value |
|---|---|
| Root directory | `portfolio-v4` |
| Build command | `pnpm build` |
| Build output directory | `dist` |

The contact form requires `RESEND_API_KEY` as an encrypted Cloudflare Pages secret. `CONTACT_TO` and `CONTACT_FROM` are defined in `portfolio-v4/wrangler.toml`. Turnstile is optional; configure both `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET` to enable it.

For detailed V4 architecture, content, deployment and performance notes, see [`portfolio-v4/README.md`](portfolio-v4/README.md).

## License

All rights reserved. This code is not open source.
