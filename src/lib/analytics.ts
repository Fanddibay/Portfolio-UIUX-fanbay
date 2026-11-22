/**
 * Send a GA4 event. No-op when GA isn't loaded (dev, missing ID, blocked by an
 * ad blocker), so callers never need to guard.
 *
 * Events in use:
 *   generate_lead: contact form sent ({ lead_source, topic })
 */
type Gtag = (command: 'event', name: string, params?: Record<string, string | number>) => void;

export function track(name: string, params?: Record<string, string | number>) {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.('event', name, params);
}
