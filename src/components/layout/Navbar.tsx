'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CollaborateButton } from '@/components/ui/CollaborateButton';
import { BrandWordmark } from '@/components/ui/BrandLogo';
import { SITE, projects } from '@/lib/data';

/** In-page anchor targets — keys match the `nav` namespace in /messages. */
const LINKS = ['experience', 'about', 'work', 'process', 'contact'] as const; // = page order

/**
 * Sticky top navigation (DESIGN.md §9, §12).
 *
 * Scroll behaviour: slides up when scrolling down, back in when scrolling up;
 * gains a blurred background once past the hero. The brand ("fandibayu"
 * wordmark + availability dot) stays put so the site is always
 * recognisably Fandi's.
 *
 * Right cluster (theme · language · résumé) is shared across breakpoints.
 * Primary navigation on mobile lives in the bottom tab bar, so there is no
 * hamburger here.
 */
export function Navbar() {
  const t = useTranslations('nav');
  const tHero = useTranslations('hero');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  const workCount = projects.filter((p) => p.featured).length;

  // On sub-pages (e.g. /en/work/slug) hash-only links won't scroll the homepage.
  // Prefix with the locale root so the browser navigates home first, then scrolls.
  const isHome = pathname === `/${locale}` || pathname === '/';
  const navHref = (hash: string) => (isHome ? `#${hash}` : `/${locale}#${hash}`);

  // Hide on scroll down, reveal on scroll up. rAF-throttled (one read per
  // frame), and direction only flips after a 6px move so trackpad jitter and
  // momentum tails don't make the bar flicker in and out.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const syncNavState = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y <= 140) setHidden(false);
      else if (Math.abs(y - last) > 6) setHidden(y > last);
      else return; // keep `last` anchored until the move is big enough
      last = y;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(syncNavState);
    };

    syncNavState();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: hidden ? '-110%' : '0%' }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ top: 'var(--nav-top, 0px)' }}
      className={`sticky z-30 border-b transition-[top,background-color,border-color,backdrop-filter] duration-300 ease-out ${
        scrolled
          ? 'border-border bg-background/80 backdrop-blur-md'
          : 'border-border/40 bg-background/60 backdrop-blur-sm'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-content items-center justify-between px-4 md:px-8">
        {/* Left: brand. The "fandibayu" wordmark (= the domain) types itself on
            as the preloader lifts; hover/focus selects it like text. Desktop adds
            the live availability dot, like an "online" badge on the caret. */}
        <a
          href={navHref('top')}
          aria-label={`${SITE.name}, ${tHero('available')}`}
          className="group/brand relative flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <span className="relative flex items-center">
            <BrandWordmark intro className="h-[22px] w-auto md:h-6" />
            <span className="absolute -right-3.5 -top-1 hidden h-2.5 w-2.5 md:flex">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </span>
          </span>

          {/* Hover hint — what the green dot means */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-full mt-3 hidden -translate-y-1 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-2.5 py-1 font-body text-[11px] text-muted-foreground opacity-0 shadow-md transition-[opacity,transform] duration-200 ease-out group-hover/brand:translate-y-0 group-hover/brand:opacity-100 md:inline-flex"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {tHero('available')}
          </span>
        </a>

        {/* Center: desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link}>
              <a
                href={navHref(link)}
                className="inline-flex items-baseline gap-1 font-body text-body-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
              >
                {t(link)}
                {link === 'work' && (
                  <span className="font-mono text-label text-accent">[{workCount}]</span>
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Right cluster. Theme toggle is desktop-only — on mobile it lives
            beside the bottom tab bar. Résumé is more compact on mobile. */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <span className="hidden md:inline-flex">
            <ThemeToggle />
          </span>
          <LanguageSwitcher />
          <CollaborateButton href={`mailto:${SITE.email}`} label={t('letsTalk')} />
        </div>
      </nav>
    </motion.header>
  );
}
