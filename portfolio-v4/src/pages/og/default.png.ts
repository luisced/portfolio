import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { renderOg } from '@/lib/og';

export const prerender = true;

export const GET: APIRoute = async () => {
  const [profile] = await getCollection('profile');
  if (!profile) throw new Error('profile.yaml is missing');

  const png = await renderOg({
    title: profile.data.shortName,
    subtitle: profile.data.positioning.en,
    kicker: profile.data.headline.en,
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
