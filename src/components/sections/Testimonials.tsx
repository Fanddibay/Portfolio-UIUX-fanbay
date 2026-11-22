'use client';

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, Linkedin, Quote } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FiverrGlyph, UpworkGlyph } from '@/components/ui/BrandIcons';
import { testimonials, loc, type Testimonial } from '@/lib/data';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Platform marks + brand colours for the "verified" proof. */
const PLATFORM: Record<NonNullable<Testimonial['platform']>, { Icon: (p: { className?: string }) => ReactNode; color: string }> = {
  Upwork: { Icon: UpworkGlyph, color: '#14A800' },
  Fiverr: { Icon: FiverrGlyph, color: '#1DBF73' },
  LinkedIn: { Icon: Linkedin, color: '#0A66C2' },
};

/** Soft per-person avatar tints (initials avatars — no photos are shared). */
const AVATAR_TONES = [
  'from-amber-400 to-rose-400',
  'from-sky-400 to-indigo-500',
  'from-emerald-400 to-teal-500',
  'from-violet-400 to-fuchsia-500',
];

const initials = (name: string) =>
  name
    .replace(/\./g, '')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

/** Wrap the verbatim highlight phrase in a marker so the key line pops. */
function withHighlight(quote: string, highlight?: string) {
  if (!highlight) return quote;
  const at = quote.indexOf(highlight);
  if (at < 0) return quote;
  return (
    <>
      {quote.slice(0, at)}
      <mark
        className="rounded-[3px] bg-transparent text-foreground"
        style={{
          backgroundImage: 'linear-gradient(rgb(var(--accent) / 0.2), rgb(var(--accent) / 0.2))',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0 90%',
          backgroundSize: '100% 42%',
        }}
      >
        {highlight}
      </mark>
      {quote.slice(at + highlight.length)}
    </>
  );
}

/** Crossfade between stacked quotes: the outgoing one leaves fast (ease-in),
 * the incoming one lands just after it (ease-out) — no gap, no layout shift. */
const quoteMotion: Variants = {
  hidden: (dir: number) => ({
    opacity: 0,
    y: dir * -10,
    filter: 'blur(6px)',
    transition: { duration: 0.2, ease: 'easeIn' },
  }),
  shown: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: EASE, delay: 0.12 } },
};

/**
 * Testimonials — "spotlight + switcher".
 *
 * One review at a time, set large and calm so it can actually be read, with the
 * client's own key phrase highlighted (verbatim — never paraphrased). A
 * reviewer list beside it (a row of chips on phones) shows who said what, on
 * which platform, at a glance — and switches the spotlight. Each review links
 * to its source so a recruiter can verify it in one click.
 *
 * Keyboard: the list is a tablist (↑/↓/←/→/Home/End); the arrow buttons step
 * through too. No autoplay — quotes are long; the reader sets the pace.
 */
