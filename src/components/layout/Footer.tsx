import { useTranslations } from 'next-intl';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { SITE } from '@/lib/data';

/** Closing footer: wordmark, tagline, socials, and copyright. */
export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      {/* Extra bottom padding on mobile clears the floating tab bar */}
      <div className="mx-auto flex max-w-content flex-col gap-8 px-6 pb-28 pt-12 md:flex-row md:items-center md:justify-between md:px-8 md:pb-12">
        <div className="max-w-sm">
          <p className="font-heading text-h4 font-bold text-foreground">
            {SITE.name}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-2 text-body-sm text-muted-foreground">{t('tagline')}</p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <SocialLinks />
          <p className="font-mono text-label text-muted-foreground">
            © {year} {SITE.name}. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
