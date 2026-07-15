import createNextIntlPlugin from 'next-intl/plugin';

// Point the plugin at our i18n request config (locale → messages resolver)
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudflare Pages has no Next.js image optimizer; without this,
    // <Image /> emits /_next/image URLs that 404 in production.
    // Assets are pre-optimized to WebP via `npm run images`.
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
