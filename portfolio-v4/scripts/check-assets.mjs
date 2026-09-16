// Fails the build when dist/ ships media or landing JS over budget (PLAN.md §5).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, extname, dirname, resolve } from 'node:path';

const LIMITS = { default: 200 * 1024, og: 80 * 1024 };
const RASTER = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif']);
const failures = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (RASTER.has(extname(name).toLowerCase())) {
      const limit = p.includes('/og/') ? LIMITS.og : LIMITS.default;
      if (s.size > limit) failures.push(`${p} ${(s.size / 1024).toFixed(0)} KB > ${(limit / 1024).toFixed(0)} KB`);
    }
  }
}

walk('dist');

// Landing JS: entry scripts plus every chunk reachable through static/dynamic imports.
// Round three is React + GSAP + React Bits by decision (see PLAN.md §5). GSAP is the only animation
// library (motion/lenis/ogl were removed); measured 138 KB gz, gate at 160.
const JS_BUDGET = 160 * 1024;
const FONT_BUDGET = 4;
const html = readFileSync('dist/index.html', 'utf8');
const seen = new Set();
// Entry points: hoisted scripts plus every island's component + renderer (Astro loads those lazily).
const queue = [
  ...[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]),
  ...[...html.matchAll(/(?:component-url|renderer-url)="([^"]+)"/g)].map((m) => m[1]),
];
let jsGz = 0;
while (queue.length) {
  const url = queue.pop();
  if (seen.has(url)) continue;
  seen.add(url);
  const file = join('dist', url);
  const src = readFileSync(file, 'utf8');
  jsGz += gzipSync(src, { level: 9 }).length;
  for (const m of src.matchAll(/import\(\s*["'`]([^"'`]+)["'`]\s*\)|from\s*["']([^"']+)["']/g)) {
    const spec = m[1] ?? m[2];
    if (spec.startsWith('.')) queue.push('/' + resolve(dirname(url), spec).slice(1));
  }
}
if (jsGz > JS_BUDGET) failures.push(`landing JS ${(jsGz / 1024).toFixed(1)} KB gz > ${JS_BUDGET / 1024} KB (${[...seen].join(', ')})`);
// Fonts the landing can actually load: woff2 URLs referenced from its (inlined) CSS and preloads.
// fontsource also emits legacy .woff fallbacks; browsers only fetch the matching .woff2.
const fonts = [...new Set([...html.matchAll(/\/_astro\/[^"')\s]+\.woff2/g)].map((m) => m[0]))];
if (fonts.length > FONT_BUDGET) failures.push(`${fonts.length} font files shipped > ${FONT_BUDGET}`);

if (failures.length) {
  console.error('Asset budget exceeded:\n' + failures.map((f) => `  ${f}`).join('\n'));
  process.exit(1);
}
console.log(`check-assets: ok (landing JS ${(jsGz / 1024).toFixed(1)} KB gz, ${fonts.length} font files)`);
