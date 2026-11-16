function boot() {
  const gl = cv.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
  if (!gl) return flat();
  const TAN = Math.tan(38 * Math.PI / 360);

/*GL*/

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
    const px = Math.max(2, Math.round(ch / 300)), /* unas 300 filas de arte: píxeles más finos que antes */
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
    SHOTS = shots();
  }

  /* --- las superficies del cuarto donde hay algo escrito: esquina superior izquierda, hacia dónde corre el renglón (u),
         hacia dónde baja (v), y su tamaño en unidades del cuarto --- */
  const SURF = {
    floor: { o: [-3.95, -0.84, -3.3], u: [0, 0, 1], v: [-1, 0, 0], w: 6.3 },   /* acostado en el suelo, delante de la cara izquierda */
    window: { o: [-1.25, 3.56, -3.08], u: [1, 0, 0], v: [0, -1, 0], w: 2.1 },
    board: { o: [2.86, 4.1, -0.66], u: [0, 0, 1], v: [0, -1, 0], w: 3.12 },
    screen: { o: [1.53, 1.8, 0.83], u: [0, 0, 1], v: [0, -1, 0], w: 0.98 },
    note: { o: [1.03, 1.0, 0.86], u: [0, 0, 1], v: [-1, 0, 0], w: 0.68 },
    sticker: { o: [1.618, 1.79, 0.45], u: [0, 0, -1], v: [0, -1, 0], w: 0.9 }
  };
  const surfs = [...lens.querySelectorAll('.surf')].map(el => {
    const s = SURF[el.dataset.s], k = s.w / el.offsetWidth, h = el.offsetHeight * k;
    return { el, beat: +el.dataset.beat, o: s.o, u: s.u, v: s.v, k, h, w: s.w, shown: -1,
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
    s.el.style.transform = 'matrix3d(' + X.join(',') + ',' + Y.join(',') + ',0,0,1,0,' + T.join(',') + ')';
    if (s.shown !== alpha) { s.shown = alpha; s.el.style.opacity = alpha.toFixed(3); s.el.style.visibility = 'visible'; }
  }

  /* --- los planos: la cámara se coloca frente a cada superficie, a la distancia justa para que se lea en esta pantalla --- */
  function shots() {
    const aspect = (W * PX) / (H * PX), c = info.cam, home = c.dist * fit, tall = aspect < 0.8;
    const framed = (yaw, pitch, at, fw, fh, fillW, fillH) => ({ yaw, pitch, at, dist: Math.max(fw / ((fillW || 0.84) * aspect), fh / (fillH || 0.7)) / (2 * TAN) });
    return [
      tall ? framed(-1.15, 0.5, [-3.0, 0.6, 0.2], 7.8, 6.6, 0.98, 0.92) : { yaw: c.yaw, pitch: c.pitch, at: c.target, dist: home },
      framed(-0.3, 0.24, [-0.2, 2.9, -3.1], 2.9, 2.2),                               /* la ventana */
      framed(-1.24, 0.22, [2.87, 3.15, 0.9], 3.8, 2.5),                              /* el pizarrón */
      framed(-1.27, 0.15, [1.53, 1.47, 1.32], 1.22, 0.92),                           /* el monitor */
      framed(-1.42, 0.98, [0.9, 1.02, 1.3], 1.2, 0.62),                              /* la nota y el pato */
      framed(1.78, 0.28, [1.25, 1.85, 0], 1.7, 1.95),                                /* el michi de frente y la calcomanía */
      tall ? framed(-1.15 + 2 * Math.PI, 0.5, [-3.0, 0.6, 0.2], 7.8, 6.6, 0.98, 0.92) : { yaw: c.yaw + 2 * Math.PI, pitch: c.pitch, at: c.target, dist: home }
    ];
  }
  const cam = { yaw: 0, pitch: 0, dist: 1, at: [0, 0, 0], look: 0, vlook: 0, set: false }, goal = { yaw: 0, pitch: 0, dist: 1, at: [0, 0, 0] };
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
  let worker = null, waiting = false, spareIds = null, spareTail = null, lastAsk = 0, shown = false, tNow = 0, t0 = 0, drag = null, beat = -1, played = 0, tailRow = 0, tailRows = 0;
  function adopt(w, m) {
    if (worker && worker !== w) worker.terminate();
    worker = w; info = m; waiting = false; spareIds = spareTail = null; count = 0;
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
    gl.uniform3fv(U2.uPal2, dawn);
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
        if (!shown) { shown = true; frame(performance.now(), true); film.classList.add('live'); spawn(HD); }
      }
    };
    w.postMessage({ type: 'build', hd });
  }
  spawn(null);

  function frame(now, once) {
    if (once !== true) requestAnimationFrame(frame);
    if (!info || document.hidden) { tNow = 0; return; }
    const dt = tNow ? Math.min(0.1, (now - tNow) / 1000) : 0;
    tNow = now;
    if (!t0) t0 = now;
    resize();
    const c = progress();
    target(c, goal);
    /* al llegar al plano de las pruebas, el michi celebra */
    const b = c - Math.floor(c) > 0.9 ? Math.ceil(c) : Math.floor(c);
    if (b !== beat) { beat = b; if (b === 5 && worker) worker.postMessage({ type: 'cheer' }); }
    /* la cámara persigue al guion con suavidad: la rueda del ratón da saltos, la cámara no */
    const k = cam.set && !reduced ? 1 - Math.exp(-7 * dt) : 1;
    cam.set = true;
    cam.yaw += (goal.yaw - cam.yaw) * k; cam.pitch += (goal.pitch - cam.pitch) * k; cam.dist += (goal.dist - cam.dist) * k;
    for (let i = 0; i < 3; i++) cam.at[i] += (goal.at[i] - cam.at[i]) * k;
    /* mirar alrededor: el arrastre desvía la cámara y al soltar vuelve sola, como un resorte */
    if (!drag) { cam.vlook += (-30 * cam.look - 11 * cam.vlook) * dt; cam.look += cam.vlook * dt; }
    const breathe = reduced ? 0 : 0.02 * Math.sin((now - t0) * 0.0005),
      v = view(cam.yaw + cam.look + breathe, Math.max(0.12, Math.min(1.2, cam.pitch)), cam.dist, cam.at);

    for (const s of surfs) place(s, v.m, v.e, shown ? presence(s.beat, c) : 0);

    if (!waiting) {
      waiting = true;
      const step = lastAsk ? Math.min(0.1, (now - lastAsk) / 1000) : 0, move = [];
      const msg = { type: 'frame', dt: step, story: c, z: v.z, eye: v.e, ids: spareIds, tail: spareTail };
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
    const sunrise = smooth((c - 5.45) / 0.5);
    gl.uniform1f(U2.uDawn, sunrise);
    film.style.setProperty('--dawn', sunrise.toFixed(3));
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.bindVertexArray(empty);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /* --- mirar alrededor arrastrando en horizontal (el scroll vertical sigue siendo del navegador) --- */
  cv.addEventListener('pointerdown', e => {
    if (e.button) return;
    cv.setPointerCapture(e.pointerId);
    drag = { x: e.clientX, t: performance.now() }; cam.vlook = 0; cv.classList.add('drag');
  });
  cv.addEventListener('pointermove', e => {
    if (!drag) return;
    const now = performance.now(), d = -(e.clientX - drag.x) * (1.6 / film.clientWidth);
    cam.look += d * (1 - Math.min(0.9, Math.abs(cam.look) / 0.7)); /* cuanto más lejos del centro, más cuesta */
    cam.vlook = d / Math.max(0.004, (now - drag.t) / 1000) * 0.3;
    drag = { x: e.clientX, t: now };
  });
  const release = () => { drag = null; cv.classList.remove('drag'); };
  cv.addEventListener('pointerup', release);
  cv.addEventListener('pointercancel', release);
}
