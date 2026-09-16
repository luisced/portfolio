// Generates src/styles/font-fallbacks.css: metric-matched local fallback faces so the
// swap from system font → webfont causes no layout shift (PLAN.md §5 CLS = 0).
// Run once when fonts change: `node scripts/font-fallbacks.mjs`. Output is committed.
//
// Formulas (same as fontaine / capsize):
//   size-adjust     = (web.avgWidth / web.upm) / (fb.avgWidth / fb.upm)
//   ascent-override = (web.ascent / web.upm) / size-adjust
//   descent-override, line-gap-override likewise.
import { writeFileSync } from 'node:fs';
const fontkit = await import('fontkit').catch(() => null);
if (!fontkit) {
  console.log('font-fallbacks: `pnpm add -D fontkit` first, then configure FONTS below.');
  process.exit(0);
}

const SYS = '/System/Library/Fonts';
const FS = 'node_modules/@fontsource';
// English/Spanish letter frequencies, so widths are weighted like real body copy.
const SAMPLE =
  'eeeeeeeeeeeeaaaaaaaaaooooooooiiiiiiinnnnnnnsssssssrrrrrrrtttttttllllllccccccdddddduuuuummmmppppgggbbbfvhqyjzxkw ' +
  'ETAOINSRHL';

function metrics(font) {
  const upm = font.unitsPerEm;
  // hhea metrics are what browsers use for line boxes. Width comes from laying out a
  // sample string: OS/2 xAvgCharWidth is recomputed over the subset and not comparable.
  return {
    upm,
    ascent: font.ascent / upm,
    descent: Math.abs(font.descent / upm),
    lineGap: font.lineGap / upm,
    avg: font.layout(SAMPLE).advanceWidth / SAMPLE.length / upm,
  };
}

function open(path, postscriptName) {
  const f = fontkit.openSync(path);
  // .ttc collections: pick a face by name.
  return 'fonts' in f ? f.fonts.find((x) => x.postscriptName === postscriptName) ?? f.fonts[0] : f;
}

const pct = (n) => `${(n * 100).toFixed(4)}%`;

function face(family, local, style, web, fb) {
  const w = metrics(web);
  const b = metrics(fb);
  const size = w.avg / b.avg;
  return `@font-face {
  font-family: '${family}';
  src: local('${local}');
  font-style: ${style};
  size-adjust: ${pct(size)};
  ascent-override: ${pct(w.ascent / size)};
  descent-override: ${pct(w.descent / size)};
  line-gap-override: ${pct(w.lineGap / size)};
}`;
}

// ── Configure for the chosen webfonts, then run `node scripts/font-fallbacks.mjs`. ──
// Example (kept from a previous iteration):
//   const web = open(`node_modules/@fontsource/<family>/files/<family>-latin-400-normal.woff`);
//   const helvetica = open(`${SYS}/HelveticaNeue.ttc`, 'HelveticaNeue');
//   const css = `${face('<Family> Fallback', 'Helvetica Neue', 'normal', web, helvetica)}`;
//   writeFileSync('src/styles/font-fallbacks.css', css);
// Requires `pnpm add -D fontkit`. The base currently uses system fonts, so nothing is generated.
console.log('font-fallbacks: configure FONTS in this script first (see comment).');
