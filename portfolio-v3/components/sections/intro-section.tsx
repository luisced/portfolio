'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function IntroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const fullText = "ANYONE CAN WRITE CODE. THE REAL ART LIES IN TRANSFORMING VISIONARY IDEAS INTO ELEGANT SOLUTIONS THAT RESHAPE HOW THE WORLD WORKS.";
  const baseColor = 'rgba(255, 255, 255, 0.35)';

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textElement = textRef.current;
      
      if (!textElement) return;

      // Build text as words (for natural spacing/wrapping), with per-char spans for highlight.
      const escapeHtml = (s: string) =>
        s
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&#39;');

      const words = fullText.split(' ');
      textElement.innerHTML = words
        .map((word) => {
          const chars = word.split('').map((ch) => `<span class="char">${escapeHtml(ch)}</span>`).join('');
          return `<span class="word">${chars}</span>`;
        })
        .join(' ');

      const charElements = textElement.querySelectorAll('.char');

      // Create the main ScrollTrigger animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%', // Extended scroll area for both phases
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Phase 1 (0-60%): Highlight effect - change from grey to white
      tl.to(charElements, {
        color: 'rgba(255, 255, 255, 1)',
        duration: 0.6, // Takes 60% of the timeline
        stagger: {
          each: 0.6 / charElements.length,
          ease: 'none',
        },
        ease: 'none',
      });

      // Phase 2 (60-100%): Slide out to the left and fade
      tl.to(
        [imageRef.current, textContainerRef.current],
        {
          x: '-100%',
          opacity: 0,
          duration: 0.4, // Takes 40% of the timeline
          ease: 'power2.inOut',
        },
        '+=0.1' // Small pause after text is complete
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#141414' }}
    >
      <div className="w-full h-screen flex flex-col lg:flex-row items-center justify-center">
        {/* Left Side - Image */}
        <div
          ref={imageRef}
          className="w-full lg:w-[40%] h-[40vh] lg:h-full relative flex items-center justify-center px-6 lg:px-12"
        >
          <div className="relative w-full max-w-md lg:max-w-none aspect-square lg:aspect-auto lg:h-[70%]">
            <Image
              src="/about_me.webp"
              alt="About Me"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
          </div>
        </div>

        {/* Right Side - Text */}
        <div
          ref={textContainerRef}
          className="w-full lg:w-[60%] h-[60vh] lg:h-full flex items-center justify-center px-6 lg:px-12 xl:px-20"
        >
          <div className="max-w-3xl">
            <div
              ref={textRef}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
              style={{ 
                color: baseColor,
                fontFamily: 'var(--font-sora), Sora, sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              {/* Text will be injected by GSAP */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

