import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;
// Satori embeds the same display/body family used by the site's technical labels.
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
  type: 'div' | 'span' | 'img';
  props: {
    style?: Record<string, string | number>;
    children?: string | OgNode | OgNode[];
    src?: string;
    width?: number;
    height?: number;
  };
};

function truncate(value: string, max: number) {
  const text = value.trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

function truncateWords(value: string, max: number) {
  const text = value.trim();
  if (text.length <= max) return text;
  const clipped = text.slice(0, max - 1).trimEnd();
  const boundary = clipped.lastIndexOf(' ');
  return `${(boundary > max * .65 ? clipped.slice(0, boundary) : clipped).trimEnd()}…`;
}

function textNode(
  text: string,
  style: Record<string, string | number>,
): OgNode {
  return { type: 'div', props: { style, children: text } };
}

export async function renderOg({ title, subtitle, kicker }: OgInput): Promise<Uint8Array<ArrayBuffer>> {
  const INK = '#0b0b0a';
  const PAPER = '#f6f5f0';
  const rawTitle = truncate(title, 48).toUpperCase();
  const words = rawTitle.split(' ');
  const displayTitle = rawTitle.includes(' / ')
    ? rawTitle.replace(' / ', ' /\n')
    : words.length === 2 && rawTitle.length > 9
      ? `${words[0]}\n${words[1]}`
      : rawTitle;
  const titleSize = rawTitle.length <= 16 ? 142 : rawTitle.length <= 28 ? 110 : 72;
  const motifPaths = Array.from({ length: 6 }, (_, index) => {
    const verticalX = 870 + index * 10;
    const turnRadius = 20 + index * 10;
    const upperY = 486 - turnRadius;
    const lowerY = 486 + turnRadius;
    const turnRight = 1090 + turnRadius;

    return `<path d="M${verticalX} -20V361Q${verticalX} ${upperY} 975 ${upperY}H1090Q${turnRight} ${upperY} ${turnRight} 486Q${turnRight} ${lowerY} 1090 ${lowerY}H-20"/>`;
  }).join('');
  const motif = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <g fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="square">
        ${motifPaths}
      </g>
    </svg>
  `)}`;

  const tree: OgNode = {
    type: 'div',
    props: {
      style: {
        position: 'relative',
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        overflow: 'hidden',
        color: INK,
        fontFamily: 'Azeret Mono',
        backgroundColor: PAPER,
        border: `1px solid ${INK}`,
      },
      children: [
        {
          type: 'img',
          props: {
            src: motif,
            width: WIDTH,
            height: HEIGHT,
            style: {
              position: 'absolute',
              inset: 0,
              width: WIDTH,
              height: HEIGHT,
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 38,
              left: 46,
              fontSize: 18,
              letterSpacing: 4,
              textTransform: 'uppercase',
            },
            children: 'LUIS CEDILLO / PORTFOLIO',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 83,
              left: 46,
              width: 812,
              borderTop: `4px solid ${INK}`,
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 38,
              left: 950,
              width: 204,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 16,
              letterSpacing: 2,
              textTransform: 'uppercase',
            },
            children: [
              { type: 'span', props: { children: 'MEXICO CITY' } },
              { type: 'span', props: { children: '2026' } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 83,
              left: 932,
              width: 222,
              borderTop: `4px solid ${INK}`,
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 128,
              left: 44,
              width: 810,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            },
            children: [
              textNode(displayTitle, {
                width: 800,
                maxHeight: 240,
                overflow: 'hidden',
                whiteSpace: 'pre-wrap',
                fontFamily: 'Azeret Mono',
                fontWeight: 800,
                fontSize: titleSize,
                lineHeight: .78,
                letterSpacing: -7,
              }),
              {
                type: 'div',
                props: {
                  style: {
                    width: 48,
                    marginTop: 24,
                    borderTop: `10px solid ${INK}`,
                  },
                },
              },
              textNode(truncateWords(subtitle, 90), {
                width: 790,
                maxHeight: 100,
                marginTop: 17,
                overflow: 'hidden',
                fontSize: 27,
                lineHeight: 1.35,
                letterSpacing: 1,
              }),
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              left: 46,
              right: 46,
              bottom: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 16,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            },
            children: [
              {
                type: 'span',
                props: { children: truncateWords(kicker, 58).toUpperCase() },
              },
              {
                type: 'span',
                props: {
                  style: { marginRight: 70, fontWeight: 800 },
                  children: 'LUISCEDILLO.COM',
                },
              },
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
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();
  return new Uint8Array(await sharp(png).png({
    compressionLevel: 9,
    palette: true,
    quality: 100,
    effort: 10,
  }).toBuffer()).slice();
}
