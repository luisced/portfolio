'use client';

import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { ChevronLeft, ChevronRight, Rocket, Layers, Server, Brain } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

export interface TimelineItem {
  yearRange: string;
  title: string;
  company: string;
  startYear: number;
  endYear: number | string;
  icon: React.ReactNode;
}

// Icons and start/end years for each timeline entry
const timelineMeta = [
  { icon: <Rocket className="size-5" key="0" />, startYear: 2019, endYear: 2020 },
  { icon: <Layers className="size-5" key="1" />, startYear: 2020, endYear: 2021 },
  { icon: <Rocket className="size-5" key="2" />, startYear: 2021, endYear: 2022 },
  { icon: <Layers className="size-5" key="3" />, startYear: 2022, endYear: 2023 },
  { icon: <Server className="size-5" key="4" />, startYear: 2023, endYear: 2024 },
  { icon: <Brain className="size-5" key="5" />, startYear: 2024, endYear: 'Present' as number | string },
  { icon: <Brain className="size-5" key="6" />, startYear: 2026, endYear: '???' as number | string },
];

const TIMELINE_COUNT = timelineMeta.length;

// Sprite frames in order
const spriteFrames = ['/sprites/1.png', '/sprites/2.png', '/sprites/3.png', '/sprites/4.png'];

// Animated Sprite Character Component
const SpriteCharacter = memo(function SpriteCharacter({ isWalking, facingLeft }: { isWalking: boolean; facingLeft: boolean }) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isWalking) {
      animationRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % spriteFrames.length);
      }, 150);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
      setCurrentFrame(0);
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isWalking]);

  return (
    <div
      className="relative"
      style={{
        transform: facingLeft ? 'scaleX(-1)' : 'scaleX(1)',
      }}
    >
      <div className="w-40 h-40 md:w-48 md:h-48 relative">
        <Image
          src={spriteFrames[currentFrame]}
          alt="Character"
          fill
          sizes="192px"
          className="object-contain"
          style={{ imageRendering: 'pixelated' }}
          unoptimized
        />
      </div>
      {/* Shadow */}
      <div className="w-12 md:w-16 h-2 bg-black/40 blur-[3px] rounded-full mx-auto mt-1" />
    </div>
  );
});

interface TimelineProps {
  data?: TimelineItem[];
}

