/* Un gato programando: escena para @shapeshift-labs/ink-studio.
   El gato mira hacia +x; su laptop está sobre una mesa baja delante de él. El ciclo dura LOOP segundos:
   teclea ocho líneas de código, las pruebas pasan (barra verde), celebra, y vuelve a empezar. */
module.exports = ({ makeBuilder, makeSculpt, KIT: K }) => ({
  id: 'cat-coder',
  name: 'Gato programando',
  seed: 11,
  build(seed) {
    const palette = [
      0x0c0a14, // 0 fondo (el visor lo deja transparente)
      0x143a2c, 0x2f7a43, 0x7cc45c, 0xffc46b, // 1-3 hojas, 4 luz cálida
      0x21131c, 0x44261f, 0x6e3f26, 0xa8642f, 0xe09a4a, // 5-9 madera
      0x09090d, 0x15151c, 0x26263a, 0x40405a, 0x6a6a8c, // 10-14 pelaje negro
      0xb9a99a, 0xe6dccf, 0xfffaf0, // 15-17 pelaje blanco
      0x14141c, 0x2a2a36, 0x4c4c5c, 0x8a8a9c, // 18-21 laptop
      0x0e1a2e, 0x15294a, // 22-23 pantalla
      0x5ad1ff, 0xff7ac0, 0xffe066, 0x8dff8a, 0xc9a2ff, // 24-28 código
      0xff8fa3, // 29 nariz
      0x7a1f2e, 0xc23b4e, 0xf06a78, // 30-32 taza / cojín
      0xdfe8ff, // 33 vapor
      0x8a7a14, 0xd9c22e, 0xf2e36a, // 34-36 ojos amarillos
      0x1f1838, 0x322756, 0x533d78, 0x8a5c8e, // 37-40 pared de noche
      0x141c44, 0x26357a, // 41-42 cielo nocturno
      0xfff3c4, // 43 luna
      0x27424f, 0x3f6b78, 0x76a3a2, // 44-46 verde azulado
      0x1c1124, 0x38192b, 0x61283a, 0x9a4a40, // 47-50 madera oscura: suelo y marcos
      0x4ff0ff, 0xff4fa8, 0xff8a3c, // 51-53 neón cian, neón rosa, naranja
      0x100c1e, 0x1c1532, 0xd8d2e8, 0x8f6bff // 54-55 sombras de noche, 56 teclas, 57 led violeta
    ];
    const B = makeBuilder(seed, palette);
    const S = K.sculpt(makeSculpt(B));

    const wood = { r: [5, 6, 7, 8, 9] },
      fur = { r: [10, 11, 12, 13, 14] },
      white = { r: [15, 16, 17] },
      dark = { r: [18, 18, 19] },
      metal = { r: [18, 19, 20, 21] },
      cushion = { r: [30, 31, 32] },
      em = i => ({ r: [i, i, i], em: true });

    /* luz de juguete: sol suave desde el lado de la cámara, mucha luz ambiente, y lámparas cálidas */
    S.sun = B.norm([-0.5, 0.85, 0.5]);
    S.sunK = 0.2;
    S.amb = 0.2;
    S.sky = 0.2;
    /* de noche: casi toda la luz viene de los monitores, la lámpara, el neón, la torre y la guirnalda */
    S.lights.push({ p: [0.8, 1.7, 0], r: 3.8, s: 0.85 });
    S.lights.push({ p: [2.3, 2.5, 2.6], r: 4.8, s: 0.8 });
    S.lights.push({ p: [-2.5, 3.1, -2.4], r: 3.2, s: 0.6 });
    S.lights.push({ p: [1.3, 0.8, 2.9], r: 2.0, s: 0.5 });
    S.lights.push({ p: [-1.4, 4.0, -2.5], r: 3.4, s: 0.45 });
    S.lights.push({ p: [-2.6, 3.2, 2.6], r: 6.5, s: 0.42 });

    /* --- el cuarto: una plataforma flotante con dos paredes --- */
    const X0 = -3.3, X1 = 3.0, Z0R = -3.2, Z1R = 3.3, HW = 4.7,
      XC = (X0 + X1) / 2, ZC = (Z0R + Z1R) / 2, XH = (X1 - X0) / 2, ZH = (Z1R - Z0R) / 2;
    const trim = { r: [47, 48, 49, 50] }, plankA = { r: [48, 49, 50] }, plankB = { r: [47, 48, 49, 50] },
      wall = { r: [37, 38, 39, 40] }, leaf = { r: [1, 2, 3] }, teal = { r: [44, 45, 46] }, gold = { r: [34, 35, 36] };
    S.box([XC + 0.15, -0.5, ZC - 0.15], [XH + 0.4, 0.34, ZH + 0.4], trim, { res: 0.16 });
    for (let i = 0, z = Z0R + 0.36; z < Z1R; z += 0.72, i++)
      S.box([XC, -0.08, z], [XH, 0.08, 0.345], i % 2 ? plankA : plankB, { res: 0.14 });
    /* escalones de entrada */
    S.box([-1.6, -0.45, Z1R + 0.55], [0.9, 0.16, 0.4], trim, { res: 0.12 });
    S.box([-1.6, -0.8, Z1R + 1.15], [0.75, 0.14, 0.35], trim, { res: 0.12 });
    S.box([-1.6, 0.02, Z1R - 0.5], [0.7, 0.03, 0.4], cushion, { res: 0.1 });
    /* alfombra redonda */
    S.lathe([0.25, 0, 0], 0.03, () => 2.2, cushion, { res: 0.13 });
    S.lathe([0.25, 0, 0], 0.045, () => 1.8, gold, { res: 0.13 });
    S.lathe([0.25, 0, 0], 0.06, () => 1.45, cushion, { res: 0.13 });
    /* lámpara de pie */
    S.lathe([2.6, 0, 3.0], 0.08, () => 0.3, metal, { res: 0.07 });
    S.tube([[2.6, 0.05, 3.0], [2.6, 2.4, 3.0]], 0.04, 0.04, metal, { res: 0.06 });
    S.lathe([2.6, 2.3, 3.0], 0.6, y => 0.5 - 0.28 * y, em(4), { res: 0.07 });
    /* planta grande en maceta */
    S.lathe([-2.7, 0, -2.6], 0.55, y => 0.28 + 0.12 * y, gold, { res: 0.07 });
    for (let i = 0; i < 9; i++) {
      const a = i * 2.4, r = 0.4 + (i % 3) * 0.22, h = 1.3 + (i % 4) * 0.36;
      S.tube([[-2.7, 0.5, -2.6], [-2.7 + Math.cos(a) * r * 0.4, h, -2.6 + Math.sin(a) * r * 0.4], [-2.7 + Math.cos(a) * r, h + 0.2, -2.6 + Math.sin(a) * r]], 0.05, 0.02, leaf, { res: 0.06 });
      S.ball([-2.7 + Math.cos(a) * r, h + 0.2, -2.6 + Math.sin(a) * r], [0.25, 0.07, 0.25], leaf, { res: 0.07 });
    }
    /* caja de cartón, ovillo de lana, libros y platos de comida */
    S.box([-2.5, 0.4, 2.3], [0.55, 0.4, 0.48], { r: [6, 7, 8] }, { res: 0.08 });
    S.box([-2.5, 0.82, 2.3], [0.46, 0.03, 0.39], { r: [5, 5, 6] }, { res: 0.07 });
    S.ball([-1.0, 0.24, 2.2], 0.24, { r: [31, 32, 29] }, { res: 0.05 });
    S.tube([[-1.0, 0.05, 2.2], [-0.5, 0.03, 2.45], [-0.2, 0.03, 2.1], [0.2, 0.03, 2.4]], 0.025, 0.02, { r: [32, 29, 29] }, { res: 0.04 });
    S.box([-1.9, 0.07, -1.2], [0.42, 0.07, 0.3], teal, { res: 0.06 });
    S.box([-1.85, 0.2, -1.22], [0.38, 0.06, 0.28], cushion, { res: 0.06 });
    S.box([-1.92, 0.31, -1.18], [0.34, 0.05, 0.25], gold, { res: 0.06 });
    for (const [z, c] of [[0.5, 29], [1.1, 24]]) {
      S.lathe([-2.7, 0, z], 0.12, y => 0.2 + 0.06 * y, teal, { res: 0.05 });
      S.lathe([-2.7, 0.1, z], 0.04, () => 0.17, { r: [c, c, c] }, { res: 0.05 });
    }
    let rnd = 7;
    const rand = () => ((rnd = (rnd * 16807) % 2147483647) % 1000) / 1000;
    /* escritorio largo con tira led */
    S.box([1.3, 0.94, 0], [0.62, 0.05, 1.95], wood, { res: 0.08, rd: 0.02 });
    for (const sx of [-1, 1])
      for (const sz of [-1, 1]) S.box([1.3 + sx * 0.5, 0.45, sz * 1.8], [0.06, 0.45, 0.06], wood, { res: 0.08 });
    S.box([0.69, 0.87, 0], [0.012, 0.018, 1.85], em(57), { res: 0.04 });
    S.ball([-0.05, 0.2, 0], [0.8, 0.22, 0.8], cushion, { res: 0.09 });
    /* teclado mecánico: base, teclas y unas cuantas de color */
    S.box([1.1, 1.015, 0], [0.18, 0.026, 0.54], dark, { res: 0.05 });
    S.box([1.1, 0.995, 0], [0.2, 0.008, 0.56], em(57), { res: 0.04 });
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 12; c++) {
        const k = r * 12 + c,
          m = k === 0 ? em(52) : k === 23 || k === 35 ? em(51) : k === 40 || k === 41 ? em(53) : { r: [20, 21, 56] };
        if (r === 3 && c > 3 && c < 8) continue;
        S.box([0.975 + r * 0.083, 1.055, -0.46 + c * 0.0836], [0.03, 0.014, 0.031], m, { res: 0.03 });
      }
    S.box([1.224, 1.055, 0.0], [0.03, 0.014, 0.15], { r: [20, 21, 56] }, { res: 0.03 });
    S.ball([1.1, 1.03, 0.74], [0.075, 0.04, 0.05], white, { res: 0.035 });
    /* monitor principal: aquí se escribe el código */
    S.box([1.58, 1.5, 0], [0.03, 0.47, 0.62], metal, { res: 0.06 });
    S.box([1.545, 1.5, 0], [0.008, 0.42, 0.57], em(22), { res: 0.05 });
    S.box([1.68, 1.0, 0], [0.1, 0.015, 0.2], metal, { res: 0.05 });
    S.box([1.64, 1.08, 0], [0.03, 0.09, 0.05], metal, { res: 0.05 });
    /* monitor vertical a la izquierda, lleno de código */
    S.box([1.58, 1.66, -1.28], [0.03, 0.6, 0.36], metal, { res: 0.06 });
    S.box([1.545, 1.66, -1.28], [0.008, 0.55, 0.31], em(22), { res: 0.05 });
    S.box([1.66, 1.02, -1.28], [0.09, 0.03, 0.14], metal, { res: 0.05 });
    {
      const cs = [24, 17, 25, 26, 28, 17, 24, 27, 17, 25, 28, 24], ind = [0, 0.05, 0.1, 0.1, 0.05, 0.1, 0.15, 0.1, 0.05, 0, 0.05, 0];
      for (let i = 0; i < 12; i++) {
        const len = 0.14 + ((i * 37) % 11) * 0.028;
        S.box([1.532, 2.12 - i * 0.082, -1.54 + ind[i] + len / 2], [0.006, 0.02, Math.min(len, 0.5 - ind[i]) / 2], em(cs[i]), { res: 0.028 });
      }
    }
    /* monitor a la derecha: la vista previa de un sitio */
    S.box([1.58, 1.47, 1.32], [0.03, 0.38, 0.54], metal, { res: 0.06 });
    S.box([1.545, 1.47, 1.32], [0.008, 0.33, 0.49], em(23), { res: 0.05 });
    S.box([1.66, 1.02, 1.32], [0.09, 0.03, 0.16], metal, { res: 0.05 });
    S.box([1.532, 1.73, 1.32], [0.006, 0.03, 0.43], em(52), { res: 0.03 });
    S.box([1.532, 1.55, 1.08], [0.006, 0.09, 0.19], em(17), { res: 0.03 });
    S.box([1.532, 1.58, 1.52], [0.006, 0.025, 0.2], em(51), { res: 0.03 });
    S.box([1.532, 1.5, 1.47], [0.006, 0.02, 0.15], em(33), { res: 0.03 });
    for (let i = 0; i < 3; i++) S.box([1.532, 1.28, 1.0 + i * 0.32], [0.006, 0.09, 0.12], em([57, 27, 26][i]), { res: 0.03 });
    /* pato de hule (para depurar en voz alta) */
    S.ball([0.96, 1.1, 1.8], [0.14, 0.11, 0.12], gold, { res: 0.035 });
    S.ball([1.07, 1.15, 1.8], [0.06, 0.05, 0.07], gold, { res: 0.03 });
    S.ball([0.88, 1.27, 1.8], 0.09, gold, { res: 0.03 });
    S.ball([0.79, 1.25, 1.8], [0.05, 0.022, 0.05], em(53), { res: 0.022 });
    for (const sz of [-1, 1]) S.ball([0.83, 1.3, 1.8 + sz * 0.062], 0.02, { r: [10, 10, 10] }, { res: 0.018 });
    S.box([0.87, 0.994, 1.2], [0.17, 0.004, 0.36], { r: [15, 16, 17] }, { res: 0.04 });
    S.box([1.612, 1.5, 0], [0.004, 0.3, 0.46], { r: [15, 16, 17] }, { res: 0.05 });
    /* cubo Rubik a medio resolver */
    {
      const c = [0.95, 1.14, -1.62], h = 0.15;
      S.box(c, [h, h, h], { r: [18, 18, 19] }, { res: 0.04 });
    }
    /* torre con ventiladores RGB, en el suelo junto al escritorio */
    S.box([1.45, 0.58, 2.62], [0.5, 0.58, 0.24], { r: [18, 18, 19, 20] }, { res: 0.07 });
    for (const [x, col] of [[1.2, 52], [1.7, 51]]) {
      S.ball([x, 0.62, 2.87], [0.17, 0.17, 0.02], em(col), { res: 0.035 });
      S.ball([x, 0.62, 2.89], [0.1, 0.1, 0.02], { r: [18, 18, 18] }, { res: 0.03 });
    }
    S.box([1.45, 1.08, 2.87], [0.4, 0.02, 0.012], em(57), { res: 0.03 });
    /* taza y una planta para acompañar */
    S.lathe([0.95, 0.99, -0.88], 0.26, () => 0.11, cushion, { res: 0.05 });
    S.torus([0.95, 1.12, -1.01], 0.07, 0.022, cushion, { res: 0.04 });
    S.lathe([1.62, 0.99, -1.78], 0.2, y => 0.09 + y * 0.15, wood, { res: 0.05 });
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      S.tube(
        [
          [1.62, 1.18, -1.78],
          [1.62 + Math.cos(a) * 0.1, 1.42, -1.78 + Math.sin(a) * 0.1],
          [1.62 + Math.cos(a) * 0.2, 1.5 + (i % 2) * 0.08, -1.78 + Math.sin(a) * 0.2]
        ],
        0.035,
        0.012,
        { r: [27, 27, 27] },
        { res: 0.05 }
      );
    }
    S.bake();

    /* --- las dos paredes, cada una con lo que cuelga de ella. Se hornean por separado para poder ocultar la que tape la vista --- */
    const walls = [];
    const wallGroup = (n, fn) => {
      const a = B.count();
      fn();
      S.bake();
      walls.push({ a, b: B.count(), n, p: [n[0] > 0 ? X1 : 0, n[1] < 0 ? Z0R : 0] });
    };
    const WR = { res: 0.17 }, frame = trim, TR = { res: 0.1 };
    /* pared frente al gato: librero y pizarrón */
    wallGroup([1, 0], () => {
      S.box([X1 + 0.15, HW / 2, ZC], [0.15, HW / 2, ZH], wall, WR);
      S.box([X1 + 0.15, HW + 0.13, ZC - 0.15], [0.26, 0.15, ZH + 0.42], trim, TR);
      S.box([X1 + 0.15, HW / 2 - 0.2, Z1R + 0.1], [0.27, HW / 2 + 0.3, 0.2], trim, TR);
      S.box([X1 - 0.04, 0.14, ZC], [0.04, 0.14, ZH], trim, TR);
      const bz = -2.0, bw = 0.95, bx = X1 - 0.3;
      S.box([bx, 1.75, bz - bw], [0.3, 1.75, 0.06], frame, TR);
      S.box([bx, 1.75, bz + bw], [0.3, 1.75, 0.06], frame, TR);
      const cols = [cushion, teal, gold, leaf, white, { r: [41, 42, 42] }, { r: [30, 32, 29] }];
      for (let k = 0; k < 5; k++) {
        const y = 0.06 + k * 0.86;
        S.box([bx, y, bz], [0.3, 0.05, bw], frame, TR);
        if (k === 4) break;
        for (let z = bz - bw + 0.16; z < bz + bw - 0.18; ) {
          const w = 0.07 + rand() * 0.06, h = 0.24 + rand() * 0.12;
          if (rand() > 0.14) S.box([bx + 0.02, y + 0.05 + h, z], [0.2, h, w], cols[Math.floor(rand() * cols.length)], { res: 0.09 });
          z += w * 2 + 0.03;
        }
      }
      S.lathe([bx, 3.55, bz - 0.3], 0.28, y => 0.13 + 0.06 * y, white, { res: 0.05 });
      for (let i = 0; i < 6; i++) {
        const a = i * 1.05;
        S.tube([[bx, 3.8, bz - 0.3], [bx + Math.cos(a) * 0.2, 4.2, bz - 0.3 + Math.sin(a) * 0.3], [bx + Math.cos(a) * 0.3, 4.05, bz - 0.3 + Math.sin(a) * 0.5]], 0.05, 0.03, leaf, { res: 0.05 });
      }
      /* pizarrón: aquí se proyecta la lista de proyectos (el texto es HTML puesto encima, en perspectiva) */
      S.box([X1 - 0.05, 3.2, 0.9], [0.05, 1.06, 1.72], frame, { res: 0.08 });
      S.box([X1 - 0.11, 3.2, 0.9], [0.02, 0.96, 1.62], { r: [54, 54, 55] }, { res: 0.08 });
      S.box([X1 - 0.16, 2.17, 0.9], [0.07, 0.03, 1.2], frame, { res: 0.06 });
      S.box([X1 - 0.17, 2.22, 0.2], [0.03, 0.02, 0.1], white, { res: 0.03 });
      S.box([X1 - 0.17, 2.22, 1.5], [0.03, 0.025, 0.14], { r: [30, 31, 32] }, { res: 0.03 });
    });
    /* pared de la ventana: noche con luna, cortinas, cartel de huella y guirnalda de luces */
    wallGroup([0, -1], () => {
      S.box([XC, HW / 2, Z0R - 0.15], [XH, HW / 2, 0.15], wall, WR);
      S.box([XC + 0.15, HW + 0.13, Z0R - 0.15], [XH + 0.42, 0.15, 0.26], trim, TR);
      S.box([X0 - 0.1, HW / 2 - 0.2, Z0R - 0.15], [0.2, HW / 2 + 0.3, 0.27], trim, TR);
      S.box([X1 + 0.15, HW / 2 - 0.2, Z0R - 0.15], [0.3, HW / 2 + 0.3, 0.3], trim, TR);
      S.box([XC, 0.14, Z0R + 0.04], [XH, 0.14, 0.04], trim, TR);
      const wx = -0.2, wy = 2.75, ww = 1.15, wh = 0.9, z = Z0R + 0.03;
      S.box([wx, wy, z], [ww, wh, 0.03], em(41), { res: 0.1 });
      for (const [sx, sy] of [[-0.7, -0.4], [0.15, -0.6], [0.95, -0.15], [-0.3, -0.25], [0.3, -0.12]])
        S.ball([wx + sx, wy + sy, z + 0.04], 0.035, em(17), { res: 0.03 });
      for (const sy of [-1, 1]) S.box([wx, wy + sy * wh, z + 0.05], [ww + 0.1, 0.08, 0.07], frame, { res: 0.06 });
      for (const sx of [-1, 1]) S.box([wx + sx * ww, wy, z + 0.05], [0.08, wh, 0.07], frame, { res: 0.06 });
      S.box([wx, wy, z + 0.05], [0.04, wh, 0.05], frame, { res: 0.05 });
      S.box([wx, wy, z + 0.05], [ww, 0.04, 0.05], frame, { res: 0.05 });
      S.box([wx, wy - wh - 0.1, z + 0.16], [ww + 0.22, 0.05, 0.18], frame, { res: 0.06 });
      for (const sx of [-1, 1])
        for (let k = 0; k < 2; k++) S.ball([wx + sx * (ww + 0.28 + k * 0.16), wy - 0.1, z + 0.14], [0.13, wh + 0.4, 0.1], cushion, { res: 0.1 });
      /* letrero de neón: </> */
      {
        const z = Z0R + 0.1, t = (pts, c) => S.tube(pts.map(q => [q[0], q[1], z]), 0.045, 0.045, em(c), { res: 0.04 });
        t([[-2.72, 3.4], [-2.98, 3.1], [-2.72, 2.8]], 52);
        t([[-2.42, 3.46], [-2.6, 2.74]], 51);
        t([[-2.3, 3.4], [-2.04, 3.1], [-2.3, 2.8]], 52);
      }
      const bulbs = [4, 29, 24, 26, 4, 27];
      for (let i = 0; i < 13; i++) {
        const f = i / 12, seg = (f * 3) % 1;
        S.ball([X0 + 0.4 + f * (X1 - X0 - 0.8), 4.4 - 0.25 * Math.sin(seg * Math.PI), Z0R + 0.1], 0.075, em(bulbs[i % bulbs.length]), { res: 0.04 });
      }
    });

    /* --- lo que se mueve: cada sólido lleva una etiqueta --- */
    const dynStart = B.count(); /* de aquí en adelante, todo lo que se hornea puede moverse */
    const tags = K.deform.tags(S);
    const T = (tag, res) => ({ tag, res: res || 0.07 });
    /* cuerpo esbelto: caderas anchas abajo, torso más fino arriba, cuello marcado */
    S.ball([-0.12, 0.78, 0], [0.56, 0.5, 0.6], fur, T('body', 0.08));
    S.ball([0.06, 1.22, 0], [0.42, 0.62, 0.43], fur, T('body', 0.08));
    S.ball([0.1, 1.72, 0], [0.3, 0.26, 0.32], fur, T('body', 0.07));
    for (const sz of [-1, 1]) {
      S.ball([0.02, 0.62, sz * 0.46], [0.42, 0.34, 0.24], fur, T('body', 0.07)); // muslos
      S.ball([0.36, 0.4, sz * 0.4], [0.24, 0.1, 0.13], white, T('body', 0.05)); // patas traseras
    }
    /* babero blanco y esponjoso: ancho en el pecho, en punta hacia la barbilla */
    S.ball([0.36, 1.2, 0], [0.22, 0.46, 0.4], white, T('body', 0.06));
    S.ball([0.36, 1.62, 0], [0.16, 0.22, 0.22], white, T('body', 0.05));
    for (let i = 0; i < 7; i++) {
      const a = -1.2 + (i / 6) * 2.4;
      S.ball([0.4, 1.02 + 0.2 * Math.cos(a * 1.3), 0.4 * Math.sin(a)], [0.1, 0.14, 0.1], white, T('body', 0.045));
    }
    /* cabeza ancha y algo achatada, con mejillas */
    S.ball([0.12, 2.14, 0], [0.44, 0.4, 0.56], fur, T('head', 0.06));
    for (const sz of [-1, 1]) S.ball([0.26, 2.0, sz * 0.34], [0.26, 0.2, 0.24], fur, T('head', 0.05));
    S.ball([0.47, 2.07, 0], [0.17, 0.11, 0.2], fur, T('head', 0.04)); // antifaz negro sobre la nariz
    S.ball([0.46, 1.95, 0], [0.16, 0.09, 0.15], white, T('head', 0.035)); // boca y barbilla blancas
    S.ball([0.635, 2.065, 0], [0.035, 0.032, 0.055], em(29), T('head', 0.022));
    for (const [sd, sz] of [['l', -1], ['r', 1]]) {
      /* orejas grandes y separadas, con el interior más claro mirando al frente */
      S.tube([[0.06, 2.34, sz * 0.36], [0.04, 2.62, sz * 0.45], [0.02, 2.86, sz * 0.52]], 0.23, 0.02, fur, T('ear-' + sd, 0.045));
      S.tube([[0.15, 2.42, sz * 0.38], [0.1, 2.72, sz * 0.47]], 0.12, 0.01, { r: [12, 13, 13] }, T('ear-' + sd, 0.04));
      /* ojos grandes y redondos, amarillos, con pupila */
      S.ball([0.47, 2.2, sz * 0.25], [0.07, 0.11, 0.115], { r: [34, 35, 36], em: true }, T('eye-' + sd, 0.028));
      S.ball([0.525, 2.2, sz * 0.245], [0.03, 0.075, 0.06], { r: [10, 10, 10] }, T('eye-' + sd, 0.022));
      S.ball([0.55, 2.24, sz * 0.245 + 0.03], 0.018, { r: [17, 17, 17], em: true }, T('eye-' + sd, 0.015));
      /* patas delanteras finas con guante blanco */
      S.tube([[0.2, 1.5, sz * 0.34], [0.62, 1.3, sz * 0.32], [0.94, 1.2, sz * 0.24]], 0.11, 0.085, fur, T('arm-' + sd, 0.05));
      S.ball([1.0, 1.16, sz * 0.24], [0.14, 0.085, 0.11], white, T('arm-' + sd, 0.045));
    }
    const T0 = [-0.5, 0.4, 0.1],
      T1 = [-1.3, 0.5, 0.8];
    S.tube([T0, [-1.0, 0.3, 0.38], T1, [-1.45, 0.95, 1.05], [-1.4, 1.3, 1.1]], 0.1, 0.07, fur, T('tail', 0.05));

    /* lo que cambia según avanza la noche (W.story): la luna cruza la ventana, se juntan tazas, el cubo acaba resuelto */
    S.ball([-1.05, 3.3, Z0R + 0.03], [0.25, 0.25, 0.06], em(43), T('moon', 0.05));
    const CUPS = [[0.8, -1.2, teal, 1.6], [1.27, -0.78, gold, 3.4], [0.77, -0.64, white, 4.6]];
    CUPS.forEach(([x, z, m], i) => {
      S.lathe([x, 0.99, z], 0.24, () => 0.1, m, T('cup' + i, 0.045));
      S.lathe([x, 1.2, z], 0.03, () => 0.075, { r: [5, 6, 6] }, T('cup' + i, 0.04));
    });
    {
      const c = [0.95, 1.14, -1.62], h = 0.15, st = [17, 31, 42, 35, 53, 2];
      for (let i = -1; i <= 1; i++)
        for (let j = -1; j <= 1; j++) {
          const pick = () => em(st[Math.floor(rand() * st.length)]);
          const faces = [[[c[0] + i * 0.1, c[1] + h, c[2] + j * 0.1], [0.04, 0.012, 0.04], 17], [[c[0] - h, c[1] + i * 0.1, c[2] + j * 0.1], [0.012, 0.04, 0.04], 31], [[c[0] + i * 0.1, c[1] + j * 0.1, c[2] + h], [0.04, 0.04, 0.012], 42]];
          for (const [at, half, solved] of faces) {
            S.box(at, half, pick(), T('cubeA', 0.03));
            S.box([at[0], at[1] + 6, at[2]], half, em(solved), T('cubeB', 0.03)); /* (se hornea aparte, arriba: dos sólidos en el mismo sitio se anulan) */
          }
        }
    }

    /* las Z del sueño: tres letras hechas de tubitos luminosos, de cara a la vista general. Se hornean separadas (una encima de otra)
       y la pose las trae a la cabeza del michi cuando se duerme */
    const ZAT = [0.45, 3.0, 0.1], ZR = [0.707, 0, 0.707], ZGAP = 2;
    for (let i = 0; i < 3; i++) {
      const w = 0.13 + i * 0.03, h = 0.16 + i * 0.035, y = ZAT[1] + i * ZGAP,
        at = (a, b) => [ZAT[0] + ZR[0] * a * w, y + b * h, ZAT[2] + ZR[2] * a * w],
        bar = (p, q) => S.tube([p, q], 0.035, 0.035, em(17), T('zz' + i, 0.03));
      bar(at(-1, 1), at(1, 1)); bar(at(1, 1), at(-1, -1)); bar(at(-1, -1), at(1, -1));
    }

    /* las líneas de código: barras luminosas que crecen desde la izquierda de la pantalla (z = -0.34) */
    const LINES = [
      [24, 0, 0.42], [17, 0.08, 0.7], [25, 0.16, 0.52], [26, 0.16, 0.78],
      [17, 0.16, 0.36], [28, 0.08, 0.6], [24, 0.08, 0.46], [25, 0, 0.28]
    ];
    const lineY = i => 1.84 - i * 0.078,
      Z0 = -0.48,
      SX = 1.532;
    LINES.forEach(([col, ind, len], i) =>
      S.box([SX, lineY(i), Z0 + ind + len / 2], [0.006, 0.022, len / 2], em(col), T('ln' + i, 0.028))
    );
    S.box([SX, 1.17, 0], [0.006, 0.035, 0.48], em(27), T('pass', 0.03));
    S.box([SX, 1.4, 0], [0.006, 0.026, 0.022], em(17), T('cursor', 0.02));
    S.bake();

    /* bigotes: trazos finos puestos a mano (un sólido tan delgado no se hornea bien); se mueven con la cabeza */
    for (const sz of [-1, 1])
      for (const dy of [-0.3, -0.04, 0.22]) {
        const dir = B.norm([0.2, dy, sz]), n0 = B.count();
        for (const d of [0.08, 0.2, 0.32, 0.44])
          B.stick(0.5 + dir[0] * d, 1.99 + dir[1] * d, sz * 0.2 + dir[2] * d, dir, 0.07, 0.005, B.P[17], 1.2, { em: true, nd: true });
        for (let i = n0; i < B.count(); i++) tags.head.push(i);
      }
    tags.head.sort((a, b) => a - b);

    const pool = K.pool(B, 90);
    const W = B.finish({
      cam: { target: [-0.7, 0.75, 0.5], dist: 15, pitch: 0.5, yaw: -0.785 },
      detail: 19,
      dither: 0.2,
      radius: 14
    });

    /* corte tipo casa de muñecas: se esconden las paredes que quedan entre la cámara y el gato */
    const restY = new Float32Array(W.count);
    for (let i = 0; i < W.count; i++) restY[i] = W.data[i * 16 + 1];
    const data0 = W.data;
    W.cutaway = eye => {
      for (const w of walls) {
        const hide = (eye[0] - w.p[0]) * w.n[0] + (eye[2] - w.p[1]) * w.n[1] > 0.3;
        if (hide === w.hidden) continue;
        w.hidden = hide;
        for (let i = w.a; i < w.b; i++) data0[i * 16 + 1] = hide ? -99 : restY[i];
      }
    };
    W.eye = (yaw, pitch, dist, T) => [T[0] + dist * Math.cos(pitch) * Math.sin(yaw), T[1] + dist * Math.sin(pitch), T[2] + dist * Math.cos(pitch) * Math.cos(yaw)];
    W.cutaway(W.eye(W.cam.yaw, W.cam.pitch, W.cam.dist, W.cam.target));

    /* W.cheer(): el gato celebra cuando se lo piden (un clic en la página) */
    let cheerAt = -99, nowT = 0, tailPh = 0;
    /* W.story(n): en qué momento de la noche vamos (0 al empezar, 6 al amanecer). La escena lo sigue con suavidad */
    let storyT = 0, story = 0;
    W.story = v => { storyT = v; };
    W.cheer = () => { cheerAt = nowT; };
    W.dynStart = dynStart;

    const stage = K.stage(W);
    const ps = stage.add(K.particles(stage, pool, { flow: K.flow.sum(K.flow.wind([0, 0.25, 0]), K.flow.curl(1.5, 0.3)) }));
    let nextSteam = 0;
    stage.add({
      update(dt, t) {
        if (t >= nextSteam && story < 5.4) {
          ps.emit({
            p: [0.95 + (Math.random() - 0.5) * 0.08, 1.28, -0.88 + (Math.random() - 0.5) * 0.08],
            v: [0, 0.3, 0],
            life: 1.6,
            size: 0.05,
            cols: [33, 17, 16],
            grav: -0.1,
            drag: 0.6,
            ride: 0.7,
            fade: 0.6
          });
          nextSteam = t + 0.16;
        }
      }
    });

    const LOOP = 8,
      TYPE = 5.6, // hasta aquí teclea
      PASS = 6.0, // aquí pasan las pruebas
      CLEAR = 7.6,
      per = TYPE / LINES.length,
      parts = {
        body: { ids: tags.body, pivot: [0, 0.3, 0], slices: 5 },
        head: { ids: tags.head, pivot: [0.05, 1.75, 0], parent: 'body' },
        'ear-l': { ids: tags['ear-l'], pivot: [0.06, 2.4, -0.36], parent: 'head' },
        'ear-r': { ids: tags['ear-r'], pivot: [0.06, 2.4, 0.36], parent: 'head' },
        'eye-l': { ids: tags['eye-l'], pivot: [0.5, 2.2, -0.25], parent: 'head' },
        'eye-r': { ids: tags['eye-r'], pivot: [0.5, 2.2, 0.25], parent: 'head' },
        'arm-l': { ids: tags['arm-l'], pivot: [0.2, 1.5, -0.34], parent: 'body' },
        'arm-r': { ids: tags['arm-r'], pivot: [0.2, 1.5, 0.34], parent: 'body' },
        tail: { ids: tags.tail, pivot: T0, axis: K.V.norm(K.V.sub(T1, T0)), slices: 7 },
        pass: { ids: tags.pass, pivot: [SX, 1.17, -0.48] },
        cursor: { ids: tags.cursor, pivot: [SX, 1.4, 0] },
        moon: { ids: tags.moon, pivot: [-1.05, 3.3, Z0R + 0.03] },
        cubeA: { ids: tags.cubeA, pivot: [0.95, 1.14, -1.62] },
        cubeB: { ids: tags.cubeB, pivot: [0.95, 7.14, -1.62] }
      };
    for (let i = 0; i < 3; i++) parts['zz' + i] = { ids: tags['zz' + i], pivot: [ZAT[0], ZAT[1] + i * ZGAP, ZAT[2]] };
    CUPS.forEach(([x, z], i) => (parts['cup' + i] = { ids: tags['cup' + i], pivot: [x, 0.99, z] }));
    for (const k in parts) if (!parts[k].ids) throw new Error('sin splats: ' + k);
    LINES.forEach(([, ind], i) => (parts['ln' + i] = { ids: tags['ln' + i], pivot: [SX, lineY(i), Z0 + ind] }));

    const sin = Math.sin,
      TAU = Math.PI * 2,
      bump = (x, w) => Math.max(0, 1 - Math.abs(x) / w);
    K.puppet(W, {
      parts,
      pose(time, dt, p) {
        nowT = time;
        story += (storyT - story) * (1 - Math.exp(-5 * Math.min(0.05, Math.max(0, dt || 0))));
        const near = (at, w) => { const x = Math.max(0, 1 - Math.abs(story - at) / w); return x * x * (3 - 2 * x); },
          lookBoard = near(2, 0.8), lookDuck = near(4, 0.8),
          sl = Math.max(0, Math.min(1, (story - 5.5) / 0.4)), sleep = sl * sl * (3 - 2 * sl), awake = 1 - sleep,
          busy = (1 - lookBoard) * (1 - lookDuck) * awake;
        const ce = time - cheerAt,
          ck = ce < 1.8 ? Math.min(1, ce / 0.2) * Math.min(1, (1.8 - ce) / 0.3) : 0;
        const t = ((time % LOOP) + LOOP) % LOOP,
          P = p.pose,
          typing = t < TYPE,
          happy = t >= PASS && t < CLEAR,
          hk = Math.max(ck, happy ? Math.min(1, (t - PASS) / 0.25) * Math.min(1, (CLEAR - t) / 0.3) : 0) * awake;

        /* pantalla: cada línea crece mientras se teclea; el cursor va en la punta */
        let cur = [0, 0, 0],
          curOn = t < CLEAR && (typing ? true : sin(t * TAU * 2.5) > 0);
        LINES.forEach(([, ind, len], i) => {
          const k = Math.max(0, Math.min(1, (t - i * per) / (per * 0.85)));
          P['ln' + i] = t >= CLEAR || k <= 0.02 ? { show: 0 } : { scale: [1, 1, k] };
          if (t >= i * per) cur = [0, lineY(i) - 1.4, Z0 + ind + len * k + 0.04];
        });
        P.cursor = curOn ? { pos: cur } : { show: 0 };
        P.pass = happy ? { scale: [1, 1, Math.min(1, (t - PASS) / 0.2)] } : { show: 0 };

        /* cuerpo: respira; al celebrar se estira */
        P.body = { stretch: 1 + (0.02 + 0.02 * sleep) * sin(time * (2.2 - 1.1 * sleep)) + 0.07 * hk - 0.05 * sleep, rot: [0, 0, -3 + 3 * hk - 15 * sleep] };

        /* patas: teclean alternadas, con pequeñas pausas entre líneas; al celebrar suben */
        const lt = (t % per) / per,
          burst = typing && lt < 0.86 && ck <= 0 ? busy : 0,
          tap = ph => Math.pow(Math.max(0, sin(time * TAU * 5 + ph)), 2);
        P['arm-l'] = { rot: [0, 0, burst * 15 * tap(0) + hk * (62 + 8 * sin(time * 14)) - 6 * sleep] };
        P['arm-r'] = { rot: [0, 0, burst * 15 * tap(Math.PI) + hk * (34 + 8 * sin(time * 14 + 1)) - 6 * sleep] };

        /* cabeza: sigue la línea, asiente con el tecleo, y al terminar mira a cámara */
        const row = Math.min(LINES.length - 1, t / per);
        P.head = {
          rot: [
            3 * sin(time * 1.3) * awake + hk * 8 * sin(time * 9) + 14 * sleep,
            -10 - hk * 40 + (typing ? 5 * (lt - 0.5) * busy : 0) - 16 * lookBoard - 58 * lookDuck + 10 * sleep,
            (typing ? (-6 - row * 0.9) * busy - burst * 1.2 * tap(0.6) : -4 * busy) + hk * 12 + 24 * lookBoard - 10 * lookDuck - 34 * sleep
          ]
        };

        /* parpadeo y ojos felices */
        const blink = Math.max(bump((time % 2.9) - 2.6, 0.09), bump((time % 7.3) - 4.1, 0.09)),
          open = Math.max(0.08, Math.max(0.1, 1 - blink) * (1 - 0.65 * hk) * awake);
        P['eye-l'] = { scale: [1, open, 1] };
        P['eye-r'] = { scale: [1, open, 1] };

        /* orejas: un tic de vez en cuando */
        const flick = (period, off) => 22 * bump((time % period) - off, 0.12);
        P['ear-l'] = { rot: [-(flick(3.4, 1.2) + 10 * hk), 0, 0] };
        P['ear-r'] = { rot: [flick(4.7, 3.0) + 10 * hk, 0, 0] };

        /* cola: se mece despacio, y se agita cuando pasan las pruebas */
        /* (la fase se acumula: si la velocidad cambiara multiplicando el tiempo, la cola daría saltos) */
        tailPh += Math.min(0.05, Math.max(0, dt || 0)) * (0.9 + 2.4 * hk) * (1 - 0.7 * sleep);
        /* la noche: la luna cruza y baja; las tazas van apareciendo; el cubo termina resuelto */
        const mu = Math.max(0, Math.min(1, story / 5.2));
        P.moon = story > 5.7 || walls[1].hidden ? { show: 0 } : { pos: [1.75 * mu, 0.3 * sin(Math.PI * mu * 0.9) - 0.75 * mu * mu, 0] };
        CUPS.forEach(([, , , at], i) => {
          const k = Math.max(0, Math.min(1, (story - at) / 0.22));
          P['cup' + i] = k <= 0.01 ? { show: 0 } : { scale: k * (1 + 0.25 * sin(Math.PI * k)) };
        });
        /* ZzZ: salen de la cabeza, suben hacia un lado creciendo, y se deshacen; una tras otra */
        for (let i = 0; i < 3; i++) {
          const u = (((time / 2.7 + i / 3) % 1) + 1) % 1, out = Math.max(0, Math.min(1, (u - 0.8) / 0.2)), inn = Math.min(1, u / 0.12),
            k = sleep * inn * (1 - out * out) * (0.55 + 0.75 * u);
          P['zz' + i] = sleep < 0.5 || k < 0.03 ? { show: 0 }
            : { pos: [-0.25 * u + 0.06 * sin(u * 9 + i), -i * ZGAP - 0.35 + 1.25 * u, 0.25 * u + 0.06 * sin(u * 9 + i)], scale: k, rot: [0, 0, 10 * sin(u * 6 + i * 2)] };
        }
        P.cubeA = story < 4.6 ? {} : { show: 0 };
        P.cubeB = story < 4.6 ? { show: 0 } : { pos: [0, -6, 0] };
        P.tail = { bend: [0.13 * sin(tailPh) + 0.03 * sin(tailPh * 2), 0.04 * sin(tailPh * 0.6) + 0.1 * hk] };
      }
    });
    return W;
  }
});
