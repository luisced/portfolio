import React, { useState, useEffect, memo } from 'react';
import Spline from '@splinetool/react-spline';
import './SplineRoom.css';

interface SimpleSplineRoomProps {
  className?: string;
}

/**
 * A simplified Spline component that uses @splinetool/react-spline
 * with responsive detection for mobile behavior.
 */
const SimpleSplineRoom: React.FC<SimpleSplineRoomProps> = ({ className }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    checkMobile();

    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={`spline-wrapper ${className || ''}`}>
      <Spline
        scene="/assets/models/room.splinecode"
        style={{
          width: '100%',
          height: '100%',
          ...(isMobile ? { touchAction: 'none' } : {}),
        }}
      />
    </div>
  );
};

export default memo(SimpleSplineRoom);
