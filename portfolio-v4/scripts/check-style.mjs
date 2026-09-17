import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const files = ['README.md', 'AGENTS.md'];
const extensions = new Set(['.astro', '.css', '.js', '.mjs', '.mdx', '.ts', '.yaml']);

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (extensions.has(extname(entry.name))) files.push(path);
  }
}

walk('src');
walk('scripts');
walk('functions');

const errors = [];
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  for (const [index, line] of source.split('\n').entries()) {
    if (line.includes('\u2014')) errors.push(`${file}:${index + 1}: em dash is not allowed`);
  }
}

if (errors.length) {
  console.error('check-style failed:\n' + errors.map((error) => `  ${error}`).join('\n'));
  process.exit(1);
}

console.log('check-style: ok');
