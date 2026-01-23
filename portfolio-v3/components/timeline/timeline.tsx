'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Rocket, Layers, Server, Brain } from 'lucide-react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface TimelineItem {
  yearRange: string;
  title: string;
  company: string;
  startYear: number;
  endYear: number | string;
  icon: React.ReactNode;
}

// Default timeline data
export const defaultTimelineData: TimelineItem[] = [
  {
    yearRange: '2019-2020',
    title: 'Intern Developer',
    company: 'StartUp Inc',
    startYear: 2019,
    endYear: 2020,
    icon: <Rocket className="w-5 h-5" />,
  },
  {
    yearRange: '2020-2021',
    title: 'Junior Developer',
    company: 'Code Labs',
    startYear: 2020,
    endYear: 2021,
    icon: <Layers className="w-5 h-5" />,
  },
  {
    yearRange: '2021-2022',
    title: 'Mid Developer',
    company: 'Tech Startup',
    startYear: 2021,
    endYear: 2022,
    icon: <Rocket className="w-5 h-5" />,
  },
  {
    yearRange: '2022-2023',
    title: 'Full Stack Dev',
    company: 'Digital Agency',
    startYear: 2022,
    endYear: 2023,
    icon: <Layers className="w-5 h-5" />,
  },
  {
    yearRange: '2023-2024',
    title: 'Senior Engineer',
    company: 'Tech Giant',
    startYear: 2023,
    endYear: 2024,
    icon: <Server className="w-5 h-5" />,
  },
  {
    yearRange: '2024-Present',
    title: 'Tech Lead',
    company: 'Innovation Labs',
    startYear: 2024,
    endYear: 'Present',
    icon: <Brain className="w-5 h-5" />,
  },
  {
    yearRange: 'Future',
    title: 'VP Engineering',
    company: 'Future Corp',
    startYear: 2026,
    endYear: '???',
    icon: <Brain className="w-5 h-5" />,
  },
];

// Sprite frames in order
const spriteFrames = ['/sprites/1.png', '/sprites/2.png', '/sprites/3.png', '/sprites/4.png'];

// Animated Sprite Character Component
function SpriteCharacter({ isWalking, facingLeft }: { isWalking: boolean; facingLeft: boolean }) {
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
          priority
          unoptimized
        />
      </div>
      {/* Shadow */}
      <div className="w-12 md:w-16 h-2 bg-black/40 blur-[3px] rounded-full mx-auto mt-1" />
    </div>
  );
}

interface TimelineProps {
  data?: TimelineItem[];
}

