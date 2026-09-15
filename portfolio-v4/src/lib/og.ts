import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const WIDTH = 1200;
const HEIGHT = 630;
// IBM Plex Sans ships only WOFF2 in the available package; use Instrument Serif for both faces.
const instrumentSerif = readFileSync(
  resolve(
    process.cwd(),
    'node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff',
  ),
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
  const tree: OgNode = {
    type: 'div',
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        padding: '54px 64px 48px',
        color: '#f7f3eb',
        fontFamily: 'Instrument Serif',
        backgroundColor: '#211f1b',
        // Flat fills only: a radial glow here quadruples the PNG size past the 80 KB budget.
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 64px), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 64px)',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              color: '#cfc8bc',
              fontSize: 20,
              letterSpacing: 1.5,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: '#f0c674',
                  },
                },
              },
              { type: 'span', props: { children: 'luis.cedillo' } },
            ],
          },
        },
        textNode(truncate(title, 70), {
          marginTop: 86,
          maxWidth: 1072,
          maxHeight: 158,
          overflow: 'hidden',
          fontSize: 72,
          lineHeight: 1.06,
          letterSpacing: -1,
        }),
        textNode(truncate(subtitle, 140), {
          marginTop: 24,
          maxWidth: 1030,
          maxHeight: 76,
          overflow: 'hidden',
          color: '#cfc8bc',
          fontSize: 30,
          lineHeight: 1.2,
        }),
        {
          type: 'div',
          props: { style: { flex: 1 } },
        },
        textNode(truncate(kicker, 100), {
          color: '#f0c674',
          fontSize: 20,
          lineHeight: 1.2,
          letterSpacing: 1,
        }),
      ],
    },
  };

  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    fonts: [{ name: 'Instrument Serif', data: instrumentSerif, weight: 400, style: 'normal' }],
  });
  // `.slice()` re-backs the bytes with a plain ArrayBuffer, which is what `Response` accepts.
  return new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng()).slice();
}
