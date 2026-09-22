'use client';

import { useTranslations } from 'next-intl';
import { Github, Linkedin, Twitter, ArrowUp } from 'lucide-react';

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/luisced',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/luis-cedillo',
    icon: Linkedin,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/luisced',
    icon: Twitter,
  },
];

export function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Luis Cedillo. {t('copyright')}.
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={link.name}
                >
                  <Icon className="size-5" />
                </a>
              );
            })}
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label={t('backToTop')}
          >
            {t('backToTop')}
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
