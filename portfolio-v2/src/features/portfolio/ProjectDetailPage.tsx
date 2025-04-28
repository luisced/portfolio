import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { getProjects } from './ProjectData';
import { FaArrowLeft, FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { BsLightningCharge } from "react-icons/bs";
import { FaCode } from "react-icons/fa6";

import Background from '../../components/common/Background';
import TechIcon from '../../components/common/TechIcon';
import './ProjectDetailPage.css';

const ProjectDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get projects based on current language
  const projects = getProjects(i18n.language);
  
  // Find the project with the matching ID
  const project = projects.find(p => p.id === id);
  
  // Reset state and scroll to top when component or project ID changes
  useEffect(() => {
    // Reset current image index when project changes
    setCurrentImageIndex(0);
    // Scroll to top
    window.scrollTo(0, 0);
  }, [id]);
  
  // If project not found, show error message
  if (!project) {
    return (
      <div className="project-not-found">
        <Background />
        <div className="project-detail-content">
        <h2>{t('portfolio.notFound', 'Project Not Found')}</h2>
        <p>{t('portfolio.notFoundMessage', "The project you're looking for doesn't exist.")}</p>
        <Link to="/portfolio" className="back-link">
          <FaArrowLeft /> {t('portfolio.backToPortfolio', 'Back to Portfolio')}
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
      <div className="project-detail-content">
        <Link to="/portfolio" className="back-link">
          <FaArrowLeft /> {t('portfolio.backToPortfolio', 'Back to Portfolio')}
        </Link>
        
        <h2 className="project-detail-title">
          <span className="metal">{project.title}</span>
        </h2>
        <p className="project-detail-role">{project.role}</p>
        <div className="project-detail-category">{project.category}</div>
        
        <div className="project-detail-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <FaCode />
            </div>
            <div className="stat-info">
              <span className="stat-label">{t('portfolio.technologies')}</span>
              <span className="stat-value">{technologies.length}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
            <BsLightningCharge />

            </div>
            <div className="stat-info">
              <span className="stat-label">{t('portfolio.features', 'Key Features')}</span>
              <span className="stat-value">{features.length}</span>
            </div>
          </div>
        </div>
        
        
        
        <div className="project-detail-description">
          <h3>{t('portfolio.overview')}</h3>
          <p>{project.description}</p>
        </div>
        
        <div className="project-detail-tech">
          <h3>{t('portfolio.technologies')}</h3>
          <div className="tech-tags">
            {technologies.map((tech, index) => (
              <TechIcon key={index} tech={tech} size="md" />
            ))}
          </div>
        </div>
        
        {features.length > 0 && (
          <div className="project-detail-features">
            <h3>{t('portfolio.features', 'Key Features')}</h3>
            <ul className="features-list">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="project-detail-gallery">
          <div className="gallery-main">
            <img 
              src={project.images[currentImageIndex].src} 
              alt={project.images[currentImageIndex].alt} 
              className="gallery-main-image"
              key={`${project.id}-${currentImageIndex}`} // Add key to force re-render
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
        
        <div className="project-detail-links">
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="detail-link live-demo">
              <FaExternalLinkAlt /> {t('portfolio.visitSite')}
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="detail-link github">
              <FaGithub /> {t('portfolio.viewCode')}
            </a>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default ProjectDetailPage;
