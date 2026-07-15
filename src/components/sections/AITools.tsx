'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/lib/motion';
import { SectionHeader } from '@/components/ui/SectionHeader';

type Tool = {
  logo: string;
  title: string;
  body: string;
  /** Optional external proof link (e.g. a shipped product / post). */
  link?: { url: string; label: string };
};

/**
 * AI Tools — differentiator section. Each card uses the tool's real brand mark
 * (in /public/brands) and explains what it's used for.
 *
 * Layout:
 * - Desktop: a 3-column grid.
 * - Mobile: an auto-scrolling marquee that pauses on hover or tap — so it feels
 *   alive but stays readable on demand (WCAG: pausable auto-motion).
 *
 * NOTE: brand SVGs in /public/brands are best-effort marks — drop the official
 * SVGs there (same filenames) for pixel-perfect brand accuracy.
 */
export function AITools() {
  const t = useTranslations('aiTools');
  const [paused, setPaused] = useState(false);

  const tools: Tool[] = [
    { logo: '/brands/claude.svg', title: t('claudeCodeTitle'), body: t('claudeCodeBody') },
    { logo: '/brands/stitch.svg', title: t('claudeDesignTitle'), body: t('claudeDesignBody') },
    {
      logo: '/brands/google-ai-studio.svg',
      title: t('aiStudioTitle'),
      body: t('aiStudioBody'),
      link: {
        url: 'https://www.linkedin.com/posts/fandibayu_juaravibecoding-juaravibecoding-fanlearn-ugcPost-7464792660126625792-LLpP/',
        label: t('aiStudioLinkLabel'),
      },
    },
  ];

  return (
    <section className="section">
      <SectionHeader overline={t('overline')} title={t('title')} lead={t('body')} split />

      {/* Desktop: grid. The responsive toggle lives on this wrapper so the
          motion element itself is never display:none — otherwise framer's
          whileInView observer can fail to fire. */}
      <div className="hidden md:block">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-4 md:grid-cols-3"
        >
          {tools.map((tool) => (
            <motion.div key={tool.title} variants={fadeIn} className="h-full">
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mobile: marquee (tap or hover to pause) */}
      <div
        className="marquee -mx-6 md:hidden"
        data-paused={paused}
        onClick={() => setPaused((p) => !p)}
        role="group"
        aria-label={t('overline')}
      >
        <div className="marquee-track py-1">
          {/* Two identical sets → seamless loop. Second set hidden from SR. */}
          {[0, 1].map((set) => (
            <div key={set} className="flex" aria-hidden={set === 1}>
              {tools.map((tool) => (
                <ToolCard key={`${set}-${tool.title}`} tool={tool} className="mr-4 w-[17rem] shrink-0" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Single AI tool card — shared by the desktop grid and the mobile marquee. */
function ToolCard({ tool, className = '' }: { tool: Tool; className?: string }) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-250 ease-out hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tool.logo} alt="" aria-hidden="true" width={28} height={28} className="h-7 w-7" />
      </div>
      <h3 className="mt-4 font-heading text-h3 text-card-foreground">{tool.title}</h3>
      <p className="mt-2 text-body-sm text-muted-foreground">{tool.body}</p>
      {tool.link && (
        <a
          href={tool.link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="group/link mt-4 inline-flex items-center gap-1 font-body text-body-sm font-medium text-accent transition-colors duration-150 hover:text-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {tool.link.label}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </a>
      )}
    </div>
  );
}
