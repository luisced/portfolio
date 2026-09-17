// Every content entry must exist in both locales with identical shared frontmatter.
// Every UI key must exist in both locales. Media queries may only use the four custom media tokens.
import { readdirSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const errors = [];
const LOCALES = ['en', 'es'];

function frontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].trim();
  }
  return out;
}

// 1. Localized MDX collections: {slug}.{locale}.mdx pairs, shared keys equal.
const SHARED = { projects: ['slug', 'category', 'order', 'featured', 'cover'], notes: ['slug', 'tags'] };
for (const [collection, sharedKeys] of Object.entries(SHARED)) {
  const dir = join('src/content', collection);
  let files = [];
  try { files = readdirSync(dir).filter((f) => f.endsWith('.mdx')); } catch { continue; }
  const bySlug = new Map();
  for (const f of files) {
    const m = f.match(/^(.+)\.(en|es)\.mdx$/);
    if (!m) { errors.push(`${collection}/${f}: expected {slug}.{en|es}.mdx`); continue; }
    const [, slug, locale] = m;
    const fm = frontmatter(readFileSync(join(dir, f), 'utf8'));
    if (fm.slug !== slug) errors.push(`${collection}/${f}: frontmatter slug "${fm.slug}" != filename slug "${slug}"`);
    if (fm.locale !== locale) errors.push(`${collection}/${f}: frontmatter locale "${fm.locale}" != filename locale "${locale}"`);
    if (!bySlug.has(slug)) bySlug.set(slug, {});
    bySlug.get(slug)[locale] = fm;
  }
  for (const [slug, locales] of bySlug) {
    for (const l of LOCALES) if (!locales[l]) errors.push(`${collection}/${slug}: missing ${l} locale`);
    if (locales.en && locales.es) {
      for (const k of sharedKeys) {
        if ((locales.en[k] ?? '') !== (locales.es[k] ?? '')) {
          errors.push(`${collection}/${slug}: shared key "${k}" differs (en="${locales.en[k]}" es="${locales.es[k]}")`);
        }
      }
    }
  }
}

// 2. UI keys.
const ui = readFileSync('src/i18n/ui.ts', 'utf8');
const blocks = [...ui.matchAll(/^\s{2}(en|es): \{([\s\S]*?)^\s{2}\},/gm)];
const keys = Object.fromEntries(blocks.map(([, l, body]) => [l, new Set([...body.matchAll(/'([\w.]+)':/g)].map((m) => m[1]))]));
for (const k of keys.en ?? []) if (!keys.es?.has(k)) errors.push(`ui.ts: key "${k}" missing in es`);
for (const k of keys.es ?? []) if (!keys.en?.has(k)) errors.push(`ui.ts: key "${k}" missing in en`);

// 3. Media queries: only custom media tokens.
function walk(dir, acc = []) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) walk(p, acc);
    else if (['.astro', '.css'].includes(extname(name.name))) acc.push(p);
  }
  return acc;
}
for (const file of walk('src')) {
  if (file.endsWith('tokens.css') || file.includes('/reactbits/')) continue; // vendored React Bits CSS is third-party
  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(/@media\s+([^{]+)\{/g)) {
    const q = m[1].trim();
    if (/\d+(px|em|rem)/.test(q)) errors.push(`${file}: raw breakpoint in "@media ${q}": use --sm/--md/--lg/--xl`);
  }
}

if (errors.length) {
  console.error('check-i18n failed:\n' + errors.map((e) => `  ${e}`).join('\n'));
  process.exit(1);
}
console.log('check-i18n: ok');
