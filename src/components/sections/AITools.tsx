'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { fadeIn, staggerContainer } from '@/lib/motion';
import { SectionHeader } from '@/components/ui/SectionHeader';

/**
 * AI Tools — differentiator section. Each card uses the tool's real brand mark
 * (in /public/brands) and explains what it's used for.
 *
 * Layout: a swipeable scroll-snap carousel on mobile (cards peek to signal
 * swipe), a 3-column grid on desktop.
 *
 * NOTE: brand SVGs in /public/brands are best-effort marks — drop the official
 * SVGs there (same filenames) for pixel-perfect brand accuracy.
 */
export function AITools() {
  const t = useTranslations('aiTools');

  const tools = [
    { logo: '/brands/claude.svg', title: t('claudeCodeTitle'), body: t('claudeCodeBody') },
    { logo: '/brands/stitch.svg', title: t('claudeDesignTitle'), body: t('claudeDesignBody') },
    { logo: '/brands/google-ai-studio.svg', title: t('aiStudioTitle'), body: t('aiStudioBody') },
  ];

  return (
    <section className="section">
      <SectionHeader overline={t('overline')} title={t('title')} lead={t('body')} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0"
      >
        {tools.map(({ logo, title, body }) => (
          <motion.div
            key={title}
            variants={fadeIn}
            className="flex w-[78%] shrink-0 snap-start flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-250 ease-out hover:-translate-y-1 hover:shadow-lg md:w-auto"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt="" aria-hidden="true" width={28} height={28} className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-heading text-h3 text-card-foreground">{title}</h3>
            <p className="mt-2 text-body-sm text-muted-foreground">{body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
