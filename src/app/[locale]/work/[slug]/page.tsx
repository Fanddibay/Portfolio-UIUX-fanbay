import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ExternalLink } from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { NDASection } from '@/components/ui/NDASection';
import { ProjectGallery } from '@/components/ui/ProjectGallery';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { projects, loc, SITE } from '@/lib/data';
import {
  BASE_URL,
  languageAlternates,
  localePath,
  projectJsonLd,
  breadcrumbJsonLd,
  jsonLdString,
} from '@/lib/seo';

/**
 * Case study / workflow detail page.
 * Renders the project's narrative — problem, method, business process, goal —
 * which is shown for every project, including NDA ones. Only final visuals are
 * gated behind the "protected" state.
 */

/** Pre-render every project for every locale. */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

/** Per-project SEO: localized title/description, canonical + hreflang, OG poster. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  const title = `${project.title} — ${project.category} Case Study`;
  const description = loc(project.summary, locale);
  const path = `/work/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: localePath(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: {
      type: 'article',
      url: localePath(locale, path),
      title,
      description,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      images: [{ url: `${BASE_URL}${project.image}`, width: 1200, height: 675, alt: project.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}${project.image}`],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const t = await getTranslations('project');

  // The four workflow blocks, in narrative order
  const blocks = [
    { label: t('problem'), body: loc(project.problem, locale) },
    { label: t('method'), body: loc(project.method, locale) },
    { label: t('businessProcess'), body: loc(project.businessProcess, locale) },
    { label: t('goal'), body: loc(project.goal, locale) },
  ];

  return (
    <>
      {/* Case-study entity + breadcrumb trail for search / AI citation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(projectJsonLd(project, locale)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd(project, locale)) }}
      />
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pt-12 pb-24 md:px-8">
        {/* Back */}
        <Link
          href="/#work"
          className="inline-flex items-center gap-1.5 font-body text-body-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Link>

        {/* Header */}
        <header className="mt-8">
          <p className="font-mono text-label uppercase tracking-widest text-accent">
            {project.category} · {project.year}
          </p>
          <h1 className="mt-3 font-heading text-h1 leading-tight text-foreground">
            {project.title}
          </h1>
          <p className="mt-4 text-body-lg text-muted-foreground">{loc(project.summary, locale)}</p>

          {/* Role / timeline / tools meta */}
          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-5 border-t border-border pt-6">
            <div>
              <dt className="font-mono text-label uppercase tracking-widest text-muted-foreground">
                {t('role')}
              </dt>
              <dd className="mt-1 font-body text-body text-foreground">{project.role}</dd>
            </div>
            <div>
              <dt className="font-mono text-label uppercase tracking-widest text-muted-foreground">
                {t('timeline')}
              </dt>
              <dd className="mt-1 font-body text-body text-foreground">
                {loc(project.timeline, locale)}
              </dd>
            </div>
            {project.tags.length > 0 && (
              <div className="w-full">
                <dt className="font-mono text-label uppercase tracking-widest text-muted-foreground">
                  {t('tools')}
                </dt>
                <dd className="mt-2">
                  <ul className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md border border-border bg-muted px-2.5 py-1 font-mono text-label text-muted-foreground"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>

          {/* Traction — self-initiated product only */}
          {project.ownProduct && project.metrics && (
            <div className="mt-8">
              <p className="font-mono text-label uppercase tracking-widest text-muted-foreground">
                {t('traction')}
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 rounded-2xl border border-accent/25 bg-accent/[0.04] p-5 sm:grid-cols-3 sm:gap-4 sm:p-6">
                {project.metrics.map((m) => {
                  const label = loc(m.label, locale);
                  return (
                    <div key={label} className="text-left">
                      <div className="font-heading text-h2 leading-none tabular-nums text-accent">
                        {m.value}
                      </div>
                      <div className="mt-2 font-mono text-label uppercase tracking-widest text-muted-foreground">
                        {label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </header>

        {/* Cover visual — paginated gallery + click-to-zoom lightbox */}
        <ProjectGallery
          images={project.images ?? [project.image]}
          title={project.title}
          isProtected={project.protected}
          live={project.live}
        />

        {/* Workflow narrative */}
        {project.protected ? (
          <>
            {/* First half: Problem + Method — fully visible */}
            <div className="mt-12 flex flex-col gap-10">
              {blocks.slice(0, 2).map((block) => (
                <section key={block.label}>
                  <h2 className="font-mono text-label uppercase tracking-widest text-accent">
                    {block.label}
                  </h2>
                  <p className="mt-3 text-body-lg leading-relaxed text-foreground">{block.body}</p>
                </section>
              ))}
            </div>

            {/* Second half: blurred peek + sticky premium NDA card */}
            <NDASection
              blocks={blocks.slice(2)}
              protectedTitle={t('protectedTitle')}
              protectedBody={t('protectedBody')}
              requestCta={t('requestCta')}
              mailto={`mailto:${SITE.email}?subject=More information — ${project.title}`}
            />
          </>
        ) : (
          <>
            <div className="mt-12 flex flex-col gap-10">
              {blocks.map((block) => (
                <section key={block.label}>
                  <h2 className="font-mono text-label uppercase tracking-widest text-accent">
                    {block.label}
                  </h2>
                  <p className="mt-3 text-body-lg leading-relaxed text-foreground">{block.body}</p>
                </section>
              ))}
            </div>

            {/* MVP roadmap — the sequence the product shipped in */}
            {project.roadmap && (
              <section className="mt-14">
                <h2 className="font-mono text-label uppercase tracking-widest text-accent">
                  {t('roadmap')}
                </h2>
                <ol className="mt-5 grid gap-4 sm:grid-cols-3">
                  {project.roadmap.map((phase) => (
                    <li
                      key={phase.phase}
                      className="rounded-2xl border border-border border-l-2 border-l-accent bg-card p-5"
                    >
                      <span className="font-mono text-label uppercase tracking-widest text-accent">
                        {phase.phase}
                      </span>
                      <h3 className="mt-2 font-heading text-h4 text-foreground">
                        {loc(phase.title, locale)}
                      </h3>
                      <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">
                        {loc(phase.body, locale)}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* External links — dual buttons (app + landing) or a single text link */}
            {project.externalLinks ? (
              <div className="mt-12 flex flex-wrap items-center gap-3">
                {project.externalLinks.map((link, i) => (
                  <Button
                    key={link.url}
                    as="a"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant={i === 0 ? 'primary' : 'secondary'}
                  >
                    {loc(link.label, locale)}
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            ) : (
              project.externalUrl && (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-12 inline-flex items-center gap-1.5 font-body text-body-sm font-medium text-accent hover:underline"
                >
                  {project.externalLabel ? loc(project.externalLabel, locale) : t('viewExternal')}
                  <ExternalLink className="h-4 w-4" />
                </a>
              )
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
