import { SITE, experience, fiverr, projects, socials, upwork } from '@/lib/data';
import { BASE_URL, BIO, localePath } from '@/lib/seo';

/**
 * /llms.txt: a plain-text, fact-only summary for AI assistants.
 *
 * Honest status: llms.txt is a community proposal, not a ranking factor, and
 * Google doesn't use it. Its real use is when someone asks ChatGPT/Claude/
 * Perplexity to read this site: they get the facts in one clean file instead
 * of parsing an animated page. Built from lib/data.ts so it never drifts.
 */
export const dynamic = 'force-static';

export function GET() {
  const roles = experience.flatMap((e) =>
    e.roles.map((r) => `- ${e.company}, ${r.title} (${r.period.en}): ${r.achievement?.en ?? r.description.en}`),
  );
  const work = projects.map(
    (p) => `- [${p.title}](${localePath('en', `/work/${p.slug}`)}): ${(p.impact ?? p.summary).en}`,
  );
  const links = [
    `- Website: ${BASE_URL} (English), ${localePath('id')} (Bahasa Indonesia)`,
    ...socials.map((s) => `- ${s.label}: ${s.url}`),
    `- Upwork: ${upwork.url}`,
    `- Fiverr: ${fiverr.url}`,
    `- Contact form: ${BASE_URL}/#contact`,
    `- Resume (PDF): ${BASE_URL}${SITE.resume.en}`,
  ];

  const body = [
    `# ${SITE.name}`,
    '',
    `> ${BIO.en}`,
    '',
    '## Key facts',
    '- Role: UI/UX Designer & Engineer. Designs in Figma and builds the front end in Vue, React and Tailwind CSS.',
    '- Based in Jakarta, Indonesia. Works remotely with international clients.',
    '- Experience: 4+ years designing and shipping products.',
    `- Upwork: ${upwork.status}, ${upwork.hours} hours, ${upwork.clients} international clients.`,
    '- Languages: English, Indonesian.',
    '- Open to: new roles and freelance projects.',
    '',
    '## Experience',
    ...roles,
    '',
    '## Projects',
    ...work,
    '',
    '## Links',
    ...links,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
