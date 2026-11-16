// Shaders and GPU resources: a WebGL2 port of ink-studio's software renderer.
export function createGL(gl) {
  /* --- shaders: el mismo dibujo que el renderizador por software de ink-studio, en la tarjeta gráfica.
         Los splats viven en texturas (se suben una vez); cada cuadro solo llega la lista ordenada de cuáles dibujar.
         Con "detalle entintado" (la opción --fine del repo) cada splat trae un mosaico de 4x4 colores de la superficie que tiene
         debajo, y cada píxel toma su color de ahí: bordes rectos y limpios en vez de manchas redondas. --- */
  const ROW = 512;
  const VS1 = `#version 300 es
  precision highp float; precision highp int; precision highp sampler2D;
  layout(location=0) in uint aId;
  uniform sampler2D uD, uF;
  uniform mat4 uV; uniform vec2 uRes; uniform float uFocal, uNear, uHasFine;
  flat out vec3 vConic; flat out vec2 vS; flat out vec3 vCol; flat out float vAl; flat out vec4 vInv; flat out vec4 vRows; flat out float vFine;
  void main() {
    ivec2 at = ivec2(int(aId % ${ROW}u) * 3, int(aId / ${ROW}u));
    vec4 aP = texelFetch(uD, at, 0), aC0 = texelFetch(uD, at + ivec2(1, 0), 0), aC1 = texelFetch(uD, at + ivec2(2, 0), 0);
    vec4 c = uV * vec4(aP.xyz, 1.0);
    vFine = 0.0;
    if (aP.w <= 0.0 || c.z > -uNear) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
    float iz = -1.0 / c.z;
    vec2 lim = 1.3 * 0.5 * uRes / uFocal;
    float tx = clamp(c.x * iz, -lim.x, lim.x) / iz, ty = clamp(c.y * iz, -lim.y, lim.y) / iz;
    float j00 = uFocal * iz, j02 = uFocal * tx * iz * iz, j12 = uFocal * ty * iz * iz;
    vec3 r0 = vec3(uV[0][0], uV[1][0], uV[2][0]), r1 = vec3(uV[0][1], uV[1][1], uV[2][1]), r2 = vec3(uV[0][2], uV[1][2], uV[2][2]);
    vec3 a = j00 * r0 + j02 * r2, b = j00 * r1 + j12 * r2;
    mat3 S = mat3(aC0.x, aC0.y, aC0.z, aC0.y, aC1.x, aC1.y, aC0.z, aC1.y, aC1.z);
    vec3 u = S * a, w = S * b;
    float A = dot(a, u) + 0.15, B = dot(b, u), C = dot(b, w) + 0.15, det = A * C - B * B;
    if (det <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
    vConic = vec3(C, -B, A) / det;
    vec2 e = min(3.0 * sqrt(vec2(A, C)), vec2(2048.0));
    vS = uFocal * c.xy * iz + 0.5 * uRes;
    float pk = aC0.w;
    vCol = min(vec3(mod(pk, 256.0), mod(floor(pk / 256.0), 256.0), floor(pk / 65536.0)) / 255.0, 1.0);
    vAl = aP.w;
    if (uHasFine > 0.5) {
      /* el mosaico: sus dos medios ejes llevados a la pantalla, y eso dado la vuelta, dice qué casilla mira cada píxel */
      vec4 f0 = texelFetch(uF, at, 0), f1 = texelFetch(uF, at + ivec2(1, 0), 0), f2 = texelFetch(uF, at + ivec2(2, 0), 0);
      int kind = int(mod(aC1.w, 16.0));
      if (f2.w > 0.0 && f1.w == pk && kind != 5 && kind != 12 && kind != 13) {
        float m00 = dot(a, f1.xyz), m01 = dot(a, f2.xyz), m10 = dot(b, f1.xyz), m11 = dot(b, f2.xyz), dt = m00 * m11 - m01 * m10;
        if (abs(dt) > 1e-4 * (abs(m00 * m11) + abs(m01 * m10) + 1e-9)) { vFine = 1.0; vInv = vec4(m11, -m01, -m10, m00) / dt; vRows = f0; }
      }
    }
    vec2 corner = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1)) * 2.0 - 1.0;
    gl_Position = vec4((vS + corner * (e + 1.0)) / uRes * 2.0 - 1.0, 0.0, 1.0);
  }`;
  const FS1 = `#version 300 es
  precision highp float; precision highp int;
  uniform vec3 uPal[64]; uniform int uNp;
  flat in vec3 vConic; flat in vec2 vS; flat in vec3 vCol; flat in float vAl; flat in vec4 vInv; flat in vec4 vRows; flat in float vFine;
  out vec4 o;
  void main() {
    vec2 d = gl_FragCoord.xy - vS;
    float pw = -0.5 * (vConic.x * d.x * d.x + vConic.z * d.y * d.y) - vConic.y * d.x * d.y;
    if (pw > 0.0 || pw < -4.5) discard;
    float g = vAl * exp(pw);
    float a = vAl >= 1.0 ? 0.99 * smoothstep(0.38, 0.62, g) : min(0.99, g);
    if (a < 0.004) discard;
    vec3 col = vCol;
    if (vFine > 0.5) {
      int u = clamp(int(floor((vInv.x * d.x + vInv.y * d.y) * 2.0 + 2.0)), 0, 3), v = clamp(int(floor((vInv.z * d.x + vInv.w * d.y) * 2.0 + 2.0)), 0, 3);
      float row = v == 0 ? vRows.x : v == 1 ? vRows.y : v == 2 ? vRows.z : vRows.w, div = u == 0 ? 1.0 : u == 1 ? 64.0 : u == 2 ? 4096.0 : 262144.0;
      int idx = int(mod(floor(row / div), 64.0));
      if (idx < uNp) col = uPal[idx];
    }
    o = vec4(col * a, a);
  }`;
  const VS2 = `#version 300 es
  void main() { vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)); gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0); }`;
  const FS2 = `#version 300 es
  precision highp float;
  uniform sampler2D uT; uniform vec3 uPal[64], uPal2[64], uPal3[64]; uniform int uNp; uniform float uDith, uDawn, uOff;
  out vec4 o;
  const float BAYER[16] = float[16](0., 8., 2., 10., 12., 4., 14., 6., 3., 11., 1., 9., 15., 7., 13., 5.);
  void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    vec4 t = texelFetch(uT, p, 0);
    if (t.a < 0.4) { o = vec4(0.0); return; }
    float th = (BAYER[(p.x & 3) + ((p.y & 3) << 2)] + 0.5) / 16.0 - 0.5;
    vec3 c = clamp(t.rgb / t.a + th * uDith, 0.0, 1.0);
    float bd = 1e9; int bi = 0;
    for (int i = 0; i < 64; i++) {
      if (i >= uNp) break;
      vec3 e = c - uPal[i];
      float dd = dot(e * e, vec3(0.3, 0.55, 0.15));
      if (dd < bd) { bd = dd; bi = i; }
    }
    /* la paleta de la noche se va volviendo la del amanecer */
    o = vec4(mix(mix(uPal[bi], uPal2[bi], uDawn), uPal3[bi], uOff), 1.0);
  }`;
  function program(vs, fs) {
    const p = gl.createProgram();
    for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      gl.attachShader(p, s);
    }
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }
  const P1 = program(VS1, FS1), P2 = program(VS2, FS2);
  const loc = (p, names) => Object.fromEntries(names.map(n => [n, gl.getUniformLocation(p, n)]));
  const U1 = loc(P1, ['uV', 'uRes', 'uFocal', 'uNear', 'uHasFine', 'uD', 'uF', 'uPal', 'uNp']), U2 = loc(P2, ['uT', 'uPal', 'uPal2', 'uPal3', 'uNp', 'uDith', 'uDawn', 'uOff']);
  const vao = gl.createVertexArray(), vbo = gl.createBuffer(), empty = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.enableVertexAttribArray(0); gl.vertexAttribIPointer(0, 1, gl.UNSIGNED_INT, 0, 0); gl.vertexAttribDivisor(0, 1);
  gl.bindVertexArray(null);
  const tex = gl.createTexture(), fbo = gl.createFramebuffer(), texD = gl.createTexture(), texF = gl.createTexture();
  /* una textura de números: 3 texeles (12 números) por splat, ROW splats por renglón */
  function floats(t, rows, data) {
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, ROW * 3, rows, 0, gl.RGBA, gl.FLOAT, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  return { ROW, P1, P2, U1, U2, vao, vbo, empty, tex, fbo, texD, texF, floats };
}
