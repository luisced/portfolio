# Portfolio V4 — Redesign Plan

Owner: Luis Cedillo Maldonado. Status: approved direction, ready for implementation.
Analysis inputs: `local://portfolio-analysis.md`, `local://analysis-v1.md`, `local://analysis-v2.md`, `local://analysis-v3.md`.
Reference worktrees: V1 `/tmp/pf-v1` (`origin/dev`), V2 `portfolio-v2/` (this branch), V3 `/tmp/pf-v3/portfolio-v3` (`origin/portfolio-v3`).

## 1. Decisions

| Decision | Choice | Consequence |
|---|---|---|
| Primary job | Balanced: hiring + freelance/client work + personal brand | Top layer must read fast for non-technical visitors; technical depth lives in case studies and writing. |
| Audience | Technical hiring teams and non-technical decision makers | Every project gets an outcome sentence first, then technical decisions. |
| Aesthetic | Cinematic digital workshop | Dark atmospheric default, light mode as a lit-workshop variant, scroll choreography with purpose, visible craft artifacts. |
| Structure | Single page + project case studies + writing | `/{locale}/` narrative page, `/{locale}/work/{slug}`, `/{locale}/notes/{slug}`. |
| Stack/hosting | Astro + Cloudflare Pages | Static-first HTML, islands only where interaction exists, Cloudflare Pages Functions for the contact form. |
| Language/theme | EN + ES, dark/light | One content source per entry with both locales; theme is a preference, never forced. |
| Motion | Highly immersive, but never at the cost of speed | Native scrolling only, GSAP ScrollTrigger as the single animation engine, reduced-motion parity, hard budgets below. |
| Contact | Hosted form/email service | Cloudflare Pages Function + Resend, Turnstile-gated, `mailto:` fallback without JS. |
| Timeline | No fixed deadline | Phases are gated by quality reviews, not dates. |

## 2. Goals and non-goals

Goals:
1. Professional, unique, memorable: a visitor remembers the "workshop" feeling and the case-study storytelling.
2. Lighting fast: performance budgets in §5 are release gates, not aspirations.
3. Single source of truth for content, bilingual by construction.
4. Accessibility parity: keyboard, screen reader, reduced motion, contrast, zoom.
5. Zero dead scaffolding shipped.

Non-goals:
- No Spline/three.js/WebGL scenes, no Lenis or any scroll hijacking, no Framer Motion alongside GSAP.
- No CMS or database. Content lives in the repo as Astro content collections.
- No resurrection of `backend/` from V3; nothing reusable exists there.
- No joke content (V3 "Future Corp" row) and no placeholder links (`github.com/example/oxxocorner`, `twitter.com/luisced`).

## 3. Concept: Cinematic Digital Workshop

Metaphor: the site is Luis's workshop after hours. Dark space, one strong light source, tools and artifacts on the bench, evidence of work in progress. Motion behaves like a camera moving through the room, not like UI decoration.

Signature moments (max five; each must earn its budget):
1. Hero "bench light": split-color name (carry from V3 `components/sections/hero-section.tsx`) with a radial light that follows the pointer subtly; on load a 1.2s staggered reveal. CSS-only where possible.
2. Work section as artifacts: project cards rendered as physical objects on the bench (project preview, role tag, outcome line, a small "spec plate"). Scroll reveals stagger cards in as if lights turn on shelf by shelf.
3. Career timeline as a workshop wall: pinned horizontal timeline evolved from V3 `components/timeline/timeline.tsx` concept, without the 8.8 MB sprites. Replace the sprite with an SVG/CSS "tool cursor" that moves along a rail. Keyboard arrows move between milestones.
4. Manifesto reveal: the V3 per-character scroll-scrubbed quote (`components/sections/intro-section.tsx`) reworked to use CSS `background-clip` gradient scrubbing over pre-split words (not `innerHTML` char injection).
5. Contact as "leave a note on the bench": form styled as a physical note, Turnstile inline, success state that pins the note to the wall.

Distinctive details: film grain overlay (carry V3 `body::after` noise, 2% opacity), a "blueprint" grid texture at low opacity in sections, `.method()` heading motif from V1/V2 for section titles (`work()`, `about(luis)`, `notes()`, `contact()`), custom cursor only on pointer devices.

## 4. Architecture

