import React from 'react';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import './HomePageSkeleton.css';

const HomePageSkeleton: React.FC = () => {
  return (
    <div className="home-skeleton">
      <div className="presentation-skeleton">
        <SkeletonLoader type="title" width="70%" height="4rem" className="name-skeleton" />
        <SkeletonLoader type="title" width="50%" height="2rem" className="description-skeleton" />
        <div className="tagline-skeleton">
          <SkeletonLoader type="text" width="80%" height="1.5rem" />
          <SkeletonLoader type="text" width="60%" height="1.5rem" />
        </div>
        <SkeletonLoader type="text" count={3} className="bio-skeleton" />
        <SkeletonLoader type="button" className="button-skeleton" />
      </div>
      <div className="spline-container-skeleton">
        <SkeletonLoader type="thumbnail" width="100%" height="400px" className="model-skeleton" />
      </div>
    </div>
  );
};

export default HomePageSkeleton;
