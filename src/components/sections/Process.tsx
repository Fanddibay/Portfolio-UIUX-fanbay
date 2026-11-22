'use client';

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Check, Mouse, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PREVIEWS } from './process/Previews';

const EASE = [0.16, 1, 0.3, 1] as const;
/** Where the pinned frame sticks (px from the viewport top). Clears the docked
 * stats band (54px) AND the navbar (64px), which slides back in whenever the
 * visitor scrolls up — so the stepper is never hidden under it. */
const PIN_TOP = 132;
/** Scroll distance spent on each step while pinned (vh). */
const STEP_VH = 60;

type Step = {
  label: string;
  title: string;
  body: string;
  deliverables: string[];
  tools: string[];
  ai: string;
  file: string;
};

/** Tools that have a brand mark in /public/brands — the rest render as text. */
const TOOL_LOGOS: Record<string, string> = {
  Figma: '/brands/figma.svg',
  Claude: '/brands/claude.svg',
  React: '/brands/react.svg',
  Vue: '/brands/vue.svg',
  ClickUp: '/brands/clickup.svg',
  Stitch: '/brands/stitch.svg',
};

/** Panel slides in the direction of travel (scrolling down → from the right). */
const panel: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 28, filter: 'blur(6px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: EASE } },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -28,
    filter: 'blur(6px)',
    transition: { duration: 0.2, ease: 'easeIn' },
  }),
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Process — scroll-driven ("scrollytelling").
 *
 * lg+: the stepper + panel pin to the screen and the page scroll runs the
 *   process — the rail fills continuously with scroll, the step switches every
 *   quarter of the way, and each step's preview replays. A mini bar under the
 *   active tab shows progress within that step. Clicking a tab (or ←/→) scrolls
 *   the page to that step, so scroll and selection never disagree.
 * <lg: a vertical scroll story — the left rail fills as you scroll, each step's
 *   marker lights up as it reaches the middle of the screen, and its preview
 *   plays when it first comes into view (a pinned panel this tall wouldn't fit
 *   a phone screen).
 *
 * Each step answers a recruiter's questions: what I do, what you get
 * (deliverables), with which tools, how AI helps — plus a preview of the output.
 */
