'use client';

import { Timeline, defaultTimelineData } from '@/components/timeline/timeline';
import { IntroSection } from './intro-section';
import { SkillsSection } from './skills-section';

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#141414' }}
      aria-labelledby="about-heading"
    >
      {/* Timeline */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 py-10 md:py-20">
          <Timeline data={defaultTimelineData} />
        </div>
      </div>

      {/* Intro Section - Scroll-driven with pinning */}
      <IntroSection />

      {/* Skills Section - Revealed after intro slides out */}
      <SkillsSection />
    </section>
  );
}
