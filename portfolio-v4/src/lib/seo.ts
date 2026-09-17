/**
 * JSON-LD builders. Every object describes visible, accurate page content only:
 * no types added merely to chase rich results (web-quality-skills/seo).
 */
import type { Locale } from '@/i18n/ui';
import { localizePath, type Note, type Profile, type Project } from '@/i18n/utils';

export type JsonLd = Record<string, unknown>;

const SITE = 'https://luiscedillo.com';
const abs = (path: string) => new URL(path, SITE).href;
const inLanguage = (locale: Locale) => (locale === 'es' ? 'es-MX' : 'en-US');

export function personId() {
  return `${SITE}/#person`;
}

export function person(profile: Profile, locale: Locale): JsonLd {
  const p = profile.data;
  return {
    '@type': 'Person',
    '@id': personId(),
    name: p.name,
    alternateName: p.shortName,
    jobTitle: p.headline[locale],
    description: p.positioning[locale],
    url: abs(localizePath(locale, '/')),
    image: abs('/og/default.png'),
    email: `mailto:${p.email}`,
    address: { '@type': 'PostalAddress', addressLocality: p.location, addressCountry: 'MX' },
    sameAs: p.socials.map((s) => s.url),
    knowsLanguage: p.languages.map((l) => l.name.en),
    affiliation: p.education
      .filter((e) => e.institution === 'Universidad Panamericana')
      .map((e) => ({ '@type': 'CollegeOrUniversity', name: e.institution })),
  };
}

export function website(profile: Profile, locale: Locale): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: abs(localizePath(locale, '/')),
    name: profile.data.shortName,
    inLanguage: inLanguage(locale),
    author: { '@id': personId() },
  };
}

export function projectWork(project: Project, locale: Locale): JsonLd {
  const d = project.data;
  return {
    '@type': 'CreativeWork',
    '@id': abs(localizePath(locale, `/work/${d.slug}/`)),
    url: abs(localizePath(locale, `/work/${d.slug}/`)),
    name: d.title,
    headline: d.title,
    description: d.outcome,
    abstract: d.summary,
    inLanguage: inLanguage(locale),
    image: abs(`/og/work/${d.slug}.png`),
    keywords: d.stack.join(', '),
    genre: d.category,
    temporalCoverage: d.timeframe,
    author: { '@id': personId() },
    creator: { '@id': personId() },
    ...(d.links.live ? { sameAs: [d.links.live, d.links.repo].filter(Boolean) } : d.links.repo ? { sameAs: [d.links.repo] } : {}),
  };
}

export function blogPosting(note: Note, locale: Locale, wordCount: number): JsonLd {
  const d = note.data;
  const url = abs(localizePath(locale, `/notes/${d.slug}/`));
  return {
    '@type': 'BlogPosting',
    '@id': url,
    url,
    mainEntityOfPage: url,
    headline: d.title,
    description: d.summary,
    datePublished: d.date.toISOString(),
    dateModified: d.date.toISOString(),
    inLanguage: inLanguage(locale),
    image: abs(`/og/notes/${d.slug}.png`),
    keywords: d.tags.join(', '),
    wordCount,
    author: { '@id': personId() },
    publisher: { '@id': personId() },
  };
}

export function breadcrumbs(locale: Locale, trail: Array<{ name: string; path: string }>): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: abs(localizePath(locale, t.path)),
    })),
  };
}

/** Wrap the page's entities in one @graph so the Person @id is shared. */
export function graph(...items: JsonLd[]): JsonLd {
  return { '@context': 'https://schema.org', '@graph': items };
}
