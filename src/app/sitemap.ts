import type { MetadataRoute } from 'next';
import { projects } from '@/lib/data';
import { BASE_URL, CONTENT_UPDATED, languageAlternates, localePath } from '@/lib/seo';

/**
 * Sitemap: home + every case study, in both locales, with hreflang
 * alternates so Google indexes the EN/ID pair as one page per language.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Fixed content date (see CONTENT_UPDATED), not the build time.
  const lastModified = new Date(CONTENT_UPDATED);

  const home: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: languageAlternates() },
      images: [`${BASE_URL}/og.png`, `${BASE_URL}/profile.webp`],
    },
    {
      url: localePath('id'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: languageAlternates() },
      images: [`${BASE_URL}/og.png`, `${BASE_URL}/profile.webp`],
    },
  ];

  const work: MetadataRoute.Sitemap = projects.flatMap((p) => {
    const path = `/work/${p.slug}`;
    return (['en', 'id'] as const).map((locale) => ({
      url: localePath(locale, path),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: locale === 'en' ? 0.8 : 0.7,
      alternates: { languages: languageAlternates(path) },
      images: [`${BASE_URL}${p.image}`],
    }));
  });

  return [...home, ...work];
}
