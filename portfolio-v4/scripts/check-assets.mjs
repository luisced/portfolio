// Fails the build when dist/ ships media over budget (PLAN.md §5).
import { readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

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
if (failures.length) {
  console.error('Asset budget exceeded:\n' + failures.map((f) => `  ${f}`).join('\n'));
  process.exit(1);
}
console.log('check-assets: ok');
