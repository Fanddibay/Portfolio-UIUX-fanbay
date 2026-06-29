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
}: {
  overline: string;
  title: string;
  lead?: string;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="mb-16 max-w-2xl"
    >
      <motion.p variants={fadeUp} className="overline mb-3">
        {overline}
      </motion.p>
      <motion.h2 variants={fadeUp} className="font-heading text-h2 md:text-h1 text-foreground">
        {title}
      </motion.h2>
      {lead && (
        <motion.p variants={fadeUp} className="mt-4 text-body-lg text-muted-foreground">
          {lead}
        </motion.p>
      )}
    </motion.div>
  );
}
