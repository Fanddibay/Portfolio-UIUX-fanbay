import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ExternalLink, Lock } from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { projects, SITE } from '@/lib/data';

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
    { label: t('problem'), body: project.problem },
    { label: t('method'), body: project.method },
    { label: t('businessProcess'), body: project.businessProcess },
    { label: t('goal'), body: project.goal },
  ];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-24 md:px-8">
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
          <p className="mt-4 text-body-lg text-muted-foreground">{project.summary}</p>

          {/* Role / timeline meta */}
          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 border-t border-border pt-6">
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
              <dd className="mt-1 font-body text-body text-foreground">{project.timeline}</dd>
            </div>
          </dl>
        </header>

        {/* Cover visual (locked for NDA) */}
        <div className="relative mt-10 flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted to-card">
          <span className="font-heading text-h2 font-bold text-muted-foreground/30">
            {project.category}
          </span>
          {project.protected && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/60 backdrop-blur-md">
              <Lock className="h-6 w-6 text-foreground" />
            </div>
          )}
        </div>

        {/* Workflow narrative */}
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

        {/* NDA notice or external link */}
        {project.protected ? (
          <div className="mt-12 rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-accent" />
              <h2 className="font-heading text-h4 text-card-foreground">{t('protectedTitle')}</h2>
            </div>
            <p className="mt-3 text-body text-muted-foreground">{t('protectedBody')}</p>
            <Button
              as="a"
              href={`mailto:${SITE.email}?subject=Access request — ${project.title}`}
              variant="primary"
              className="mt-6"
            >
              {t('requestCta')}
            </Button>
          </div>
        ) : (
          project.externalUrl && (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-12 inline-flex items-center gap-1.5 font-body text-body-sm font-medium text-accent hover:underline"
            >
              {t('viewExternal')}
              <ExternalLink className="h-4 w-4" />
            </a>
          )
        )}
      </main>
      <Footer />
    </>
  );
}
