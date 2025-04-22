import React from 'react';
import { LoadingProps } from '../../types/components';
import './Loading.css';

const Loading: React.FC<LoadingProps> = ({ size = 'medium', className = '' }) => {
  return (
    <div className={`loading-container ${className}`}>
      <div className={`loading-spinner ${size}`}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;
