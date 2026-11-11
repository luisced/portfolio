// Exercise the real pinned parser, glyph renderer and approved PDF without a server.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
const loading = getDocument({ data: new Uint8Array(readFileSync('public/resumee.pdf')), disableFontFace: true, useWasm: false, isEvalSupported: false });
try {
  const pdf = await loading.promise;
  assert.ok(pdf.numPages >= 1);
  for (let number = 1; number <= pdf.numPages; number++) {
    const page = await pdf.getPage(number);
    const text = await page.getTextContent();
    assert.ok(text.items.some(item => 'str' in item && item.str.includes('Luis')));
    const viewport = page.getViewport({ scale: .6 });
    const target = pdf.canvasFactory.create(Math.ceil(viewport.width), Math.ceil(viewport.height));
    try {
      await page.render({ canvas: target.canvas, viewport }).promise;
      const pixels = target.context.getImageData(0, 0, target.canvas.width, target.canvas.height).data;
      let ink = 0;
      for (let index = 0; index < pixels.length; index += 4) if (pixels[index] < 200 && pixels[index + 3] > 0) ink++;
      assert.ok(ink > 1000, `Page ${number} must contain real rendered ink`);
      console.log(`check-resume-document: page ${number}, ${text.items.length} text items, ${ink} ink pixels`);
    } finally { pdf.canvasFactory.destroy(target); }
  }
} finally { await loading.destroy(); }
