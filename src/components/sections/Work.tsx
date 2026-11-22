'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Images, Lock, Rocket, Trophy } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LiveBadge } from '@/components/ui/ProjectGallery';
import { Link } from '@/i18n/navigation';
import { projects, loc, type Project } from '@/lib/data';

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX_TAGS = 3;

type FilterKey = 'all' | 'saas' | 'mobile' | 'live';
const FILTERS: { key: FilterKey; match: (p: Project) => boolean }[] = [
  { key: 'all', match: () => true },
  { key: 'saas', match: (p) => /saas|dashboard|pos/i.test(p.category) },
  { key: 'mobile', match: (p) => /mobile|pwa/i.test(p.category) },
  { key: 'live', match: (p) => !!p.live },
];

/**
 * Selected Work — compact and filterable.
 *
 * md+: a "project index + preview" explorer. A tight list of every project
 *   (number · name · subtitle · year · status) sits beside one preview panel.
 *   CLICKING a row selects it and swaps the preview (cover + 🏆 impact + role +
 *   tools); it never navigates — the details page opens only from the
 *   preview's "View project details" button, so looking around is safe.
 *   The list is a tablist (↑/↓/Home/End). All 8 projects fit in about one screen.
 * Phones: one swipeable row of compact cards.
 * Filters (All · SaaS & dashboards · Mobile & PWA · Live) drive both.
 */
