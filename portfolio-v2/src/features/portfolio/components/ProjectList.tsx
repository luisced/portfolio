import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getProjects } from '../ProjectData';
import ProjectCard from './ProjectCard';
import TechIcon from '../../../components/common/TechIcon';
import { FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useKeyboard from '../../../hooks/useKeyboard';
import './ProjectList.css';

interface ProjectListProps {
  className?: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ className }) => {
  const { t, i18n } = useTranslation();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState(getProjects(i18n.language));
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [focusedFilterIndex, setFocusedFilterIndex] = useState(-1);
  
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const filterToggleRef = useRef<HTMLDivElement>(null);
  const clearFiltersRef = useRef<HTMLButtonElement>(null);
  
  // Get current projects based on language
  const projects = getProjects(i18n.language);
  
  // Extract all unique technologies from projects
  const allTechnologies = React.useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      if (project.technologies) {
        project.technologies.forEach(tech => techSet.add(tech));
      }
    });
    return Array.from(techSet).sort();
  }, []);
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;
  
  // Toggle a filter on/off
  const toggleFilter = (tech: string) => {
    if (selectedFilters.includes(tech)) {
      // Remove the filter if already selected
      setSelectedFilters(selectedFilters.filter(filter => filter !== tech));
    } else {
      // Add the filter
      setSelectedFilters([...selectedFilters, tech]);
    }
  };
  
  // Clear all filters
  const clearFilters = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedFilters([]);
    // Focus the filter toggle after clearing
    filterToggleRef.current?.focus();
  };
  
  // Handle keyboard navigation for filters
  useKeyboard(
    {
      'ArrowRight': () => {
        if (isFilterExpanded && focusedFilterIndex < allTechnologies.length - 1) {
          setFocusedFilterIndex(prev => prev + 1);
          const filterButtons = filterContainerRef.current?.querySelectorAll('.filter-button');
          if (filterButtons && filterButtons[focusedFilterIndex + 1]) {
            (filterButtons[focusedFilterIndex + 1] as HTMLElement).focus();
          }
        }
      },
      'ArrowLeft': () => {
        if (isFilterExpanded && focusedFilterIndex > 0) {
          setFocusedFilterIndex(prev => prev - 1);
          const filterButtons = filterContainerRef.current?.querySelectorAll('.filter-button');
          if (filterButtons && filterButtons[focusedFilterIndex - 1]) {
            (filterButtons[focusedFilterIndex - 1] as HTMLElement).focus();
          }
        }
      },
      'Escape': () => {
        if (isFilterExpanded) {
          setIsFilterExpanded(false);
          filterToggleRef.current?.focus();
        }
      },
      'Space': (e) => {
        if (document.activeElement?.classList.contains('filter-button')) {
          e.preventDefault();
          const tech = document.activeElement.getAttribute('data-tech');
          if (tech) toggleFilter(tech);
        }
      },
      'Enter': () => {
        if (document.activeElement?.classList.contains('filter-button')) {
          const tech = document.activeElement.getAttribute('data-tech');
          if (tech) toggleFilter(tech);
        }
      }
    },
    { enabled: true }
  );
  
  // Update projects when language changes
  useEffect(() => {
    const currentProjects = getProjects(i18n.language);
    setFilteredProjects(
      selectedFilters.length === 0 
        ? currentProjects 
        : currentProjects.filter(project => 
            project.technologies && 
            selectedFilters.some(filter => project.technologies!.includes(filter))
          )
    );
  }, [i18n.language]);
  
  // Filter projects when selectedFilters changes
  useEffect(() => {
    if (selectedFilters.length === 0) {
      // Show all projects if no filters selected
      setFilteredProjects(getProjects(i18n.language));
    } else {
      // Show projects that have ANY of the selected technologies
      setFilteredProjects(
        projects.filter(project => 
          project.technologies && 
          selectedFilters.some(filter => project.technologies!.includes(filter))
        )
      );
    }
  }, [selectedFilters]);
  
  // Reset focused filter index when filter expanded state changes
  useEffect(() => {
    setFocusedFilterIndex(-1);
  }, [isFilterExpanded]);

  return (
    <motion.div 
      className={`project-list ${className || ''}`}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        transition: { duration: 0.5 }
      }}
    >
      <div className="filter-section">
        <div 
          ref={filterToggleRef}
          className="filter-header mobile-toggle"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsFilterExpanded(!isFilterExpanded);
            }
          }}
          tabIndex={0}
          role="button"
          aria-expanded={isFilterExpanded}
          aria-controls="filter-container"
          aria-label="Filter by technology"
        >
          <div className="filter-title-container">
            <h3>{t('portfolio.filterByTech')}</h3>
            <motion.div 
              className="filter-toggle-icon"
              animate={{ rotate: isFilterExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isFilterExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </motion.div>
          </div>
          
          {selectedFilters.length > 0 && (
            <motion.button 
              ref={clearFiltersRef}
              className="clear-filters-button"
              onClick={clearFilters}
              title="Clear all filters"
              whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
              whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
              aria-label={`Clear all ${selectedFilters.length} filters`}
            >
              {t('portfolio.clearFilters')} <FaTimes />
            </motion.button>
          )}
        </div>
        
        <AnimatePresence>
          {isFilterExpanded && (
            <motion.div 
              ref={filterContainerRef}
              id="filter-container"
              className="filter-container expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: 1, 
                height: 'auto',
                transition: { duration: 0.3 }
              }}
              exit={{ 
                opacity: 0, 
                height: 0,
                transition: { duration: 0.2 }
              }}
              role="group"
              aria-label="Technology filters"
            >
              {allTechnologies.map((tech, index) => (
                <motion.button
                  key={tech}
                  className={`filter-button ${selectedFilters.includes(tech) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFilter(tech);
                  }}
                  onFocus={() => setFocusedFilterIndex(index)}
                  title={selectedFilters.includes(tech) ? `Remove ${tech} filter` : `Add ${tech} filter`}
                  whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
                  whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
                  data-tech={tech}
                  aria-pressed={selectedFilters.includes(tech)}
                  aria-label={`${tech} filter ${selectedFilters.includes(tech) ? 'active' : 'inactive'}`}
                >
                  <div className="filter-button-content">
                    <TechIcon tech={tech} size="sm" showName={true} />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <motion.div 
        className="projects-grid"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
        
        {filteredProjects.length === 0 && (
          <motion.div 
            className="no-projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>{t('portfolio.noProjects')}</p>
            <motion.button 
              className="reset-filters-button" 
              onClick={clearFilters}
              whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
              whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
            >
              {t('portfolio.resetFilters')}
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProjectList;
