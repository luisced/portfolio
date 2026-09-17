import { copyFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

// Cloudflare Pages expects these exact fallback filenames.
for (const dir of ['', 'es/']) {
  const src = `dist/${dir}404/index.html`;
  if (!existsSync(src)) throw new Error(`missing ${src}`);
  copyFileSync(src, `dist/${dir}404.html`);
}

// Astro inlines small modules. Authorize their exact emitted bytes, not arbitrary
// inline scripts, so theme, chapter navigation and contact work under the CSP.
const hashes = new Set();
function collectHashes(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) collectHashes(path);
    else if (entry.name.endsWith('.html')) {
      for (const [, attrs, source] of readFileSync(path, 'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
        if (/\bsrc=/.test(attrs) || !source.trim()) continue;
        hashes.add(`'sha256-${createHash('sha256').update(source).digest('base64')}'`);
      }
    }
  }
}
collectHashes('dist');
const headers = readFileSync('public/_headers', 'utf8');
if (!headers.includes("script-src 'self'")) throw new Error('Missing script-src policy in public/_headers');
writeFileSync('dist/_headers', headers.replace("script-src 'self'", `script-src 'self' ${[...hashes].sort().join(' ')}`));
console.log(`postbuild: localized 404s + ${hashes.size} exact CSP script hashes`);
