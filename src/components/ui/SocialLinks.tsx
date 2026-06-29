import { Dribbble, Github, Linkedin } from 'lucide-react';
import type { ComponentType } from 'react';
import { socials, type SocialKey } from '@/lib/data';

/**
 * Behance has no Lucide icon, so we inline it to keep the icon family
 * visually consistent (24px, currentColor) with the Lucide set.
 */
function Behance({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.211 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
    </svg>
  );
}

const ICONS: Record<SocialKey, ComponentType<{ className?: string }>> = {
  behance: Behance,
  dribbble: Dribbble,
  github: Github,
  linkedin: Linkedin,
};

/**
 * Social profile links (see DESIGN.md §9).
 * - `variant="icon"` (default): compact square icon buttons — footer/contact.
 * - `variant="pill"`: rounded icon + label pills — used in the hero.
 */
export function SocialLinks({
  className = '',
  variant = 'icon',
}: {
  className?: string;
  variant?: 'icon' | 'pill';
}) {
  const isPill = variant === 'pill';

  return (
    <ul className={`flex ${isPill ? 'flex-col items-stretch gap-2' : 'items-center gap-2'} ${className}`}>
      {socials.map(({ key, label, url }) => {
        const Icon = ICONS[key];
        return (
          <li key={key}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={
                isPill
                  ? 'flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2.5 font-body text-body-sm text-foreground transition-colors duration-150 ease-out hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                  : 'flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors duration-150 ease-out hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {isPill && <span>{label}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
