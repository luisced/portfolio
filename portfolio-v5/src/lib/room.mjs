// Build-time side of the room: assembles the worker script and draws the poster frame.
// The kit and the scene are classic scripts, so they are read as text and evaluated here, never imported.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = process.cwd();
const read = (...p) => fs.readFileSync(path.join(root, ...p), 'utf8');
const KIT = ['src/pixel-look.js', 'src/builder.js', 'src/sculpt.js', 'src/kit/k0-math.js', 'src/kit/k1-stage.js', 'src/kit/k3-shapes.js', 'src/kit/k7-particles.js', 'src/kit/ki-deform.js'];
const kit = () => KIT.map((f) => read('vendor', 'ink-studio', f).replace(/\nif \(typeof module[^\n]*\n?$/, '\n')).join('\n');

/** How far the camera pulls back from the scene's own distance in the opening shot; the poster and the viewer must agree. */
export const FIT = 1.26;

/** /room.js: everything the worker needs, as one classic script. */
export function workerSource() {
  return [
    kit(),
    'const INK_SCENE = (function () {\n  const module = {};\n' + read('room', 'scene.js') + '\n  return module.exports;\n})();',
    read('room', 'worker.js'),
  ].join('\n');
}

function png(w, h, rgba) {
  const table = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
  const crc = (b) => { let c = -1; for (const x of b) c = table[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
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

let cached = null;
/** The first frame of the room, drawn with ink-studio's software renderer on a transparent ground: { uri, side }. */
export function poster() {
  if (cached) return cached;
  const st = new Function(kit() + '\nreturn { makeBuilder, makeSculpt, KIT, PixelLook };')();
  const load = (src, req) => { const module = { exports: {} }; new Function('module', 'require', src)(module, req); return module.exports; };
  const R = load(read('vendor', 'ink-studio', 'cli', 'render.js'), () => st.PixelLook);
  const sc = load(read('room', 'scene.js'))(st), world = sc.build(sc.seed);
  world.anim.update(0, 0);
  world.data = st.KIT.bones.posed({ data: world.data, anim: world.anim });
  const TAN = Math.tan((38 * Math.PI) / 360),
    side = Math.round(2 * TAN * world.detail * world.cam.dist * FIT),
    view = { t: 0, w: side, h: side, px: 1, dist: world.cam.dist * FIT },
    img = R.render(world, view),
    mask = R.render(world, Object.assign({ samples: true }, view));
  const rgba = Buffer.alloc(side * side * 4);
  for (let y = 0; y < side; y++)
    for (let x = 0; x < side; x++) {
      const p = y * side + x;
      if (mask.depth[(side - 1 - y) * side + x] >= 0.999) continue;
      rgba[p * 4] = img.rgb[p * 3]; rgba[p * 4 + 1] = img.rgb[p * 3 + 1]; rgba[p * 4 + 2] = img.rgb[p * 3 + 2]; rgba[p * 4 + 3] = 255;
    }
  cached = { uri: 'data:image/png;base64,' + png(side, side, rgba).toString('base64'), side };
  return cached;
}
