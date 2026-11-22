'use client';

import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { clients, type ClientLogo } from '@/lib/data';

const BASE_H = 28; // px — optical height of a wordmark in the strip

/**
 * One logo, two layers sharing the same box:
 * 1. a silhouette (the -mono.png used as a CSS mask over `currentColor`), so every
 *    logo reads as one calm, theme-aware row — grey at rest, full contrast on hover;
 * 2. the original colour artwork, cross-faded in on hover (light mode only —
 *    several marks are navy/black and would vanish on the dark background).
 * Echoes the site's signature grayscale → colour reveal.
 */
function Logo({ c }: { c: ClientLogo }) {
  const h = Math.round(BASE_H * (c.scale ?? 1));
  const w = Math.round(h * c.ratio);
  const mask = `url(/clients/${c.slug}-mono.png)`;
  const maskStyle: CSSProperties = {
    WebkitMaskImage: mask,
    maskImage: mask,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  };

  return (
    <span className="group/logo flex shrink-0 items-center gap-2 text-muted-foreground/75 transition-colors duration-300 hover:text-foreground">
      <span className="relative block" style={{ width: w, height: h }}>
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-current transition-opacity duration-300 group-hover/logo:opacity-0 dark:group-hover/logo:opacity-100"
          style={maskStyle}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- small pre-trimmed PNG, sized by the box */}
        <img
          src={`/clients/${c.slug}.png`}
          alt=""
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-300 group-hover/logo:opacity-100 dark:hidden"
        />
      </span>
      {c.caption && (
        <span aria-hidden="true" className="font-heading text-[17px] font-extrabold tracking-tight">
          {c.caption}
        </span>
      )}
      <span className="sr-only">{c.name}</span>
    </span>
  );
}

/** "Trusted by" strip — clients & platforms from the Experience timeline. */
export function ClientLogos() {
  const t = useTranslations('heroShowcase');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative pb-16 pt-2 md:pb-24"
    >
      <p className="text-balance text-center font-heading text-[clamp(1.125rem,2.4vw,1.625rem)] font-semibold tracking-tight text-foreground">
        {t('clients')}
      </p>

      {/* Desktop: one calm row */}
      <div className="hidden md:block">
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 lg:justify-between lg:gap-x-6">
          {clients.map((c) => (
            <li key={c.slug}>
              <Logo c={c} />
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile: auto-scrolling marquee (two identical sets → seamless loop) */}
      <div className="marquee marquee--fade mt-7 md:hidden">
        <ul className="marquee-track" aria-label={t('clients')}>
          {[...clients, ...clients].map((c, i) => (
            <li key={`${c.slug}-${i}`} className="mr-10" aria-hidden={i >= clients.length || undefined}>
              <Logo c={c} />
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