export function Timeline({ data }: TimelineProps = {}) {
  const t = useTranslations('timeline');

  // Build timeline data from translations + metadata
  const timelineData: TimelineItem[] = useMemo(() => {
    if (data) return data;

    return timelineMeta.map((meta, idx) => ({
      yearRange: t(`${idx}.yearRange`),
      title: t(`${idx}.title`),
      company: t(`${idx}.company`),
      startYear: meta.startYear,
      endYear: meta.endYear,
      icon: meta.icon,
    }));
  }, [data, t]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for GSAP animations
  const yearHeadingRef = useRef<HTMLDivElement>(null);
  const characterAreaRef = useRef<HTMLDivElement>(null);
  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const jobTitleRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  const currentItem = timelineData[currentIndex];

  // Fixed spacing between checkpoints
  const CHECKPOINT_SPACING = 180;
  const TIMELINE_PADDING = 100;

  // Calculate the total timeline width
  const timelineWidth = useMemo(() => {
    return TIMELINE_PADDING * 2 + (timelineData.length - 1) * CHECKPOINT_SPACING;
  }, [timelineData.length]);

  // Calculate character position in pixels
  const calculateCharacterPosition = useCallback(() => {
    return TIMELINE_PADDING + currentIndex * CHECKPOINT_SPACING;
  }, [currentIndex]);

  // GSAP Scroll-triggered entrance animations
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      // Initial states - everything hidden
      gsap.set(yearHeadingRef.current, { opacity: 0, y: -50 });
      gsap.set(characterAreaRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(timelineTrackRef.current, { opacity: 0, scaleX: 0 });
      gsap.set(jobTitleRef.current, { opacity: 0, y: 30 });
      gsap.set(controlsRef.current, { opacity: 0, y: 20 });

      if (reduced) {
        // Skip animations, show final state
        gsap.set(
          [
            yearHeadingRef.current,
            characterAreaRef.current,
            timelineTrackRef.current,
            jobTitleRef.current,
            controlsRef.current,
          ],
          { opacity: 1, y: 0, scale: 1, scaleX: 1 }
        );
        const dots = timelineTrackRef.current?.querySelectorAll('.checkpoint-dot');
        if (dots) gsap.set(dots, { opacity: 1, scale: 1 });
        return;
      }

      // Create scroll-triggered animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        },
      });

      // Animation sequence
      tl.to(yearHeadingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      })
        .to(
          timelineTrackRef.current,
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        .to(
          characterAreaRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
          },
          '-=0.4'
        )
        .to(
          jobTitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.2'
        )
        .to(
          controlsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          },
          '-=0.2'
        );

      // Animate checkpoint dots with stagger
      const dots = timelineTrackRef.current?.querySelectorAll('.checkpoint-dot');
      if (dots && dots.length > 0) {
        gsap.set(dots, { opacity: 0, scale: 0 });
        tl.to(
          dots,
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: 0.08,
            ease: 'back.out(2)',
          },
          '-=0.6'
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Auto-scroll timeline to keep character visible
  useEffect(() => {
    if (timelineRef.current) {
      const container = timelineRef.current;
      const containerWidth = container.clientWidth;
      const characterPos = calculateCharacterPosition();
      const scrollTarget = characterPos - containerWidth / 2;

      container.scrollTo({
        left: Math.max(0, scrollTarget),
        behavior: 'smooth',
      });
    }
  }, [currentIndex, calculateCharacterPosition]);

  const navigate = useCallback((direction: number) => {
    setFacingLeft(direction < 0);
    setIsWalking(true);

    setCurrentIndex((prev) => {
      let nextIndex = prev + direction;
      if (nextIndex < 0) nextIndex = timelineData.length - 1;
      if (nextIndex >= timelineData.length) nextIndex = 0;
      return nextIndex;
    });

    setTimeout(() => setIsWalking(false), 1000);
  }, [timelineData.length]);

  // Keyboard navigation (scoped to container)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigate(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigate(1);
      }
    },
    [navigate]
  );

  const titleWords = currentItem.title.split(' ');
  const titlePrefix = titleWords[0];
  const titleSuffix = titleWords.slice(1).join(' ');

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center max-w-5xl mx-auto"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Career timeline"
    >
      {/* Year Range Heading */}
      <div
        ref={yearHeadingRef}
        className="text-center mb-8 min-h-[5rem] flex items-center justify-center overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentItem.yearRange}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight font-pixel px-4 text-brand"
          >
            {currentItem.yearRange}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* Character + Timeline Container */}
      <div className="relative w-full max-w-[900px] mb-8 sm:mb-12 overflow-hidden">
        {/* Scrollable Timeline + Character Container */}
        <div ref={timelineRef} className="w-full overflow-x-auto overflow-y-visible scrollbar-hide">
          <div
            className="relative"
            style={{
              width: `${timelineWidth}px`,
              minWidth: '100%',
            }}
          >
            {/* The Sprite Character - positioned above timeline */}
            <div ref={characterAreaRef} className="relative h-[180px] md:h-[200px] flex items-end">
              <motion.div
                className="absolute z-20 bottom-0"
                initial={false}
                animate={{
                  x: calculateCharacterPosition() - 80,
                }}
                transition={{
                  duration: 1,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <SpriteCharacter isWalking={isWalking} facingLeft={facingLeft} />
              </motion.div>
            </div>

            {/* Timeline Track Area */}
            <div ref={timelineTrackRef} className="h-[60px] relative flex items-center origin-left">
              {/* The Flat Dashed Line */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-[2px] w-full"
                style={{
                  backgroundImage: 'linear-gradient(to right, hsl(var(--border)) 50%, transparent 50%)',
                  backgroundSize: '20px 1px',
                  backgroundRepeat: 'repeat-x',
                }}
              />

              {/* Stops (Dots) on the line */}
              {timelineData.map((item, idx) => (
                <div
                  key={idx}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{
                    left: `${TIMELINE_PADDING + idx * CHECKPOINT_SPACING}px`,
                  }}
                >
                  <motion.div
                    className={`checkpoint-dot w-4 h-4 md:w-5 md:h-5 rounded-full cursor-pointer -translate-x-1/2 border-2 ${
                      idx === currentIndex
                        ? 'bg-brand border-brand'
                        : 'bg-border border-muted'
                    }`}
                    animate={{
                      scale: idx === currentIndex ? 1.5 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      const direction = idx > currentIndex ? 1 : -1;
                      setFacingLeft(direction < 0);
                      setIsWalking(true);
                      setCurrentIndex(idx);
                      setTimeout(() => setIsWalking(false), 1000);
                    }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    aria-label={`Go to ${item.yearRange}: ${item.title} at ${item.company}`}
                    role="button"
                  />

                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredIndex === idx && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-card border-2 border-brand rounded-lg px-4 py-3 whitespace-nowrap z-30"
                        style={{ pointerEvents: 'none' }}
                      >
                        <div className="text-brand font-bold text-sm font-pixel mb-1">
                          {item.yearRange}
                        </div>
                        <div className="text-foreground text-xs">{item.title}</div>
                        <div className="text-muted-foreground text-xs">{item.company}</div>
                        {/* Arrow */}
                        <div
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
                          style={{
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderTop: '8px solid hsl(var(--brand))',
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job Title */}
      <div
        ref={jobTitleRef}
        className="text-center mb-8 sm:mb-10 md:mb-12 min-h-[6rem] sm:min-h-[8rem] flex flex-col justify-center items-center px-4"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-foreground mb-2">{titlePrefix}</h3>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {titleSuffix}
            </h3>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div
        ref={controlsRef}
        className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full px-4"
      >
        {/* Company Badge - Top on mobile, center on desktop */}
        <div className="w-full md:w-auto flex justify-center order-1 md:order-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0.5 }}
              transition={{ duration: 0.3 }}
              className="bg-card border-2 border-brand text-brand rounded-sm px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 min-w-[240px] sm:min-w-[280px] justify-center transform transition-all duration-300 hover:translate-x-[2px] hover:translate-y-[2px] shadow-pixel-brand"
            >
              <div className="w-8 h-8 flex items-center justify-center">{currentItem.icon}</div>
              <span className="text-[0.6rem] md:text-xs font-bold tracking-tight font-pixel">
                {currentItem.company}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Navigation Row - Both controls side by side */}
        <div className="flex md:hidden items-center justify-between w-full max-w-md order-2">
          {/* Left: Year + Arrow */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-muted-foreground tabular-nums font-pixel">
              {currentItem.startYear}
            </span>
            <button
              onClick={() => navigate(-1)}
              className="p-3 hover:bg-muted rounded-xl transition-all duration-200 border border-border cursor-pointer"
              aria-label="Previous position"
            >
              <ChevronLeft className="w-5 h-5 text-foreground hover:text-brand transition-colors" />
            </button>
          </div>

          {/* Right: Arrow + Year */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(1)}
              className="p-3 rounded-xl transition-all duration-200 bg-brand text-black hover:opacity-90 cursor-pointer shadow-pixel-strong"
              aria-label="Next position"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="text-sm font-bold text-muted-foreground tabular-nums font-pixel">
              {currentItem.endYear}
            </span>
          </div>
        </div>

        {/* Desktop Left Control */}
        <div className="hidden md:flex items-center gap-4 order-1">
          <span className="text-base font-bold text-muted-foreground tabular-nums font-pixel">
            {currentItem.startYear}
          </span>
          <button
            onClick={() => navigate(-1)}
            className="p-4 hover:bg-muted rounded-xl transition-all duration-200 border border-border cursor-pointer"
            aria-label="Previous position"
          >
            <ChevronLeft className="w-6 h-6 text-foreground hover:text-brand transition-colors" />
          </button>
        </div>

        {/* Desktop Right Control */}
        <div className="hidden md:flex items-center gap-4 order-3">
          <button
            onClick={() => navigate(1)}
            className="p-4 rounded-xl transition-all duration-200 bg-brand text-black hover:opacity-90 cursor-pointer shadow-pixel-strong"
            aria-label="Next position"
          >
            <ChevronRight className="size-6" />
          </button>
          <span className="text-base font-bold text-muted-foreground tabular-nums font-pixel">
            {currentItem.endYear}
          </span>
        </div>
      </div>
    </div>
  );
}


