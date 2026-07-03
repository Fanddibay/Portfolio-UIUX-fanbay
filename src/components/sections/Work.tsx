'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { ArrowRight, ExternalLink, Images, Lock, Rocket } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LiveBadge } from '@/components/ui/ProjectGallery';
import { Link } from '@/i18n/navigation';
import { projects, loc, type Project } from '@/lib/data';

/**
 * Work — adaptive showcase.
 * - Desktop: a tabbed explorer (tab list + active panel) for quick scanning.
 * - Mobile: a swipeable card carousel with peeking cards + dot indicators, so
 *   it's immediately obvious how to browse everything (no hidden tabs to hunt).
 *
 * Both layouts render the same ProjectPanel, so content stays consistent.
 */
export function Work() {
  const t = useTranslations('work');
  const items = projects.filter((p) => p.featured);

  return (
    <section id="work" className="section">
      <SectionHeader overline={t('overline')} title={t('title')} lead={t('lead')} />

      {/* Desktop: tabs */}
      <div className="hidden md:block">
        <WorkTabs items={items} />
      </div>

      {/* Mobile: carousel */}
      <div className="md:hidden">
        <WorkCarousel items={items} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Shared project card                                                 */
/* ------------------------------------------------------------------ */

function ProjectPanel({ project }: { project: Project }) {
  const t = useTranslations('work');
  const locale = useLocale();
  return (
    <article
      className={`flex h-full flex-col rounded-2xl border p-6 transition-shadow duration-250 ease-out md:p-8 ${
        project.ownProduct
          ? 'border-accent/40 bg-gradient-to-b from-accent/[0.05] to-card shadow-lg shadow-accent/10'
          : 'border-border bg-card'
      }`}
    >
      {/* Visual — shows screenshot when available; NDA badge for protected */}
      <div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-muted to-card">
        {/* Highlight: self-initiated product (Product Owner) */}
        {project.ownProduct && (
          <span className="badge-shine absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-accent px-3 py-1 font-mono text-label uppercase tracking-widest text-accent-foreground shadow-md">
            <Rocket className="h-3 w-3" aria-hidden="true" />
            {t('ownProduct')}
          </span>
        )}
        {project.image ? (
          <>
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 85vw, 600px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            {project.protected && (
              <span className="absolute right-3 top-3 rounded-full border border-border bg-background/80 px-3 py-1 font-mono text-label uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
                NDA · Edited
              </span>
            )}
            {project.live && <LiveBadge className="absolute right-3 top-3" />}
            {project.images && project.images.length > 1 && (
              <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-2.5 py-1 font-mono text-label tabular-nums text-muted-foreground backdrop-blur-sm">
                <Images className="h-3 w-3" aria-hidden="true" />+{project.images.length}
              </span>
            )}
          </>
        ) : (
          <>
            <span className="font-heading text-h3 font-bold text-muted-foreground/30">
              {project.category}
            </span>
            {project.protected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/60 backdrop-blur-md">
                <Lock className="h-5 w-5 text-foreground" />
                <span className="px-4 text-center font-mono text-label uppercase tracking-widest text-muted-foreground">
                  {t('protected')}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className="mt-6 flex flex-1 flex-col">
        <span className="font-mono text-label uppercase tracking-widest text-muted-foreground">
          {project.category} · {project.year}
        </span>
        <h3 className="mt-2 font-heading text-h3 text-card-foreground md:text-h2">{project.title}</h3>
        <p className="mt-1 font-body text-body-sm text-accent">
          {project.role} · {loc(project.timeline, locale)}
        </p>

        {/* Traction — self-initiated product only */}
        {project.ownProduct && project.metrics && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            {project.metrics.map((m) => (
              <span key={loc(m.label, locale)} className="font-mono text-label text-muted-foreground">
                <span className="font-semibold tabular-nums text-accent">{m.value}</span>{' '}
                {loc(m.label, locale)}
              </span>
            ))}
          </div>
        )}

        <p className="mt-3 text-body text-muted-foreground">{loc(project.summary, locale)}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md bg-muted px-2 py-1 font-mono text-label text-muted-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
          <Link
            href={`/work/${project.slug}`}
            className="inline-flex items-center gap-1.5 font-body text-body-sm font-medium text-accent transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            {t('viewProcess')}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {/* Live product: jump straight to the app */}
          {project.ownProduct && project.externalLinks?.[0] && (
            <a
              href={project.externalLinks[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-body text-body-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              {loc(project.externalLinks[0].label, locale)}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop: tab explorer                                               */
/* ------------------------------------------------------------------ */

function WorkTabs({ items }: { items: Project[] }) {
  const [active, setActive] = useState(0);

  function handleKey(e: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const dir = e.key === 'ArrowDown' ? 1 : -1;
    const next = (active + dir + items.length) % items.length;
    setActive(next);
    document.getElementById(`tab-${items[next].slug}`)?.focus();
  }

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,340px)_1fr]">
      <div role="tablist" aria-orientation="vertical" onKeyDown={handleKey} className="flex flex-col gap-2">
        {items.map((project, i) => {
          const isActive = i === active;
          return (
            <button
              key={project.slug}
              role="tab"
              id={`tab-${project.slug}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(i)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isActive ? 'border-accent bg-card shadow-md' : 'border-transparent hover:bg-muted'
              }`}
            >
              <span
                className={`font-mono text-label tabular-nums ${
                  isActive ? 'text-accent' : 'text-muted-foreground'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5">
                  <span className="truncate font-heading text-h4 text-foreground">{project.title}</span>
                  {project.protected && <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                  {project.ownProduct && <Rocket className="h-3.5 w-3.5 shrink-0 text-accent" />}
                </span>
                <span className="block font-body text-body-sm text-muted-foreground">
                  {project.category} · {project.year}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={items[active].slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <ProjectPanel project={items[active]} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile: swipe carousel                                              */
/* ------------------------------------------------------------------ */

function WorkCarousel({ items }: { items: Project[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Track the most-visible card to drive the dot indicators
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-card]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.6) {
            setIndex(Number(e.target.getAttribute('data-card')));
          }
        });
      },
      { root: track, threshold: [0.6] },
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  function goTo(i: number) {
    trackRef.current
      ?.querySelector<HTMLElement>(`[data-card="${i}"]`)
      ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  return (
    <div>
      <div
        ref={trackRef}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1"
      >
        {items.map((project, i) => (
          <div key={project.slug} data-card={i} className="w-[85%] shrink-0 snap-center">
            <ProjectPanel project={project} />
          </div>
        ))}
      </div>

      {/* Dot indicators — clear "where am I / how many" + tap to jump */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {items.map((project, i) => (
          <button
            key={project.slug}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to project ${i + 1}: ${project.title}`}
            aria-current={i === index ? 'true' : undefined}
            className={`h-2 rounded-full transition-all duration-250 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              i === index ? 'w-6 bg-accent' : 'w-2 bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
