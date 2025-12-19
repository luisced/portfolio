'use client';

import { useState } from 'react';
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

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('navigation');
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 lg:hidden"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="glass border-b border-border">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Profile Section */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-primary-foreground font-bold">
                LC
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Luis Cedillo</span>
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Open for work</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex size-10 items-center justify-center rounded-lg glass hover:glass-strong transition-all duration-200"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="size-5 text-foreground" />
                ) : (
                  <Sun className="size-5 text-foreground" />
                )}
              </button>

              {/* Hamburger Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex size-10 items-center justify-center rounded-lg glass hover:glass-strong transition-all duration-200"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <X className="size-5 text-foreground" />
                ) : (
                  <Menu className="size-5 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Slide-down Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Content */}
            <motion.nav
              className="fixed top-16 left-0 right-0 z-40 lg:hidden"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
              aria-label="Mobile navigation menu"
            >
              <div className="glass-strong border-b border-border shadow-xl">
                <div className="container mx-auto px-4 py-6">
                  <div className="flex flex-col gap-1">
                    {sections.map((section, index) => {
                      const Icon = sectionIcons[section];
                      return (
                        <motion.button
                          key={section}
                          onClick={() => scrollToSection(section)}
                          className={cn(
                            'w-full text-left px-4 py-3 rounded-lg transition-all duration-200',
                            'hover:bg-accent/50 hover:text-accent-foreground',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                            'flex items-center gap-3'
                          )}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Icon className="size-5 text-muted-foreground" />
                          <span className="text-base font-medium">{t(section)}</span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Optional: Social Links or Actions */}
                  <motion.div
                    className="mt-6 pt-6 border-t border-border"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                      Connect
                    </p>
                    <div className="flex gap-3">
                      {/* Add social links here if needed */}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
