import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Fandi Bayu — UI/UX Designer & Engineer',
    short_name: 'Fandi Bayu',
    description:
      'Portfolio of Fandi Bayu — UI/UX Designer & Engineer specializing in SaaS dashboards, web apps, and design systems.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAFA',
    theme_color: '#09090B',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
