import React from 'react';
import Background from '../components/common/Background';
import ProjectList from '../features/portfolio/ProjectList';
import './Portfolio.css';

const PortfolioPage: React.FC = () => {
  return (
    <div className="portfolio-page">
      <Background />
      <div className="page-container">
        <h2 className="section-title"><span className="code-tag">&lt;/</span>Portfolio<span className="code-tag">&gt;</span></h2>
        <div className="app-window" id="portfolio-window">
          <div className="header">
            <div className="menu-circle"></div>
            <div className="header-menu"></div>
          </div>
          <ProjectList />
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