```
portfolio-v4/
  astro.config.mjs            # site: https://luiscedillo.com, i18n en/es, prefixDefaultLocale: false
  src/
    content/
      config.ts               # collections: projects, experience, notes, profile
      projects/{slug}.en.mdx + {slug}.es.mdx   (or single file with locale frontmatter, see §6)
      experience/{id}.yaml
      notes/{slug}.en.mdx, {slug}.es.mdx
      profile/profile.yaml    # identity, socials, skills, education, impact bullets
    i18n/
      ui.ts                   # UI strings for both locales, typed
      utils.ts                # getLangFromUrl, useTranslations, getLocalizedPath
    layouts/Base.astro        # head, fonts, theme init (inline no-flash), skip link, nav, footer
    components/
      sections/ Hero, Work, Manifesto, Timeline, About, Notes, Contact, Footer  (.astro)
      islands/ TimelineRail.tsx? -> prefer .astro + vanilla TS; only Contact form + theme/lang toggles need client JS
      ui/ Button, Badge, SpecPlate, GrainOverlay, MethodHeading
    scripts/
      motion.ts               # single GSAP entry, ScrollTrigger registration, prefersReducedMotion gate
      theme.ts                # data-theme toggle, localStorage 'theme', prefers-color-scheme
    styles/
      tokens.css              # design tokens (§7)
      base.css                # reset, typography, focus rings, grain, blueprint grid
    pages/
      index.astro             # redirects / -> /en/ (or renders en; prefixDefaultLocale false)
      [lang]/index.astro
      [lang]/work/[slug].astro
      [lang]/notes/index.astro
      [lang]/notes/[slug].astro
      [lang]/404.astro
      og/[...path].png.ts     # generated OG images per page (satori/resvg) — replaces 5.3 MB og-image.jpg
      rss.xml.ts              # notes feed
      sitemap via @astrojs/sitemap with i18n alternates
  functions/
    api/contact.ts            # Cloudflare Pages Function: Turnstile verify + Resend send
  public/
    fonts/ (self-hosted woff2, subset)
    cv/Luis-Cedillo-Maldonado-CV.pdf
```

Client JS islands (exhaustive list; anything else is static HTML + CSS):
1. `motion.ts` (GSAP core + ScrollTrigger, loaded with `client:visible`-like deferral via a module script after first paint; skipped entirely when `prefers-reduced-motion: reduce`).
2. Theme toggle and language switcher (vanilla TS, < 2 KB).
3. Contact form (vanilla TS + Turnstile script loaded on form intersection).
4. Timeline keyboard navigation (vanilla TS in the same module as motion).

No React/Preact runtime unless a component genuinely needs it; the default is zero framework JS.

Routing and i18n:
- Astro built-in i18n, `defaultLocale: 'en'`, `locales: ['en','es']`, `routing.prefixDefaultLocale: false` (mirrors V3 `localePrefix: 'as-needed'`).
- `<link rel="alternate" hreflang>` on every page, `lang` attribute per route, localized 404.
- Language switcher preserves the current path.

Hosting:
- Cloudflare Pages, build `astro build`, output `dist/`. Single `wrangler.toml` for Pages project + Functions bindings (`RESEND_API_KEY`, `TURNSTILE_SECRET` as secrets). Delete `vercel.json`, `.cloudflare/pages.toml`, `deploy-cloudflare.sh` equivalents from V2 when V2 is retired.
- `_headers`: immutable caching for hashed assets, `Content-Security-Policy` allowing self, Turnstile, Resend not needed client-side.

## 5. Performance and quality budgets (release gates)

| Metric | Budget | How verified |
|---|---|---|
| Lighthouse (mobile, throttled) | 100 / 100 / 100 / 100 on `/`, `/es/`, one case study, one note | Lighthouse CI in GitHub Actions, `lighthouserc.json` assertions |
| LCP | < 1.0 s on landing (hero text is LCP; hero image `fetchpriority="high"`, < 60 KB AVIF) | Lighthouse CI |
| CLS | 0 | Lighthouse CI; all media have width/height; fonts `size-adjust` fallbacks |
| INP | < 100 ms | Lighthouse CI + manual timeline interaction test |
| JS shipped on landing | ≤ 55 KB gzip total, of which GSAP core+ScrollTrigger ≤ 35 KB; 0 KB when reduced motion | `astro build` output + `bundlesize`/`size-limit` check |
| CSS | ≤ 25 KB gzip | build output check |
| Fonts | ≤ 2 families, ≤ 4 files, each ≤ 30 KB woff2 subset (latin + latin-ext), `font-display: swap` with metric-matched fallback | build output check |
| Images | Every raster ≤ 200 KB; hero ≤ 60 KB; `astro:assets` generates AVIF/WebP + srcset; OG images generated ≤ 80 KB | script in §10 asserts sizes in `dist/` |
| Total landing transfer | ≤ 400 KB before below-fold lazy assets | WebPageTest/Lighthouse network summary |
| Accessibility | axe: 0 violations; keyboard-only run through every section; VoiceOver pass on landing + form | manual checklist in §10 |

