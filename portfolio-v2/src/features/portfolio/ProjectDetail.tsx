import React, { useState } from 'react';
import { Project } from '../../types/project';
import './ProjectDetail.css';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Function to handle image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <div className="project-detail-overlay" onClick={onClose}>
      <div className="project-detail-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close">
          &times;
        </button>
        
        <div className="project-detail-header">
          <h2 className="project-detail-title">{project.title}</h2>
          <p className="project-detail-role">{project.role}</p>
          <div className="project-detail-category">{project.category}</div>
        </div>
        
        <div className="project-detail-gallery">
          <div className="gallery-main">
            <img 
              src={project.images[currentImageIndex].src} 
              alt={project.images[currentImageIndex].alt} 
              className="gallery-main-image"
            />
            <button className="gallery-nav prev" onClick={prevImage} aria-label="Previous image">
              &lt;
            </button>
            <button className="gallery-nav next" onClick={nextImage} aria-label="Next image">
              &gt;
            </button>
          </div>
          
          <div className="gallery-thumbnails">
            {project.images.map((image, index) => (
              <div 
                key={index} 
                className={`gallery-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img src={image.src} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="project-detail-info">
          <div className="project-detail-description">
            <h3>Project Description</h3>
            <p>{project.description}</p>
          </div>
          
          <div className="project-detail-tech">
            <h3>Technologies Used</h3>
            <div className="tech-tags">
              {project.technologies?.map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
          
          {(project.url || project.github) && (
            <div className="project-detail-links">
              <h3>Links</h3>
              <div className="link-buttons">
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="link-button">
                    Live Demo
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="link-button github">
                    GitHub Repository
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
