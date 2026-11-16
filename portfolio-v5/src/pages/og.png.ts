// /og.png: the share image, drawn at build time.
import type { APIRoute } from 'astro';
import site from '../content/site.json';
import { ogImage } from '../lib/og.mjs';

export const GET: APIRoute = async () =>
  new Response(await ogImage({ name: site.shortName, headline: site.locales.en.headline, site: 'luiscedillo.com' }), { headers: { 'Content-Type': 'image/png' } });
