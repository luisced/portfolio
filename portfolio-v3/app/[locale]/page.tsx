import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { SkipLinks } from '@/components/navigation/skip-links';
import { Navbar } from '@/components/navigation/navbar';

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
    </>
  );
}
