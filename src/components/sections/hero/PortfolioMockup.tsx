'use client';

import { useRef, useState, type ComponentType, type CSSProperties } from 'react';
import Image from 'next/image';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronsLeft,
  Dribbble,
  FolderKanban,
  Github,
  LayoutDashboard,
  Linkedin,
  Mail,
  Plus,
  RefreshCw,
  Search,
  UserRound,
  Workflow,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Behance } from '@/components/ui/SocialLinks';
import { BrandMark } from '@/components/ui/BrandLogo';
import { FiverrGlyph, UpworkGlyph } from '@/components/ui/BrandIcons';
import { SITE, fiverr, loc, projects, socials, upwork } from '@/lib/data';

const EASE = [0.16, 1, 0.3, 1] as const;

type Icon = ComponentType<{ className?: string }>;

/** Sidebar = the real page sections, so the mockup doubles as working nav. */
const MENU: { key: 'overview' | 'work' | 'about' | 'experience' | 'process' | 'contact'; hash: string; icon: Icon }[] = [
  { key: 'overview', hash: 'top', icon: LayoutDashboard },
  { key: 'experience', hash: 'experience', icon: BriefcaseBusiness },
  { key: 'about', hash: 'about', icon: UserRound },
  { key: 'work', hash: 'work', icon: FolderKanban },
  { key: 'process', hash: 'process', icon: Workflow },
  { key: 'contact', hash: 'contact', icon: Mail },
];

/** Handle shown under each profile — derived from the URL so data.ts stays the source. */
function handleOf(url: string) {
  const seg = url.replace(/\/+$/, '').split('/').pop() ?? '';
  return url.includes('linkedin.com') ? `in/${seg}` : `@${seg}`;
}

/** Every profile that already exists on the site + the two freelance platforms. */
const PROFILES: { name: string; url: string; handle: string; icon: Icon; brand: string }[] = [
  ...socials.map((s) => ({
    name: s.label,
    url: s.url,
    handle: handleOf(s.url),
    icon: ({ dribbble: Dribbble, behance: Behance, linkedin: Linkedin, github: Github } as Record<string, Icon>)[s.key],
    // Brand colour revealed on hover (GitHub follows the theme's foreground).
    brand: { dribbble: '#EA4C89', behance: '#1769FF', linkedin: '#0A66C2', github: 'rgb(var(--foreground))' }[s.key],
  })),
  { name: 'Upwork', url: upwork.url, handle: upwork.status, icon: UpworkGlyph, brand: '#14A800' },
  { name: 'Fiverr', url: fiverr.url, handle: handleOf(fiverr.url), icon: FiverrGlyph, brand: '#1DBF73' },
];

/* ------------------------------------------------------------------ */

