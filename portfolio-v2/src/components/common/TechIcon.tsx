
import React from 'react';
import { getTechIcon } from '../../utils/techIconMap';
import './TechIcon.css';

interface TechIconProps {
  tech: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showName?: boolean;
}

const TechIcon: React.FC<TechIconProps> = ({ 
  tech, 
  size = 'md', 
  className = '',
  showName = true
}) => {
  const icon = getTechIcon(tech);
  
  if (!icon) {
    // Return just the tech name if no icon exists
    return <span className={`tech-name ${className}`}>{tech}</span>;
  }
  
  // Check if the icon is a React component (for react-icons)
  const isReactComponent = typeof icon === 'function';
  
  return (
    <div className={`tech-icon tech-icon-${size} ${className}`} title={tech}>
      {isReactComponent ? (
        // Render React component icon
        React.createElement(icon as React.ComponentType<any>, { 
          className: "react-icon",
          style: { fontSize: size === 'sm' ? 14 : size === 'md' ? 18 : 24 },
          size: size === 'sm' ? 14 : size === 'md' ? 18 : 24
        })
      ) : (
        // Render SVG image icon
        <img src={icon as string} alt={`${tech} icon`} className="tech-icon-img" />
      )}
      {showName && <span className="tech-name">{tech}</span>}
    </div>
  );
};

export default TechIcon;
