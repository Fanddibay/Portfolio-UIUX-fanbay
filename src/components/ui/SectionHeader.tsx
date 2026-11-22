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
   * bottom-aligned) instead of stacked below. Columns are 7:5 so the display
   * title gets the room to settle on two lines and the lead sits at a
   * comfortable ~55-character measure. Stacks below `lg`, where a 2-column
   * split would squeeze a 56px title into a ~380px column.
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
        <div className="grid gap-x-12 gap-y-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
          <motion.h2 variants={fadeUp} className="text-balance font-heading text-h2 text-foreground md:text-h1">
            {title}
          </motion.h2>
          {lead && (
            <motion.p variants={fadeUp} className="max-w-2xl text-pretty text-body-lg text-muted-foreground lg:max-w-none">
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
