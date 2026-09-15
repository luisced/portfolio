// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

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
