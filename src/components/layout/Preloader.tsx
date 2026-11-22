"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Code2 } from "lucide-react";
import { FigmaMark, FIGMA_PIECES } from "@/components/ui/FigmaMark";
import { SITE } from "@/lib/data";
import { PRELOADER_EXIT_EVENT, PRELOADER_KEY } from "@/lib/preloader";

/**
 * First-visit preloader — tells the story of the job in ~3 seconds:
 *   1. portfolio.fig opens: the Figma mark assembles piece by piece
 *   2. a Hero frame is drawn, its layers drop in, "Fandi"'s cursor selects the button
 *   3. the tab switches to fandi.tsx and the hand-off is typed out (imports the .fig)
 *   4. 100% → READY → the panel lifts like a curtain to reveal the page
 *
 * Plays once per browser session. An inline script in the layout marks
 * <html data-preloader="off"> before first paint when it was already seen or the
 * user prefers reduced motion, so returning visitors never see a flash of it.
 * Skippable with the button or Esc. The page is fully server-rendered underneath,
 * so SEO and the real content are untouched.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const EXIT_S = 0.8; // curtain lift duration (s)
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/** One clock drives everything (ms since start) so every beat stays in sync. */
const T = {
  logo: 150, // Figma pieces start assembling
  logoOut: 720, // splash leaves the canvas
  frame: 780, // Hero frame is drawn
  layers: 980, // layers drop in
  cursor: 1200, // cursor travels to the button
  select: 1560, // button gets selected
  code: 1760, // tab switches to fandi.tsx
  typeStart: 1960,
  typeEnd: 2800, // = 100% / READY
  exit: 3100, // curtain lifts
} as const;

/* ------------------------------------------------------------------ */
/* Code that gets typed                                                 */
/* ------------------------------------------------------------------ */

const C = {
  kw: "text-violet-400",
  fn: "text-accent",
  str: "text-emerald-400",
  tag: "text-rose-400",
  attr: "text-amber-300",
  cm: "text-foreground/40",
};

type Token = [text: string, cls?: string];
const LINES: Token[][] = [
  [
    ["import", C.kw],
    [" { "],
    ["Hero", C.fn],
    [" } "],
    ["from", C.kw],
    [" "],
    ["'./portfolio.fig'", C.str],
    [";"],
  ],
  [],
  [["const", C.kw], [" fandi = {"]],
  [["  role: "], ["'UI/UX Designer & Engineer'", C.str], [","]],
  [
    ["  design: ["],
    ["'Figma'", C.str],
    [", "],
    ["'Design Systems'", C.str],
    ["],"],
  ],
  [
    ["  build: ["],
    ["'React'", C.str],
    [", "],
    ["'Vue'", C.str],
    [", "],
    ["'Tailwind'", C.str],
    ["],"],
  ],
  [["};"]],
  [],
  [
    ["ship", C.fn],
    ["("],
    ["<Hero", C.tag],
    [" "],
    ["by", C.attr],
    ["={fandi} "],
    ["/>", C.tag],
    [");"],
    [" // ✓ ready", "cm"],
  ],
];
const lineLength = (line: Token[]) =>
  line.reduce((n, [text]) => n + text.length, 0);
const TOTAL_CHARS = LINES.reduce((n, line) => n + lineLength(line) + 1, 0);

/* ------------------------------------------------------------------ */

