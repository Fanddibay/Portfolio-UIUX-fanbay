'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Component, FileText, Pointer, ScanSearch, type LucideIcon } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

type ToolKey = 'research' | 'prd' | 'figma' | 'designSystem' | 'claude' | 'react' | 'vue' | 'clickup';
type Ring = 'inner' | 'outer';

type Tool = {
  key: ToolKey;
  ring: Ring;
  /** Degrees from 3 o'clock, clockwise (screen y points down). */
  angle: number;
  /** Idle-float phase offset (s). */
  delay: number;
} & (
  | { kind: 'brand'; name: string; src: string }
  // Practices, not products — drawn with a Lucide glyph in their own hue.
  | { kind: 'practice'; icon: LucideIcon; tone: string }
);

/**
 * Everything I work with, each tile sitting ON one of the two "connector"
 * rings so the dashed orbit visibly links them. Read top→bottom it's my process:
 *   left  — Research → PRD → Figma → Design System   (discover & design)
 *   right — Claude → React → Vue → ClickUp           (build & ship)
 * Tiles alternate outer/inner ring so neighbours never crowd each other, and
 * inner-ring angles stay within ±22° of horizontal so they clear the headline.
 */
const TOOLS: Tool[] = [
  {
    key: 'research',
    kind: 'practice',
    icon: ScanSearch,
    tone: 'text-amber-500',
    ring: 'outer',
    angle: 208,
    delay: 0,
  },
  {
    key: 'prd',
    kind: 'practice',
    icon: FileText,
    tone: 'text-sky-500',
    ring: 'inner',
    angle: 193,
    delay: 1.1,
  },
  {
    key: 'figma',
    kind: 'brand',
    name: 'Figma',
    src: '/brands/figma.svg',
    ring: 'outer',
    angle: 168,
    delay: 2.2,
  },
  {
    key: 'designSystem',
    kind: 'practice',
    icon: Component,
    tone: 'text-violet-500',
    ring: 'inner',
    angle: 160,
    delay: 3.3,
  },
  {
    key: 'claude',
    kind: 'brand',
    name: 'Claude',
    src: '/brands/claude.svg',
    ring: 'outer',
    angle: -28,
    delay: 0.6,
  },
  {
    key: 'react',
    kind: 'brand',
    name: 'React',
    src: '/brands/react.svg',
    ring: 'inner',
    angle: -13,
    delay: 1.7,
  },
  { key: 'vue', kind: 'brand', name: 'Vue', src: '/brands/vue.svg', ring: 'outer', angle: 12, delay: 2.8 },
  {
    key: 'clickup',
    kind: 'brand',
    name: 'ClickUp',
    src: '/brands/clickup.svg',
    ring: 'inner',
    angle: 20,
    delay: 3.9,
  },
];

/* ------------------------------------------------------------------ */
/* Geometry — one coordinate space shared by the rings and the tiles    */
/* ------------------------------------------------------------------ */

type Geo = {
  /** Ring centre, px from the top of the hero section (≈ the headline). */
  cy: number;
  inner: number;
  outer: number;
  /** Every ring drawn, smallest → largest. */
  rings: number[];
  /** lg+: the tool tiles sit on the rings (pointer layout). */
  tilesOnRings: boolean;
};

/** Rings scale with the section width so the outer tiles never leave the
 * screen and the inner ones never touch the headline (~600px wide at lg+). */
function geometry(width: number): Geo {
  const hw = width / 2;
  if (width >= 1024) {
    const outer = Math.min(540, hw - 46);
    const inner = Math.min(420, outer - 95);
    return {
      cy: 315,
      inner,
      outer,
      rings: [inner - 135, inner, outer, outer + 165, outer + 340],
      tilesOnRings: true,
    };
  }
  // Below lg the tiles become a grid; the rings become an interactive backdrop
  // (scroll-turned, comets, tap ripples).
  const cy = width >= 768 ? 315 : 240;
  return {
    cy,
    inner: hw * 1.1,
    outer: hw * 1.5,
    rings: [hw * 0.75, hw * 1.1, hw * 1.5, hw * 2],
    tilesOnRings: false,
  };
}

