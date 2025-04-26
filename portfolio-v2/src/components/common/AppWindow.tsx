import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
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
  
  // Disable animations if user prefers reduced motion or if explicitly disabled
  const shouldAnimate = !disableAnimations && !prefersReducedMotion;

  return (
    <motion.div 
      id={id} 
      className={`app-window ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }
      }}
      whileHover={shouldAnimate ? {
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        transition: { duration: 0.2 }
      } : {}}
    >
      <motion.div 
        className="header"
        whileHover={shouldAnimate ? {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          transition: { duration: 0.2 }
        } : {}}
      >
        <motion.div 
          className="menu-circle"
          whileHover={shouldAnimate ? { scale: 1.1 } : {}}
          whileTap={shouldAnimate ? { scale: 0.95 } : {}}
        ></motion.div>
        <div className="header-menu"></div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { delay: 0.2 }
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default AppWindow;
