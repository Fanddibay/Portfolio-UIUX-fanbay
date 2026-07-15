'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { BadgeCheck, ArrowUpRight } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { CertificateModal } from '@/components/ui/CertificateModal';
import { experience, loc, type ExperienceRole } from '@/lib/data';

/**
 * Experience — a vertical work timeline (company → roles, LinkedIn-style).
 * A standout role (e.g. Upwork) gets an elevated treatment inline: a Top Rated
 * badge, elegant value+label metrics, and a CTA to collaborate — no separate
 * banner. Tokens, type scale, and motion follow DESIGN.md.
 */
export function Experience() {
  const t = useTranslations('experience');
  const locale = useLocale();

  return (
    <section id="experience" className="section">
      <SectionHeader overline={t('overline')} title={t('title')} lead={t('lead')} split />

      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="relative ml-2 border-l border-border"
      >
        {experience.map((entry) => {
          const isCurrent = entry.roles.some((r) => r.current);
          const multiRole = entry.roles.length > 1;
          return (
            <motion.li key={entry.company} variants={fadeUp} className="relative pb-12 pl-8 last:pb-0">
              {/* Node on the line (live dot if any role is ongoing) */}
              <span className="absolute -left-[6px] top-1.5 flex h-3 w-3 items-center justify-center">
                {isCurrent && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                )}
                <span className="relative h-3 w-3 rounded-full bg-accent ring-4 ring-background" />
              </span>

              {/* Two columns: company/meta rail (left) · roles + detail (right) */}
              <div className="grid gap-y-3 md:grid-cols-[minmax(0,190px)_1fr] md:gap-x-10">
                {/* Left meta rail */}
                <div className="md:pt-0.5">
                  <h3 className="font-heading text-h4 text-foreground">{entry.company}</h3>
                  <p className="mt-0.5 font-body text-body-sm text-muted-foreground">
                    {entry.location}
                  </p>
                  {/* Single-role entries show the period here; multi-role show it per role */}
                  {!multiRole && (
                    <p className="mt-1 font-mono text-label uppercase tracking-widest text-accent">
                      {loc(entry.roles[0].period, locale)}
                    </p>
                  )}
                </div>

                {/* Right detail column */}
                <div className={multiRole ? 'flex flex-col gap-6' : ''}>
                  {entry.roles.map((role) => (
                    <RoleBlock
                      key={role.title}
                      role={role}
                      company={entry.company}
                      ctaLabel={t('collaborateCta')}
                      certLabel={t('viewCertificate')}
                      showPeriod={multiRole}
                    />
                  ))}
                </div>
              </div>
            </motion.li>
          );
        })}
      </motion.ol>
    </section>
  );
}

/** A single role. `featured` roles get an elevated card with metrics + CTA. */
function RoleBlock({
  role,
  company,
  ctaLabel,
  certLabel,
  showPeriod = false,
}: {
  role: ExperienceRole;
  company: string;
  ctaLabel: string;
  certLabel: string;
  /** Multi-role entries render the period here; single-role show it in the meta rail. */
  showPeriod?: boolean;
}) {
  const locale = useLocale();
  const body = (
    <>
      {(showPeriod || role.badge) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {showPeriod && (
            <p className="font-mono text-label uppercase tracking-widest text-accent">
              {loc(role.period, locale)}
            </p>
          )}
          {role.badge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-accent">
              <BadgeCheck className="h-3.5 w-3.5" />
              <span className="font-mono text-label uppercase tracking-wide">{role.badge}</span>
            </span>
          )}
        </div>
      )}

      <p
        className={`font-body text-body font-semibold text-foreground ${
          showPeriod || role.badge ? 'mt-1' : ''
        }`}
      >
        {role.title}
        {role.type && (
          <span className="font-normal text-muted-foreground"> · {loc(role.type, locale)}</span>
        )}
      </p>
      <p className="mt-1.5 max-w-3xl text-body-sm text-muted-foreground">
        {loc(role.description, locale)}
      </p>

      {/* Elegant value + label metrics (featured) */}
      {role.metrics && (
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
          {role.metrics.map((m) => {
            const label = loc(m.label, locale);
            return (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="font-heading text-h4 font-bold tabular-nums text-foreground">
                    {m.value}
                  </span>{' '}
                  <span className="text-body-sm text-muted-foreground">{label}</span>
                </dd>
              </div>
            );
          })}
        </dl>
      )}

      {/* Plain metric chips (Fiverr-style) */}
      {role.stats && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {role.stats.map((stat) => {
            const text = loc(stat, locale);
            return (
              <li
                key={text}
                className="rounded-md bg-muted px-2.5 py-1 font-mono text-label text-foreground"
              >
                {text}
              </li>
            );
          })}
        </ul>
      )}

      {role.ctaUrl && (
        <Button
          as="a"
          href={role.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          className="mt-5"
        >
          {ctaLabel}
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      )}

      {role.certificateUrl && (
        <CertificateModal
          src={role.certificateUrl}
          title={`${company} — ${role.title} Certificate`}
          label={certLabel}
        />
      )}
    </>
  );

  // Featured roles sit in an accent-tinted card to stand out within the timeline
  return role.featured ? (
    <div className="rounded-2xl border border-accent/30 bg-accent/[0.04] p-5 md:p-6">{body}</div>
  ) : (
    <div>{body}</div>
  );
}
