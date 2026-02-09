import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/sections/hero-section';
import { SkipLinks } from '@/components/navigation/skip-links';
import { Navbar } from '@/components/navigation/navbar';
import { Footer } from '@/components/sections/footer';

// Dynamic import for GSAP-heavy section to reduce initial bundle
const AboutSection = dynamic(
  () => import('@/components/sections/about-section').then((m) => ({ default: m.AboutSection })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

export default function HomePage() {
  return (
    <>
      <SkipLinks />
      <Navbar />

      <main id="main-content">
        <HeroSection />

        {/* About Section with Timeline */}
        <AboutSection />

        <section
          id="projects"
          className="min-h-screen flex items-center justify-center"
          aria-labelledby="projects-heading"
        >
          <div className="container mx-auto px-4">
            <h2 id="projects-heading" className="text-4xl font-bold text-center">
              Projects Section
            </h2>
            <p className="text-center text-muted-foreground mt-4">Coming soon...</p>
          </div>
        </section>

        <section
          id="contact"
          className="min-h-screen flex items-center justify-center"
          aria-labelledby="contact-heading"
        >
          <div className="container mx-auto px-4">
            <h2 id="contact-heading" className="text-4xl font-bold text-center">
              Contact Section
            </h2>
          <p className="text-center text-muted-foreground mt-4">Coming soon...</p>
        </div>
      </section>
    </main>

    <Footer />
  </>
);
}
