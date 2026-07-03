'use client';

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Button } from './Button';

type Block = { label: string; body: string };

type Props = {
  blocks: Block[];
  protectedTitle: string;
  protectedBody: string;
  requestCta: string;
  mailto: string;
};

export function NDASection({ blocks, protectedTitle, protectedBody, requestCta, mailto }: Props) {
  return (
    <>
      {/* Short blurred peek — fixed height window, clips overflow without breaking sticky */}
      <div className="relative mt-10 h-36 overflow-clip">
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-x-0 top-0 flex flex-col gap-10 opacity-[0.15] blur-sm"
        >
          {blocks.map((block) => (
            <section key={block.label}>
              <h2 className="font-mono text-label uppercase tracking-widest text-accent">
                {block.label}
              </h2>
              <p className="mt-3 text-body-lg leading-relaxed text-foreground">{block.body}</p>
            </section>
          ))}
        </div>
        {/* Gradient from partially visible → fully hidden */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
      </div>

      {/* NDA card — sticky so it stays centered in viewport while scrolling,
          settles naturally before the footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="sticky top-[calc(50vh-120px)] z-10 mt-6 pb-8"
      >
        <div className="rounded-2xl border border-border/60 bg-card/90 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-accent" />
            <h2 className="font-heading text-h4 text-card-foreground">{protectedTitle}</h2>
          </div>
          <p className="mt-3 text-body text-muted-foreground">{protectedBody}</p>
          <Button as="a" href={mailto} variant="primary" className="mt-6">
            {requestCta}
          </Button>
        </div>
      </motion.div>
    </>
  );
}
