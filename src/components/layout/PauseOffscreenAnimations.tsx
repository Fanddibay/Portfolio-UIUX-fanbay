'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Pauses every CSS animation inside page sections that are off-screen.
 *
 * The page has ~35 looping CSS animations (hero orbit + ring dashes, floating
 * tiles, ping dots, badge shine, marquee…). Browsers keep ticking them even when
 * their section is far outside the viewport, and the SVG ones (stroke-dashoffset,
 * rotating arcs) repaint on every tick. This observer flags each top-level
 * section with `data-offscreen` while it's out of view; globals.css then sets
 * `animation-play-state: paused` on everything inside it. A 200px margin resumes
 * them just before the section scrolls in, so nothing visibly "starts".
 *
 * Renders nothing. Re-binds on route change (sections differ per page).
 */
export function PauseOffscreenAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const targets = Array.from(document.querySelectorAll<HTMLElement>('main > *, body footer'));
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.removeAttribute('data-offscreen');
          else e.target.setAttribute('data-offscreen', '');
        }
      },
      { rootMargin: '200px 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => {
      io.disconnect();
      targets.forEach((t) => t.removeAttribute('data-offscreen'));
    };
  }, [pathname]);

  return null;
}
