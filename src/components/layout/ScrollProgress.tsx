'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgress — a thin blue bar pinned to the very top of the viewport that
 * fills left-to-right as the page scrolls. Sits above every other fixed layer
 * (scroll progress > marquee > navbar), so on mobile — where the native
 * scrollbar is hidden — it's the topmost scroll cue.
 *
 * The raw scroll value is passed through a spring so the fill glides instead of
 * snapping, and a soft glow + a light-blue tail keep it legible even when it
 * overlaps the blue marquee once that docks.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[#1d4ed8] via-[#3b82f6] to-[#93c5fd] shadow-[0_0_10px_rgba(59,130,246,0.75)]"
    />
  );
}
