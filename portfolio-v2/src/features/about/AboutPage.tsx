import React, { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import './AboutPage.css';
import Background from '../../components/common/Background';
import SectionContainer from '../../components/common/SectionContainer';
import AppWindow from '../../components/common/AppWindow';
import BentoGrid from './components/BentoGrid';
import CardTilt from './components/CardTilt';
import Timeline from './components/Timeline';

const Spline = lazy(() => import('@splinetool/react-spline'));

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="about-page">
      <Background />
      <div className="page-container">
        <section id="about" className="about-section">
          <SectionContainer title={t('about.title')}>
            <AppWindow id="app-window">
              {/* Bento Grid Layout */}
              <div className="bento-container">
                <BentoGrid />
                <CardTilt />
              </div>
            </AppWindow>
          </SectionContainer>
          
          {/* Timeline Component */}
          <SectionContainer title={t('about.experience')} className="timeline-section">
            <Timeline />
          </SectionContainer>
          
          {/* 3D Model */}
          <section className="happy-mac" id="happy-mac">
            <div 
              className="happy-mac-interactive"
              title={t('about.portfolioLink')}
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
      </div>
    </div>
  );
};

export default AboutPage;