export function Timeline({ data = defaultTimelineData }: TimelineProps) {
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

  const currentItem = data[currentIndex];

  // Fixed spacing between checkpoints
  const CHECKPOINT_SPACING = 180;
  const TIMELINE_PADDING = 100;

  // Calculate the total timeline width
  const timelineWidth = useMemo(() => {
    return TIMELINE_PADDING * 2 + (data.length - 1) * CHECKPOINT_SPACING;
  }, [data.length]);

  // Calculate character position in pixels
  const calculateCharacterPosition = useCallback(() => {
    return TIMELINE_PADDING + currentIndex * CHECKPOINT_SPACING;
  }, [currentIndex]);

  // GSAP Scroll-triggered entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states - everything hidden
      gsap.set(yearHeadingRef.current, { opacity: 0, y: -50 });
      gsap.set(characterAreaRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(timelineTrackRef.current, { opacity: 0, scaleX: 0 });
      gsap.set(jobTitleRef.current, { opacity: 0, y: 30 });
      gsap.set(controlsRef.current, { opacity: 0, y: 20 });

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
      if (nextIndex < 0) nextIndex = data.length - 1;
      if (nextIndex >= data.length) nextIndex = 0;
      return nextIndex;
    });

    setTimeout(() => setIsWalking(false), 1000);
  }, [data.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const titleWords = currentItem.title.split(' ');
  const titlePrefix = titleWords[0];
  const titleSuffix = titleWords.slice(1).join(' ');

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center max-w-5xl mx-auto">
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
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight font-pixel px-4"
            style={{ color: '#D4FF00' }}
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
                  backgroundImage: 'linear-gradient(to right, #333 50%, transparent 50%)',
                  backgroundSize: '20px 1px',
                  backgroundRepeat: 'repeat-x',
                }}
              />

              {/* Stops (Dots) on the line */}
              {data.map((item, idx) => (
                <div
                  key={idx}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{
                    left: `${TIMELINE_PADDING + idx * CHECKPOINT_SPACING}px`,
                  }}
                >
                  <motion.div
                    className="checkpoint-dot w-4 h-4 md:w-5 md:h-5 rounded-full cursor-pointer -translate-x-1/2"
                    style={{
                      backgroundColor: idx === currentIndex ? '#D4FF00' : '#333',
                      borderColor: idx === currentIndex ? '#D4FF00' : '#555',
                      borderWidth: '2px',
                    }}
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
                  />

                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredIndex === idx && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-[#222] border-2 border-[#D4FF00] rounded-lg px-4 py-3 whitespace-nowrap z-30"
                        style={{ pointerEvents: 'none' }}
                      >
                        <div className="text-[#D4FF00] font-bold text-sm font-pixel mb-1">
                          {item.yearRange}
                        </div>
                        <div className="text-white text-xs">{item.title}</div>
                        <div className="text-white/60 text-xs">{item.company}</div>
                        {/* Arrow */}
                        <div
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
                          style={{
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderTop: '8px solid #D4FF00',
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
            <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-2">{titlePrefix}</h3>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
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
              className="bg-[#222] border-2 border-[#D4FF00] text-[#D4FF00] rounded-sm px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 min-w-[240px] sm:min-w-[280px] justify-center transform transition-all duration-300 hover:translate-x-[2px] hover:translate-y-[2px]"
              style={{
                boxShadow: '4px 4px 0px rgba(212, 255, 0, 0.3)',
              }}
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
            <span className="text-sm font-bold text-white/60 tabular-nums font-pixel">
              {currentItem.startYear}
            </span>
            <button
              onClick={() => navigate(-1)}
              className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/10 cursor-pointer"
              aria-label="Previous position"
            >
              <ChevronLeft className="w-5 h-5 text-white hover:text-[#D4FF00] transition-colors" />
            </button>
          </div>

          {/* Right: Arrow + Year */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(1)}
              className="p-3 rounded-xl transition-all duration-200 bg-[#D4FF00] text-black hover:bg-[#b8dd00] cursor-pointer"
              style={{ boxShadow: '4px 4px 0px #ffffff' }}
              aria-label="Next position"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-white/60 tabular-nums font-pixel">
              {currentItem.endYear}
            </span>
          </div>
        </div>

        {/* Desktop Left Control */}
        <div className="hidden md:flex items-center gap-4 order-1">
          <span className="text-base font-bold text-white/60 tabular-nums font-pixel">
            {currentItem.startYear}
          </span>
          <button
            onClick={() => navigate(-1)}
            className="p-4 hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/10 cursor-pointer"
            aria-label="Previous position"
          >
            <ChevronLeft className="w-6 h-6 text-white hover:text-[#D4FF00] transition-colors" />
          </button>
        </div>

        {/* Desktop Right Control */}
        <div className="hidden md:flex items-center gap-4 order-3">
          <button
            onClick={() => navigate(1)}
            className="p-4 rounded-xl transition-all duration-200 bg-[#D4FF00] text-black hover:bg-[#b8dd00] cursor-pointer"
            style={{ boxShadow: '4px 4px 0px #ffffff' }}
            aria-label="Next position"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <span className="text-base font-bold text-white/60 tabular-nums font-pixel">
            {currentItem.endYear}
          </span>
        </div>
      </div>
    </div>
  );
}


