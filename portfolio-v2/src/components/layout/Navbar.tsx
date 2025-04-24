import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import { NavbarProps } from '../../types/components';
import { useTheme } from '../../contexts/ThemeContext';
import './Navbar.css';

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [linkClass, setLinkClass] = useState('default-link');
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

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

  const toggleNavbar = () => {
    setIsOpen(prev => !prev);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${className}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeNavbar}>
          LC
        </Link>
        
        <div className="navbar-controls">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
          
          <button
            className="hamburger"
            onClick={toggleNavbar}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        {isOpen && <div className="overlay" onClick={closeNavbar}></div>}
        
        <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <li>
            <Link 
              to="/" 
              className={`${linkClass} ${location.pathname === '/' ? 'active' : ''}`} 
              onClick={closeNavbar}
            >
              .home()
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={`${linkClass} ${location.pathname === '/about' ? 'active' : ''}`} 
              onClick={closeNavbar}
            >
              .about()
            </Link>
          </li>
          <li>
            <Link 
              to="/portfolio" 
              className={`${linkClass} ${location.pathname === '/portfolio' ? 'active' : ''}`} 
              onClick={closeNavbar}
            >
              .portfolio()
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={`${linkClass} ${location.pathname === '/contact' ? 'active' : ''}`} 
              onClick={closeNavbar}
            >
              .contact()
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
