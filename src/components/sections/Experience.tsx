'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight, BadgeCheck, CalendarDays, ChevronDown, Layers, Trophy } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { CertificateModal } from '@/components/ui/CertificateModal';
import { ResumeModal } from '@/components/ui/ResumeModal';
import { SITE, experience, loc, type ExperienceEntry, type ExperienceRole } from '@/lib/data';

/**
 * Experience — a scroll-animated, numbered timeline (adapted from shadcn-studio
 * "timeline-07", rebuilt on framer-motion + DESIGN.md tokens) next to a sticky
 * "At a glance" card for recruiters.
 *
 * Scanning order per card, by design: company + role → period/current →
 * 🏆 key result (one punchy, factual line) → stack → description (2 lines,
 * expandable). A recruiter gets the gist from the first three lines.
 *
 * Motion: numbers + cards rise in as each row reaches the reading zone, and
 * the line between numbers draws itself with scroll progress. Content is fully
 * opaque by the time it sits ~60% down the viewport, so nothing is ever read
 * half-faded. Reduced motion → static, everything visible.
 */

const LINE_GAP = 22; // px of air between a number and the line segments
type Segment = { start: number; end: number };

export function Experience() {
  const t = useTranslations('experience');

  return (
    <section id="experience" className="section">
      <SectionHeader overline={t('overline')} title={t('title')} lead={t('lead')} split />

      <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
        <aside className="lg:pt-6">
          <AtAGlance />
        </aside>
        <Timeline entries={experience} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* At a glance (sticky on desktop)                                      */
/* ------------------------------------------------------------------ */

function AtAGlance() {
  const t = useTranslations('experience');
  const current = experience.flatMap((e) =>
    e.roles.filter((r) => r.current).map((r) => ({ company: e.company, logo: e.logo, role: r.title })),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-[calc(var(--nav-top,0px)+6rem)]"
    >
      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {t('glance')}
      </p>
      <p className="mt-3 flex items-baseline gap-1.5 font-heading font-extrabold leading-none tracking-tight text-foreground">
        <span className="text-[3.25rem]">{SITE.yearsExperience}+</span>
        <span className="text-h4 text-accent">{t('years')}</span>
      </p>
      <p className="mt-1.5 text-body-sm text-muted-foreground">{t('yearsCaption')}</p>

      <div className="my-5 h-px bg-border" />

      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {t('currently')}
      </p>
      <ul className="mt-3 space-y-3">
        {current.map((c) => (
          <li key={c.company} className="flex items-center gap-2.5">
            <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted ring-1 ring-border">
              {c.logo && (
                // eslint-disable-next-line @next/next/no-img-element -- tiny static logo
                <img src={c.logo} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
              )}
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-body-sm font-semibold text-foreground">{c.company}</span>
              <span className="block truncate text-[12px] text-muted-foreground">{c.role}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <ResumeModal />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll-animated timeline                                             */
/* ------------------------------------------------------------------ */

function Timeline({ entries }: { entries: ExperienceEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const rowNodes = useRef<(HTMLLIElement | null)[]>([]);
  const indexNodes = useRef<(HTMLDivElement | null)[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const reduce = useReducedMotion();

  // Measure where each number sits, so the line can run *between* numbers
  // (never through them). Re-measures on any size change (fonts, expanding cards).
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const top0 = list.getBoundingClientRect().top;
      const bounds = rowNodes.current
        .map((row, i) => (row && indexNodes.current[i] ? { row, idx: indexNodes.current[i]! } : null))
        .filter((b): b is { row: HTMLLIElement; idx: HTMLDivElement } => b !== null)
        .map(({ row, idx }) => {
          const top = row.getBoundingClientRect().top - top0;
          return { top, bottom: top + idx.getBoundingClientRect().height };
        });
      if (!bounds.length) return;

      // Segments: from each number's bottom to the next number's top.
      const next: Segment[] = [];
      for (let i = 0; i < bounds.length - 1; i++) {
        const start = bounds[i].bottom + LINE_GAP;
        next.push({
          start,
          end: Math.max(start, bounds[i + 1].top - LINE_GAP),
        });
      }
      setSegments(next);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [entries.length]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 55%'],
  });
  const total = segments.at(-1)?.end ?? 0;
  const revealed = useTransform(scrollYProgress, [0, 1], [0, total]);

  return (
    <div ref={containerRef} className="relative w-full">
      <ol ref={listRef} className="relative">
        {entries.map((entry, i) => (
          <TimelineRow
            key={entry.company}
            index={String(i + 1).padStart(2, '0')}
            current={entry.roles.some((r) => r.current)}
            isLast={i === entries.length - 1}
            reduce={!!reduce}
            rowRef={(n) => (rowNodes.current[i] = n)}
            indexRef={(n) => (indexNodes.current[i] = n)}
          >
            <ExperienceCard entry={entry} />
          </TimelineRow>
        ))}

        {/* Track (faint) + progress (drawn by scroll) between the numbers */}
        {segments.map((s, i) => (
          <Segment key={i} start={s.start} end={s.end} revealed={revealed} reduce={!!reduce} />
        ))}
      </ol>
    </div>
  );
}

function TimelineRow({
  index,
  current,
  isLast,
  reduce,
  rowRef,
  indexRef,
  children,
}: {
  index: string;
  current: boolean;
  isLast: boolean;
  reduce: boolean;
  rowRef: (n: HTMLLIElement | null) => void;
  indexRef: (n: HTMLDivElement | null) => void;
  children: ReactNode;
}) {
  const local = useRef<HTMLLIElement | null>(null);
  // Fully in place by the time the row's top reaches 60% of the viewport.
  const { scrollYProgress } = useScroll({
    target: local,
    offset: ['start 92%', 'start 60%'],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });
  const opacity = useTransform(p, [0, 1], [0, 1]);
  const y = useTransform(p, [0, 1], [28, 0]);
  const motionStyle = reduce ? undefined : { opacity, y };

  return (
    <li
      ref={(n) => {
        local.current = n;
        rowRef(n);
      }}
      className={`relative ${isLast ? '' : 'pb-8 sm:pb-12'}`}
    >
      {/* Number marker — centring on the wrapper, framer owns the inner transform */}
      <div ref={indexRef} aria-hidden="true" className="absolute left-5 top-3 -translate-x-1/2 sm:left-7">
        <motion.div style={motionStyle} className="flex flex-col items-center gap-1.5">
          <span
            className={`font-heading text-lg font-bold tabular-nums sm:text-xl ${
              current ? 'text-accent' : 'text-muted-foreground'
            }`}
          >
            {index}
          </span>
          {current && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70 motion-safe:animate-ping" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          )}
        </motion.div>
      </div>

      <motion.div style={motionStyle} className="min-w-0 pl-12 sm:pl-16">
        {children}
      </motion.div>
    </li>
  );
}

function Segment({
  start,
  end,
  revealed,
  reduce,
}: {
  start: number;
  end: number;
  revealed: MotionValue<number>;
  reduce: boolean;
}) {
  const height = useTransform(revealed, (v) => Math.min(Math.max(v - start, 0), end - start));
  return (
    <div
      aria-hidden="true"
      style={{ top: start, height: end - start }}
      className="absolute left-5 w-0.5 -translate-x-1/2 overflow-hidden rounded-full bg-border/70 sm:left-7"
    >
      <motion.div
        style={{ height: reduce ? end - start : height }}
        className="absolute inset-x-0 top-0 rounded-full bg-gradient-to-b from-accent to-accent/40"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                 */
/* ------------------------------------------------------------------ */

function ExperienceCard({ entry }: { entry: ExperienceEntry }) {
  const multi = entry.roles.length > 1;
  const featured = entry.roles.some((r) => r.featured);
  const lead = entry.roles[0];

  return (
    <article
      className={`group rounded-2xl border p-5 transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg sm:p-6 ${
        featured
          ? 'border-accent/30 bg-accent/[0.035] hover:border-accent/50'
          : 'border-border bg-card hover:border-accent/30'
      }`}
    >
      {/* Header: logo · company (small) · role (big) · status */}
      <header className="flex items-start gap-3.5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-muted ring-1 ring-border transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
          {entry.logo && (
            // eslint-disable-next-line @next/next/no-img-element -- small static logo
            <img
              src={entry.logo}
              alt={`${entry.company} logo`}
              loading="lazy"
              className="h-7 w-7 object-contain sm:h-8 sm:w-8"
            />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-body-sm text-muted-foreground">
            {multi ? entry.location : `${entry.company} · ${entry.location}`}
          </p>
          <h3 className="font-heading text-h4 font-bold leading-snug text-foreground sm:text-[1.375rem]">
            {multi ? entry.company : lead.title}
          </h3>
        </div>
        <StatusPills role={multi ? null : lead} />
      </header>

      <div className={multi ? 'mt-5 space-y-6 border-l-2 border-dashed border-border pl-5' : 'mt-4'}>
        {entry.roles.map((role) => (
          <RoleBody key={role.title} role={role} company={entry.company} showTitle={multi} />
        ))}
      </div>
    </article>
  );
}

function StatusPills({ role }: { role: ExperienceRole | null }) {
  const t = useTranslations('experience');
  if (!role || (!role.current && !role.badge)) return null;
  return (
    <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
      {role.current && <CurrentPill label={t('current')} />}
      {role.badge && <BadgePill label={role.badge} />}
    </div>
  );
}

const CurrentPill = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
    {label}
  </span>
);

const BadgePill = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
    <BadgeCheck className="h-3.5 w-3.5" />
    {label}
  </span>
);

function RoleBody({
  role,
  company,
  showTitle,
}: {
  role: ExperienceRole;
  company: string;
  showTitle: boolean;
}) {
  const t = useTranslations('experience');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const description = loc(role.description, locale);
  const long = description.length > 170;

  return (
    <div>
      {showTitle && (
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-heading text-body font-bold text-foreground sm:text-[1.0625rem]">
            {role.title}
          </h4>
          {role.current && <CurrentPill label={t('current')} />}
        </div>
      )}

      <div className={`space-y-2.5 text-body-sm ${showTitle ? 'mt-2' : ''}`}>
        {/* When */}
        <p className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground/80" aria-hidden="true" />
          <span>
            <span className="font-medium text-foreground">{loc(role.period, locale)}</span>
            {role.type && <> · {loc(role.type, locale)}</>}
          </span>
          {/* Mobile: status inline (the header pills are sm+) */}
          {!showTitle && role.current && (
            <span className="sm:hidden">
              <CurrentPill label={t('current')} />
            </span>
          )}
        </p>

        {/* Key result — the punch line */}
        {role.achievement && (
          <p className="flex items-start gap-2">
            <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
            <span className="text-body font-semibold leading-snug text-foreground">
              <span className="sr-only">{t('keyResult')}: </span>
              {loc(role.achievement, locale)}
            </span>
          </p>
        )}

        {/* Stack */}
        {role.skills && role.skills.length > 0 && (
          <div className="flex items-start gap-2">
            <Layers className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/80" aria-hidden="true" />
            <ul aria-label={t('skills')} className="flex flex-wrap gap-1.5">
              {role.skills.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-[12px] font-medium text-foreground transition-colors duration-200 group-hover:bg-muted/80"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Description — 2 lines, expandable */}
      <div className="mt-3">
        <p
          className={`max-w-[68ch] text-body-sm text-muted-foreground ${long && !open ? 'line-clamp-2' : ''}`}
        >
          {description}
        </p>
        {long && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="mt-1 inline-flex items-center gap-1 rounded text-[12.5px] font-semibold text-accent transition-colors hover:text-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {open ? t('readLess') : t('readMore')}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {/* Featured metrics (Upwork) */}
      {role.metrics && (
        <dl
          className={`mt-4 grid gap-2 sm:gap-3 ${
            role.metrics.length >= 3
              ? 'grid-cols-1 sm:max-w-xl sm:grid-cols-3' // phones: compact rows — 3 tiles would clip the labels
              : 'grid-cols-2 sm:max-w-sm'
          }`}
        >
          {role.metrics.map((m) => {
            const label = loc(m.label, locale);
            const rows = role.metrics!.length >= 3;
            return (
              <div
                key={label}
                className={`min-w-0 rounded-xl border border-border bg-card px-3.5 py-2.5 ${
                  rows ? 'flex items-baseline gap-2 sm:block' : ''
                }`}
              >
                <dd className="font-heading text-h4 font-bold tabular-nums text-foreground">{m.value}</dd>
                <dt className="text-[12px] text-muted-foreground">{label}</dt>
              </div>
            );
          })}
        </dl>
      )}

      {/* Plain metric chips (Fiverr) */}
      {role.stats && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {role.stats.map((stat) => {
            const text = loc(stat, locale);
            return (
              <li
                key={text}
                className="rounded-md border border-border bg-card px-2.5 py-1 text-[12px] font-semibold text-foreground"
              >
                {text}
              </li>
            );
          })}
        </ul>
      )}

      {role.ctaUrl && (
        <Button
          as="a"
          href={role.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          className="group/cta mt-5"
        >
          {t('collaborateCta')}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
        </Button>
      )}

      {role.certificateUrl && (
        <div className="mt-3">
          <CertificateModal
            src={role.certificateUrl}
            title={`${company} ${role.title} certificate`}
            label={t('viewCertificate')}
          />
        </div>
      )}
    </div>
  );
}
