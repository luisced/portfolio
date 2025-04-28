import React from 'react';
import SkeletonLoader from '../../../components/common/SkeletonLoader';
import './BentoGridSkeleton.css';

const BentoGridSkeleton: React.FC = () => {
  return (
    <div className="bento-grid-skeleton">
      {/* Stat Cards - Row 1 */}
      <div className="card-skeleton grid-years-skeleton">
        <SkeletonLoader type="title" width="50%" height="3rem" />
        <SkeletonLoader type="text" width="80%" />
      </div>
      <div className="card-skeleton grid-projects-skeleton">
        <SkeletonLoader type="title" width="50%" height="3rem" />
        <SkeletonLoader type="text" width="80%" />
      </div>
      
      {/* GitHub Calendar Card - Row 1 */}
      <div className="card-skeleton grid-github-skeleton">
        <SkeletonLoader type="circle" width="24px" height="24px" className="corner-icon-skeleton" />
        <SkeletonLoader type="title" width="80%" />
        <SkeletonLoader type="thumbnail" height="150px" className="github-calendar-skeleton" />
      </div>

      {/* Profile Card - Row 2 */}
      <div className="card-skeleton grid-profile-skeleton">
        <div className="profile-header-skeleton">
          <SkeletonLoader type="avatar" width="80px" height="80px" />
          <div>
            <SkeletonLoader type="title" width="120px" />
            <SkeletonLoader type="text" width="100px" />
          </div>
        </div>
        <SkeletonLoader type="text" count={3} className="profile-bio-skeleton" />
        <div className="tags-skeleton">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonLoader key={i} type="button" width="80px" height="28px" />
          ))}
        </div>
        <div className="contact-buttons-skeleton">
          <SkeletonLoader type="button" width="120px" height="40px" />
          <SkeletonLoader type="button" width="120px" height="40px" />
        </div>
      </div>

      {/* Impact Highlights - Row 2 */}
      <div className="card-skeleton grid-impact-skeleton">
        <SkeletonLoader type="circle" width="24px" height="24px" className="corner-icon-skeleton" />
        <SkeletonLoader type="title" width="80%" />
        <div className="list-skeleton">
          {[1, 2, 3].map((i) => (
            <div key={i} className="list-item-skeleton">
              <SkeletonLoader type="circle" width="24px" height="24px" />
              <SkeletonLoader type="text" width="80%" />
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Highlights - Row 2 */}
      <div className="card-skeleton grid-workflow-skeleton">
        <SkeletonLoader type="circle" width="24px" height="24px" className="corner-icon-skeleton" />
        <SkeletonLoader type="title" width="80%" />
        <div className="list-skeleton">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="list-item-skeleton">
              <SkeletonLoader type="circle" width="24px" height="24px" />
              <SkeletonLoader type="text" width="80%" />
            </div>
          ))}
        </div>
      </div>

      {/* Online Presence - Row 3 */}
      <div className="card-skeleton grid-online-skeleton">
        <SkeletonLoader type="circle" width="24px" height="24px" className="corner-icon-skeleton" />
        <SkeletonLoader type="title" width="80%" />
        <div className="list-skeleton">
          {[1, 2, 3].map((i) => (
            <div key={i} className="social-link-skeleton">
              <SkeletonLoader type="circle" width="24px" height="24px" />
              <SkeletonLoader type="text" width="100px" />
            </div>
          ))}
        </div>
      </div>

      {/* Contact - Row 3 */}
      <div className="card-skeleton grid-contact-skeleton">
        <SkeletonLoader type="circle" width="24px" height="24px" className="corner-icon-skeleton" />
        <div className="contact-card-skeleton">
          <SkeletonLoader type="title" width="80%" />
          <SkeletonLoader type="text" count={2} className="contact-text-skeleton" />
          <div className="contact-buttons-skeleton">
            <SkeletonLoader type="button" width="120px" height="40px" />
            <SkeletonLoader type="button" width="120px" height="40px" />
          </div>
        </div>
      </div>
      
      {/* Organizations - Row 3 */}
      <div className="card-skeleton grid-orgs-skeleton">
        <SkeletonLoader type="circle" width="24px" height="24px" className="corner-icon-skeleton" />
        <SkeletonLoader type="title" width="80%" />
        <div className="orgs-skeleton">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonLoader key={i} type="button" width="120px" height="32px" />
          ))}
        </div>
      </div>

      {/* Skills - Row 4 */}
      <div className="card-skeleton grid-skills-skeleton">
        <SkeletonLoader type="circle" width="24px" height="24px" className="corner-icon-skeleton" />
        <SkeletonLoader type="title" width="80%" />
        <div className="skills-grid-skeleton">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skill-group-skeleton">
              <SkeletonLoader type="title" width="100px" />
              <div className="skill-badges-skeleton">
                {[1, 2, 3, 4].map((j) => (
                  <SkeletonLoader key={j} type="button" width="100px" height="28px" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BentoGridSkeleton;
