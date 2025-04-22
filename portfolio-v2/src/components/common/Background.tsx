import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { BackgroundProps } from '../../types/components';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import './Background.css';

const Background: React.FC<BackgroundProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const mouseBlobRef = useRef<HTMLDivElement>(null);
  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });
  const [isActive, setIsActive] = useState(false);

  // Only activate background effects when visible
  useEffect(() => {
    if (isVisible && !isActive) {
      setIsActive(true);
    }
  }, [isVisible, isActive]);

  // Only add mouse move listener when background is active
  useEffect(() => {
    if (!isActive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseBlobRef.current) return;
      
      const offsetX = mouseBlobRef.current.offsetWidth / 2;
      const offsetY = mouseBlobRef.current.offsetHeight / 2;
      mouseBlobRef.current.style.transform = `translate(${e.clientX - offsetX}px, ${e.clientY - offsetY}px)`;
    };

    let animationFrameId: number;
    const optimizedMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => handleMouseMove(e));
    };

    document.addEventListener('mousemove', optimizedMouseMove);

    return () => {
      document.removeEventListener('mousemove', optimizedMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive]);

  return (
    <div ref={containerRef} className={`background-wrapper ${className}`} data-theme={theme}>
      {/* Only render blobs when visible for better performance */}
      {isActive && (
        <>
          <div className="blob-1"></div>
          <div className="blob-2"></div>
          <div className="blob-4"></div>
          <div className="blob-5" ref={mouseBlobRef}></div>
          <div className="noise-bg"></div>
        </>
      )}
    </div>
  );
};

export default Background;
