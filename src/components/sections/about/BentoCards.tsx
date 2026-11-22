'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Code2, Component, FileText, Palette, Sparkle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  IconBrandFigma,
  IconBrandNextjs,
  IconBrandReact,
  IconBrandSupabase,
  IconBrandTailwind,
  IconBrandVue,
} from '@tabler/icons-react';
import { fadeUp } from '@/lib/motion';
import { FigmaMark } from '@/components/ui/FigmaMark';

/**
 * About bento — the visual cards for the About section. Layout follows a
 * feature-bento pattern (3 + 3, wider centre card); every card is rebuilt
 * around Fandi's actual skills and uses DESIGN.md tokens, so light/dark mode
 * and the accent colour come for free.
 *
 * Motion rules (DESIGN.md §7): enter curve [0.16, 1, 0.3, 1], exits faster and
 * ease-in, and every looping animation has a reduced-motion fallback.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/** SMIL loops only start after mount (keeps SSR markup identical) and never
 * under reduced motion — CSS media queries can't stop SMIL, so JS decides. */
function useLoopingMotion() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !reduce;
}

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

/**
 * Card shell. A soft accent spotlight follows the cursor on hover — position is
 * written straight to CSS variables, so moving the pointer never re-renders.
 */
export function BentoCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  function trackPointer(e: PointerEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  }

  return (
    <motion.article
      variants={fadeUp}
      onPointerMove={trackPointer}
      className={`group relative flex min-h-[288px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-colors duration-250 ease-out hover:border-accent/30 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgb(var(--accent) / 0.08), transparent 65%)',
        }}
      />
      {children}
    </motion.article>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="relative px-6 text-center font-heading text-h4 text-card-foreground">{children}</h3>
  );
}

/* ------------------------------------------------------------------ */
/* Card 1 — Design systems: the component tile snaps to the hovered cell */
/* ------------------------------------------------------------------ */

export function SystemsGrid() {
  const cols = 5;
  const rows = 3;
  const centre = Math.floor((cols * rows) / 2);
  const [active, setActive] = useState(centre);
  const reduce = useReducedMotion();
  const gridStyle = { gridTemplateColumns: `repeat(${cols}, 64px)`, gridTemplateRows: `repeat(${rows}, 64px)` };
  const cells = Array.from({ length: cols * rows });

  return (
    <div className="relative min-h-[216px] flex-1">
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        onPointerLeave={() => setActive(centre)}
      >
        <div className="relative" style={{ width: cols * 64, height: rows * 64 }}>
          {/* Layer 1 — grid lines, faded towards the edges */}
          <div
            className="pointer-events-none absolute inset-0 grid [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_35%,transparent_88%)]"
            style={gridStyle}
          >
            {cells.map((_, i) => (
              <div key={i} className="border border-border/70" />
            ))}
          </div>

          {/* Layer 2 — the component tile, never faded, follows the pointer */}
          <div className="absolute inset-0 grid" style={gridStyle}>
            {cells.map((_, i) => (
              <div
                key={i}
                data-cell={i}
                onPointerEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className="relative"
              >
                {active === i && (
                  <motion.div
                    layoutId="about-systems-tile"
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute inset-0 flex items-center justify-center rounded-sm bg-accent/10 ring-1 ring-accent/30"
                  >
                    <Component className="size-7 text-accent" strokeWidth={1.75} />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card 2 — Design ↔ Build: the existing About content, now as tabs     */
/* ------------------------------------------------------------------ */

export type Role = { key: 'design' | 'build'; title: string; body: string; items: string[] };

export function RoleTabs({ roles, label }: { roles: Role[]; label: string }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const role = roles[active];
  const Icon = role.key === 'design' ? Palette : Code2;

  // Arrow keys move between tabs (WAI-ARIA tabs pattern, same as WorkTabs)
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + roles.length) % roles.length;
    setActive(next);
    document.getElementById(`about-tab-${roles[next].key}`)?.focus();
  }

  return (
    <div className="relative flex flex-1 flex-col p-6 md:p-8">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="inline-flex self-center rounded-full border border-border bg-muted p-1"
      >
        {roles.map((r, i) => {
          const selected = i === active;
          return (
            <button
              key={r.key}
              id={`about-tab-${r.key}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="about-role-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative min-h-[36px] rounded-full px-5 font-body text-body-sm font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selected ? 'text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="about-role-pill"
                  transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 38 }}
                  className="absolute inset-0 rounded-full bg-accent-solid"
                />
              )}
              <span className="relative">{r.title}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={role.key}
          id="about-role-panel"
          role="tabpanel"
          aria-labelledby={`about-tab-${role.key}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.3, ease: EASE } }}
          exit={{ opacity: 0, y: -6, transition: { duration: reduce ? 0 : 0.18, ease: 'easeIn' } }}
          className="mt-8 flex flex-1 flex-col items-center text-center"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Icon className="size-6" />
          </div>
          <h3 className="mt-4 font-heading text-h3 text-card-foreground">{role.title}</h3>
          <p className="mt-2 max-w-sm text-body text-muted-foreground">{role.body}</p>

          <ul className="mt-6 grid w-full max-w-md gap-2 sm:grid-cols-2">
            {role.items.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.08 + i * 0.06, duration: 0.3, ease: EASE }}
                className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2 text-left text-body-sm text-foreground"
              >
                <Check className="size-4 shrink-0 text-accent" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card 3 — Figma + AI: AI tools orbit Figma; hover pauses the orbit    */
/* ------------------------------------------------------------------ */

const ORBIT = { cx: 130, cy: 72, rx: 104, ry: 44 };
const ORBIT_PATH = `M${ORBIT.cx - ORBIT.rx} ${ORBIT.cy} a${ORBIT.rx} ${ORBIT.ry} 0 1 0 ${ORBIT.rx * 2} 0 a${ORBIT.rx} ${ORBIT.ry} 0 1 0 ${-ORBIT.rx * 2} 0`;
const ORBIT_SECONDS = 14;
const AI_MARKS = [
  { name: 'Claude', src: '/brands/claude.svg' },
  { name: 'Stitch', src: '/brands/stitch.svg' },
  { name: 'Google AI Studio', src: '/brands/google-ai-studio.svg' },
];

export function AiOrbit() {
  const svgRef = useRef<SVGSVGElement>(null);
  const animate = useLoopingMotion();
  const shadowId = `orbit-shadow-${useId().replace(/:/g, '')}`;
  const step = ORBIT_SECONDS / AI_MARKS.length;

  return (
    <div
      className="relative min-h-[200px] flex-1"
      onPointerEnter={() => svgRef.current?.pauseAnimations()}
      onPointerLeave={() => svgRef.current?.unpauseAnimations()}
    >
      <p className="sr-only">{AI_MARKS.map((m) => m.name).join(', ')}</p>
      <svg ref={svgRef} viewBox="0 0 260 150" aria-hidden="true" className="absolute inset-0 h-full w-full">
        <defs>
          <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.14" />
          </filter>
        </defs>

        <ellipse
          cx={ORBIT.cx}
          cy={ORBIT.cy}
          rx={ORBIT.rx}
          ry={ORBIT.ry}
          fill="none"
          strokeDasharray="3 6"
          className="stroke-border"
        />

        {/* Figma at the centre */}
        <g transform={`translate(${ORBIT.cx} ${ORBIT.cy})`} filter={`url(#${shadowId})`}>
          <rect x="-30" y="-30" width="60" height="60" rx="16" className="fill-card stroke-border" />
          <FigmaMark x={-11} y={-16.5} width={22} height={33} />
        </g>

        <Sparkle x={214} y={20} size={12} className="animate-pulse fill-accent text-accent" />
        <Sparkle x={30} y={118} size={10} className="animate-pulse fill-accent text-accent [animation-delay:700ms]" />

        {/* AI tools riding the orbit (static positions until mounted / under reduced motion) */}
        {AI_MARKS.map((m, i) => {
          const angle = (i / AI_MARKS.length) * Math.PI * 2 + Math.PI / 2;
          const staticPos = animate
            ? undefined
            : `translate(${ORBIT.cx + ORBIT.rx * Math.cos(angle)} ${ORBIT.cy + ORBIT.ry * Math.sin(angle)})`;
          return (
            <g key={m.name} transform={staticPos}>
              {animate && (
                <animateMotion
                  dur={`${ORBIT_SECONDS}s`}
                  begin={`${-i * step}s`}
                  repeatCount="indefinite"
                  path={ORBIT_PATH}
                />
              )}
              <g filter={`url(#${shadowId})`}>
                <circle r="19" className="fill-card stroke-border" />
                <image href={m.src} x="-11" y="-11" width="22" height="22" />
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card 4 — Code: the same component in Vue and React                  */
/* ------------------------------------------------------------------ */

type Token = [text: string, className?: string];
const S = {
  kw: 'text-violet-600 dark:text-violet-400',
  fn: 'text-accent',
  tag: 'text-rose-700 dark:text-rose-400',
  attr: 'text-amber-700 dark:text-amber-400',
  str: 'text-emerald-700 dark:text-emerald-400',
  expr: 'text-sky-700 dark:text-sky-400',
};

const FILES: Record<'vue' | 'react', { name: string; lines: Token[][] }> = {
  vue: {
    name: 'StatCard.vue',
    lines: [
      [['<template>', S.tag]],
      [['  '], ['<div', S.tag], [' '], ['class', S.attr], ['='], ['"rounded-xl p-4"', S.str], ['>', S.tag]],
      [['    '], ['<p>', S.tag], ['{{ label }}', S.expr], ['</p>', S.tag]],
      [['    '], ['<h3>', S.tag], ['{{ value }}', S.expr], ['</h3>', S.tag]],
      [['  '], ['</div>', S.tag]],
      [['</template>', S.tag]],
    ],
  },
  react: {
    name: 'StatCard.tsx',
    lines: [
      [['export function ', S.kw], ['StatCard', S.fn], ['(p) {']],
      [['  '], ['return', S.kw], [' (']],
      [['    '], ['<div', S.tag], [' '], ['className', S.attr], ['='], ['"rounded-xl p-4"', S.str], ['>', S.tag]],
      [['      '], ['<p>', S.tag], ['{p.label}', S.expr], ['</p>', S.tag]],
      [['      '], ['<h3>', S.tag], ['{p.value}', S.expr], ['</h3>', S.tag]],
      [['    '], ['</div>', S.tag]],
    ],
  },
};

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

export function CodeWindow() {
  const [file, setFile] = useState<'vue' | 'react'>('vue');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  const current = FILES[file];

  return (
    <div ref={ref} className="relative min-h-[200px] flex-1">
      <div aria-hidden="true" className="absolute inset-x-8 bottom-4 h-32 rounded-3xl bg-accent/15 blur-2xl" />

      {/* Anchored under the title (never covers it); the overflow bleeds off the card's bottom edge */}
      <div className="absolute left-4 right-4 top-4 overflow-hidden rounded-2xl border border-b-0 border-border bg-background shadow-lg">
        {/* Window chrome + file tabs */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-green-400" />
            </div>
            <div role="tablist" aria-label="Code example" className="flex gap-1">
              {(Object.keys(FILES) as ('vue' | 'react')[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={file === key}
                  onClick={() => setFile(key)}
                  className={`rounded-md px-2 py-1 text-[11px] transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    file === key ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  style={{ fontFamily: MONO }}
                >
                  {FILES[key].name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border" />

        {/* Lines appear one by one, like they're being typed */}
        <pre className="overflow-hidden px-5 pb-10 pt-4 text-[12.5px] leading-6 text-foreground" style={{ fontFamily: MONO }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.code key={file} className="block" exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } }}>
              {current.lines.map((line, i) => (
                <motion.span
                  key={i}
                  className="block whitespace-pre"
                  initial={{ opacity: 0, x: -6 }}
                  animate={inView ? { opacity: 1, x: 0 } : undefined}
                  transition={{ delay: reduce ? 0 : i * 0.08, duration: 0.25, ease: EASE }}
                >
                  {line.map(([text, cls], j) => (
                    <span key={j} className={cls}>
                      {text}
                    </span>
                  ))}
                  {i === current.lines.length - 1 && (
                    <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-accent" />
                  )}
                </motion.span>
              ))}
            </motion.code>
          </AnimatePresence>
        </pre>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card 5 — Stack belt: tools ride a conveyor; hover pauses it         */
/* ------------------------------------------------------------------ */

const BELT_PATH = 'M-40 150C20 150 55 90 185.5 90C316 90 351 150 411 150';
const BELT_SECONDS = 22;
const STACK = [
  { name: 'Figma', Icon: IconBrandFigma, bg: '#1E1E1E', fg: '#FFFFFF' },
  { name: 'Vue', Icon: IconBrandVue, bg: '#42B883', fg: '#FFFFFF' },
  { name: 'React', Icon: IconBrandReact, bg: '#20232A', fg: '#61DAFB' },
  { name: 'Tailwind CSS', Icon: IconBrandTailwind, bg: '#0EA5E9', fg: '#FFFFFF' },
  { name: 'Supabase', Icon: IconBrandSupabase, bg: '#1C1C1C', fg: '#3ECF8E' },
  { name: 'Next.js', Icon: IconBrandNextjs, bg: '#000000', fg: '#FFFFFF' },
];

export function StackBelt() {
  const svgRef = useRef<SVGSVGElement>(null);
  const animate = useLoopingMotion();
  const shadowId = `belt-shadow-${useId().replace(/:/g, '')}`;
  const step = BELT_SECONDS / STACK.length;

  return (
    <div
      className="relative min-h-[200px] flex-1"
      onPointerEnter={() => svgRef.current?.pauseAnimations()}
      onPointerLeave={() => svgRef.current?.unpauseAnimations()}
    >
      <p className="sr-only">{STACK.map((s) => s.name).join(', ')}</p>

      {animate ? (
        <svg
          ref={svgRef}
          viewBox="0 0 371 210"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="10" stdDeviation="9" floodOpacity="0.22" />
            </filter>
          </defs>
          <path d={BELT_PATH} fill="none" strokeDasharray="3 7" className="stroke-border" />
          {STACK.map(({ name, Icon, bg, fg }, i) => (
            <g key={name}>
              <animateMotion
                dur={`${BELT_SECONDS}s`}
                begin={`${-i * step}s`}
                repeatCount="indefinite"
                rotate="auto"
                path={BELT_PATH}
              />
              <g filter={`url(#${shadowId})`}>
                <rect x="-27" y="-27" width="54" height="54" rx="15" fill={bg} />
                <Icon x={-14} y={-14} size={28} stroke={1.75} color={fg} />
              </g>
            </g>
          ))}
        </svg>
      ) : (
        // Static fallback: before mount and under prefers-reduced-motion
        <div aria-hidden="true" className="absolute inset-0 flex flex-wrap content-center items-center justify-center gap-3 px-6">
          {STACK.map(({ name, Icon, bg, fg }) => (
            <span
              key={name}
              className="flex size-12 items-center justify-center rounded-[14px] shadow-md"
              style={{ background: bg }}
            >
              <Icon size={24} stroke={1.75} color={fg} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card 6 — Brief → PRD: read the brief, extract requirements, map them */
/* ------------------------------------------------------------------ */

/**
 * One hue per requirement, shared by its brief highlight, its PRD chip and its
 * coverage segment — colour is the thread that traces phrase → requirement.
 * (Tailwind amber-400 / sky-400 / violet-400 as rgb channels.)
 */
const REQ_HUES = [
  { rgb: '251 191 36', chip: 'bg-amber-400/15 text-amber-700 dark:text-amber-300', bar: 'bg-amber-400' },
  { rgb: '56 189 248', chip: 'bg-sky-400/15 text-sky-700 dark:text-sky-300', bar: 'bg-sky-400' },
  { rgb: '167 139 250', chip: 'bg-violet-400/15 text-violet-700 dark:text-violet-300', bar: 'bg-violet-400' },
];

type Req = { title: string; screen: string };

/**
 * Loop (in view only): a highlighter sweeps each key phrase of a client brief,
 * and every highlighted phrase becomes a PRD requirement mapped to a screen,
 * filling the coverage bar to 3/3. Hover the card to explore the finished map —
 * hovering a requirement lights up the phrase it came from (and vice versa):
 * every screen stays traceable to the brief. Reduced motion → static, complete.
 */
export function BriefToPrd() {
  const t = useTranslations('about.prd');
  const reqs = t.raw('reqs') as Req[];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-40px' });
  const reduce = useReducedMotion();

  // step = how many requirements have been extracted (0 … 3)
  const [step, setStep] = useState(0);
  const [exploring, setExploring] = useState(false);
  const [focus, setFocus] = useState<number | null>(null);
  const done = step >= reqs.length;

  useEffect(() => {
    if (reduce) {
      setStep(reqs.length);
      return;
    }
    if (!inView || exploring) return;
    // beat: brief rests → 3 extractions → hold the finished map → reset
    const wait = step === 0 ? 800 : step < reqs.length ? 1150 : 3200;
    const id = setTimeout(() => setStep((s) => (s >= reqs.length ? 0 : s + 1)), wait);
    return () => clearTimeout(id);
  }, [step, inView, exploring, reduce, reqs.length]);

  const marked = (i: number) => step > i;
  const dimmed = (i: number) => focus !== null && focus !== i;

  /** Highlighter: a gradient whose width animates 0 → 100%. With the default
   * box-decoration-break (slice) it sweeps line by line, like a real marker.
   * A plain render helper (not a component) so the <span> stays the same DOM
   * node between steps and the CSS transition actually runs. */
  const mark = (i: number, children: ReactNode) => {
    const on = marked(i);
    const strong = focus === i;
    return (
      <span
        key={i}
        onPointerEnter={() => on && setFocus(i)}
        onPointerLeave={() => setFocus(null)}
        className="rounded-[3px] transition-[background-size,opacity,color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          backgroundImage: `linear-gradient(rgb(${REQ_HUES[i].rgb} / ${strong ? 0.5 : 0.32}), rgb(${REQ_HUES[i].rgb} / ${strong ? 0.5 : 0.32}))`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0 88%',
          backgroundSize: `${on ? 100 : 0}% ${strong ? 100 : 62}%`,
          color: on ? 'rgb(var(--foreground))' : undefined,
          opacity: dimmed(i) ? 0.45 : 1,
        }}
      >
        {children}
      </span>
    );
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      onPointerEnter={() => {
        setExploring(true);
        setStep(reqs.length); // fast-forward: show the whole map to explore
      }}
      onPointerLeave={() => {
        setExploring(false);
        setFocus(null);
      }}
      className="relative grid flex-1 content-center gap-2.5 px-5 pb-5 pt-3 md:grid-cols-2 md:items-center lg:grid-cols-1"
    >
      {/* --- The brief --- */}
      <div className="rounded-xl border border-border bg-muted/40 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <FileText className="h-3 w-3" />
            {t('file')}
          </span>
          <AnimatePresence mode="popLayout" initial={false}>
            {done ? (
              <motion.span
                key="found"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.2, ease: 'easeIn' } }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex items-center gap-1 text-[10.5px] font-medium text-emerald-700 dark:text-emerald-400"
              >
                <Check className="h-3 w-3" strokeWidth={3} />
                {t('found', { count: reqs.length })}
              </motion.span>
            ) : (
              <motion.span
                key="reading"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.2, ease: 'easeIn' } }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
                {t('reading')}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-1.5 text-[12px] leading-[1.6] text-muted-foreground">
          {t.rich('brief', {
            r1: (c) => mark(0, c),
            r2: (c) => mark(1, c),
            r3: (c) => mark(2, c),
          })}
        </p>
      </div>

      {/* --- The PRD it becomes --- */}
      <div>
        <div className="flex items-center gap-2 px-0.5">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {t('coverage')}
          </span>
          <span className="flex flex-1 gap-1">
            {reqs.map((_, i) => (
              <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.span
                  className={`block h-full origin-left rounded-full ${REQ_HUES[i].bar}`}
                  initial={false}
                  animate={{ scaleX: marked(i) ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: marked(i) ? 0.25 : 0 }}
                />
              </span>
            ))}
          </span>
          <span className="font-mono text-[10px] font-semibold tabular-nums text-foreground">
            {Math.min(step, reqs.length)}/{reqs.length}
          </span>
        </div>

        <ul className="mt-1.5 space-y-0.5">
          {reqs.map((r, i) => {
            const on = marked(i);
            return (
              <li
                key={i}
                onPointerEnter={() => on && setFocus(i)}
                onPointerLeave={() => setFocus(null)}
                className="relative h-7"
              >
                {/* Skeleton slot — the row "fills in" when its phrase is read */}
                <span
                  className={`absolute inset-y-[7px] left-0 right-10 rounded-md bg-muted transition-opacity duration-300 ${
                    on ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <motion.div
                  initial={false}
                  animate={
                    on
                      ? { opacity: dimmed(i) ? 0.45 : 1, y: 0, filter: 'blur(0px)' }
                      : { opacity: 0, y: -6, filter: 'blur(4px)' }
                  }
                  transition={{ duration: on ? 0.55 : 0.25, ease: on ? EASE : 'easeIn', delay: on ? 0.15 : 0 }}
                  className={`absolute inset-0 flex items-center gap-2 rounded-lg px-1.5 transition-colors duration-200 ${
                    focus === i ? 'bg-muted/70' : ''
                  }`}
                >
                  <span
                    className={`shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[9.5px] font-bold ${REQ_HUES[i].chip}`}
                  >
                    R{i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-foreground">{r.title}</span>
                  <span className="hidden shrink-0 items-center gap-1 text-[10.5px] text-muted-foreground min-[400px]:flex">
                    <ArrowRight className="h-2.5 w-2.5" />
                    {r.screen}
                  </span>
                  <motion.span
                    initial={false}
                    animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22, delay: on ? 0.45 : 0 }}
                    className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-500 text-white"
                  >
                    <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                  </motion.span>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
