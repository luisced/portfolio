import React, { lazy, Suspense, useCallback, useRef, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Background from '../components/common/Background';
import './Home.css';

// Lazy load components for better performance
const LazySplineRoom = lazy(() => import('../components/common/SimpleSplineRoom'));

const HomePage: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();

  const aboutRef = useRef<HTMLDivElement>(null);
  
  // Handle scrolling to section when navigating from another page
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const sectionId = location.state.scrollTo;
      const section = document.getElementById(sectionId);
      if (section) {
        // Small delay to ensure the component is fully rendered
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      
      // Clear the state to prevent scrolling on page refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  const navigate = useNavigate();
  
  const goToAbout = useCallback(() => {
    navigate('/about');
  }, [navigate]);

  // Static text for developer title
  const developerTitle = " Full Stack Developer.";

  // Create dynamic typing sequence for the Smart [DynamicWord] part
  const createDynamicWordSequence = () => {
    const phrases = [
      'Beautiful Interfaces',
      'Robust APIs',
      'Scalable Products',
      'Intelligent Solutions',
      'Powerful Tools'
    ];
    const sequence: (string | number)[] = [];
    
    phrases.forEach((phrase) => {
      // Type the phrase
      sequence.push(phrase);
      sequence.push(1500); // Longer pause at the end for readability
      
      // Delete the phrase (one character at a time)
      for (let i = phrase.length; i > 0; i--) {
        sequence.push(phrase.substring(0, i - 1));
        sequence.push(30); // Small delay between backspaces
      }
      
      // Add a pause before the next phrase
      sequence.push(500);
    });
    
    return sequence;
  };

  return (
    <>
      <div className="home" id="home" data-theme={theme}>
        {/* Prioritize name rendering for better LCP */}
        <div className="presentation">
        <h1 className="name">Luis Cedillo Maldonado</h1>

          <h2 className="description">
            <span>{developerTitle}</span>
          </h2>
          
          <div className="tagline">
            <h2 className="tagline-text">Building Clean Code</h2>
            <h2 className="tagline-text">
              &amp; 
              <span className="dynamic-word">
                <TypeAnimation
                  sequence={createDynamicWordSequence()}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </span>
            </h2>
          </div>
          
          <p className="bio">
            I'm Luis, a developer from Mexico City crafting scalable backend systems and intuitive user experiences.
          </p>
          <button className="about-me" onClick={goToAbout} aria-label="About Me">
            ABOUT ME
          </button>
        </div>
        {/* Load Background after name is rendered */}
        <Background />
        
        {/* Lazy load 3D model with Suspense */}
        <div className="spline-container">
          <Suspense fallback={<div className="loading-spinner" />}>
            <LazySplineRoom />
          </Suspense>
        </div>
      </div>
      
      <div ref={aboutRef}>
        {/* This div is kept as a reference but no longer contains the About component */}
      </div>
    </>
  );
};

export default HomePage;
