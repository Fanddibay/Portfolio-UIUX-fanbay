'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motion';

/**
 * Consistent section header: overline label + title (+ optional lead).
 * Animates in on scroll. Reused by every section so spacing/typography
 * stay identical across the page (see DESIGN.md §8).
 */
export function SectionHeader({
  overline,
  title,
  lead,
  split = false,
}: {
  overline: string;
  title: string;
  lead?: string;
  /**
   * `split` places the lead to the right of the title on desktop (About-style,
   * bottom-aligned) instead of stacked below — fills the width and removes the
   * large right-side gap. Falls back to a stack on mobile.
   */
  split?: boolean;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={split ? 'mb-16' : 'mb-16 max-w-2xl'}
    >
      <motion.p variants={fadeUp} className="overline mb-3">
        {overline}
      </motion.p>

      {split ? (
        <div className="grid gap-x-16 gap-y-4 md:grid-cols-2 md:items-end">
          <motion.h2 variants={fadeUp} className="font-heading text-h2 md:text-h1 text-foreground">
            {title}
          </motion.h2>
          {lead && (
            <motion.p variants={fadeUp} className="text-body-lg text-muted-foreground">
              {lead}
            </motion.p>
          )}
        </div>
      ) : (
        <>
          <motion.h2 variants={fadeUp} className="font-heading text-h2 md:text-h1 text-foreground">
            {title}
          </motion.h2>
          {lead && (
            <motion.p variants={fadeUp} className="mt-4 text-body-lg text-muted-foreground">
              {lead}
            </motion.p>
          )}
        </>
      )}
    </motion.div>
  );
}
