import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const locale = z.enum(['en', 'es']);
const localized = z.object({ en: z.string(), es: z.string() });
const localizedList = z.object({ en: z.array(z.string()), es: z.array(z.string()) });

/**
 * The glob loader treats a frontmatter `slug` as the entry id, which would make
 * `x.en.mdx` and `x.es.mdx` collide. Derive ids from the filename instead.
 */
const idFromFile = ({ entry }: { entry: string }) => entry.replace(/\.[^.]+$/, '');

/**
 * Projects: one MDX file per project per locale, named `{slug}.{locale}.mdx`.
 * Frontmatter that must be identical across locales lives in `shared`
 * (checked by scripts/check-i18n.mjs).
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.mdx', generateId: idFromFile }),
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      locale,
      title: z.string(),
      role: z.string(),
      category: z.enum(['ios', 'web', 'backend']),
      timeframe: z.string(),
      /** One sentence a non-technical reader understands. Rendered first, everywhere. */
      outcome: z.string(),
      summary: z.string(),
      stack: z.array(z.string()).min(1),
      links: z
        .object({
          live: z.url().optional(),
          repo: z.url().optional(),
        })
        .default({}),
      cover: image(),
      coverAlt: z.string(),
      gallery: z
        .array(z.object({ src: image(), alt: z.string() }))
        .default([]),
      featured: z.boolean().default(false),
      order: z.number().int(),
    }),
});

/** Experience: one YAML per role, both locales inline. */
const experience = defineCollection({
  loader: glob({ base: './src/content/experience', pattern: '**/*.yaml' }),
  schema: z.object({
    org: z.string(),
    role: localized,
    start: z.string().regex(/^\d{4}-\d{2}$/),
    end: z.string().regex(/^\d{4}-\d{2}$/).nullable(),
    location: z.string(),
    highlights: localizedList,
    links: z.array(z.object({ label: localized, url: z.url() })).default([]),
    tags: z.array(z.string()),
    /** Token name from tokens.css (e.g. "brand", "amber", "rose"); never a hex. */
    accent: z.enum(['brand', 'amber', 'rose', 'sky', 'violet']),
    order: z.number().int(),
  }),
});

/** Notes: writing. `{slug}.{locale}.mdx`. */
const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.mdx', generateId: idFromFile }),
  schema: z.object({
    slug: z.string(),
    locale,
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/** Profile: a single YAML entry (`profile.yaml`). */
const profile = defineCollection({
  loader: glob({ base: './src/content/profile', pattern: 'profile.yaml' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      shortName: z.string(),
      headline: localized,
      positioning: localized,
      bio: localized,
      portrait: image(),
      portraitAlt: localized,
      location: z.string(),
      timezone: z.string(),
      email: z.email(),
      whatsapp: z.string(),
      availability: localized,
      socials: z.array(
        z.object({
          id: z.enum(['github', 'linkedin', 'instagram']),
          label: z.string(),
          handle: z.string(),
          url: z.url(),
        }),
      ),
      skills: z.array(
        z.object({
          group: localized,
          items: z.array(
            z.object({
              name: z.string(),
              /** Project slugs proving the skill. */
              evidence: z.array(z.string()).default([]),
            }),
          ),
        }),
      ),
      education: z.array(
        z.object({
          institution: z.string(),
          credential: localized,
          year: z.string(),
        }),
      ),
      academicActivities: localizedList,
      recognition: z.array(
        z.object({
          kind: z.enum(['award', 'publication', 'credential']),
          title: localized,
          distinction: localized,
          context: localized,
          summary: localized,
          details: localizedList,
          links: z.array(z.object({ label: localized, url: z.url() })).min(1),
          media: z.array(z.object({
            src: image(),
            alt: localized,
            caption: localized,
            source: z.url(),
          })).default([]),
        }),
      ),
      languages: z.array(z.object({ name: localized, level: localized })),
      manifesto: localized,
      cv: z.string(),
    }),
});

export const collections = { projects, experience, notes, profile };
