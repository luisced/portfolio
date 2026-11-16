/* Fixed-grid, palette-aware resolve using coverage and cluster voting.
   No per-frame palette fitting, camera movement or black ink. */
const PixelLook = (() => {
  const weights = [0.30, 0.55, 0.15];
  const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  function nearest(c, palette, solid) {
    let best = solid && palette.length > 1 ? 1 : 0, distance = Infinity;
    for (let i = best; i < palette.length; i++) {
      const d = c.reduce((sum, v, k) => sum + (v - palette[i][k]) ** 2 * weights[k], 0);
      if (d < distance) { distance = d; best = i; }
    }
    return best;
  }
  function ink(body) {
    const shade = body.map(v => v * 0.64), luma = shade.reduce((n, v, k) => n + v * weights[k], 0);
    return shade.map(v => Math.min(1, v * Math.max(1, 0.12 / Math.max(luma, 0.001))));
  }
  function resolve({ color, depth, w, h, palette, grade, interiorColor, dither = 0 }) {
    const width = w / 2, height = h / 2, rgb = new Uint8Array(width * height * 3), use = new Uint32Array(palette.length);
    const mapped = i => grade ? grade.slice(i * 3, i * 3 + 3) : palette[i];
    const at = (x, y) => Math.max(0, Math.min(h - 1, y)) * w + Math.max(0, Math.min(w - 1, x));
    const z = (x, y) => Math.min(...[at(x * 2, y * 2), at(x * 2 + 1, y * 2), at(x * 2, y * 2 + 1), at(x * 2 + 1, y * 2 + 1)].map(i => depth[i]));
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const ids = [at(x * 2, y * 2), at(x * 2 + 1, y * 2), at(x * 2, y * 2 + 1), at(x * 2 + 1, y * 2 + 1)];
      const samples = ids.map(i => [color[i * 3] / 255, color[i * 3 + 1] / 255, color[i * 3 + 2] / 255]);
      const average = [0, 1, 2].map(k => samples.reduce((s, c) => s + c[k], 0) / 4);
      const base = (y * width + x) * 3;
      const native = interiorColor ? [0, 1, 2].map(k => interiorColor[base + k] / 255) : average;
      const noise = interiorColor ? ((bayer[(x & 3) + ((y & 3) << 2)] + 0.5) / 16 - 0.5) * dither : 0;
      let selected = nearest(native.map(v => Math.max(0, Math.min(1, v + noise))), palette, false);
      let c = Array.from(mapped(selected));
      const votes = new Map(); let best = -1, score = 0, coverage = 0;
      ids.forEach((id, j) => {
        if (depth[id] >= 0.995) return;
        coverage++;
        const label = nearest(samples[j], palette, true), n = (votes.get(label) || 0) + 1;
        votes.set(label, n);
      });
      ids.forEach((id, j) => {
        if (depth[id] >= 0.995) return;
        const label = nearest(samples[j], palette, true), n = votes.get(label);
        if (n > score) { best = label; score = n; }
      });
      if (best >= 0) {
        const outer = coverage < 4 || [z(x - 1, y), z(x + 1, y), z(x, y - 1), z(x, y + 1)].some(d => d >= 0.995);
        if (outer) {
          selected = best;
          const body = mapped(best), tone = ink(Array.from(body)), background = mapped(0), a = coverage / 4;
          c = body.map((v, k) => background[k] * (1 - a) + (v * 0.35 + tone[k] * 0.65) * a);
        }
      }
      use[selected]++;
      const q = ((height - 1 - y) * width + x) * 3;
      c.forEach((v, k) => { rgb[q + k] = Math.round(Math.max(0, Math.min(1, v)) * 255); });
    }
    return { w: width, h: height, rgb, use };
  }
  const glsl = `
int pixelNearest(vec3 c, bool solid) {
  int best = solid && u_n > 1 ? 1 : 0; float bd = 1e9;
  for (int i = 0; i < 48; i++) {
    if (i >= u_n) break; if (solid && i == 0 && u_n > 1) continue;
    vec3 df = c - u_pal[i]; float d = dot(df * df, vec3(0.30, 0.55, 0.15));
    if (d < bd) { bd = d; best = i; }
  }
  return best;
}
vec3 pixelMapped(int i) { return u_grade > 0.5 ? u_out[i] : u_pal[i]; }
ivec2 pixelAt(ivec2 p) { return clamp(p, ivec2(0), textureSize(u_depth, 0) - 1); }
float pixelDepth(ivec2 p) {
  ivec2 q = p * 2; float d = 1.0;
  for (int y = 0; y < 2; y++) for (int x = 0; x < 2; x++) d = min(d, texelFetch(u_depth, pixelAt(q + ivec2(x, y)), 0).r);
  return d;
}
#ifndef PIXEL_NATIVE
vec3 pixelNative(ivec2 p) { return texelFetch(u_crispScene, p, 0).rgb; }
#endif
vec3 pixelResolve(ivec2 p) {
  vec3 samples[4]; int labels[4]; bool solid[4]; float coverage = 0.0;
  for (int i = 0; i < 4; i++) {
    ivec2 q = pixelAt(p * 2 + ivec2(i & 1, i >> 1));
    samples[i] = texelFetch(u_scene, q, 0).rgb;
    solid[i] = texelFetch(u_depth, q, 0).r < 0.995;
    labels[i] = pixelNearest(samples[i], solid[i]); if (solid[i]) coverage += 0.25;
  }
  vec3 native = pixelNative(p);   // (a page may define PIXEL_NATIVE and its own pixelNative, to work on the native picture first: glass, contact shade)
  float noise = ((BAYER[(p.x & 3) + ((p.y & 3) << 2)] + 0.5) / 16.0 - 0.5) * u_dither;
  vec3 c = pixelMapped(pixelNearest(clamp(native + noise, 0.0, 1.0), false)); int best = -1, score = 0;
  for (int i = 0; i < 4; i++) {
    if (!solid[i]) continue; int n = 0;
    for (int j = 0; j < 4; j++) if (solid[j] && labels[j] == labels[i]) n++;
    if (n > score) { best = labels[i]; score = n; }
  }
  if (best >= 0) {
    bool outer = coverage < 1.0 || max(max(pixelDepth(p - ivec2(1, 0)), pixelDepth(p + ivec2(1, 0))),
      max(pixelDepth(p - ivec2(0, 1)), pixelDepth(p + ivec2(0, 1)))) >= 0.995;
    if (outer) {
      vec3 body = pixelMapped(best);
      vec3 tone = body * 0.64; tone = min(vec3(1.0), tone * max(1.0, 0.12 / max(dot(tone, vec3(0.30, 0.55, 0.15)), 0.001)));
      c = mix(pixelMapped(0), mix(body, tone, 0.65), coverage);
    }
  }
  return c;
}`;
  return { nearest, ink, resolve, glsl };
})();
if (typeof module !== 'undefined') module.exports = PixelLook;
