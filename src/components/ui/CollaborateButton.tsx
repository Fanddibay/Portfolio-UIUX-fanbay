import { ArrowUpRight } from 'lucide-react';

/**
 * CollaborateButton — the primary "let's work together" CTA (navbar).
 *
 * Mobile: a simple labelled pill (text + arrow icon).
 * Desktop: a compact pill sized to match the language toggle (~32px tall) whose
 * arrow badge slides across and rotates on hover, with the padding swapping
 * sides so the label makes room.
 *
 * Adapted from a shadcn-style snippet to this codebase's token system (no
 * class-variance-authority / radix-slot needed): the pill uses `accent`, the
 * badge uses `background`/`foreground` so it stays legible in light and dark.
 * Motion is CSS transitions, so `prefers-reduced-motion` (globals.css) neutralises
 * it automatically.
 */
export function CollaborateButton({
  href,
  label,
  className = '',
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const focus =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-background';

  return (
    <>
      {/* Mobile: simple labelled pill — text + icon */}
      <a
        href={href}
        className={`inline-flex h-9 items-center gap-1 rounded-full bg-accent px-3 font-body text-xs font-medium text-accent-foreground transition-[filter] duration-200 ease-out hover:brightness-110 sm:hidden ${focus}`}
      >
        <span className="whitespace-nowrap">{label}</span>
        <ArrowUpRight size={14} className="shrink-0" aria-hidden="true" />
      </a>

      {/* Desktop: animated pill with a sliding, rotating arrow badge */}
      <a
        href={href}
        className={`group relative hidden h-10 items-center overflow-hidden rounded-full bg-accent font-body text-body-sm font-medium text-accent-foreground ps-6 pe-12 transition-all duration-500 ease-out hover:ps-12 hover:pe-6 sm:inline-flex ${focus} ${className}`}
      >
        <span className="relative z-10 whitespace-nowrap">{label}</span>
        <span
          aria-hidden="true"
          className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground transition-all duration-500 ease-out group-hover:right-[calc(100%-34px)] group-hover:rotate-45"
        >
          <ArrowUpRight size={15} />
        </span>
      </a>
    </>
  );
}