If a signature moment cannot meet budget, the moment is simplified, not the budget.

## 6. Content model and migration

Canonical sources to migrate (with fixes):
- Projects: `portfolio-v2/src/features/portfolio/data/ProjectDataEn.ts` and `ProjectDataEs.ts` → `src/content/projects/*.mdx`. Images from `portfolio-v2/src/assets/images/{genesis,homecare,oxxocorner,upocket,stackup}/` (25 webp) re-exported through `astro:assets`. Fix: Oxxo Corner GitHub link is a placeholder; obtain a real link or remove the GitHub CTA for that project.
- Experience: `portfolio-v2/src/features/about/components/data/TimelineDataEn.ts` and `TimelineDataEs.ts` → `src/content/experience/*.yaml` (5 real entries; no speculative rows). Fix: reword the "120%" Flowlink claim into a verifiable statement (hours saved, or a ratio).
- Profile, skills, education, impact bullets, socials: `portfolio-v2/src/features/about/components/BentoGrid.tsx`, `portfolio-v2/src/i18n/locales/{en,es}/translation.json`, `portfolio-v2/src/utils/constants.ts`, `/tmp/pf-v1/src/components/Details/DetailsData.js` (education, languages) → `src/content/profile/profile.yaml`. Fix: unify handles to `github.com/luisced`, `linkedin.com/in/luisced`, `instagram.com/lui._.cedm`; drop the V2 JSON-LD `luismcedillo` handles; drop the V3 `twitter.com/luisced` link.
- Manifesto quote: `/tmp/pf-v3/portfolio-v3/messages/en.json` and `es.json` `intro.quote`.
- CV: `portfolio-v2/src/assets/documents/Luis Cedillo Maldonado CV.pdf` → `public/cv/Luis-Cedillo-Maldonado-CV.pdf` (update content first if outdated).
- Skill proficiency percentages (V1/V3) are dropped; skills render as grouped, plain, with evidence links to projects.

Content collection schemas (zod, in `src/content/config.ts`):
- `projects`: `slug`, `locale`, `title`, `role`, `category` (`ios | web | backend`), `timeframe`, `outcome` (one sentence, non-technical), `summary`, `stack[]`, `links { live?, repo? }`, `cover` (image), `gallery[]`, `featured` (bool), `order`. Body MDX = case study with fixed headings: Context, My role, Decisions, Result, What I would do differently.
- `experience`: `id`, `org`, `role { en, es }`, `start`, `end?`, `location`, `highlights { en[], es[] }`, `tags[]`, `accent` (token name, not hex).
- `notes`: `title`, `locale`, `date`, `summary`, `tags[]`, `draft`.
- `profile`: `name`, `headline { en, es }`, `bio { en, es }`, `location`, `timezone`, `email`, `whatsapp`, `socials[]`, `skills { group, items[] }[]`, `education[]`, `languages[]`, `availability`.

Locale strategy: one file per entry per locale for MDX (`{slug}.en.mdx`, `{slug}.es.mdx`) sharing frontmatter via a `base` field validated equal across locales by a build-time check; YAML entries carry both locales inline. A missing locale fails the build.

Case studies to write first (featured): StackUp/Flowlink Channel Manager (live URL, business outcome), UPocket (15k+ students, measurable), Dermaware–Genesis (leadership, iOS). Homecare and Oxxo Corner become shorter project pages.

Writing section launch content: two notes minimum before release so the section is not empty (candidates: "Designing a channel manager sync that stays consistent under partial failures", "What running a university iOS lab taught me about shipping").

## 7. Design system

