import { getCollection, type CollectionEntry } from 'astro:content';
import type { APIRoute } from 'astro';
import { renderOg } from '@/lib/og';

export const prerender = true;

interface Props {
  note: CollectionEntry<'notes'>;
}

export async function getStaticPaths() {
  const notes = await getCollection('notes', (entry) => entry.data.locale === 'en');
  return notes.map((note) => ({
    params: { slug: note.data.slug },
    props: { note },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { note } = props as Props;
  const date = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(note.data.date);
  const tags = note.data.tags.join(' · ');

  const png = await renderOg({
    title: note.data.title,
    subtitle: note.data.summary,
    kicker: tags ? `${date} · ${tags}` : date,
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
