import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Project } from '../../../types/project';
import './ProjectCard.css';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import TechIcon from '../../../components/common/TechIcon';
import { motion } from 'framer-motion';
import useKeyboard from '../../../hooks/useKeyboard';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { t } = useTranslation();
  // Extract technologies from the project
  const technologies = project.technologies || [];
  const [isFocused, setIsFocused] = useState(false);
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;

  // Handle keyboard navigation for the card
  useKeyboard(
    {
      Enter: () => {
        if (isFocused) {
          window.location.href = `/portfolio/${project.id}`;
        }
      },
    },
    { enabled: isFocused }
  );

  return (
    <motion.article 
      className="project-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={!prefersReducedMotion ? { 
        y: -5,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={!prefersReducedMotion ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {}}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      aria-label={`${project.title} - ${project.role} - ${project.category}`}
    >
      <motion.div 
        className="project-card-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div 
          className="project-image-container"
          whileHover={!prefersReducedMotion ? {
            scale: 1.03,
            transition: { duration: 0.2 }
          } : {}}
        >
          {project.previewImage ? (
            <img 
              src={project.previewImage} 
              alt={`${project.title} preview`} 
              className="project-image"
              loading="lazy"
            />
          ) : (
            <div className="project-image-placeholder">
              <span className="placeholder-text">{project.title.charAt(0)}</span>
            </div>
          )}
        </motion.div>
        
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
          
          <Link 
            to={`/portfolio/${project.id}`} 
            className="see-project-button"
            aria-label={`See details for ${project.title} project`}
          >
            <motion.span
              initial={{ x: 0 }}
              whileHover={!prefersReducedMotion ? { 
                x: 5,
                transition: { 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 10 
                } 
              } : {}}
            >
              {t('portfolio.seeProject')} <FaArrowRight className="arrow-icon" />
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </motion.article>
  );
};

export default ProjectCard;
