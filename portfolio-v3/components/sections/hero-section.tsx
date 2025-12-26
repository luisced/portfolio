'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import RotatingDecryptedText from '@/components/effects/rotating-decrypted-text';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // Entry animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states - everything hidden
      gsap.set(imageRef.current, { opacity: 0, y: -100, clipPath: 'inset(100% 0 0 0)' });
      gsap.set(nameRef.current, { opacity: 0, scale: 0.95 });
      gsap.set(leftContentRef.current, { opacity: 0 });
      gsap.set(headlineRef.current, { opacity: 0, y: 30 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 });

      // Timeline - Animation sequence: Name → Header → Subtitle → Image
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. First: background is already visible, wait a moment
      tl.to({}, { duration: 0.3 })
        // 2. Name appears first with invert effect
        .to(nameRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
        })
        // 3. Left content container becomes visible
        .to(
          leftContentRef.current,
          {
            opacity: 1,
            duration: 0.5,
          },
          '-=0.3'
        )
        // 4. Header (headline) animates in
        .to(
          headlineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          '-=0.2'
        )
        // 5. Subtitle animates in
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          '-=0.2'
        )
        // 6. Finally: image animates from top to bottom
        .to(
          imageRef.current,
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0% 0 0 0)',
            duration: 1,
            ease: 'power2.out',
          },
          '-=0.3'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Parallax effect using ScrollTrigger (integrated with Lenis)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Name moves up the most (furthest layer)
      gsap.to(nameRef.current, {
        y: -150,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Headline moves up for layered effect
      gsap.to(headlineRef.current, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Subtitle moves up slightly less (closest to viewer)
      gsap.to(subtitleRef.current, {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[115vh] w-full overflow-hidden bg-[#f5f5f5]"
      aria-labelledby="hero-heading"
    >
      {/* Right Side - Image (takes right portion of viewport) */}
      <div
        ref={imageRef}
        className="absolute top-0 right-0 h-[115vh] w-1/3 lg:w-[45%] overflow-hidden z-[5]"
      >
        <Image
          src="/luis_hero.webp"
          alt="Luis Cedillo"
          fill
          className="object-cover object-center lg:object-center"
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
        />
      </div>

      {/* Main Name - Centered with split-color effect (black left, white right) */}
      <h1
        ref={nameRef}
        id="hero-heading"
        className="absolute top-0 left-0 right-0 h-screen z-20 flex items-center justify-center pointer-events-none px-4 pb-[25vh] lg:pb-[28vh] 2xl:pb-[32vh]"
      >
        <span className="hero-name text-[clamp(3rem,15vw,16rem)] leading-[85%] tracking-[-0.05em] font-extrabold uppercase whitespace-nowrap bg-gradient-to-r from-black from-68% to-white/90 to-65% lg:from-56% lg:to-56% bg-clip-text text-transparent">
          Luis Cedillo
        </span>
      </h1>

      {/* Left Side - Content (takes left portion of viewport) */}
      <div
        ref={leftContentRef}
        className="absolute top-0 left-0 h-[115vh] w-2/3 lg:w-[55%] flex flex-col justify-end px-6 md:px-10 lg:px-14 xl:px-20 2xl:px-28 pb-[30vh] lg:pb-[32vh] 2xl:pb-[28vh] z-10 bg-[#F5F5EB]"
      >
        {/* Secondary Headline */}
        <div ref={headlineRef} className="mb-6 lg:mb-8 2xl:mb-10">
          <p className="text-[clamp(1.5rem,5vw,5.5rem)] leading-[100%] tracking-[-0.07em] font-extrabold uppercase text-[#171717]">
            Software Engineer
          </p>
        </div>

        {/* Subtitle */}
        <div ref={subtitleRef} className="text-[clamp(1rem,1.5vw,1.5rem)] text-[#171717]/60 max-w-md 2xl:max-w-xl">
          <p className="mb-1">Building digital experiences that matter</p>
          <RotatingDecryptedText
            phrases={[
              'with precision and purpose.',
              'with passion and innovation.',
              'with code and creativity.',
              'with impact and excellence.',
            ]}
            intervalMs={4000}
            speed={20}
            className="text-[#171717]"
          />
        </div>
      </div>
    </section>
  );
}
