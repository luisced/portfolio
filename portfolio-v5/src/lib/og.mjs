// The image a link to the site unfurls into: the room's first frame on the night ground, with the name set in the site's own type.
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { poster } from './room.mjs';

const font = (...p) => fs.readFileSync(path.join(process.cwd(), 'node_modules', ...p));
const el = (type, style, children) => ({ type, props: { style, children } });

export async function ogImage({ name, headline, site }) {
  const W = 1200, H = 630, { uri } = poster();
  /* the poster is small pixel art: enlarge it without smoothing so it stays crisp */
  const size = 610, big = await sharp(Buffer.from(uri.split(',')[1], 'base64')).resize(size, size, { kernel: 'nearest' }).png().toBuffer();
  const room = { type: 'img', props: { src: 'data:image/png;base64,' + big.toString('base64'), width: size, height: size, style: { position: 'absolute', right: -6, top: (H - size) / 2 + 14 } } };
  const svg = await satori(
    el('div', { width: W, height: H, display: 'flex', position: 'relative', backgroundColor: '#08060d', backgroundImage: 'radial-gradient(circle at 72% 55%, #1b1528 0%, #08060d 62%)', color: '#f4f1ea' }, [
      room,
      el('div', { position: 'absolute', left: 72, top: 70, bottom: 64, width: 540, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }, [
        el('div', { fontFamily: 'Azeret Mono', fontSize: 20, letterSpacing: 2, textTransform: 'uppercase', color: '#ffc46b' }, 'Portfolio'),
        el('div', { display: 'flex', flexDirection: 'column' }, [
          el('div', { fontFamily: 'Archivo', fontWeight: 800, fontSize: 100, lineHeight: 0.9, letterSpacing: -4, textTransform: 'uppercase' }, name),
          el('div', { marginTop: 26, fontFamily: 'Archivo', fontWeight: 700, fontSize: 34, lineHeight: 1.12, letterSpacing: -1, color: 'rgba(244,241,234,.78)' }, headline),
        ]),
        el('div', { fontFamily: 'Azeret Mono', fontSize: 20, letterSpacing: 1.5, color: 'rgba(244,241,234,.6)' }, site),
      ]),
    ]),
    { width: W, height: H, fonts: [
      { name: 'Archivo', weight: 800, style: 'normal', data: font('@fontsource', 'archivo', 'files', 'archivo-latin-800-normal.woff') },
      { name: 'Archivo', weight: 700, style: 'normal', data: font('@fontsource', 'archivo', 'files', 'archivo-latin-700-normal.woff') },
      { name: 'Azeret Mono', weight: 400, style: 'normal', data: font('@fontsource', 'azeret-mono', 'files', 'azeret-mono-latin-400-normal.woff') },
    ] },
  );
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}
