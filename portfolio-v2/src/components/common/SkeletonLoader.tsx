import React from 'react';
import './SkeletonLoader.css';

interface SkeletonProps {
  type: 'text' | 'title' | 'avatar' | 'thumbnail' | 'card' | 'button' | 'circle';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
  style?: React.CSSProperties;
}

const SkeletonLoader: React.FC<SkeletonProps> = ({
  type,
  width,
  height,
  count = 1,
  className = '',
  style = {},
}) => {
  const getTypeClass = () => {
    switch (type) {
      case 'text':
        return 'skeleton-text';
      case 'title':
        return 'skeleton-title';
      case 'avatar':
        return 'skeleton-avatar';
      case 'thumbnail':
        return 'skeleton-thumbnail';
      case 'card':
        return 'skeleton-card';
      case 'button':
        return 'skeleton-button';
      case 'circle':
        return 'skeleton-circle';
      default:
        return 'skeleton-text';
    }
  };

  const customStyle = {
    width: width || '',
    height: height || '',
    ...style,
  };

  const renderSkeleton = () => {
    const elements = [];
    for (let i = 0; i < count; i++) {
      elements.push(
        <div
          key={i}
          className={`skeleton-loader ${getTypeClass()} ${className}`}
          style={customStyle}
          aria-hidden="true"
        />
      );
    }
    return elements;
  };

  return <>{renderSkeleton()}</>;
};

export default SkeletonLoader;
