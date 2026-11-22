'use client';

import { useEffect, useRef } from 'react';

/**
 * LostRobot — the confused little robot on the 404 page.
 *
 * Its eyes, brows and head follow the cursor anywhere on the page; the body
 * leans a touch. Leave the mouse alone (or use a touch screen) and it looks
 * around on its own, scratching its head. A tap makes it look at the tap.
 *
 * Kept light on purpose:
 * - One inline SVG, no animation library. Idle motion (float, blink, scratch,
 *   question marks) is plain CSS keyframes (globals.css, `.nf-*`).
 * - Tracking writes `style.transform` on four SVG groups from a single rAF
 *   loop that only runs while the pose is still easing, then stops.
 * - Pointer listeners are passive; prefers-reduced-motion skips tracking
 *   entirely and the global reduced-motion rule freezes the CSS loops.
 *
 * Colours come from the design tokens (card/border/muted/accent), so it works
 * in light and dark. The visor stays dark in both themes, like a real screen.
 */

/** Spots it glances at while idle (x, y in -1..1 around its head). */
const LOOKS: [number, number][] = [
  [-0.9, -0.2],
  [0.85, -0.45],
  [0.15, 0.6],
  [-0.55, 0.45],
  [0.05, -0.85],
  [0.9, 0.25],
];

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

