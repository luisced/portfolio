# Portfolio V5 — one night of work

The portfolio as a single scroll-told scene: a pixel-art room at night, drawn live as Gaussian splats, where the content is written **on the things in the room** — the name on the floor, the positioning on the window glass, the projects in chalk on a board, the stack on a monitor, a note by the rubber duck, the awards on a trophy cabinet. Scrolling moves the camera from one surface to the next while the night goes by: the moon crosses the window, coffee cups pile up, the Rubik's cube ends solved, the cat falls asleep and the sun comes up.

Built with Astro, like V4: the room (`/` in English, `/es/` in Spanish), a case-study page per project and locale, and one worker script.

## Run it

```bash
cd portfolio-v5
pnpm install
pnpm dev           # http://localhost:4325
pnpm build         # static site in ./dist
pnpm preview       # serve the build
```

`pnpm dev` starts Astro's dev server in the background; stop it with `pnpm astro dev stop`.

## Where things are

| Path | What it is |
|---|---|
| `src/content/site.json` | Copy for the room and UI labels, both locales: name, headline, stack, links. |
| `src/content/projects/`, `src/assets/` | The case studies (MDX, one file per locale) and their images. |
| `src/pages/[...lang]/work/[slug].astro` | The case-study page. |
| `src/pages/index.astro`, `src/pages/es/index.astro` | The two pages; each renders `Story` in its locale. |
| `src/components/Story.astro` | The page: head, the fixed scene, and every `.surf` block — HTML that the viewer places on a surface of the room. |
| `src/styles/story.css` | The page's styles, including how each surface is "written" (chalk, glass, ink, monitor). |
| `src/scripts/story.js` | The viewer: camera shots per chapter, scroll → camera, HTML → 3D placement, WebGL drawing. |
| `src/scripts/room-gl.js` | The shaders: a GPU port of ink-studio's software renderer, including its inked-detail look. |
| `src/pages/room.js.ts` | Serves `/room.js`, the worker script, assembled by `src/lib/room.mjs`. |
| `src/lib/room.mjs` | Build-time side: concatenates the worker and draws the poster frame with the software renderer. |
| `room/worker.js` | Runs in the worker: builds the scene, steps the animation, sorts the splats every frame. |
| `room/scene.js` | The room itself: geometry, lighting, the cat puppet, and everything that changes with the story. |
| `vendor/ink-studio/` | The subset of ink-studio the scene uses. See its `NOTICE.md` — it is not open source. |

`room/` and `vendor/` are classic scripts that end up inside the worker, so they are read as text at build time and never go through Vite.

## How it loads

1. The HTML arrives with the first frame of the room inlined as a 9 KB poster, so there is something to look at immediately.
2. After the page is idle, a worker builds a quick version of the room (about half a second) and the live scene replaces the poster.
3. A second worker builds the high-definition version (inked detail everywhere, extra splat density around the desk) and takes over when it is ready. Touch devices skip the extra density.

Without WebGL2, or with data saver on, the poster stays and the content is shown as plain text over it.

## Editing content

Change `src/content/site.json`. To move text to another surface or add a chapter, edit the `.surf` blocks in `src/components/Story.astro` and the `SURF` and `shots()` tables in `src/scripts/story.js`; the number of chapters is the number of `<div>`s in `#track`.

## The greeting

The story opens on the whole room with the name on the floor. On the first scroll the lights go down, the camera moves in over the cat's shoulder to the central monitor, and a greeting writes itself by hand (`hola` / `hello`) while three lines of introduction type out; scrolling on brings the lights back. The lines and the bio card come from `src/content/site.json` (`intro`, `about`); the timing is in `src/scripts/intro.js`. "Lights off" is a third palette mixed in the final pass, like the sunrise at the end.

The handwriting strokes in `src/content/hello.json` are the paths of the [Apple Hello Effect](https://chanhdai.com/components/apple-hello-effect) by Chánh Đại (credits: JaceThings), MIT licensed, redrawn here with plain SVG and CSS instead of React and Motion.

## Case studies

`/work/{slug}/` (and `/es/work/{slug}/`) are ordinary pages outside the room: `src/pages/[...lang]/work/[slug].astro`, styled by `src/styles/case.css`. Their content is the `projects` collection in `src/content/projects/` — the five case studies from V4 with their images, plus Dopamina, iLuk and Vyvo, written from V4's home-page copy and experience entries. The chalkboard in the room lists the same collection, in `order`, and links to these pages.

Type is V4's: Archivo Variable and Azeret Mono, self-hosted through Fontsource.

## Awards

`/recognition/` (and `/es/recognition/`) lists awards, published research and credentials from `src/content/recognition/` (one YAML per entry, carried over from V4's profile), followed by an index of every project. In the room, the trophies and their plaques, and on the bookshelf the book cover and the two badges, are buttons: taking one opens a detail card (`#detail` in `Story.astro`, behaviour in `src/scripts/detail.js`) that also links here.

## Not carried over from V4

Notes, the résumé viewer, the contact form, RSS, structured data and Open Graph images still live only in `portfolio-v4/`.
