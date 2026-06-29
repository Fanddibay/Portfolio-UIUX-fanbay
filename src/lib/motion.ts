import type { Variants } from 'framer-motion';

/**
 * Shared Framer Motion variants (see DESIGN.md §7).
 * Spring easing [0.16, 1, 0.3, 1] gives entrances a natural, non-robotic feel.
 * All consumers pair these with `whileInView` + `viewport={{ once: true }}`
 * so sections animate in once as the user scrolls to them.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/** Default entrance — fade while rising 24px. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/** Subtle fade + scale, used for cards inside a grid. */
export const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE } },
};

/** Slide in from the left — used for the about media column. */
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

/**
 * Parent wrapper that staggers its children's entrances.
 * Children should use one of the variants above.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
