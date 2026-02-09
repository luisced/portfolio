'use client';

import { Timeline } from '@/components/timeline/timeline';
import { IntroSection } from './intro-section';
import { SkillsSection } from './skills-section';

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-background"
      aria-labelledby="about-heading"
    >
      <h2 id="about-heading" className="sr-only">
        About
      </h2>

      {/* Timeline */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 py-10 md:py-20">
          <Timeline />
        </div>
      </div>

      {/* Intro Section - Scroll-driven with pinning */}
      <IntroSection />

      {/* Skills Section - Revealed after intro slides out */}
      <SkillsSection />
    </section>
  );
}
