'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Rocket, Layers, Server, Brain } from 'lucide-react';
import Image from 'next/image';

interface TimelineItem {
  yearRange: string;
  title: string;
  company: string;
  startYear: number;
  endYear: number | string;
  icon: React.ReactNode;
}

const timelineData: TimelineItem[] = [
  {
    yearRange: '2021-2022',
    title: 'Junior Developer',
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
    yearRange: '2023-Present',
    title: 'Senior Engineer',
    company: 'Tech Giant',
    startYear: 2023,
    endYear: 'Present',
    icon: <Server className="w-5 h-5" />,
  },
  {
    yearRange: 'Future',
    title: 'Tech Lead',
    company: 'Innovate Corp',
    startYear: 2025,
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
      // Start sprite animation cycle
      animationRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % spriteFrames.length);
      }, 150); // 150ms per frame for walking animation
    } else {
      // Stop animation and reset to first frame
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
      <div className="w-20 h-20 md:w-24 md:h-24 relative">
        <Image
          src={spriteFrames[currentFrame]}
          alt="Character"
          fill
          sizes="96px"
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

export function AboutSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);
  const currentItem = timelineData[currentIndex];

  // Calculate man position (percentage)
  const calculateManPosition = () => {
    const totalItems = timelineData.length;
    const minPos = 5;
    const maxPos = 95;
    const range = maxPos - minPos;
    const step = totalItems > 1 ? range / (totalItems - 1) : 0;
    return minPos + currentIndex * step;
  };

  const navigate = useCallback((direction: number) => {
    setFacingLeft(direction < 0);
    setIsWalking(true);

    setCurrentIndex((prev) => {
      let nextIndex = prev + direction;
      if (nextIndex < 0) nextIndex = timelineData.length - 1;
      if (nextIndex >= timelineData.length) nextIndex = 0;
      return nextIndex;
    });

    // Stop walking after animation
    setTimeout(() => setIsWalking(false), 1000);
  }, []);

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
    <section
      id="about"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#141414' }}
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4 py-10 md:py-20 flex flex-col items-center max-w-5xl">
        {/* Year Range Heading */}
        <div className="text-center mb-12 min-h-[5rem] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentItem.yearRange}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-pixel"
              style={{ color: '#D4FF00' }}
            >
              {currentItem.yearRange}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Timeline Track Area */}
        <div className="relative w-full max-w-[800px] h-[120px] mb-12 flex flex-col items-center justify-center">
          {/* The Flat Dashed Line */}
          <div
            className="w-full h-[2px] relative flex items-center"
            style={{
              backgroundImage: 'linear-gradient(to right, #333 50%, transparent 50%)',
              backgroundSize: '20px 1px',
              backgroundRepeat: 'repeat-x',
            }}
          >
            {/* Stops (Dots) on the line */}
            <div className="absolute inset-0 flex items-center justify-between w-full px-[5%]">
              {timelineData.map((_, idx) => (
                <motion.div
                  key={idx}
                  className="w-4 h-4 rounded-full z-10 cursor-pointer"
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
                />
              ))}
            </div>
          </div>

          {/* The Sprite Character Container */}
          <motion.div
            className="absolute z-20"
            style={{
              top: '50%',
              marginTop: '-80px',
              marginLeft: '-32px',
            }}
            animate={{
              left: `${calculateManPosition()}%`,
            }}
            transition={{
              duration: 1,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <SpriteCharacter isWalking={isWalking} facingLeft={facingLeft} />
          </motion.div>
        </div>

        {/* Job Title */}
        <div className="text-center mb-12 min-h-[8rem] flex flex-col justify-center items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-2xl md:text-3xl font-light text-white mb-2">
                {titlePrefix}
              </h3>
              <h3 className="text-3xl md:text-5xl font-bold text-white">
                {titleSuffix}
              </h3>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full">
          {/* Left Side */}
          <div className="flex items-center gap-4 order-1 md:order-1">
            <span className="text-sm md:text-base font-bold text-white/60 tabular-nums font-pixel">
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

          {/* Center: Company Badge */}
          <div className="order-3 md:order-2 w-full md:w-auto flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0.5 }}
                transition={{ duration: 0.3 }}
                className="bg-[#222] border-2 border-[#D4FF00] text-[#D4FF00] rounded-sm px-6 py-4 flex items-center gap-4 min-w-[280px] justify-center transform transition-all duration-300 hover:translate-x-[2px] hover:translate-y-[2px]"
                style={{
                  boxShadow: '4px 4px 0px rgba(212, 255, 0, 0.3)',
                }}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  {currentItem.icon}
                </div>
                <span className="text-[0.6rem] md:text-xs font-bold tracking-tight font-pixel">
                  {currentItem.company}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4 order-2 md:order-3">
            <button
              onClick={() => navigate(1)}
              className="p-4 rounded-xl transition-all duration-200 bg-[#D4FF00] text-black hover:bg-[#b8dd00] cursor-pointer"
              style={{ boxShadow: '4px 4px 0px #ffffff' }}
              aria-label="Next position"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <span className="text-sm md:text-base font-bold text-white/60 tabular-nums font-pixel">
              {currentItem.endYear}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
