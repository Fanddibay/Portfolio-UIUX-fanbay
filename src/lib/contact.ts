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

/** The site API confirms delivery through Google Apps Script before resolving. */
export async function sendContactMessage(payload: ContactPayload): Promise<void> {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error('Contact message could not be sent');
}