Typography (self-hosted, subset, pair a characterful display with a precise body; no Inter/Roboto/Arial/Space Grotesk):
- Display: a high-contrast grotesk or serif with personality suited to a workshop (candidates to evaluate in Phase 1 with real headlines: "Instrument Serif" for the name and section titles, or "Bricolage Grotesque" for a more industrial read). Pick one after rendering both in the hero.
- Body: "IBM Plex Sans" or "Source Sans 3" for long-form case studies (evaluate legibility at 16–18px in both themes).
- Mono: "IBM Plex Mono" or "JetBrains Mono" for `.method()` headings, spec plates, code in notes.
- Fluid type scale with `clamp()`: 14, 16, 18, 22, 28, 40, 64, 96 px anchors.

Color tokens (`src/styles/tokens.css`, OKLCH, both themes):
- Dark (default): background near-black with warm tint (`oklch(0.16 0.01 60)`), surfaces one and two steps lighter, text `oklch(0.95 0.01 80)`, brand green retained from all versions (`#29ae80` → `oklch(0.65 0.13 163)`), one warm accent for the "bench light" (amber `oklch(0.80 0.12 75)`), semantic success/danger/warning.
- Light: paper-like background (`oklch(0.97 0.01 80)`), same brand green darkened for 4.5:1 contrast, amber becomes a subtle highlight.
- All color pairs verified at 4.5:1 (text) and 3:1 (large text / UI) in both themes before Phase 2 starts.

Spacing, radius, elevation: 8pt spacing scale (4–128), radius 4/8/12/20, elevation via layered shadows plus a 1px light-edge border in dark mode (workshop "rim light").

Motion tokens: durations 120/240/480/900 ms; easings `--ease-out: cubic-bezier(.16,1,.3,1)`, `--ease-in-out: cubic-bezier(.65,0,.35,1)`. Global reduced-motion rule collapses durations; `motion.ts` never loads when reduced motion is on.

Breakpoints: exactly four, defined once as CSS custom media in `tokens.css` and consumed everywhere: 480, 768, 1024, 1440. No other pixel values allowed in media queries (lint rule in §10).

## 8. Information architecture

Landing (`/`, `/es/`):
1. Hero: name, headline, one-line positioning, two CTAs (See work, Get in touch), availability chip, language and theme controls in the nav.
2. Featured work: 3 featured artifacts + link to all work.
3. Manifesto: the quote reveal.
4. Timeline: 5 real milestones, pinned rail on desktop, vertical list on mobile.
5. About: short bio, skills grouped with evidence, education, location/timezone, CV download.
6. Notes: latest 3 with dates.
7. Contact: note-on-the-bench form + direct email + socials.
8. Footer: `.method()` quick links, copyright, RSS.

Case study (`/work/{slug}`): hero with cover, spec plate (role, timeframe, stack, links), outcome first, then Context → My role → Decisions → Result → What I would do differently, gallery, next/previous project.

Notes (`/notes`, `/notes/{slug}`): list with dates and tags; article layout with generous measure, code blocks, reading time, RSS.

## 9. Implementation phases

Each build phase invokes `skill://frontend-design` before coding to commit to the aesthetic execution for that surface; each review gate invokes `skill://emotional-interface-audit` on the actual rendered surface and produces findings with P0–P3 severities. A phase closes only when P0/P1 findings are fixed and budgets hold.

Phase 0 — Foundation
- Scaffold `portfolio-v4/` with Astro, `@astrojs/sitemap`, `@astrojs/mdx`, i18n config, content collections and schemas (§6), `tokens.css`, `base.css`, `Base.astro` (no-flash theme init inline script, skip link, fonts).
- Cloudflare Pages project + `wrangler.toml`, `_headers`, Lighthouse CI workflow with assertions from §5, size-limit check, image-size assertion script.
- Migrate content (§6) with fixes; build fails if any locale is missing.
- Exit: `astro build` succeeds; landing shell renders both locales in both themes; Lighthouse 100×4 on the empty shell.

Phase 1 — Hero + navigation + design system proof
- Frontend-design pass: render both display font candidates in the real hero, choose one, lock tokens.
- Build Hero, nav (language, theme, section anchors), footer, grain and blueprint textures.
- Motion: load reveal (CSS), pointer "bench light" (CSS variables updated by a 300-byte script, pointer devices only).
- Review gate: emotional-interface-audit on landing hero in both themes and locales, mobile and desktop.
- Exit: LCP < 1.0 s, JS ≤ 5 KB (GSAP not yet loaded), audit P0/P1 cleared.

