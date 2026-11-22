'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { AlertCircle, ArrowUpRight, Check, Copy, Linkedin, Loader2, Mail, Send } from 'lucide-react';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { UpworkGlyph } from '@/components/ui/BrandIcons';
import { sendContactMessage, isContactConfigured } from '@/lib/contact';
import { track } from '@/lib/analytics';
import { SITE, socials, upwork } from '@/lib/data';

type Status = 'idle' | 'sending' | 'success' | 'error';
type Intent = { key: string; label: string; placeholder: string };
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared field styling (DESIGN.md §8) — invalid state swaps the ring to destructive. */
const field = (invalid: boolean) =>
  `w-full rounded-xl border bg-background px-4 py-3 font-body text-body text-foreground transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 ${
    invalid
      ? 'border-destructive/60 focus-visible:ring-destructive/40'
      : 'border-border hover:border-muted-foreground/40 focus-visible:border-accent focus-visible:ring-ring/30'
  }`;

/**
 * Contact — two panels in one card.
 *
 * Left: who you're talking to and how fast they reply (availability + reply
 * time), then the direct channels a recruiter actually uses — email (one-click
 * copy), LinkedIn, Upwork — and the rest of the socials.
 *
 * Right: a short form that starts with "What brings you here?". Picking an
 * intent (e.g. "Hiring for a role") tunes the message prompt so people know what
 * to write, and tags the message so it's easy to triage. Inline validation,
 * a char counter, a spinner while sending, and an animated success state.
 *
 * Transport: Google Sheets via Apps Script (see lib/contact.ts). The intent is
 * sent as its own field so the sheet can file it in a separate Topic column.
 */
