import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';
import useKeyboard from '../../hooks/useKeyboard';
import './LanguageSwitcher.css';

interface Language {
  code: string;
  name: string;
}

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Available languages
  const languages: Language[] = [
    { code: 'en', name: t('language.en') },
    { code: 'es', name: t('language.es') }
  ];
  
  // Current language
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;
  
  // Handle language change
  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
    buttonRef.current?.focus();
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle keyboard navigation
  useKeyboard(
    {
      'Escape': () => {
        if (isOpen) {
          setIsOpen(false);
          buttonRef.current?.focus();
        }
      },
      'ArrowDown': (e) => {
        if (isOpen) {
          e.preventDefault();
          const focusableElements = dropdownRef.current?.querySelectorAll('button');
          const currentIndex = Array.from(focusableElements || []).findIndex(
            el => el === document.activeElement
          );
          
          if (currentIndex < (focusableElements?.length || 0) - 1) {
            (focusableElements?.[currentIndex + 1] as HTMLElement)?.focus();
          }
        }
      },
      'ArrowUp': (e) => {
        if (isOpen) {
          e.preventDefault();
          const focusableElements = dropdownRef.current?.querySelectorAll('button');
          const currentIndex = Array.from(focusableElements || []).findIndex(
            el => el === document.activeElement
          );
          
          if (currentIndex > 0) {
            (focusableElements?.[currentIndex - 1] as HTMLElement)?.focus();
          }
        }
      }
    },
    { enabled: true }
  );
  
  return (
    <div className="language-switcher" ref={dropdownRef}>
      <motion.button
        ref={buttonRef}
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('language.switchTo', { language: currentLanguage.name })}
        whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
        whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
      >
        <FaGlobe className="globe-icon" />
        <span className="current-language">{currentLanguage.code.toUpperCase()}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown className="chevron-icon" />
        </motion.span>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="language-dropdown"
            role="listbox"
            aria-label={t('language.switchTo', { language: currentLanguage.name })}
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.2 }
            }}
            exit={{ 
              opacity: 0, 
              y: -10,
              transition: { duration: 0.15 }
            }}
          >
            {languages.map((language) => (
              <motion.button
                key={language.code}
                className={`language-option ${language.code === i18n.language ? 'active' : ''}`}
                onClick={() => changeLanguage(language.code)}
                role="option"
                aria-selected={language.code === i18n.language}
                whileHover={!prefersReducedMotion ? { x: 5 } : {}}
                whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
              >
                {language.name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
