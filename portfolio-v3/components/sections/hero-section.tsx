'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('hero');
  const prefersReducedMotion = useReducedMotion();

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.33, 1, 0.68, 1] as const,
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-svh items-center justify-center overflow-hidden pt-16 lg:pt-0"
      aria-labelledby="hero-heading"
    >
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-chart-2/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </div>

      {/* Content */}
      <motion.div
        className="container mx-auto px-4 md:px-6 lg:px-8 text-center"
        variants={prefersReducedMotion ? {} : containerVariants}
        initial={prefersReducedMotion ? false : 'hidden'}
        animate={prefersReducedMotion ? false : 'visible'}
      >
        <motion.div variants={prefersReducedMotion ? {} : itemVariants}>
          <h1 id="hero-heading" className="sr-only">
            {t('greeting')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4" aria-hidden="true">
            {t('greeting')}
          </p>
        </motion.div>

        <motion.h2
          variants={prefersReducedMotion ? {} : itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 gradient-text"
        >
          {t('title')}
        </motion.h2>

        <motion.p
          variants={prefersReducedMotion ? {} : itemVariants}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          {t('tagline')}
        </motion.p>

        <motion.button
          variants={prefersReducedMotion ? {} : itemVariants}
          onClick={scrollToProjects}
          className="inline-flex items-center gap-2 rounded-lg glass hover:glass-strong px-6 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-1"
        >
          {t('cta')}
          <ChevronDown className="size-4" />
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={prefersReducedMotion ? false : { opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <button
          onClick={scrollToProjects}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          aria-label={t('scrollIndicator')}
        >
          <span className="text-sm">{t('scrollIndicator')}</span>
          <ChevronDown className="size-6 animate-bounce-slow group-hover:text-primary" />
        </button>
      </motion.div>
    </section>
  );
}
