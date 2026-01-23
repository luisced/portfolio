'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import {
  Code2,
  Database,
  Smartphone,
  Cloud,
  GitBranch,
  Zap,
  Layers,
  Terminal,
} from 'lucide-react';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Skill {
  name: string;
  icon: React.ReactNode;
  level: number; // 0-100
  category: string;
}

const skillsData: Skill[] = [
  // Frontend
  { name: 'React & Next.js', icon: <Code2 className="w-6 h-6" />, level: 95, category: 'Frontend' },
  { name: 'TypeScript', icon: <Terminal className="w-6 h-6" />, level: 90, category: 'Frontend' },
  { name: 'Tailwind CSS', icon: <Layers className="w-6 h-6" />, level: 92, category: 'Frontend' },
  
  // Backend
  { name: 'Node.js', icon: <Zap className="w-6 h-6" />, level: 88, category: 'Backend' },
  { name: 'Python', icon: <Code2 className="w-6 h-6" />, level: 85, category: 'Backend' },
  { name: 'Databases', icon: <Database className="w-6 h-6" />, level: 87, category: 'Backend' },
  
  // Mobile & Cloud
  { name: 'React Native', icon: <Smartphone className="w-6 h-6" />, level: 82, category: 'Mobile' },
  { name: 'AWS & Cloud', icon: <Cloud className="w-6 h-6" />, level: 80, category: 'DevOps' },
  { name: 'Git & CI/CD', icon: <GitBranch className="w-6 h-6" />, level: 90, category: 'DevOps' },
];

export function SkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const skillsGridRef = useRef<HTMLDivElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states - everything hidden
      gsap.set(headingRef.current, { opacity: 0, y: 30 });
      
      const skillCards = skillsGridRef.current?.querySelectorAll('.skill-card');
      gsap.set(skillCards, { opacity: 0, y: 50, scale: 0.9 });

      // Entrance animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        },
      });

      // Animate heading
      tl.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      });

      // Animate skill cards with stagger
      tl.to(
        skillCards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: {
            amount: 0.6,
            from: 'start',
            ease: 'power2.out',
          },
        },
        '-=0.3'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20 px-4"
      style={{ backgroundColor: '#141414' }}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Heading */}
        <h2
          ref={headingRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-16 font-pixel"
          style={{ color: '#D4FF00' }}
        >
          MY SKILLS
        </h2>

        {/* Skills Grid */}
        <div
          ref={skillsGridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {skillsData.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="skill-card relative"
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div
                className="relative bg-[#1a1a1a] border-2 rounded-lg p-6 h-full cursor-pointer transition-all duration-300"
                style={{
                  borderColor: hoveredSkill === skill.name ? '#D4FF00' : '#333',
                  boxShadow:
                    hoveredSkill === skill.name
                      ? '8px 8px 0px rgba(212, 255, 0, 0.3)'
                      : '4px 4px 0px rgba(51, 51, 51, 0.3)',
                }}
              >
                {/* Category Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className="text-[0.6rem] px-2 py-1 rounded font-pixel"
                    style={{
                      backgroundColor: hoveredSkill === skill.name ? '#D4FF00' : '#333',
                      color: hoveredSkill === skill.name ? '#000' : '#888',
                    }}
                  >
                    {skill.category}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className="mb-4 transition-colors duration-300"
                  style={{
                    color: hoveredSkill === skill.name ? '#D4FF00' : '#fff',
                  }}
                >
                  {skill.icon}
                </div>

                {/* Skill Name */}
                <h3
                  className="text-xl md:text-2xl font-bold mb-4 transition-colors duration-300"
                  style={{
                    color: hoveredSkill === skill.name ? '#D4FF00' : '#fff',
                  }}
                >
                  {skill.name}
                </h3>

                {/* Progress Bar */}
                <div className="relative w-full h-3 bg-[#0a0a0a] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#D4FF00' }}
                    initial={{ width: 0 }}
                    animate={{
                      width: hoveredSkill === skill.name ? `${skill.level}%` : `${skill.level * 0.8}%`,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                  
                  {/* Pixelated effect overlay */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                    }}
                  />
                </div>

                {/* Level Indicator */}
                <div className="mt-2 text-right">
                  <span
                    className="text-xs font-pixel transition-colors duration-300"
                    style={{
                      color: hoveredSkill === skill.name ? '#D4FF00' : '#666',
                    }}
                  >
                    {skill.level}%
                  </span>
                </div>

                {/* Pixel corners decoration */}
                <div
                  className="absolute top-0 left-0 w-2 h-2 transition-colors duration-300"
                  style={{
                    backgroundColor: hoveredSkill === skill.name ? '#D4FF00' : '#333',
                  }}
                />
                <div
                  className="absolute top-0 right-0 w-2 h-2 transition-colors duration-300"
                  style={{
                    backgroundColor: hoveredSkill === skill.name ? '#D4FF00' : '#333',
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 w-2 h-2 transition-colors duration-300"
                  style={{
                    backgroundColor: hoveredSkill === skill.name ? '#D4FF00' : '#333',
                  }}
                />
                <div
                  className="absolute bottom-0 right-0 w-2 h-2 transition-colors duration-300"
                  style={{
                    backgroundColor: hoveredSkill === skill.name ? '#D4FF00' : '#333',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="mt-16 text-center">
          <p className="text-sm md:text-base text-white/40 font-pixel">
            ALWAYS LEARNING, ALWAYS BUILDING
          </p>
        </div>
      </div>
    </section>
  );
}