function useOrbitGeometry() {
  const ref = useRef<HTMLDivElement>(null);
  // Deterministic first render (SSR = client) — corrected on mount.
  const [geo, setGeo] = useState<Geo>(() => geometry(1440));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setGeo(geometry(el.clientWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, geo };
}

/** Subtle cursor parallax shared by rings AND tiles, so tiles stay on their lines. */
function useParallax(depth: number) {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    // Only track the cursor while the hero is on screen. The listener is on
    // window, so without this gate every mouse move further down the page kept
    // driving the springs (and restyling the off-screen orbit).
    let active = true;
    const hero = document.getElementById('top');
    const io = hero
      ? new IntersectionObserver(([e]) => {
          active = e.isIntersecting;
        })
      : null;
    if (hero && io) io.observe(hero);

    const onMove = (e: PointerEvent) => {
      if (!active) return;
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2 * depth);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2 * depth);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      io?.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [reduce, rawX, rawY, depth]);

  return { x, y };
}

const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r };
};

/* ------------------------------------------------------------------ */
/* Tile                                                                 */
/* ------------------------------------------------------------------ */

/** Display name — brand name, or the translated practice name. */
function useToolName() {
  const t = useTranslations('heroShowcase');
  return (tool: Tool) => (tool.kind === 'brand' ? tool.name : t(`toolNames.${tool.key}`));
}

function ToolGlyph({ tool, name, className }: { tool: Tool; name: string; className: string }) {
  return tool.kind === 'brand' ? (
    // eslint-disable-next-line @next/next/no-img-element -- tiny static SVG, no optimizer needed
    <img
      src={tool.src}
      alt={name}
      width={32}
      height={32}
      className={`object-contain ${className}`}
      draggable={false}
    />
  ) : (
    <tool.icon role="img" aria-label={name} strokeWidth={1.9} className={`${className} ${tool.tone}`} />
  );
}

