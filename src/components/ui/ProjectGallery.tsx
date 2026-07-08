'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

type Props = {
  images: string[];
  title: string;
  /** NDA work — shows the "NDA · Edited" badge on the cover. */
  isProtected?: boolean;
  /** Live public product — shows a pulsing green "Live Public" badge. */
  live?: boolean;
};

/**
 * Detail-page hero visual.
 * - Single image: click to open the lightbox.
 * - Multiple images: paginated cover (prev/next + counter), each openable in the
 *   lightbox, which itself paginates through the full set.
 * The lightbox is a focus-trapped, keyboard-navigable modal with a backdrop.
 */
export function ProjectGallery({ images, title, isProtected, live }: Props) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const multiple = images.length > 1;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + images.length) % images.length),
    [images.length],
  );

  return (
    <>
      {/* Cover */}
      <div className="group relative mt-10 aspect-video overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted to-card">
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${title} — screen ${index + 1} of ${images.length}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 900px"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />

        {/* Click target to enlarge (sits above image, below controls) */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Enlarge image — ${title}`}
          className="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />

        {/* Enlarge hint — appears on hover, non-interactive */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1 font-mono text-label uppercase tracking-widest text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity duration-250 group-hover:opacity-100"
        >
          <Expand className="h-3 w-3" />
          Expand
        </span>

        {/* Status badges (top-right) */}
        {live && <LiveBadge className="absolute right-4 top-4 z-20" />}
        {isProtected && (
          <span className="absolute right-4 top-4 z-20 rounded-full border border-border bg-background/80 px-3 py-1 font-mono text-label uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
            NDA · Edited
          </span>
        )}

        {/* Pagination (multi-image only) */}
        {multiple && (
          <>
            <GalleryArrow dir="prev" onClick={() => go(-1)} />
            <GalleryArrow dir="next" onClick={() => go(1)} />
            <span className="absolute bottom-3 right-3 z-20 rounded-full bg-background/80 px-2.5 py-1 font-mono text-label tabular-nums text-muted-foreground backdrop-blur-sm">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Dot indicators below the cover — quick jump + "how many" */}
      {multiple && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to screen ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              className={`h-2 rounded-full transition-all duration-250 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                i === index ? 'w-6 bg-accent' : 'w-2 bg-border hover:bg-muted-foreground/40'
              }`}
            />
          ))}
        </div>
      )}

      <Lightbox
        images={images}
        title={title}
        index={index}
        setIndex={setIndex}
        go={go}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Live badge — pulsing green dot (mirrors the "available" indicator)   */
/* ------------------------------------------------------------------ */

export function LiveBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-background/85 px-3 py-1 backdrop-blur-sm ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="font-mono text-label uppercase tracking-widest text-foreground">Live Public</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Cover pagination arrow                                              */
/* ------------------------------------------------------------------ */

function GalleryArrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Previous screen' : 'Next screen'}
      className={`absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all duration-250 hover:bg-background focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100 ${
        dir === 'prev' ? 'left-3' : 'right-3'
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Lightbox modal                                                     */
/* ------------------------------------------------------------------ */

function Lightbox({
  images,
  title,
  index,
  setIndex,
  go,
  open,
  onClose,
}: {
  images: string[];
  title: string;
  index: number;
  setIndex: (i: number) => void;
  go: (dir: number) => void;
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const multiple = images.length > 1;

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

  // Keyboard: Esc closes, arrows navigate, Tab is trapped within the dialog.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (multiple && e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      } else if (multiple && e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled])',
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
    },
    [go, multiple, onClose],
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — image viewer`}
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
            aria-label="Close image viewer"
            onClick={onClose}
            className="absolute inset-0 cursor-zoom-out bg-background/80 backdrop-blur-md"
          />

          {/* Close */}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Image stage */}
          <motion.div
            key={images[index]}
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-[5] flex max-h-full w-full max-w-6xl flex-col items-center"
          >
            <div className="relative flex w-full items-center justify-center">
              {multiple && (
                <LightboxArrow dir="prev" onClick={() => go(-1)} />
              )}

              {/* Intrinsic-sized image, capped to viewport. Plain <img> on
                  purpose: dimensions are unknown at build time and Cloudflare
                  Pages has no runtime optimizer (assets are pre-optimized WebP). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[index]}
                alt={`${title} — screen ${index + 1} of ${images.length}`}
                className="max-h-[82vh] w-auto max-w-full rounded-xl border border-border bg-card shadow-2xl"
              />

              {multiple && <LightboxArrow dir="next" onClick={() => go(1)} />}
            </div>

            {multiple && (
              <div className="mt-4 flex items-center gap-3">
                <span
                  aria-live="polite"
                  className="rounded-full bg-card px-3 py-1 font-mono text-label tabular-nums text-muted-foreground shadow-sm"
                >
                  {index + 1} / {images.length}
                </span>
                <div className="flex items-center gap-1.5">
                  {images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Go to screen ${i + 1}`}
                      aria-current={i === index ? 'true' : undefined}
                      className={`h-2 rounded-full transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        i === index ? 'w-6 bg-accent' : 'w-2 bg-border hover:bg-muted-foreground/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function LightboxArrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Previous image' : 'Next image'}
      className={`absolute z-10 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        dir === 'prev' ? 'left-2 md:-left-5' : 'right-2 md:-right-5'
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
