'use client';

import { useId, useState, type ReactNode } from 'react';
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Check, Lightbulb, Rocket } from 'lucide-react';

/**
 * Process previews — one tiny artefact per step, SCRUBBED BY SCROLL:
 *   Discover → sticky notes appear, cluster, and an insight lands
 *   Define   → a user flow draws itself node by node (with the edge-case branch)
 *   Design   → wireframe fills in to hi-fi, chart bars grow (toggle still clickable)
 *   Deliver  → component code types out, the build passes, it ships
 *
 * Every animation reads `progress` (0 → 1 = how far the visitor has scrolled
 * through this step). Scroll slowly → it plays slowly; scroll back → it
 * rewinds; scroll fast → it's done by the time the step changes. Each timeline
 * finishes by ~0.85 so the result holds on screen before the next step.
 * Reduced motion → callers pass a constant 1 (final state).
 */

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

export type PreviewProps = { file: string; progress: MotionValue<number> };

/** 0 → 1 while progress moves across [a, b] (clamped). */
function useRange(progress: MotionValue<number>, a: number, b: number) {
  return useTransform(progress, [a, b], [0, 1], { clamp: true });
}

/** Boolean that flips when progress crosses `at` (for text swaps / class states). */
function useCrossed(progress: MotionValue<number>, at: number) {
  const [crossed, setCrossed] = useState(() => progress.get() >= at);
  useMotionValueEvent(progress, 'change', (v) => setCrossed(v >= at));
  return crossed;
}

