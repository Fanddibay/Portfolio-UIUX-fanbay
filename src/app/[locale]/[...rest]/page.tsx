import { notFound } from 'next/navigation';

/**
 * Catch-all for unknown paths inside a locale (e.g. /en/anything). Without it,
 * unmatched URLs never reach [locale]/not-found.tsx and Next.js falls back to
 * its unstyled default 404. Calling notFound() here renders the branded page
 * inside the locale layout (fonts, theme, translations).
 *
 * Edge runtime: Cloudflare Pages (next-on-pages) needs every route that isn't
 * pre-rendered to run on the edge, and a catch-all can't be pre-rendered.
 */
export const runtime = 'edge';

export default function CatchAll() {
  notFound();
}
