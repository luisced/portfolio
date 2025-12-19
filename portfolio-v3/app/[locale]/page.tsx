import { HeroSection } from '@/components/sections/hero-section';
import { SkipLinks } from '@/components/navigation/skip-links';
import { FloatingNav } from '@/components/navigation/floating-nav';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { ThemeToggle } from '@/components/navigation/theme-toggle';

export default function HomePage() {
  return (
    <>
      <SkipLinks />
      <MobileNav />
      <ThemeToggle />
      <FloatingNav />

      <main id="main-content">
        <HeroSection />

        {/* Placeholder sections for navigation */}
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
          id="about"
          className="min-h-screen flex items-center justify-center bg-muted/30"
          aria-labelledby="about-heading"
        >
          <div className="container mx-auto px-4">
            <h2 id="about-heading" className="text-4xl font-bold text-center">
              About Section
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
