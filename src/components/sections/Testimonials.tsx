'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Quote, ArrowUpRight } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/lib/motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { testimonials } from '@/lib/data';

/** Testimonials — social proof. Quotes live in data.ts (not translated). */
export function Testimonials() {
  const t = useTranslations('testimonials');

  return (
    <section className="section">
      <SectionHeader overline={t('overline')} title={t('title')} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid gap-4 md:grid-cols-3"
      >
        {testimonials.map((item) => (
          <motion.figure
            key={item.name}
            variants={fadeIn}
            className="flex flex-col rounded-2xl border border-border bg-card p-6"
          >
            <Quote className="h-6 w-6 text-accent/40" />
            <blockquote className="mt-4 flex-1 text-body text-card-foreground">
              {item.quote}
            </blockquote>
            <figcaption className="mt-6 flex items-end justify-between gap-3 border-t border-border pt-4">
              <div>
                <p className="font-heading text-h4 text-card-foreground">{item.name}</p>
                <p className="text-body-sm text-muted-foreground">{item.role}</p>
              </div>
              {/* Verified source link */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.name} ${t('via')} ${item.platform}`}
                className="inline-flex shrink-0 items-center gap-1 font-mono text-label text-muted-foreground transition-colors duration-150 ease-out hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                {t('via')} {item.platform}
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
