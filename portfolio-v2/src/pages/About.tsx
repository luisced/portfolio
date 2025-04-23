import React from 'react';
import Background from '../components/common/Background';
import AboutFeature from '../features/about/About';
import './About.css';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <Background />
      <div className="page-container">
        <AboutFeature />
      </div>
    </div>
  );
};

export default AboutPage;
