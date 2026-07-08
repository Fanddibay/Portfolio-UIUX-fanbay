import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Plus_Jakarta_Sans, Open_Sans } from 'next/font/google';

import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { BackToTop } from '@/components/ui/BackToTop';
import { SITE } from '@/lib/data';
import {
  BASE_URL,
  DESCRIPTIONS,
  KEYWORDS,
  TITLE_DEFAULT,
  languageAlternates,
  localePath,
  personJsonLd,
  websiteJsonLd,
  profilePageJsonLd,
  jsonLdString,
} from '@/lib/seo';
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#09090B' },
  ],
};

/**
 * Full per-locale metadata (SEO + social). Canonical points at the locale's
 * own URL; hreflang links the EN/ID pair so Google serves the right language.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const description = locale === 'id' ? DESCRIPTIONS.id : DESCRIPTIONS.en;

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: TITLE_DEFAULT,
      template: `%s · ${SITE.name}`,
    },
    description,
    keywords: KEYWORDS,
    authors: [{ name: 'Fandi Bayu Anggoro Sakti', url: BASE_URL }],
    creator: SITE.name,
    alternates: {
      canonical: localePath(locale),
      languages: languageAlternates(),
    },
    openGraph: {
      type: 'website',
      url: localePath(locale),
      siteName: `${SITE.name} — UI/UX Designer & Engineer`,
      title: TITLE_DEFAULT,
      description,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      alternateLocale: locale === 'id' ? 'en_US' : 'id_ID',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: `${SITE.name} — UI/UX Designer & Engineer` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLE_DEFAULT,
      description,
      images: ['/og.png'],
    },
    robots: { index: true, follow: true },
  };
}

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
        {/* Entity data for Google + AI answer engines (ChatGPT, Perplexity,
            Claude, Gemini) — mirrors the visible content so it can be cited. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(personJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(websiteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(profilePageJsonLd(locale)) }}
        />
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
