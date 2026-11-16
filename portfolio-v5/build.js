// Builds portfolio-v5 into ./dist:
//   index.html, es/index.html   the story page, one per locale, with the first frame of the room inlined as a poster
//   room.js                     the worker: the vendored ink-studio files + the scene + the frame loop
// No dependencies: plain Node.
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const here = (...p) => path.join(__dirname, ...p);
const read = (...p) => fs.readFileSync(here(...p), 'utf8');
const KIT = ['src/pixel-look.js', 'src/builder.js', 'src/sculpt.js', 'src/kit/k0-math.js', 'src/kit/k1-stage.js', 'src/kit/k3-shapes.js', 'src/kit/k7-particles.js', 'src/kit/ki-deform.js'];
const kit = KIT.map(f => read('vendor', 'ink-studio', f).replace(/\nif \(typeof module[^\n]*\n?$/, '\n')).join('\n');
const site = JSON.parse(read('content', 'site.json'));
const out = here('dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

/* --- the worker --- */
const worker = [
  kit,
  'const INK_SCENE = (function () {\n  const module = {};\n' + read('src', 'scene.js') + '\n  return module.exports;\n})();',
  read('src', 'room-worker.js')
].join('\n');
fs.writeFileSync(path.join(out, 'room.js'), worker);

/* --- the poster: the first frame, drawn here with ink-studio's software renderer, on a transparent ground --- */
const FIT = 1.26, TAN = Math.tan((38 * Math.PI) / 360);
const st = new Function(kit + '\nreturn { makeBuilder, makeSculpt, KIT, PixelLook };')();
const R = require(here('vendor', 'ink-studio', 'cli', 'render.js'));
const sc = require(here('src', 'scene.js'))(st), world = sc.build(sc.seed);
world.anim.update(0, 0);
world.data = st.KIT.bones.posed({ data: world.data, anim: world.anim });
const side = Math.round(2 * TAN * world.detail * world.cam.dist * FIT),
  view = { t: 0, w: side, h: side, px: 1, dist: world.cam.dist * FIT },
  img = R.render(world, view),
  mask = R.render(world, Object.assign({ samples: true }, view));
function png(w, h, rgba) {
  const table = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
  const crc = b => { let c = -1; for (const x of b) c = table[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4), body = Buffer.concat([Buffer.from(type), data]), sum = Buffer.alloc(4);
    len.writeUInt32BE(data.length); sum.writeUInt32BE(crc(body));
    return Buffer.concat([len, body, sum]);
  };
  const head = Buffer.alloc(13);
  head.writeUInt32BE(w, 0); head.writeUInt32BE(h, 4); head[8] = 8; head[9] = 6;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', head), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}
const rgba = Buffer.alloc(side * side * 4);
for (let y = 0; y < side; y++)
  for (let x = 0; x < side; x++) {
    const p = y * side + x;
    if (mask.depth[(side - 1 - y) * side + x] >= 0.999) continue;
    rgba[p * 4] = img.rgb[p * 3]; rgba[p * 4 + 1] = img.rgb[p * 3 + 1]; rgba[p * 4 + 2] = img.rgb[p * 3 + 2]; rgba[p * 4 + 3] = 255;
  }
const poster = png(side, side, rgba);

/* --- the pages: the same template, once per locale, with the content of content/site.json written onto the room's surfaces --- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const client = read('src', 'story-client.js').replace('/*GL*/', () => read('src', 'room-gl.js'));
const template = read('src', 'story.html');
const sizes = [];
for (const [lang, t] of Object.entries(site.locales)) {
  const otherLang = lang === 'en' ? 'es' : 'en', root = t.path ? '../' : './';
  const links = [`<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`]
    .concat(site.socials.map(s => `<a href="${esc(s.url)}" rel="me noopener">${esc(s.label)}</a>`)).join(' · ');
  const fill = {
    lang, title: esc(t.title), description: esc(t.description), name: esc(site.shortName), headline: esc(t.headline),
    canonical: site.site + '/' + t.path, altEn: site.site + '/', altEs: site.site + '/es/',
    window: esc(t.window), boardTitle: esc(t.boardTitle),
    projects: site.projects.map(p => {
      const name = p.url ? `<a href="${esc(p.url)}" rel="noopener">${esc(p.title)}</a>` : `<b>${esc(p.title)}</b>`;
      return `<li>${name}<span>${esc(p.kind)} · ${esc(p.when[lang])}</span></li>`;
    }).join('\n        '),
    stack: [`<p class="c">${esc(t.stackComment)}</p>`]
      .concat(site.stack.map(s => `<p><b>${esc(s.key[lang])}</b>: ${esc(s.items)}</p>`)).join('\n      '),
    note: esc(t.note), sticker: esc(t.sticker), stickerSmall: esc(t.stickerSmall), ask: esc(t.ask), contact: links,
    cue: esc(t.cue), other: esc(t.other), otherLang, otherHref: root + site.locales[otherLang].path,
    posterAlt: esc(t.posterAlt), canvasLabel: esc(t.canvasLabel),
    plain: esc(t.plain) + ': ' + site.projects.map(p => esc(p.title)).join(', ') + '.',
    worker: root + 'room.js', favicon: root + 'favicon.svg',
    POSTER: 'data:image/png;base64,' + poster.toString('base64'), FIT: String(FIT), side: String(side), CLIENT: client
  };
  const html = template.replace(/\{\{(\w+)\}\}/g, (m, k) => {
    if (!(k in fill)) throw new Error('story.html asks for {{' + k + '}}, which build.js does not fill');
    return fill[k];
  });
  fs.mkdirSync(path.join(out, t.path), { recursive: true });
  fs.writeFileSync(path.join(out, t.path, 'index.html'), html);
  sizes.push([t.path + 'index.html', html]);
}
for (const f of fs.readdirSync(here('public'))) fs.copyFileSync(here('public', f), path.join(out, f));

const kb = b => (Buffer.byteLength(b) / 1024).toFixed(0) + ' KB', gz = s => kb(zlib.gzipSync(Buffer.from(s), { level: 9 }));
for (const [name, html] of sizes) console.log(name.padEnd(16), kb(html), '(gzip ' + gz(html) + ')');
console.log('room.js'.padEnd(16), kb(worker), '(gzip ' + gz(worker) + ')', ' poster', kb(poster), side + 'px');
