import React from 'react';
import './SectionTitle.css';

interface SectionTitleProps {
  title: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, className = '' }) => {
  return (
    <h2 className={`section-title ${className}`}>
      <span className="code-tag">&lt;/</span>
      {title}
      <span className="code-tag">&gt;</span>
    </h2>
  );
};

export default SectionTitle;
