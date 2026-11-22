'use client';

import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Orbit, ToolRow } from '@/components/sections/hero/ToolOrbit';
import { PortfolioMockup } from '@/components/sections/hero/PortfolioMockup';
import { ClientLogos } from '@/components/sections/hero/ClientLogos';
import { useIntroReady } from '@/lib/useIntroReady';
import { SITE } from '@/lib/data';

const EASE = [0.16, 1, 0.3, 1] as const;

function renderHighlighted(text: string) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-semibold text-foreground">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** Split the headline into words; a lone dash sticks to the word before it so
 * a line never starts with "—". */
function toWords(text: string) {
  return text.split(' ').reduce<string[]>((acc, w) => {
    if (/^[—–-]$/.test(w) && acc.length) acc[acc.length - 1] += ` ${w}`;
    else acc.push(w);
    return acc;
  }, []);
}

/* Entrance choreography: badge → words (blur-in) → copy → CTAs, then the
 * orbit tiles pop and the mockup rises (timed inside those components). */
const intro: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
/** Same rise, held back so the copy lands while the headline finishes. */
const riseAfter = (delay: number): Variants => ({
  hidden: rise.hidden,
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay } },
});
const word: Variants = {
  hidden: { opacity: 0, y: '0.35em', filter: 'blur(10px)' },
  visible: { opacity: 1, y: '0em', filter: 'blur(0px)', transition: { duration: 0.75, ease: EASE } },
};

/** Hand-drawn accent stroke under the name — draws itself in after the greeting
 * lands, and redraws on hover (a small signature, literally). */
function NameUnderline({ ready }: { ready: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 10"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -bottom-2 left-0 h-2.5 w-full overflow-visible"
    >
      <motion.path
        d="M2 6.5 C 22 2.5, 42 2.5, 60 5.5 S 98 8.5, 118 3.5"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ stroke: 'rgb(var(--accent))' }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={ready ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
        className="group-hover/name:animate-[name-redraw_0.9s_cubic-bezier(0.16,1,0.3,1)]"
      />
    </svg>
  );
}

function ExperienceBadge() {
  const t = useTranslations('heroShowcase');
  return (
    <motion.div variants={rise} className="flex items-center gap-3">
      {/* Just me — a soft accent ring + "available" dot; lifts a touch on hover */}
      <span className="group/me relative block h-10 w-10 shrink-0 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:scale-105">
        <span className="absolute inset-0 overflow-hidden rounded-full bg-gradient-to-b from-accent/30 to-accent/5 ring-2 ring-background shadow-[0_0_0_3px_rgb(var(--accent)/0.18)]">
          <Image src="/profile.webp" alt={SITE.name} fill sizes="40px" className="object-cover object-top" priority />
        </span>
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
      </span>
      <p className="text-body-sm text-muted-foreground">
        <span className="font-heading text-[1.0625rem] font-bold tracking-tight text-foreground">
          {t('years', { count: SITE.yearsExperience })}
        </span>{' '}
        {t('yearsLabel')}
      </p>
    </motion.div>
  );
}

/**
 * Hero — SaaS-launch layout (centred thesis + product shot), adapted to a
 * designer-engineer portfolio:
 *   badge (4+ years, avatars = me + companies) → headline → copy → CTAs
 *   tools I use orbit the headline (Figma, Claude | React, Vue, ClickUp)
 *   a live "portfolio dashboard" replaces the product screenshot
 *   a "trusted by" strip lists clients & platforms from the Experience timeline
 *
 * Copy comes unchanged from the `hero` namespace; new UI strings live in
 * `heroShowcase`. The entrance waits for the preloader curtain (useIntroReady).
 */
export function Hero() {
  const t = useTranslations('hero');
  const ts = useTranslations('heroShowcase');
  const taglineAccent = ts.raw('taglineAccent') as string[];
  const ready = useIntroReady();

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="relative mx-auto max-w-content px-6 pt-12 md:px-8 md:pt-20">
        <motion.div
          variants={intro}
          initial="hidden"
          animate={ready ? 'visible' : 'hidden'}
          className="relative mx-auto flex max-w-[840px] flex-col items-center text-center"
        >
          <ExperienceBadge />

          <motion.h1
            variants={intro}
            className="mt-6 text-balance font-heading font-extrabold leading-[1.04] tracking-[-0.035em] text-foreground md:mt-7"
            style={{ fontSize: 'clamp(2rem, 7.6vw, 4.75rem)' }}
          >
            {/* Who this is — inside the h1 so people AND search engines read
                "Fandi Bayu, UI/UX Designer" before the promise. */}
            <motion.span
              variants={rise}
              className="mb-4 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 font-heading font-semibold text-muted-foreground md:mb-5"
              style={{ fontSize: 'clamp(1.0625rem, 1.9vw, 1.375rem)', letterSpacing: '-0.01em', lineHeight: 1.35 }}
            >
              <span>{ts('greeting')}</span>
              <span className="group/name relative whitespace-nowrap font-bold text-foreground">
                {SITE.name}
                <NameUnderline ready={ready} />
              </span>
              {/* Thin vertical divider between name and role (a UI mark, not
                  punctuation). Phones: the role drops to its own line instead. */}
              <span aria-hidden="true" className="hidden h-[0.95em] w-px translate-y-[0.12em] self-baseline bg-muted-foreground/40 sm:inline-block" />
              <span className="sr-only">, </span>
              <span className="basis-full sm:basis-auto">{t('role')}</span>
              <span className="sr-only">. </span>
            </motion.span>
            {toWords(t('tagline')).map((w, i) => {
              // The two verbs of the promise ("design", "build") in brand blue,
              // a touch heavier: the face tops out at 800, so a hairline stroke
              // in the same colour adds weight without changing the letterforms.
              // Only the letters turn blue; trailing punctuation ("membangunnya.")
              // keeps the headline colour.
              const [, core = w, tail = ''] = w.match(/^(\p{L}+)(.*)$/u) ?? [];
              const accent = taglineAccent.includes(core.toLowerCase());
              return (
                <span key={i}>
                  <motion.span variants={word} className="inline-block">
                    {accent ? (
                      <>
                        <span className="text-accent [-webkit-text-stroke:0.02em_currentColor]">{core}</span>
                        {tail}
                      </>
                    ) : (
                      w
                    )}
                  </motion.span>{' '}
                </span>
              );
            })}
          </motion.h1>

          <motion.p
            variants={riseAfter(0.35)}
            className="mt-6 max-w-[620px] text-pretty text-body text-muted-foreground md:text-body-lg"
          >
            {renderHighlighted(t('description'))}
          </motion.p>

          <motion.div variants={riseAfter(0.45)} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              as="a"
              href="#contact"
              variant="primary"
              className="group/cta min-h-[48px] rounded-xl px-7 shadow-[0_12px_28px_-10px_rgb(37_99_235/0.55)] hover:-translate-y-0.5"
            >
              {t('cta')}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
            </Button>
            <Button
              as="a"
              href="#work"
              variant="secondary"
              className="group/cta2 min-h-[48px] rounded-xl bg-card px-7 hover:-translate-y-0.5"
            >
              {ts('ctaSecondary')}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta2:translate-x-0.5" />
            </Button>
          </motion.div>
        </motion.div>

        <ToolRow ready={ready} />
        <PortfolioMockup ready={ready} />
        <ClientLogos />
      </div>

      {/* Rings + tool tiles share one centre; rendered after the content so the
          tiles sit above it (z-10) and stay hoverable. */}
      <Orbit ready={ready} />
    </section>
  );
}