export function LostRobot({ className = '' }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const browsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const body = bodyRef.current;
    const head = headRef.current;
    const eyes = eyesRef.current;
    const brows = browsRef.current;
    if (!svg || !body || !head || !eyes || !brows) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    let raf = 0;
    let idleTimer = 0;
    let lookTimer = 0;
    let look = 0;

    const apply = () => {
      const { x, y } = cur;
      eyes.style.transform = `translate(${x * 8}px, ${y * 6}px)`;
      brows.style.transform = `translate(${x * 4}px, ${y * 3 - Math.abs(x) * 2}px)`;
      // -6° is its resting "huh?" tilt; it turns toward whatever it looks at.
      head.style.transform = `translate(${x * 4}px, ${y * 3}px) rotate(${-6 + x * 9}deg)`;
      body.style.transform = `rotate(${x * 2.5}deg)`;
    };

    // Time-based easing: same turning speed on 60 Hz and 120 Hz screens, and
    // no slow-motion catch-up after a dropped frame (≈12% per 60 Hz frame).
    let last = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 16.7;
      last = now;
      const k = 1 - Math.pow(0.88, dt / 16.7);
      cur.x += (tgt.x - cur.x) * k;
      cur.y += (tgt.y - cur.y) * k;
      apply();
      if (Math.abs(tgt.x - cur.x) > 0.002 || Math.abs(tgt.y - cur.y) > 0.002) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0; // settled: stop the loop until something moves again
        last = 0;
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const aimAt = (clientX: number, clientY: number) => {
      const r = svg.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.36; // roughly its eyes
      tgt.x = clamp((clientX - cx) / Math.max(240, window.innerWidth * 0.45));
      tgt.y = clamp((clientY - cy) / Math.max(240, window.innerHeight * 0.45));
      kick();
    };

    const lookAround = () => {
      const [x, y] = LOOKS[look++ % LOOKS.length];
      tgt.x = x;
      tgt.y = y;
      kick();
      lookTimer = window.setTimeout(lookAround, 1600 + Math.random() * 1000);
    };
    const goIdleSoon = (delay: number) => {
      window.clearTimeout(lookTimer);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(lookAround, delay);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return; // touch is handled by taps
      aimAt(e.clientX, e.clientY);
      goIdleSoon(2600);
    };
    const onDown = (e: PointerEvent) => {
      aimAt(e.clientX, e.clientY);
      goIdleSoon(2200);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    goIdleSoon(700); // start looking around until the cursor shows up

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.clearTimeout(idleTimer);
      window.clearTimeout(lookTimer);
      cancelAnimationFrame(raf);
    };
  }, []);

  // SVG transforms pivot in view-box coordinates.
  const pivot = (x: number, y: number) => ({ transformBox: 'view-box' as const, transformOrigin: `${x}px ${y}px` });

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 240 280"
      aria-hidden="true"
      className={`overflow-visible ${className}`}
    >
      {/* Ground shadow breathes with the float */}
      <ellipse cx="120" cy="266" rx="58" ry="8" className="nf-shadow fill-foreground/10" style={pivot(120, 266)} />

      <g className="nf-float">
        <g ref={bodyRef} style={pivot(120, 252)}>
          {/* Legs */}
          <rect x="91" y="226" width="20" height="30" rx="9" className="fill-muted stroke-border dark:fill-zinc-700 dark:stroke-zinc-600" strokeWidth="2" />
          <rect x="129" y="226" width="20" height="30" rx="9" className="fill-muted stroke-border dark:fill-zinc-700 dark:stroke-zinc-600" strokeWidth="2" />

          {/* Right arm, hanging (outline stroke + fill stroke = outlined limb) */}
          <path d="M166 170 C 186 184, 190 204, 182 222" fill="none" strokeLinecap="round" strokeWidth="17" className="stroke-border dark:stroke-zinc-600" />
          <path d="M166 170 C 186 184, 190 204, 182 222" fill="none" strokeLinecap="round" strokeWidth="13" className="stroke-card dark:stroke-zinc-800" />
          <circle cx="182" cy="225" r="9" className="fill-card stroke-border dark:fill-zinc-800 dark:stroke-zinc-600" strokeWidth="2" />

          {/* Torso */}
          <rect x="70" y="150" width="100" height="84" rx="26" className="fill-card stroke-border dark:fill-zinc-800 dark:stroke-zinc-600" strokeWidth="2" />
          <rect x="92" y="172" width="56" height="30" rx="9" fill="#0b1020" />
          {/* "Thinking" dots on the chest screen */}
          <circle cx="107" cy="187" r="3.5" className="nf-dot fill-accent" />
          <circle cx="120" cy="187" r="3.5" className="nf-dot fill-accent" style={{ animationDelay: '0.2s' }} />
          <circle cx="133" cy="187" r="3.5" className="nf-dot fill-accent" style={{ animationDelay: '0.4s' }} />

          {/* Neck */}
          <rect x="107" y="138" width="26" height="16" rx="5" className="fill-muted stroke-border dark:fill-zinc-700 dark:stroke-zinc-600" strokeWidth="2" />

          {/* Head */}
          <g ref={headRef} style={pivot(120, 148)}>
            <line x1="120" y1="54" x2="120" y2="34" strokeWidth="3" strokeLinecap="round" className="stroke-border dark:stroke-zinc-600" />
            <circle cx="120" cy="29" r="7" className="nf-bulb fill-accent" />

            <rect x="45" y="84" width="13" height="34" rx="6" className="fill-muted stroke-border dark:fill-zinc-700 dark:stroke-zinc-600" strokeWidth="2" />
            <rect x="182" y="84" width="13" height="34" rx="6" className="fill-muted stroke-border dark:fill-zinc-700 dark:stroke-zinc-600" strokeWidth="2" />
            <rect x="56" y="52" width="128" height="94" rx="32" className="fill-card stroke-border dark:fill-zinc-800 dark:stroke-zinc-600" strokeWidth="2" />

            {/* Visor */}
            <rect x="69" y="66" width="102" height="64" rx="21" fill="#0b1020" />

            <g ref={browsRef}>
              {/* One brow up, one flat: the universal "huh?" */}
              <path d="M86 79 L108 72" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
              <path d="M133 82 L153 83" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
            </g>

            <g ref={eyesRef}>
              <g className="nf-blink" style={pivot(120, 97)}>
                <circle cx="98" cy="97" r="10" fill="#60a5fa" />
                <circle cx="101.5" cy="93.5" r="3" fill="#ffffff" fillOpacity="0.85" />
                <circle cx="142" cy="98" r="7.5" fill="#60a5fa" />
                <circle cx="144.5" cy="95.5" r="2.2" fill="#ffffff" fillOpacity="0.85" />
              </g>
            </g>

            {/* Wobbly mouth */}
            <path d="M105 117 q 4.5 -5 9 0 t 9 0 t 9 0" fill="none" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Left arm, raised: scratching its head */}
          <g className="nf-scratch" style={pivot(74, 170)}>
            <path d="M74 170 C 50 162, 40 138, 52 116" fill="none" strokeLinecap="round" strokeWidth="17" className="stroke-border dark:stroke-zinc-600" />
            <path d="M74 170 C 50 162, 40 138, 52 116" fill="none" strokeLinecap="round" strokeWidth="13" className="stroke-card dark:stroke-zinc-800" />
            <circle cx="53" cy="112" r="9" className="fill-card stroke-border dark:fill-zinc-800 dark:stroke-zinc-600" strokeWidth="2" />
          </g>
        </g>

        {/* Question marks drifting up */}
        <text x="190" y="44" className="nf-q fill-accent font-heading" fontSize="30" fontWeight="800">?</text>
        <text x="210" y="78" className="nf-q fill-muted-foreground font-heading" fontSize="18" fontWeight="800" style={{ animationDelay: '0.9s' }}>?</text>
        <text x="24" y="56" className="nf-q fill-muted-foreground font-heading" fontSize="20" fontWeight="800" style={{ animationDelay: '1.7s' }}>?</text>
      </g>
    </svg>
  );
}
