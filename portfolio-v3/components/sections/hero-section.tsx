'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

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

  // Subtle parallax effect using ScrollTrigger (integrated with Lenis)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle parallax - name moves slower (parallax up)
      gsap.to(nameRef.current, {
        yPercent: -5,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Headline moves slightly faster
      gsap.to(headlineRef.current, {
        yPercent: -3,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Subtitle moves even faster for depth
      gsap.to(subtitleRef.current, {
        yPercent: -2,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Image moves slightly down for opposite effect
      gsap.to(imageRef.current, {
        yPercent: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#f5f5f5]"
      aria-labelledby="hero-heading"
    >
      {/* Right Side - Image (takes right portion of viewport) */}
      <div
        ref={imageRef}
        className="absolute top-0 right-0 bottom-0 w-full lg:w-[45%] overflow-hidden"
      >
        <Image
          src="/luis_hero.webp"
          alt="Luis Cedillo"
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
        />
      </div>

      {/* Main Name - Centered with mix-blend-difference for color inversion */}
      <h1
        ref={nameRef}
        id="hero-heading"
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none mix-blend-difference px-4"
      >
        <span className="hero-name text-[clamp(4rem,15vw,12rem)] leading-[85%] tracking-[-0.05em] font-extrabold uppercase text-white whitespace-nowrap">
          Luis Cedillo
        </span>
      </h1>

      {/* Left Side - Content (takes left portion of viewport) */}
      <div
        ref={leftContentRef}
        className="absolute top-0 left-0 bottom-0 w-full lg:w-[55%] flex flex-col justify-end px-6 md:px-10 lg:px-14 xl:px-20 py-8 lg:py-16 z-10 bg-[#E5E5E5]"
      >
        {/* Secondary Headline */}
        <div ref={headlineRef} className="mb-6">
          <p className="text-[clamp(1.5rem,5vw,4rem)] leading-[100%] tracking-[-0.07em] font-extrabold uppercase text-[#171717]">
            Software Engineer
          </p>
        </div>

        {/* Subtitle */}
        <p ref={subtitleRef} className="text-base lg:text-lg text-[#171717]/60 max-w-md">
          Building digital experiences that matter —{' '}
          <span className="text-[#171717]">with precision and purpose.</span>
        </p>
      </div>
    </section>
  );
}
