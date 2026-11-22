'use client';

import { useEffect, useState } from 'react';
import { PRELOADER_EXIT_EVENT } from '@/lib/preloader';

/**
 * True once the page is visible and the hero may play its entrance.
 *
 * - No preloader this visit (already seen / reduced motion) → ready right away.
 * - Preloader playing → ready `delayMs` after its curtain starts lifting, so the
 *   hero animates in as it's revealed rather than invisibly beneath the curtain.
 * - A fail-safe guarantees the hero never stays hidden.
 */
export function useIntroReady(delayMs = 250) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const goAfter = (ms: number) => {
      timer = setTimeout(() => setReady(true), ms);
    };

    const preloaderPlaying =
      html.dataset.preloader !== 'off' &&
      html.dataset.intro !== 'ready' &&
      document.querySelector('.preloader') !== null;

    if (!preloaderPlaying) {
      goAfter(0);
      return () => clearTimeout(timer);
    }

    const onExit = () => goAfter(delayMs);
    window.addEventListener(PRELOADER_EXIT_EVENT, onExit, { once: true });
    const failsafe = setTimeout(() => setReady(true), 6000);

    return () => {
      window.removeEventListener(PRELOADER_EXIT_EVENT, onExit);
      clearTimeout(timer);
      clearTimeout(failsafe);
    };
  }, [delayMs]);

  return ready;
}
