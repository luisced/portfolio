// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://luiscedillo.com',
  output: 'static',
  trailingSlash: 'always',
  server: { port: 4325 },
  integrations: [mdx(), sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } }, filter: (page) => !page.endsWith('/404/') })],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  build: {
    // One small stylesheet: inlining it removes a render-blocking request.
    inlineStylesheets: 'always',
  },
});