function Sidebar() {
  const tNav = useTranslations('nav');
  const t = useTranslations('heroShowcase');
  const tHero = useTranslations('hero');
  // Hover highlight glides between items (shared layoutId); rests on Overview.
  const [hovered, setHovered] = useState<string | null>(null);
  const workCount = projects.filter((p) => p.featured).length;

  return (
    <aside className="hidden w-[212px] shrink-0 flex-col border-r border-border bg-muted/40 p-3 md:flex">
      <div className="flex items-center justify-between px-1.5 py-1">
        <span className="flex items-center gap-2">
          <BrandMark className="h-7 w-7" />
          <span className="font-heading text-[15px] font-bold tracking-tight text-foreground">
            {SITE.name}
            <span className="text-accent">.</span>
          </span>
        </span>
        <ChevronsLeft className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </div>

      <div className="mt-3 flex h-8 items-center gap-2 rounded-lg border border-border bg-card px-2.5 text-[12px] text-muted-foreground">
        <Search className="h-3.5 w-3.5" aria-hidden="true" />
        {t('search')}
        <kbd className="ml-auto rounded border border-border px-1 font-body text-[10px]">⌘K</kbd>
      </div>

      <p className="mt-5 px-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {t('mainMenu')}
      </p>
      <nav className="mt-1.5 space-y-0.5" onMouseLeave={() => setHovered(null)}>
        {MENU.map(({ key, hash, icon: Icon }) => {
          const active = (hovered ?? 'overview') === key;
          return (
            <a
              key={key}
              href={`#${hash}`}
              onMouseEnter={() => setHovered(key)}
              onFocus={() => setHovered(key)}
              className={`relative flex h-8 items-center gap-2.5 rounded-lg px-2 text-[13px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active ? 'font-medium text-foreground' : 'text-muted-foreground'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="mock-nav-pill"
                  className="absolute inset-0 rounded-lg bg-card shadow-sm ring-1 ring-border"
                  transition={{ type: 'spring', stiffness: 520, damping: 40 }}
                />
              )}
              <Icon className="relative h-4 w-4" />
              <span className="relative">{key === 'overview' ? t('overview') : tNav(key)}</span>
              {key === 'work' && (
                <span className="relative ml-auto rounded-md bg-muted px-1.5 py-px text-[10px] font-semibold text-muted-foreground">
                  {workCount}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Signed-in user card */}
      <div className="mt-auto flex items-center gap-2.5 rounded-xl border border-border bg-card p-2">
        <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gradient-to-b from-accent/25 to-accent/5">
          <Image src="/profile.webp" alt="" fill sizes="32px" className="object-cover object-top" />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[12.5px] font-semibold text-foreground">{SITE.name}</span>
          <span className="block truncate text-[11px] text-muted-foreground">{tHero('role')}</span>
        </span>
        <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-500" title={tHero('available')} />
      </div>
    </aside>
  );
}

function ProfilesCard() {
  const t = useTranslations('heroShowcase');
  return (
    <section className="rounded-xl border border-border bg-card p-3 md:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t('profiles')}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <RefreshCw className="h-3 w-3 text-accent motion-safe:animate-[spin_1.2s_ease-in-out_1]" aria-hidden="true" />
            {t('lastSync')}: <span className="font-medium text-foreground">{t('justNow')}</span>
          </p>
        </div>
        <span className="inline-flex h-6 items-center gap-1.5 rounded-md border border-border px-2 text-[11px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {t('connected', { count: PROFILES.length })}
        </span>
      </div>

      {/* 3-up on phones keeps the card short enough for "Selected work" to peek in */}
      <ul className="mt-3 grid grid-cols-3 gap-1 sm:gap-1.5 lg:grid-cols-6">
        {PROFILES.map(({ name, url, handle, icon: Icon, brand }) => (
          <li key={name}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ '--brand': brand } as CSSProperties}
              className="group/p flex flex-col gap-2 rounded-lg border border-transparent p-2 transition-[background-color,border-color,transform] duration-200 sm:p-2.5 ease-out hover:-translate-y-0.5 hover:border-border hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex items-center justify-between">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors duration-200 group-hover/p:text-[color:var(--brand)]">
                  <Icon className="h-4 w-4" />
                </span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 -translate-x-1 translate-y-1 text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover/p:translate-x-0 group-hover/p:translate-y-0 group-hover/p:opacity-100"
                  aria-hidden="true"
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[12.5px] font-semibold text-foreground">{name}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{handle}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function WorkCard() {
  const t = useTranslations('heroShowcase');
  const locale = useLocale();
  const picks = projects.filter((p) => p.featured && !p.protected).slice(0, 3);

  return (
    <section className="rounded-xl border border-border bg-card p-3 md:p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {t('selectedWork')}
        </p>
        <a
          href="#work"
          className="group/all inline-flex items-center gap-1 text-[11.5px] font-medium text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t('viewAll')}
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/all:translate-x-0.5" />
        </a>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
        {picks.map((p, i) => (
          <li key={p.slug} className={i === 2 ? 'hidden md:block' : undefined}>
            <Link
              href={`/work/${p.slug}`}
              className="group/t block overflow-hidden rounded-lg border border-border bg-muted/40 transition-[border-color,box-shadow] duration-300 hover:border-accent/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="relative block aspect-[16/10] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 260px, 45vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover/t:scale-[1.04]"
                />
              </span>
              <span className="block p-2.5">
                <span className="block truncate text-[12px] font-semibold text-foreground">
                  {p.title.split(': ')[0]}
                </span>
                <span className="block truncate text-[10.5px] text-muted-foreground">
                  {p.category} · {loc(p.timeline, locale)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * "Portfolio dashboard" — stands in for the product screenshot in a SaaS hero.
 * Built as live UI rather than an image: crisp at any size, themed light/dark,
 * and every control works (sidebar → page sections, profiles → real accounts,
 * thumbnails → case studies).
 *
 * Motion: rises in after the headline; then tilts from a slight 3D lean to flat
 * as it scrolls into view (scroll-linked, springy). Reduced motion → flat, static.
 */
export function PortfolioMockup({ ready }: { ready: boolean }) {
  const t = useTranslations('heroShowcase');
  const tHero = useTranslations('hero');
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.3'] });
  const rotateRaw = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 14, 0]);
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.94, 1]);
  const rotateX = useSpring(rotateRaw, { stiffness: 140, damping: 30, mass: 0.4 });
  const scale = useSpring(scaleRaw, { stiffness: 140, damping: 30, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 56 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 56 }}
      transition={{ duration: 1, ease: EASE, delay: 0.7 }}
      className="relative mx-auto mt-12 w-full max-w-[1060px] [perspective:1600px] md:mt-16"
    >
      <motion.div style={{ rotateX, scale, transformOrigin: '50% 0%' }} className="mock-fade">
        <div
          role="region"
          aria-label={t('mockLabel')}
          className="rounded-[22px] border border-border bg-card/60 p-1.5 shadow-[0_40px_90px_-40px_rgb(15_23_42/0.45)] backdrop-blur-sm dark:shadow-[0_40px_90px_-40px_rgb(0_0_0/0.9)]"
        >
          <div className="flex h-[460px] overflow-hidden rounded-2xl border border-border bg-background md:h-[500px]">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
              {/* Top bar */}
              <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-3.5 md:h-14 md:px-5">
                <p className="font-heading text-[15px] font-semibold text-foreground md:text-base">
                  {t('overview')}
                </p>
                <div className="flex items-center gap-2">
                  <span className="hidden h-7 items-center gap-1.5 rounded-full border border-border px-2.5 text-[11px] text-muted-foreground sm:inline-flex">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 motion-safe:animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    {tHero('available')}
                  </span>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="inline-flex h-7 items-center gap-1 rounded-lg bg-foreground px-2.5 text-[11px] font-semibold text-background transition-transform duration-150 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Plus className="h-3 w-3" aria-hidden="true" />
                    {t('hire')}
                  </a>
                  <span className="relative h-7 w-7 overflow-hidden rounded-full bg-gradient-to-b from-accent/25 to-accent/5 ring-1 ring-border">
                    <Image src="/profile.webp" alt="" fill sizes="28px" className="object-cover object-top" />
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-hidden bg-muted/20 p-3 md:p-4">
                <ProfilesCard />
                <WorkCard />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
