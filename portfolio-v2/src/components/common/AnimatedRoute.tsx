import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface AnimatedRouteProps {
  children: ReactNode;
  /**
   * Whether animations should be disabled (for users who prefer reduced motion)
   * @default false
   */
  disableAnimations?: boolean;
}

/**
 * Wrapper component for animated page transitions
 * Uses Framer Motion to animate page transitions based on route changes
 */
const AnimatedRoute: React.FC<AnimatedRouteProps> = ({ 
  children, 
  disableAnimations = false 
}) => {
  const location = useLocation();
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;
  
  // Disable animations if user prefers reduced motion or if explicitly disabled
  const shouldAnimate = !disableAnimations && !prefersReducedMotion;
  
  // Animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: shouldAnimate ? 20 : 0,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier curve
      }
    },
    exit: {
      opacity: 0,
      y: shouldAnimate ? -20 : 0,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedRoute;
