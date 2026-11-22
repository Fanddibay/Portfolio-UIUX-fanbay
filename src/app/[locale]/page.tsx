import { setRequestLocale } from 'next-intl/server';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { Hero } from '@/components/sections/Hero';
import { StatsMarquee } from '@/components/sections/StatsMarquee';
import { About } from '@/components/sections/About';
import { Process } from '@/components/sections/Process';
import { Work } from '@/components/sections/Work';
import { Experience } from '@/components/sections/Experience';
import { Testimonials } from '@/components/sections/Testimonials';
import { Contact } from '@/components/sections/Contact';
import { homeJsonLd, jsonLdString } from '@/lib/seo';

/**
 * Home — single-page portfolio. Order: Hero → Experience → About → Work, so
 * credibility (track record) and the designer-engineer story land before the
 * case studies; Process, Testimonials and Contact follow. (The standalone AI
 * Tools section was removed — AI now shows up in context: the hero orbit, the
 * About "Figma to code, with AI" card, and the case studies.) Nav menus
 * (Navbar, Footer, MobileTabBar, hero mockup sidebar) list sections in this
 * same order.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale); // enable static rendering for this page

  return (
    <>
      {/* ProfilePage + projects ItemList (home only; Person/WebSite live in the layout) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(homeJsonLd(locale)) }}
      />
      <Navbar />
      <main>
        <Hero />
        <StatsMarquee />
        <Experience />
        <About />
        <Work />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      {/* App-style bottom navigation (mobile only) */}
      <MobileTabBar />
    </>
  );
}
