'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Award, X } from 'lucide-react';

type Props = {
  /** Certificate image path (in /public). */
  src: string;
  /** Accessible label / alt, e.g. "PrimeSkills — Certificate of Internship". */
  title: string;
  /** CTA label (i18n), e.g. "View certificate". */
  label: string;
};

/**
 * A small trigger button + lightbox modal for a single certificate image.
 * Mirrors the ProjectGallery lightbox pattern (portal, scroll-lock, focus
 * management, reduced-motion) but scoped to one image — kept separate so the
 * gallery component stays untouched. Motion + tokens follow DESIGN.md.
 */
export function CertificateModal({ src, title, label }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => setMounted(true), []);

  // Lock scroll, remember trigger, focus close button, restore on close.
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
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])');
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
      {/* Trigger — subtle text button so it doesn't compete with primary CTAs */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md font-body text-body-sm font-medium text-accent transition-colors duration-150 hover:text-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Award className="h-4 w-4" />
        {label}
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onKeyDown={onKeyDown}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.2 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
                style={{ overscrollBehavior: 'contain' }}
              >
                {/* Backdrop */}
                <button
                  type="button"
                  aria-label="Close certificate viewer"
                  onClick={() => setOpen(false)}
                  className="absolute inset-0 cursor-zoom-out bg-background/80 backdrop-blur-md"
                />

                {/* Close */}
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Certificate image — intrinsic sized, capped to viewport */}
                <motion.img
                  src={src}
                  alt={title}
                  initial={reduce ? false : { opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-[5] max-h-[85vh] w-auto max-w-full rounded-xl border border-border bg-card shadow-2xl"
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
