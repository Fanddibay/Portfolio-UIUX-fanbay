import { useTranslations } from 'next-intl';
import { Mail, MapPin } from 'lucide-react';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { ResumeModal } from '@/components/ui/ResumeModal';
import { SITE } from '@/lib/data';

/** Closing footer: wordmark, tagline, socials, and copyright. */
export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      {/* Extra bottom padding on mobile clears the floating tab bar */}
      <div className="mx-auto flex max-w-content flex-col gap-8 px-6 pb-28 pt-12 md:flex-row md:items-start md:justify-between md:px-8 md:pb-12">
        <div className="max-w-sm">
          <p className="font-heading text-h4 font-bold text-foreground">
            {SITE.name}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-2 text-body-sm text-muted-foreground">{t('tagline')}</p>

          {/* Direct email + location — a fast path for founders and recruiters */}
          <div className="mt-5 flex flex-col gap-2">
            <a
              href={`mailto:${SITE.email}`}
              className="group inline-flex w-fit items-center gap-2 text-body-sm font-medium text-foreground transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Mail className="h-4 w-4 text-accent transition-transform duration-150 group-hover:-translate-y-0.5" />
              {SITE.email}
            </a>
            <p className="inline-flex items-center gap-2 text-body-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              {t('location')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          {/* CV download — opens a language-choice dialog (ID / EN) */}
          <ResumeModal />
          <SocialLinks />
          <p className="font-mono text-label text-muted-foreground">
            © {year} {SITE.name}. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
