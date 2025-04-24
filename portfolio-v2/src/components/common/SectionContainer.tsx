import React, { ReactNode } from 'react';
import SectionTitle from './SectionTitle';
import './SectionContainer.css';

interface SectionContainerProps {
  id?: string;
  className?: string;
  title: string;  // The title text to display
  children: ReactNode;  // The content (like AppWindow)
}

const SectionContainer: React.FC<SectionContainerProps> = ({ 
  id, 
  className = '', 
  title,
  children 
}) => {
  return (
    <section id={id} className={`section-container ${className}`}>
      <SectionTitle title={title} />
      {children}
    </section>
  );
};

export default SectionContainer;