export function Testimonials() {
  const t = useTranslations('testimonials');
  const locale = useLocale();
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const total = testimonials.length;

  const go = (next: number, focus = false) => {
    const i = (next + total) % total;
    setDir(next > active ? 1 : -1);
    setActive(i);
    if (focus) tabRefs.current[i]?.focus();
  };

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const map: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: total - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    go(map[e.key], true);
  }

  const platforms = Array.from(new Set(testimonials.map((x) => x.platform).filter(Boolean))) as NonNullable<
    Testimonial['platform']
  >[];

  return (
    <section id="testimonials" className="section">
      <SectionHeader overline={t('overline')} title={t('title')} lead={t('lead')} split />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: EASE }}
        className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]"
      >
        {/* ---------------- Spotlight ---------------- */}
        <div className="relative order-2 flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:order-1 lg:p-10">
          {/* soft accent wash */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/[0.08] blur-3xl"
          />
          <Quote className="relative h-10 w-10 text-accent/30" aria-hidden="true" />

          {/* All quotes share ONE grid cell, stacked. The cell is as tall as the
              longest quote at the current width, so the card never changes height
              when switching — the page doesn't jump, and the author row + arrows
              stay put. Inactive quotes are invisible, inert and aria-hidden. */}
          <div className="relative mt-4 grid flex-1">
            {testimonials.map((x, i) => {
              const on = i === active;
              return (
                <motion.figure
                  key={x.name}
                  custom={dir}
                  variants={quoteMotion}
                  initial={false}
                  animate={on ? 'shown' : 'hidden'}
                  id={on ? 'testimonial-panel' : undefined}
                  role={on ? 'tabpanel' : undefined}
                  aria-labelledby={on ? `testimonial-tab-${i}` : undefined}
                  aria-hidden={!on}
                  inert={!on}
                  className={`col-start-1 row-start-1 flex flex-col ${on ? '' : 'pointer-events-none'}`}
                >
                  <blockquote className="flex-1 text-pretty font-heading text-[1.1875rem] font-medium leading-[1.55] tracking-[-0.01em] text-foreground/90 sm:text-[1.375rem] lg:text-[1.5rem]">
                    {withHighlight(x.quote, x.highlight)}
                  </blockquote>

                  <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br font-heading text-body-sm font-bold text-white ${AVATAR_TONES[i % AVATAR_TONES.length]}`}
                      >
                        {initials(x.name)}
                      </span>
                      <div>
                        <p className="font-heading text-h4 text-foreground">{x.name}</p>
                        <p className="text-body-sm text-muted-foreground">
                          {x.role} · <span className="text-accent">{loc(x.project, locale)}</span>
                        </p>
                      </div>
                    </div>

                    {x.platform && x.url && (
                      <a
                        href={x.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/v inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[12.5px] font-medium text-foreground transition-colors duration-200 hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <BadgeCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                        {t('readOn', { platform: x.platform })}
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-hover/v:-translate-y-0.5 group-hover/v:translate-x-0.5" />
                      </a>
                    )}
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>

          {/* Stepper: counter + arrows */}
          <div className="relative mt-6 flex items-center justify-between">
            <p className="font-mono text-[12px] font-semibold tabular-nums tracking-wider text-muted-foreground">
              <span className="text-foreground">{String(active + 1).padStart(2, '0')}</span> /{' '}
              {String(total).padStart(2, '0')}
            </p>
            <div className="flex gap-2">
              <ArrowButton label={t('prev')} onClick={() => go(active - 1)}>
                <ArrowLeft className="h-4 w-4" />
              </ArrowButton>
              <ArrowButton label={t('next')} onClick={() => go(active + 1)}>
                <ArrowRight className="h-4 w-4" />
              </ArrowButton>
            </div>
          </div>
        </div>

        {/* ---------------- Reviewer switcher ---------------- */}
        <div className="order-1 flex min-w-0 flex-col gap-4 lg:order-2">
          {/* Proof strip */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
            <span className="mr-1 text-[12px] font-medium text-muted-foreground">{t('verified')}</span>
            {platforms.map((p) => {
              const { Icon, color } = PLATFORM[p];
              return (
                <span
                  key={p}
                  className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[12px] font-semibold text-foreground"
                >
                  <span style={{ color }}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {p}
                </span>
              );
            })}
          </div>

          <div
            role="tablist"
            aria-label={t('listLabel')}
            onKeyDown={onKeyDown}
            className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 sm:mx-0 sm:px-0 lg:flex-col lg:overflow-visible"
          >
            {testimonials.map((x, i) => {
              const on = i === active;
              const P = x.platform ? PLATFORM[x.platform] : null;
              return (
                <button
                  key={x.name}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={`testimonial-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="testimonial-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => go(i)}
                  className={`group relative flex min-w-[230px] shrink-0 items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition-[background-color,border-color,box-shadow] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:min-w-0 ${
                    on
                      ? 'border-accent/40 bg-accent/[0.06] shadow-sm'
                      : 'border-border bg-card hover:border-accent/25 hover:bg-muted/50'
                  }`}
                >
                  {/* active rail */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-3 left-0 w-1 rounded-r-full bg-accent transition-transform duration-300 ease-out ${
                      on ? 'scale-y-100' : 'scale-y-0'
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br font-heading text-[12px] font-bold text-white transition-transform duration-300 ${
                      AVATAR_TONES[i % AVATAR_TONES.length]
                    } ${on ? 'scale-105' : 'group-hover:scale-105'}`}
                  >
                    {initials(x.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-body-sm font-semibold text-foreground">{x.name}</span>
                    <span className="block truncate text-[12px] text-muted-foreground">{loc(x.project, locale)}</span>
                  </span>
                  {P && (
                    <span className="shrink-0" style={{ color: P.color }} title={x.platform}>
                      <P.Icon className="h-4 w-4" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function ArrowButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-all duration-200 ease-out hover:border-accent hover:bg-accent-solid hover:text-accent-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
    >
      {children}
    </button>
  );
}
