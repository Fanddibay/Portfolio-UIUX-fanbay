/**
 * Contact form transport — Google Apps Script → Google Sheets (sheet only).
 *
 * The form POSTs to a Google Apps Script Web App that inserts the message as a
 * new row in the "Contact Fandi" spreadsheet (Inbox tab, newest first). No
 * email is sent. The deployed `/exec` URL lives in `NEXT_PUBLIC_CONTACT_ENDPOINT`.
 *
 * Apps Script Web Apps don't return CORS headers we can control, so we send a
 * "simple" request (URLSearchParams → application/x-www-form-urlencoded) with
 * `mode: 'no-cors'`. That avoids a CORS preflight the script can't answer. The
 * trade-off: the response is opaque, so a fetch that doesn't throw is treated
 * as sent. The new row in the sheet is the delivery confirmation.
 *
 * Script source + setup steps: scripts/contact-apps-script.gs. After editing
 * the script, ALWAYS redeploy (Deploy → Manage deployments → ✏️ Edit →
 * Version: New version → Deploy); the /exec URL stays the same.
 */

const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

/** True when the Apps Script endpoint is set — lets the form fall back to mailto if not. */
export const isContactConfigured = Boolean(endpoint);

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  /** Intent key from the form chips: hiring | project | system | hello. */
  intent: string;
  /** Site language the visitor used (en | id). */
  locale: string;
  /** Path the form was sent from, e.g. "/" or "/id". */
  page: string;
};

/**
 * Send a contact submission to the Apps Script endpoint.
 * Resolves when the request has been dispatched; rejects only on a network
 * error or a missing endpoint (the opaque `no-cors` response can't be read).
 */
export async function sendContactMessage(payload: ContactPayload): Promise<void> {
  if (!endpoint) throw new Error('Contact endpoint is not configured');

  const body = new URLSearchParams(payload);
  await fetch(endpoint, { method: 'POST', mode: 'no-cors', body });
}
