'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { ArrowUp, ArrowUpRight, Check, Copy } from 'lucide-react';
import { CollaborateButton } from '@/components/ui/CollaborateButton';
import { ResumeModal } from '@/components/ui/ResumeModal';
import { SITE, fiverr, socials, upwork } from '@/lib/data';

/**
 * Closing footer — a dark, full-bleed band:
 *   1. a big two-line CTA (second line faded) + the Collaborate button
 *   2. four columns: brand · navigation · find me · contact (+ live local time)
 *   3. a giant faded wordmark that rises into place as you reach the bottom
 *   4. copyright + back to top
 *
 * The `dark` class on <footer> re-scopes the design tokens (globals.css), so the
 * band is dark in BOTH themes and every token-based child — résumé button,
 * Collaborate button, focus rings — themes itself with no special cases.
 */

const NAV = ['experience', 'about', 'work', 'process', 'contact'] as const; // = page order
const EASE = [0.16, 1, 0.3, 1] as const;
const ROLE = 'UI/UX Designer & Engineer';

const FIND_ME = [
  ...socials.map(({ label, url }) => ({ label, url })),
  { label: 'Upwork', url: upwork.url },
  { label: 'Fiverr', url: fiverr.url },
];

/** Text link with an underline that draws in from the left on hover/focus. */
const LINK =
  'relative w-fit text-body-sm text-foreground/70 transition-colors duration-200 ease-out hover:text-foreground ' +
  'after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current ' +
  'after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm';

const LABEL = 'font-mono text-label uppercase tracking-[0.2em] text-foreground/50';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tActions = useTranslations('actions');
  const locale = useLocale();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const footerRef = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();

  // Same rule as the Navbar: on sub-pages, hash links must go home first.
  const isHome = pathname === `/${locale}` || pathname === '/';
  const navHref = (hash: string) => (isHome ? `#${hash}` : `/${locale}#${hash}`);

  // Wordmark rises into its slot as the footer scrolls into view.
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ['start end', 'end end'] });
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ['45%', '0%']);

  // Masked line reveal. The in-view trigger lives on the <h2>, not the lines:
  // a line parked at y:105% inside its overflow-hidden mask is fully clipped,
  // so an observer on the line itself would never fire.
  const headingMotion = reduce
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'shown',
        viewport: { once: true, margin: '-60px' },
        transition: { staggerChildren: 0.12 },
      };
  const line = {
    hidden: { y: '105%' },
    shown: { y: '0%', transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <footer ref={footerRef} className="dark relative overflow-hidden bg-background text-foreground">
      {/* Soft accent glow from the top-left — separates the band in dark mode too */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{ background: 'radial-gradient(55% 100% at 12% 0%, rgb(var(--accent) / 0.16), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-content px-6 md:px-8">
        {/* 1 — CTA */}
        <div className="flex flex-col items-start gap-10 border-b border-foreground/10 py-20 md:py-28">
          <motion.h2
            {...headingMotion}
            className="font-heading text-[clamp(2.25rem,6vw,4.75rem)] font-bold leading-[1.02] tracking-tight"
          >
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block" variants={reduce ? undefined : line}>
                {t('ctaLine1')}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block text-foreground/40" variants={reduce ? undefined : line}>
                {t('ctaLine2')}
              </motion.span>
            </span>
          </motion.h2>
          <div>
            <CollaborateButton href={`mailto:${SITE.email}`} label={tNav('letsTalk')} />
          </div>
        </div>

        {/* 2 — Columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-14 md:grid-cols-3 md:py-16 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr]">
          {/* Brand — own row on phone/tablet, first column on desktop */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <p className="font-heading text-h4 font-bold">
              {SITE.name}
              <span className="text-accent">.</span>
            </p>
            <p className={`mt-1.5 ${LABEL}`}>{ROLE}</p>
            <p className="mt-5 max-w-xs text-body-sm text-foreground/70">{t('tagline')}</p>
          </div>

          {/* Navigation */}
          <nav aria-label={t('navLabel')}>
            <p className={LABEL}>{t('navLabel')}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {NAV.map((key) => (
                <li key={key}>
                  <a href={navHref(key)} className={LINK}>
                    {tNav(key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Find me */}
          <div>
            <p className={LABEL}>{t('findLabel')}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {FIND_ME.map(({ label, url }) => (
                <li key={label}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className={`group inline-flex items-center gap-1 ${LINK}`}>
                    {label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <p className={LABEL}>{t('contactLabel')}</p>
            <div className="mt-5 flex flex-col gap-4">
              <EmailRow copyLabel={t('copyEmail')} copiedLabel={t('copied')} />
              <div className="flex flex-col gap-1.5">
                <p className="text-body-sm text-foreground/70">{t('location')}</p>
                <LocalClock label={t('localTime')} />
              </div>
              <ResumeModal />
            </div>
          </div>
        </div>
      </div>

      {/* 3 — Giant wordmark, cropped at its base like a horizon */}
      <div className="relative mx-auto max-w-content px-6 md:px-8">
        {/* Font size = available width ÷ 5 (the name is ~4.8em wide), capped at the
            1152px content width — so the wordmark spans edge to edge at every size. */}
        <div aria-hidden="true" className="h-[0.74em] select-none overflow-hidden text-[min(calc((100vw-4rem)/5),13.5rem)]">
          <motion.p
            style={reduce ? undefined : { y: wordmarkY }}
            className="whitespace-nowrap font-heading text-[1em] font-bold leading-none tracking-tighter text-foreground/[0.07]"
          >
            {SITE.name}
          </motion.p>
        </div>

        {/* 4 — Bottom bar (extra bottom padding on mobile clears the floating tab bar) */}
        <div className="flex flex-col gap-4 border-t border-foreground/10 pb-28 pt-6 sm:flex-row sm:items-center sm:justify-between md:pb-8">
          <p className="text-body-sm text-foreground/50">
            © {year} {SITE.name} · {ROLE}. {t('rights')}
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
            className="group inline-flex w-fit items-center gap-3 rounded-full text-body-sm text-foreground/70 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            {tActions('backToTop')}
            <span className="flex size-9 items-center justify-center rounded-full border border-foreground/15 transition-colors duration-200 group-hover:border-accent group-hover:bg-accent-solid group-hover:text-accent-foreground">
              <ArrowUp className="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

/** Email link + a one-tap copy button (with confirmation, announced to screen readers). */
function EmailRow({ copyLabel, copiedLabel }: { copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
    } catch {
      // Clipboard blocked (e.g. insecure context) — the mailto link still works.
    }
  }

  return (
    <div className="flex items-center gap-2">
      <a href={`mailto:${SITE.email}`} className={LINK}>
        {SITE.email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? copiedLabel : copyLabel}
        title={copied ? copiedLabel : copyLabel}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-foreground/50 transition-colors duration-200 hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ''}
      </span>
    </div>
  );
}

/** Live Jakarta time (WIB) — tells international clients when to expect a reply.
 * Rendered client-side only so the server's clock never causes a hydration mismatch. */
function LocalClock({ label }: { label: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="flex items-center gap-2 text-body-sm text-foreground/60">
      <span aria-hidden="true" className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
      </span>
      <time className="font-heading font-semibold tabular-nums text-foreground">{time ?? '--:--'}</time>
      <span>
        {label} · WIB (UTC+7)
      </span>
    </p>
  );
}
