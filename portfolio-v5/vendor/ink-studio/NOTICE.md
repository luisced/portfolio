# ink-studio (vendored subset)

Source: https://github.com/siliconjungle/shapeshift-labs-ink-studio
Commit: `0713810ca9a763a012fc0cea272a5620a6e853e9` (2026-11-16)
Package: `@shapeshift-labs/ink-studio` 0.1.0 — marked `private` and `UNLICENSED` upstream.

These files are **not** covered by this repository's terms. They are included here with the author's permission, as stated by the owner of this portfolio; they carry no licence that lets anyone else copy or redistribute them. Ask the upstream author before reusing them.

Only what the room needs is vendored, unmodified:

| File | Used for |
|---|---|
| `src/pixel-look.js`, `src/builder.js`, `src/sculpt.js` | sculpting the scene and baking it into splats |
| `src/kit/k0-math.js`, `k1-stage.js`, `k3-shapes.js`, `k7-particles.js`, `ki-deform.js` | stage, shapes, particles, puppet and bones |
| `cli/render.js` | build time only: draws the poster frame |

`build.js` concatenates the `src/` files into `dist/room.js`, so the published site ships them too.
