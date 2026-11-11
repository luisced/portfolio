import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const arrows = /[\u2190-\u21ff\u2794\u27a1]/u;
const failures = [];
function walk(dir, extension) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path, extension) : path.endsWith(extension) ? [path] : [];
  });
}

// Comments, scripts and frontmatter are not UI. Content prose is not scanned.
for (const path of [...walk('src/components', '.astro'), ...walk('src/pages', '.astro')]) {
  const source = readFileSync(path, 'utf8').replace(/^---[\s\S]*?---/, '')
    .replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  if (arrows.test(source)) failures.push(`${path}: directional Unicode remains in UI markup or CSS`);
}
const componentPath = 'src/components/ArrowIcon.astro';
if (!existsSync(componentPath)) failures.push(`${componentPath}: shared inline SVG is missing`);
else {
  const source = readFileSync(componentPath, 'utf8');
  for (const direction of ['up-right', 'down-right', 'up-left', 'down-left', 'left', 'right', 'up', 'down']) {
    if (!source.includes(`'${direction}'`)) failures.push(`ArrowIcon: missing ${direction} support`);
  }
  for (const attribute of ['viewBox="0 0 24 24"', 'stroke="currentColor"', 'fill="none"', 'aria-hidden="true"', 'focusable="false"', 'width="1em"', 'height="1em"']) {
    if (!source.includes(attribute)) failures.push(`ArrowIcon: missing ${attribute}`);
  }
  for (const style of ['flex-shrink: 0', 'display: inline-block', 'vertical-align: middle']) {
    if (!source.includes(style)) failures.push(`ArrowIcon: missing ${style}`);
  }
}

if (!process.argv.includes('--source-only')) {
  for (const locale of ['', 'es/']) {
    for (const route of ['', 'work/', 'notes/']) {
      const path = `dist/${locale}${route}index.html`;
      assert.ok(existsSync(path), `Build first: ${path} is missing`);
    }
  }
  const pages = walk('dist', '.html');
  let count = 0;
  for (const path of pages) {
    const html = readFileSync(path, 'utf8');
    // Only decorative/link/control UI, not meaningful article text or code.
    const ui = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<!--[\s\S]*?-->/g, '');
    for (const match of ui.matchAll(/<(a|button|span|figcaption)\b[^>]*>([^<]*)</g)) {
      if (arrows.test(match[2])) failures.push(`${path}: directional Unicode in ${match[1]} UI`);
    }
    const icons = [...html.matchAll(/<svg\b[^>]*data-arrow-icon[^>]*>[\s\S]*?<\/svg>/g)];
    const isNotFound = /\/404(?:\/index)?\.html$/.test(path);
    if (!icons.length && !isNotFound) failures.push(`${path}: missing rendered shared SVG icons`);
    for (const [icon] of icons) {
      for (const attribute of ['viewBox="0 0 24 24"', 'stroke="currentColor"', 'fill="none"', 'aria-hidden="true"', 'focusable="false"', 'width="1em"', 'height="1em"']) {
        if (!icon.includes(attribute)) failures.push(`${path}: rendered icon missing ${attribute}`);
      }
      if (!/<path\b[^>]*d="[^"]+"/.test(icon)) failures.push(`${path}: empty SVG geometry`);
      count++;
    }
  }
  console.log(`Rendered arrow coverage: ${pages.length} pages, ${count} decorative SVGs, English and Spanish.`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Arrow icon regression checks passed.');