export function Preloader() {
  const t = useTranslations("preloader");
  const [ms, setMs] = useState(0);
  const [visible, setVisible] = useState(true);
  const [gone, setGone] = useState(false);

  // Decide on mount (the SSR markup is identical either way; CSS hides it when "off").
  useEffect(() => {
    // Skipped for this session / reduced motion, or on the 404 page (which
    // shouldn't consume the once-per-session intro either).
    if (
      document.documentElement.dataset.preloader === "off" ||
      document.querySelector("[data-not-found]")
    ) {
      setGone(true);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      setMs(elapsed);
      if (elapsed >= T.exit) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Esc skips.
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  function finish() {
    try {
      sessionStorage.setItem(PRELOADER_KEY, "1");
    } catch {
      // storage blocked (private mode) — it simply plays again next visit
    }
    // Tell the hero the curtain is lifting so its entrance plays in view.
    document.documentElement.dataset.intro = "ready";
    window.dispatchEvent(new Event(PRELOADER_EXIT_EVENT));
    setVisible(false);
  }

  // Fail-safe: never leave the page scroll-locked, even if the exit animation is interrupted.
  useEffect(() => {
    if (visible) return;
    const id = setTimeout(() => setGone(true), EXIT_S * 1000 + 300);
    return () => clearTimeout(id);
  }, [visible]);

  if (gone) return null;

  const progress = Math.min(ms / T.typeEnd, 1);
  const pct = Math.round(progress * 100);
  const coding = ms >= T.code;
  const ready = ms >= T.typeEnd;
  const status = ready ? t("ready") : coding ? t("building") : t("designing");
  const typed = Math.floor(
    Math.min(Math.max((ms - T.typeStart) / (T.typeEnd - T.typeStart), 0), 1) *
      TOTAL_CHARS,
  );

  return (
    // Exit is state-driven (not AnimatePresence): the curtain lifts, then we unmount,
    // which also releases the scroll lock in globals.css.
    <motion.div
      aria-busy={visible}
      className={`preloader dark fixed inset-0 z-[100] flex flex-col overflow-hidden bg-background text-foreground ${
        visible ? "" : "pointer-events-none"
      }`}
      initial={false}
      animate={{ y: visible ? "0%" : "-100%" }}
      transition={{ duration: EXIT_S, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => !visible && setGone(true)}
    >
      <p role="status" className="sr-only">
        {t("loading")}
      </p>

      {/* Accent glow + faint dot grid, same language as the footer band */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 45%, rgb(var(--accent) / 0.16), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgb(var(--foreground) / 0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(70% 60% at 50% 50%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(70% 60% at 50% 50%, black, transparent)",
        }}
      />

      <motion.div
        className="relative flex flex-1 flex-col px-4 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-7"
        initial={false}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -48 }}
        transition={{ duration: 0.45, ease: [0.7, 0, 0.84, 0] }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between font-mono text-label uppercase tracking-[0.2em] text-foreground/50">
          <span>{SITE.name.toLowerCase().replace(" ", ".")}</span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">{t("loading")}</span>
            <button
              type="button"
              onClick={finish}
              className="rounded-full border border-foreground/15 px-3 py-1 text-foreground/70 transition-colors duration-150 ease-out hover:border-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("skip")}
              <kbd className="ml-2 hidden font-mono text-foreground/40 sm:inline">
                esc
              </kbd>
            </button>
          </div>
        </div>

        {/* Editor window */}
        <div
          aria-hidden="true"
          className="flex flex-1 items-center justify-center py-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="w-full max-w-[540px] overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-2xl shadow-black/50"
          >
            <div className="flex items-center gap-3 border-b border-foreground/10 px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-amber-400" />
                <span className="size-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex gap-1" style={{ fontFamily: MONO }}>
                <Tab
                  active={!coding}
                  icon={<FigmaMark className="h-3.5 w-auto" />}
                  label="portfolio.fig"
                />
                <Tab
                  active={coding}
                  icon={<Code2 className="size-3.5 text-accent" />}
                  label="fandi.tsx"
                />
              </div>
            </div>

            <div className="relative h-[232px] sm:h-[244px]">
              <AnimatePresence mode="wait" initial={false}>
                {!coding ? (
                  <motion.div
                    key="fig"
                    className="absolute inset-0"
                    exit={{
                      opacity: 0,
                      scale: 0.98,
                      transition: { duration: 0.16, ease: "easeIn" },
                    }}
                  >
                    <FigmaCanvas ms={ms} opening={t("opening")} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="code"
                    className="absolute inset-0"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    <CodeView chars={typed} ready={ready} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Counter + status + progress */}
        <div aria-hidden="true">
          <div className="flex items-end justify-between gap-4">
            <p className="font-heading text-[clamp(3.5rem,11vw,7rem)] font-normal leading-[0.85] tracking-tight tabular-nums">
              {pct}
              <span className="text-foreground/30">%</span>
            </p>
            <div className="flex items-center gap-2 pb-1 font-mono text-label uppercase tracking-[0.2em] text-foreground/60">
              <span
                className={`size-1.5 rounded-full ${ready ? "bg-emerald-400" : "animate-pulse bg-accent"}`}
              />
              <span className="relative block h-[1.2em] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={status}
                    className="block"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    {status}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
          </div>
          <div className="mt-4 h-px w-full bg-foreground/10">
            <div
              className="h-full origin-left bg-accent"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Editor tab with a sliding active pill. */
function Tab({
  active,
  icon,
  label,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
}) {
  return (
    <span
      className={`relative flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] transition-colors duration-200 ${
        active ? "text-foreground" : "text-foreground/40"
      }`}
    >
      {active && (
        <motion.span
          layoutId="preloader-tab"
          className="absolute inset-0 rounded-md bg-foreground/10"
          transition={{ duration: 0.35, ease: EASE }}
        />
      )}
      <span className="relative flex items-center gap-1.5">
        {icon}
        {label}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Phase 1 — Figma: splash → frame → layers → cursor selects the CTA     */
/* ------------------------------------------------------------------ */

/** Wireframe of a hero, positioned in % of the frame. */
const LAYERS = [
  { cls: "rounded-full bg-accent", box: [6, 8, 4, 6] }, // logo dot
  { cls: "rounded bg-foreground/20", box: [62, 9, 8, 4] }, // nav links
  { cls: "rounded bg-foreground/20", box: [73, 9, 8, 4] },
  { cls: "rounded bg-foreground/20", box: [84, 9, 9, 4] },
  { cls: "rounded bg-foreground/85", box: [6, 26, 44, 9] }, // headline
  { cls: "rounded bg-foreground/85", box: [6, 38, 32, 9] },
  { cls: "rounded bg-foreground/25", box: [6, 53, 40, 4] }, // body copy
  { cls: "rounded bg-foreground/25", box: [6, 60, 34, 4] },
  { cls: "rounded-full bg-accent", box: [6, 72, 22, 12] }, // CTA button
  {
    cls: "rounded-lg bg-gradient-to-br from-accent/40 to-violet-500/30",
    box: [56, 24, 37, 62],
  }, // visual
] as const;
const BUTTON = LAYERS[8].box;

function FigmaCanvas({ ms, opening }: { ms: number; opening: string }) {
  const splash = ms < T.logoOut;
  const framed = ms >= T.frame;
  const cursorIn = ms >= T.layers;
  const cursorAtButton = ms >= T.cursor;
  const selected = ms >= T.select;

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(rgb(var(--foreground) / 0.07) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      {/* Splash — the Figma mark assembles, like opening a file */}
      <AnimatePresence>
        {splash && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            exit={{
              opacity: 0,
              scale: 0.85,
              transition: { duration: 0.2, ease: "easeIn" },
            }}
          >
            <svg viewBox="0 0 38 57" className="h-16 w-auto overflow-visible">
              {FIGMA_PIECES.map((p, i) => (
                <motion.path
                  key={p.fill}
                  d={p.d}
                  fill={p.fill}
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                  initial={false}
                  animate={
                    ms >= T.logo + i * 80
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0.2, opacity: 0 }
                  }
                  transition={{ type: "spring", stiffness: 420, damping: 22 }}
                />
              ))}
            </svg>
            <p
              className="text-[11px] text-foreground/50"
              style={{ fontFamily: MONO }}
            >
              {opening}
              <span className="animate-pulse">…</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Hero frame */}
      <div className="absolute left-[7%] top-[17%] h-[72%] w-[86%]">
        <motion.p
          className="absolute -top-5 left-0 text-[10px] text-foreground/50"
          style={{ fontFamily: MONO }}
          initial={false}
          animate={framed ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          # Hero / Desktop
        </motion.p>

        <motion.div
          className="absolute inset-0 overflow-hidden rounded-md border border-foreground/15 bg-background/80"
          initial={false}
          animate={{
            clipPath: framed ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 100% 0%)",
          }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {LAYERS.map(({ cls, box: [l, top, w, h] }, i) => (
            <motion.span
              key={i}
              className={`absolute ${cls}`}
              style={{
                left: `${l}%`,
                top: `${top}%`,
                width: `${w}%`,
                height: `${h}%`,
              }}
              initial={false}
              animate={
                ms >= T.layers + i * 22
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 6 }
              }
              transition={{ duration: 0.3, ease: EASE }}
            />
          ))}
        </motion.div>

        {/* Selection on the CTA */}
        <motion.div
          className="pointer-events-none absolute border-[1.5px] border-accent"
          style={{
            left: `calc(${BUTTON[0]}% - 3px)`,
            top: `calc(${BUTTON[1]}% - 3px)`,
            width: `calc(${BUTTON[2]}% + 6px)`,
            height: `calc(${BUTTON[3]}% + 6px)`,
          }}
          initial={false}
          animate={
            selected ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.08 }
          }
          transition={{ duration: 0.25, ease: EASE }}
        >
          {[
            "-left-1 -top-1",
            "-right-1 -top-1",
            "-bottom-1 -left-1",
            "-bottom-1 -right-1",
          ].map((pos) => (
            <span
              key={pos}
              className={`absolute size-[7px] border-[1.5px] border-accent bg-white ${pos}`}
            />
          ))}
          {/* Figma convention: component name above, dimensions below */}
          <span
            className="absolute bottom-full left-0 mb-1 whitespace-nowrap text-[9px] font-medium text-accent"
            style={{ fontFamily: MONO }}
          >
            ◇ Button / Primary
          </span>
          <span
            className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-accent-solid px-1.5 py-0.5 text-[9px] font-medium text-white"
            style={{ fontFamily: MONO }}
          >
            132 × 44
          </span>
        </motion.div>

        {/* Fandi's cursor */}
        <motion.div
          className="pointer-events-none absolute"
          initial={false}
          animate={{
            left: cursorAtButton ? `${BUTTON[0] + BUTTON[2] * 0.8}%` : "92%",
            top: cursorAtButton ? `${BUTTON[1] + BUTTON[3] * 0.7}%` : "104%",
            opacity: cursorIn ? 1 : 0,
            scale: selected ? [1, 0.82, 1] : 1,
          }}
          transition={{
            left: { duration: 0.45, ease: EASE },
            top: { duration: 0.45, ease: EASE },
            opacity: { duration: 0.2 },
            scale: { duration: 0.22 },
          }}
        >
          <svg
            width="14"
            height="20"
            viewBox="0 0 14 20"
            className="drop-shadow"
          >
            <path
              d="M1 1v15.5l4.2-3.9 2.9 6.2 2.6-1.2-2.9-6.1H13L1 1z"
              className="fill-accent"
              stroke="white"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute left-3 top-4 whitespace-nowrap rounded-full bg-accent-solid px-2 py-0.5 text-[10px] font-semibold text-white">
            Fandi
          </span>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Phase 2 — Code: the hand-off, typed out                              */
/* ------------------------------------------------------------------ */

function CodeView({ chars, ready }: { chars: number; ready: boolean }) {
  let budget = chars;
  const rendered: ReactNode[] = [];

  for (let i = 0; i < LINES.length; i++) {
    const line = LINES[i];
    const len = lineLength(line);
    const visible = Math.min(budget, len);
    const isCurrent = budget <= len || i === LINES.length - 1;

    let left = visible;
    rendered.push(
      <span key={i} className="flex min-h-[22px] whitespace-pre">
        <span className="mr-4 inline-block w-4 shrink-0 select-none text-right text-foreground/20">
          {i + 1}
        </span>
        <span>
          {line.map(([text, cls], j) => {
            if (left <= 0) return null;
            const part = text.slice(0, left);
            left -= part.length;
            const colour =
              cls === "cm" ? (ready ? "text-emerald-400" : C.cm) : cls;
            return (
              <span
                key={j}
                className={`transition-colors duration-300 ${colour ?? "text-foreground/85"}`}
              >
                {part}
              </span>
            );
          })}
          {isCurrent && (
            <span className="ml-px inline-block h-[15px] w-[7px] translate-y-[3px] animate-pulse bg-accent/80" />
          )}
        </span>
      </span>,
    );

    if (isCurrent) break;
    budget -= len + 1;
  }

  return (
    <pre
      className="h-full overflow-hidden px-4 py-4 text-[11px] leading-[22px] sm:px-5 sm:text-[12.5px]"
      style={{ fontFamily: MONO }}
    >
      {/* Font set on <code> too: preflight maps code → the `mono` token (Plus Jakarta here) */}
      <code className="block" style={{ fontFamily: MONO }}>
        {rendered}
      </code>
    </pre>
  );
}
