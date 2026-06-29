'use client';

import Image from 'next/image';
import { useRef, type PointerEvent } from 'react';

/**
 * Hero portrait with a cursor-tracking color spotlight (DESIGN.md signature).
 * Two stacked images: a grayscale base and a full-color copy masked to a
 * soft circle. The circle grows on hover (CSS) and follows the pointer (JS).
 *
 * Pointer position is written straight to the DOM node's CSS vars — no React
 * state — so moving the mouse never triggers a re-render.
 */
export function SpotlightPhoto({
  src,
  alt,
  priority = false,
  className = '',
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const colorRef = useRef<HTMLDivElement>(null);

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const node = colorRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    node.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  }

  return (
    <div
      // absolute inset-0 fills the aspect-ratio parent, giving next/image `fill`
      // a definite height (avoids the "fill + height 0" warning)
      className={`spotlight absolute inset-0 ${className}`}
      onPointerMove={handleMove}
      // Make the group focusable so keyboard users can trigger the reveal too
      tabIndex={0}
      aria-label={alt}
    >
      {/* Base: grayscale, always visible */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 80vw, 440px"
        priority={priority}
        className="object-cover grayscale"
      />
      {/* Overlay: full color, revealed inside the moving spotlight.
          Shares `priority` with the base so the LCP image isn't lazy-loaded. */}
      <div ref={colorRef} className="spotlight__color absolute inset-0" aria-hidden="true">
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 768px) 80vw, 440px"
          priority={priority}
          className="object-cover"
        />
      </div>
    </div>
  );
}