Phase 2 — Work + case studies
- Frontend-design pass on artifact cards and case-study layout.
- Build Work section, `/work/{slug}` pages, gallery, spec plate, prev/next.
- Write 3 featured case studies in EN and ES.
- Motion: GSAP enters here; shelf-by-shelf reveal; verify 0 KB under reduced motion.
- Generated OG images per project.
- Review gate: audit a case study as a hiring manager and as a client; check outcome-first readability.
- Exit: budgets hold on landing and case study; images all within limits.

Phase 3 — Manifesto + Timeline + About
- Frontend-design pass on the timeline rail as a workshop wall.
- Build Manifesto reveal (word-based scrub), pinned Timeline with keyboard navigation and a vertical fallback ≤ 768 px, About with grouped skills linking to evidence.
- Review gate: audit the pinned section specifically for feeling trapped (scroll must never lock; ScrollTrigger `pin` distance ≤ 2 viewports; escape via keyboard at any time).
- Exit: INP < 100 ms during timeline interaction; reduced-motion renders a static, complete timeline.

Phase 4 — Notes + Contact + Function
- Build Notes list/article layouts, RSS, two launch notes in EN/ES.
- Contact: form markup works without JS (`action` posts to the Function, server returns a localized HTML confirmation); progressive enhancement adds inline validation, Turnstile, `aria-live` status; Function verifies Turnstile and sends via Resend; rate limit by IP with Cloudflare KV or Turnstile alone.
- Review gate: audit form states (empty, error, sending, success, failure) for anxiety and recovery; verify no field errors are color-only.
- Exit: end-to-end email received in staging; spam test with invalid Turnstile rejected; budgets hold.

Phase 5 — Hardening and launch
- Full emotional-interface-audit of the whole site as a first-time visitor in each audience, both locales, both themes.
- Accessibility pass: keyboard-only walkthrough, VoiceOver, 200% zoom, contrast re-check, `prefers-reduced-motion` walkthrough.
- SEO: per-page titles/descriptions, hreflang, JSON-LD Person + CreativeWork per project with corrected handles, sitemap, robots, canonical.
- Analytics: Cloudflare Web Analytics (no cookies, no JS budget impact beyond its beacon) or none.
- Cutover: point `luiscedillo.com` to the new Pages project; keep V2 deploy available for 1 week; then delete V2 deploy configs and archive `portfolio-v2/` (move to `archive/` or remove, per git history preference).
- Exit: all §5 gates green on production URL; audit report archived in `docs/audits/`.

## 10. Verification and tooling

- `lighthouserc.json`: `categories:* >= 1.0`, `largest-contentful-paint <= 1000`, `cumulative-layout-shift <= 0`, `interactive <= 2000`, run against `/`, `/es/`, `/work/stackup-channel-manager/`, `/notes/<first-note>/`.
- `scripts/check-assets.mjs`: walks `dist/`, fails on any raster > 200 KB, hero > 60 KB, OG > 80 KB, any `.png` not in an allowlist.
- `size-limit` config: landing JS ≤ 55 KB gzip, CSS ≤ 25 KB gzip.
- Stylelint rule: media queries may only use the four custom media tokens.
- Build-time i18n check: every collection entry present in both locales; every `ui.ts` key present in both.
- Manual checklists stored in `docs/checklists/{a11y,motion,content}.md` and executed at each review gate.
- Browser verification for every phase: open the local build, screenshot both themes and both locales at 390×844 and 1440×900, attach to the phase's audit notes.

## 11. Risks and mitigations

- Immersive motion vs budget: GSAP capped at ~35 KB and loaded after first paint; every moment has a CSS-only or static fallback; budgets are gates.
- Bilingual case studies double writing effort: write EN first per project, translate before the phase closes; build fails on missing locale so nothing ships half-translated.
- Fonts add weight and CLS risk: subset to used glyphs, metric-matched fallbacks via `size-adjust`, at most 4 files.
- Contact deliverability: Resend domain verification for `luiscedillo.com` set up in Phase 0; staging test in Phase 4.
- Content accuracy (claims like "120%"): every metric in the profile and case studies must be phrased as something Luis can defend in an interview; flagged items are reworded before migration.
- Timeline pin causing "trapped" feeling: pin distance capped, native scroll preserved, keyboard escape, mobile uses a non-pinned vertical layout.

## 12. Open items for Luis before Phase 2

1. Real repository or public artifact for Oxxo Corner (or approve removing its GitHub CTA).
2. Reworded Flowlink impact statement.
3. Current CV PDF.
4. Confirm Resend (or alternative) account and domain ownership for `luiscedillo.com`.
5. Approve the final display font after the Phase 1 hero rendering.
