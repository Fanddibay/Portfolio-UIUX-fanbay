'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Home, LayoutGrid, User, Mail, type LucideIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

/**
 * Mobile bottom tab bar (app-style). Floats above content, mobile-only.
 * Four primary destinations with icon + label, an active state driven by a
 * scroll spy so the current section is highlighted like a native app.
 *
 * Home only — sections live on the landing page (ui-ux-pro-max: bottom-nav
 * max 5 items, icon + label, 44px touch targets).
 */
const TABS: { id: string; key: 'home' | 'work' | 'about' | 'contact'; icon: LucideIcon }[] = [
  { id: 'top', key: 'home', icon: Home },
  { id: 'work', key: 'work', icon: LayoutGrid },
  { id: 'about', key: 'about', icon: User },
  { id: 'contact', key: 'contact', icon: Mail },
];

export function MobileTabBar() {
  const t = useTranslations('nav');
  const [active, setActive] = useState('top');

  // Scroll spy: highlight whichever section is closest to the top of the viewport
  useEffect(() => {
    const sections = TABS.map((tab) => document.getElementById(tab.id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    // Floating group: nav pill + theme toggle, centered, mobile-only
    <div className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-fit items-center gap-2 md:hidden">
      <nav
        aria-label="Primary"
        className="flex items-center gap-1 rounded-full border border-border bg-card/90 p-1.5 shadow-lg backdrop-blur-md"
      >
        {TABS.map(({ id, key, icon: Icon }) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-w-[60px] flex-col items-center gap-0.5 rounded-full px-3 py-2 transition-colors duration-150 ease-out ${
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-body text-[0.625rem] font-medium leading-none">{t(key)}</span>
            </a>
          );
        })}
      </nav>

      {/* Inverted theme toggle, beside the bar */}
      <ThemeToggle variant="solid" />
    </div>
  );
}
