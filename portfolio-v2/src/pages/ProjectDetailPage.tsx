import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../features/portfolio/ProjectData';
import { FaArrowLeft, FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import Background from '../components/common/Background';
import TechIcon from '../components/common/TechIcon';
import './ProjectDetailPage.css';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Find the project with the matching ID
  const project = projects.find(p => p.id === id);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // If project not found, show error message
  if (!project) {
    return (
      <div className="project-not-found">
        <Background />
        <div className="page-container">
          <h2>Project Not Found</h2>
          <p>The project you're looking for doesn't exist.</p>
          <Link to="/portfolio" className="back-link">
            <FaArrowLeft /> Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }
  
  // Extract technologies and features
  const technologies = project.technologies || [];
  const features = project.featuresList || [];
  
  // Function to handle image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <div className="project-detail-page">
      <Background />
      <div className="page-container">
        <Link to="/portfolio" className="back-link">
          <FaArrowLeft /> Back to Portfolio
        </Link>
        
        <h2 className="project-detail-title">
          <span className="metal">{project.title}</span>
        </h2>
        <p className="project-detail-role">{project.role}</p>
        <div className="project-detail-category">{project.category}</div>
        
        <div className="project-detail-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Technologies</span>
              <span className="stat-value">{technologies.length}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Key Features</span>
              <span className="stat-value">{features.length}</span>
            </div>
          </div>
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
        
        <div className="project-detail-description">
          <h3>Project Description</h3>
          <p>{project.description}</p>
        </div>
        
        <div className="project-detail-tech">
          <h3>Technologies Used</h3>
          <div className="tech-tags">
            {technologies.map((tech, index) => (
              <TechIcon key={index} tech={tech} size="md" />
            ))}
          </div>
        </div>
        
        {features.length > 0 && (
          <div className="project-detail-features">
            <h3>Key Features</h3>
            <ul className="features-list">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="project-detail-links">
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="detail-link live-demo">
              <FaExternalLinkAlt /> Live Demo
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="detail-link github">
              <FaGithub /> GitHub Repository
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
