'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, Github } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

interface Project {
  id: string;
  title: string;
  role: string;
  shortDescription: string;
  category: string;
  previewImage: string;
  technologies: string[];
  url: string;
  github: string;
}

const projects: Project[] = [
  {
    id: '01',
    title: 'Dermaware - Genesis',
    role: 'Development lead \u2022 Full-stack developer',
    shortDescription: 'Mobile app for skin health tracking with AI-powered recommendations and dermatologist consultations.',
    category: 'Mobile - iOS',
    previewImage: '/projects/genesis/dermaware.webp',
    technologies: ['SwiftUI', 'Flask', 'Python', 'SQLite', 'AWS'],
    url: '',
    github: 'https://github.com/ios-lab-up/Genesis-API',
  },
  {
    id: '02',
    title: 'Homecare - Nemesis',
    role: 'Team lead \u2022 Backend developer',
    shortDescription: 'Energy monitoring app using computer vision to analyze consumption and provide AI-powered saving recommendations.',
    category: 'Mobile - iOS',
    previewImage: '/projects/homecare/homecare_preview.webp',
    technologies: ['SwiftUI', 'Django', 'Python', 'PostgreSQL', 'Computer Vision', 'Docker'],
    url: '',
    github: 'https://github.com/ios-lab-up/Homecare-Back',
  },
  {
    id: '03',
    title: 'Oxxo Corner - Femsa',
    role: 'Product Owner \u2022 Full-stack developer',
    shortDescription: 'Augmented reality retail app enhancing the shopping experience with AR navigation and AI product recommendations.',
    category: 'Mobile - iOS',
    previewImage: '/projects/oxxocorner/oxxocorner_preview.webp',
    technologies: ['SwiftUI', 'Flask', 'ARKit', 'CoreML', 'Generative AI', 'Docker'],
    url: '',
    github: 'https://github.com/example/oxxocorner',
  },
  {
    id: '04',
    title: 'UPocket',
    role: 'Full-stack developer',
    shortDescription: 'Student-focused mobile app that centralizes academic information like class schedules, grades, and attendance.',
    category: 'Mobile - Frontend',
    previewImage: '/projects/upocket/upocket_preview.webp',
    technologies: ['FastAPI', 'Python', 'PostgreSQL', 'SwiftUI', 'Kubernetes', 'Docker'],
    url: '',
    github: 'https://github.com/ios-lab-up/UPOCKET',
  },
  {
    id: '05',
    title: 'StackUp - Channel Manager',
    role: 'Backend developer',
    shortDescription: 'Web platform for managing hotel listings, pricing, and availability across multiple travel agencies.',
    category: 'Web - Admin System',
    previewImage: '/projects/stackup/stackup_preview.webp',
    technologies: ['Svelte', 'Javascript', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS'],
    url: 'https://flowlink.stack-up.com/',
    github: 'https://github.com/NyxTech/stackup-backend',
  },
];

export function ProjectsSection() {
  const t = useTranslations('projects');
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { opacity: 0, y: 30 });

      const cards = cardsRef.current?.querySelectorAll('.project-card');
      if (cards) gsap.set(cards, { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 75%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
      });

      if (cards) {
        tl.to(
          cards,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
          },
          '-=0.4'
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full py-32 px-4 bg-background"
      aria-labelledby="projects-heading"
    >
      <div className="container mx-auto max-w-5xl">
        {/* Heading */}
        <div ref={headingRef} className="mb-20">
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-4">
            {t('subtitle')}
          </p>
          <h2
            id="projects-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground"
          >
            {t('title')}
          </h2>
        </div>

        {/* Projects List */}
        <div ref={cardsRef} className="flex flex-col">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="project-card"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`group relative border-t border-border py-8 md:py-10 transition-colors duration-300 ${
                  hoveredIndex === index ? 'border-t-primary' : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
                  {/* Left: Preview Image */}
                  <div className="relative w-full lg:w-[240px] h-[160px] lg:h-[140px] shrink-0 rounded-lg overflow-hidden bg-card">
                    <Image
                      src={project.previewImage}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 240px"
                    />
                  </div>

                  {/* Middle: Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4 mb-2">
                      <span className="text-sm font-mono text-muted-foreground mt-0.5 shrink-0">
                        {project.id}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">{project.role}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-lg pl-10">
                      {project.shortDescription}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4 pl-10">
                      {project.technologies.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground transition-colors duration-300 group-hover:border-primary/30 group-hover:text-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Links */}
                  <div className="flex lg:flex-col items-center lg:items-end gap-3 shrink-0 pl-10 lg:pl-0">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        aria-label={`${t('viewCode')} - ${project.title}`}
                      >
                        <Github className="size-4" />
                        <span className="hidden sm:inline">{t('viewCode')}</span>
                      </a>
                    )}
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        aria-label={`${t('viewProject')} - ${project.title}`}
                      >
                        <ArrowUpRight className="size-4" />
                        <span className="hidden sm:inline">{t('viewProject')}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Hover arrow indicator */}
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-primary hidden lg:block"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    x: hoveredIndex === index ? 0 : -10,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowUpRight className="size-6" />
                </motion.div>
              </div>
            </div>
          ))}

          {/* Bottom border for last item */}
          <div className="border-t border-border" />
        </div>
      </div>
    </section>
  );
}
