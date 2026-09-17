import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLocale, locales, ui, type Locale, type UIKey } from './ui';

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/** Resolve the locale from the `[...lang]` rest param (undefined → default). */
export function localeFromParam(lang: string | undefined): Locale {
  if (lang === undefined) return defaultLocale;
  if (isLocale(lang)) return lang;
  throw new Error(`Unknown locale segment: ${lang}`);
}

export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key];
  };
}

/** Prefix a site-relative path with the locale (default locale is unprefixed). */
export function localizePath(locale: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const withSlash = clean.endsWith('/') || /\/[^/]+\.[^/]+$/.test(clean) ? clean : `${clean}/`;
  return locale === defaultLocale ? withSlash : `/${locale}${withSlash}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'es' : 'en';
}

/** Static paths for `[...lang]` routes: `/` and `/es/`. */
export function localeStaticPaths() {
  return locales.map((locale) => ({
    params: { lang: locale === defaultLocale ? undefined : locale },
    props: { locale },
  }));
}

export async function getProjects(locale: Locale) {
  const all = await getCollection('projects', (e) => e.data.locale === locale);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getNotes(locale: Locale) {
  const all = await getCollection(
    'notes',
    (e) => e.data.locale === locale && (import.meta.env.DEV || !e.data.draft),
  );
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getExperience() {
  const all = await getCollection('experience');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getProfile() {
  const [entry] = await getCollection('profile');
  if (!entry) throw new Error('profile.yaml is missing');
  return entry;
}

export function formatDate(locale: Locale, date: Date, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...opts,
  }).format(date);
}

/** "2024-01" → "Jan 2024" / "ene 2024". */
export function formatMonth(locale: Locale, ym: string) {
  const [y, m] = ym.split('-').map(Number);
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'short',
  }).format(new Date(y!, m! - 1, 1));
}

export function readingMinutes(body: string | undefined) {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export type Project = CollectionEntry<'projects'>;
export type Note = CollectionEntry<'notes'>;
export type Experience = CollectionEntry<'experience'>;
export type Profile = CollectionEntry<'profile'>;
