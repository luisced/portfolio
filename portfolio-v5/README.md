# Portfolio V5 — one night of work

The portfolio as a single scroll-told scene: a pixel-art room at night, drawn live as Gaussian splats, where the content is written **on the things in the room** — the name on the floor, the positioning on the window glass, the projects in chalk on a board, the stack on a monitor, a note by the rubber duck, an award on a sticker. Scrolling moves the camera from one surface to the next while the night goes by: the moon crosses the window, coffee cups pile up, the Rubik's cube ends solved, the cat falls asleep and the sun comes up.

No framework and no dependencies: plain Node builds two static pages (`/` in English, `/es/` in Spanish) and one worker script.

## Run it

```bash
cd portfolio-v5
npm run dev        # build, then serve ./dist on http://localhost:4325
npm run build      # build only
```

The page must be served over http: the room runs in a Web Worker, which browsers do not start from `file://`.

## Where things are

| Path | What it is |
|---|---|
| `content/site.json` | All copy, both locales: name, headline, projects, stack, links. Emptied from V4's content collections. |
| `src/story.html` | The page template. `{{tokens}}` are filled by `build.js`; each `.surf` block is HTML placed on a surface of the room. |
| `src/story-client.js` | The viewer: camera shots per chapter, scroll → camera, HTML → 3D placement, WebGL drawing. |
| `src/room-gl.js` | The shaders: a GPU port of ink-studio's software renderer, including its inked-detail look. |
| `src/room-worker.js` | Runs in a worker: builds the scene, steps the animation, sorts the splats every frame. |
| `src/scene.js` | The room itself: geometry, lighting, the cat puppet, and everything that changes with the story. |
| `vendor/ink-studio/` | The subset of ink-studio the scene uses. See its `NOTICE.md` — it is not open source. |
| `build.js` | Writes `dist/`: the two pages (poster frame inlined), `room.js`, and `public/`. |

## How it loads

1. The HTML arrives with the first frame of the room inlined as a 9 KB poster, so there is something to look at immediately.
2. After the page is idle, a worker builds a quick version of the room (about half a second) and the live scene replaces the poster.
3. A second worker builds the high-definition version (inked detail everywhere, extra splat density around the desk) and takes over when it is ready. Touch devices skip the extra density.

Without WebGL2, or with data saver on, the poster stays and the content is shown as plain text over it.

## Editing content

Change `content/site.json` and rebuild. To move text to another surface or add a chapter, edit the `.surf` blocks in `src/story.html` and the `SURF` and `shots()` tables in `src/story-client.js`; the number of chapters is the number of `<div>`s in `#track`.

## Not carried over from V4

V5 is the home experience only. Case-study pages, notes, the résumé viewer, the contact form, RSS and Open Graph images still live in `portfolio-v4/`; project links here go to each project's live site or repository.
