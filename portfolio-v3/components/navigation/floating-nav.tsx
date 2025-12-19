'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const sections = ['hero', 'projects', 'about', 'contact'] as const;

export function FloatingNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const t = useTranslations('navigation');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-50% 0px -50% 0px',
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      className="fixed right-8 top-1/2 z-40 -translate-y-1/2 hidden lg:flex flex-col gap-4"
      aria-label="Main navigation"
    >
      {sections.map((section) => (
        <button
          key={section}
          onClick={() => scrollToSection(section)}
          aria-current={activeSection === section ? 'page' : undefined}
          aria-label={t(section)}
          className="group flex items-center gap-3"
        >
          <span
            className={cn(
              'text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200',
              activeSection === section && 'opacity-100'
            )}
          >
            {t(section)}
          </span>
          <div
            className={cn(
              'size-3 rounded-full border-2 border-foreground/30 transition-all duration-200',
              activeSection === section && 'scale-125 border-primary bg-primary'
            )}
          />
        </button>
      ))}
    </nav>
  );
}
