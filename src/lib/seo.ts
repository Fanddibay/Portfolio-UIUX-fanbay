/**
 * SEO single source of truth — base URL, per-locale descriptions, target
 * keywords, hreflang helpers, and JSON-LD builders (Person, WebSite,
 * CreativeWork). Consumed by [locale]/layout.tsx, work/[slug]/page.tsx,
 * sitemap.ts, robots.ts, and manifest.ts so nothing drifts out of sync.
 */
import { SITE, socials, upwork, experience, projects, type Project } from '@/lib/data';
import { loc } from '@/lib/data';

export const BASE_URL = 'https://fandibayu.com';

/**
 * Last real content update (ISO date). Feeds sitemap <lastmod> and
 * ProfilePage.dateModified. Bump it when copy/projects change: a lastmod that
 * moves on every build without content changes teaches Google to ignore it.
 */
export const CONTENT_UPDATED = '2026-11-23';

/** `en` is unprefixed (localePrefix: 'as-needed'); `id` lives under /id. */
export function localePath(locale: string, path = ''): string {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return `${BASE_URL}${prefix}${path}` || BASE_URL;
}

/** hreflang map for a given sub-path — used in metadata + sitemap. */
export function languageAlternates(path = '') {
  return {
    en: localePath('en', path),
    id: localePath('id', path),
    'x-default': localePath('en', path),
  };
}

/** The queries Fandi wants to be found for — used in meta keywords + JSON-LD knowsAbout. */
export const KEYWORDS = [
  'UI/UX Designer',
  'UI/UX Engineer',
  'Senior UI/UX Designer',
  'Senior UI/UX Engineer',
  'Web Designer',
  'Dashboard Designer',
  'SaaS Designer',
  'SaaS Dashboard Design',
  'Product Designer',
  'Design Engineer',
  'Figma Designer',
  'Design System',
  'UI/UX Designer Indonesia',
  'UI/UX Designer Jakarta',
  'Freelance UI/UX Designer',
  'Fandi Bayu',
];

/** Meta descriptions: ≤160 characters so Google shows them whole. */
export const DESCRIPTIONS = {
  en: 'UI/UX Designer & Engineer in Jakarta. 4+ years designing SaaS dashboards and web apps in Figma, then building them in Vue and React. Top Rated on Upwork.',
  id: 'UI/UX Designer & Engineer di Jakarta. 4+ tahun mendesain dashboard SaaS dan web app di Figma, lalu membangunnya dengan Vue dan React. Top Rated di Upwork.',
} as const;

/**
 * Longer, fact-dense bio for structured data and llms.txt. AI answer engines
 * quote passages like this, so it states who, where, what, and proof points.
 */
export const BIO = {
  en: 'Fandi Bayu is a UI/UX Designer & Engineer from Jakarta, Indonesia with 4+ years of experience designing SaaS dashboards, web apps, and design systems in Figma, then building them in production code (Vue, React, Tailwind CSS). Top Rated on Upwork with 2,400+ hours for 13 international clients.',
  id: 'Fandi Bayu adalah UI/UX Designer & Engineer dari Jakarta, Indonesia dengan 4+ tahun pengalaman mendesain dashboard SaaS, web app, dan design system di Figma, lalu membangunnya menjadi kode produksi (Vue, React, Tailwind CSS). Top Rated di Upwork dengan 2.400+ jam untuk 13 klien mancanegara.',
} as const;

/** ≤60 characters so the full title shows in search results. */
export const TITLE_DEFAULT = `${SITE.name} | UI/UX Designer & Engineer for SaaS Dashboards`;

/* ------------------------------------------------------------------ */
/* JSON-LD builders                                                    */
/* ------------------------------------------------------------------ */

/**
 * Person — the core entity for both Google and AI answer engines. Kept
 * consistent with visible page content (name, role, skills, socials) so
 * crawlers can ground and cite it.
 */
export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/#person`,
    name: 'Fandi Bayu Anggoro Sakti',
    alternateName: SITE.name,
    jobTitle: 'UI/UX Designer & UI/UX Engineer',
    description: BIO.en,
    url: BASE_URL,
    image: `${BASE_URL}/profile.webp`,
    email: `mailto:${SITE.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jakarta',
      addressCountry: 'ID',
    },
    sameAs: [...socials.map((s) => s.url), upwork.url],
    // Target keywords + every skill shown in the Experience timeline (deduped),
    // so the entity data matches the visible "Skills & tools" chips.
    knowsAbout: [
      ...new Set([
        ...KEYWORDS.filter((k) => k !== 'Fandi Bayu'),
        ...experience.flatMap((e) => e.roles.flatMap((r) => r.skills ?? [])),
      ]),
    ],
    // Current (ongoing) engagements — mirrors the live roles in the timeline.
    worksFor: [
      { '@type': 'Organization', name: 'Amanahfy' },
      { '@type': 'Organization', name: 'Solusi247' },
    ],
    knowsLanguage: ['en', 'id'],
  };
}

/** WebSite — names the site and its languages; links back to the Person. */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: `${SITE.name} | UI/UX Designer & Engineer Portfolio`,
    url: BASE_URL,
    inLanguage: ['en', 'id'],
    author: { '@id': `${BASE_URL}/#person` },
  };
}

/**
 * Home page only (not the layout): ProfilePage marks the page as Fandi's
 * profile, and an ItemList of the projects lets search and AI engines read the
 * portfolio as data (name, type, URL) instead of guessing from the UI. One
 * @graph so the references resolve inside the same block.
 */
export function homeJsonLd(locale: string) {
  const url = localePath(locale);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${url}#profilepage`,
        url,
        name: TITLE_DEFAULT,
        description: locale === 'id' ? DESCRIPTIONS.id : DESCRIPTIONS.en,
        inLanguage: locale,
        dateModified: CONTENT_UPDATED,
        isPartOf: { '@id': `${BASE_URL}/#website` },
        mainEntity: { '@id': `${BASE_URL}/#person` },
        hasPart: { '@id': `${url}#projects` },
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#projects`,
        name: locale === 'id' ? 'Proyek pilihan' : 'Selected projects',
        numberOfItems: projects.length,
        itemListElement: projects.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: localePath(locale, `/work/${p.slug}`),
          name: p.title,
          description: loc(p.impact ?? p.summary, locale),
        })),
      },
    ],
  };
}

/** CreativeWork for a case study page — grounds project citations. */
export function projectJsonLd(project: Project, locale: string) {
  // Link a live product to its public site(s) so search/AI associate this
  // case study with the real, visitable URL.
  const liveUrls =
    project.externalLinks?.map((l) => l.url) ??
    (project.externalUrl ? [project.externalUrl] : []);

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: loc(project.summary, locale),
    url: localePath(locale, `/work/${project.slug}`),
    image: `${BASE_URL}${project.image}`,
    inLanguage: locale,
    dateCreated: project.year.slice(0, 4),
    keywords: [project.category, ...project.tags].join(', '),
    author: { '@id': `${BASE_URL}/#person` },
    ...(liveUrls.length > 0 && { sameAs: liveUrls }),
  };
}

/** BreadcrumbList: Home → Work → project. */
export function breadcrumbJsonLd(project: Project, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: localePath(locale) },
      { '@type': 'ListItem', position: 2, name: 'Work', item: `${localePath(locale)}#work` },
      { '@type': 'ListItem', position: 3, name: project.title },
    ],
  };
}

/** Serialize JSON-LD for a <script> tag (escape < to prevent tag injection). */
export function jsonLdString(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