export function Contact() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const tHero = useTranslations('hero');
  const intents = t.raw('intents') as Intent[];

  const [status, setStatus] = useState<Status>('idle');
  const [intent, setIntent] = useState(intents[0].key);
  const [errors, setErrors] = useState<Errors>({});
  const [length, setLength] = useState(0);
  const current = intents.find((i) => i.key === intent) ?? intents[0];

  function validate(data: { name: string; email: string; message: string }): Errors {
    const e: Errors = {};
    if (!data.name.trim()) e.name = t('required');
    if (!data.email.trim()) e.email = t('required');
    else if (!EMAIL_RE.test(data.email.trim())) e.email = t('emailInvalid');
    if (!data.message.trim()) e.message = t('required');
    return e;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const raw = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    };

    // Honeypot: bots fill hidden fields. Pretend success without sending.
    if (String(data.get('_gotcha') ?? '')) {
      form.reset();
      setStatus('success');
      return;
    }

    const found = validate(raw);
    setErrors(found);
    const firstInvalid = (['name', 'email', 'message'] as const).find((k) => found[k]);
    if (firstInvalid) {
      // Focus by id — aria-invalid isn't in the DOM until React re-renders.
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    // Intent, language and page travel as their own fields so the sheet can
    // file them in separate columns (Topic / Language / Page).
    const payload = {
      name: raw.name.trim(),
      email: raw.email.trim(),
      message: raw.message.trim(),
      intent: current.key,
      locale,
      page: window.location.pathname,
    };
    setStatus('sending');

    try {
      if (!isContactConfigured) {
        window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
          `${current.label} · ${payload.name}`,
        )}&body=${encodeURIComponent(raw.message)}`;
        setStatus('idle');
        return;
      }
      await sendContactMessage(payload);
      track('generate_lead', { lead_source: 'contact_form', topic: current.key });
      form.reset();
      setLength(0);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const clearError = (key: keyof Errors) => errors[key] && setErrors((e) => ({ ...e, [key]: undefined }));
  const linkedin = socials.find((s) => s.key === 'linkedin');

  return (
    <section id="contact" className="section">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="overflow-hidden rounded-[28px] border border-border bg-card shadow-sm"
      >
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          {/* ---------------- Left: who + how to reach ---------------- */}
          <div className="relative overflow-hidden border-b border-border bg-muted/40 p-6 sm:p-10 lg:border-b-0 lg:border-r">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/[0.1] blur-3xl"
            />
            <div className="relative">
              <p className="overline mb-3">{t('overline')}</p>
              <h2 className="text-balance font-heading text-h2 text-foreground">{t('title')}</h2>
              <p className="mt-4 text-body text-muted-foreground">{t('body')}</p>

              {/* Availability */}
              {/* Availability — status line + reply-time line (reads cleanly at any width) */}
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] px-4 py-3">
                <span className="relative mt-1.5 flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70 motion-safe:animate-ping" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <p className="leading-snug">
                  <span className="block text-body-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {tHero('available')}
                  </span>
                  <span className="block text-[12.5px] text-muted-foreground">{t('replyTime')}</span>
                </p>
              </div>

              {/* Direct channels */}
              <p className="mt-8 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {t('channels')}
              </p>
              <ul className="mt-3 space-y-2.5">
                <li>
                  <EmailChannel copyLabel={t('copy')} copiedLabel={t('copied')} />
                </li>
                {linkedin && (
                  <li>
                    <ChannelLink
                      href={linkedin.url}
                      icon={<Linkedin className="h-5 w-5" />}
                      tone="#0A66C2"
                      title={t('linkedin')}
                      meta="in/fandibayu"
                    />
                  </li>
                )}
                <li>
                  <ChannelLink
                    href={upwork.url}
                    icon={<UpworkGlyph className="h-5 w-5" />}
                    tone="#14A800"
                    title={t('upwork')}
                    meta={upwork.status}
                  />
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {t('socials')}
                </p>
                <SocialLinks />
              </div>
            </div>
          </div>

          {/* ---------------- Right: form / success ---------------- */}
          <div className="relative p-6 sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {status === 'success' ? (
                <Success
                  key="success"
                  title={t('successTitle')}
                  body={t('successBody')}
                  again={t('sendAnother')}
                  onAgain={() => setStatus('idle')}
                />
              ) : (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex flex-col gap-5"
                >
                  {/* Honeypot — hidden from people, tempting to bots */}
                  <input
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  />

                  {/* Intent */}
                  <fieldset>
                    <legend className="font-body text-body-sm font-semibold text-foreground">{t('intentLabel')}</legend>
                    <div role="radiogroup" className="mt-3 flex flex-wrap gap-2">
                      {intents.map((it) => {
                        const on = it.key === intent;
                        return (
                          <button
                            key={it.key}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => setIntent(it.key)}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] ${
                              on
                                ? 'border-accent bg-accent-solid text-accent-foreground shadow-[0_6px_16px_-8px_rgb(37_99_235/0.7)]'
                                : 'border-border bg-background text-foreground hover:border-accent/40 hover:bg-accent/[0.05]'
                            }`}
                          >
                            <span
                              className={`grid overflow-hidden transition-all duration-200 ${on ? 'w-3.5 opacity-100' : 'w-0 opacity-0'}`}
                              aria-hidden="true"
                            >
                              <Check className="h-3.5 w-3.5" strokeWidth={3} />
                            </span>
                            {it.label}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="contact-name" label={t('nameLabel')} error={errors.name}>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder={t('namePlaceholder')}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'contact-name-error' : undefined}
                        onInput={() => clearError('name')}
                        className={field(!!errors.name)}
                      />
                    </Field>
                    <Field id="contact-email" label={t('emailLabel')} error={errors.email}>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder={t('emailPlaceholder')}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'contact-email-error' : undefined}
                        onInput={() => clearError('email')}
                        className={field(!!errors.email)}
                      />
                    </Field>
                  </div>

                  <Field
                    id="contact-message"
                    label={t('messageLabel')}
                    error={errors.message}
                    aside={
                      <span
                        className={`font-mono text-[11px] tabular-nums ${
                          length > MAX * 0.9 ? 'text-amber-700 dark:text-amber-400' : 'text-muted-foreground'
                        }`}
                      >
                        {length}/{MAX}
                      </span>
                    }
                  >
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      maxLength={MAX}
                      placeholder={current.placeholder}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      onInput={(e) => {
                        setLength(e.currentTarget.value.length);
                        clearError('message');
                      }}
                      className={`resize-y ${field(!!errors.message)}`}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="group/send inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-accent-solid px-6 font-body text-body font-semibold text-accent-foreground shadow-[0_12px_28px_-12px_rgb(37_99_235/0.7)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 disabled:cursor-wait disabled:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        {t('sending')}
                      </>
                    ) : (
                      <>
                        {t('send')}
                        <Send
                          className="h-4 w-4 transition-transform duration-200 group-hover/send:-translate-y-0.5 group-hover/send:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </button>

                  <div aria-live="polite" className="-mt-1 min-h-[1.25rem] text-center text-body-sm">
                    {status === 'error' ? (
                      <span className="inline-flex items-center gap-1.5 text-destructive">
                        <AlertCircle className="h-4 w-4" aria-hidden="true" />
                        {t('error')}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {t('orEmail')}{' '}
                        <a href={`mailto:${SITE.email}`} className="font-medium text-accent hover:underline">
                          {SITE.email}
                        </a>
                      </span>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Field({
  id,
  label,
  error,
  aside,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="font-body text-body-sm font-semibold text-foreground">
          {label}
        </label>
        {aside}
      </div>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 overflow-hidden text-[12.5px] text-destructive"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmailChannel({ copyLabel, copiedLabel }: { copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(SITE.email);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = SITE.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 pr-2 transition-[border-color,box-shadow] duration-200 hover:border-accent/30 hover:shadow-sm">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
        <Mail className="h-5 w-5" />
      </span>
      <a
        href={`mailto:${SITE.email}`}
        className="min-w-0 flex-1 truncate text-body-sm font-semibold text-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {SITE.email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? copiedLabel : `${copyLabel} ${SITE.email}`}
        className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[12px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          copied ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-muted text-foreground hover:bg-accent-solid hover:text-accent-foreground'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? 'done' : 'copy'}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
            className="grid"
          >
            {copied ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <Copy className="h-3.5 w-3.5" />}
          </motion.span>
        </AnimatePresence>
        <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
      </button>
    </div>
  );
}

function ChannelLink({
  href,
  icon,
  tone,
  title,
  meta,
}: {
  href: string;
  icon: ReactNode;
  tone: string;
  title: string;
  meta: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
        style={{ color: tone, backgroundColor: `${tone}1a` }}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body-sm font-semibold text-foreground">{title}</span>
        <span className="block truncate text-[12px] text-muted-foreground">{meta}</span>
      </span>
      <ArrowUpRight className="mr-1.5 h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
    </a>
  );
}

function Success({
  title,
  body,
  again,
  onAgain,
}: {
  title: string;
  body: string;
  again: string;
  onAgain: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, ease: EASE }}
      className="flex min-h-[420px] flex-col items-center justify-center text-center"
      role="status"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
        className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white shadow-[0_12px_32px_-10px_rgb(16_185_129/0.7)]"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={3}>
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, ease: EASE, delay: 0.3 }}
          />
        </svg>
      </motion.span>
      <h3 className="mt-6 font-heading text-h3 text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-body text-muted-foreground">{body}</p>
      <button
        type="button"
        onClick={onAgain}
        className="mt-6 rounded-full border border-border px-4 py-2 text-body-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/40 hover:bg-accent/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {again}
      </button>
    </motion.div>
  );
}
