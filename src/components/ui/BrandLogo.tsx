'use client';

import { useEffect, useState } from 'react';
import { useIntroReady } from '@/lib/useIntroReady';
import { MARK, WORDMARK, WORDMARK_LETTERS } from './brandPaths';

/**
 * Brand mark: "f" + text caret on a rounded tile. Same art as the favicon,
 * app icons and OG image (scripts/generate-brand-assets.mjs, assets/brand/logo/).
 * Theme-aware via tokens: dark tile in light mode, light tile in dark mode,
 * so it always reads as a solid badge against the page.
 */
export function BrandMark({ className = 'h-8 w-8' }: { className?: string }) {
  const { size, radius, f, caret } = MARK;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className={`shrink-0 ${className}`}>
      <rect width={size} height={size} rx={radius} className="fill-primary" />
      <path d={f} className="fill-primary-foreground" />
      <rect x={caret.x} y={caret.y} width={caret.w} height={caret.h} rx={caret.r} className="fill-accent" />
    </svg>
  );
}

const TYPE_MS = 55; // per letter, close to a fast typist
const WORD_PAUSE_MS = 140; // beat between "fandi" and "bayu"
const BAYU_INDEX = 5; // first letter of "bayu"

/**
 * Wordmark: "fandibayu" (the domain) followed by a text caret, the one tool
 * design and code share. Outlined paths, so no font dependency.
 *
 * Motion (styles in globals.css, "Brand wordmark"):
 * - `intro`: when the preloader is covering the page, the name is rewound and
 *   typed back on as the curtain lifts. Every other load renders it complete,
 *   so server HTML and first paint always match.
 * - The caret blinks 3 times, then rests. It only keeps blinking while the
 *   wrapping link is hovered or focused (WCAG 2.2.2: no endless auto-blink).
 * - Hover/focus on the wrapping link sweeps a text-selection highlight in.
 *
 * Variants:
 * - `caret={false}`: for a lockup next to <BrandMark>, which already carries
 *   the caret (two carets side by side read as a glitch).
 * - `blink`: gate the 3 blinks, e.g. on an in-view check for the footer.
 * - `inkClassName` / `caretClassName`: tone it down for decorative use.
 */
export function BrandWordmark({
  className = 'h-6 w-auto',
  intro = false,
  caret: showCaret = true,
  blink = true,
  inkClassName = 'fill-foreground',
  caretClassName = 'fill-accent',
}: {
  className?: string;
  intro?: boolean;
  caret?: boolean;
  blink?: boolean;
  inkClassName?: string;
  caretClassName?: string;
}) {
  const ready = useIntroReady(250);
  const [typed, setTyped] = useState(WORDMARK_LETTERS.length);
  const [typing, setTyping] = useState(false);

  // Rewind only while the preloader hides the page, so nobody sees the reset.
  useEffect(() => {
    if (!intro) return;
    const html = document.documentElement;
    const preloaderPlaying =
      html.dataset.preloader !== 'off' &&
      html.dataset.intro !== 'ready' &&
      document.querySelector('.preloader') !== null;
    if (preloaderPlaying) {
      setTyped(0);
      setTyping(true);
    }
  }, [intro]);

  useEffect(() => {
    if (!typing || !ready) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 0;
    WORDMARK_LETTERS.forEach((_, i) => {
      t += i === BAYU_INDEX ? TYPE_MS + WORD_PAUSE_MS : TYPE_MS;
      timers.push(setTimeout(() => setTyped(i + 1), t));
    });
    timers.push(setTimeout(() => setTyping(false), t + 120));
    return () => timers.forEach(clearTimeout);
  }, [typing, ready]);

  const { minX, width, height, caret, caretGap } = WORDMARK;
  // A real caret jumps (no easing) to just after the last typed letter.
  const caretX = typed === 0 ? minX : WORDMARK_LETTERS[typed - 1].end + caretGap;
  // Without the caret, the box ends at the last letter's advance.
  const boxWidth = showCaret ? width : WORDMARK_LETTERS[WORDMARK_LETTERS.length - 1].end - minX;

  return (
    <svg
      viewBox={`${minX} 0 ${boxWidth} ${height}`}
      aria-hidden="true"
      className={`brand-wordmark shrink-0 overflow-visible ${className}`}
    >
      <rect
        className="brand-select fill-accent"
        x={minX - 50}
        y={0}
        width={(showCaret ? caret.x - 20 : minX + boxWidth + 30) - (minX - 50)}
        height={height}
        rx={48}
      />
      <g className={inkClassName}>
        {WORDMARK_LETTERS.map((l, i) => (
          <path key={i} d={l.d} className={i < typed ? undefined : 'opacity-0'} />
        ))}
      </g>
      {showCaret && (
        <rect
          className={`${caretClassName} ${!typing && blink ? 'brand-caret' : ''}`}
          x={caret.x}
          y={0}
          width={caret.w}
          height={height}
          rx={caret.r}
          style={{ transform: `translateX(${caretX - caret.x}px)` }}
        />
      )}
    </svg>
  );
}
