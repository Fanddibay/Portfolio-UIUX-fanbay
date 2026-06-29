import { defineRouting } from 'next-intl/routing';

/**
 * i18n routing config (see DESIGN.md §11).
 * - `en` is the default locale, shown without a prefix (/about).
 * - `id` is prefixed (/id/about).
 */
export const routing = defineRouting({
  locales: ['en', 'id'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});
