'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import { highlights } from '@/lib/data';

/**
 * StatsMarquee — a full-bleed, blue highlights band that sits directly under the
 * hero. It ticks through career highlights (experience, hours logged, projects,
 * clients, earnings) plus a few qualitative tags.
 *
 * Design notes:
 * - The band colour is anchored to a fixed blue-600 (#2563eb) in BOTH themes
 *   rather than the theme-swapping `--accent`. The dark-mode accent (#3b82f6) is
 *   too light for white text to clear WCAG AA at small sizes; blue-600 keeps
 *   white labels at ~5:1 in either theme while still reading as the brand blue.
 * - Motion is a seamless CSS marquee (see `.marquee` in globals.css): two
 *   identical tracks, translated -50% to loop. It pauses on hover and collapses
 *   to a hand-scrollable row under `prefers-reduced-motion`.
 * - Content travels right-to-left (the ticker norm). To reverse it, add
 *   `[animation-direction:reverse]` to the `.marquee-track`.
 * - The band is `sticky top-0`: once you scroll past the hero it docks to the
 *   very top (above the navbar). A scroll effect measures its height into
 *   `--marquee-h` and toggles `html.marquee-docked`, which nudges the navbar
 *   down so the two stack instead of overlapping (see globals.css).
 */

/** 4-point sparkle used as the divider between ticker items. */
function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3 w-3 shrink-0 text-white/40">
      <path
        fill="currentColor"
        d="M12 0c.7 6.2 5.1 10.6 11.3 11.3v1.4C17.1 13.4 12.7 17.8 12 24c-.7-6.2-5.1-10.6-11.3-11.3v-1.4C6.9 10.6 11.3 6.2 12 0Z"
      />
    </svg>
  );
}

export function StatsMarquee() {
  const t = useTranslations('statsMarquee');
  const tags = t.raw('tags') as string[];
  const ref = useRef<HTMLElement>(null);

  // Dock choreography. The band is `sticky top-0`, so it pins itself; this
  // effect only keeps the navbar glued directly *beneath* it via `--nav-top`:
  //   • docked (top ≈ 0)      → navbar sits at the band's full height
  //   • sliding in (0 < top ≤ h) → navbar tracks the band's live bottom edge, so
  //                              it never peeks above nor gets half-covered
  //   • hero region (top > h) → navbar returns to the very top (0)
  // rAF-throttled so the scroll handler stays cheap.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;

    const setHeight = () => root.style.setProperty('--marquee-h', `${el.offsetHeight}px`);

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const h = el.offsetHeight;
      let navTop = 0;
      if (rect.top <= 0.5) navTop = h;
      else if (rect.top <= h) navTop = Math.round(rect.bottom);
      root.style.setProperty('--nav-top', `${navTop}px`);
      root.classList.toggle('marquee-docked', rect.top <= h);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    const onResize = () => {
      setHeight();
      update();
    };

    setHeight();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      root.classList.remove('marquee-docked');
      root.style.removeProperty('--nav-top');
      root.style.removeProperty('--marquee-h');
    };
  }, []);

  // One pass of the ticker: numeric stats first, then qualitative tags. Each
  // item is followed by a sparkle divider so spacing is uniform end-to-end
  // (which is what keeps the -50% loop seamless).
  const items = [
    ...highlights.map((h) => ({ key: h.labelKey, value: h.value, label: t(h.labelKey) })),
    ...tags.map((tag, i) => ({ key: `tag-${i}`, value: undefined, label: tag })),
  ];

  const track = (ariaHidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {items.map((item) => (
        <li key={item.key} className="flex items-center">
          <span className="flex items-baseline gap-2 whitespace-nowrap">
            {item.value && (
              <span className="font-heading text-base font-extrabold tracking-tight text-white md:text-lg">
                {item.value}
              </span>
            )}
            <span
              className={
                item.value
                  ? 'text-body-sm text-white/90'
                  : 'text-body-sm font-semibold uppercase tracking-wide text-white/90'
              }
            >
              {item.label}
            </span>
          </span>
          <span className="mx-5 md:mx-7" aria-hidden="true">
            <Sparkle />
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section
      ref={ref}
      aria-label={t('aria')}
      className="sticky top-0 z-40 w-full overflow-hidden border-y border-white/15 bg-[#2563eb] shadow-md"
    >
      {/* subtle top sheen for depth without hurting contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/25"
      />
      <div className="marquee marquee--fade marquee--slow py-3.5 md:py-4">
        <div className="marquee-track">
          {track(false)}
          {track(true)}
        </div>
      </div>
    </section>
  );
}