/** App-window chrome shared by all previews. */
function Frame({ file, action, children }: { file: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_28px_60px_-32px_rgb(15_23_42/0.45)] dark:shadow-[0_28px_60px_-32px_rgb(0_0_0/0.9)]">
      <div className="flex h-9 items-center gap-1.5 border-b border-border px-3">
        <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
        <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
        <span className="h-2 w-2 rounded-full bg-[#28C840]" />
        <span className="ml-2 truncate text-[10.5px] text-muted-foreground" style={{ fontFamily: MONO }}>
          {file}
        </span>
        {action && <span className="ml-auto">{action}</span>}
      </div>
      <div className="relative h-[232px] overflow-hidden p-4">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 01 Discover — notes → insight                                        */
/* ------------------------------------------------------------------ */

const NOTE_TONES = [
  'bg-amber-100 text-amber-950 dark:bg-amber-400/15 dark:text-amber-100',
  'bg-sky-100 text-sky-950 dark:bg-sky-400/15 dark:text-sky-100',
  'bg-rose-100 text-rose-950 dark:bg-rose-400/15 dark:text-rose-100',
  'bg-emerald-100 text-emerald-950 dark:bg-emerald-400/15 dark:text-emerald-100',
];
// left in %, top in px, rotate in deg
const SCATTER = [
  { left: 2, top: 4, rotate: -7 },
  { left: 52, top: 0, rotate: 6 },
  { left: 8, top: 118, rotate: 5 },
  { left: 55, top: 124, rotate: -5 },
];
const CLUSTER = [
  { left: 1, top: 6, rotate: -2 },
  { left: 5, top: 50, rotate: 2 },
  { left: 1, top: 94, rotate: -1.5 },
  { left: 5, top: 138, rotate: 1.5 },
];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function Note({ i, text, progress }: { i: number; text: string; progress: MotionValue<number> }) {
  const appear = useRange(progress, 0.02 + i * 0.07, 0.14 + i * 0.07); // notes pop in one by one
  const gather = useRange(progress, 0.38, 0.62); // …then cluster together
  const left = useTransform(gather, (g) => `${lerp(SCATTER[i].left, CLUSTER[i].left, g)}%`);
  const top = useTransform(gather, (g) => lerp(SCATTER[i].top, CLUSTER[i].top, g));
  const rotate = useTransform(gather, (g) => lerp(SCATTER[i].rotate, CLUSTER[i].rotate, g));
  const scale = useTransform(appear, [0, 1], [0.8, 1]);
  return (
    <motion.div
      style={{ left, top, rotate, scale, opacity: appear }}
      className={`absolute w-[42%] rounded-md px-2.5 py-2 text-[10.5px] font-medium leading-snug shadow-sm ${NOTE_TONES[i]}`}
    >
      {text}
    </motion.div>
  );
}

function ResearchPreview({ file, progress }: PreviewProps) {
  const t = useTranslations('process.preview');
  const notes = t.raw('notes') as string[];
  const link = useRange(progress, 0.62, 0.72);
  const insight = useRange(progress, 0.66, 0.84);
  const insightX = useTransform(insight, [0, 1], [16, 0]);
  const insightScale = useTransform(insight, [0, 1], [0.96, 1]);

  return (
    <Frame file={file}>
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(rgb(var(--foreground) / 0.08) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />
      {notes.map((note, i) => (
        <Note key={i} i={i} text={note} progress={progress} />
      ))}

      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <motion.line
          x1="47.5%"
          y1="50%"
          x2="54%"
          y2="50%"
          className="stroke-accent"
          strokeWidth={2}
          strokeLinecap="round"
          style={{ pathLength: link, opacity: link }}
        />
      </svg>

      {/* Centring lives on the wrapper; framer owns the inner transform. */}
      <div className="absolute right-4 top-1/2 w-[44%] -translate-y-1/2">
        <motion.div
          style={{ opacity: insight, x: insightX, scale: insightScale }}
          className="rounded-xl border border-accent/30 bg-card p-3 shadow-[0_16px_32px_-18px_rgb(37_99_235/0.55)]"
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
            <Lightbulb className="h-3 w-3" />
            {t('insightLabel')}
          </span>
          <p className="mt-2 font-heading text-[12.5px] font-semibold leading-snug text-foreground">{t('insight')}</p>
        </motion.div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 02 Define — user flow draws itself                                   */
/* ------------------------------------------------------------------ */

type FlowNode = { x: number; y: number; w: number; tone: string };
const NODE_H = 34;
const FLOW: FlowNode[] = [
  { x: 2, y: 78, w: 92, tone: 'fill-card stroke-border' },
  { x: 110, y: 78, w: 96, tone: 'fill-card stroke-border' },
  { x: 222, y: 78, w: 112, tone: 'fill-amber-400/15 stroke-amber-400' },
  { x: 222, y: 6, w: 112, tone: 'fill-emerald-400/15 stroke-emerald-500' },
  { x: 222, y: 150, w: 112, tone: 'fill-rose-400/15 stroke-rose-400' },
];
// Order of construction: node → edge → node → edge → decision → branches.
const NODE_AT = [0.04, 0.24, 0.44, 0.66, 0.66];
const EDGES = [
  { d: 'M94 95 H108', at: 0.14 },
  { d: 'M206 95 H220', at: 0.34 },
  { d: 'M278 78 V42', at: 0.55 },
  { d: 'M278 112 V148', at: 0.55 },
];
const SPAN = 0.1; // how much scroll each piece takes to appear

function FlowNodeEl({
  n,
  label,
  at,
  progress,
}: {
  n: FlowNode;
  label: string;
  at: number;
  progress: MotionValue<number>;
}) {
  const p = useRange(progress, at, at + SPAN);
  const y = useTransform(p, [0, 1], [6, 0]);
  return (
    <motion.g style={{ opacity: p, y }}>
      <rect x={n.x} y={n.y} width={n.w} height={NODE_H} rx={9} strokeWidth={1.25} className={n.tone} />
      <text
        x={n.x + n.w / 2}
        y={n.y + NODE_H / 2 + 3.5}
        textAnchor="middle"
        className="fill-foreground text-[10px] font-medium"
      >
        {label}
      </text>
    </motion.g>
  );
}

function FlowEdge({
  d,
  at,
  marker,
  progress,
}: {
  d: string;
  at: number;
  marker: string;
  progress: MotionValue<number>;
}) {
  const p = useRange(progress, at, at + SPAN);
  return (
    <motion.path
      d={d}
      fill="none"
      strokeWidth={1.5}
      className="stroke-muted-foreground"
      markerEnd={`url(#${marker})`}
      style={{ pathLength: p, opacity: p }}
    />
  );
}

function DefinePreview({ file, progress }: PreviewProps) {
  const t = useTranslations('process.preview');
  const labels = t.raw('flow') as string[];
  const arrow = useId().replace(/:/g, '');
  const branchLabels = useRange(progress, 0.72, 0.8);

  return (
    <Frame file={file}>
      <svg viewBox="0 0 336 190" className="h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <marker
            id={arrow}
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L8 4 L0 8 z" className="fill-muted-foreground" />
          </marker>
        </defs>

        {EDGES.map((e, i) => (
          <FlowEdge key={i} d={e.d} at={e.at} marker={arrow} progress={progress} />
        ))}

        <motion.g style={{ opacity: branchLabels }}>
          <text x={284} y={63} className="fill-emerald-600 text-[9px] font-semibold dark:fill-emerald-400">
            {t('yes')}
          </text>
          <text x={284} y={135} className="fill-rose-500 text-[9px] font-semibold dark:fill-rose-400">
            {t('no')}
          </text>
        </motion.g>

        {FLOW.map((n, i) => (
          <FlowNodeEl key={i} n={n} label={labels[i]} at={NODE_AT[i]} progress={progress} />
        ))}
      </svg>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 03 Design — wireframe ⇄ hi-fi                                        */
/* ------------------------------------------------------------------ */

const BARS = [38, 62, 48, 80, 56, 92, 70, 84];
const STAT_VALUES = ['$84.9k', '1,284', '126'];
const HIFI_AT = 0.4;

function Bar({
  i,
  h,
  hifi,
  override,
  progress,
}: {
  i: number;
  h: number;
  hifi: boolean;
  override: boolean | null;
  progress: MotionValue<number>;
}) {
  // Scroll-scrubbed growth (staggered) — unless the visitor took the toggle.
  const grow = useTransform(progress, [HIFI_AT + i * 0.03, 0.66 + i * 0.03], ['28%', `${h}%`], { clamp: true });
  const color = `${hifi ? (i === 5 ? 'bg-accent' : 'bg-accent/35') : 'bg-muted'} transition-colors duration-500`;
  return override === null ? (
    <motion.span style={{ height: grow }} className={`flex-1 rounded-t ${color}`} />
  ) : (
    <motion.span
      initial={false}
      animate={{ height: override ? `${h}%` : '28%' }}
      transition={{ type: 'spring', stiffness: 160, damping: 18, delay: override ? i * 0.04 : 0 }}
      className={`flex-1 rounded-t ${color}`}
    />
  );
}

function DesignPreview({ file, progress }: PreviewProps) {
  const t = useTranslations('process.preview');
  const stats = t.raw('stats') as string[];
  const scrubbed = useCrossed(progress, HIFI_AT);
  const [override, setOverride] = useState<boolean | null>(null);
  const hifi = override ?? scrubbed;

  // Segmented toggle. The pill slides with a plain CSS transform — NOT a framer
  // `layoutId` (a shared-layout element inside the panel would block the
  // parent AnimatePresence's exit and freeze the stepper).
  const toggle = (
    <span className="relative grid grid-cols-2 rounded-md bg-muted p-0.5 text-[10px] font-medium">
      <span
        aria-hidden="true"
        className="absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded bg-card shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(${hifi ? '100%' : '0%'})` }}
      />
      {[false, true].map((v) => (
        <button
          key={String(v)}
          type="button"
          onClick={() => setOverride(v)}
          aria-pressed={hifi === v}
          className={`relative rounded px-2 py-0.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            hifi === v ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {v ? t('hifi') : t('wire')}
        </button>
      ))}
    </span>
  );

  const block = (on: string, off: string) =>
    `transition-[background-color,border-color,color,opacity] duration-500 ease-out ${hifi ? on : off}`;

  return (
    <Frame file={file} action={toggle}>
      <div className="flex h-full flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className={`h-2.5 w-24 rounded ${block('bg-foreground', 'bg-muted')}`} />
            <div className={`h-1.5 w-16 rounded ${block('bg-muted-foreground/40', 'bg-muted')}`} />
          </div>
          <div
            className={`flex h-6 items-center rounded-md border px-2.5 text-[10px] font-semibold ${block(
              'border-transparent bg-accent-solid text-accent-foreground',
              'border-dashed border-muted-foreground/40 bg-transparent text-transparent',
            )}`}
          >
            {t('export')}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {stats.map((label, i) => (
            <div
              key={label}
              className={`rounded-lg border p-2 ${block('border-border bg-card shadow-sm', 'border-dashed border-muted-foreground/30 bg-transparent')}`}
            >
              <div className="relative h-3">
                <span
                  className={`absolute inset-0 text-[9px] text-muted-foreground transition-opacity duration-500 ${hifi ? 'opacity-100' : 'opacity-0'}`}
                >
                  {label}
                </span>
                <span
                  className={`absolute left-0 top-1 h-1.5 w-10 rounded bg-muted transition-opacity duration-300 ${hifi ? 'opacity-0' : 'opacity-100'}`}
                />
              </div>
              <div className="relative mt-1 h-4">
                <span
                  className={`absolute inset-0 font-heading text-[13px] font-bold text-foreground transition-opacity duration-500 ${hifi ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: hifi ? `${150 + i * 90}ms` : '0ms' }}
                >
                  {STAT_VALUES[i]}
                </span>
                <span
                  className={`absolute left-0 top-1 h-2.5 w-12 rounded bg-muted transition-opacity duration-300 ${hifi ? 'opacity-0' : 'opacity-100'}`}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          className={`flex flex-1 items-end gap-1.5 rounded-lg border p-2.5 ${block('border-border bg-card shadow-sm', 'border-dashed border-muted-foreground/30 bg-transparent')}`}
        >
          {BARS.map((h, i) => (
            <Bar key={i} i={i} h={h} hifi={hifi} override={override} progress={progress} />
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 04 Deliver — code → build → deployed                                 */
/* ------------------------------------------------------------------ */

const C = {
  tag: 'text-rose-600 dark:text-rose-400',
  attr: 'text-amber-700 dark:text-amber-300',
  str: 'text-emerald-700 dark:text-emerald-400',
  plain: 'text-foreground',
};
const CODE: [string, string][][] = [
  [['<template>', C.tag]],
  [['  <StatCard', C.tag]],
  [
    ['    label', C.attr],
    ['=', C.plain],
    ['"Funds raised"', C.str],
  ],
  [
    ['    :value', C.attr],
    ['=', C.plain],
    ['"total"', C.str],
    [' trend', C.attr],
    ['=', C.plain],
    ['"+12%"', C.str],
  ],
  [['  />', C.tag]],
  [['</template>', C.tag]],
];

function CodeLine({ i, line, progress }: { i: number; line: [string, string][]; progress: MotionValue<number> }) {
  // Each line "types" across its own slice of the scroll.
  const clipPath = useTransform(
    progress,
    [0.04 + i * 0.075, 0.11 + i * 0.075],
    ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
    { clamp: true },
  );
  return (
    <motion.div className="flex" style={{ clipPath }}>
      <span className="mr-3 w-3 select-none text-right text-muted-foreground">{i + 1}</span>
      <span className="whitespace-pre">
        {line.map(([text, cls], k) => (
          <span key={k} className={cls}>
            {text}
          </span>
        ))}
      </span>
    </motion.div>
  );
}

function CheckChip({ i, label, progress }: { i: number; label: string; progress: MotionValue<number> }) {
  const p = useRange(progress, 0.72 + i * 0.05, 0.79 + i * 0.05);
  const y = useTransform(p, [0, 1], [4, 0]);
  return (
    <motion.span
      style={{ opacity: p, y }}
      className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] text-foreground"
    >
      <Check className="h-2.5 w-2.5 text-emerald-500" strokeWidth={3} />
      {label}
    </motion.span>
  );
}

function BuildPreview({ file, progress }: PreviewProps) {
  const t = useTranslations('process.preview');
  const checks = t.raw('checks') as string[];
  const passed = useCrossed(progress, 0.56);
  const deploy = useRange(progress, 0.64, 0.72);
  const deployScale = useTransform(deploy, [0, 1], [0.6, 1]);

  return (
    <Frame file={file}>
      <div className="flex h-full flex-col">
        <pre className="flex-1 text-[11px] leading-[1.7]" style={{ fontFamily: MONO }}>
          {CODE.map((line, i) => (
            <CodeLine key={i} i={i} line={line} progress={progress} />
          ))}
        </pre>

        <div className="rounded-lg border border-border bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-2 text-[10.5px]" style={{ fontFamily: MONO }}>
            {passed ? (
              <motion.span
                key="ok"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400"
              >
                <Check className="h-3 w-3" strokeWidth={3} />
                {t('build')}
              </motion.span>
            ) : (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 motion-safe:animate-pulse" />$ npm run build
              </span>
            )}
            <motion.span
              style={{ opacity: deploy, scale: deployScale }}
              className="ml-auto inline-flex items-center gap-1 rounded-full bg-accent-solid px-2 py-0.5 font-body text-[10px] font-semibold text-accent-foreground"
            >
              <Rocket className="h-3 w-3" />
              {t('deployed')}
            </motion.span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {checks.map((c, i) => (
              <CheckChip key={c} i={i} label={c} progress={progress} />
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

/** Index-aligned with the `process.steps` messages. */
export const PREVIEWS = [ResearchPreview, DefinePreview, DesignPreview, BuildPreview];
