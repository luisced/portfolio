'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
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
import { gsap, prefersReducedMotion } from '@/lib/gsap';

interface Skill {
  nameKey: string;
  icon: React.ReactNode;
  level: number; // 0-100
  categoryKey: string;
}

const skillsDataKeys: Skill[] = [
  // Frontend
  { nameKey: 'reactNextjs', icon: <Code2 className="size-6" />, level: 95, categoryKey: 'frontend' },
  { nameKey: 'typescript', icon: <Terminal className="size-6" />, level: 90, categoryKey: 'frontend' },
  { nameKey: 'tailwind', icon: <Layers className="size-6" />, level: 92, categoryKey: 'frontend' },
  
  // Backend
  { nameKey: 'nodejs', icon: <Zap className="size-6" />, level: 88, categoryKey: 'backend' },
  { nameKey: 'python', icon: <Code2 className="size-6" />, level: 85, categoryKey: 'backend' },
  { nameKey: 'databases', icon: <Database className="size-6" />, level: 87, categoryKey: 'backend' },
  
  // Mobile & Cloud
  { nameKey: 'reactNative', icon: <Smartphone className="size-6" />, level: 82, categoryKey: 'mobile' },
  { nameKey: 'awsCloud', icon: <Cloud className="size-6" />, level: 80, categoryKey: 'devops' },
  { nameKey: 'gitCicd', icon: <GitBranch className="size-6" />, level: 90, categoryKey: 'devops' },
];

export function SkillsSection() {
  const t = useTranslations('skills');
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const skillsGridRef = useRef<HTMLDivElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      // Initial states - everything hidden
      gsap.set(headingRef.current, { opacity: 0, y: 30 });
      
      const skillCards = skillsGridRef.current?.querySelectorAll('.skill-card');
      if (skillCards) {
        gsap.set(skillCards, { opacity: 0, y: 50, scale: 0.9 });
      }

      if (reduced) {
        // Skip animations, show final state
        if (headingRef.current) gsap.set(headingRef.current, { opacity: 1, y: 0 });
        if (skillCards) gsap.set(skillCards, { opacity: 1, y: 0, scale: 1 });
        return;
      }

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
      if (skillCards) {
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
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20 px-4 bg-background"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Heading */}
        <h2
          ref={headingRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-16 font-pixel text-brand"
        >
          {t('heading')}
        </h2>

        {/* Skills Grid */}
        <div
          ref={skillsGridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {skillsDataKeys.map((skill, index) => {
            const skillName = t(`names.${skill.nameKey}`);
            const category = t(`categories.${skill.categoryKey}`);
            return (
            <div
              key={skillName}
              className="skill-card relative"
              onMouseEnter={() => setHoveredSkill(skillName)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div
                className={`relative bg-card border-2 rounded-lg p-6 h-full cursor-pointer transition-all duration-300 ${
                  hoveredSkill === skillName 
                    ? 'border-brand shadow-pixel-brand' 
                    : 'border-border shadow-pixel'
                }`}
              >
                {/* Category Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`text-[0.6rem] px-2 py-1 rounded font-pixel transition-colors duration-300 ${
                      hoveredSkill === skillName
                        ? 'bg-brand text-black'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {category}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`mb-4 transition-colors duration-300 ${
                    hoveredSkill === skillName ? 'text-brand' : 'text-foreground'
                  }`}
                >
                  {skill.icon}
                </div>

                {/* Skill Name */}
                <h3
                  className={`text-xl md:text-2xl font-bold mb-4 transition-colors duration-300 ${
                    hoveredSkill === skillName ? 'text-brand' : 'text-foreground'
                  }`}
                >
                  {skillName}
                </h3>

                {/* Progress Bar */}
                <div
                  className="relative w-full h-3 bg-muted rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={skill.level}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${skillName} proficiency: ${skill.level}%`}
                >
                  <motion.div
                    className="h-full rounded-full bg-brand"
                    initial={{ width: 0 }}
                    animate={{
                      width: hoveredSkill === skillName ? `${skill.level}%` : `${skill.level * 0.8}%`,
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
                    className={`text-xs font-pixel transition-colors duration-300 ${
                      hoveredSkill === skillName ? 'text-brand' : 'text-muted-foreground'
                    }`}
                  >
                    {skill.level}%
                  </span>
                </div>

                {/* Pixel corners decoration */}
                <div
                  className={`absolute top-0 left-0 w-2 h-2 transition-colors duration-300 ${
                    hoveredSkill === skillName ? 'bg-brand' : 'bg-border'
                  }`}
                />
                <div
                  className={`absolute top-0 right-0 w-2 h-2 transition-colors duration-300 ${
                    hoveredSkill === skillName ? 'bg-brand' : 'bg-border'
                  }`}
                />
                <div
                  className={`absolute bottom-0 left-0 w-2 h-2 transition-colors duration-300 ${
                    hoveredSkill === skillName ? 'bg-brand' : 'bg-border'
                  }`}
                />
                <div
                  className={`absolute bottom-0 right-0 w-2 h-2 transition-colors duration-300 ${
                    hoveredSkill === skillName ? 'bg-brand' : 'bg-border'
                  }`}
                />
                </div>
              </motion.div>
            </div>
          );})}
        </div>

        {/* Bottom decoration */}
        <div className="mt-16 text-center">
          <p className="text-sm md:text-base text-muted-foreground font-pixel">
            {t('tagline')}
          </p>
        </div>
      </div>
    </section>
  );
}