export function Process() {
  const t = useTranslations('process');
  const steps = t.raw('steps') as Step[];

  return (
    <section id="process" className="section">
      <SectionHeader overline={t('overline')} title={t('title')} lead={t('lead')} split />
      <PinnedStory steps={steps} />
      <MobileStory steps={steps} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* lg+: pinned scrollytelling                                           */
/* ------------------------------------------------------------------ */

function PinnedStory({ steps }: { steps: Step[] }) {
  const t = useTranslations('process');
  const total = steps.length;
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const activeRef = useRef(0);

  // 0 → 1 across the pinned stretch (pin starts at PIN_TOP, ends when the
  // wrapper's bottom meets the viewport's bottom).
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: [`start ${PIN_TOP}px`, 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const i = Math.min(total - 1, Math.max(0, Math.floor(p * total)));
    if (i !== activeRef.current) {
      setDir(i > activeRef.current ? 1 : -1);
      activeRef.current = i;
      setActive(i);
    }
  });

  // Rail reaches node i exactly when step i activates; smooth between nodes.
  const railRaw = useTransform(scrollYProgress, (p) => Math.min(1, Math.max(0, (p * total) / (total - 1))));
  const rail = useSpring(railRaw, { stiffness: 140, damping: 30, mass: 0.4 });
  // Progress inside the active step (0 → 1).
  const local = useTransform(scrollYProgress, (p) => {
    const x = p * total;
    return Math.min(1, Math.max(0, x - Math.min(total - 1, Math.floor(x))));
  });

  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  /** Scroll the page so step i is the active one (lands ~20% into its stretch). */
  function goTo(i: number) {
    const el = wrapRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y0 = top - PIN_TOP;
    const y1 = top + el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: y0 + ((i + 0.2) / total) * (y1 - y0), behavior: reduce ? 'auto' : 'smooth' });
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const map: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: total - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const i = Math.min(total - 1, Math.max(0, map[e.key]));
    goTo(i);
    tabRefs.current[i]?.focus();
  }

  const step = steps[active];

  return (
    <div
      ref={wrapRef}
      className="relative hidden lg:block"
      style={{ height: `calc(100vh - ${PIN_TOP}px + ${total * STEP_VH}vh)` }}
    >
      <div className="sticky flex flex-col pt-[1.5vh]" style={{ top: PIN_TOP, height: `calc(100vh - ${PIN_TOP}px)` }}>
        {/* Stepper */}
        <div role="tablist" aria-label={t('tablistLabel')} onKeyDown={onKeyDown} className="relative grid grid-cols-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-6 h-0.5 rounded-full bg-border"
          >
            <motion.div style={{ scaleX: rail }} className="h-full origin-left rounded-full bg-accent" />
          </div>

          {steps.map((s, i) => {
            const isActive = i === active;
            const done = i < active;
            return (
              <button
                key={s.label}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`process-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls="process-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => goTo(i)}
                className="group relative flex flex-col items-center px-1 text-center focus-visible:outline-none"
              >
                <Node index={i} isActive={isActive} done={done} size="lg" />
                <span
                  className={`mt-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
                    isActive ? 'text-accent' : 'text-muted-foreground'
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`mt-1 font-heading text-h4 font-semibold leading-tight transition-colors duration-300 ${
                    isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  {s.title}
                </span>
                {/* In-step progress */}
                <span aria-hidden="true" className="mt-3 h-0.5 w-16 overflow-hidden rounded-full bg-transparent">
                  {isActive && <StepProgress value={local} />}
                </span>
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div className="relative mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div
              key={active}
              id="process-panel"
              role="tabpanel"
              aria-labelledby={`process-tab-${active}`}
              custom={dir}
              variants={panel}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid min-h-[420px] grid-cols-[1fr_1.1fr]"
            >
              <StepScene step={step} index={active} total={total} scroll={scrollYProgress} reduce={!!reduce} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scroll cue — fades once the story is underway */}
        <motion.p
          aria-hidden="true"
          style={{ opacity: hintOpacity }}
          className="mt-4 flex items-center justify-center gap-2 text-[12.5px] text-muted-foreground"
        >
          <Mouse className="h-4 w-4 motion-safe:animate-bounce" />
          {t('scrollHint')}
        </motion.p>
      </div>
    </div>
  );
}

function StepProgress({ value }: { value: MotionValue<number> }) {
  return <motion.span style={{ scaleX: value }} className="block h-full origin-left rounded-full bg-accent" />;
}

/**
 * One step's content, driven by ITS OWN slice of the scroll: 0 when the step
 * starts, 1 when the next one takes over. Computed from the global progress
 * (not the wrapped in-step value), so it never jumps 1 → 0 at a boundary, and
 * springed so a choppy wheel still animates smoothly. Coming back from a later
 * step, it mounts at ~1 (finished) and rewinds as you keep scrolling up.
 */
function StepScene({
  step,
  index,
  total,
  scroll,
  reduce,
}: {
  step: Step;
  index: number;
  total: number;
  scroll: MotionValue<number>;
  reduce: boolean;
}) {
  const raw = useTransform(scroll, (p) => Math.min(1, Math.max(0, p * total - index)));
  const smooth = useSpring(raw, { stiffness: 260, damping: 34, mass: 0.35 });
  const done = useMotionValue(1);
  const progress = reduce ? done : smooth;
  const Preview = PREVIEWS[index];

  return (
    <>
      <div className="p-10">
        <StepDetails step={step} index={index} total={total} progress={progress} />
      </div>
      <PreviewPane>
        <Preview file={step.file} progress={progress} />
      </PreviewPane>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* <lg: vertical scroll story                                           */
/* ------------------------------------------------------------------ */

function MobileStory({ steps }: { steps: Step[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 60%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <ol ref={listRef} className="relative lg:hidden">
      {/* Rail that fills as you scroll */}
      <div aria-hidden="true" className="absolute bottom-6 left-5 top-5 w-0.5 -translate-x-1/2 rounded-full bg-border">
        <motion.div style={{ scaleY: fill }} className="h-full origin-top rounded-full bg-accent" />
      </div>
      {steps.map((s, i) => (
        <MobileStep key={s.label} step={s} index={i} total={steps.length} />
      ))}
    </ol>
  );
}

function MobileStep({ step, index, total }: { step: Step; index: number; total: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // "Current" while the step crosses the middle band of the screen.
  const current = useInView(ref, { margin: '-45% 0px -45% 0px' });
  const seen = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });

  // Scrubbed by scroll, like desktop: the checklist ticks in as it rises
  // through the screen, the preview plays while it travels up the viewport.
  const { scrollYProgress: detailsP } = useScroll({ target: detailsRef, offset: ['start 85%', 'end 55%'] });
  const { scrollYProgress: previewP } = useScroll({ target: previewRef, offset: ['start 90%', 'end 50%'] });
  const detailsSmooth = useSpring(detailsP, { stiffness: 240, damping: 34, mass: 0.35 });
  const previewSmooth = useSpring(previewP, { stiffness: 240, damping: 34, mass: 0.35 });
  const done = useMotionValue(1);
  const Preview = PREVIEWS[index];

  return (
    <li ref={ref} className="relative pb-12 pl-14 last:pb-0">
      <div className="absolute left-5 top-0 -translate-x-1/2">
        <Node index={index} isActive={current} done={seen && !current} size="sm" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div ref={detailsRef}>
          <StepDetails step={step} index={index} total={total} compact progress={reduce ? done : detailsSmooth} />
        </div>
        <div ref={previewRef} className="mt-5 overflow-hidden rounded-2xl border border-border bg-muted/40 p-3">
          <Preview file={step.file} progress={reduce ? done : previewSmooth} />
        </div>
      </motion.div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Shared pieces                                                        */
/* ------------------------------------------------------------------ */

function Node({ index, isActive, done, size }: { index: number; isActive: boolean; done: boolean; size: 'sm' | 'lg' }) {
  return (
    <span
      className={`relative z-10 grid place-items-center rounded-full border-2 font-heading font-bold transition-[background-color,border-color,color,transform,box-shadow] duration-300 ease-out group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background ${
        size === 'lg' ? 'h-12 w-12 text-sm' : 'h-10 w-10 text-[13px]'
      } ${
        isActive
          ? 'scale-110 border-accent bg-accent-solid text-accent-foreground shadow-[0_0_0_6px_rgb(var(--accent)/0.14)]'
          : done
            ? 'border-accent bg-card text-accent'
            : 'border-border bg-card text-muted-foreground group-hover:border-accent/50 group-hover:text-foreground'
      }`}
    >
      {done ? <Check className="h-4 w-4" strokeWidth={3} /> : pad(index + 1)}
    </span>
  );
}

function Deliverable({ k, text, progress }: { k: number; text: string; progress: MotionValue<number> }) {
  // Ticks in across its own slice of the step's scroll.
  const p = useTransform(progress, [0.04 + k * 0.1, 0.14 + k * 0.1], [0, 1], { clamp: true });
  const x = useTransform(p, [0, 1], [-10, 0]);
  const check = useTransform(p, [0.4, 1], [0.4, 1]);
  return (
    <motion.li style={{ opacity: p, x }} className="flex items-center gap-2.5 text-body-sm font-medium text-foreground">
      <motion.span
        style={{ scale: check }}
        className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </motion.span>
      {text}
    </motion.li>
  );
}

function StepDetails({
  step,
  index,
  total,
  progress,
  compact = false,
}: {
  step: Step;
  index: number;
  total: number;
  progress: MotionValue<number>;
  compact?: boolean;
}) {
  const t = useTranslations('process');
  return (
    <div>
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
        {t('stepOf', { n: index + 1, total })} · {step.label}
      </p>
      <h3 className="mt-2 font-heading text-h3 text-foreground">{step.title}</h3>
      <p className={`mt-3 text-muted-foreground ${compact ? 'text-body-sm' : 'text-body'}`}>{step.body}</p>

      <p className="mt-5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {t('deliverables')}
      </p>
      <ul className="mt-2.5 space-y-2">
        {step.deliverables.map((d, k) => (
          <Deliverable key={d} k={k} text={d} progress={progress} />
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {t('tools')}
        </span>
        {step.tools.map((tool) => (
          <span
            key={tool}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-[12px] text-foreground"
          >
            {TOOL_LOGOS[tool] && (
              // eslint-disable-next-line @next/next/no-img-element -- tiny static SVG
              <img src={TOOL_LOGOS[tool]} alt="" aria-hidden="true" className="h-3.5 w-3.5 object-contain" />
            )}
            {tool}
          </span>
        ))}
      </div>

      <div className="mt-5 flex gap-3 rounded-xl border border-accent/20 bg-accent/[0.05] p-3.5">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        <div>
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-accent">{t('aiHere')}</p>
          <p className="mt-0.5 text-body-sm text-foreground">{step.ai}</p>
        </div>
      </div>
    </div>
  );
}

function PreviewPane({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex items-center justify-center border-l border-border bg-muted/40 p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_80%)]"
        style={{
          backgroundImage: 'radial-gradient(rgb(var(--foreground) / 0.07) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
      {/* Not aria-hidden: the Design preview has a real, focusable toggle */}
      <div className="relative flex w-full justify-center">{children}</div>
    </div>
  );
}
