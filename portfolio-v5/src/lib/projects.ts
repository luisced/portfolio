import { getCollection, type CollectionEntry } from 'astro:content';

export type Locale = 'en' | 'es';
export type Project = CollectionEntry<'projects'>;

/** A locale's projects: professional work (current first), then student projects. */
export async function getProjects(locale: Locale): Promise<Project[]> {
  const all = await getCollection('projects', (p) => p.data.locale === locale);
  /* professional work first, then what was built as a student */
  return all.sort((a, b) => Number(a.data.student) - Number(b.data.student) || a.data.order - b.data.order);
}

/** Awards first, then research, then credentials. */
export async function getRecognition() {
  return (await getCollection('recognition')).sort((a, b) => a.data.order - b.data.order);
}

/** `/work/x/` in English, `/es/work/x/` in Spanish. */
export const localizePath = (locale: Locale, path: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}${locale === 'es' ? '/es' : ''}${path}`;
