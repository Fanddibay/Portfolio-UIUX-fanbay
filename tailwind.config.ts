import type { Config } from 'tailwindcss';

/**
 * Tailwind config — single source of truth mirrors DESIGN.md.
 * Colors map to CSS variables (defined in globals.css) so light/dark
 * mode swap happens by toggling the `.dark` class on <html>.
 */
const config: Config = {
  // Dark mode driven by a class on <html> (managed by next-themes)
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      // --- Color tokens (see DESIGN.md §2) ---
      // Tokens are RGB channels in globals.css, wrapped here so opacity
      // modifiers (e.g. bg-background/90, border-accent/40) resolve correctly.
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        destructive: 'rgb(var(--destructive) / <alpha-value>)',
      },

      // --- Typography (see DESIGN.md §3) ---
      fontFamily: {
        // Plus Jakarta Sans → headings & display
        heading: ['var(--font-plus-jakarta)', 'sans-serif'],
        // Open Sans → body / UI text
        body: ['var(--font-open-sans)', 'sans-serif'],
        // "mono" role kept for labels/overlines/timestamps (uppercase + tracking
        // carry the distinction now that there's no true monospace face).
        mono: ['var(--font-plus-jakarta)', 'sans-serif'],
      },
      fontSize: {
        // [size, lineHeight]
        display: ['4.5rem', { lineHeight: '1', fontWeight: '800' }],
        h1: ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        h2: ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        h3: ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }],
        h4: ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        body: ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        label: ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },

      // --- Radius (see DESIGN.md §5) ---
      borderRadius: {
        md: '6px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },

      // --- Shadows (see DESIGN.md §6) ---
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
      },

      // --- Max content width (see DESIGN.md §4) ---
      maxWidth: {
        content: '72rem', // 1152px
      },

      // --- Animation timing (see DESIGN.md §7) — 250ms isn't a Tailwind default ---
      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
};

export default config;
