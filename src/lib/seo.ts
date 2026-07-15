/**
 * SEO single source of truth — base URL, per-locale descriptions, target
 * keywords, hreflang helpers, and JSON-LD builders (Person, WebSite,
 * CreativeWork). Consumed by [locale]/layout.tsx, work/[slug]/page.tsx,
 * sitemap.ts, robots.ts, and manifest.ts so nothing drifts out of sync.
 */
import { SITE, socials, upwork, type Project } from '@/lib/data';
import { loc } from '@/lib/data';

export const BASE_URL = 'https://fandibayu.com';

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

export const DESCRIPTIONS = {
  en:
    'Fandi Bayu is a UI/UX Designer & Engineer from Jakarta, Indonesia with 4+ years of experience — designing SaaS dashboards, web apps, and design systems in Figma, then building them in production code (Vue, React, Tailwind CSS). Top Rated on Upwork with 2,000+ hours for 10+ international clients.',
  id: 'Fandi Bayu adalah UI/UX Designer & Engineer dari Jakarta, Indonesia dengan 4+ tahun pengalaman — mendesain dashboard SaaS, web app, dan design system di Figma, lalu membangunnya menjadi kode produksi (Vue, React, Tailwind CSS). Top Rated di Upwork dengan 2.000+ jam untuk 10+ klien internasional.',
} as const;

export const TITLE_DEFAULT = `${SITE.name} — UI/UX Designer & Engineer · SaaS Dashboard & Web Design`;

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
    description: DESCRIPTIONS.en,
    url: BASE_URL,
    image: `${BASE_URL}/profile.webp`,
    email: `mailto:${SITE.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jakarta',
      addressCountry: 'ID',
    },
    sameAs: [...socials.map((s) => s.url), upwork.url],
    knowsAbout: KEYWORDS.filter((k) => k !== 'Fandi Bayu'),
    worksFor: { '@type': 'Organization', name: 'Solusi247' },
    knowsLanguage: ['en', 'id'],
  };
}

/** WebSite — names the site and its languages; links back to the Person. */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: `${SITE.name} — UI/UX Designer & Engineer Portfolio`,
    url: BASE_URL,
    inLanguage: ['en', 'id'],
    author: { '@id': `${BASE_URL}/#person` },
  };
}

/** ProfilePage wrapper for the home page (Google's profile-page rich result type). */
export function profilePageJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    inLanguage: locale,
    mainEntity: { '@id': `${BASE_URL}/#person` },
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
