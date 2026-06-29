'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

/**
 * EN / ID toggle. Swaps the locale while keeping the user on the same path
 * (next-intl rewrites the URL). Uses a transition so the switch feels instant
 * and doesn't block the UI (DESIGN.md §11).
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: string) {
    if (next === locale) return;
    // Soft client navigation: re-renders with the new locale without a full
    // page reload. scroll:false keeps the user at their current position so the
    // swap feels instant rather than jumping to the top.
    startTransition(() => {
      router.replace(pathname, { locale: next, scroll: false });
    });
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-md border border-border p-0.5 font-mono text-label"
      aria-label="Language"
    >
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchTo(loc)}
            disabled={isPending}
            aria-current={active ? 'true' : undefined}
            className={`rounded-[4px] px-2 py-1 uppercase transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              active
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
