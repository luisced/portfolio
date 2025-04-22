import React, { Suspense, ComponentType, ReactNode } from 'react';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary';

interface LazyComponentProps {
  component: ComponentType<any>;
  props?: Record<string, any>;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

/**
 * A wrapper component for lazy-loaded components
 * Handles loading state and error boundaries
 */
const LazyComponent: React.FC<LazyComponentProps> = ({ 
  component: Component, 
  props = {}, 
  fallback = <Loading size="small" />,
  errorFallback
}) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default LazyComponent;
