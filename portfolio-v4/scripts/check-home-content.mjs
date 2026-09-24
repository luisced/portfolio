import { readFileSync } from 'node:fs';

const pages = {
  en: readFileSync('dist/index.html', 'utf8'),
  es: readFileSync('dist/es/index.html', 'utf8'),
};

const expected = {
  en: {
    headline: 'Co-Founder &amp; CTO · AI Systems · Product Engineering',
    positioning: 'I turn conversations into reliable AI workflows, from marketing execution to financial operations.',
    contact: 'Building an AI product, untangling a complex system, or looking for a technical co-founder? Tell me what you have in mind.',
  },
  es: {
    headline: 'Cofundador y CTO · Sistemas de IA · Ingeniería de producto',
    positioning: 'Convierto conversaciones en flujos de IA confiables, desde la ejecución de marketing hasta las operaciones financieras.',
    contact: '¿Estás construyendo un producto de IA, resolviendo un sistema complejo o buscando un cofundador técnico? Cuéntame qué tienes en mente.',
  },
};

const failures = [];

function expectIncludes(locale, value, label) {
  if (!pages[locale].includes(value)) failures.push(`${locale}: missing ${label}`);
}

for (const [locale, copy] of Object.entries(expected)) {
  expectIncludes(locale, copy.headline, 'reordered professional headline');
  expectIncludes(locale, copy.positioning, 'specific hero positioning');
  expectIncludes(locale, copy.contact, 'specific contact invitation');

  const careerLinks = [...pages[locale].matchAll(/data-career-link href="([^"]+)"/g)].map((match) => match[1]);
  const experienceCards = [...pages[locale].matchAll(/data-experience-card/g)];
  if (careerLinks.length !== 9) failures.push(`${locale}: expected 9 career-map links, found ${careerLinks.length}`);
  if (experienceCards.length !== careerLinks.length) {
    failures.push(`${locale}: career-map links (${careerLinks.length}) and experience cards (${experienceCards.length}) differ`);
  }
  for (const href of careerLinks) {
    if (!pages[locale].includes(`id="${href.slice(1)}"`)) failures.push(`${locale}: career-map target ${href} is missing`);
  }
}

const projectNumbers = [
  ['project-stackup-channel-manager', '[02] / Flowlink'],
  ['project-upocket', '[03] / UPocket'],
  ['project-dermaware-genesis', '[04] / Dermaware'],
];
for (const locale of Object.keys(pages)) {
  for (const [id, label] of projectNumbers) {
    const start = pages[locale].indexOf(`id="${id}"`);
    const excerpt = start < 0 ? '' : pages[locale].slice(start, start + 1400);
    if (!excerpt.includes(label)) failures.push(`${locale}: ${id} is not numbered ${label.slice(0, 4)}`);
  }
}

if (failures.length) {
  console.error(`check-home-content failed:\n${failures.map((failure) => `  ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log('check-home-content: ok');
