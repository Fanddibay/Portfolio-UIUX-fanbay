'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

/**
 * Light/dark toggle (DESIGN.md §10).
 *
 * Variants:
 * - `ghost` (default): subtle icon button — used in the desktop navbar.
 * - `solid`: high-contrast filled button. bg-foreground/text-background means
 *   it auto-inverts per theme (dark button in light mode, light button in dark
 *   mode) — used beside the mobile bottom tab bar.
 *
 * The icon swaps with a rotate + slide cross-fade. The `mounted` guard keeps
 * server/client markup identical to avoid a hydration mismatch.
 */
export function ThemeToggle({ variant = 'ghost' }: { variant?: 'ghost' | 'solid' }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  const base =
    'relative flex items-center justify-center overflow-hidden rounded-full ' +
    'transition-colors duration-200 ease-out focus-visible:outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

  const variants = {
    ghost: 'h-10 w-10 text-foreground hover:bg-muted',
    solid: 'h-12 w-12 bg-foreground text-background shadow-lg hover:opacity-90',
  } as const;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={!mounted ? 'Toggle theme' : isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`${base} ${variants[variant]}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted && (
          <motion.span
            key={isDark ? 'sun' : 'moon'}
            initial={{ y: -18, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 18, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
