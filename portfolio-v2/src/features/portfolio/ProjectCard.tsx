import React, { useState } from 'react';
import { Project } from '../../types/project';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Function to handle image navigation
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };
  
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <div className="project-card" onClick={() => onClick(project)}>
      <div className="project-image-container">
        <img 
          src={project.images[currentImageIndex].src} 
          alt={project.images[currentImageIndex].alt} 
          className="project-image"
        />
        <div className="image-navigation">
          <button className="nav-button prev" onClick={prevImage} aria-label="Previous image">
            &lt;
          </button>
          <div className="image-indicator">
            {project.images.map((_, index) => (
              <span 
                key={index} 
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
              />
            ))}
          </div>
          <button className="nav-button next" onClick={nextImage} aria-label="Next image">
            &gt;
          </button>
        </div>
      </div>
      <div className="project-info">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-role">{project.role}</p>
        <div className="project-category">{project.category}</div>
        <p className="project-description-preview">
          {project.description.length > 120 
            ? `${project.description.substring(0, 120)}...` 
            : project.description}
        </p>
        <div className="project-tech">
          {project.technologies?.map((tech, index) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
