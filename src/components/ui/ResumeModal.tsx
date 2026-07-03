'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { SITE } from '@/lib/data';

/** The two résumé variants — file paths live in SITE.resume (lib/data.ts). */
const OPTIONS = [
  { code: 'ID', href: () => SITE.resume.id, descKey: 'optionId', file: 'CV Fandi Bayu — Bahasa Indonesia.pdf' },
  { code: 'EN', href: () => SITE.resume.en, descKey: 'optionEn', file: 'CV Fandi Bayu — English.pdf' },
] as const;

/**
 * Footer résumé trigger + language-choice dialog.
 * The résumé ships in two languages, so instead of linking one file the
 * trigger opens a small modal asking which version to download. Mirrors the
 * CertificateModal pattern (portal, scroll-lock, focus trap, reduced-motion);
 * motion + tokens follow DESIGN.md §7 (enter ease, faster exit) and §12 (z-scale).
 */
export function ResumeModal() {
  const t = useTranslations('resume');
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => setMounted(true), []);

  // Lock scroll, remember trigger, focus the dialog, restore on close.
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      (triggerRef.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  // Keyboard: Esc closes, Tab stays trapped within the dialog.
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'Tab') {
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href]',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  return (
    <>
      {/* Trigger — same pill treatment the footer link had, now opening the dialog */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="group inline-flex w-fit items-center gap-2 rounded-full border border-border bg-transparent px-4 py-2 font-body text-body-sm font-medium text-foreground transition-all duration-150 ease-out hover:border-accent hover:bg-accent/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Download className="h-4 w-4 text-accent transition-transform duration-150 group-hover:translate-y-0.5" />
        {t('trigger')}
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="resume-modal-title"
                onKeyDown={onKeyDown}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.2 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ overscrollBehavior: 'contain' }}
              >
                {/* Backdrop */}
                <button
                  type="button"
                  aria-label={t('close')}
                  onClick={() => setOpen(false)}
                  className="absolute inset-0 z-40 bg-background/80 backdrop-blur-md"
                />

                {/* Panel */}
                <motion.div
                  initial={reduce ? false : { opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={
                    reduce
                      ? { opacity: 0, transition: { duration: 0 } }
                      : { opacity: 0, scale: 0.98, y: 8, transition: { duration: 0.18, ease: 'easeIn' } }
                  }
                  transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-50 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl"
                >
                  {/* Close */}
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={t('close')}
                    className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <h2
                    id="resume-modal-title"
                    className="pr-10 font-heading text-h4 font-bold text-foreground"
                  >
                    {t('title')}
                  </h2>
                  <p className="mt-1 text-body-sm text-muted-foreground">{t('subtitle')}</p>

                  <div className="mt-5 flex flex-col gap-3">
                    {OPTIONS.map((opt, i) => (
                      <motion.a
                        key={opt.code}
                        href={opt.href()}
                        download={opt.file}
                        onClick={() => setOpen(false)}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: reduce ? 0 : 0.3,
                          ease: [0.16, 1, 0.3, 1],
                          delay: reduce ? 0 : 0.08 + i * 0.05,
                        }}
                        className="group flex min-h-[44px] items-center gap-3 rounded-xl border border-border bg-background p-3.5 transition-all duration-150 ease-out hover:border-accent hover:bg-accent/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                      >
                        {/* Language mark — echoes the navbar EN/ID switcher */}
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-mono text-label font-semibold tracking-widest text-accent">
                          {opt.code}
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="font-body text-body-sm font-semibold text-foreground">
                            {t(`${opt.descKey}Label`)}
                          </span>
                          <span className="font-mono text-label text-muted-foreground">
                            {t(`${opt.descKey}Meta`)}
                          </span>
                        </span>
                        <Download className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-150 ease-out group-hover:translate-y-0.5 group-hover:text-accent" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
