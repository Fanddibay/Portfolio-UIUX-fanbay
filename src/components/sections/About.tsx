'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Palette, Code2, Check } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { stack } from '@/lib/data';

/**
 * About — dual designer/engineer identity (designer-led), text-only.
 * Intro uses a two-column layout (heading left, body right) so it reads
 * edge-to-edge instead of left-heavy. Each capability card carries a short
 * description plus a checklist; the tool row spans the full width.
 */
export function About() {
  const t = useTranslations('about');

  // Arrays come from the message files via t.raw
  const designItems = t.raw('designItems') as string[];
  const buildItems = t.raw('buildItems') as string[];

  const cards = [
    { icon: Palette, title: t('designerTitle'), body: t('designerBody'), items: designItems },
    { icon: Code2, title: t('engineerTitle'), body: t('engineerBody'), items: buildItems },
  ];

  return (
    <section id="about" className="section">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.p variants={fadeUp} className="overline mb-3">
          {t('overline')}
        </motion.p>

        {/* Intro — heading left, body right (fills the full width) */}
        <div className="grid gap-x-16 gap-y-5 md:grid-cols-2 md:items-end">
          <motion.h2 variants={fadeUp} className="font-heading text-h2 md:text-h1 text-foreground">
            {t('title')}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-body-lg text-muted-foreground">
            {t('body')}
          </motion.p>
        </div>

        {/* Design / Build capability cards */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {cards.map(({ icon: Icon, title, body, items }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 md:p-8"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent/10 text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-h3 text-card-foreground">{title}</h3>
              <p className="mt-2 text-body text-muted-foreground">{body}</p>

              {/* Capability checklist */}
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-body-sm text-foreground">
                    <Check className="h-4 w-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Tool row — full width */}
        <motion.div variants={fadeUp} className="mt-12">
          <p className="font-mono text-label uppercase tracking-widest text-muted-foreground">
            {t('stackLabel')}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {stack.map((tool) => (
              <li
                key={tool}
                className="rounded-md border border-border bg-card px-3 py-1.5 font-body text-body-sm text-foreground"
              >
                {tool}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
