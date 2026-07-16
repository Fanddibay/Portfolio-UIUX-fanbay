'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Quote, ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { testimonials, loc } from '@/lib/data';

/**
 * Testimonials — an editorial carousel of client reviews.
 *
 * Layout: overline + title on the left, prev/next arrows on the right (a
 * magazine-style header), then a horizontal scroll-snap track of peeking cards
 * with synced dot indicators below. Cards peek to signal swipe-ability; arrows
 * and dots drive the same track, so touch (swipe), mouse (arrows), and keyboard
 * (focus + arrow keys / dots) all navigate the same content.
 *
 * Quotes are the client's verbatim words (original language); only the project
 * context under each is localized (see DESIGN.md §8 — one card system reused).
 */
export function Testimonials() {
  const t = useTranslations('testimonials');
  const locale = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Derive the active card (left-most visible) + the scroll extents that
  // enable/disable the arrows. A scroll listener is more reliable than an
  // IntersectionObserver when several cards are visible at once on desktop.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Direct (unthrottled) — cheap for a handful of cards, and avoids relying
    // on rAF so the indicators stay in sync even under heavy scroll.
    const update = () => {
      const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-card]'));
      const trackLeft = track.getBoundingClientRect().left;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((c, i) => {
        const dist = Math.abs(c.getBoundingClientRect().left - trackLeft);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setIndex(best);
      setAtStart(track.scrollLeft <= 4);
      setAtEnd(track.scrollLeft >= track.scrollWidth - track.clientWidth - 4);
    };

    update();
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Dots (mobile, one card per view): jump straight to a card.
  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-card]'));
    const clamped = Math.max(0, Math.min(i, cards.length - 1));
    cards[clamped]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }, []);

  // Arrows (desktop, several cards per view): advance by one card-stride so
  // navigation stays even no matter how many cards are on screen.
  const scrollByCard = useCallback((dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-card]'));
    const stride = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
    track.scrollBy({ left: dir * stride, behavior: 'smooth' });
  }, []);

  return (
    <section className="section">
      {/* Editorial header: overline + title (left), nav arrows (right) */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-12 flex items-end justify-between gap-6"
      >
        <div className="max-w-2xl">
          <motion.p variants={fadeUp} className="overline mb-3">
            {t('overline')}
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-heading text-h2 text-foreground md:text-h1">
            {t('title')}
          </motion.h2>
        </div>

        {/* Arrows — hidden on touch-first mobile, where swipe + dots lead */}
        <motion.div variants={fadeUp} className="hidden shrink-0 items-center gap-2 sm:flex">
          <ArrowButton
            direction="prev"
            label={t('prev')}
            disabled={atStart}
            onClick={() => scrollByCard(-1)}
          />
          <ArrowButton
            direction="next"
            label={t('next')}
            disabled={atEnd}
            onClick={() => scrollByCard(1)}
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Scroll-snap track — peeking cards signal there's more to swipe */}
        <div
          ref={trackRef}
          role="group"
          aria-roledescription="carousel"
          aria-label={t('overline')}
          tabIndex={0}
          className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pt-3 pb-6 focus-visible:outline-none sm:mx-0 sm:gap-5 sm:px-0"
        >
          {testimonials.map((item, i) => (
            <figure
              key={item.name}
              data-card={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${testimonials.length} — ${item.name}`}
              className="group flex w-[86%] shrink-0 snap-center flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-250 ease-out sm:w-[360px] sm:snap-start sm:p-7 sm:hover:-translate-y-1 sm:hover:border-accent/30 sm:hover:shadow-lg md:p-8"
            >
              <Quote className="h-8 w-8 shrink-0 text-accent/25" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-body text-card-foreground">
                {item.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-5">
                {/* Project context — what the engagement was about */}
                <p className="flex items-center gap-2 text-body-sm font-medium text-accent">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {loc(item.project, locale)}
                </p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-heading text-h4 text-card-foreground">{item.name}</p>
                    <p className="text-body-sm text-muted-foreground">{item.role}</p>
                  </div>
                  {/* Verified source — only when the review has a public link */}
                  {item.platform && item.url && (
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
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Dot indicators — mobile position affordance (one card per view maps
            1:1 to a dot); desktop navigates with the header arrows instead. */}
        <div className="mt-5 flex items-center justify-center gap-2 sm:hidden">
          {testimonials.map((item, i) => (
            <button
              key={item.name}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${item.name} — ${loc(item.project, locale)}`}
              aria-current={i === index ? 'true' : undefined}
              className={`h-2 rounded-full transition-all duration-250 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                i === index ? 'w-6 bg-accent' : 'w-2 bg-border hover:bg-muted-foreground/40'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/** Round nav button for the carousel header. */
function ArrowButton({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next';
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === 'prev' ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-all duration-200 ease-out hover:border-accent hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
