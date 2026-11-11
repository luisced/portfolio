import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const pages = {
  en: readFileSync('dist/index.html', 'utf8'),
  es: readFileSync('dist/es/index.html', 'utf8'),
};

const expected = {
  en: {
    headline: 'AI Full-Stack Engineer &amp; Technical Founder',
    positioning: 'I build AI products across web, mobile, APIs and cloud, from marketing execution to financial operations.',
    contact: 'Building an AI product, untangling a complex system, or looking for a technical co-founder? Tell me what you have in mind.',
  },
  es: {
    headline: 'Ingeniero full-stack de IA y fundador técnico',
    positioning: 'Construyo productos de IA para web, móvil, APIs y nube, desde la ejecución de marketing hasta las operaciones financieras.',
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
  ['project-dopamina', '[00] / Dopamina'],
  ['project-iluk', '[01] / iLuk'],
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


const approvedPdfSha256 = '000922c58fad9fa4af027944a8c5a7fb951a1e0715a1aecea103238351341ff7';
for (const path of ['public/cv/Luis-Cedillo-Maldonado-CV.pdf', 'dist/cv/Luis-Cedillo-Maldonado-CV.pdf', 'public/resumee.pdf', 'dist/resumee.pdf']) {
  if (!existsSync(path)) {
    failures.push(`${path}: missing approved resume PDF`);
    continue;
  }
  const hash = createHash('sha256').update(readFileSync(path)).digest('hex');
  if (hash !== approvedPdfSha256) failures.push(`${path}: approved PDF SHA-256 mismatch`);
}
for (const locale of Object.keys(pages)) {
  const html = pages[locale];
  for (const skill of ['React', 'Next.js', 'React Native', 'TypeScript', 'JavaScript', 'Swift / SwiftUI', 'LangGraph', 'LangChain / Deep Agents', 'LiteLLM', 'MCP', 'Composio', 'ElevenLabs', 'FastAPI', 'Strawberry GraphQL', 'PostgreSQL', 'Redis', 'AWS', 'GCP', 'Docker', 'Kubernetes', 'Langfuse', 'OpenTelemetry', 'pytest', 'GitHub Actions']) {
    expectIncludes(locale, `>${skill}</`, `rendered skill ${skill}`);
  }
  expectIncludes(locale, locale === 'en' ? 'B.Sc. Data Intelligence &amp; Cybersecurity · Completed 2026' : 'Ing. en Inteligencia de Datos y Ciberseguridad · Concluida en 2026', 'completed degree');
  expectIncludes(locale, '2022–2026', 'degree years');
  expectIncludes(locale, locale === 'en' ? 'Specialization in Project Management · In progress' : 'Especialización en Gestión de Proyectos · En curso', 'specialization');
  if (html.includes('2022–2027')) failures.push(`${locale}: stale degree years`);
  const cvLink = html.match(/<a\b[^>]*href="\/resumee\.pdf"[^>]*>/)?.[0] || '';
  if (!cvLink || /\bdownload(?:\s|=|>)/.test(cvLink)) failures.push(`${locale}: CV must open inline, not force a download`);
  if (!cvLink.includes('target="_blank"') || !cvLink.includes('rel="noopener"')) failures.push(`${locale}: CV must open in a safe new tab`);
  expectIncludes(locale, locale === 'en' ? 'View CV · PDF' : 'Ver CV · PDF', 'PDF viewer label');
  expectIncludes(locale, `<title>Luis Cedillo | ${expected[locale].headline}</title>`, 'SEO title');
  const projectIds = [...html.matchAll(/id="(project-[^"]+)"/g)].map(m => m[1]);
  if (projectIds.join(',') !== 'project-dopamina,project-iluk,project-stackup-channel-manager,project-upocket,project-dermaware-genesis') failures.push(`${locale}: project sequence changed`);
  const expectedCareerIds = ['00-dopamina', '00-iluk', '00-iluk-engineering', '00-vyvo', '01-universidad-panamericana', '02-nyx-technology', '03-universidad-panamericana-ios-lab', '04-freelance-developer', '05-zenco'];
  const careerIds = [...html.matchAll(/data-career-link href="#experience-([^"]+)"/g)].map(m => m[1]);
  if (careerIds.join(',') !== expectedCareerIds.join(',')) failures.push(`${locale}: career sequence changed`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  if (new Set(ids).size !== ids.length) failures.push(`${locale}: duplicate IDs`);
  const cards = [...html.matchAll(/<li\b[^>]*data-experience-card[^>]*>[\s\S]*?<\/article>\s*<\/li>/g)].map(m => m[0]);
  if (cards.length !== 9) failures.push(`${locale}: expected nine parsed cards`);
  const roleFacts = locale === 'en' ? {
    '00-dopamina': ['Jul 2026', '15-person', 'about 20 businesses', '1,000+ publications', '10,000 leads generated and managed over two months', 'Ergo', 'tenant-scoped access', 'human approval'],
    '00-iluk': ['May 2026', '25-person', 'Kubernetes', 'client Fincluyente', '100,000+ WhatsApp messages', '200+ AI employees', 'ElevenLabs for collections and customer service'],
    '00-iluk-engineering': ['Dec 2025', 'May 2026'],
    '00-vyvo': ['Jun 2025', 'Dec 2025', '15-person', 'AI-avatar', 'LangGraph and ElevenLabs'],
    '02-nyx-technology': ['Aug 2024', 'May 2025', '10 people', '50 hotels', 'three days to under one hour'],
  } : {
    '00-dopamina': ['jul 2026', '15 personas', '20 empresas', '1,000 publicaciones', '10,000 leads generados y gestionados en dos meses', 'Ergo', 'tenant', 'aprobación humana'],
    '00-iluk': ['may 2026', '25 personas', 'Kubernetes', 'cliente Fincluyente', '100,000 mensajes', '200 empleados de IA', 'ElevenLabs para cobranza y atención al cliente'],
    '00-iluk-engineering': ['dic 2025', 'may 2026'],
    '00-vyvo': ['jun 2025', 'dic 2025', '15 personas', 'avatares de IA', 'LangGraph y ElevenLabs'],
    '02-nyx-technology': ['ago 2024', 'may 2025', '10 personas', '50 hoteles', 'tres días a menos de una hora'],
  };
  for (const [id, facts] of Object.entries(roleFacts)) {
    const card = cards.find(card => card.includes(`id="experience-${id}"`)) || '';
    for (const fact of facts) if (!card.includes(fact)) failures.push(`${locale}: ${id} missing ${fact}`);
  }
  for (const card of cards) {
    if (!card.includes('Mexico City, Mexico')) failures.push(`${locale}: card missing work location`);
  }
}

const headers = readFileSync('dist/_headers', 'utf8');
if (!/\/resumee\.pdf\s*\n\s*Content-Type: application\/pdf\s*\n\s*Content-Disposition: inline/.test(headers)) failures.push('short PDF path must use inline PDF response headers');

if (failures.length) {
  console.error(`check-home-content failed:\n${failures.map((failure) => `  ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log('check-home-content: ok');