function ToolTile({
  tool,
  index,
  ready,
  size,
  active = false,
  onHover,
}: {
  tool: Tool;
  index: number;
  ready: boolean;
  size: 'lg' | 'sm';
  /** Touch layout: the tapped tile stays lit. */
  active?: boolean;
  onHover?: (key: ToolKey | null) => void;
}) {
  const t = useTranslations('heroShowcase');
  const lg = size === 'lg';
  const name = useToolName()(tool);
  // Orbit tiles: 56px on small laptops (lg), 68px from xl up.
  const box = lg
    ? 'h-14 w-14 rounded-2xl xl:h-[68px] xl:w-[68px] xl:rounded-[20px]'
    : 'h-12 w-12 rounded-2xl';
  const glyph = lg ? 'h-7 w-7 xl:h-8 xl:w-8' : 'h-6 w-6';
  const lit = active
    ? '-translate-y-1 scale-[1.06] border-accent/50 shadow-[0_18px_34px_-14px_rgb(37_99_235/0.55)] ring-4 ring-accent/10'
    : 'border-border/80';

  return (
    <motion.div
      onPointerEnter={() => onHover?.(tool.key)}
      onPointerLeave={() => onHover?.(null)}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.55 + index * 0.09 }}
    >
      {/* Idle bob lives on its own layer so it never fights the entrance transform */}
      <div className="hero-float" style={{ animationDelay: `-${tool.delay}s` }}>
        <div className="group/tool relative">
          <div
            className={`grid place-items-center border bg-card shadow-[0_14px_30px_-14px_rgb(15_23_42/0.35)] transition-[transform,box-shadow,border-color] duration-300 ease-out group-hover/tool:-translate-y-1 group-hover/tool:scale-[1.06] group-hover/tool:border-accent/30 group-hover/tool:shadow-[0_22px_40px_-16px_rgb(37_99_235/0.4)] dark:shadow-[0_14px_30px_-14px_rgb(0_0_0/0.8)] ${box} ${lit}`}
          >
            <ToolGlyph tool={tool} name={name} className={glyph} />
          </div>
          {/* Hover tooltip — pointer layouts only; touch gets a caption instead */}
          {lg && (
            <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2.5 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full border border-border bg-card px-2.5 py-1 font-body text-[11px] font-medium text-foreground opacity-0 shadow-md transition-[opacity,transform] duration-200 ease-out group-hover/tool:translate-y-0 group-hover/tool:opacity-100">
              {name} <span className="text-muted-foreground">· {t(`tools.${tool.key}`)}</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Orbit (rings + tiles)                                                */
/* ------------------------------------------------------------------ */

/**
 * Concentric dashed rings centred on the headline. The two "connector" rings
 * carry the tool tiles and are drawn stronger, with a slow dash flow so the line
 * reads as a live link between the tools; the rest are faint depth rings. Two
 * accent arcs drift around the orbit. Everything (rings + tiles) shares one
 * centre, radius set and parallax, so tiles always sit exactly on their line.
 *
 * Render as a direct child of the hero <section> (after the content).
 */
export function Orbit({ ready }: { ready: boolean }) {
  const t = useTranslations('heroShowcase');
  const { ref, geo } = useOrbitGeometry();
  const { x, y } = useParallax(10);
  const radius = { inner: geo.inner, outer: geo.outer };
  const span = Math.ceil(Math.max(...geo.rings) + 8);
  // Which tile the cursor is on — its stretch of line lights up.
  const [hovered, setHovered] = useState<ToolKey | null>(null);
  const reduce = useReducedMotion();

  // Touch layouts (no cursor parallax, no tiles on the rings): the orbit turns
  // and opens up as you scroll, so the background feels alive under a thumb.
  // Desktop keeps rotate 0 — its tiles and hover-glow arcs live on the rings.
  const touchLayout = !geo.tilesOnRings && !reduce;
  const { scrollY } = useScroll();
  const scrollRotate = useTransform(scrollY, [0, 900], [0, touchLayout ? 28 : 0]);
  const scrollScale = useTransform(scrollY, [0, 900], [1, touchLayout ? 1.14 : 1]);
  const rotate = useSpring(scrollRotate, { stiffness: 90, damping: 24 });
  const scale = useSpring(scrollScale, { stiffness: 90, damping: 24 });

  // Tap/click ripples: any tap in the hero sends a wave through the rings
  // from that point (taps only — the `click` event never fires for a scroll).
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  useEffect(() => {
    const layer = ref.current;
    const section = layer?.parentElement;
    if (!layer || !section || reduce) return;
    let id = 0;
    const onClick = (e: MouseEvent) => {
      const r = layer.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (y < 0 || y > r.height) return;
      const next = { id: ++id, x, y };
      setRipples((list) => [...list.slice(-3), next]);
    };
    section.addEventListener('click', onClick);
    return () => section.removeEventListener('click', onClick);
  }, [ref, reduce]);

  return (
    <>
      {/* Rings — behind everything, fading out before the mockup */}
      <div
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1150px] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_45%,transparent_90%)]"
      >
        <div
          className="absolute left-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[90px] dark:bg-accent/[0.12]"
          style={{ top: geo.cy }}
        />
        {/* Tap ripples — two staggered waves expanding from the touch point */}
        {ripples.map((rp) =>
          [0, 0.12].map((delay, k) => (
            <motion.span
              key={`${rp.id}-${k}`}
              className={`absolute rounded-full border-2 ${k ? 'border-accent/40' : 'border-accent/70 bg-accent/[0.05] shadow-[0_0_28px_rgb(var(--accent)/0.35),inset_0_0_28px_rgb(var(--accent)/0.15)]'}`}
              style={{ left: rp.x, top: rp.y, width: 560, height: 560, marginLeft: -280, marginTop: -280 }}
              initial={{ scale: 0.04, opacity: k ? 0.5 : 0.85 }}
              animate={{ scale: k ? 0.8 : 1, opacity: 0 }}
              transition={{ duration: 1.15, ease: EASE, delay }}
              onAnimationComplete={() => k && setRipples((list) => list.filter((x) => x.id !== rp.id))}
            />
          )),
        )}

        <motion.div className="absolute left-1/2" style={{ top: geo.cy, x, y, rotate, scale }}>
          {/* Sized to the largest ring with a centred viewBox, so (0,0) = orbit
              centre. (A 0×0 SVG with overflow:visible doesn't paint in Chrome.) */}
          {/* Positioning lives on a plain div: framer doesn't re-apply static
              left/top on a motion.svg when the geometry changes (mobile kept the
              desktop offset and the rings rendered off-screen). */}
          <div className="absolute" style={{ left: -span, top: -span, width: span * 2, height: span * 2 }}>
            <motion.svg
              width={span * 2}
              height={span * 2}
              viewBox={`${-span} ${-span} ${span * 2} ${span * 2}`}
              className="absolute inset-0 overflow-visible"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
            >
              <defs>
                <linearGradient id="hero-arc" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" style={{ stopColor: 'rgb(var(--accent))', stopOpacity: 0 }} />
                  <stop offset="50%" style={{ stopColor: 'rgb(var(--accent))', stopOpacity: 0.95 }} />
                  <stop offset="100%" style={{ stopColor: 'rgb(var(--accent))', stopOpacity: 0 }} />
                </linearGradient>
                <filter id="hero-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" />
                </filter>
              </defs>

              {geo.rings.map((r) => {
                const connector = r === geo.inner || r === geo.outer;
                return (
                  <circle
                    key={r}
                    r={r}
                    fill="none"
                    strokeWidth={connector ? 1.25 : 1}
                    strokeDasharray={connector ? '5 7' : '2 8'}
                    className={connector ? 'hero-ring-flow' : undefined}
                    style={{ stroke: `rgb(var(--foreground) / ${connector ? 0.2 : 0.08})` }}
                  />
                );
              })}

              {/* Accent arcs riding the two connector rings */}
              {(['inner', 'outer'] as const).map((ring, i) => {
                const r = radius[ring];
                const c = 2 * Math.PI * r;
                const start = i ? -40 : 200;
                // Leading end of the arc (forward ring) / trailing end (reverse ring)
                // gets a glowing "comet" dot, so the orbit visibly travels.
                const head = polar(r, i ? start : start + 0.14 * 360);
                return (
                  <g key={ring} className={`hero-orbit ${i ? 'hero-orbit--reverse' : ''}`}>
                    <circle
                      r={r}
                      fill="none"
                      stroke="url(#hero-arc)"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeDasharray={`${c * 0.14} ${c}`}
                      transform={`rotate(${start})`}
                    />
                    <circle
                      cx={head.x}
                      cy={head.y}
                      r={7}
                      filter="url(#hero-glow)"
                      style={{ fill: 'rgb(var(--accent) / 0.6)' }}
                    />
                    <circle cx={head.x} cy={head.y} r={2.75} style={{ fill: 'rgb(var(--accent))' }} />
                  </g>
                );
              })}

              {/* Hover: the hovered tile's stretch of line lights up, growing out
                from the tile in both directions (soft glow + crisp core). */}
              {TOOLS.map((tool) => {
                const r = radius[tool.ring];
                const c = 2 * Math.PI * r;
                // ±18° — long enough to read as "this line", short enough to stop
                // before the neighbouring tile on the same ring.
                const arcDeg = 36;
                const len = (c * arcDeg) / 360;
                const on = hovered === tool.key;
                const anim = {
                  strokeDasharray: on ? `${len} ${c}` : `0.001 ${c}`,
                  rotate: on ? tool.angle - arcDeg / 2 : tool.angle,
                };
                const transition = { duration: on ? 0.55 : 0.35, ease: EASE };
                return (
                  <g key={`glow-${tool.key}`}>
                    <motion.circle
                      r={r}
                      fill="none"
                      strokeWidth={7}
                      strokeLinecap="round"
                      filter="url(#hero-glow)"
                      style={{ stroke: 'rgb(var(--accent))', originX: 0.5, originY: 0.5 }}
                      initial={false}
                      animate={{ ...anim, opacity: on ? 0.55 : 0 }}
                      transition={transition}
                    />
                    <motion.circle
                      r={r}
                      fill="none"
                      strokeWidth={2}
                      strokeLinecap="round"
                      style={{ stroke: 'rgb(var(--accent))', originX: 0.5, originY: 0.5 }}
                      initial={false}
                      animate={{ ...anim, opacity: on ? 1 : 0 }}
                      transition={transition}
                    />
                  </g>
                );
              })}
            </motion.svg>
          </div>
        </motion.div>
      </div>

      {/* Tiles (lg+) — same centre, radii and parallax as the rings */}
      <motion.ul
        aria-label={t('toolsLabel')}
        className="pointer-events-none absolute left-1/2 z-10 hidden h-0 w-0 lg:block"
        style={{ top: geo.cy, x, y }}
      >
        {TOOLS.map((tool, i) => {
          const p = polar(radius[tool.ring], tool.angle);
          return (
            <li
              key={tool.key}
              className="pointer-events-auto absolute -ml-7 -mt-7 xl:-ml-[34px] xl:-mt-[34px]"
              style={{ left: p.x, top: p.y }}
            >
              <ToolTile tool={tool} index={i} ready={ready} size="lg" onHover={setHovered} />
            </li>
          );
        })}
      </motion.ul>
    </>
  );
}

