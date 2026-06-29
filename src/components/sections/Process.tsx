'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { SectionHeader } from '@/components/ui/SectionHeader';

/**
 * Process — 4 ordered steps. Numbered markers (01–04) are used deliberately
 * here because this genuinely is a sequence; the order carries meaning
 * (frontend-design: "numbering should encode something true").
 */
export function Process() {
  const t = useTranslations('process');

  const steps = [
    { n: '01', title: t('step1Title'), body: t('step1Body') },
    { n: '02', title: t('step2Title'), body: t('step2Body') },
    { n: '03', title: t('step3Title'), body: t('step3Body') },
    { n: '04', title: t('step4Title'), body: t('step4Body') },
  ];

  return (
    <section id="process" className="section">
      <SectionHeader overline={t('overline')} title={t('title')} />

      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
      >
        {steps.map(({ n, title, body }) => (
          <motion.li
            key={n}
            variants={fadeUp}
            className="group bg-card p-6 transition-colors duration-250 ease-out hover:bg-muted"
          >
            <span className="font-mono text-h3 font-medium text-accent/40 transition-colors duration-250 ease-out group-hover:text-accent">
              {n}
            </span>
            <h3 className="mt-4 font-heading text-h4 text-card-foreground">{title}</h3>
            <p className="mt-2 text-body-sm text-muted-foreground">{body}</p>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
