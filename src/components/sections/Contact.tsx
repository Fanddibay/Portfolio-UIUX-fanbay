'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Mail, Send } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SITE } from '@/lib/data';

type Status = 'idle' | 'sending' | 'success' | 'error';

/**
 * Contact — form (Supabase) + direct email + social links.
 * The form degrades gracefully: if Supabase env vars are missing, it falls
 * back to a mailto link instead of failing silently.
 */
export function Contact() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    };

    try {
      if (!isSupabaseConfigured || !supabase) {
        // No backend configured yet — open the user's mail client instead.
        window.location.href = `mailto:${SITE.email}?subject=Portfolio enquiry from ${payload.name}&body=${encodeURIComponent(payload.message)}`;
        setStatus('idle');
        return;
      }

      const { error } = await supabase.from('messages').insert(payload);
      if (error) throw error;

      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="section">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid gap-12 md:grid-cols-2 md:gap-16"
      >
        {/* --- Left: pitch + direct channels --- */}
        <div>
          <motion.p variants={fadeUp} className="overline mb-3">
            {t('overline')}
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-heading text-h2 text-foreground">
            {t('title')}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-body-lg text-muted-foreground">
            {t('body')}
          </motion.p>

          <motion.a
            variants={fadeUp}
            href={`mailto:${SITE.email}`}
            className="mt-8 inline-flex items-center gap-2 font-body text-body text-foreground hover:text-accent"
          >
            <Mail className="h-5 w-5" />
            {SITE.email}
          </motion.a>

          <motion.div variants={fadeUp} className="mt-8">
            <p className="font-mono text-label uppercase tracking-widest text-muted-foreground">
              {t('socials')}
            </p>
            <SocialLinks className="mt-3" />
          </motion.div>
        </div>

        {/* --- Right: form --- */}
        <motion.form variants={fadeUp} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="font-body text-body-sm font-medium text-foreground">
              {t('nameLabel')}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder={t('namePlaceholder')}
              className="rounded-xl border border-border bg-card px-4 py-3 font-body text-body text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-body text-body-sm font-medium text-foreground">
              {t('emailLabel')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={t('emailPlaceholder')}
              className="rounded-xl border border-border bg-card px-4 py-3 font-body text-body text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="font-body text-body-sm font-medium text-foreground">
              {t('messageLabel')}
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder={t('messagePlaceholder')}
              className="resize-y rounded-xl border border-border bg-card px-4 py-3 font-body text-body text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <Button type="submit" disabled={status === 'sending'} className="mt-2 w-full">
            {status === 'sending' ? t('sending') : t('send')}
            <Send className="h-4 w-4" />
          </Button>

          {/* Status feedback — announced to screen readers via aria-live */}
          <p
            aria-live="polite"
            className={`min-h-[1.25rem] text-body-sm ${
              status === 'error' ? 'text-destructive' : 'text-accent'
            }`}
          >
            {status === 'success' && t('success')}
            {status === 'error' && t('error')}
          </p>
        </motion.form>
      </motion.div>
    </section>
  );
}
