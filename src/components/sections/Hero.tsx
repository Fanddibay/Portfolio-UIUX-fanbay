'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { SpotlightPhoto } from '@/components/ui/SpotlightPhoto';
import { SITE } from '@/lib/data';

/**
 * Hero — the page thesis (DESIGN.md §9; frontend-design "hero is a thesis").
 *
 * Layout (desktop): the oversized name spans the full width behind the
 * portrait; a 3-column row then flanks the portrait — intro on the left,
 * socials on the right — both bottom-aligned to the photo, per the reference.
 * On mobile it collapses to a clean stack: name → photo → intro → socials.
 *
 * The portrait carries the signature interaction (cursor color spotlight).
 */
export function Hero() {
  const t = useTranslations('hero');
  const [first, ...restName] = SITE.name.split(' ');
  const last = restName.join(' ');

  return (
    <section id="top" className="mx-auto max-w-content px-6 md:px-8">
      {/* Fills one viewport (minus the 4rem navbar); content vertically centered
          so there's no dead space below the fold. */}
      <div className="relative flex min-h-[calc(100dvh-4rem)] flex-col justify-center py-10 md:py-12">
        {/* --- Oversized name (sits behind the portrait) --- */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          aria-label={SITE.name}
          className="pointer-events-none relative z-0 select-none text-center font-heading font-black uppercase leading-[0.85] tracking-tight text-foreground"
          style={{ fontSize: 'clamp(2.75rem, 13vw, 10.5rem)' }}
        >
          <span className="text-outline">{first}</span> <span>{last}</span>
        </motion.h1>

        {/* --- Flanking row: intro · portrait · socials --- */}
        <div className="relative z-10 grid items-end gap-8 md:-mt-[6vw] md:grid-cols-[1fr_minmax(300px,440px)_1fr] md:gap-8">
          {/* Intro (left) */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="order-2 max-w-md md:order-1 md:pb-6"
          >
            <motion.p variants={fadeUp} className="font-heading text-h3 font-bold text-foreground">
              {t('role')}
            </motion.p>
            <motion.p variants={fadeUp} className="mt-3 text-body-lg text-foreground">
              {t('tagline')}
            </motion.p>
            <motion.p variants={fadeUp} className="mt-3 text-body-sm text-muted-foreground">
              {t('description')}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-6">
              <Button as="a" href="#contact" variant="primary">
                {t('cta')}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Portrait (center) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 mx-auto w-[min(330px,72vw)] md:order-2 md:w-full"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <SpotlightPhoto src="/profile.png" alt={SITE.name} priority />
            </div>
          </motion.div>

          {/* Socials (right) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="order-3 md:pb-6"
          >
            <SocialLinks variant="pill" className="md:ml-auto md:w-fit md:min-w-[180px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
