import React from 'react';
import { Project } from '../../types/project';
import './ProjectCard.css';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import TechIcon from '../../components/common/TechIcon';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Extract technologies from the project
  const technologies = project.technologies || [];

  return (
    <article className="project-card">
      <div className="project-card-content">
        <div className="project-image-container">
          {project.previewImage ? (
            <img 
              src={project.previewImage} 
              alt={`${project.title} preview`} 
              className="project-image"
            />
          ) : (
            <div className="project-image-placeholder">
              <span className="placeholder-text">{project.title.charAt(0)}</span>
            </div>
          )}
        </div>
        
        <div className="project-info">
          <h3 className="project-title">
            <span className="metal">{project.title}</span>
          </h3>
          <p className="project-role">{project.role}</p>
          <div className="project-category">{project.category}</div>
          <p className="project-description-preview">
            {project.shortDescription || 
              (project.description.length > 150 
                ? `${project.description.substring(0, 150)}...` 
                : project.description)}
          </p>
          
          {technologies && technologies.length > 0 && (
            <div className="project-tech">
              {technologies.slice(0, 3).map((tech, index) => (
                <TechIcon key={index} tech={tech} size="sm" showName={false} />
              ))}
              {technologies.length > 3 && (
                <span className="tech-tag">+{technologies.length - 3}</span>
              )}
            </div>
          )}
          
          <Link to={`/portfolio/${project.id}`} className="see-project-button">
            See Project <FaArrowRight className="arrow-icon" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
