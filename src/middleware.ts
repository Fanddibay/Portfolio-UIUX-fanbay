import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Detects the locale and rewrites/redirects requests accordingly.
export default createMiddleware(routing);

export const config = {
  // Run on every path except API, Next internals, and static files.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
