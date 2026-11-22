import Script from 'next/script';

/**
 * Google Analytics 4 (gtag.js).
 *
 * - Loads only in production builds and only when NEXT_PUBLIC_GA_ID is set
 *   (format G-XXXXXXXXXX), so local dev traffic never pollutes the reports.
 * - `afterInteractive`: the ~90 KB tag downloads after hydration, so it can't
 *   delay first paint or the hero.
 * - GA4's Enhanced Measurement (on by default in the GA property) already
 *   records page views incl. client-side navigation, scrolls, outbound clicks
 *   and the résumé PDF downloads. Custom events go through lib/analytics.ts.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const VALID = !!GA_ID && /^G-[A-Z0-9]+$/.test(GA_ID);

export function Analytics() {
  if (!VALID || process.env.NODE_ENV !== 'production') return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
