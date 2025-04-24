import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { experiences } from './TimelineData';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Timeline.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Custom hook for timeline animations
const useTimelineAnimations = (containerRef: React.RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Get all timeline items
    const items = gsap.utils.toArray<HTMLElement>(containerRef.current.querySelectorAll('.timeline-item'));
    
    // Get the timeline line
    const timelineLine = containerRef.current.querySelector('.timeline-line');
    
    // Set initial state for the timeline line
    if (timelineLine) {
      gsap.set(timelineLine, { 
        scaleY: 0,
        transformOrigin: 'top center'
      });
    }
    
    // Create animation for the timeline line with bi-directional behavior
    gsap.fromTo(timelineLine, 
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: true,
          // This will make the animation reverse when scrolling back up
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    // Animate each timeline item
    items.forEach((item, i) => {
      const content = item.querySelector('.timeline-content');
      const isEven = i % 2 === 0;
      
      // Set initial state
      gsap.set(content, { 
        x: isEven ? 100 : -100,
        opacity: 0
      });
      
      // Create animation with bi-directional behavior
      gsap.fromTo(content, 
        { 
          x: isEven ? 100 : -100, 
          opacity: 0 
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play reverse play reverse', // play on enter, reverse on leave
            scrub: 0.5 // Smooth animation with slight delay
          }
        }
      );
    });
    
    // Clean up on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [containerRef]);
};

interface TimelineProps {
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({ className }) => {
  const { theme } = useTheme();
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Apply GSAP animations
  useTimelineAnimations(timelineRef);
  
  // Function to format date strings (YYYY-MM) into readable format (e.g., "Jan 2024")
  const formatDate = (ym: string): string => {
    // Check if the input string is valid
    if (!ym || typeof ym !== 'string' || !ym.includes('-')) {
      return ym || 'Date N/A'; // Return original or placeholder if invalid
    }
    
    try {
      // Handle "Present" case
      if (ym === "Present") return ym;
      
      // Split year and month
      const [year, month] = ym.split("-");
      // Create a Date object using UTC to prevent timezone issues
      const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 2));
      // Format the date using the browser's default locale
      return date.toLocaleString('default', { month: 'short', year: 'numeric', timeZone: 'UTC' });
    } catch (e) {
      console.error("Error formatting date:", ym, e);
      return ym;
    }
  };

  // Sort experiences chronologically (most recent first)
  const sortedExperiences = [...experiences].sort((a, b) => {
    // Handle "Present" end dates by giving them a very high value for sorting
    const endA = a.end === "Present" ? '9999-12' : a.end || a.start;
    const endB = b.end === "Present" ? '9999-12' : b.end || b.start;

    // Primary sort by end date (descending - most recent first)
    if (endB !== endA) {
      return endB > endA ? 1 : -1;
    }
    // Secondary sort by start date (descending) if end dates are the same
    return b.start > a.start ? 1 : -1;
  });

  // Update the timeline gradient based on the positions of the items
  const updateTimelineGradient = () => {
    if (!timelineRef.current) return;
    
    const timeline = timelineRef.current;
    const timelineItems = timeline.querySelectorAll('.timeline-item');
    
    if (!timelineItems.length) return;
    
    // Blur effects have been removed from CSS
    
    // Use requestAnimationFrame to wait for the next paint
    requestAnimationFrame(() => {
      const timelineRect = timeline.getBoundingClientRect();
      if (timelineRect.height === 0) {
        // Retry if height is 0
        setTimeout(updateTimelineGradient, 200);
        return;
      }

      let gradientString = 'linear-gradient(to bottom, ';
      const colorStops = [];

      // Add the color of the first item at the very top (0%)
      const firstItemColor = timelineItems[0].querySelector<HTMLElement>('.timeline-content')?.dataset.color;
      if (firstItemColor) {
        colorStops.push(`${firstItemColor} 0%`);
      }

      timelineItems.forEach((item) => {
        const content = item.querySelector<HTMLElement>('.timeline-content');
        if (content) {
          const contentRect = content.getBoundingClientRect();
          // Calculate the vertical position relative to the timeline container's top
          const position = contentRect.top - timelineRect.top + contentRect.height / 2;
          // Calculate the position as a percentage of the timeline container's total height
          const percentage = (position / timeline.scrollHeight) * 100;

          const itemColor = content.dataset.color;
          if (itemColor) {
            // Add color stop at the calculated percentage
            colorStops.push(`${itemColor} ${percentage.toFixed(2)}%`);
          }
        }
      });

      // Add the color of the last item at the very bottom (100%)
      const lastItemContent = timelineItems[timelineItems.length - 1].querySelector<HTMLElement>('.timeline-content');
      const lastItemColor = lastItemContent?.dataset.color;
      
      if (lastItemColor && colorStops.length > 0 && colorStops[colorStops.length - 1].split(' ')[0] !== lastItemColor) {
        colorStops.push(`${lastItemColor} 100%`);
      } else if (lastItemColor && colorStops.length === 0) {
        // If there's only one item, make the gradient from that color to itself
        colorStops.push(`${lastItemColor} 0%`);
        colorStops.push(`${lastItemColor} 100%`);
      }

      gradientString += colorStops.join(', ');
      gradientString += ')';

      // Apply the generated gradient to the timeline line
      const timelineLine = timeline.querySelector('.timeline-line') as HTMLElement;
      if (timelineLine) {
        timelineLine.style.background = gradientString;
      }
      
      // Also set the CSS variable for fallback
      timeline.style.setProperty('--dynamic-timeline-gradient', gradientString);
    });
  };

  // Update gradient after component mounts and when window resizes
  useEffect(() => {
    // Initial update
    updateTimelineGradient();
    
    // Update on window resize
    window.addEventListener('resize', updateTimelineGradient);
    
    // Fallback call in case the initial update doesn't work
    const timeoutId = setTimeout(updateTimelineGradient, 1000);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateTimelineGradient);
      clearTimeout(timeoutId);
    };
  }, []);

  // Update gradient when theme changes
  useEffect(() => {
    updateTimelineGradient();
  }, [theme]);

  return (
    <div className={`timeline ${className || ''}`} ref={timelineRef}>
      <div className="timeline-line"></div>
      {sortedExperiences.map((exp, index) => (
        <div className="timeline-item" key={`${exp.company}-${index}`}>
          <div className="timeline-content" data-color={exp.color || '#29ae80'}>
            <h3>{exp.title}</h3>
            <span className="meta-info">
              📅 {formatDate(exp.start)} – {exp.end === "Present" ? "Present" : formatDate(exp.end)} | 📍 {exp.location}
            </span>
            
            <div className="timeline-badges">
              {exp.badges.map((badge, badgeIndex) => (
                <span className="timeline-badge" key={`${badge}-${badgeIndex}`}>
                  {badge}
                </span>
              ))}
            </div>
            
            <h4>Responsibilities</h4>
            <ul>
              {exp.responsibilities.map((responsibility, respIndex) => (
                <li key={`resp-${index}-${respIndex}`}>{responsibility}</li>
              ))}
            </ul>
          </div>
          
          <div className="timeline-icon-container">
            <div className="timeline-icon">
              <img 
                src={exp.icon} 
                alt={`${exp.company} logo`} 
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
