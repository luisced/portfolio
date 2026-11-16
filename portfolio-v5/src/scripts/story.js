// The viewer: scroll → camera, HTML placed on the room's surfaces, and the WebGL drawing.
import { createGL } from './room-gl.js';
import { blip } from './sound.js';

(function () {
  const film = document.getElementById('film'), FIT0 = +film.dataset.fit, WORKER = film.dataset.worker, lens = document.getElementById('lens'), cv = document.getElementById('room-canvas');
  const track = document.getElementById('track'), reel = document.getElementById('reel'), cue = document.getElementById('cue');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(pointer: coarse)').matches;
  const N = track.children.length, HOLD = 0.5;

  /* en pantallas angostas la cámara se aleja para que el cuarto quepa a lo ancho */
  const fitFor = aspect => Math.max(FIT0, 1.3 / aspect), DROP = { up: 0.42, back: 1.05 };
  function layout() {
    const aspect = film.clientWidth / film.clientHeight, fit = fitFor(aspect);
    /* en vertical (un teléfono) lo escrito cambia de formato: menos columnas, letra más grande, zonas de toque de un dedo */
    film.classList.toggle('tall', aspect < 0.8);
    /* en horizontal el cuarto va un poco más chico y más abajo, para dejarle su franja a la barra de arriba; la imagen fija lo acompaña */
    const wide = aspect >= 0.8, back = wide ? fit * DROP.back : fit;
    film.style.setProperty('--poster', (FIT0 / back).toFixed(4));
    film.style.setProperty('--poster-y', (wide ? DROP.up * Math.cos(0.5) * (film.clientHeight / 2 / Math.tan(38 * Math.PI / 360)) / (15 * back) : 0).toFixed(1) + 'px');
    return fit;
  }
  layout();
  addEventListener('resize', layout);

  /* posición en la historia: de 0 a N-1; la parte decimal es el viaje hacia el siguiente plano */
  function position() {
    const kids = track.children, y = scrollY;
    let top = 0;
    for (let i = 0; i < kids.length - 1; i++) {
      const h = kids[i].offsetHeight;
      if (y < top + h) return i + (y - top) / h;
      top += h;
    }
    return N - 1;
  }
  function progress() {
    const c = position();
    reel.style.setProperty('--p', (c / (N - 1)).toFixed(4));
    cue.classList.toggle('off', c > 0.12);
    return c;
  }
  addEventListener('scroll', progress, { passive: true });
  progress();

  const flat = () => { film.classList.add('flat'); document.documentElement.classList.add('flat'); };
  const conn = navigator.connection;
  if (conn && conn.saveData) return flat();
  const start = () => (window.requestIdleCallback || (f => setTimeout(f, 200)))(boot, { timeout: 1200 });
  if (document.readyState === 'complete') start(); else addEventListener('load', start, { once: true });

function boot() {
  /* sin tarjeta gráfica de verdad (WebGL emulado por software) el cuarto ahogaría el hilo principal: ahí se queda la imagen fija con el texto */
  const gl = cv.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: true });
  if (!gl) return flat();
  /* (algunos navegadores entregan el contexto emulado sin avisar: se reconoce por el nombre del renderizador) */
  const dbg = gl.getExtension('WEBGL_debug_renderer_info'), renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
  if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)) return flat();
  const TAN = Math.tan(38 * Math.PI / 360);

  const { ROW, P1, P2, U1, U2, vao, vbo, empty, tex, fbo, texD, texF, floats } = createGL(gl);

  let level = 0, costSum = 0, costN = 0, strikes = 0, hdAsked = false, dead = false;
  let W = 0, H = 0, PX = 2, count = 0, capacity = 0, info = null, fit = 1, SHOTS = null;
  function view(yaw, pitch, dist, T) {
    const cp = Math.cos(pitch), sp = Math.sin(pitch),
      e = [T[0] + dist * cp * Math.sin(yaw), T[1] + dist * sp, T[2] + dist * cp * Math.cos(yaw)];
    let zx = e[0] - T[0], zy = e[1] - T[1], zz = e[2] - T[2];
    const zl = Math.hypot(zx, zy, zz); zx /= zl; zy /= zl; zz /= zl;
    let xx = zz, xz = -zx; const xl = Math.hypot(xx, xz); xx /= xl; xz /= xl;
    const yx = zy * xz, yy = zz * xx - zx * xz, yz = -zy * xx;
    return { e, z: [zx, zy, zz], m: new Float32Array([xx, yx, zx, 0, 0, yy, zy, 0, xz, yz, zz, 0,
      -(xx * e[0] + xz * e[2]), -(yx * e[0] + yy * e[1] + yz * e[2]), -(zx * e[0] + zy * e[1] + zz * e[2]), 1]) };
  }
  /* el lienzo llena la pantalla; cada píxel de arte mide un número entero de píxeles de pantalla */
  function resize() {
    if (!info) return;
    const cw = film.clientWidth, ch = film.clientHeight;
    fit = layout();
    const px = Math.round(Math.max(2, Math.round(ch / 300)) * [1, 1.5, 2][level]), /* unas 300 filas de arte; si el equipo no da, píxeles más gruesos */
      w = Math.ceil(cw / px), h = Math.ceil(ch / px);
    if (w === W && h === H && px === PX) return;
    W = w; H = h; PX = px; cv.width = W; cv.height = H;
    lens.style.width = W * px + 'px'; lens.style.height = H * px + 'px';
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    /* el formato vertical cambia el ancho de diseño de algunos bloques, y a veces dónde van */
    const tall = film.classList.contains('tall');
    for (const s of surfs) { const d = tall && s.def.t ? s.def.t : s.def; s.o = d.o || s.def.o; s.w = d.w || s.def.w; s.k = s.w / s.el.offsetWidth; }
    SHOTS = shots();
  }

  /* --- las superficies del cuarto donde hay algo escrito: esquina superior izquierda, hacia dónde corre el renglón (u),
         hacia dónde baja (v), y su tamaño en unidades del cuarto --- */
  const SURF = {
    main: { o: [1.53, 1.92, -0.57], u: [0, 0, 1], v: [0, -1, 0], w: 1.14 },          /* la pantalla del monitor central */
    photo: { o: [1.72, 3.34, -3.14], u: [1, 0, 0], v: [0, -1, 0], w: 0.56,
      /* lo que puede taparlo al mirar de lado: el canto de la cortina (a su izquierda) y el del librero (a su derecha), como aristas verticales [x, z] */
      occ: [{ x: 1.5, z: -2.94, side: 'l' }, { x: 2.4, z: -2.89, side: 'r' }] },         /* el retrato, en la pared de la ventana */
    floor: { o: [-3.95, -0.84, -3.3], u: [0, 0, 1], v: [-1, 0, 0], w: 6.3, behind: e => e[0] > -3.4, t: { o: [-3.95, -0.84, -2.1], w: 5.2 } },   /* acostado en el suelo, delante de la cara izquierda */
    window: { o: [-1.25, 3.56, -3.08], u: [1, 0, 0], v: [0, -1, 0], w: 2.1 },
    board: { o: [2.86, 4.1, -0.66], u: [0, 0, 1], v: [0, -1, 0], w: 3.12 },
    screen: { o: [1.53, 1.8, 0.83], u: [0, 0, 1], v: [0, -1, 0], w: 0.98 },
    log: { o: [1.535, 2.21, -1.59], u: [0, 0, 1], v: [0, -1, 0], w: 0.62 },          /* la pantalla del monitor vertical */
    note: { o: [1.03, 1.0, 0.86], u: [0, 0, 1], v: [-1, 0, 0], w: 0.68 },
    award0: { o: [-1.85, 0.86, -2.39], u: [1, 0, 0], v: [0, -1, 0], w: 0.76 },   /* placas en el frente del mueble de trofeos */
    award1: { o: [-0.91, 0.86, -2.39], u: [1, 0, 0], v: [0, -1, 0], w: 0.76 },
    cup0: { o: [-1.89, 1.84, -2.3], u: [1, 0, 0], v: [0, -1, 0], w: 0.84 },        /* zonas para tocar los trofeos mismos */
    cup1: { o: [-0.88, 1.72, -2.3], u: [1, 0, 0], v: [0, -1, 0], w: 0.7 },
    shelf0: { o: [2.44, 3.35, -2.76], u: [0, 0, 1], v: [0, -1, 0], w: 0.44 },      /* la portada del libro, en el librero */
    shelf1: { o: [2.5, 3.19, -2.24], u: [0, 0, 1], v: [0, -1, 0], w: 0.5 },      /* las dos insignias */
    shelf2: { o: [2.5, 3.19, -1.66], u: [0, 0, 1], v: [0, -1, 0], w: 0.5 }
  };
  const surfs = [...lens.querySelectorAll('.surf')].map(el => {
    const s = SURF[el.dataset.s], k = s.w / el.offsetWidth;
    return { el, always: el.dataset.beat === 'all', beats: el.dataset.beat === 'all' ? [] : el.dataset.beat.split(' ').map(Number), def: s, o: s.o, u: s.u, v: s.v, k, w: s.w, shown: -1,
      n: [s.v[1] * s.u[2] - s.v[2] * s.u[1], s.v[2] * s.u[0] - s.v[0] * s.u[2], s.v[0] * s.u[1] - s.v[1] * s.u[0]] };
  });
  const smooth = x => { x = Math.max(0, Math.min(1, x)); return x * x * x * (x * (x * 6 - 15) + 10); };
  /* cuánto se ve lo escrito en el plano b cuando la historia va en c: entero al llegar, se borra al irse */
  function presence(b, c) {
    const d = c - b;
    if (d >= 0) return 1 - smooth((d - HOLD) / 0.16);
    return smooth((d + 0.22) / 0.2);
  }
  /* pone un bloque HTML sobre su superficie: la misma cámara y la misma perspectiva que el cuarto, como una matriz de CSS */
  function place(s, m, e, alpha) {
    const facing = (e[0] - s.o[0]) * s.n[0] + (e[1] - s.o[1]) * s.n[1] + (e[2] - s.o[2]) * s.n[2];
    if (alpha < 0.01 || facing <= 0) { if (s.shown !== 0) { s.shown = 0; s.el.style.opacity = 0; s.el.style.visibility = 'hidden'; } return; }
    const F = (H * PX) / 2 / TAN, cx = (W * PX) / 2, cy = (H * PX) / 2;
    const col = (x, y, z, t) => {
      const a = m[0] * x + m[4] * y + m[8] * z + m[12] * t, b = m[1] * x + m[5] * y + m[9] * z + m[13] * t, c = m[2] * x + m[6] * y + m[10] * z + m[14] * t;
      return [F * a - cx * c, -F * b - cy * c, 0, -c];
    };
    const X = col(s.u[0] * s.k, s.u[1] * s.k, s.u[2] * s.k, 0), Y = col(s.v[0] * s.k, s.v[1] * s.k, s.v[2] * s.k, 0), T = col(s.o[0], s.o[1], s.o[2], 1);
    /* si alguna esquina queda detrás de la cámara, no se dibuja */
    const pw = s.el.offsetWidth, ph = s.el.offsetHeight;
    if (Math.min(T[3], T[3] + X[3] * pw, T[3] + Y[3] * ph, T[3] + X[3] * pw + Y[3] * ph) < 0.3) { if (s.shown !== 0) { s.shown = 0; s.el.style.opacity = 0; s.el.style.visibility = 'hidden'; } return; }
    /* la tercera columna lleva la normal de la superficie: así lo que dentro del bloque sobresale (el lomo de un libro, un marco)
       se ve con su grosor y su perspectiva de verdad */
    const Z = col(s.n[0] * s.k, s.n[1] * s.k, s.n[2] * s.k, 0);
    s.el.style.transform = 'matrix3d(' + X.join(',') + ',' + Y.join(',') + ',' + Z[0] + ',' + Z[1] + ',1,' + Z[3] + ',' + T.join(',') + ')';
    if (s.shown !== alpha) { s.shown = alpha; s.el.style.opacity = alpha.toFixed(3); s.el.style.visibility = 'visible'; }
    /* lo pintado en el suelo queda fuera del cuarto: si al girar el cuarto se interpone, el texto pasa detrás del lienzo y el cuarto lo tapa */
    /* un cuadro en la pared no puede pasar detrás del lienzo (lo taparía la pared entera): se le recorta la franja que la cortina o
       el librero cubren desde este ángulo. La sombra de una arista vertical sobre la pared es otra vertical, así que basta un recorte recto */
    if (s.def.occ) {
      let L = 0, R = 0;
      for (const c of s.def.occ) {
        if (e[2] <= c.z + 0.05) continue;
        const xc = e[0] + (s.o[2] - e[2]) / (c.z - e[2]) * (c.x - e[0]);
        if (c.side === 'l') L = Math.max(L, xc - s.o[0]); else R = Math.max(R, s.o[0] + s.w - xc);
      }
      const clip = L > 0.002 || R > 0.002 ? 'inset(-40px ' + Math.max(0, R / s.k).toFixed(1) + 'px -70px ' + Math.max(0, L / s.k).toFixed(1) + 'px)' : '';
      if (clip !== s.clip) { s.clip = clip; s.el.style.clipPath = clip; }
    }
    if (s.def.behind) { const under = s.def.behind(e); if (under !== s.under) { s.under = under; s.el.style.zIndex = under ? -1 : ''; } }
  }

  /* --- los planos: la cámara se coloca frente a cada superficie, a la distancia justa para que se lea en esta pantalla --- */
  function shots() {
    const aspect = (W * PX) / (H * PX), c = info.cam, home = c.dist * fit, tall = aspect < 0.8;
    const framed = (yaw, pitch, at, fw, fh, fillW, fillH) => ({ yaw, pitch, at, dist: Math.max(fw / ((fillW || 0.84) * aspect), fh / (fillH || 0.7)) / (2 * TAN) });
    const wide = { yaw: c.yaw, pitch: c.pitch, at: [c.target[0], c.target[1] + DROP.up, c.target[2]], dist: home * DROP.back };
    /* en vertical cada plano se acerca hasta que su superficie ocupa el ancho del teléfono: ahí la letra se lee y los enlaces se tocan */
    if (tall) return [
      framed(-1.15, 0.5, [-3.0, 0.75, 0.6], 10.6, 6.6, 0.98, 0.92),
      framed(-0.62, 0.38, [1.545, 1.5, 0], 0.72, 1.15, 0.94, 0.8),                   /* el saludo */
      framed(-0.3, 0.24, [-0.2, 2.9, -3.1], 2.9, 2.2),                               /* la ventana */
      framed(-1.36, 0.2, [2.87, 3.2, 0.9], 3.3, 1.9, 0.96),                          /* el pizarrón */
      framed(-1.82, 0.12, [1.545, 1.66, -1.28], 0.7, 1.3, 0.94, 0.78),               /* la trayectoria, en el monitor vertical */
      framed(-1.3, 0.15, [1.53, 1.45, 1.32], 1.06, 0.8, 0.96),                       /* el monitor */
      framed(-1.42, 0.98, [0.9, 1.02, 1.3], 1.2, 0.62),                              /* la nota y el pato */
      framed(-0.25, 0.08, [-1.0, 1.12, -2.5], 2.0, 1.95, 0.96, 0.8),                 /* los trofeos */
      framed(-1.5, 0.1, [2.5, 3.02, -1.96], 1.75, 1.12, 0.96),                       /* el librero */
      framed(-1.15, 0.5, [-3.0, 0.75, 0.6], 10.6, 6.6, 0.98, 0.92)
    ];
    return [
      wide,
      framed(-0.74, 0.38, [1.545, 1.5, 0], 1.6, 1.15),                               /* el saludo: desde el costado derecho del michi, lo bastante de lado para que su cabeza y sus bigotes no crucen por delante de la pantalla (el texto es HTML y se dibujaría encima de él) */
      framed(-0.3, 0.24, [-0.2, 2.9, -3.1], 2.9, 2.2),                               /* la ventana */
      framed(-1.24, 0.22, [2.87, 3.15, 0.9], 3.8, 2.5),                              /* el pizarrón */
      framed(-1.82, 0.12, [1.545, 1.66, -1.28], 1.6, 1.3, 0.84, 0.74),               /* la trayectoria: desde la izquierda del michi, para que no se cruce */
      framed(-1.27, 0.15, [1.53, 1.47, 1.32], 1.22, 0.92),                           /* el monitor */
      framed(-1.42, 0.98, [0.9, 1.02, 1.3], 1.2, 0.62),                              /* la nota y el pato */
      framed(0, 0.08, [-1.0, 1.12, -2.5], 2.35, 1.95),                               /* el mueble de trofeos y sus placas */
      framed(-1.5, 0.1, [2.5, 3.02, -2.0], 2.0, 1.12),                               /* el librero: investigación y certificados */
      wide
    ];
  }
  const cam = { yaw: 0, pitch: 0, dist: 1, at: [0, 0, 0], look: 0, vlook: 0, tilt: 0, set: false }, goal = { yaw: 0, pitch: 0, dist: 1, at: [0, 0, 0] };
  function target(c, out) {
    const i = Math.min(N - 1, Math.floor(c)), j = Math.min(N - 1, i + 1), t = smooth((c - i - HOLD) / (1 - HOLD)), a = SHOTS[i], b = SHOTS[j];
    const turn = Math.min(1, Math.abs(b.yaw - a.yaw) / 1.5), arc = Math.sin(Math.PI * t);
    out.yaw = a.yaw + (b.yaw - a.yaw) * t;
    out.pitch = a.pitch + (b.pitch - a.pitch) * t + arc * 0.26 * turn;                 /* en los giros largos sube un poco */
    out.dist = Math.exp(Math.log(a.dist) + (Math.log(b.dist) - Math.log(a.dist)) * t) * (1 + 0.5 * arc * turn); /* y se aleja, para no atravesar nada */
    for (let k = 0; k < 3; k++) out.at[k] = a.at[k] + (b.at[k] - a.at[k]) * t;
    return out;
  }

  /* --- los workers construyen el cuarto. Primero uno rápido, para ver algo cuanto antes; detrás, otro con toda la definición
         (detalle entintado y más densidad en el escritorio), que toma el relevo cuando termina --- */
  const HD = touch
    ? { fine: true }
    : { fine: true, focus: { p: [1.1, 1.4, 0.3], near: 2.2, far: 4.5, coarse: 1.3, fine: 0.55 } };
  let hits = [], wallsInfo = [], lastV = null, lampOff = false, lampK = 0, peekUntil = 0, peekK = 0, bubbleUntil = 0, tip = 0;
  const bubble = document.getElementById('bubble'), tips = JSON.parse(bubble.dataset.tips), DUCK = [0.9, 1.5, 1.8];
  /* la hora de verdad: de día el cuarto amanece ya con luz (0 de noche, 1 de día, con una rampa al amanecer y otra al anochecer) */
  const dayOf = () => { const d = new Date(), h = d.getHours() + d.getMinutes() / 60; return smooth((h - 5.5) / 2) * (1 - smooth((h - 17.5) / 2)); };
  let dayK = dayOf(), dayAt = 0, palDay = null, palDawn = null, pal2Day = null, hasHat = false;
  try { hasHat = localStorage.getItem('v5-hat') === '1'; } catch { /* sin almacenamiento: el gorro dura esta visita */ }
  const toast = document.getElementById('toast');
  let worker = null, waiting = false, spareIds = null, spareTail = null, lastAsk = 0, shown = false, tNow = 0, t0 = 0, drag = null, beat = -1, played = 0, tailRow = 0, tailRows = 0;
  function adopt(w, m) {
    if (worker && worker !== w) worker.terminate();
    worker = w; info = m; waiting = false; hits = m.hits || []; wallsInfo = m.walls || []; spareIds = spareTail = null; count = 0;
    tailRow = m.tailRow; tailRows = m.rows - m.tailRow;
    floats(texD, m.rows, m.data);
    floats(texF, m.fine ? m.rows : 1, m.fine || null);
    const pal = new Float32Array(64 * 3);
    m.pal.slice(0, 64).forEach((h, i) => { pal[i * 3] = ((h >> 16) & 255) / 255; pal[i * 3 + 1] = ((h >> 8) & 255) / 255; pal[i * 3 + 2] = (h & 255) / 255; });
    const np = Math.min(64, m.pal.length);
    gl.useProgram(P1);
    gl.uniform3fv(U1.uPal, pal); gl.uniform1i(U1.uNp, np); gl.uniform1f(U1.uHasFine, m.fine ? 1 : 0); gl.uniform1i(U1.uD, 1); gl.uniform1i(U1.uF, 2);
    gl.useProgram(P2);
    /* la paleta del amanecer: todo sube y se entibia; el cielo de la ventana clarea, la luna se pierde y las luces se apagan */
    const dawn = pal.map((v, i) => Math.min(1, v * [1.16, 1.08, 0.98][i % 3] + [0.15, 0.1, 0.09][i % 3]));
    for (const [i, hex] of [[41, 0xf7b58c], [42, 0xfbd3a6], [43, 0xf7b58c], [4, 0xa3958c], [51, 0x86b7bb], [52, 0xbd6f95], [57, 0x7d6eae]])
      if (i < np) { dawn[i * 3] = (hex >> 16 & 255) / 255; dawn[i * 3 + 1] = (hex >> 8 & 255) / 255; dawn[i * 3 + 2] = (hex & 255) / 255; }
    /* la paleta de pleno día: más luz y más fría, con cielo azul en la ventana */
    const noon = pal.map((v, i) => Math.min(1, v * [1.18, 1.18, 1.12][i % 3] + [0.13, 0.14, 0.15][i % 3]));
    for (const [i, hex] of [[41, 0x86c5ee], [42, 0xd9eefb], [43, 0x86c5ee], [4, 0xa3958c], [51, 0x86b7bb], [52, 0xbd6f95], [57, 0x7d6eae]])
      if (i < np) { noon[i * 3] = (hex >> 16 & 255) / 255; noon[i * 3 + 1] = (hex >> 8 & 255) / 255; noon[i * 3 + 2] = (hex & 255) / 255; }
    palDawn = dawn; palDay = noon; pal2Day = dayK > 0.5;
    gl.uniform3fv(U2.uPal2, pal2Day ? noon : dawn);
    if (hasHat) w.postMessage({ type: 'hat', on: true });
    /* la paleta con la luz apagada: casi negro, salvo las pantallas, que siguen encendidas */
    const off = pal.map((v, i) => v * 0.13 + [0.012, 0.01, 0.03][i % 3]);
    for (const i of [22, 23]) if (i < np) for (let k = 0; k < 3; k++) off[i * 3 + k] = pal[i * 3 + k];
    for (const i of [24, 25, 26, 27, 28, 33]) if (i < np) for (let k = 0; k < 3; k++) off[i * 3 + k] = pal[i * 3 + k] * 0.55;
    gl.uniform3fv(U2.uPal3, off);
    gl.uniform3fv(U2.uPal, pal); gl.uniform1i(U2.uNp, np); gl.uniform1f(U2.uDith, 0.35 * 0.3 * m.dither); gl.uniform1i(U2.uT, 0);
    W = 0; resize();
  }
  function spawn(hd) {
    const w = new Worker(WORKER);
    w.onerror = e => { console.error(e.message || e); if (!shown) flat(); };
    w.onmessage = e => {
      const m = e.data;
      if (m.type === 'ready') {
        const first = !worker;
        if (!first) w.postMessage({ type: 'seek', t: played }); /* el relevo retoma la animación donde iba */
        adopt(w, m);
        if (first) { frame(performance.now(), true); requestAnimationFrame(frame); }
      } else if (m.type === 'frame' && w === worker) {
        waiting = false;
        count = m.n;
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        if (capacity !== m.ids.byteLength) { gl.bufferData(gl.ARRAY_BUFFER, m.ids.byteLength, gl.DYNAMIC_DRAW); capacity = m.ids.byteLength; }
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, m.ids, 0, m.n);
        gl.bindTexture(gl.TEXTURE_2D, texD);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, tailRow, ROW * 3, tailRows, gl.RGBA, gl.FLOAT, m.tail);
        spareIds = m.ids; spareTail = m.tail;
        if (!shown) { shown = true; frame(performance.now(), true); film.classList.add('live'); }
      }
    };
    w.postMessage({ type: 'build', hd });
  }
  spawn(null);

  /* calidad a la medida del equipo: se mide lo que cuesta cada cuadro en el hilo principal. Si sobra, se pide la versión con toda
     la definición; si falta, los píxeles engordan (menos que dibujar); y si ni así, se apaga el 3D y queda la imagen fija */
  let gapSum = 0;
  function govern(cost, gap) {
    costSum += cost; gapSum += gap; costN++;
    if (costN < 40) return;
    /* cuenta lo que tarda nuestro código y, si la página está al frente, también el tiempo real entre cuadros (ahí se nota una tarjeta lenta) */
    const front = document.hasFocus(), avg = Math.max(costSum / costN, front ? gapSum / costN - 12 : 0); costSum = gapSum = costN = 0;
    if (avg > 60 && level === 2) { if (++strikes >= 2) { dead = true; if (worker) worker.terminate(); film.classList.remove('live'); flat(); } return; }
    strikes = 0;
    if (avg > 22 && level < 2) { level++; W = 0; return; }
    if (avg < 9 && level === 0 && !hdAsked) { hdAsked = true; spawn(HD); }
  }
  function frame(now, once) {
    if (dead) return;
    if (once !== true) requestAnimationFrame(frame);
    if (!info || document.hidden) { tNow = 0; return; }
    const began = performance.now();
    const dt = tNow ? Math.min(0.1, (now - tNow) / 1000) : 0;
    tNow = now;
    if (!t0) t0 = now;
    resize();
    const c = progress();
    /* el cuarto cuenta la noche en sus propios pasos (0 a 8): el capítulo de la trayectoria no la adelanta, la deja en pausa */
    const night = c <= 3 ? c : c < 4 ? 3 : c - 1, career = smooth(1 - Math.abs(c - 4) / 0.8);
    target(c, goal);
    /* al llegar al plano de las pruebas, el michi celebra */
    const b = c - Math.floor(c) > 0.9 ? Math.ceil(c) : Math.floor(c);
    if (b !== beat) { beat = b; lampOff = false; /* la luz vuelve sola al cambiar de capítulo: lo escrito nunca queda a oscuras */ if (b === 7 && worker) worker.postMessage({ type: 'cheer' }); }
    /* la cámara persigue al guion con suavidad: la rueda del ratón da saltos, la cámara no */
    const k = cam.set && !reduced ? 1 - Math.exp(-7 * dt) : 1;
    cam.set = true;
    cam.yaw += (goal.yaw - cam.yaw) * k; cam.pitch += (goal.pitch - cam.pitch) * k; cam.dist += (goal.dist - cam.dist) * k;
    for (let i = 0; i < 3; i++) cam.at[i] += (goal.at[i] - cam.at[i]) * k;
    /* mirar alrededor: el arrastre desvía la cámara y al soltar vuelve sola, como un resorte */
    if (!drag) { cam.vlook += (-30 * cam.look - 11 * cam.vlook) * dt; cam.look += cam.vlook * dt; cam.tilt *= Math.exp(-5 * dt); }
    const breathe = reduced ? 0 : 0.02 * Math.sin((now - t0) * 0.0005),
      v = view(cam.yaw + cam.look + breathe, Math.max(0.06, Math.min(1.35, cam.pitch + cam.tilt)), cam.dist, cam.at);

    /* los objetos del cuarto (el retrato, el libro, las insignias) están siempre; solo esperan a que se prenda la luz */
    /* la luz baja al acercarse al monitor para el saludo (capítulo 1) y vuelve al salir */
    /* la lámpara se apaga y se prende tocándola; tocar la ventana deja ver un rato cómo amanece */
    lampK += ((lampOff ? 1 : 0) - lampK) * (1 - Math.exp(-9 * dt));
    peekK += ((now < peekUntil ? 1 : 0) - peekK) * (1 - Math.exp(-2.2 * dt));
    const greet = smooth((c - 0.55) / 0.3) * (1 - smooth((c - 1.5) / 0.25)), dark = Math.max(greet, 0.8 * lampK), lit = 1 - Math.max(greet, lampK);
    lastV = v;
    /* el globito del pato sigue al pato */
    if (bubbleUntil) {
      if (now > bubbleUntil) { bubbleUntil = 0; bubble.classList.remove('on'); }
      const m = v.m, a = m[0] * DUCK[0] + m[4] * DUCK[1] + m[8] * DUCK[2] + m[12], b = m[1] * DUCK[0] + m[5] * DUCK[1] + m[9] * DUCK[2] + m[13], d = -(m[2] * DUCK[0] + m[6] * DUCK[1] + m[10] * DUCK[2] + m[14]), F = (H * PX) / 2 / TAN;
      if (d > 0.3) { const r = lens.getBoundingClientRect(), fr = film.getBoundingClientRect(); bubble.style.transform = 'translate(' + (r.left - fr.left + (W * PX) / 2 + F * a / d).toFixed(1) + 'px,' + (r.top - fr.top + (H * PX) / 2 - F * b / d).toFixed(1) + 'px)'; }
    }
    for (const s of surfs) place(s, v.m, v.e, !shown ? 0 : s.always ? lit : Math.max(...s.beats.map((b) => presence(b, c))));

    if (!waiting) {
      waiting = true;
      const step = lastAsk ? Math.min(0.1, (now - lastAsk) / 1000) : 0, move = [];
      const msg = { type: 'frame', dt: step, story: night, career, day: dayK, z: v.z, eye: v.e, ids: spareIds, tail: spareTail };
      lastAsk = now; played += step;
      if (spareIds) move.push(spareIds.buffer);
      if (spareTail) move.push(spareTail.buffer);
      spareIds = spareTail = null;
      worker.postMessage(msg, move);
    }
    if (!count) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, W, H);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(P1);
    gl.uniformMatrix4fv(U1.uV, false, v.m);
    gl.uniform2f(U1.uRes, W, H);
    gl.uniform1f(U1.uFocal, H / 2 / TAN);
    gl.uniform1f(U1.uNear, Math.max(0.3, Math.min(0.15 * cam.dist, 2)));
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texD);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, texF);
    gl.bindVertexArray(vao);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.disable(gl.BLEND);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(P2);
    if (now - dayAt > 30000) { dayAt = now; dayK = dayOf(); if ((dayK > 0.5) !== pal2Day && palDay) { pal2Day = dayK > 0.5; gl.uniform3fv(U2.uPal2, pal2Day ? palDay : palDawn); } }
    /* de noche, el scroll (o tocar la ventana) trae el amanecer; de día ya hay luz, y tocar la ventana deja ver la noche un rato */
    const sunrise = dayK > 0.5 ? dayK * (1 - peekK) : Math.max(dayK, smooth((night - 7.45) / 0.5), peekK);
    gl.uniform1f(U2.uDawn, sunrise);
    gl.uniform1f(U2.uOff, dark);
    film.style.setProperty('--dawn', sunrise.toFixed(3));
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.bindVertexArray(empty);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (once !== true && now - t0 > 600) govern(performance.now() - began, dt * 1000);
  }

  /* --- mirar alrededor arrastrando en horizontal (el scroll vertical sigue siendo del navegador) --- */
  /* --- tocar las cosas: un rayo desde el ojo por el punto tocado, contra las cajas de lo que responde; gana la más cercana --- */
  function pick(clientX, clientY) {
    if (!lastV || !hits.length) return null;
    const r = lens.getBoundingClientRect(), m = lastV.m, e = lastV.e, F = (H * PX) / 2 / TAN,
      sx = (clientX - r.left - r.width / 2) / F, sy = -(clientY - r.top - r.height / 2) / F,
      d = [m[0] * sx + m[1] * sy - m[2], m[4] * sx + m[5] * sy - m[6], m[8] * sx + m[9] * sy - m[10]];
    let best = null, bt = Infinity;
    for (const h of hits) {
      if (h.w != null) { const w = wallsInfo[h.w]; if (w && (e[0] - w.p[0]) * w.n[0] + (e[2] - w.p[1]) * w.n[1] > 0.3) continue; } /* su pared está escondida */
      let t0 = 0, t1 = Infinity;
      for (let k = 0; k < 3 && t0 <= t1; k++) {
        if (Math.abs(d[k]) < 1e-9) { if (e[k] < h.a[k] || e[k] > h.b[k]) t0 = Infinity; continue; }
        const u = (h.a[k] - e[k]) / d[k], w = (h.b[k] - e[k]) / d[k];
        t0 = Math.max(t0, Math.min(u, w)); t1 = Math.min(t1, Math.max(u, w));
      }
      if (t0 <= t1 && t0 < bt) { bt = t0; best = h.n; }
    }
    return best;
  }
  const NAMES = [...new Set(['lamp', 'cat', 'duck', 'cube', 'keys', 'rack', 'yarn', 'box', 'lights', 'neon', 'window', 'camera'])], seen = new Set();
  const found = document.getElementById('found'), snd = document.getElementById('snd'), flash = document.createElement('div');
  flash.className = 'flash'; film.append(flash);
  let sound = false;
  snd.hidden = false;
  snd.addEventListener('click', () => {
    sound = !sound;
    snd.setAttribute('aria-pressed', sound); snd.setAttribute('aria-label', sound ? snd.dataset.off : snd.dataset.on);
    if (sound) blip('on');
  });
  function poke(name) {
    if (worker) worker.postMessage({ type: 'poke', name });
    if (name === 'lamp') lampOff = !lampOff;
    if (name === 'window') peekUntil = performance.now() + 4200;
    /* la cámara dispara: un destello que llena la pantalla un instante */
    if (name === 'camera' && !reduced) flash.animate([{ opacity: 0 }, { opacity: 0.85, offset: 0.12 }, { opacity: 0 }], { duration: 520, easing: 'ease-out' });
    if (name === 'duck') {
      bubble.textContent = tips[tip++ % tips.length];
      bubble.classList.add('on'); bubbleUntil = performance.now() + 3400;
    }
    if (sound) blip(name);
    if (navigator.vibrate) navigator.vibrate(8);
    if (!seen.has(name)) {
      seen.add(name);
      found.hidden = false;
      found.firstElementChild.textContent = seen.size + '/' + NAMES.length;
      found.classList.remove('pop'); void found.offsetWidth; found.classList.add('pop');
      if (seen.size === NAMES.length) {
        /* el premio: fiesta en el cuarto y un gorro para el michi, que se queda para la próxima visita */
        found.classList.add('all'); hasHat = true;
        try { localStorage.setItem('v5-hat', '1'); } catch { /* da igual */ }
        if (worker) worker.postMessage({ type: 'party' });
        toast.textContent = toast.dataset.prize; toast.classList.add('on');
        setTimeout(() => toast.classList.remove('on'), 7000);
        if (sound) { blip('box'); blip('lights'); }
      }
    }
  }
  let down = null;
  cv.addEventListener('pointerdown', e => {
    if (e.button) return;
    cv.setPointerCapture(e.pointerId);
    down = { x: e.clientX, y: e.clientY, t: performance.now() };
    drag = { x: e.clientX, y: e.clientY, t: performance.now() }; cam.vlook = 0; cv.classList.add('drag');
  });
  /* con ratón, el cursor avisa qué responde */
  cv.addEventListener('pointermove', e => { if (!drag && e.pointerType === 'mouse') cv.style.cursor = pick(e.clientX, e.clientY) ? 'pointer' : ''; });
  cv.addEventListener('pointermove', e => {
    if (!drag) return;
    const now = performance.now(), d = -(e.clientX - drag.x) * (5 / Math.max(420, film.clientWidth));
    /* sin tope: el cuarto da la vuelta completa. Con ratón, arrastrar en vertical además lo inclina (en táctil ese gesto es el scroll) */
    cam.look += d;
    cam.vlook = d / Math.max(0.004, (now - drag.t) / 1000) * 0.3;
    if (e.pointerType === 'mouse') cam.tilt = Math.max(-0.7, Math.min(0.7, cam.tilt + (e.clientY - drag.y) * (2.2 / film.clientHeight)));
    drag = { x: e.clientX, y: e.clientY, t: now };
  });
  const release = () => {
    drag = null; cv.classList.remove('drag');
    /* al soltar vuelve por el camino corto, aunque haya dado más de media vuelta */
    cam.look = Math.atan2(Math.sin(cam.look), Math.cos(cam.look));
  };
  cv.addEventListener('pointerup', e => {
    /* un toque corto y sin arrastre es un toque a una cosa; lo demás fue girar el cuarto */
    const tap = down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 8 && performance.now() - down.t < 600;
    down = null;
    release();
    if (tap) { const name = pick(e.clientX, e.clientY); if (name) poke(name); }
  });
  cv.addEventListener('pointercancel', release);
}

})();
