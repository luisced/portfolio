import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for intersection observer
 * @param options - IntersectionObserver options
 * @returns [ref, isIntersecting] - ref to attach to the element and boolean indicating if element is in viewport
 */
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isIntersecting] as const;
}

export default useIntersectionObserver;
