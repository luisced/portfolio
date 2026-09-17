import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const WIDTH = 1200;
const HEIGHT = 630;
// Satori uses static WOFF; the social card pairs the site's paper palette with its mono labels.
const monoBlack = readFileSync(
  resolve(process.cwd(), 'node_modules/@fontsource/azeret-mono/files/azeret-mono-latin-800-normal.woff'),
);
const mono = readFileSync(
  resolve(process.cwd(), 'node_modules/@fontsource/azeret-mono/files/azeret-mono-latin-400-normal.woff'),
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
  const INK = '#171717';
  const PAPER = '#f7f7f2';
  const BRAND = '#8f254c';
  const tree: OgNode = {
    type: 'div',
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        color: INK,
        fontFamily: 'Azeret Mono',
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
              { type: 'span', props: { children: 'LUIS CEDILLO' } },
              { type: 'span', props: { style: { color: BRAND }, children: 'ENGINEERING / PRODUCT' } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', flex: 1, padding: '44px 32px 32px' },
            children: [
              textNode(truncate(title, 56).toUpperCase(), {
                fontFamily: 'Azeret Mono',
                fontWeight: 800,
                maxWidth: 1136,
                maxHeight: 250,
                overflow: 'hidden',
                fontSize: 84,
                lineHeight: 0.95,
                letterSpacing: -4,
              }),
              textNode(truncate(subtitle, 150), {
                marginTop: 28,
                maxWidth: 1000,
                maxHeight: 84,
                overflow: 'hidden',
                color: '#55574e',
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
      { name: 'Azeret Mono', data: monoBlack, weight: 800, style: 'normal' },
      { name: 'Azeret Mono', data: mono, weight: 400, style: 'normal' },
    ],
  });
  // `.slice()` re-backs the bytes with a plain ArrayBuffer, which is what `Response` accepts.
  return new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng()).slice();
}
