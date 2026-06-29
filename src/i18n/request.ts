import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

/**
 * Resolves the message bundle for the active request.
 * Falls back to the default locale if an unknown locale is requested.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
