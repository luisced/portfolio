// Cloudflare Pages serves `404.html` (root) and `<dir>/404.html` (per-directory) for
// unmatched routes. `[...lang]/404.astro` emits `404/index.html`; mirror it to both shapes.
import { copyFileSync, existsSync } from 'node:fs';

for (const dir of ['', 'es/']) {
  const src = `dist/${dir}404/index.html`;
  if (!existsSync(src)) throw new Error(`missing ${src}`);
  copyFileSync(src, `dist/${dir}404.html`);
}
console.log('postbuild: 404.html + es/404.html in place');
