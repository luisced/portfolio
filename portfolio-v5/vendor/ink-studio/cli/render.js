// Draws a world without a browser: motion kinds, projection of each splat's covariance to a screen ellipse,
// blending from far to near, low-resolution sampling, dithering and palette quantization.
const FOV = (38 * Math.PI) / 180,
  BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const PixelLook = require('../src/pixel-look.js');
const clamp = (x, a, b) => (x < a ? a : x > b ? b : x),
  sstep = (a, b, x) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
function viewMatrix(yaw, pitch, dist, T) {
  const cp = Math.cos(pitch),
    sp = Math.sin(pitch),
    e = [T[0] + dist * cp * Math.sin(yaw), T[1] + dist * sp, T[2] + dist * cp * Math.cos(yaw)];
  let zx = e[0] - T[0],
    zy = e[1] - T[1],
    zz = e[2] - T[2];
  const zl = Math.hypot(zx, zy, zz);
  zx /= zl;
  zy /= zl;
  zz /= zl;
  let xx = zz,
    xz = -zx;
  const xy = 0,
    xl = Math.hypot(xx, xz);
  xx /= xl;
  xz /= xl;
  const yx = zy * xz - zz * xy,
    yy = zz * xx - zx * xz,
    yz = zx * xy - zy * xx;
  return [
    xx,
    yx,
    zx,
    0,
    xy,
    yy,
    zy,
    0,
    xz,
    yz,
    zz,
    0,
    -(xx * e[0] + xy * e[1] + xz * e[2]),
    -(yx * e[0] + yy * e[1] + yz * e[2]),
    -(zx * e[0] + zy * e[1] + zz * e[2]),
    1
  ];
}
// o: t (seconds), yaw, pitch, dist, target, w, h (the size of the stage in screen pixels), zoom (1 = the diorama's own distance), raw (skip the palette)
function render(world, o) {
  o = o || {};
  const c = world.cam,
    t = o.t || 0,
    yaw = o.yaw === undefined ? c.yaw : o.yaw,
    pitch = o.pitch === undefined ? c.pitch : o.pitch,
    an = world.anim || {},
    dist0 = o.dist || c.dist / (o.zoom || 1),
    /* a diorama's own zoom (a camera punch) moves the eye, not the size of an art pixel */
    dist = dist0 / (an.zoom || 1),
    T0 = o.target || c.target,
    T = an.kick ? [T0[0] + an.kick[0], T0[1] + an.kick[1], T0[2] + an.kick[2]] : T0,
    cw = o.w || 900,
    ch = o.h || 620;
  const rel = c.dist / dist0,
    rho = world.detail * Math.pow(rel, rel > 1 ? 0.5 : 0.25),
    px = o.px || clamp(Math.round(ch / (2 * Math.tan(FOV / 2) * rho * dist0)), 1, 18),
    W = Math.ceil(cw / px),
    H = Math.ceil(ch / px);
  if (o.colored && !o.raw) {
    const native = render(world, Object.assign({}, o, { colored: false, samples: true, worked: true }));
    const samples = render(
      world,
      Object.assign({}, o, { colored: false, samples: true, px: px / 2, w: W * px, h: H * px })
    );
    const palette = world.pal.map(h => [((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255]);
    const img = PixelLook.resolve(
      Object.assign(samples, {
        palette,
        grade: world.anim && world.anim.grade,
        interiorColor: native.color,
        dither: (o.dither === undefined ? 0.35 : o.dither) * 0.3 * world.dither
      })
    );
    return Object.assign(img, { px, drawn: samples.drawn });
  }
  const V = viewMatrix(yaw, pitch, dist, T),
    focal = H / 2 / Math.tan(FOV / 2),
    near = Math.max(0.4, 0.15 * dist),
    tp = 1 / Math.tan(FOV / 2),
    asp = W / H,
    N = world.count,
    d = world.data,
    R = world.radius;
  const hex = i => {
      const h = world.pal[i];
      return [((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255];
    },
    bg = hex(0),
    fog = hex(world.fog.c),
    limx = (1.3 * 0.5 * W) / focal,
    limy = (1.3 * 0.5 * H) / focal;
  // where each splat is at this moment, and what it looks like
  const X = new Float32Array(N),
    Y = new Float32Array(N),
    Z = new Float32Array(N),
    AL = new Float32Array(N),
    SC = new Float32Array(N),
    depth = new Float32Array(N),
    add = new Float32Array(N),
    wet = new Float32Array(N);
  for (let i = 0, q = 0; i < N; i++, q += 16) {
    let x = d[q],
      y = d[q + 1],
      z = d[q + 2],
      al = d[q + 3],
      sc = 1;
    const kraw = Math.round(d[q + 11]),
      kind = kraw % 16,
      ph = d[q + 12],
      sp = d[q + 13],
      rg = d[q + 14],
      ex = d[q + 15];
    if (kind === 1) al *= 0.62 + 0.38 * Math.sin(t * sp + ph);
    else if (kind === 2) {
      const f = (t * sp) / rg + ph,
        pr = f - Math.floor(f);
      y -= pr * rg;
      al *= 1 - pr * pr;
      sc *= 1 + pr * ex;
    } else if (kind === 3) {
      const f = (t * sp) / rg + ph,
        pr = f - Math.floor(f);
      y += pr * rg;
      x += Math.sin(pr * 7 + ph * 50) * 0.25 * pr;
      al *= (1 - pr) * sstep(0, 0.1, pr);
      sc *= 0.6 + pr * ex;
    } else if (kind === 4) add[i] = 0.3 * sstep(0.75, 1, Math.sin(t * sp + ph));
    else if (kind === 5) {
      const a = t * sp,
        cs = Math.cos(a),
        sn = Math.sin(a),
        nx = cs * x + sn * z;
      z = -sn * x + cs * z;
      x = nx;
    } else if (kind === 6) y += Math.sin(t * sp + ph) * rg;
    else if (kind === 7) al *= 0.82 + 0.18 * Math.sin(t * sp + ph);
    else if (kind === 8) {
      const f = 0.2 + 0.8 * Math.abs(Math.sin(t * sp + ph));
      x = rg + (x - rg) * f;
      z = ex + (z - ex) * f;
      y += 0.14 * Math.sin(t * sp * 0.31 + ph);
    } else if (kind === 9) {
      const k = 1 + rg * Math.sin(t * sp + ph - y * ex);
      x *= k;
      z *= k;
    } else if (kind === 15) {
      // flutter down: a leaf or a flake, swinging as it falls
      const f = (t * sp) / rg + ph,
        pr = f - Math.floor(f);
      y -= pr * rg;
      x += Math.sin(pr * 11 + ph * 40) * ex;
      z += Math.cos(pr * 7 + ph * 23) * ex * 0.6;
      al *= sstep(0, 0.05, pr) * (1 - sstep(0.92, 1, pr));
    } else if (kind === 14) {
      const hg = Math.max(0, y - ex);
      x += rg * hg * Math.sin(t * sp + ph);
      z += rg * 0.6 * hg * Math.sin(t * sp * 0.73 + ph * 1.7);
    } else if (kind === 11) {
      const x0 = x;
      x += rg * Math.sin(t * sp + y * 1.3 + z * 0.9 + ph);
      y += rg * 0.6 * Math.sin(t * sp * 1.3 + x0 * 1.1 + ph);
    }
    if (kraw & 512) {
      // born: not there till its time, then it grows to its size (as the page does it)
      const gw = world.grow || {};
      let gt = t * (gw.rate || 1);
      if (gw.loop > 0) gt -= Math.floor(gt / gw.loop) * gw.loop;
      const gs = Math.min(1, Math.max(0, (gt - ex) / (gw.fade || 0.5)));
      if (gs <= 0) al = 0;
      sc *= gs * (2 - gs);
    } else if (kraw & 1024) wet[i] = Math.min(1, Math.max(0, (t * ((world.grow || {}).rate || 1) - ex) / 2));
    X[i] = x;
    Y[i] = y;
    Z[i] = z;
    AL[i] = al;
    SC[i] = sc;
    depth[i] = V[2] * x + V[6] * y + V[10] * z + V[14];
  }
  let mn = Infinity;
  for (let i = 0; i < N; i++) if (depth[i] < mn) mn = depth[i];
  if (world.back) for (let j = 0; j < world.back.length; j++) depth[world.back[j]] = mn;
  const order = new Uint32Array(N);
  for (let i = 0; i < N; i++) order[i] = i;
  order.sort((a, b) => depth[a] - depth[b]);
  const col = new Float32Array(W * H * 3),
    dep = new Float32Array(W * H),
    gls = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    col[i * 3] = bg[0];
    col[i * 3 + 1] = bg[1];
    col[i * 3 + 2] = bg[2];
    dep[i] = 1;
  }
  let drawn = 0;
  const FN = o.fine && world.fine && world.fine.length >= N * 12 ? world.fine : null,
    FPAL = FN ? world.pal.map((h, i) => hex(i)) : null;
  for (let n = 0; n < N; n++) {
    const i = order[n],
      q = i * 16,
      al = AL[i],
      x = X[i],
      y = Y[i],
      z = Z[i];
    if (al <= 0 || y < -30) continue;
    const cx = V[0] * x + V[4] * y + V[8] * z + V[12],
      cy = V[1] * x + V[5] * y + V[9] * z + V[13],
      cz = V[2] * x + V[6] * y + V[10] * z + V[14];
    if (cz > -near) continue;
    const kraw = Math.round(d[q + 11]),
      kind = kraw % 16,
      flags = Math.floor(kraw / 16),
      s2 = SC[i] * SC[i],
      pk = d[q + 7];
    let r = (pk % 256) / 255 + add[i],
      g = (Math.floor(pk / 256) % 256) / 255 + add[i],
      b = Math.floor(pk / 65536) / 255 + add[i];
    if (wet[i]) {
      // wet: darker, and a little bluer, as the page does it
      r *= 1 - 0.42 * wet[i];
      g *= 1 - 0.38 * wet[i];
      b *= 1 - 0.3 * wet[i];
    }
    const dn = clamp((-cz - (dist - R)) / (2 * R), 0, 1);
    if (!(flags & 2) && world.fog.max > 0 && world.fog.start < 1) {
      // (no haze is asked for when it starts at the far edge: and a smooth step from 1 to 1 is 0 / 0, which blacks out the pixel)
      const k = sstep(world.fog.start, 1, dn) * world.fog.max;
      r += (fog[0] - r) * k;
      g += (fog[1] - g) * k;
      b += (fog[2] - b) * k;
    }
    const iz = -1 / cz,
      tx = clamp(cx * iz, -limx, limx) / iz,
      ty = clamp(cy * iz, -limy, limy) / iz,
      j00 = focal * iz,
      j02 = focal * tx * iz * iz,
      j12 = focal * ty * iz * iz;
    const a0 = j00 * V[0] + j02 * V[2],
      a1 = j00 * V[4] + j02 * V[6],
      a2 = j00 * V[8] + j02 * V[10],
      b0 = j00 * V[1] + j12 * V[2],
      b1 = j00 * V[5] + j12 * V[6],
      b2 = j00 * V[9] + j12 * V[10];
    const c00 = d[q + 4] * s2,
      c01 = d[q + 5] * s2,
      c02 = d[q + 6] * s2,
      c11 = d[q + 8] * s2,
      c12 = d[q + 9] * s2,
      c22 = d[q + 10] * s2;
    const u0 = c00 * a0 + c01 * a1 + c02 * a2,
      u1 = c01 * a0 + c11 * a1 + c12 * a2,
      u2 = c02 * a0 + c12 * a1 + c22 * a2,
      w0 = c00 * b0 + c01 * b1 + c02 * b2,
      w1 = c01 * b0 + c11 * b1 + c12 * b2,
      w2 = c02 * b0 + c12 * b1 + c22 * b2;
    const A = a0 * u0 + a1 * u1 + a2 * u2 + 0.15,
      Bq = b0 * u0 + b1 * u1 + b2 * u2,
      C = b0 * w0 + b1 * w1 + b2 * w2 + 0.15,
      det = A * C - Bq * Bq;
    if (det <= 0) continue;
    const k0 = C / det,
      k1 = -Bq / det,
      k2 = A / det,
      ex = Math.min(3 * Math.sqrt(A), 2048),
      ey = Math.min(3 * Math.sqrt(C), 2048);
    let sx = ((((tp / asp) * cx) / -cz) * 0.5 + 0.5) * W,
      sy = (((tp * cy) / -cz) * 0.5 + 0.5) * H;
    if (kind === 1) {
      sx = Math.floor(sx) + 0.5;
      sy = Math.floor(sy) + 0.5;
    }
    if (sx + ex < 0 || sx - ex > W || sy + ey < 0 || sy - ey > H) continue;
    const solid = al >= 1,
      wd = solid && !(flags & 1),
      glass = (flags & 16) !== 0,
      x0 = Math.max(0, Math.floor(sx - ex)),
      x1 = Math.min(W - 1, Math.ceil(sx + ex)),
      y0 = Math.max(0, Math.floor(sy - ey)),
      y1 = Math.min(H - 1, Math.ceil(sy + ey));
    r = Math.min(r, 1);
    g = Math.min(g, 1);
    b = Math.min(b, 1);
    drawn++;
    /* inked detail: a dab that carries a tile, and is still the colour it was baked, takes each pixel's colour from the tile, at the
       place on the surface the pixel looks at (the two half-axes of the tile, carried to the screen, and that turned inside out) */
    let fi = -1,
      i00 = 0,
      i01 = 0,
      i10 = 0,
      i11 = 0,
      fk = 0;
    if (FN && FN[i * 12 + 11] && FN[i * 12 + 7] === pk && !add[i] && kind !== 5 && kind !== 12 && kind !== 13) {
      const f = i * 12,
        sc = SC[i],
        m00 = (a0 * FN[f + 4] + a1 * FN[f + 5] + a2 * FN[f + 6]) * sc,
        m01 = (a0 * FN[f + 8] + a1 * FN[f + 9] + a2 * FN[f + 10]) * sc,
        m10 = (b0 * FN[f + 4] + b1 * FN[f + 5] + b2 * FN[f + 6]) * sc,
        m11 = (b0 * FN[f + 8] + b1 * FN[f + 9] + b2 * FN[f + 10]) * sc,
        dt = m00 * m11 - m01 * m10;
      if (Math.abs(dt) > 1e-4 * (Math.abs(m00 * m11) + Math.abs(m01 * m10) + 1e-9)) {
        fi = f;
        i00 = m11 / dt;
        i01 = -m01 / dt;
        i10 = -m10 / dt;
        i11 = m00 / dt;
        fk = flags & 2 ? 0 : sstep(world.fog.start, 1, dn) * world.fog.max;
      }
    }
    for (let iy = y0; iy <= y1; iy++) {
      const dy = iy + 0.5 - sy;
      for (let ix = x0; ix <= x1; ix++) {
        const dx = ix + 0.5 - sx,
          pw = -0.5 * (k0 * dx * dx + k2 * dy * dy) - k1 * dx * dy;
        if (pw > 0 || pw < -4.5) continue;
        const gg = al * Math.exp(pw);
        let a = Math.min(0.99, gg);
        if (!o.soft && solid) a = 0.99 * sstep(0.38, 0.62, gg);
        if (a < 0.004) continue;
        const p = iy * W + ix,
          p3 = p * 3,
          ia = 1 - a;
        let pr = r,
          pg = g,
          pb = b;
        if (fi >= 0) {
          const u = clamp(Math.floor((i00 * dx + i01 * dy) * 2 + 2), 0, 3),
            v = clamp(Math.floor((i10 * dx + i11 * dy) * 2 + 2), 0, 3),
            c = FPAL[Math.floor(FN[fi + v] / (u === 0 ? 1 : u === 1 ? 64 : u === 2 ? 4096 : 262144)) % 64];
          if (c) {
            pr = c[0] + (fog[0] - c[0]) * fk;
            pg = c[1] + (fog[1] - c[1]) * fk;
            pb = c[2] + (fog[2] - c[2]) * fk;
          }
        }
        col[p3] = pr * a + col[p3] * ia;
        col[p3 + 1] = pg * a + col[p3 + 1] * ia;
        col[p3 + 2] = pb * a + col[p3 + 2] * ia;
        if (wd) {
          dep[p] = dn * a + dep[p] * ia;
          gls[p] *= ia;
        } else if (glass) gls[p] = Math.min(1, gls[p] + a * 0.5);
      }
    }
  }
  if (o.samples) {
    // (the picture the contour look takes its insides from is worked on first, as the page does: glass bends it, contact shade darkens it)
    let c2 = col;
    if (o.worked) {
      const bend = world.refract === undefined ? 6 : world.refract,
        aoK = world.ao ? (world.ao.k === undefined ? 0.5 : world.ao.k) : 0,
        aoR = world.ao ? (world.ao.range || 0.6) / (2 * R) : 1,
        at = (x, y) => clamp(y, 0, H - 1) * W + clamp(x, 0, W - 1),
        TAPS = [2, 0, -2, 0, 0, 2, 0, -2, 1, 1, -1, 1, 1, -1, -1, -1];
      c2 = new Float32Array(col.length);
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          const p = y * W + x,
            gx = gls[at(x + 1, y)] - gls[at(x - 1, y)],
            gy = gls[at(x, y + 1)] - gls[at(x, y - 1)];
          let q = p;
          if (gls[p] + Math.abs(gx) + Math.abs(gy) > 0) q = at(x + Math.round(gx * bend), y + Math.round(gy * bend));
          let k = 1;
          if (aoK > 0) {
            let occ = 0;
            for (let i = 0; i < 16; i += 2) {
              const dd = (dep[p] - dep[at(x + TAPS[i], y + TAPS[i + 1])]) / aoR;
              if (dd > 0.08 && dd < 3) occ += Math.min(1, dd);
            }
            k = 1 - aoK * Math.min(1, occ / 4);
          }
          c2[p * 3] = col[q * 3] * k;
          c2[p * 3 + 1] = col[q * 3 + 1] * k;
          c2[p * 3 + 2] = col[q * 3 + 2] * k;
        }
    }
    return { w: W, h: H, color: Uint8Array.from(c2, v => Math.round(clamp(v, 0, 1) * 255)), depth: dep, drawn };
  }
  // the second pass: an outline where the picture steps back sharply, a little ordered noise, then the nearest colour of the palette
  const out = new Uint8Array(W * H * 3),
    np = world.pal.length,
    pal = [];
  for (let i = 0; i < np; i++) pal.push(hex(i));
  const edge = world.outline && world.outline.edge ? world.outline.edge / (2 * R) : 0,
    line = hex(world.outline ? world.outline.c : 0),
    dith = (o.dither === undefined ? 0.35 : o.dither) * 0.3 * world.dither,
    use = new Uint32Array(np);
  const D = (x, y) => dep[clamp(y, 0, H - 1) * W + clamp(x, 0, W - 1)],
    G = (x, y) => gls[clamp(y, 0, H - 1) * W + clamp(x, 0, W - 1)];
  // (as in the page: glass bends what is behind it, by how its own thickness changes across the picture; and, where a diorama asks for it,
  //  a pixel with nearer things close round it is shaded, so that what moves still sits in its own shadow)
  const bend = world.refract === undefined ? 6 : world.refract,
    aoK = world.ao ? (world.ao.k === undefined ? 0.5 : world.ao.k) : 0,
    aoR = world.ao ? (world.ao.range || 0.6) / (2 * R) : 1,
    AOT = [
      [2, 0],
      [-2, 0],
      [0, 2],
      [0, -2],
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1]
    ];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      let r = col[p * 3],
        g = col[p * 3 + 1],
        b = col[p * 3 + 2];
      const yo = H - 1 - y,
        q = (yo * W + x) * 3;
      if (!o.raw) {
        const gx = G(x + 1, y) - G(x - 1, y),
          gy = G(x, y + 1) - G(x, y - 1);
        if (gls[p] + Math.abs(gx) + Math.abs(gy) > 0) {
          const p2 = (clamp(y + Math.round(gy * bend), 0, H - 1) * W + clamp(x + Math.round(gx * bend), 0, W - 1)) * 3;
          r = col[p2];
          g = col[p2 + 1];
          b = col[p2 + 2];
        }
      }
      if (aoK > 0 && !o.raw) {
        const dc0 = dep[p];
        let occ = 0;
        for (const tq of AOT) {
          const dd = (dc0 - D(x + tq[0], y + tq[1])) / aoR;
          if (dd > 0.08 && dd < 3) occ += Math.min(1, dd);
        }
        const k = 1 - aoK * Math.min(1, occ / 4);
        r *= k;
        g *= k;
        b *= k;
      }
      if (o.raw) {
        out[q] = Math.round(clamp(r, 0, 1) * 255);
        out[q + 1] = Math.round(clamp(g, 0, 1) * 255);
        out[q + 2] = Math.round(clamp(b, 0, 1) * 255);
        continue;
      }
      const dc = dep[p],
        dm = dc - Math.max(2 * dc - D(x - 1, y) - D(x + 1, y), 2 * dc - D(x, y + 1) - D(x, y - 1));
      if (edge > 0 && dc - dm > edge) {
        r = line[0];
        g = line[1];
        b = line[2];
      } else {
        const th = (BAYER[(x & 3) + ((y & 3) << 2)] + 0.5) / 16 - 0.5;
        r = clamp(r + th * dith, 0, 1);
        g = clamp(g + th * dith, 0, 1);
        b = clamp(b + th * dith, 0, 1);
      }
      let bd = 1e9,
        bi = 0;
      for (let i = 0; i < np; i++) {
        const e = pal[i],
          dr = r - e[0],
          dg = g - e[1],
          db = b - e[2],
          dd = dr * dr * 0.3 + dg * dg * 0.55 + db * db * 0.15;
        if (dd < bd) {
          bd = dd;
          bi = i;
        }
      }
      use[bi]++;
      const h = world.pal[bi],
        gr = world.anim && world.anim.grade;
      if (gr) {
        out[q] = Math.round(gr[bi * 3] * 255);
        out[q + 1] = Math.round(gr[bi * 3 + 1] * 255);
        out[q + 2] = Math.round(gr[bi * 3 + 2] * 255);
      } else {
        out[q] = (h >> 16) & 255;
        out[q + 1] = (h >> 8) & 255;
        out[q + 2] = h & 255;
      }
    }
  /* pixel clean-up (an option): a lone pixel, unlike all eight round it, on the same surface as they are (not a mote in the air in
     front of something far off), takes the colour most of its four neighbours have. Checkered shading is left alone: there every
     pixel has its like at the corners. */
  if (o.clean && !o.raw) {
    const src = out.slice(),
      at = (x, y) => (clamp(y, 0, H - 1) * W + clamp(x, 0, W - 1)) * 3,
      same = (a, b) => src[a] === src[b] && src[a + 1] === src[b + 1] && src[a + 2] === src[b + 2];
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const q = at(x, y);
        let lone = true;
        for (let dy = -1; dy <= 1 && lone; dy++)
          for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && same(q, at(x + dx, y + dy))) lone = false;
        if (!lone) continue;
        const ns = [at(x - 1, y), at(x + 1, y), at(x, y - 1), at(x, y + 1)],
          dq = dep[(H - 1 - y) * W + x];
        let best = -1,
          bn = 0;
        for (let a = 0; a < 4; a++) {
          let c = 0;
          for (let b = 0; b < 4; b++) if (same(ns[a], ns[b])) c++;
          if (c > bn) ((bn = c), (best = ns[a]));
        }
        if (bn < 2) continue;
        const dn2 = dep[(H - 1 - clamp(Math.floor(best / 3 / W), 0, H - 1)) * W + ((best / 3) % W)];
        if (Math.abs(dq - dn2) > 0.03) continue;
        out[q] = src[best];
        out[q + 1] = src[best + 1];
        out[q + 2] = src[best + 2];
      }
  }
  return { w: W, h: H, px, rgb: out, drawn, use };
}
// make every art pixel k screen pixels wide, the way the page shows it
function upscale(img, k) {
  const W = img.w * k,
    H = img.h * k,
    out = new Uint8Array(W * H * 3);
  for (let y = 0; y < H; y++) {
    const sy = (y / k) | 0;
    for (let x = 0; x < W; x++) {
      const s = (sy * img.w + ((x / k) | 0)) * 3,
        q = (y * W + x) * 3;
      out[q] = img.rgb[s];
      out[q + 1] = img.rgb[s + 1];
      out[q + 2] = img.rgb[s + 2];
    }
  }
  return { w: W, h: H, rgb: out };
}
// several pictures in a grid, each with a small label in its corner
const FONT = {
  0: '111101101101111',
  1: '010110010010111',
  2: '111001111100111',
  3: '111001111001111',
  4: '101101111001001',
  5: '111100111001111',
  6: '111100111101111',
  7: '111001001001001',
  8: '111101111101111',
  9: '111101111001111',
  '.': '000000000000010',
  '-': '000000111000000',
  s: '000111110011111',
  ' ': '000000000000000',
  y: '101101111001111',
  t: '010111010010011'
};
function label(img, x0, y0, text, k) {
  k = k || 2;
  for (let c = 0; c < text.length; c++) {
    const g = FONT[text[c]] || FONT[' '];
    for (let j = 0; j < 15; j++)
      if (g[j] === '1')
        for (let a = 0; a < k; a++)
          for (let b = 0; b < k; b++) {
            const x = x0 + (c * 4 + (j % 3)) * k + a,
              y = y0 + ((j / 3) | 0) * k + b;
            if (x >= 0 && x < img.w && y >= 0 && y < img.h) {
              const q = (y * img.w + x) * 3;
              img.rgb[q] = 255;
              img.rgb[q + 1] = 255;
              img.rgb[q + 2] = 255;
            }
          }
  }
}
function grid(imgs, cols, labels) {
  const w = imgs[0].w,
    h = imgs[0].h,
    rows = Math.ceil(imgs.length / cols),
    out = { w: w * cols, h: h * rows, rgb: new Uint8Array(w * cols * h * rows * 3) };
  imgs.forEach((im, n) => {
    const ox = (n % cols) * w,
      oy = ((n / cols) | 0) * h;
    for (let y = 0; y < h; y++) out.rgb.set(im.rgb.subarray(y * w * 3, (y + 1) * w * 3), ((oy + y) * out.w + ox) * 3);
    if (labels) label(out, ox + 6, oy + 6, labels[n]);
  });
  return out;
}
module.exports = { render, upscale, grid, label, viewMatrix, FOV };
