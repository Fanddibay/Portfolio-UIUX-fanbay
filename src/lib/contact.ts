/**
 * Contact form transport — Google Apps Script + Google Sheets.
 *
 * The form POSTs to a Google Apps Script Web App that appends a row to a
 * Google Sheet AND emails a notification to Fandi (see the deployment steps
 * below). Set the deployed `/exec` URL in `NEXT_PUBLIC_CONTACT_ENDPOINT`.
 *
 * Apps Script Web Apps don't return CORS headers we can control, so we send a
 * "simple" request (URLSearchParams → application/x-www-form-urlencoded) with
 * `mode: 'no-cors'`. That avoids a CORS preflight the script can't answer. The
 * trade-off: the response is opaque, so we can't read a status — a fetch that
 * doesn't throw is treated as sent. For Fandi, the notification email is the
 * real delivery confirmation.
 *
 * ── Google Apps Script (already deployed in Fandi's account) ──────────────
 * The canonical script lives in the Apps Script project attached to the
 * "Email Feedback Fandi" spreadsheet. It opens the sheet BY ID (so it never
 * writes to the wrong file), appends to the "Messages" tab, styles rows, and
 * emails a notification with replyTo set to the sender.
 *
 * After editing the script code, ALWAYS redeploy:
 *   Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy.
 * The /exec URL stays the same; without a new version the old code keeps
 * running. Run `formatSheet()` once from the editor to (re)apply styling.
 * ──────────────────────────────────────────────────────────────────────────
 */

const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

/** True when the Apps Script endpoint is set — lets the form fall back to mailto if not. */
export const isContactConfigured = Boolean(endpoint);

export type ContactPayload = { name: string; email: string; message: string };

/**
 * Send a contact submission to the Apps Script endpoint.
 * Resolves when the request has been dispatched; rejects only on a network
 * error or a missing endpoint (the opaque `no-cors` response can't be read).
 */
export async function sendContactMessage(payload: ContactPayload): Promise<void> {
  if (!endpoint) throw new Error('Contact endpoint is not configured');

  const body = new URLSearchParams({
    name: payload.name,
    email: payload.email,
    message: payload.message,
  });

  await fetch(endpoint, { method: 'POST', mode: 'no-cors', body });
}
