import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getNotes, localeStaticPaths, localizePath, useTranslations } from '@/i18n/utils';
import type { Locale } from '@/i18n/ui';

export const getStaticPaths = localeStaticPaths;

interface Props {
  locale: Locale;
}

export const GET: APIRoute = async ({ props, site }) => {
  const { locale } = props as Props;
  const t = useTranslations(locale);
  const notes = await getNotes(locale);

  return rss({
    title: t('site.title'),
    description: t('site.description'),
    site: site!,
    items: notes.map((note) => ({
      title: note.data.title,
      pubDate: note.data.date,
      description: note.data.summary,
      link: localizePath(locale, `/notes/${note.data.slug}/`),
    })),
  });
};
