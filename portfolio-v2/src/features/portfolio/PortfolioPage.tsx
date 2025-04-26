import React from 'react';
import { useTranslation } from 'react-i18next';
import Background from '../../components/common/Background';
import SectionContainer from '../../components/common/SectionContainer';
import AppWindow from '../../components/common/AppWindow';
import ProjectList from './components/ProjectList';
import './PortfolioPage.css';

const PortfolioPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="portfolio-page">
      <Background />
      <div className="page-container">
        <SectionContainer title={t('portfolio.title')}>
          <AppWindow id="portfolio-window">
            <ProjectList />
          </AppWindow>
        </SectionContainer>
      </div>
    </div>
  );
};

export default PortfolioPage;
