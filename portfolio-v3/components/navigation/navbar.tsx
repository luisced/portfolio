'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Home, Briefcase, User, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';

const sections = ['hero', 'projects', 'about', 'contact'] as const;

const sectionIcons = {
  hero: Home,
  projects: Briefcase,
  about: User,
  contact: Mail,
} as const;

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const t = useTranslations('navigation');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        threshold: 0.3,
        rootMargin: '-20% 0px -50% 0px',
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
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      >
        <nav
          className={cn(
            'transition-all duration-300',
            isScrolled || isOpen
              ? 'bg-background/80 backdrop-blur-md border-b border-border/30 shadow-sm'
              : 'bg-transparent'
          )}
        >
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo / Profile */}
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-3 group"
            >
              <div className="size-9 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-primary-foreground font-bold text-sm transition-transform duration-200 group-hover:scale-105">
                LC
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-medium text-foreground">Luis Cedillo</span>
                <div className="flex items-center gap-1.5">
                  <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">Open for work</span>
                </div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    'hover:bg-foreground/5',
                    activeSection === section
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t(section)}
                  {activeSection === section && (
                    <motion.div
                      layoutId="activeSection"
                      className="h-0.5 bg-primary mt-1 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={cn(
                  'flex size-9 items-center justify-center rounded-lg transition-all duration-200',
                  'hover:bg-foreground/5 text-muted-foreground hover:text-foreground'
                )}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  'md:hidden flex size-9 items-center justify-center rounded-lg transition-all duration-200',
                  'hover:bg-foreground/5 text-muted-foreground hover:text-foreground'
                )}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Content */}
            <motion.nav
              className="fixed top-16 left-0 right-0 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
              aria-label="Mobile navigation menu"
            >
              <div className="bg-background/80 backdrop-blur-md border-b border-border/30 shadow-lg">
                <div className="container mx-auto px-4 py-4">
                  <div className="flex flex-col gap-1">
                    {sections.map((section, index) => {
                      const Icon = sectionIcons[section];
                      return (
                        <motion.button
                          key={section}
                          onClick={() => scrollToSection(section)}
                          className={cn(
                            'w-full text-left px-4 py-3 rounded-lg transition-all duration-200',
                            'hover:bg-foreground/5',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                            'flex items-center gap-3',
                            activeSection === section
                              ? 'text-foreground bg-foreground/5'
                              : 'text-muted-foreground'
                          )}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Icon className="size-5" />
                          <span className="text-base font-medium">{t(section)}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

