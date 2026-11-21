import type { SVGProps } from 'react';

/** Official five-colour Figma mark (viewBox 38×57). Shared by the About bento and the preloader. */
export function FigmaMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 38 57" {...props}>
      <path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
      <path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
      <path fill="#FF7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
      <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
      <path fill="#A259FF" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
    </svg>
  );
}

/** The same five pieces as data — lets the preloader assemble the mark piece by piece. */
export const FIGMA_PIECES = [
  { fill: '#F24E1E', d: 'M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z' },
  { fill: '#FF7262', d: 'M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z' },
  { fill: '#A259FF', d: 'M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z' },
  { fill: '#1ABCFE', d: 'M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z' },
  { fill: '#0ACF83', d: 'M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z' },
] as const;
