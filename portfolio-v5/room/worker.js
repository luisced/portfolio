/* Corre dentro de un Web Worker, detrás del kit de ink-studio y de la escena (INK_SCENE).
   Construye el cuarto con la calidad que le pidan, avanza la animación y cada cuadro entrega:
     · la lista de splats visibles, ordenada de lejos a cerca;
     · los renglones del final del arreglo, que son los únicos que se mueven (el gato, el código, el vapor).
   Lo que no se mueve se manda una sola vez, al terminar de construir. */
const ROW = 512;
let world, rest, N, rows, tailRow, clock = 0;
const keep = {};
let idx, dep, order, counts;

function build(hd) {
  /* las opciones de definición del repo: detalle entintado (--fine) y más densidad cerca de un punto (--focus) */
  globalThis.INK_FINE = !!(hd && hd.fine);
  globalThis.INK_FOCUS = (hd && hd.focus) || null;
  const sc = INK_SCENE({ makeBuilder, makeSculpt, KIT, PixelLook });
  world = sc.build(sc.seed);
  rest = world.data; N = world.count;
  rows = Math.ceil(N / ROW); tailRow = Math.floor(world.dynStart / ROW);
  idx = new Uint32Array(N); dep = new Float32Array(N); order = new Uint32Array(N); counts = new Uint32Array(65537);
  world.anim.update(0, 0);
  const data = new Float32Array(rows * ROW * 12);
  for (let i = 0, q = 0, o = 0; i < N; i++, q += 16, o += 12) for (let k = 0; k < 12; k++) data[o + k] = rest[q + k];
  let fine = null;
  if (hd && hd.fine && world.fine && world.fine.length >= N * 12) { fine = new Float32Array(rows * ROW * 12); fine.set(world.fine.subarray(0, N * 12)); }
  postMessage({ type: 'ready', pal: world.pal, cam: world.cam, detail: world.detail, dither: world.dither, count: N, rows, tailRow, data, fine, hits: world.hits, walls: world.walls },
    fine ? [data.buffer, fine.buffer] : [data.buffer]);
}

function step(dt) {
  let left = Math.max(0, dt);
  while (left > 1e-6) {
    const st = Math.min(1 / 60, left);
    clock += st; left -= st;
    world.anim.update(st, clock);
  }
}

function frame(m) {
  world.story(m.story || 0);
  world.day(m.day || 0);
  step(Math.min(0.1, m.dt));
  world.cutaway(m.eye);
  const d = world.anim.bones
    ? KIT.bones.posed({ data: rest, anim: world.anim, get posedBuf() { return keep.b; }, set posedBuf(v) { keep.b = v; } })
    : rest;
  const zx = m.z[0], zy = m.z[1], zz = m.z[2];
  let n = 0, mn = Infinity, mx = -Infinity;
  for (let i = 0, q = 0; i < N; i++, q += 16) {
    if (d[q + 3] <= 0 || d[q + 1] < -30) continue;
    const z = zx * d[q] + zy * d[q + 1] + zz * d[q + 2];
    idx[n] = i; dep[n] = z;
    if (z < mn) mn = z;
    if (z > mx) mx = z;
    n++;
  }
  /* orden por conteo sobre 65536 niveles de profundidad: de lo más lejano a lo más cercano */
  const ids = m.ids && m.ids.length === N ? m.ids : new Uint32Array(N);
  counts.fill(0);
  const k = 65535 / Math.max(1e-6, mx - mn);
  for (let j = 0; j < n; j++) counts[(((dep[j] - mn) * k) | 0) + 1]++;
  for (let j = 1; j <= 65536; j++) counts[j] += counts[j - 1];
  for (let j = 0; j < n; j++) ids[counts[((dep[j] - mn) * k) | 0]++] = idx[j];
  /* lo que se mueve: del primer renglón con algo animado hasta el final */
  const len = (rows - tailRow) * ROW * 12, tail = m.tail && m.tail.length === len ? m.tail : new Float32Array(len);
  for (let i = tailRow * ROW, o = 0; i < N; i++, o += 12) { const q = i * 16; for (let c = 0; c < 12; c++) tail[o + c] = d[q + c]; }
  postMessage({ type: 'frame', ids, n, tail }, [ids.buffer, tail.buffer]);
}

onmessage = e => {
  const m = e.data;
  if (m.type === 'build') build(m.hd);
  else if (m.type === 'seek') step(m.t - clock);
  else if (m.type === 'cheer') world.cheer();
  else if (m.type === 'poke') world.poke(m.name);
  else if (m.type === 'party') world.party();
  else if (m.type === 'hat') world.hat(m.on);
  else if (m.type === 'frame') frame(m);
};
