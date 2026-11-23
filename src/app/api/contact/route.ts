import { getOptionalRequestContext } from '@cloudflare/next-on-pages';
import type { ContactPayload } from '@/lib/contact';

export const runtime = 'edge';

const APPS_SCRIPT_URL = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  const env = getOptionalRequestContext()?.env as
    | { CONTACT_ENDPOINT?: string; NEXT_PUBLIC_CONTACT_ENDPOINT?: string }
    | undefined;
  const endpoint = (
    env?.CONTACT_ENDPOINT ||
    process.env.CONTACT_ENDPOINT ||
    env?.NEXT_PUBLIC_CONTACT_ENDPOINT ||
    process.env.NEXT_PUBLIC_CONTACT_ENDPOINT
  )?.trim();

  if (!endpoint || !APPS_SCRIPT_URL.test(endpoint)) {
    return new Response(null, { status: 503 });
  }

  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    return new Response(null, { status: 415 });
  }

  const data: Partial<ContactPayload> | null = await request.json().catch(() => null);
  const name = typeof data?.name === 'string' ? data.name.trim() : '';
  const email = typeof data?.email === 'string' ? data.email.trim() : '';
  const message = typeof data?.message === 'string' ? data.message.trim() : '';
  if (!name || name.length > 120 || !EMAIL.test(email) || email.length > 200 ||
      !message || message.length > 1000) {
    return new Response(null, { status: 400 });
  }

  const body = new URLSearchParams({ name, email, message });
  for (const field of ['intent', 'locale', 'page'] as const) {
    const value = data?.[field];
    if (typeof value === 'string') body.set(field, value.slice(0, 200));
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(15000),
    });
    // Apps Script can return HTTP 200 for a Google sign-in page or script error.
    const result = response.ok ? (await response.text()).trim() : '';
    if (result === 'ok') return new Response(null, { status: 204 });
    if (result === 'rate_limited') return new Response(null, { status: 429 });
  } catch {
    return new Response(null, { status: 502 });
  }

  return new Response(null, { status: 502 });
}