/**
 * Below lg (touch-first) — hover tooltips don't exist on a phone, so:
 *  - every tile carries its name underneath, always visible;
 *  - tapping a tile lights it up and shows what I use it for in a caption below
 *    (tap again to clear) — the tap also sends a ripple through the rings;
 *  - before any tap, the caption is a hint ("Tap a tool…") so it's discoverable.
 * 4 × 2 grid on phones, one row of 8 from sm up.
 */
export function ToolRow({ ready }: { ready: boolean }) {
  const t = useTranslations('heroShowcase');
  const nameOf = useToolName();
  const [picked, setPicked] = useState<ToolKey | null>(null);
  const tool = TOOLS.find((x) => x.key === picked) ?? null;

  return (
    <div className="mt-10 lg:hidden">
      <ul
        aria-label={t('toolsLabel')}
        className="mx-auto grid max-w-[340px] grid-cols-4 gap-x-2 gap-y-4 sm:max-w-[640px] sm:grid-cols-8"
      >
        {TOOLS.map((x, i) => {
          const on = picked === x.key;
          return (
            <li key={x.key} className="flex justify-center">
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setPicked(on ? null : x.key)}
                className="group/btn flex flex-col items-center gap-2 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <ToolTile tool={x} index={i} ready={ready} size="sm" active={on} />
                <span
                  className={`max-w-[76px] text-center text-[11px] font-medium leading-tight transition-colors duration-200 ${
                    on ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {nameOf(x)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Caption: hint → what the tapped tool is for */}
      <div aria-live="polite" className="mt-5 flex h-9 justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={tool?.key ?? 'hint'}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.15, ease: 'easeIn' } }}
            transition={{ duration: 0.3, ease: EASE }}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] ${
              tool
                ? 'border-accent/30 bg-card shadow-sm'
                : 'border-dashed border-border text-muted-foreground'
            }`}
          >
            {tool ? (
              <>
                <ToolGlyph tool={tool} name="" className="h-4 w-4" />
                <span className="font-semibold text-foreground">{nameOf(tool)}</span>
                <span className="text-muted-foreground">· {t(`tools.${tool.key}`)}</span>
              </>
            ) : (
              <>
                <Pointer className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                {t('toolsHint')}
              </>
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
