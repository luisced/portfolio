import React from 'react';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import './PortfolioPageSkeleton.css';

const PortfolioPageSkeleton: React.FC = () => {
  return (
    <div className="portfolio-page-skeleton">
      <div className="page-container-skeleton">
        <div className="section-container-skeleton">
          <SkeletonLoader type="title" width="30%" className="section-title-skeleton" />
          <div className="app-window-skeleton">
            <div className="app-window-header-skeleton">
              <SkeletonLoader type="circle" width="12px" height="12px" />
            </div>
            <div className="project-list-skeleton">
              <div className="filter-section-skeleton">
                <SkeletonLoader type="title" width="40%" height="1.5rem" />
                <div className="filter-buttons-skeleton">
                  {[1, 2, 3, 4].map((i) => (
                    <SkeletonLoader key={i} type="button" width="80px" height="32px" />
                  ))}
                </div>
              </div>
              <div className="project-grid-skeleton">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="project-card-skeleton">
                    <SkeletonLoader type="thumbnail" className="project-image-skeleton" />
                    <SkeletonLoader type="title" width="70%" className="project-title-skeleton" />
                    <SkeletonLoader type="text" width="50%" className="project-role-skeleton" />
                    <SkeletonLoader type="text" count={2} className="project-description-skeleton" />
                    <div className="project-tech-skeleton">
                      {[1, 2, 3].map((j) => (
                        <SkeletonLoader key={j} type="circle" width="24px" height="24px" />
                      ))}
                    </div>
                    <SkeletonLoader type="button" width="120px" className="project-button-skeleton" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPageSkeleton;
