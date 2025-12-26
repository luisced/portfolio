'use client';

import { Timeline, defaultTimelineData } from '@/components/timeline/timeline';

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#141414' }}
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4 py-10 md:py-20">
        <Timeline data={defaultTimelineData} />
      </div>
    </section>
  );
}
