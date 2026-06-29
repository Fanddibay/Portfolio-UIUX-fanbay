import { setRequestLocale } from 'next-intl/server';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { AITools } from '@/components/sections/AITools';
import { Process } from '@/components/sections/Process';
import { Work } from '@/components/sections/Work';
import { Experience } from '@/components/sections/Experience';
import { Testimonials } from '@/components/sections/Testimonials';
import { Contact } from '@/components/sections/Contact';

/**
 * Home — single-page portfolio. Sections are ordered to lead with visual
 * impact (Hero → Work) while keeping depth (Process, Case Studies) available
 * for the hiring-manager audience (see DESIGN.md §9).
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale); // enable static rendering for this page

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Work />
        <About />
        <Experience />
        <Process />
        <AITools />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      {/* App-style bottom navigation (mobile only) */}
      <MobileTabBar />
    </>
  );
}
