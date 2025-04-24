import React, { lazy, Suspense } from 'react';
import './About.css';
import SectionContainer from '../../components/common/SectionContainer';
import AppWindow from '../../components/common/AppWindow';
import BentoGrid from './BentoGrid';
import CardTilt from './CardTilt';
import Timeline from './Timeline';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface AboutProps {
  id?: string;
}

const About: React.FC<AboutProps> = ({ id }) => {
  return (
    <section id={id || 'about'} className="about-section">
      <SectionContainer title="About Me">
        <AppWindow id="app-window">
          {/* Bento Grid Layout */}
          <div className="bento-container">
            <BentoGrid />
            <CardTilt />
          </div>
        </AppWindow>
      </SectionContainer>
      
      {/* Timeline Component */}
      <SectionContainer title="Professional Experience" className="timeline-section">
        <Timeline />
      </SectionContainer>
      
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
