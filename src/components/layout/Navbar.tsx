'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CollaborateButton } from '@/components/ui/CollaborateButton';
import { SITE, projects } from '@/lib/data';

/** In-page anchor targets — keys match the `nav` namespace in /messages. */
const LINKS = ['work', 'about', 'experience', 'process', 'contact'] as const;

/**
 * Sticky top navigation (DESIGN.md §9, §12).
 *
 * Scroll behaviour: slides up when scrolling down, back in when scrolling up;
 * gains a blurred background once past the hero; the availability pill
 * cross-fades into the wordmark (desktop only).
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

  useEffect(() => {
    let last = window.scrollY;
    const syncNavState = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > last && y > 140);
      last = y;
    };

    syncNavState();
    window.addEventListener('scroll', syncNavState, { passive: true });
    return () => window.removeEventListener('scroll', syncNavState);
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
        {/* Left: wordmark on mobile; animated pill ↔ wordmark on desktop */}
        <a href={navHref('top')} className="flex items-center focus-visible:outline-none">
          <span className="whitespace-nowrap font-heading text-h4 font-bold text-foreground md:hidden">
            {SITE.name}
            <span className="text-accent">.</span>
          </span>

          <span className="relative hidden items-center md:flex">
            <AnimatePresence mode="wait" initial={false}>
              {scrolled ? (
                <motion.span
                  key="wordmark"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="font-heading text-h4 font-bold text-foreground"
                >
                  {SITE.name}
                  <span className="text-accent">.</span>
                </motion.span>
              ) : (
                <motion.span
                  key="pill"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <span className="font-mono text-label text-muted-foreground">
                    {tHero('available')}
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
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
