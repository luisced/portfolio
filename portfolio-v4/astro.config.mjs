// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

/** Notes carry a real publication date; expose it as sitemap <lastmod>. Other pages have none. */
const noteDates = Object.fromEntries(
  readdirSync('src/content/notes')
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const fm = readFileSync(`src/content/notes/${f}`, 'utf8');
      const slug = fm.match(/^slug:\s*(.+)$/m)?.[1]?.trim();
      const date = fm.match(/^date:\s*(.+)$/m)?.[1]?.trim();
      return [slug, date];
    })
    .filter(([slug, date]) => slug && date),
);

export default defineConfig({
  site: 'https://luiscedillo.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', es: 'es' },
      },
      serialize(item) {
        const slug = item.url.match(/\/notes\/([^/]+)\/$/)?.[1];
        if (slug && noteDates[slug]) item.lastmod = new Date(noteDates[slug]).toISOString();
        return item;
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  image: {
    // Every raster goes through astro:assets; formats chosen per <Picture>.
    responsiveStyles: true,
  },
  build: {
    // ~10 KB gz of CSS per page: inlining removes two render-blocking requests.
    inlineStylesheets: 'always',
  },
});
