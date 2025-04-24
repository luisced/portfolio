import React from 'react';
import Background from '../components/common/Background';
import SectionContainer from '../components/common/SectionContainer';
import AppWindow from '../components/common/AppWindow';
import ProjectList from '../features/portfolio/ProjectList';
import './Portfolio.css';

const PortfolioPage: React.FC = () => {
  return (
    <div className="portfolio-page">
      <Background />
      <div className="page-container">
        <SectionContainer title="Portfolio">
          <AppWindow id="portfolio-window">
            <ProjectList />
          </AppWindow>
        </SectionContainer>
      </div>
    </div>
  );
};

export default PortfolioPage;
