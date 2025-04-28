import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import { NavbarProps } from '../../types/components';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useKeyboard from '../../hooks/useKeyboard';
import LanguageSwitcher from '../common/LanguageSwitcher';
import './Navbar.css';

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [linkClass, setLinkClass] = useState('default-link');
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const navLinksRef = useRef<HTMLUListElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const themeToggleRef = useRef<HTMLButtonElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update link style based on current route
  useEffect(() => {
    if (location.pathname === '/portfolio' || location.pathname === '/about') {
      setLinkClass('portfolio-link');
    } else {
      setLinkClass('default-link');
    }
    
  }, [location.pathname]);

  // Check if user prefers reduced motion
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;

  // Handle keyboard navigation
  useKeyboard(
    {
      'Escape': () => {
        if (isOpen) {
          setIsOpen(false);
          hamburgerRef.current?.focus();
        }
      },
      'Tab': (e) => {
        // If navbar is open and Tab is pressed without Shift, and we're on the last element,
        // loop back to the first element
        if (isOpen && !e.shiftKey && document.activeElement === navLinksRef.current?.lastElementChild?.lastElementChild) {
          e.preventDefault();
          hamburgerRef.current?.focus();
        }
        
        // If navbar is open and Tab is pressed with Shift, and we're on the first element,
        // loop back to the last element
        if (isOpen && e.shiftKey && document.activeElement === hamburgerRef.current) {
          e.preventDefault();
          const lastLink = navLinksRef.current?.lastElementChild?.lastElementChild as HTMLElement;
          lastLink?.focus();
        }
      }
    },
    { enabled: true }
  );
  
  // Add keyboard shortcuts for navigation
  useKeyboard(
    {
      'Alt+1': () => window.location.href = '/',
      'Alt+2': () => window.location.href = '/about',
      'Alt+3': () => window.location.href = '/portfolio',
      'Alt+4': () => window.location.href = '/contact',
      'Alt+t': () => toggleTheme(),
    },
    { preventDefault: true }
  );

  const toggleNavbar = () => {
    setIsOpen(prev => !prev);
    
    // When opening the navbar, focus the first link after a short delay
    // to allow the animation to start
    if (!isOpen) {
      setTimeout(() => {
        const firstLink = navLinksRef.current?.firstElementChild?.firstElementChild as HTMLElement;
        firstLink?.focus();
      }, 100);
    }
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'scrolled' : ''} ${className}`}
      initial={{ y: -100 }}
      animate={{ 
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }
      }}
    >
      <div className="navbar-container">
        <Link 
          to="/" 
          className="navbar-logo" 
          onClick={closeNavbar}
          aria-label="Home"
        >
          <motion.span
            whileHover={!prefersReducedMotion ? { scale: 1.1 } : {}}
            whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
          >
            LC
          </motion.span>
        </Link>
        
        <div className="navbar-controls">
          <div className="navbar-actions">
            <LanguageSwitcher />
            <motion.button 
              ref={themeToggleRef}
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode (Alt+T)`}
              whileHover={!prefersReducedMotion ? { scale: 1.1 } : {}}
              whileTap={!prefersReducedMotion ? { scale: 0.9 } : {}}
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </motion.button>
          </div>
          
          <motion.button
            ref={hamburgerRef}
            className="hamburger"
            onClick={toggleNavbar}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="navbar-links"
            whileHover={!prefersReducedMotion ? { scale: 1.1 } : {}}
            whileTap={!prefersReducedMotion ? { scale: 0.9 } : {}}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
        </div>
        
        {isOpen && <div className="overlay" onClick={closeNavbar}></div>}
        
        <ul 
          ref={navLinksRef}
          id="navbar-links"
          className={`navbar-links ${isOpen ? 'active' : ''}`}
          role="menu"
        >
          <li role="none">
            <motion.div
              whileHover={!prefersReducedMotion ? { x: 5 } : {}}
              whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
            >
              <Link 
                to="/" 
                className={`${linkClass} ${location.pathname === '/' ? 'active' : ''}`} 
                onClick={closeNavbar}
                role="menuitem"
                aria-current={location.pathname === '/' ? 'page' : undefined}
                aria-label={`${t('navigation.home')} (Alt+1)`}
              >
                .{t('navigation.home').toLowerCase()}()
              </Link>
            </motion.div>
          </li>
          <li role="none">
            <motion.div
              whileHover={!prefersReducedMotion ? { x: 5 } : {}}
              whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
            >
              <Link 
                to="/about" 
                className={`${linkClass} ${location.pathname === '/about' ? 'active' : ''}`} 
                onClick={closeNavbar}
                role="menuitem"
                aria-current={location.pathname === '/about' ? 'page' : undefined}
                aria-label={`${t('navigation.about')} (Alt+2)`}
              >
                .{t('navigation.about').toLowerCase()}()
              </Link>
            </motion.div>
          </li>
          <li role="none">
            <motion.div
              whileHover={!prefersReducedMotion ? { x: 5 } : {}}
              whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
            >
              <Link 
                to="/portfolio" 
                className={`${linkClass} ${location.pathname === '/portfolio' ? 'active' : ''}`} 
                onClick={closeNavbar}
                role="menuitem"
                aria-current={location.pathname === '/portfolio' ? 'page' : undefined}
                aria-label={`${t('navigation.portfolio')} (Alt+3)`}
              >
                .{t('navigation.portfolio').toLowerCase()}()
              </Link>
            </motion.div>
          </li>
          <li role="none">
            <motion.div
              whileHover={!prefersReducedMotion ? { x: 5 } : {}}
              whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
            >
              <Link 
                to="/contact" 
                className={`${linkClass} ${location.pathname === '/contact' ? 'active' : ''}`} 
                onClick={closeNavbar}
                role="menuitem"
                aria-current={location.pathname === '/contact' ? 'page' : undefined}
                aria-label={`${t('navigation.contact')} (Alt+4)`}
              >
                .{t('navigation.contact').toLowerCase()}()
              </Link>
            </motion.div>
          </li>
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;
