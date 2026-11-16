// /es/og.png: la imagen para compartir, en español.
import type { APIRoute } from 'astro';
import site from '../../content/site.json';
import { ogImage } from '../../lib/og.mjs';

export const GET: APIRoute = async () =>
  new Response(await ogImage({ name: site.shortName, headline: site.locales.es.headline, site: 'luiscedillo.com' }), { headers: { 'Content-Type': 'image/png' } });
