import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { LostRobot } from '@/components/ui/LostRobot';

/**
 * 404 for unknown routes within a locale (bad /work slug or any unknown path,
 * via the [...rest] catch-all).
 *
 * A confused robot (ui/LostRobot) follows the cursor; behind it a faint dot
 * grid, a soft accent glow and an oversized "404". Copy and buttons rise in
 * with the site's standard fade-up, staggered. No animation library: the
 * entrance is CSS (`.nf-rise`), so the page stays light.
 */
export default function NotFound() {
  const t = useTranslations('notFound');
  const locale = useLocale();
  const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

  return (
    // data-not-found: globals.css hides the "opening portfolio" preloader on
    // this page (someone who followed a broken link should see the 404 right
    // away, not a 4s intro), and Preloader skips its timer.
    <main
      data-not-found=""
      className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-16"
    >
      {/* Backdrop: dot grid + accent glow (radial gradient, no blur filter) */}
      <div aria-hidden="true" className="nf-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent)/0.14),transparent)]"
      />

      <div className="relative flex max-w-xl flex-col items-center text-center">
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 select-none font-heading text-[8.5rem] font-extrabold leading-none tracking-tighter text-foreground/[0.05] sm:text-[12rem]"
          >
            404
          </span>
          <LostRobot className="nf-rise relative w-48 sm:w-56" />
        </div>

        <p className="nf-rise overline mt-8" style={delay(120)}>
          {t('overline')}
        </p>
        <h1 className="nf-rise mt-3 text-balance font-heading text-h2 text-foreground md:text-h1" style={delay(180)}>
          {t('title')}
        </h1>
        <p className="nf-rise mt-3 max-w-md text-pretty text-body-lg text-muted-foreground" style={delay(240)}>
          {t('body')}
        </p>
        <div className="nf-rise mt-8 flex flex-wrap justify-center gap-3" style={delay(300)}>
          <Button as="a" href={`/${locale}`}>
            {t('cta')}
          </Button>
          <Button as="a" variant="secondary" href={`/${locale}#work`}>
            {t('secondary')}
          </Button>
        </div>
      </div>
    </main>
  );
}
