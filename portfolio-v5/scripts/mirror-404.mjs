// Cloudflare Pages serves the nearest 404.html up the tree, so /es/ needs its own at /es/404.html.
// Astro builds src/pages/es/404.astro as a regular page (dist/es/404/index.html); this moves it into place.
import fs from 'node:fs';

const from = 'dist/es/404/index.html', to = 'dist/es/404.html';
if (!fs.existsSync(from)) throw new Error(`${from} is missing: the Spanish 404 was not built`);
fs.renameSync(from, to);
fs.rmSync('dist/es/404', { recursive: true, force: true });
console.log(`404 mirror: ${to}`);
