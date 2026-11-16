import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Projects: one MDX file per project per locale, named `{slug}.{locale}.mdx`, carried over from V4.
 * The glob loader would treat the frontmatter `slug` as the id and make the two locales collide,
 * so ids come from the filename. Current work (Dopamina, iLuk) has no cover screenshot.
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.mdx', generateId: ({ entry }) => entry.replace(/\.[^.]+$/, '') }),
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      locale: z.enum(['en', 'es']),
      title: z.string(),
      role: z.string(),
      category: z.enum(['ai', 'ios', 'web', 'backend']),
      timeframe: z.string(),
      /** Short form of the timeframe, for the chalkboard in the room. */
      when: z.string().optional(),
      /** One sentence a non-technical reader understands. Rendered first, everywhere. */
      outcome: z.string(),
      summary: z.string(),
      stack: z.array(z.string()).min(1),
      links: z.object({ live: z.url().optional(), repo: z.url().optional() }).default({}),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      featured: z.boolean().default(false),
      /** Built as a student (university labs, hackathons): kept as a case study, left off the chalkboard. */
      student: z.boolean().default(false),
      /** The product, when the title is the company. */
      product: z.string().optional(),
      order: z.number().int(),
    }),
});

const localized = z.object({ en: z.string(), es: z.string() });

/** Awards, published research and credentials: one YAML per entry, both locales inline. Carried over from V4's profile. */
const recognition = defineCollection({
  loader: glob({ base: './src/content/recognition', pattern: '**/*.yaml' }),
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      order: z.number().int(),
      kind: z.enum(['award', 'publication', 'credential']),
      title: localized,
      distinction: localized,
      context: localized,
      summary: localized,
      details: z.object({ en: z.array(z.string()), es: z.array(z.string()) }),
      links: z.array(z.object({ label: localized, url: z.url() })).min(1),
      media: z.array(z.object({ src: image(), alt: localized, caption: localized, source: z.url() })).default([]),
    }),
});

export const collections = { projects, recognition };
