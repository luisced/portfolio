import React, { lazy, Suspense } from 'react';
import './About.css';
import BentoGrid from './BentoGrid';
import CardTilt from './CardTilt';
import Timeline from './Timeline';

// We'll need to create these components or import them from the appropriate location
const Spline = lazy(() => import('@splinetool/react-spline'));

interface AboutProps {
  id?: string;
}

const About: React.FC<AboutProps> = ({ id }) => {
  return (
    <section id={id || 'about'} className="about-section">
      <h2 className="section-title"><span className="code-tag">&lt;/</span>About Me<span className="code-tag">&gt;</span></h2>

      <div className="app-window" id="app-window">
        <div className="header">
          <div className="menu-circle"></div>
          <div className="header-menu"></div>
        </div>
        
        
        
        {/* Bento Grid Layout */}
        <div className="bento-container">
          <BentoGrid />
          <CardTilt />
        </div>
        
        {/* <Suspense fallback={<div>Loading...</div>}>
          <Intro />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <Details />
        </Suspense> */}
      </div>
        {/* Timeline Component */}
        <section className="timeline-section">
          <h2 className="section-title"><span className="code-tag">&lt;/</span>Professional Experience<span className="code-tag">&gt;</span></h2>
          <Timeline />
        </section>
        {/* 3D Model */}
        <section className="happy-mac" id="happy-mac">
          <div 
            className="happy-mac-interactive"
            title="Click to visit my Portfolio"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.open('https://github.com/luisced', '_blank');
              }
            }}
          >
            <Suspense fallback={<div className="loading-spinner"></div>}>
              <Spline scene="/assets/models/happy_mac.splinecode" />
            </Suspense>
          </div>
        </section>
    </section>
  );
};

export default About;
