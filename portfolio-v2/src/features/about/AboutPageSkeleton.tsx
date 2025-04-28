import React from 'react';
import BentoGridSkeleton from './components/BentoGridSkeleton';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import './AboutPageSkeleton.css';

const AboutPageSkeleton: React.FC = () => {
  return (
    <div className="about-page-skeleton">
      <div className="about-header-skeleton">
        <SkeletonLoader type="title" width="50%" height="3rem" className="about-title-skeleton" />
        <SkeletonLoader type="text" width="70%" count={2} className="about-subtitle-skeleton" />
      </div>
      <BentoGridSkeleton />
    </div>
  );
};

export default AboutPageSkeleton;
