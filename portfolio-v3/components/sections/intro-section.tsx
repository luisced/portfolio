'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

export function IntroSection() {
  const t = useTranslations('intro');
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const fullText = t('quote');

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const textElement = textRef.current;
    const container = containerRef.current;
    
    if (!textElement || !container) return;

    if (reduced) {
      textElement.textContent = fullText;
      textElement.style.color = 'hsl(var(--foreground))';
      return;
    }

    const ctx = gsap.context(() => {
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

      // Start fully dark / invisible
      gsap.set(charElements, { color: 'rgba(255, 255, 255, 0.05)' });

      // Create the main ScrollTrigger animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      // Phase 1 (0-75%): Letter-by-letter reveal - each char snaps from invisible to bright white
      tl.to(charElements, {
        color: 'rgba(255, 255, 255, 1)',
        duration: 0.75,
        stagger: {
          each: 0.75 / charElements.length,
          ease: 'none',
        },
        ease: 'power2.out',
      });

      // Phase 2 (75-100%): Slide out to the left and fade
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
    }, container);

    return () => ctx.revert();
  }, [fullText]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background"
    >
      <h2 className="sr-only">Philosophy</h2>
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
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight font-sans tracking-tight"
              style={{ color: 'rgba(255, 255, 255, 0.05)' }}
            >
              {/* Text will be injected by GSAP */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

