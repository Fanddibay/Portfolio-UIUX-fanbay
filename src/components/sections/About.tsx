'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { stack } from '@/lib/data';
import {
  AiOrbit,
  BentoCard,
  CardTitle,
  CodeWindow,
  EasingDemo,
  RoleTabs,
  StackBelt,
  SystemsGrid,
  type Role,
} from './about/BentoCards';

/**
 * About — dual designer/engineer identity, shown as an interactive bento.
 *
 * Intro (heading left, body right) is unchanged. Below it, six cards each prove
 * one skill: design systems, design ↔ build (tabs), Figma + AI, production code
 * (Vue/React), the stack, and motion. The plain-text tool row stays at the end
 * because recruiters scan text faster than animated logos.
 *
 * Grid: 1 col on mobile and 2 cols on tablet — the Design/Build card (the core
 * content) always leads there; on desktop 3 + 3 with it as the wider centre card.
 */
export function About() {
  const t = useTranslations('about');

  const roles: Role[] = [
    { key: 'design', title: t('designerTitle'), body: t('designerBody'), items: t.raw('designItems') as string[] },
    { key: 'build', title: t('engineerTitle'), body: t('engineerBody'), items: t.raw('buildItems') as string[] },
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
          <motion.h2 variants={fadeUp} className="font-heading text-h2 text-foreground md:text-h1">
            {t('title')}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-body-lg text-muted-foreground">
            {t('body')}
          </motion.p>
        </div>

        {/* Bento */}
        <div className="mt-12 flex flex-col gap-4 md:gap-5">
          <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-[1fr_1.25fr_1fr]">
            <BentoCard className="pt-8">
              <CardTitle>{t('systemsTitle')}</CardTitle>
              <SystemsGrid />
            </BentoCard>

            <BentoCard className="order-first md:col-span-2 lg:order-none lg:col-span-1">
              <RoleTabs roles={roles} label={t('roleTabsLabel')} />
            </BentoCard>

            <BentoCard className="pb-7">
              <AiOrbit />
              <CardTitle>{t('aiTitle')}</CardTitle>
            </BentoCard>
          </div>

          <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            <BentoCard className="min-h-[264px] pt-6">
              <CardTitle>{t('codeTitle')}</CardTitle>
              <CodeWindow />
            </BentoCard>

            <BentoCard className="min-h-[264px] pt-6">
              <CardTitle>{t('stackTitle')}</CardTitle>
              <StackBelt />
            </BentoCard>

            <BentoCard className="min-h-[264px] pt-6 md:col-span-2 lg:col-span-1">
              <CardTitle>{t('motionTitle')}</CardTitle>
              <EasingDemo />
            </BentoCard>
          </div>
        </div>

        {/* Tool row — full list, plain text for quick scanning */}
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
