'use client';

import { useRef, useEffect, useState } from 'react';
import { Timeline } from '@/components/timeline/timeline';
import { IntroSection } from './intro-section';
import { ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

const TIMELINE_ITEM_COUNT = 7;

export function AboutSection() {
  const timelineWrapperRef = useRef<HTMLDivElement>(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const lastIndex = useRef(0);

  useEffect(() => {
    const wrapper = timelineWrapperRef.current;
    if (!wrapper || prefersReducedMotion()) return;

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: `+=${(TIMELINE_ITEM_COUNT - 1) * 100}vh`,
      pin: true,
      onUpdate: (self) => {
        const index = Math.min(
          Math.floor(self.progress * TIMELINE_ITEM_COUNT),
          TIMELINE_ITEM_COUNT - 1
        );
        if (index !== lastIndex.current) {
          lastIndex.current = index;
          setScrollIndex(index);
        }
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-background"
      aria-labelledby="about-heading"
    >
      <h2 id="about-heading" className="sr-only">
        About
      </h2>

      {/* Timeline - pinned while scrolling through items */}
      <div
        ref={timelineWrapperRef}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="container mx-auto px-4 py-10 md:py-20">
          <Timeline scrollIndex={scrollIndex} />
        </div>
      </div>

      {/* Intro Section - Scroll-driven with pinning */}
      <IntroSection />
    </section>
  );
}
