import { getCollection, type CollectionEntry } from 'astro:content';
import type { APIRoute } from 'astro';
import { renderOg } from '@/lib/og';

export const prerender = true;

interface Props {
  project: CollectionEntry<'projects'>;
}

export async function getStaticPaths() {
  const projects = await getCollection('projects', (entry) => entry.data.locale === 'en');
  return projects.map((project) => ({
    params: { slug: project.data.slug },
    props: { project },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { project } = props as Props;
  const png = await renderOg({
    title: project.data.title,
    subtitle: project.data.outcome,
    kicker: `${project.data.category} · ${project.data.timeframe}`,
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
