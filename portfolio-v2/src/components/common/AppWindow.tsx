import React, { ReactNode } from 'react';
import './AppWindow.css';

interface AppWindowProps {
  id?: string;
  className?: string;
  children: ReactNode;
  /**
   * Whether animations should be disabled (for users who prefer reduced motion)
   * @default false
   */
  disableAnimations?: boolean;
}

const AppWindow: React.FC<AppWindowProps> = ({ 
  id, 
  className = '', 
  children,
  disableAnimations = false
}) => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;
  
  // Apply animation class only if animations are enabled
  const animationClass = (disableAnimations || prefersReducedMotion) ? 'no-animation' : 'with-animation';

  return (
    <div 
      id={id} 
      className={`app-window ${className} ${animationClass}`}
    >
      <div className="header">
        <div className="menu-circle"></div>
        <div className="header-menu"></div>
      </div>
      <div className="app-window-content">
        {children}
      </div>
    </div>
  );
};

export default AppWindow;
