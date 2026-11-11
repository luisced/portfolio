import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
for (const [prefix, download, share, fit] of [['', 'Download', 'Share', 'Fit width'], ['es/', 'Descargar', 'Compartir', 'Ajustar']]) {
  const path = `dist/${prefix}resume/index.html`;
  assert.ok(existsSync(path), `Missing owned viewer: ${path}`);
  const html = readFileSync(path, 'utf8');
  for (const value of ['data-zoom-controls', 'data-page-nav', 'data-pdf-viewer', 'data-pdf-pane', 'data-zoom-in', 'data-zoom-out', 'data-fit', 'data-share', 'aria-live="polite"', download, share, fit, 'href="/resumee.pdf"', 'download="Luis-Cedillo-CV.pdf"', '<noscript>']) assert.ok(html.includes(value), `${path}: missing ${value}`);
  assert.ok(!/<(?:iframe|object|embed)\b/i.test(html));
  const home = readFileSync(`dist/${prefix}index.html`, 'utf8');
  assert.ok(home.includes(`href="/${prefix}resume/" target="_blank" rel="noopener"`), 'Homepage must open localized viewer safely');
}
console.log('check-resume-viewer: ok');
