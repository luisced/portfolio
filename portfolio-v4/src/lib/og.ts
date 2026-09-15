import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const WIDTH = 1200;
const HEIGHT = 630;
const archivoBlack = readFileSync(
  resolve(process.cwd(), 'node_modules/@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff'),
);
const archivoNarrow = readFileSync(
  resolve(process.cwd(), 'node_modules/@fontsource/archivo-narrow/files/archivo-narrow-latin-400-normal.woff'),
);

export interface OgInput {
  title: string;
  subtitle: string;
  kicker: string;
}

type OgNode = {
  type: 'div' | 'span';
  props: {
    style?: Record<string, string | number>;
    children?: string | OgNode | OgNode[];
  };
};

function truncate(value: string, max: number) {
  const text = value.trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

function textNode(
  text: string,
  style: Record<string, string | number>,
): OgNode {
  return { type: 'div', props: { style, children: text } };
}

export async function renderOg({ title, subtitle, kicker }: OgInput): Promise<Uint8Array<ArrayBuffer>> {
  // Blueprint sheet: deep blue-black, white hairline frame, uppercase Archivo Black. Flat fills only.
  const INK = '#f5f5f8';
  const PAPER = '#12162a';
  const BRAND = '#4fe39a';
  const tree: OgNode = {
    type: 'div',
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        color: INK,
        fontFamily: 'Archivo Narrow',
        backgroundColor: PAPER,
        border: `2px solid ${INK}`,
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '18px 32px',
              borderBottom: `2px solid ${INK}`,
              fontSize: 22,
              letterSpacing: 2,
              textTransform: 'uppercase',
            },
            children: [
              { type: 'span', props: { children: 'LUIS CEDILLO — THE BENCH' } },
              { type: 'span', props: { style: { color: BRAND }, children: 'SHEET 1 / REV 4.0' } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', flex: 1, padding: '44px 32px 32px' },
            children: [
              textNode(truncate(title, 56).toUpperCase(), {
                fontFamily: 'Archivo Black',
                maxWidth: 1136,
                maxHeight: 250,
                overflow: 'hidden',
                fontSize: 104,
                lineHeight: 0.9,
                letterSpacing: -4,
              }),
              textNode(truncate(subtitle, 150), {
                marginTop: 28,
                maxWidth: 1000,
                maxHeight: 84,
                overflow: 'hidden',
                color: '#b9bdd0',
                fontSize: 32,
                lineHeight: 1.25,
              }),
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              padding: '16px 32px',
              borderTop: `2px solid ${INK}`,
              fontSize: 22,
              letterSpacing: 2,
              textTransform: 'uppercase',
            },
            children: [
              textNode(truncate(kicker, 90).toUpperCase(), { color: BRAND }),
              { type: 'span', props: { children: 'LUISCEDILLO.COM' } },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Archivo Black', data: archivoBlack, weight: 400, style: 'normal' },
      { name: 'Archivo Narrow', data: archivoNarrow, weight: 400, style: 'normal' },
    ],
  });
  // `.slice()` re-backs the bytes with a plain ArrayBuffer, which is what `Response` accepts.
  return new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng()).slice();
}
