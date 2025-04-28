import React from 'react';
import { LoadingProps } from '../../types/components';
import SkeletonLoader from './SkeletonLoader';
import './Loading.css';

const Loading: React.FC<LoadingProps> = ({ size = 'medium', className = '' }) => {
  // For page-level loading, show a spinner
  if (size === 'large') {
    return (
      <div className={`loading-container ${className}`}>
        <div className={`loading-spinner ${size}`}></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  
  // For component-level loading, use skeleton loaders
  return (
    <div className={`skeleton-container ${className}`}>
      <SkeletonLoader type="title" width="60%" />
      <SkeletonLoader type="text" count={3} />
      <div className="skeleton-grid">
        <SkeletonLoader type="card" />
        <SkeletonLoader type="card" />
        <SkeletonLoader type="card" />
      </div>
    </div>
  );
};

export default Loading;
