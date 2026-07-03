import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Plus_Jakarta_Sans, Open_Sans } from 'next/font/google';

import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { BackToTop } from '@/components/ui/BackToTop';
import { SITE } from '@/lib/data';
import '../globals.css';

/*
 * Fonts via next/font — self-hosted, no layout shift, no render-blocking.
 * Plus Jakarta Sans → headings + labels (display). Open Sans → body.
 * Each exposes a CSS variable consumed by tailwind.config.ts (fontFamily).
 */
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-open-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.role}`,
  description: 'UI/UX Engineer who designs with intent and builds with AI.',
};

/** Pre-render both locales at build time. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Reject unknown locales before doing any work
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Enable static rendering for this locale
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    // suppressHydrationWarning: next-themes sets the class on <html> client-side
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${openSans.variable}`}
    >
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject
          attributes onto <body> before React hydrates — harmless, so we ignore
          the resulting attribute mismatch here. */}
      <body suppressHydrationWarning>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
            <BackToTop />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