export function Work() {
  const t = useTranslations('work');
  const all = projects.filter((p) => p.featured);
  const [filter, setFilter] = useState<FilterKey>('all');
  const visible = all.filter(FILTERS.find((f) => f.key === filter)!.match);

  return (
    <section id="work" className="section">
      <SectionHeader overline={t('overline')} title={t('title')} lead={t('lead')} split />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div
            role="group"
            aria-label={t('filterLabel')}
            className="no-scrollbar -mx-6 flex shrink-0 gap-2 overflow-x-auto px-6 sm:mx-0 sm:flex-wrap sm:px-0 md:flex-nowrap"
          >
            {FILTERS.map((f) => {
              const count = all.filter(f.match).length;
              const on = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f.key)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-body-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] ${
                    on
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-card text-foreground hover:border-accent/40 hover:bg-accent/[0.05]'
                  }`}
                >
                  {t(`filters.${f.key}`)}
                  <span
                    className={`rounded-full px-1.5 font-mono text-[11px] tabular-nums ${
                      on ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="hidden text-right text-body-sm text-muted-foreground md:block">{t('hint')}</p>
        </div>

        {/* md+: index + preview */}
        <div className="hidden md:block">
          <WorkExplorer items={visible} />
        </div>

        {/* Phones: one swipeable row */}
        <div className="md:hidden">
          <WorkCarousel key={filter} items={visible} />
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* md+: project index + live preview                                    */
/* ------------------------------------------------------------------ */

const pad = (n: number) => String(n).padStart(2, '0');

function StatusIcons({ p }: { p: Project }) {
  return (
    <>
      {p.live && (
        <span className="relative flex h-2 w-2 shrink-0" title="Live">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
          <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
        </span>
      )}
      {p.protected && <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-label="NDA" />}
      {p.ownProduct && <Rocket className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />}
    </>
  );
}

function WorkExplorer({ items }: { items: Project[] }) {
  const t = useTranslations('work');
  const locale = useLocale();
  const [activeSlug, setActiveSlug] = useState(items[0]?.slug);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // After filtering, fall back to the first visible project.
  const active = items.find((p) => p.slug === activeSlug) ?? items[0];
  if (!active) return null;
  const activeIndex = items.indexOf(active);

  // Keyboard: ↑/↓ (and ←/→, Home/End) move the selection, like a tab list.
  function onKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    const map: Record<string, number> = {
      ArrowDown: activeIndex + 1,
      ArrowRight: activeIndex + 1,
      ArrowUp: activeIndex - 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: items.length - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    const i = (map[e.key] + items.length) % items.length;
    setActiveSlug(items[i].slug);
    tabRefs.current[i]?.focus();
  }

  return (
    <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6">
      {/* ---------- Index ---------- */}
      <motion.ul
        layout
        role="tablist"
        aria-label={t('listLabel')}
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="flex flex-col gap-1"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((p, i) => {
            const on = p.slug === active.slug;
            const [name, subtitle] = p.title.split(': ');
            return (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
                transition={{ duration: 0.35, ease: EASE }}
                role="presentation"
              >
                {/* Selecting only previews — it never navigates away. The details
                    page opens from the preview's button. */}
                <button
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`work-tab-${p.slug}`}
                  aria-selected={on}
                  aria-controls="work-preview"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActiveSlug(p.slug)}
                  className={`group/row w-full text-left relative flex items-center gap-4 overflow-hidden rounded-2xl border px-4 py-3 transition-[background-color,border-color,box-shadow] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    on ? 'border-accent/30 bg-card shadow-sm' : 'border-transparent hover:bg-muted/60'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-3 left-0 w-1 origin-center rounded-r-full bg-accent transition-transform duration-300 ease-out ${
                      on ? 'scale-y-100' : 'scale-y-0'
                    }`}
                  />
                  <span
                    className={`font-mono text-[12px] font-semibold tabular-nums transition-colors duration-300 ${
                      on ? 'text-accent' : 'text-muted-foreground'
                    }`}
                  >
                    {pad(i + 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-heading text-[1.0625rem] font-bold tracking-tight text-foreground">
                        {name}
                      </span>
                      <StatusIcons p={p} />
                    </span>
                    <span className="block truncate text-[12.5px] text-muted-foreground">
                      {subtitle ?? p.category} · {p.year}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 transition-all duration-300 ease-out ${
                      on
                        ? 'translate-x-0 text-accent opacity-100'
                        : '-translate-x-1.5 text-muted-foreground opacity-0 group-hover/row:translate-x-0 group-hover/row:opacity-70'
                    }`}
                  />
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      {/* ---------- Preview (fixed height: all layers stacked) ---------- */}
      <div
        id="work-preview"
        role="tabpanel"
        aria-labelledby={`work-tab-${active.slug}`}
        className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm md:sticky md:top-[calc(var(--nav-top,0px)+5.5rem)]"
      >
        {/* Cover */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-muted to-card">
          {items.map((p) => {
            const on = p.slug === active.slug;
            const shots = p.images?.length ?? 0;
            return (
              <div
                key={p.slug}
                aria-hidden={!on}
                className={`absolute inset-0 transition-[opacity,transform] duration-500 ease-out ${
                  on ? 'scale-100 opacity-100' : 'pointer-events-none scale-[1.03] opacity-0'
                }`}
              >
                {p.image && (
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 620px, 50vw"
                    className="object-cover object-top"
                  />
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/20"
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start gap-2 p-3.5">
                  {p.ownProduct && (
                    <span className="badge-shine relative inline-flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full bg-accent-solid px-2.5 py-1 font-mono text-label uppercase tracking-widest text-accent-foreground shadow-md">
                      <Rocket className="h-3 w-3" aria-hidden="true" />
                      {t('ownProduct')}
                    </span>
                  )}
                  <div className="ml-auto flex shrink-0 gap-2">
                    {p.live && <LiveBadge label={t('liveShort')} />}
                    {p.protected && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 font-mono text-label uppercase tracking-widest text-foreground shadow-sm ring-1 ring-border backdrop-blur-md">
                        <Lock className="h-3 w-3" aria-hidden="true" />
                        NDA
                      </span>
                    )}
                  </div>
                </div>
                {shots > 1 && (
                  <span className="pointer-events-none absolute bottom-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-[12px] font-medium tabular-nums text-foreground shadow-sm ring-1 ring-border backdrop-blur-md">
                    <Images className="h-3.5 w-3.5" aria-hidden="true" />
                    {t('screens', { count: shots })}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Details */}
        <div className="grid p-5 lg:p-6">
          {items.map((p) => {
            const on = p.slug === active.slug;
            const [name, subtitle] = p.title.split(': ');
            const external =
              p.externalLinks?.[0] ?? (p.externalUrl && p.live ? { url: p.externalUrl, label: p.externalLabel } : null);
            return (
              <div
                key={p.slug}
                aria-hidden={!on}
                inert={!on}
                className={`col-start-1 row-start-1 flex flex-col transition-[opacity,transform] duration-300 ease-out ${
                  on ? 'translate-y-0 opacity-100 delay-75' : 'pointer-events-none translate-y-1 opacity-0'
                }`}
              >
                <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {p.category} · {p.year}
                </p>
                <h3 className="mt-1.5 font-heading leading-tight text-foreground">
                  <span className="text-[1.375rem] font-bold tracking-tight">{name}</span>
                  {subtitle && <span className="mt-0.5 block text-body font-medium text-muted-foreground">{subtitle}</span>}
                </h3>

                {p.impact && (
                  <p className="mt-3 flex items-start gap-2">
                    <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                    <span className="text-body-sm font-semibold leading-snug text-foreground">
                      {loc(p.impact, locale)}
                    </span>
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-[12.5px] text-muted-foreground">
                    <span className="font-medium text-foreground">{p.role}</span> · {loc(p.timeline, locale)}
                  </span>
                  {p.ownProduct &&
                    p.metrics?.map((m) => (
                      <span key={m.value + loc(m.label, locale)} className="text-[12.5px] text-muted-foreground">
                        <span className="font-bold tabular-nums text-accent">{m.value}</span> {loc(m.label, locale)}
                      </span>
                    ))}
                </div>

                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 5).map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-[12px] font-medium text-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                  <Link
                    href={`/work/${p.slug}`}
                    className="group/cta inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-accent-solid px-4 text-body-sm font-semibold text-accent-foreground shadow-[0_10px_24px_-12px_rgb(37_99_235/0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  >
                    {p.protected && <Lock className="h-3.5 w-3.5" aria-hidden="true" />}
                    {t('viewCase')}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                  </Link>
                  {external && (
                    <a
                      href={external.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-border px-3.5 text-body-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {external.label ? loc(external.label, locale) : t('liveShort')}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Phones: swipe carousel                                               */
/* ------------------------------------------------------------------ */

function WorkCarousel({ items }: { items: Project[] }) {
  const t = useTranslations('work');
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Scroll-spy: the most visible card drives the dots + counter.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-card]'));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.6) setIndex(Number(e.target.getAttribute('data-card')));
        }),
      { root: track, threshold: [0.6] },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [items.length]);

  const goTo = (i: number) =>
    trackRef.current
      ?.querySelector<HTMLElement>(`[data-card="${i}"]`)
      ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

  return (
    <div>
      <div
        ref={trackRef}
        role="group"
        aria-roledescription="carousel"
        aria-label={t('overline')}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 pt-1"
      >
        {items.map((p, i) => (
          <div
            key={p.slug}
            data-card={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${items.length}`}
            className="w-[84%] shrink-0 snap-center"
          >
            <ProjectCard project={p} />
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5">
            {items.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${i + 1} / ${items.length}: ${p.title.split(': ')[0]}`}
                aria-current={i === index ? 'true' : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  i === index ? 'w-6 bg-accent' : 'w-1.5 bg-border'
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {index + 1}/{items.length}
          </span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                 */
/* ------------------------------------------------------------------ */

function ProjectCard({ project: p }: { project: Project }) {
  const t = useTranslations('work');
  const locale = useLocale();
  const [name, subtitle] = p.title.split(': ');
  const shots = p.images?.length ?? 0;
  const external =
    p.externalLinks?.[0] ?? (p.externalUrl && p.live ? { url: p.externalUrl, label: p.externalLabel } : null);
  const extraTags = p.tags.length - MAX_TAGS;

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background ${
        p.ownProduct
          ? 'border-accent/40 bg-gradient-to-br from-accent/[0.06] via-card to-card hover:border-accent/60'
          : 'border-border bg-card hover:border-accent/30'
      }`}
    >
      {/* The whole card opens the project details */}
      <Link
        href={`/work/${p.slug}`}
        aria-label={`${t('viewCase')}, ${name}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none"
      />

      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-muted to-card">
        {p.image && (
          <Image
            src={p.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 768px) 360px, 84vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start gap-2 p-3">
          {p.ownProduct && (
            <span className="badge-shine relative inline-flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full bg-accent-solid px-2.5 py-1 font-mono text-label uppercase tracking-widest text-accent-foreground shadow-md">
              <Rocket className="h-3 w-3" aria-hidden="true" />
              {t('ownProduct')}
            </span>
          )}
          <div className="ml-auto flex shrink-0 gap-2">
            {p.live && <LiveBadge label={t('liveShort')} />}
            {p.protected && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 font-mono text-label uppercase tracking-widest text-foreground shadow-sm ring-1 ring-border backdrop-blur-md">
                <Lock className="h-3 w-3" aria-hidden="true" />
                NDA
              </span>
            )}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
          {shots > 1 ? (
            <span className="pointer-events-none inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2 py-0.5 text-[11.5px] font-medium tabular-nums text-foreground shadow-sm ring-1 ring-border backdrop-blur-md">
              <Images className="h-3.5 w-3.5" aria-hidden="true" />
              {t('screens', { count: shots })}
            </span>
          ) : (
            <span />
          )}
          {external && (
            <a
              href={external.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-20 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[11.5px] font-semibold text-foreground shadow-sm ring-1 ring-border backdrop-blur-md transition-colors duration-200 hover:bg-accent-solid hover:text-accent-foreground hover:ring-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {external.label ? loc(external.label, locale) : t('liveShort')}
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {p.category} · {p.year}
            </p>
            <h3 className="mt-1.5 font-heading leading-tight text-foreground">
              <span className="block text-[1.1875rem] font-bold tracking-tight">{name}</span>
              {subtitle && (
                <span className="mt-0.5 block truncate text-body-sm font-medium text-muted-foreground">{subtitle}</span>
              )}
            </h3>
          </div>
          {/* Visual cue for "opens the project details" */}
          <span
            aria-hidden="true"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-foreground transition-all duration-300 ease-out group-hover:-rotate-45 group-hover:border-accent group-hover:bg-accent-solid group-hover:text-accent-foreground"
          >
            {p.protected ? <Lock className="h-3.5 w-3.5" /> : <ArrowRight className="h-4 w-4" />}
          </span>
        </div>

        {p.impact && (
          <p className="mt-3 flex items-start gap-2">
            <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
            <span className="line-clamp-3 text-body-sm font-semibold leading-snug text-foreground md:line-clamp-2">
              {loc(p.impact, locale)}
            </span>
          </p>
        )}

        {/* Own product: traction (compact) */}
        {p.ownProduct && p.metrics && (
          <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {p.metrics.map((m) => (
              <div key={m.value + loc(m.label, locale)} className="flex items-baseline gap-1">
                <dd className="font-heading text-body font-bold tabular-nums text-accent">{m.value}</dd>
                <dt className="text-[12px] text-muted-foreground">{loc(m.label, locale)}</dt>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-auto pt-4">
          <p className="truncate text-[12.5px] text-muted-foreground">
            <span className="font-medium text-foreground">{p.role}</span> · {loc(p.timeline, locale)}
          </p>
          <ul className="mt-2.5 flex flex-nowrap gap-1.5 overflow-hidden">
            {p.tags.slice(0, MAX_TAGS).map((tag) => (
              <li
                key={tag}
                className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11.5px] font-medium text-foreground"
              >
                {tag}
              </li>
            ))}
            {extraTags > 0 && (
              <li className="shrink-0 rounded-full border border-dashed border-border px-2 py-0.5 text-[11.5px] text-muted-foreground">
                +{extraTags}
              </li>
            )}
          </ul>
        </div>
      </div>
    </article>
  );
}
