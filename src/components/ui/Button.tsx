import type { ComponentProps, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

/** Variant → Tailwind classes (see DESIGN.md §8). */
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-foreground hover:brightness-110',
  secondary: 'border border-border bg-transparent text-foreground hover:bg-muted',
  ghost: 'bg-transparent text-foreground hover:bg-muted',
};

/** Shared base: 44px min touch target, focus ring, smooth hover (150ms). */
const BASE =
  'inline-flex items-center justify-center gap-2 rounded-md px-6 py-2.5 ' +
  'font-body text-body-sm font-medium min-h-[44px] cursor-pointer ' +
  'transition-all duration-150 ease-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed';

type ButtonAsButton = { as?: 'button'; variant?: Variant; children: ReactNode } & ComponentProps<'button'>;
type ButtonAsLink = { as: 'a'; variant?: Variant; children: ReactNode } & ComponentProps<'a'>;
type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Polymorphic button: renders a <button> by default, or an <a> when `as="a"`.
 * Use the anchor form for in-page nav (#work) and external links.
 */
export function Button(props: ButtonProps) {
  const { variant = 'primary', className = '', children, as, ...rest } = props;
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;

  if (as === 'a') {
    return (
      <a className={classes} {...(rest as ComponentProps<'a'>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ComponentProps<'button'>)}>
      {children}
    </button>
  );
}
